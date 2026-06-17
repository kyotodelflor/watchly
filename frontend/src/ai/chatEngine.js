// import { getWatchHistory, getWatchlist } from "./storage";
// import { buildUserProfile } from "./userProfile";
// import { recommendMovies } from "./recommender";
// import {
//     discoverByType,
//     searchByType,
//     getMovieGenres,
//     getTvGenres,
// } from "../api/tmdb";

// function normalize(text = "") {
//     return text.toLowerCase().trim();
// }

// function tokenize(text = "") {
//     return normalize(text)
//         .replace(/[^\p{L}\p{N}\s-]/gu, " ")
//         .split(/\s+/)
//         .filter(Boolean);
// }

// function hasWord(text, word) {
//     return tokenize(text).includes(normalize(word));
// }

// function hasPhrase(text, phrase) {
//     return normalize(text).includes(normalize(phrase));
// }

// function hasAnyWord(text, words = []) {
//     return words.some((word) => hasWord(text, word));
// }

// function hasAnyPhrase(text, phrases = []) {
//     return phrases.some((phrase) => hasPhrase(text, phrase));
// }

// function getTopGenres(profile, genreMap = {}) {
//     return Object.entries(profile.genreWeights || {})
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 3)
//         .map(([id]) => genreMap[id] || `Genre ${id}`);
// }

// function findByTitle(items, query) {
//     const q = normalize(query);
//     return items.find((item) => {
//         const title = item.title || item.name || "";
//         return normalize(title).includes(q);
//     });
// }

// function formatMovieLine(movie) {
//     const title = movie.title || movie.name || "Unknown title";
//     const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
//     const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";
//     return `${title}${year ? ` (${year})` : ""} — ⭐ ${rating}`;
// }

// function explainProfile(profile, genreMap) {
//     const topGenres = getTopGenres(profile, genreMap);
//     const topLanguage = Object.entries(profile.languageWeights || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
//     const topType = Object.entries(profile.typeWeights || {}).sort((a, b) => b[1] - a[1])[0]?.[0];

//     const parts = [];
//     if (topGenres.length) parts.push(`favorite genres: ${topGenres.join(", ")}`);
//     if (topType) parts.push(`preferred type: ${topType === "tv" ? "series" : "movies"}`);
//     if (topLanguage) parts.push(`main language: ${topLanguage}`);

//     return parts.length ? parts.join(" • ") : "not enough data yet";
// }

// function shuffle(array = []) {
//     return [...array].sort(() => Math.random() - 0.5);
// }

// function uniqueById(items = []) {
//     const seen = new Set();
//     return items.filter((item) => {
//         const key = `${item.media_type || "movie"}-${item.id}`;
//         if (seen.has(key)) return false;
//         seen.add(key);
//         return true;
//     });
// }

// function extractYear(text) {
//     const yearMatch = normalize(text).match(/\b(19\d{2}|20\d{2})\b/);
//     return yearMatch ? Number(yearMatch[1]) : undefined;
// }

// function extractType(text) {
//     const t = normalize(text);

//     if (
//         hasAnyPhrase(t, [
//             "tv series",
//             "tv show",
//             "series",
//             "show",
//             "serial",
//             "сериал",
//             "сериалы",
//         ])
//     ) {
//         return "tv";
//     }

//     if (
//         hasAnyPhrase(t, [
//             "movie",
//             "movies",
//             "film",
//             "films",
//             "фильм",
//             "фильмы",
//             "кино",
//         ])
//     ) {
//         return "movie";
//     }

//     return "movie";
// }

// function extractCountry(text) {
//     const t = normalize(text);

//     const countryMap = {
//         us: ["usa", "us", "united states", "america", "american", "сша", "америка", "американский"],
//         gb: ["uk", "britain", "british", "england", "united kingdom", "великобритания", "англия"],
//         kr: ["korea", "south korea", "корея", "южная корея", "корейский"],
//         jp: ["japan", "japanese", "япония", "японский"],
//         fr: ["france", "french", "франция", "французский"],
//         de: ["germany", "german", "германия", "немецкий"],
//         it: ["italy", "italian", "италия", "итальянский"],
//         es: ["spain", "spanish", "испания", "испанский"],
//         kz: ["kazakhstan", "kazakh", "казахстан", "казахский"],
//         ru: ["russia", "russian", "россия", "русский"],
//         tr: ["turkey", "turkish", "турция", "турецкий"],
//         in: ["india", "indian", "индия", "индийский"],
//     };

//     for (const [code, variants] of Object.entries(countryMap)) {
//         if (variants.some((variant) => hasPhrase(t, variant))) {
//             return code.toUpperCase();
//         }
//     }

//     return undefined;
// }

// async function buildGenreDictionary() {
//     const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTvGenres()]);
//     const allGenres = [...(movieGenres.genres || []), ...(tvGenres.genres || [])];

//     const unique = [];
//     const seen = new Set();

//     for (const genre of allGenres) {
//         if (!seen.has(genre.id)) {
//             seen.add(genre.id);
//             unique.push(genre);
//         }
//     }

//     return unique;
// }

// async function extractGenreId(text) {
//     const genres = await buildGenreDictionary();
//     const t = normalize(text);

//     const aliases = {
//         comedy: ["comedy", "funny", "comedy film", "комедия", "смешной"],
//         drama: ["drama", "драма"],
//         action: ["action", "боевик", "экшен"],
//         thriller: ["thriller", "триллер"],
//         horror: ["horror", "ужасы", "страшный"],
//         romance: ["romance", "romantic", "мелодрама", "романтика", "романтический"],
//         animation: ["animation", "animated", "cartoon", "мультфильм", "анимация"],
//         fantasy: ["fantasy", "фэнтези"],
//         sciencefiction: ["sci-fi", "science fiction", "sci fi", "фантастика", "научная фантастика"],
//         crime: ["crime", "криминал"],
//         mystery: ["mystery", "детектив", "mystery movie"],
//         adventure: ["adventure", "приключения"],
//         family: ["family", "семейный"],
//         documentary: ["documentary", "документальный"],
//     };

//     const matchedAliasKey = Object.entries(aliases).find(([, values]) =>
//         values.some((value) => hasPhrase(t, value))
//     )?.[0];

//     if (!matchedAliasKey) return undefined;

//     const genre = genres.find((g) => {
//         const normalizedName = normalize(g.name).replace(/\s+/g, "");
//         return normalizedName === matchedAliasKey;
//     });

//     return genre?.id;
// }

// function getRecentRecommendationIds() {
//     try {
//         return JSON.parse(sessionStorage.getItem("watchly_recent_ai_recs") || "[]");
//     } catch {
//         return [];
//     }
// }

// function saveRecentRecommendationIds(ids = []) {
//     try {
//         sessionStorage.setItem("watchly_recent_ai_recs", JSON.stringify(ids.slice(0, 30)));
//     } catch {
//         // ignore
//     }
// }

// async function fetchDynamicRecommendations({
//     text,
//     profile,
//     excludedIds = [],
// }) {
//     const type = extractType(text);
//     const year = extractYear(text);
//     const country = extractCountry(text);
//     const genre = await extractGenreId(text);

//     const randomPage = Math.floor(Math.random() * 5) + 1;

//     const result = await discoverByType({
//         type,
//         page: randomPage,
//         genre,
//         year,
//         country,
//         rating: 6.5,
//         sortBy: "popularity.desc",
//     });

//     let items = (result.results || []).map((item) => ({
//         ...item,
//         media_type: type,
//     }));

//     const recentIds = getRecentRecommendationIds();

//     items = items.filter(
//         (item) =>
//             !excludedIds.includes(String(item.id)) &&
//             !recentIds.includes(String(item.id))
//     );

//     if (!items.length) {
//         const fallback = await discoverByType({
//             type,
//             page: 1,
//             genre,
//             year,
//             country,
//             sortBy: "vote_average.desc",
//         });

//         items = (fallback.results || [])
//             .map((item) => ({ ...item, media_type: type }))
//             .filter((item) => !excludedIds.includes(String(item.id)));
//     }

//     const ranked = recommendMovies(items, profile, excludedIds);
//     const finalPicks = shuffle(ranked.length ? ranked : items).slice(0, 5);

//     saveRecentRecommendationIds([
//         ...recentIds,
//         ...finalPicks.map((item) => String(item.id)),
//     ]);

//     return finalPicks;
// }

// export async function createChatReply({
//     message,
//     candidates = [],
//     genreMap = {},
// }) {
//     const text = normalize(message);
//     const history = getWatchHistory();
//     const watchlist = getWatchlist();
//     const profile = buildUserProfile(history, watchlist);

//     const excludedIds = [
//         ...history.map((item) => String(item.id)),
//         ...watchlist.map((item) => String(item.id)),
//     ];

//     const rankedLocal = recommendMovies(candidates, profile, excludedIds);

//     if (!text) {
//         return "Type something like: recommend me a comedy from the USA, similar to Interstellar, or show my watch history.";
//     }

//     if (
//         hasAnyWord(text, ["hello", "hey", "привет", "салам"]) ||
//         hasAnyPhrase(text, ["good morning", "good evening"])
//     ) {
//         return "Hi! I’m Watchly AI. Ask me for recommendations, similar titles, your watch history, or your taste profile.";
//     }

//     if (
//         hasAnyPhrase(text, [
//             "show my watch history",
//             "watch history",
//             "my history",
//             "what have i watched",
//             "recently watched",
//             "история просмотров",
//             "что я смотрел",
//             "что я смотрела",
//             "покажи историю",
//         ])
//     ) {
//         if (!history.length) {
//             return "Your watch history is empty right now.";
//         }

//         return `Recently watched:\n\n${history
//             .slice(0, 5)
//             .map(formatMovieLine)
//             .join("\n")}`;
//     }

//     if (
//         hasAnyPhrase(text, [
//             "what are my favorite genres",
//             "favorite genres",
//             "my taste profile",
//             "taste profile",
//             "my profile",
//             "любимые жанры",
//             "мой профиль",
//             "мой вкус",
//         ])
//     ) {
//         return `Your current profile: ${explainProfile(profile, genreMap)}.`;
//     }

//     if (
//         hasAnyPhrase(text, [
//             "watchlist",
//             "my watchlist",
//             "мой список",
//             "список просмотра",
//         ])
//     ) {
//         if (!watchlist.length) {
//             return "Your watchlist is empty right now.";
//         }

//         return `You currently have ${watchlist.length} items in your watchlist.\n\nLatest saved:\n${watchlist
//             .slice(0, 5)
//             .map(formatMovieLine)
//             .join("\n")}`;
//     }

//     if (text.startsWith("similar to ") || text.startsWith("like ")) {
//         const rawTitle = text.replace("similar to ", "").replace("like ", "").trim();

//         const sourceItem =
//             findByTitle(history, rawTitle) ||
//             findByTitle(watchlist, rawTitle) ||
//             findByTitle(candidates, rawTitle);

//         if (!sourceItem) {
//             const searchMovie = await searchByType(rawTitle, 1, "movie");
//             const searchTv = await searchByType(rawTitle, 1, "tv");

//             const searchCandidates = uniqueById([
//                 ...(searchMovie.results || []).map((item) => ({ ...item, media_type: "movie" })),
//                 ...(searchTv.results || []).map((item) => ({ ...item, media_type: "tv" })),
//             ]);

//             const found = searchCandidates[0];

//             if (!found) {
//                 return `I couldn’t find "${rawTitle}" yet. Try another title.`;
//             }

//             const sourceGenres = found.genre_ids || [];
//             const sourceType = found.media_type || "movie";

//             const discover = await discoverByType({
//                 type: sourceType,
//                 genre: sourceGenres[0],
//                 sortBy: "vote_average.desc",
//                 page: 1,
//             });

//             const similar = (discover.results || [])
//                 .map((item) => ({ ...item, media_type: sourceType }))
//                 .filter((item) => String(item.id) !== String(found.id))
//                 .slice(0, 5);

//             if (!similar.length) {
//                 return `I couldn’t find strong matches similar to ${found.title || found.name} yet.`;
//             }

//             return `If you liked ${found.title || found.name}, try:\n\n${similar
//                 .map(formatMovieLine)
//                 .join("\n")}`;
//         }

//         const sourceGenres = sourceItem.genre_ids || sourceItem.genres?.map((g) => g.id) || [];
//         const sourceType = sourceItem.media_type || "movie";

//         const similarPool = rankedLocal.filter((item) => {
//             const itemGenres = item.genre_ids || item.genres?.map((g) => g.id) || [];
//             return (
//                 (item.media_type || "movie") === sourceType &&
//                 itemGenres.some((id) => sourceGenres.includes(id))
//             );
//         });

//         if (similarPool.length) {
//             return `If you liked ${sourceItem.title || sourceItem.name}, try:\n\n${similarPool
//                 .slice(0, 5)
//                 .map(formatMovieLine)
//                 .join("\n")}`;
//         }

//         const discover = await discoverByType({
//             type: sourceType,
//             genre: sourceGenres[0],
//             sortBy: "vote_average.desc",
//             page: 1,
//         });

//         const similar = (discover.results || [])
//             .map((item) => ({ ...item, media_type: sourceType }))
//             .filter((item) => String(item.id) !== String(sourceItem.id))
//             .slice(0, 5);

//         if (!similar.length) {
//             return `I couldn’t find strong matches similar to ${sourceItem.title || sourceItem.name} yet.`;
//         }

//         return `If you liked ${sourceItem.title || sourceItem.name}, try:\n\n${similar
//             .map(formatMovieLine)
//             .join("\n")}`;
//     }

//     const asksForRecommendation =
//         hasAnyPhrase(text, [
//             "recommend me a movie",
//             "recommend a movie",
//             "recommend me something",
//             "suggest a movie",
//             "what should i watch",
//             "посоветуй фильм",
//             "что посмотреть",
//             "порекомендуй фильм",
//         ]) ||
//         hasAnyWord(text, ["recommend", "suggest", "movie", "film", "фильм", "кино"]) ||
//         (await extractGenreId(text)) ||
//         extractCountry(text) ||
//         extractYear(text);

//     if (asksForRecommendation) {
//         const picks = await fetchDynamicRecommendations({
//             text,
//             profile,
//             excludedIds,
//         });

//         if (!picks.length && rankedLocal.length) {
//             return `Here are my recommendations for you:\n\n${rankedLocal
//                 .slice(0, 5)
//                 .map(formatMovieLine)
//                 .join("\n")}`;
//         }

//         if (!picks.length) {
//             return "I couldn’t find a strong match for that request right now. Try something like: comedy from the USA, sci-fi after 2015, or similar to Interstellar.";
//         }

//         const introParts = [];
//         const genreId = await extractGenreId(text);
//         const country = extractCountry(text);
//         const year = extractYear(text);

//         if (genreId && genreMap[String(genreId)]) introParts.push(genreMap[String(genreId)]);
//         if (country) introParts.push(country);
//         if (year) introParts.push(String(year));

//         const intro = introParts.length
//             ? `Here are some ${introParts.join(" / ")} picks for you:`
//             : `Here are my recommendations for you:`;

//         return `${intro}\n\n${picks.map(formatMovieLine).join("\n")}`;
//     }

//     if (hasAnyPhrase(text, ["why this", "why these", "почему", "why"])) {
//         const topGenres = getTopGenres(profile, genreMap);
//         if (!topGenres.length) {
//             return "I don’t have enough behavior data yet. Watch, save, or rate more titles, and I’ll explain recommendations better.";
//         }

//         return `I recommend titles mainly based on your watch history, watchlist, ratings, and strongest genres: ${topGenres.join(", ")}.`;
//     }

//     return "I can help with recommendations, similar titles, your watch history, and your taste profile. Try: recommend me a comedy from the USA, similar to Interstellar, or show my watch history.";
// }

import { getWatchHistory, getWatchlist } from "./storage";
import { buildUserProfile } from "./userProfile";
import { recommendMovies } from "./recommender";
import {
    discoverByType,
    searchByType,
    getMovieGenres,
    getTvGenres,
} from "../api/tmdb";

function normalize(text = "") {
    return text.toLowerCase().trim();
}

function tokenize(text = "") {
    return normalize(text)
        .replace(/[^\p{L}\p{N}\s-]/gu, " ")
        .split(/\s+/)
        .filter(Boolean);
}

function hasWord(text, word) {
    return tokenize(text).includes(normalize(word));
}

function hasPhrase(text, phrase) {
    return normalize(text).includes(normalize(phrase));
}

function hasAnyWord(text, words = []) {
    return words.some((word) => hasWord(text, word));
}

function hasAnyPhrase(text, phrases = []) {
    return phrases.some((phrase) => hasPhrase(text, phrase));
}

function shuffle(array = []) {
    return [...array].sort(() => Math.random() - 0.5);
}

function uniqueById(items = []) {
    const seen = new Set();

    return items.filter((item) => {
        const key = `${item.media_type || "movie"}-${item.id}`;

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
}

function extractYear(text) {
    const match = normalize(text).match(/\b(19\d{2}|20\d{2})\b/);
    return match ? Number(match[1]) : undefined;
}

function extractType(text, preferredContent = "all") {
    const t = normalize(text);

    if (
        hasAnyPhrase(t, [
            "series",
            "tv",
            "show",
            "serial",
            "сериал",
            "сериалы",
        ])
    ) {
        return "tv";
    }

    if (
        hasAnyPhrase(t, [
            "movie",
            "movies",
            "film",
            "films",
            "фильм",
            "кино",
        ])
    ) {
        return "movie";
    }

    if (preferredContent === "tv") return "tv";
    if (preferredContent === "movie") return "movie";

    return "movie";
}

function extractCountry(text, fallback = "") {
    const t = normalize(text);

    const map = {
        US: ["usa", "us", "america", "сша"],
        FR: ["france", "french", "франция"],
        GB: ["uk", "britain", "england", "англия"],
        DE: ["germany", "германия"],
        IT: ["italy", "италия"],
        ES: ["spain", "испания"],
        JP: ["japan", "япония"],
        KR: ["korea", "корея"],
        KZ: ["kazakhstan", "казахстан"],
        RU: ["russia", "россия"],
    };

    for (const [code, arr] of Object.entries(map)) {
        if (arr.some((word) => hasPhrase(t, word))) return code;
    }

    return fallback || undefined;
}

async function buildGenreDictionary() {
    const [movieGenres, tvGenres] = await Promise.all([
        getMovieGenres(),
        getTvGenres(),
    ]);

    const genres = [
        ...(movieGenres.genres || []),
        ...(tvGenres.genres || []),
    ];

    const seen = new Set();

    return genres.filter((g) => {
        if (seen.has(g.id)) return false;
        seen.add(g.id);
        return true;
    });
}

async function extractGenreId(text) {
    const genres = await buildGenreDictionary();
    const t = normalize(text);

    const aliases = {
        comedy: ["comedy", "комедия", "funny"],
        drama: ["drama", "драма"],
        action: ["action", "боевик"],
        thriller: ["thriller", "триллер"],
        horror: ["horror", "ужасы"],
        romance: ["romance", "романтика"],
        fantasy: ["fantasy", "фэнтези"],
        sciencefiction: ["sci-fi", "science fiction", "фантастика"],
        animation: ["animation", "cartoon", "мультфильм"],
        crime: ["crime", "криминал"],
        documentary: ["documentary", "документальный"],
    };

    const matched = Object.entries(aliases).find(([, values]) =>
        values.some((v) => hasPhrase(t, v))
    )?.[0];

    if (!matched) return undefined;

    const genre = genres.find(
        (g) =>
            normalize(g.name).replace(/\s+/g, "") === matched
    );

    return genre?.id;
}

function formatMovieLine(movie) {
    const title = movie.title || movie.name || "Unknown";
    const year = (
        movie.release_date ||
        movie.first_air_date ||
        ""
    ).slice(0, 4);

    const rating = movie.vote_average
        ? movie.vote_average.toFixed(1)
        : "—";

    return `${title}${year ? ` (${year})` : ""} — ⭐ ${rating}`;
}

export async function createChatReply({
    message,
    candidates = [],
    genreMap = {},
    settings = {},
    history = [],
    watchlist = [],
}) {
    const text = normalize(message);

    const language = settings.language || "en";
    const countryPref = settings.country || "";
    const preferredContent =
        settings.preferredContent || "all";

    const realHistory =
        history.length ? history : getWatchHistory();

    const realWatchlist =
        watchlist.length ? watchlist : getWatchlist();

    const profile = buildUserProfile(
        realHistory,
        realWatchlist
    );

    const excludedIds = [
        ...realHistory.map((x) => String(x.id)),
        ...realWatchlist.map((x) => String(x.id)),
    ];

    const rankedLocal = recommendMovies(
        candidates,
        profile,
        excludedIds
    );

    if (!text) {
        return language === "ru"
            ? "Напиши: комедия из США, сериал как Dark, фильм 2024."
            : "Try: comedy from USA, series like Dark, movie 2024.";
    }

    if (
        hasAnyPhrase(text, [
            "show my watch history",
            "watch history",
            "история просмотров",
        ])
    ) {
        if (!realHistory.length) {
            return language === "ru"
                ? "История просмотров пуста."
                : "Your watch history is empty.";
        }

        return (
            (language === "ru"
                ? "Недавно просмотрено:\n\n"
                : "Recently watched:\n\n") +
            realHistory
                .slice(0, 5)
                .map(formatMovieLine)
                .join("\n")
        );
    }

    if (
        hasAnyPhrase(text, [
            "recommend",
            "suggest",
            "посоветуй",
            "что посмотреть",
        ]) ||
        (await extractGenreId(text)) ||
        extractYear(text)
    ) {
        const type = extractType(
            text,
            preferredContent
        );

        const genre = await extractGenreId(text);

        const country = extractCountry(
            text,
            countryPref
        );

        const year = extractYear(text);

        const randomPage =
            Math.floor(Math.random() * 5) + 1;

        const result = await discoverByType({
            type,
            page: randomPage,
            genre,
            year,
            country,
            rating: 6.5,
            sortBy: "popularity.desc",
        });

        let picks = (result.results || [])
            .map((item) => ({
                ...item,
                media_type: type,
            }))
            .filter(
                (item) =>
                    !excludedIds.includes(
                        String(item.id)
                    )
            );

        picks = recommendMovies(
            picks,
            profile,
            excludedIds
        );

        if (!picks.length) {
            picks = rankedLocal;
        }

        picks = shuffle(
            uniqueById(picks)
        ).slice(0, 5);

        if (!picks.length) {
            return language === "ru"
                ? "Не удалось подобрать рекомендации."
                : "Could not find recommendations.";
        }

        return (
            (language === "ru"
                ? "Вот что рекомендую:\n\n"
                : "Here are my picks for you:\n\n") +
            picks
                .map(formatMovieLine)
                .join("\n")
        );
    }

    if (
        hasAnyPhrase(text, [
            "similar to",
            "like ",
            "похожее на",
        ])
    ) {
        const raw = text
            .replace("similar to", "")
            .replace("like", "")
            .replace("похожее на", "")
            .trim();

        const searchMovie = await searchByType(
            raw,
            1,
            "movie"
        );

        const found =
            searchMovie.results?.[0];

        if (!found) {
            return language === "ru"
                ? "Не нашёл такой фильм."
                : "Couldn't find that title.";
        }

        const similar = await discoverByType({
            type: "movie",
            genre: found.genre_ids?.[0],
            sortBy: "vote_average.desc",
        });

        const picks = (similar.results || [])
            .filter(
                (x) => x.id !== found.id
            )
            .slice(0, 5);

        return (
            `${language === "ru" ? "Если понравился" : "If you liked"} ${
                found.title
            }:\n\n` +
            picks
                .map(formatMovieLine)
                .join("\n")
        );
    }

    return language === "ru"
        ? "Я могу рекомендовать фильмы, сериалы и показывать историю просмотров."
        : "I can recommend movies, series and show your watch history.";
}