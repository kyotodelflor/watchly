// import React, { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//     FaBolt,
//     FaChevronLeft,
//     FaChevronRight,
//     FaFilter,
// } from "react-icons/fa6";
// import "../styles/home-recommendations.css";
// import { discoverByType, getPosterUrl } from "../api/tmdb";
// import { getWatchHistory, getWatchlist } from "../ai/storage";
// import { buildUserProfile } from "../ai/userProfile";
// import { recommendMovies } from "../ai/recommender";

// const genreChips = [
//     "All",
//     "Comedy",
//     "Romance",
//     "Sci-Fi",
//     "Drama",
//     "Action",
// ];

// const genreNameToId = {
//     Comedy: 35,
//     Romance: 10749,
//     "Sci-Fi": 878,
//     Drama: 18,
//     Action: 28,
// };

// const HomeRecommendations = () => {
//     const [candidates, setCandidates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeGenre, setActiveGenre] = useState("All");
//     const [slideIndex, setSlideIndex] = useState(0);

//     useEffect(() => {
//         const loadCandidates = async () => {
//             setLoading(true);

//             try {
//                 const [moviesData, tvData] = await Promise.all([
//                     discoverByType({ type: "movie", sortBy: "popularity.desc" }),
//                     discoverByType({ type: "tv", sortBy: "popularity.desc" }),
//                 ]);

//                 const movieResults = (moviesData.results || []).map((item) => ({
//                     ...item,
//                     media_type: "movie",
//                 }));

//                 const tvResults = (tvData.results || []).map((item) => ({
//                     ...item,
//                     media_type: "tv",
//                 }));

//                 setCandidates([...movieResults, ...tvResults]);
//             } catch (error) {
//                 console.error("Failed to load recommendations:", error);
//                 setCandidates([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadCandidates();
//     }, []);

//     const recommended = useMemo(() => {
//         const history = getWatchHistory();
//         const watchlist = getWatchlist();

//         const excludedIds = [
//             ...history.map((item) => String(item.id)),
//             ...watchlist.map((item) => String(item.id)),
//         ];

//         const profile = buildUserProfile(history, watchlist);

//         let results = recommendMovies(candidates, profile, excludedIds);

//         if (activeGenre !== "All") {
//             const genreId = genreNameToId[activeGenre];
//             results = results.filter((item) =>
//                 (item.genre_ids || []).includes(genreId)
//             );
//         }

//         return results;
//     }, [candidates, activeGenre]);

//     const visibleSet = useMemo(() => {
//         if (!recommended.length) return [];

//         const total = recommended.length;
//         const getItem = (index) => recommended[(index + total) % total];

//         return [
//             getItem(slideIndex - 1),
//             getItem(slideIndex),
//             getItem(slideIndex + 1),
//             getItem(slideIndex + 2),
//             getItem(slideIndex + 3),
//             getItem(slideIndex + 4),
//         ];
//     }, [recommended, slideIndex]);

//     const nextSlide = () => {
//         if (!recommended.length) return;
//         setSlideIndex((prev) => (prev + 1) % recommended.length);
//     };

//     const prevSlide = () => {
//         if (!recommended.length) return;
//         setSlideIndex((prev) => (prev - 1 + recommended.length) % recommended.length);
//     };

//     const activeDots = Math.min(4, Math.max(1, recommended.length));
//     const activeDotIndex = recommended.length ? slideIndex % activeDots : 0;

//     if (loading) {
//         return (
//             <section className="home-rec">
//                 <div className="home-rec__container">
//                     <div className="home-rec__heading">
//                         <div className="home-rec__title-wrap">
//                             <FaBolt className="home-rec__icon" />
//                             <div>
//                                 <h2>Recommended For You</h2>
//                                 <p>AI Powered</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="home-rec__loading">Loading recommendations...</div>
//                 </div>
//             </section>
//         );
//     }

//     if (!recommended.length) {
//         return (
//             <section className="home-rec">
//                 <div className="home-rec__container">
//                     <div className="home-rec__heading">
//                         <div className="home-rec__title-wrap">
//                             <FaBolt className="home-rec__icon" />
//                             <div>
//                                 <h2>Recommended For You</h2>
//                                 <p>AI Powered</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="home-rec__loading">
//                         Watch or save a few movies to get personalized recommendations.
//                     </div>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section className="home-rec">
//             <div className="home-rec__glow home-rec__glow--left"></div>
//             <div className="home-rec__glow home-rec__glow--center"></div>
//             <div className="home-rec__glow home-rec__glow--right"></div>

//             <div className="home-rec__container">
//                 <div className="home-rec__heading">
//                     <div className="home-rec__title-wrap">
//                         <FaBolt className="home-rec__icon" />
//                         <div>
//                             <h2>Recommended For You</h2>
//                             <p>AI Powered</p>
//                         </div>
//                     </div>

//                     <div className="home-rec__filters">
//                         <div className="home-rec__chips">
//                             {genreChips.map((chip) => (
//                                 <button
//                                     key={chip}
//                                     type="button"
//                                     className={`home-rec__chip ${activeGenre === chip ? "home-rec__chip--active" : ""
//                                         }`}
//                                     onClick={() => {
//                                         setActiveGenre(chip);
//                                         setSlideIndex(0);
//                                     }}
//                                 >
//                                     {chip}
//                                 </button>
//                             ))}
//                         </div>

//                         <button type="button" className="home-rec__filter-btn">
//                             <span>Filter By Genre</span>
//                             <FaFilter />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="home-rec__slider-wrap">
//                     <button
//                         type="button"
//                         className="home-rec__arrow home-rec__arrow--left"
//                         onClick={prevSlide}
//                     >
//                         <FaChevronLeft />
//                     </button>

//                     <div className="home-rec__slider">
//                         {visibleSet[0] && (
//                             <Link
//                                 to={`/details/${visibleSet[0].media_type}/${visibleSet[0].id}`}
//                                 className="home-rec__card home-rec__card--side"
//                             >
//                                 <img
//                                     src={getPosterUrl(visibleSet[0].poster_path)}
//                                     alt={visibleSet[0].title || visibleSet[0].name}
//                                 />
//                             </Link>
//                         )}

//                         {visibleSet.slice(1, 5).map((movie, index) => (
//                             <Link
//                                 key={`${movie.media_type}-${movie.id}-${index}`}
//                                 to={`/details/${movie.media_type}/${movie.id}`}
//                                 className="home-rec__card home-rec__card--main"
//                             >
//                                 <img
//                                     src={getPosterUrl(movie.poster_path)}
//                                     alt={movie.title || movie.name}
//                                 />

//                                 <div className="home-rec__overlay">
//                                     <h3>{movie.title || movie.name}</h3>
//                                     <span>⭐ {movie.vote_average?.toFixed(1) || "—"}</span>
//                                 </div>
//                             </Link>
//                         ))}

//                         {visibleSet[5] && (
//                             <Link
//                                 to={`/details/${visibleSet[5].media_type}/${visibleSet[5].id}`}
//                                 className="home-rec__card home-rec__card--side"
//                             >
//                                 <img
//                                     src={getPosterUrl(visibleSet[5].poster_path)}
//                                     alt={visibleSet[5].title || visibleSet[5].name}
//                                 />
//                             </Link>
//                         )}
//                     </div>

//                     <button
//                         type="button"
//                         className="home-rec__arrow home-rec__arrow--right"
//                         onClick={nextSlide}
//                     >
//                         <FaChevronRight />
//                     </button>
//                 </div>

//                 <div className="home-rec__bottom">
//                     <div className="home-rec__line"></div>

//                     <div className="home-rec__dots">
//                         {Array.from({ length: activeDots }).map((_, index) => (
//                             <span
//                                 key={index}
//                                 className={`home-rec__dot ${index === activeDotIndex ? "home-rec__dot--active" : ""
//                                     }`}
//                             ></span>
//                         ))}
//                     </div>

//                     <div className="home-rec__line home-rec__line--short"></div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default HomeRecommendations;

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaBolt,
    FaChevronLeft,
    FaChevronRight,
    FaFilter,
} from "react-icons/fa6";
import "../styles/home-recommendations.css";
import { discoverByType, getPosterUrl } from "../api/tmdb";
import { getWatchHistory, getWatchlist } from "../ai/storage";
import { buildUserProfile } from "../ai/userProfile";
import { recommendMovies } from "../ai/recommender";

const genreChips = [
    "All",
    "Comedy",
    "Romance",
    "Sci-Fi",
    "Drama",
    "Action",
];

const genreNameToId = {
    Comedy: 35,
    Romance: 10749,
    "Sci-Fi": 878,
    Drama: 18,
    Action: 28,
};

const normalizeMovie = (item, mediaType) => ({
    ...item,
    media_type: item.media_type || mediaType,
});

const dedupeResults = (items) => {
    const map = new Map();
    items.forEach((item) => {
        const key = `${item.media_type}-${item.id}`;
        if (!map.has(key)) {
            map.set(key, item);
        }
    });
    return [...map.values()];
};

const HomeRecommendations = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeGenre, setActiveGenre] = useState("All");
    const [slideIndex, setSlideIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const nextSlide = () => {
        if (!recommended.length || isAnimating) return;

        setIsAnimating(true);

        setTimeout(() => {
            setSlideIndex((prev) => (prev + 1) % recommended.length);
            setIsAnimating(false);
        }, 200);
    };

    const prevSlide = () => {
        if (!recommended.length || isAnimating) return;

        setIsAnimating(true);

        setTimeout(() => {
            setSlideIndex((prev) => (prev - 1 + recommended.length) % recommended.length);
            setIsAnimating(false);
        }, 200);
    };

    useEffect(() => {
        const loadCandidates = async () => {
            setLoading(true);

            try {
                const history = getWatchHistory();
                const watchlist = getWatchlist();
                const profile = buildUserProfile(history, watchlist);

                const requests = [];

                // Базовые популярные фильмы и сериалы
                requests.push(
                    discoverByType({ type: "movie", sortBy: "popularity.desc", page: 1 }),
                    discoverByType({ type: "tv", sortBy: "popularity.desc", page: 1 }),
                    discoverByType({ type: "movie", sortBy: "vote_average.desc", page: 1 }),
                    discoverByType({ type: "tv", sortBy: "vote_average.desc", page: 1 })
                );

                // Любимые жанры
                profile.favoriteGenres.forEach((genreId) => {
                    requests.push(
                        discoverByType({
                            type: "movie",
                            genre: genreId,
                            sortBy: "vote_average.desc",
                            page: 1,
                        }),
                        discoverByType({
                            type: "movie",
                            genre: genreId,
                            sortBy: "popularity.desc",
                            page: 1,
                        }),
                        discoverByType({
                            type: "tv",
                            genre: genreId,
                            sortBy: "popularity.desc",
                            page: 1,
                        })
                    );
                });

                // Любимые страны
                profile.favoriteCountries.forEach((country) => {
                    requests.push(
                        discoverByType({
                            type: "movie",
                            country,
                            sortBy: "vote_average.desc",
                            page: 1,
                        }),
                        discoverByType({
                            type: "movie",
                            country,
                            sortBy: "popularity.desc",
                            page: 1,
                        }),
                        discoverByType({
                            type: "tv",
                            country,
                            sortBy: "popularity.desc",
                            page: 1,
                        })
                    );
                });

                // Любимые десятилетия
                profile.favoriteDecades.forEach((decade) => {
                    for (let year = decade; year < decade + 10; year += 1) {
                        requests.push(
                            discoverByType({
                                type: "movie",
                                year,
                                sortBy: "vote_average.desc",
                                page: 1,
                            })
                        );
                    }
                });

                const responses = await Promise.all(requests);

                const merged = responses.flatMap((data) => {
                    const items = data.results || [];
                    return items.map((item) => {
                        const mediaType = item.media_type || (item.title ? "movie" : "tv");
                        return normalizeMovie(item, mediaType);
                    });
                });

                setCandidates(dedupeResults(merged));
            } catch (error) {
                console.error("Failed to load recommendations:", error);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        loadCandidates();

        const refresh = () => loadCandidates();

        window.addEventListener("watchlistUpdated", refresh);
        window.addEventListener("watchHistoryUpdated", refresh);
        window.addEventListener("watchlyRatingsUpdated", refresh);

        return () => {
            window.removeEventListener("watchlistUpdated", refresh);
            window.removeEventListener("watchHistoryUpdated", refresh);
            window.removeEventListener("watchlyRatingsUpdated", refresh);
        };
    }, []);

    const recommended = useMemo(() => {
        const history = getWatchHistory();
        const watchlist = getWatchlist();

        const excludedIds = [
            ...history.map((item) => String(item.id)),
            ...watchlist.map((item) => String(item.id)),
        ];

        const profile = buildUserProfile(history, watchlist);

        let results = recommendMovies(candidates, profile, excludedIds);

        if (activeGenre !== "All") {
            const genreId = genreNameToId[activeGenre];
            results = results.filter((item) =>
                (item.genre_ids || []).includes(genreId)
            );
        }

        return results.slice(0, 30);
    }, [candidates, activeGenre]);

    const visibleSet = useMemo(() => {
        if (!recommended.length) return [];

        const total = recommended.length;
        const getItem = (index) => recommended[(index + total) % total];

        return [
            getItem(slideIndex - 1),
            getItem(slideIndex),
            getItem(slideIndex + 1),
            getItem(slideIndex + 2),
            getItem(slideIndex + 3),
            getItem(slideIndex + 4),
        ];
    }, [recommended, slideIndex]);

    // const nextSlide = () => {
    //     if (!recommended.length) return;
    //     setSlideIndex((prev) => (prev + 1) % recommended.length);
    // };

    // const prevSlide = () => {
    //     if (!recommended.length) return;
    //     setSlideIndex((prev) => (prev - 1 + recommended.length) % recommended.length);
    // };

    const activeDots = Math.min(4, Math.max(1, recommended.length));
    const activeDotIndex = recommended.length ? slideIndex % activeDots : 0;

    if (loading) {
        return (
            <section className="home-rec">
                <div className="home-rec__container">
                    <div className="home-rec__heading">
                        <div className="home-rec__title-wrap">
                            <FaBolt className="home-rec__icon" />
                            <div>
                                <h2>Recommended For You</h2>
                                <p>AI Powered</p>
                            </div>
                        </div>
                    </div>

                    <div className="home-rec__loading">Loading recommendations...</div>
                </div>
            </section>
        );
    }

    if (!recommended.length) {
        return (
            <section className="home-rec">
                <div className="home-rec__container">
                    <div className="home-rec__heading">
                        <div className="home-rec__title-wrap">
                            <FaBolt className="home-rec__icon" />
                            <div>
                                <h2>Recommended For You</h2>
                                <p>AI Powered</p>
                            </div>
                        </div>
                    </div>

                    <div className="home-rec__loading">
                        Watch, save and rate a few films to get smarter recommendations.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="home-rec">
            <div className="home-rec__glow home-rec__glow--left"></div>
            <div className="home-rec__glow home-rec__glow--center"></div>
            <div className="home-rec__glow home-rec__glow--right"></div>

            <div className="home-rec__container">
                <div className="home-rec__heading">
                    <div className="home-rec__title-wrap">
                        <FaBolt className="home-rec__icon" />
                        <div>
                            <h2>Recommended For You</h2>
                            <p>AI Powered</p>
                        </div>
                    </div>

                    <div className="home-rec__filters">
                        <div className="home-rec__chips">
                            {genreChips.map((chip) => (
                                <button
                                    key={chip}
                                    type="button"
                                    className={`home-rec__chip ${activeGenre === chip ? "home-rec__chip--active" : ""
                                        }`}
                                    onClick={() => {
                                        setActiveGenre(chip);
                                        setSlideIndex(0);
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        <button type="button" className="home-rec__filter-btn">
                            <span>Filter By Genre</span>
                            <FaFilter />
                        </button>
                    </div>
                </div>

                <div className="home-rec__slider-wrap">
                    <button
                        type="button"
                        className="home-rec__arrow home-rec__arrow--left"
                        onClick={prevSlide}
                    >
                        <FaChevronLeft />
                    </button>

                    <div className={`home-rec__slider ${isAnimating ? "home-rec__slider--animating" : ""}`}>
                        {visibleSet[0] && (
                            <Link
                                to={`/details/${visibleSet[0].media_type}/${visibleSet[0].id}`}
                                className="home-rec__card home-rec__card--side"
                            >
                                <img
                                    src={getPosterUrl(visibleSet[0].poster_path)}
                                    alt={visibleSet[0].title || visibleSet[0].name}
                                />
                            </Link>
                        )}

                        {visibleSet.slice(1, 5).map((movie, index) => (
                            <Link
                                key={`${movie.media_type}-${movie.id}-${index}`}
                                to={`/details/${movie.media_type}/${movie.id}`}
                                className="home-rec__card home-rec__card--main"
                            >
                                {/* <img
                                    src={getPosterUrl(movie.poster_path)}
                                    alt={movie.title || movie.name}
                                /> */}
                                {movie.poster_path ? (
                                    <img
                                        src={getPosterUrl(movie.poster_path)}
                                        alt={movie.title || movie.name}
                                    />
                                ) : (
                                    <div className="poster-fallback">
                                        <div className="poster-fallback__icon">🎬</div>
                                        <p className="poster-fallback__title">
                                            {movie.title || movie.name}
                                        </p>
                                    </div>
                                )}

                                <div className="home-rec__overlay">
                                    <h3>{movie.title || movie.name}</h3>
                                    <span>⭐ {movie.vote_average?.toFixed(1) || "—"}</span>
                                </div>
                            </Link>
                        ))}

                        {visibleSet[5] && (
                            <Link
                                to={`/details/${visibleSet[5].media_type}/${visibleSet[5].id}`}
                                className="home-rec__card home-rec__card--side"
                            >
                                <img
                                    src={getPosterUrl(visibleSet[5].poster_path)}
                                    alt={visibleSet[5].title || visibleSet[5].name}
                                />
                            </Link>
                        )}
                    </div>

                    <button
                        type="button"
                        className="home-rec__arrow home-rec__arrow--right"
                        onClick={nextSlide}
                    >
                        <FaChevronRight />
                    </button>
                </div>

                <div className="home-rec__bottom">
                    <div className="home-rec__line"></div>

                    <div className="home-rec__dots">
                        {Array.from({ length: activeDots }).map((_, index) => (
                            <span
                                key={index}
                                className={`home-rec__dot ${index === activeDotIndex ? "home-rec__dot--active" : ""
                                    }`}
                            ></span>
                        ))}
                    </div>

                    <div className="home-rec__line home-rec__line--short"></div>
                </div>
            </div>
        </section>
    );
};

export default HomeRecommendations;