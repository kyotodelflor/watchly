import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaRobot,
    FaPaperPlane,
    FaTimes,
    FaFilm,
    FaComments,
    FaMagic,
} from "react-icons/fa";
import "../styles/chat-widget.css";
import { discoverByType, getMovieGenres, getTvGenres } from "../api/tmdb";
import { createChatReply } from "../ai/chatEngine";
import { getT } from "../utils/translations";

const getQuickPrompts = (language) => {
    if (language === "ru") {
        return [
            "Посоветуй фильм",
            "Что сейчас популярно?",
            "Покажи историю просмотров",
            "Какие мои любимые жанры?",
        ];
    }

    return [
        "Recommend me a movie",
        "Recommend trending now",
        "Show my watch history",
        "What are my favorite genres?",
    ];
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [t, setT] = useState(getT());

    const getLanguage = () => {
        const settings = JSON.parse(localStorage.getItem("watchly_settings")) || {};
        return settings.language || "en";
    };

    const [messages, setMessages] = useState([
        {
            id: crypto.randomUUID(),
            role: "assistant",
            text:
                getLanguage() === "ru"
                    ? "Привет! Я Watchly AI. Я могу рекомендовать фильмы и сериалы по твоему вкусу, стране и истории просмотров."
                    : "Hi! I’m Watchly AI. I can recommend movies & series based on your taste, country and watch history.",
        },
    ]);

    const [candidates, setCandidates] = useState([]);
    const [genreMap, setGenreMap] = useState({});
    const [loadingReply, setLoadingReply] = useState(false);

    const listRef = useRef(null);

    const language = getLanguage();
    const quickPrompts = getQuickPrompts(language);

    useEffect(() => {
        const syncLanguage = () => {
            setT(getT());
        };

        window.addEventListener("watchlySettingsUpdated", syncLanguage);

        return () => {
            window.removeEventListener("watchlySettingsUpdated", syncLanguage);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const settings = JSON.parse(localStorage.getItem("watchly_settings")) || {};
        const lang = settings.language || "en";

        if (messages.length === 1) {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    text:
                        lang === "ru"
                            ? settings.preferredContent === "tv"
                                ? "Похоже, ты предпочитаешь сериалы. Можешь попросить меня подобрать лучшие сериалы."
                                : settings.preferredContent === "movie"
                                    ? "Похоже, ты предпочитаешь фильмы. Можешь попросить меня подобрать кино."
                                    : "Спроси меня о фильмах, сериалах или рекомендациях."
                            : settings.preferredContent === "tv"
                                ? "Looks like you prefer series. Ask me for top TV recommendations."
                                : settings.preferredContent === "movie"
                                    ? "Looks like you prefer movies. Ask me for cinema recommendations."
                                    : "Ask me anything about movies or TV shows.",
                },
            ]);
        }
    }, [isOpen]);

    useEffect(() => {
        const loadCandidates = async () => {
            try {
                const [moviePopular, tvPopular, movieTop, tvTop, movieGenres, tvGenres] =
                    await Promise.all([
                        discoverByType({ type: "movie", sortBy: "popularity.desc", page: 1 }),
                        discoverByType({ type: "tv", sortBy: "popularity.desc", page: 1 }),
                        discoverByType({ type: "movie", sortBy: "vote_average.desc", page: 1 }),
                        discoverByType({ type: "tv", sortBy: "vote_average.desc", page: 1 }),
                        getMovieGenres(),
                        getTvGenres(),
                    ]);

                const mergedGenres = new Map();

                [...(movieGenres.genres || []), ...(tvGenres.genres || [])].forEach((g) => {
                    mergedGenres.set(String(g.id), g.name);
                });

                const normalized = [
                    ...(moviePopular.results || []).map((item) => ({ ...item, media_type: "movie" })),
                    ...(tvPopular.results || []).map((item) => ({ ...item, media_type: "tv" })),
                    ...(movieTop.results || []).map((item) => ({ ...item, media_type: "movie" })),
                    ...(tvTop.results || []).map((item) => ({ ...item, media_type: "tv" })),
                ];

                const deduped = [];
                const seen = new Set();

                normalized.forEach((item) => {
                    const key = `${item.media_type}-${item.id}`;

                    if (!seen.has(key)) {
                        seen.add(key);
                        deduped.push(item);
                    }
                });

                setCandidates(deduped);
                setGenreMap(Object.fromEntries(mergedGenres.entries()));
            } catch (error) {
                console.error("Failed to load chat candidates:", error);
            }
        };

        loadCandidates();
    }, []);

    useEffect(() => {
        if (!listRef.current) return;

        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages, loadingReply]);

    const sendMessage = async (text) => {
        const content = text.trim();
        if (!content || loadingReply) return;

        const userMessage = {
            id: crypto.randomUUID(),
            role: "user",
            text: content,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoadingReply(true);

        try {
            const settings = JSON.parse(localStorage.getItem("watchly_settings")) || {};
            const history = JSON.parse(localStorage.getItem("watchly_watch_history")) || [];
            const watchlist = JSON.parse(localStorage.getItem("watchly_watchlist")) || [];
            const user = JSON.parse(localStorage.getItem("watchly_user")) || {};

            const reply = await createChatReply({
                message: content,
                candidates,
                genreMap,
                settings,
                history,
                watchlist,
                user,
            });

            const assistantMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                text: reply,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat reply error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    text:
                        getLanguage() === "ru"
                            ? "Извини, я не смог обработать запрос. Попробуй ещё раз."
                            : "Sorry, I couldn’t process that request right now. Please try again.",
                },
            ]);
        } finally {
            setLoadingReply(false);
        }
    };

    const parsedAssistantBlocks = useMemo(() => {
        return messages.map((message) => {
            if (message.role !== "assistant") return { ...message, lines: null };

            return {
                ...message,
                lines: message.text.split("\n"),
            };
        });
    }, [messages]);

    return (
        <div className="chat-widget">
            {isOpen && (
                <div className="chat-widget__panel">
                    <div className="chat-widget__header">
                        <div className="chat-widget__brand">
                            <div className="chat-widget__brand-icon">
                                <FaMagic />
                            </div>

                            <div>
                                <h3>Watchly AI</h3>
                                <p>
                                    {getLanguage() === "ru"
                                        ? "Персональный кино-ассистент"
                                        : "Personal movie assistant"}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="chat-widget__close"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chat-widget__quick">
                        {quickPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                className="chat-widget__quick-btn"
                                onClick={() => sendMessage(prompt)}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <div className="chat-widget__messages" ref={listRef}>
                        {parsedAssistantBlocks.map((message) => (
                            <div
                                key={message.id}
                                className={`chat-widget__message ${message.role === "assistant"
                                    ? "chat-widget__message--assistant"
                                    : "chat-widget__message--user"
                                    }`}
                            >
                                {message.role === "assistant" ? (
                                    <div className="chat-widget__message-body">
                                        {message.lines?.map((line, index) => (
                                            <p key={index}>{line || "\u00A0"}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="chat-widget__message-body">
                                        <p>{message.text}</p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loadingReply && (
                            <div className="chat-widget__message chat-widget__message--assistant">
                                <div className="chat-widget__typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-widget__footer">
                        <div className="chat-widget__input-wrap">
                            <input
                                type="text"
                                value={input}
                                placeholder={
                                    getLanguage() === "ru"
                                        ? "Комедия из США, фантастика 2024..."
                                        : "Comedy from USA, sci-fi 2024..."
                                }
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessage(input);
                                    }
                                }}
                            />

                            <button
                                type="button"
                                className="chat-widget__send"
                                onClick={() => sendMessage(input)}
                            >
                                <FaPaperPlane />
                            </button>
                        </div>

                        <div className="chat-widget__links">
                            <Link to="/browse">
                                <FaFilm />
                                <span>{getLanguage() === "ru" ? "Каталог" : "Browse"}</span>
                            </Link>

                            <Link to="/watchlist">
                                <FaComments />
                                <span>{getLanguage() === "ru" ? "Список" : "Watchlist"}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="button"
                className={`chat-widget__fab ${isOpen ? "chat-widget__fab--open" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <FaRobot />
            </button>
        </div>
    );
};

export default ChatWidget;

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//     FaRobot,
//     FaPaperPlane,
//     FaTimes,
//     FaFilm,
//     FaComments,
//     FaMagic,
// } from "react-icons/fa";
// import "../styles/chat-widget.css";
// import { discoverByType, getMovieGenres, getTvGenres } from "../api/tmdb";
// import { createChatReply } from "../ai/chatEngine";

// const quickPrompts = [
//     "Recommend me a movie",
//     "Recommend trending now",
//     "Show my watch history",
//     "What are my favorite genres?",
// ];

// const ChatWidget = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState([
//         {
//             id: crypto.randomUUID(),
//             role: "assistant",
//             text: "Hi! I’m Watchly AI. I can recommend movies & series based on your taste, country and watch history.",
//         },
//     ]);
//     const [candidates, setCandidates] = useState([]);
//     const [genreMap, setGenreMap] = useState({});
//     const [loadingReply, setLoadingReply] = useState(false);

//     useEffect(() => {
//         if (!isOpen) return;

//         const settings =
//             JSON.parse(localStorage.getItem("watchly_settings")) || {};

//         if (messages.length === 1) {
//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     id: crypto.randomUUID(),
//                     role: "assistant",
//                     text:
//                         settings.preferredContent === "tv"
//                             ? "Looks like you prefer series. Ask me for top TV recommendations."
//                             : settings.preferredContent === "movie"
//                                 ? "Looks like you prefer movies. Ask me for cinema recommendations."
//                                 : "Ask me anything about movies or TV shows.",
//                 },
//             ]);
//         }
//     }, [isOpen]);

//     const listRef = useRef(null);

//     useEffect(() => {
//         const loadCandidates = async () => {
//             try {
//                 const [moviePopular, tvPopular, movieTop, tvTop, movieGenres, tvGenres] =
//                     await Promise.all([
//                         discoverByType({ type: "movie", sortBy: "popularity.desc", page: 1 }),
//                         discoverByType({ type: "tv", sortBy: "popularity.desc", page: 1 }),
//                         discoverByType({ type: "movie", sortBy: "vote_average.desc", page: 1 }),
//                         discoverByType({ type: "tv", sortBy: "vote_average.desc", page: 1 }),
//                         getMovieGenres(),
//                         getTvGenres(),
//                     ]);

//                 const mergedGenres = new Map();
//                 [...(movieGenres.genres || []), ...(tvGenres.genres || [])].forEach((g) => {
//                     mergedGenres.set(String(g.id), g.name);
//                 });

//                 const normalized = [
//                     ...(moviePopular.results || []).map((item) => ({ ...item, media_type: "movie" })),
//                     ...(tvPopular.results || []).map((item) => ({ ...item, media_type: "tv" })),
//                     ...(movieTop.results || []).map((item) => ({ ...item, media_type: "movie" })),
//                     ...(tvTop.results || []).map((item) => ({ ...item, media_type: "tv" })),
//                 ];

//                 const deduped = [];
//                 const seen = new Set();

//                 normalized.forEach((item) => {
//                     const key = `${item.media_type}-${item.id}`;
//                     if (!seen.has(key)) {
//                         seen.add(key);
//                         deduped.push(item);
//                     }
//                 });

//                 setCandidates(deduped);
//                 setGenreMap(Object.fromEntries(mergedGenres.entries()));
//             } catch (error) {
//                 console.error("Failed to load chat candidates:", error);
//             }
//         };

//         loadCandidates();
//     }, []);

//     useEffect(() => {
//         if (!listRef.current) return;
//         listRef.current.scrollTop = listRef.current.scrollHeight;
//     }, [messages, loadingReply]);

//     const sendMessage = async (text) => {
//         const content = text.trim();
//         if (!content || loadingReply) return;

//         const userMessage = {
//             id: crypto.randomUUID(),
//             role: "user",
//             text: content,
//         };

//         setMessages((prev) => [...prev, userMessage]);
//         setInput("");
//         setLoadingReply(true);

//         try {
//             // const reply = await createChatReply({
//             //     message: content,
//             //     candidates,
//             //     genreMap,
//             // });

//             const settings =
//                 JSON.parse(localStorage.getItem("watchly_settings")) || {};

//             const history =
//                 JSON.parse(localStorage.getItem("watchly_watch_history")) || [];

//             const watchlist =
//                 JSON.parse(localStorage.getItem("watchly_watchlist")) || [];

//             const user =
//                 JSON.parse(localStorage.getItem("watchly_user")) || {};

//             const reply = await createChatReply({
//                 message: content,
//                 candidates,
//                 genreMap,
//                 settings,
//                 history,
//                 watchlist,
//                 user,
//             });

//             const assistantMessage = {
//                 id: crypto.randomUUID(),
//                 role: "assistant",
//                 text: reply,
//             };

//             setMessages((prev) => [...prev, assistantMessage]);
//         } catch (error) {
//             console.error("Chat reply error:", error);

//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     id: crypto.randomUUID(),
//                     role: "assistant",
//                     text: "Sorry, I couldn’t process that request right now. Please try again.",
//                 },
//             ]);
//         } finally {
//             setLoadingReply(false);
//         }
//     };

//     const parsedAssistantBlocks = useMemo(() => {
//         return messages.map((message) => {
//             if (message.role !== "assistant") return { ...message, lines: null };
//             return {
//                 ...message,
//                 lines: message.text.split("\n"),
//             };
//         });
//     }, [messages]);

//     return (
//         <div className="chat-widget">
//             {isOpen && (
//                 <div className="chat-widget__panel">
//                     <div className="chat-widget__header">
//                         <div className="chat-widget__brand">
//                             <div className="chat-widget__brand-icon">
//                                 <FaMagic />
//                             </div>
//                             <div>
//                                 <h3>Watchly AI</h3>
//                                 <p>Personal movie assistant</p>
//                             </div>
//                         </div>

//                         <button
//                             type="button"
//                             className="chat-widget__close"
//                             onClick={() => setIsOpen(false)}
//                         >
//                             <FaTimes />
//                         </button>
//                     </div>

//                     <div className="chat-widget__quick">
//                         {quickPrompts.map((prompt) => (
//                             <button
//                                 key={prompt}
//                                 type="button"
//                                 className="chat-widget__quick-btn"
//                                 onClick={() => sendMessage(prompt)}
//                             >
//                                 {prompt}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="chat-widget__messages" ref={listRef}>
//                         {parsedAssistantBlocks.map((message) => (
//                             <div
//                                 key={message.id}
//                                 className={`chat-widget__message ${message.role === "assistant"
//                                     ? "chat-widget__message--assistant"
//                                     : "chat-widget__message--user"
//                                     }`}
//                             >
//                                 {message.role === "assistant" ? (
//                                     <div className="chat-widget__message-body">
//                                         {message.lines?.map((line, index) => (
//                                             <p key={index}>{line || "\u00A0"}</p>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="chat-widget__message-body">
//                                         <p>{message.text}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}

//                         {loadingReply && (
//                             <div className="chat-widget__message chat-widget__message--assistant">
//                                 <div className="chat-widget__typing">
//                                     <span></span>
//                                     <span></span>
//                                     <span></span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div className="chat-widget__footer">
//                         <div className="chat-widget__input-wrap">
//                             <input
//                                 type="text"
//                                 value={input}
//                                 placeholder="Ask Watchly AI..."
//                                 onChange={(e) => setInput(e.target.value)}
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                         sendMessage(input);
//                                     }
//                                 }}
//                             />
//                             <button
//                                 type="button"
//                                 className="chat-widget__send"
//                                 onClick={() => sendMessage(input)}
//                             >
//                                 <FaPaperPlane />
//                             </button>
//                         </div>

//                         <div className="chat-widget__links">
//                             <Link to="/browse">
//                                 <FaFilm />
//                                 <span>Browse</span>
//                             </Link>

//                             <Link to="/watchlist">
//                                 <FaComments />
//                                 <span>Watchlist</span>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <button
//                 type="button"
//                 className={`chat-widget__fab ${isOpen ? "chat-widget__fab--open" : ""}`}
//                 onClick={() => setIsOpen((prev) => !prev)}
//             >
//                 <FaRobot />
//             </button>
//         </div>
//     );
// };

// export default ChatWidget;