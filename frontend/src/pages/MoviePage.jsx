// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "../styles/moviepage.css";
// import {
//     getBackdropUrl,
//     getPosterUrl,
//     getDetailsByType,
// } from "../api/tmdb";
// import {
//     FaPlay,
//     FaRegImage,
//     FaPlus,
//     FaCheck
// } from "react-icons/fa";
// import { getUser } from "../utils/auth";
// import {
//     addToWatchlistApi,
//     removeFromWatchlistApi,
//     checkWatchlistApi,
// } from "../api/watchlistApi";

// import { addToWatchHistory, getWatchlist } from "../ai/storage";
// import { getRating, setRating } from "../ai/ratings";
// import { useMemo } from "react";

// const MoviePage = () => {
//     const { id, type } = useParams();
//     const [movie, setMovie] = useState(null);

//     const [isTrailerOpen, setIsTrailerOpen] = useState(false);
//     const [isSaved, setIsSaved] = useState(false);

//     const [userRating, setUserRating] = useState(0);
//     const [ratingHover, setRatingHover] = useState(0);

//     const [reviewText, setReviewText] = useState("");
//     const [reviews, setReviews] = useState([]);

//     const submitReview = async () => {
//         const user = JSON.parse(localStorage.getItem("watchly_user"));

//         if (!user) {
//             alert("Login first");
//             return;
//         }

//         await fetch("http://localhost:5000/api/reviews", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 user_id: user.id,
//                 movie_id: movie.id,
//                 media_type: type,
//                 rating: userRating,
//                 review: reviewText,
//             }),
//         });

//         setReviewText("");

//         const res = await fetch(`http://localhost:5000/api/reviews/${type}/${id}`);
//         const data = await res.json();
//         setReviews(data);
//     };

//     // const handleWatchlistToggle = () => {
//     //     if (!movie) return;

//     //     const saved = JSON.parse(localStorage.getItem("watchlist_items") || "[]");
//     //     const exists = saved.some(
//     //         (item) => String(item.id) === String(movie.id) && item.media_type === type
//     //     );

//     //     let updated;

//     //     if (exists) {
//     //         updated = saved.filter(
//     //             (item) => !(String(item.id) === String(movie.id) && item.media_type === type)
//     //         );
//     //         setIsSaved(false);
//     //     } else {
//     //         const payload = {
//     //             id: movie.id,
//     //             media_type: type,
//     //             title: movie.title || null,
//     //             name: movie.name || null,
//     //             poster_path: movie.poster_path || null,
//     //             backdrop_path: movie.backdrop_path || null,
//     //             vote_average: movie.vote_average || 0,
//     //             release_date: movie.release_date || null,
//     //             first_air_date: movie.first_air_date || null,
//     //             genres: movie.genres || [],
//     //             production_countries: movie.production_countries || [],
//     //             original_language: movie.original_language || "",
//     //             overview: movie.overview || "",
//     //             savedAt: new Date().toISOString(),
//     //         };

//     //         updated = [...saved, payload];
//     //         setIsSaved(true);
//     //     }

//     //     localStorage.setItem("watchlist_items", JSON.stringify(updated));
//     //     window.dispatchEvent(new Event("watchlistUpdated"));
//     // };

//     const handleWatchlistToggle = async () => {
//         if (!movie) return;

//         const user = getUser();

//         if (!user) {
//             alert("Please login first.");
//             return;
//         }

//         if (isSaved) {
//             await removeFromWatchlistApi(user.id, type, movie.id);
//             setIsSaved(false);
//         } else {
//             await addToWatchlistApi({
//                 user_id: user.id,
//                 movie_id: movie.id,
//                 media_type: type,
//                 title: movie.title || movie.name || "",
//                 poster_path: movie.poster_path || "",
//                 backdrop_path: movie.backdrop_path || "",
//                 vote_average: movie.vote_average || 0,
//                 release_date: movie.release_date || "",
//                 first_air_date: movie.first_air_date || "",
//                 overview: movie.overview || "",
//             });

//             setIsSaved(true);
//         }

//         window.dispatchEvent(new Event("watchlistUpdated"));
//     };

//     useEffect(() => {
//         if (!movie) return;

//         const rating = getRating(movie.id, type);
//         setUserRating(rating);

//         const watchlist = getWatchlist();
//         const exists = watchlist.some(
//             (item) => String(item.id) === String(movie.id) && item.media_type === type
//         );
//         setIsSaved(exists);
//     }, [movie, type]);

//     useEffect(() => {
//         if (!movie) return;

//         addToWatchHistory({
//             id: movie.id,
//             media_type: type,
//             title: movie.title || null,
//             name: movie.name || null,
//             poster_path: movie.poster_path || null,
//             backdrop_path: movie.backdrop_path || null,
//             genres: movie.genres || [],
//             vote_average: movie.vote_average || 0,
//             original_language: movie.original_language || "",
//             production_countries: movie.production_countries || [],
//             release_date: movie.release_date || null,
//             first_air_date: movie.first_air_date || null,
//         });
//     }, [movie, type]);

//     useEffect(() => {
//         if (!movie) return;

//         const saved = JSON.parse(localStorage.getItem("watchlist_items") || "[]");
//         const exists = saved.some(
//             (item) => String(item.id) === String(movie.id) && item.media_type === type
//         );
//         setIsSaved(exists);
//     }, [movie, type]);

//     useEffect(() => {
//         const loadMovie = async () => {
//             const data = await getDetailsByType(id, type);
//             setMovie(data);
//         };

//         loadMovie();
//     }, [id, type]);

//     useEffect(() => {
//         const loadReviews = async () => {
//             const res = await fetch(`http://localhost:5000/api/reviews/${type}/${id}`);
//             const data = await res.json();
//             setReviews(data);
//         };

//         loadReviews();
//     }, [id, type]);

//     if (!movie) return <div>Loading...</div>;

//     const director = movie.credits?.crew?.find(
//         (p) => p.job === "Director" || p.job === "Series Director"
//     );

//     const cast = movie.credits?.cast?.slice(0, 8);

//     const trailer = movie.videos?.results?.find(
//         (v) => v.type === "Trailer" && v.site === "YouTube"
//     );

//     const heroBg = movie.backdrop_path
//         ? getBackdropUrl(movie.backdrop_path)
//         : getPosterUrl(movie.poster_path);

//     const handleRate = (value) => {
//         setUserRating(value);
//         setRating(movie.id, type, value);
//     };

//     return (
//         <main className="movie-page">
//             <section
//                 className="movie-page__hero"
//                 style={{ backgroundImage: `url(${heroBg})` }}
//             >
//                 <div className="movie-page__overlay"></div>

//                 <div className="movie-page__content">
//                     <img
//                         className="movie-page__poster"
//                         src={getPosterUrl(movie.poster_path)}
//                         alt={movie.title || movie.name}
//                     />

//                     <div className="movie-page__info">
//                         <h1>{movie.title || movie.name}</h1>

//                         <div className="movie-page__meta">
//                             <span>{(movie.release_date || movie.first_air_date || "").slice(0, 4)}</span>
//                             <span>⭐ {movie.vote_average?.toFixed(1)}</span>
//                             <span>{movie.runtime || movie.episode_run_time?.[0] || "—"} min</span>
//                         </div>

//                         <div className="movie-page__genres">
//                             {movie.genres?.map((g) => (
//                                 <span key={g.id}>{g.name}</span>
//                             ))}
//                         </div>

//                         <p className="movie-page__overview">{movie.overview}</p>

//                         {/* <div className="movie-page__actions">
//                             {trailer && (
//                                 <button
//                                     className="napoleon-btn primary"
//                                     onClick={() => setIsTrailerOpen(true)}
//                                 >
//                                     <span className="napoleon__btn-icon napoleon__btn-icon--play">
//                                         <FaPlay />
//                                     </span>
//                                     Watch Trailer
//                                 </button>
//                             )}

//                             <button className="napoleon-btn secondary" onClick={handleWatchlistToggle}>
//                                 {isSaved ? "✓ Added To Watchlist" : " + Add To Watchlist"}
//                             </button>

//                             <Link
//                                 to={`/details/${type}/${id}/photos`}
//                                 className="movie-page__media-card"
//                             >
//                                 <div className="movie-page__media-icon"><FaRegImage /></div>
//                                 <span>Photos</span>
//                             </Link>
//                         </div>

//                         <div className="movie-rating-box">
//                             <p className="movie-rating-box__label">Your Rating</p>
//                             <div className="movie-rating-stars">
//                                 {[1, 2, 3, 4, 5].map((star) => (
//                                     <span
//                                         key={star}
//                                         className={`movie-rating-star ${(ratingHover || userRating) >= star ? "movie-rating-star--active" : ""
//                                             }`}
//                                         onClick={() => handleRate(star)}
//                                         onMouseEnter={() => setRatingHover(star)}
//                                         onMouseLeave={() => setRatingHover(0)}
//                                     >
//                                         ★
//                                     </span>
//                                 ))}
//                                 <span className="movie-rating-value">
//                                     {userRating ? `${userRating}/5` : "Rate"}
//                                 </span>
//                             </div>
//                         </div> */}

//                         <div className="movie-page__main">

//                             <div className="movie-page__left">

//                                 <div className="movie-page__actions">
//                                     {trailer && (
//                                         <button
//                                             className="napoleon-btn primary"
//                                             onClick={() => setIsTrailerOpen(true)}
//                                         >
//                                             <span className="napoleon__btn-icon napoleon__btn-icon--play">
//                                                 <FaPlay />
//                                             </span>
//                                             Watch Trailer
//                                         </button>
//                                     )}

//                                     <button
//                                         className="napoleon-btn secondary"
//                                         onClick={handleWatchlistToggle}
//                                     >
//                                         <span className="napoleon__btn-icon">
//                                             {isSaved ? <FaCheck /> : <FaPlus />}
//                                         </span>

//                                         {isSaved ? "Added To Watchlist" : "Add To Watchlist"}
//                                     </button>
//                                 </div>

//                                 <div className="movie-rating-box">
//                                     <p className="movie-rating-box__label">Your Rating</p>

//                                     <div className="movie-rating-stars">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <span
//                                                 key={star}
//                                                 className={`movie-rating-star ${(ratingHover || userRating) >= star
//                                                     ? "movie-rating-star--active"
//                                                     : ""
//                                                     }`}
//                                                 onClick={() => handleRate(star)}
//                                                 onMouseEnter={() => setRatingHover(star)}
//                                                 onMouseLeave={() => setRatingHover(0)}
//                                             >
//                                                 ★
//                                             </span>
//                                         ))}

//                                         <span className="movie-rating-value">
//                                             {userRating ? `${userRating}/5` : "Rate"}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <Link
//                                     to={`/details/${type}/${id}/reviews`}
//                                     className="movie-review-link"
//                                 >
//                                     Rate & Review
//                                 </Link>

//                             </div>

//                             <div className="movie-page__right">
//                                 <Link
//                                     to={`/details/${type}/${id}/photos`}
//                                     className="movie-page__media-card"
//                                 >
//                                     <div className="movie-page__media-icon">
//                                         <FaRegImage />
//                                     </div>
//                                     <span>Photos</span>
//                                 </Link>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section className="movie-page__cast">
//                 <h2>Top Cast</h2>

//                 <div className="cast-row">
//                     {cast?.map((actor) => (
//                         <div key={actor.id} className="cast-card">
//                             <img
//                                 src={
//                                     actor.profile_path
//                                         ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
//                                         : "https://via.placeholder.com/185x278"
//                                 }
//                                 alt={actor.name}
//                             />
//                             <p>{actor.name}</p>
//                             <span>{actor.character}</span>
//                         </div>
//                     ))}
//                 </div>
//             </section>

//             <section className="movie-page__similar">
//                 <h2>Similar Movies</h2>

//                 <div className="similar-row">
//                     {movie.similar?.results?.slice(0, 10).map((m) => (
//                         <Link
//                             to={`/details/${type}/${m.id}`}
//                             key={m.id}
//                             className="similar-card"
//                         >
//                             <div className="poster-hover">
//                                 <img src={getPosterUrl(m.poster_path)} alt={m.title || m.name} />
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             </section>

//             <section className="movie-reviews">
//                 <h2>User Reviews</h2>

//                 {reviews.map((r) => (
//                     <div key={r.id} className="review-card">
//                         <div className="review-header">
//                             <span>⭐ {r.rating}/5</span>
//                             <span>{new Date(r.created_at).toLocaleDateString()}</span>
//                         </div>

//                         <p>{r.review}</p>
//                     </div>
//                 ))}
//             </section>

//             <section className="movie-page__details">
//                 <div className="movie-page__facts">
//                     <div className="fact">
//                         <span>Director</span>
//                         <p>{director?.name || "Unknown"}</p>
//                     </div>

//                     <div className="fact">
//                         <span>Country</span>
//                         <p>{movie.production_countries?.map((c) => c.name).join(", ") || "—"}</p>
//                     </div>

//                     <div className="fact">
//                         <span>Language</span>
//                         <p>{movie.spoken_languages?.map((l) => l.english_name).join(", ") || "—"}</p>
//                     </div>

//                     <div className="fact">
//                         <span>Status</span>
//                         <p>{movie.status}</p>
//                     </div>
//                 </div>
//             </section>

//             {isTrailerOpen && trailer && (
//                 <div className="trailer-modal" onClick={() => setIsTrailerOpen(false)}>
//                     <div
//                         className="trailer-modal__content"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button
//                             className="trailer-close"
//                             onClick={() => setIsTrailerOpen(false)}
//                         >
//                             ✕
//                         </button>

//                         <iframe
//                             src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
//                             title="Trailer"
//                             allow="autoplay"
//                             allowFullScreen
//                         ></iframe>
//                     </div>
//                 </div>
//             )}

//             <div className="movie-bg-glow movie-bg-glow--left"></div>
//             <div className="movie-bg-glow movie-bg-glow--center"></div>
//             <div className="movie-bg-glow movie-bg-glow--right"></div>
//         </main>
//     );
// };

// export default MoviePage;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/moviepage.css";
import {
    getBackdropUrl,
    getPosterUrl,
    getDetailsByType,
} from "../api/tmdb";
import {
    FaPlay,
    FaRegImage,
    FaPlus,
    FaCheck
} from "react-icons/fa";

import { getUser } from "../utils/auth";
import {
    addToWatchlistApi,
    removeFromWatchlistApi,
    checkWatchlistApi,
} from "../api/watchlistApi";

import { addToWatchHistory } from "../ai/storage";
import { getRating, setRating } from "../ai/ratings";

const MoviePage = () => {
    const { id, type } = useParams();

    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [userRating, setUserRating] = useState(0);
    const [ratingHover, setRatingHover] = useState(0);

    useEffect(() => {
        const loadMovie = async () => {
            const data = await getDetailsByType(id, type);
            setMovie(data);
        };

        loadMovie();
    }, [id, type]);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/reviews/${type}/${id}`);
                const data = await res.json();
                setReviews(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Reviews loading error:", error);
            }
        };

        loadReviews();
    }, [id, type]);

    useEffect(() => {
        const checkSaved = async () => {
            if (!movie) return;

            const user = getUser();

            if (!user) {
                setIsSaved(false);
                return;
            }

            try {
                const data = await checkWatchlistApi(user.id, type, movie.id);
                setIsSaved(data.saved);
            } catch (error) {
                console.error("Watchlist check error:", error);
                setIsSaved(false);
            }
        };

        checkSaved();
    }, [movie, type]);

    useEffect(() => {
        if (!movie) return;

        const rating = getRating(movie.id, type);
        setUserRating(rating || 0);
    }, [movie, type]);

    useEffect(() => {
        if (!movie) return;

        addToWatchHistory({
            id: movie.id,
            media_type: type,
            title: movie.title || null,
            name: movie.name || null,
            poster_path: movie.poster_path || null,
            backdrop_path: movie.backdrop_path || null,
            genres: movie.genres || [],
            vote_average: movie.vote_average || 0,
            original_language: movie.original_language || "",
            production_countries: movie.production_countries || [],
            release_date: movie.release_date || null,
            first_air_date: movie.first_air_date || null,
        });
    }, [movie, type]);

    const handleWatchlistToggle = async () => {
        if (!movie) return;

        const user = getUser();

        if (!user) {
            alert("Please login first.");
            return;
        }

        try {
            if (isSaved) {
                await removeFromWatchlistApi(user.id, type, movie.id);
                setIsSaved(false);
            } else {
                await addToWatchlistApi({
                    user_id: user.id,
                    movie_id: movie.id,
                    media_type: type,
                    title: movie.title || movie.name || "",
                    poster_path: movie.poster_path || "",
                    backdrop_path: movie.backdrop_path || "",
                    vote_average: movie.vote_average || 0,
                    release_date: movie.release_date || "",
                    first_air_date: movie.first_air_date || "",
                    overview: movie.overview || "",
                });

                setIsSaved(true);
            }

            window.dispatchEvent(new Event("watchlistUpdated"));
        } catch (error) {
            console.error("Watchlist toggle error:", error);
        }
    };

    const handleRate = (value) => {
        setUserRating(value);
        setRating(movie.id, type, value);
    };

    if (!movie) return <div>Loading...</div>;

    const director = movie.credits?.crew?.find(
        (p) => p.job === "Director" || p.job === "Series Director"
    );

    const cast = movie.credits?.cast?.slice(0, 8);

    const trailer = movie.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    const heroBg = movie.backdrop_path
        ? getBackdropUrl(movie.backdrop_path)
        : getPosterUrl(movie.poster_path);

    return (
        <main className="movie-page">
            <section
                className="movie-page__hero"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="movie-page__overlay"></div>

                <div className="movie-page__content">
                    <img
                        className="movie-page__poster"
                        src={getPosterUrl(movie.poster_path)}
                        alt={movie.title || movie.name}
                    />

                    <div className="movie-page__info">
                        <h1>{movie.title || movie.name}</h1>

                        <div className="movie-page__meta">
                            <span>{(movie.release_date || movie.first_air_date || "").slice(0, 4)}</span>
                            <span>TMDB ⭐ {movie.vote_average?.toFixed(1)}</span>
                            <span>{movie.runtime || movie.episode_run_time?.[0] || "—"} min</span>
                        </div>

                        <div className="movie-page__genres">
                            {movie.genres?.map((g) => (
                                <span key={g.id}>{g.name}</span>
                            ))}
                        </div>

                        <p className="movie-page__overview">{movie.overview}</p>

                        <div className="movie-page__main">
                            <div className="movie-page__left">
                                <div className="movie-page__actions">
                                    {trailer && (
                                        <button
                                            className="napoleon-btn primary"
                                            onClick={() => setIsTrailerOpen(true)}
                                        >
                                            <span className="napoleon__btn-icon napoleon__btn-icon--play">
                                                <FaPlay />
                                            </span>
                                            Watch Trailer
                                        </button>
                                    )}

                                    <button
                                        className="napoleon-btn secondary"
                                        onClick={handleWatchlistToggle}
                                    >
                                        <span className="napoleon__btn-icon">
                                            {isSaved ? <FaCheck /> : <FaPlus />}
                                        </span>

                                        {isSaved ? "Added To Watchlist" : "Add To Watchlist"}
                                    </button>
                                </div>

                                <div className="movie-rating-box">
                                    <p className="movie-rating-box__label">Your Rating</p>

                                    <div className="movie-rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`movie-rating-star ${(ratingHover || userRating) >= star
                                                        ? "movie-rating-star--active"
                                                        : ""
                                                    }`}
                                                onClick={() => handleRate(star)}
                                                onMouseEnter={() => setRatingHover(star)}
                                                onMouseLeave={() => setRatingHover(0)}
                                            >
                                                ★
                                            </span>
                                        ))}

                                        <span className="movie-rating-value">
                                            {userRating ? `${userRating}/5` : "Rate"}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    to={`/details/${type}/${id}/reviews`}
                                    className="movie-review-link"
                                >
                                    Rate & Review
                                </Link>
                            </div>

                            <div className="movie-page__right">
                                <Link
                                    to={`/details/${type}/${id}/photos`}
                                    className="movie-page__media-card"
                                >
                                    <div className="movie-page__media-icon">
                                        <FaRegImage />
                                    </div>
                                    <span>Photos</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="movie-page__cast">
                <h2>Top Cast</h2>

                <div className="cast-row">
                    {cast?.map((actor) => (
                        <div key={actor.id} className="cast-card">
                            <img
                                src={
                                    actor.profile_path
                                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                        : "https://via.placeholder.com/185x278"
                                }
                                alt={actor.name}
                            />
                            <p>{actor.name}</p>
                            <span>{actor.character}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="movie-page__similar">
                <h2>Similar Movies</h2>

                <div className="similar-row">
                    {movie.similar?.results?.slice(0, 10).map((m) => (
                        <Link
                            to={`/details/${type}/${m.id}`}
                            key={m.id}
                            className="similar-card"
                        >
                            <div className="poster-hover">
                                <img src={getPosterUrl(m.poster_path)} alt={m.title || m.name} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="movie-reviews">
                <div className="movie-reviews__header">
                    <h2>User Reviews</h2>

                    <Link
                        to={`/details/${type}/${id}/reviews`}
                        className="movie-review-link"
                    >
                        See all / Write review
                    </Link>
                </div>

                {reviews.length > 0 ? (
                    reviews.slice(0, 3).map((r) => (
                        <div key={r.id} className="review-card">
                            <div className="review-header">
                                <span>⭐ {r.rating}/5</span>
                                <span>{new Date(r.created_at).toLocaleDateString()}</span>
                            </div>

                            <p>{r.review}</p>
                        </div>
                    ))
                ) : (
                    <div className="review-card">
                        <p>No reviews yet. Be the first to review this title.</p>
                    </div>
                )}
            </section>

            <section className="movie-page__details">
                <div className="movie-page__facts">
                    <div className="fact">
                        <span>Director</span>
                        <p>{director?.name || "Unknown"}</p>
                    </div>

                    <div className="fact">
                        <span>Country</span>
                        <p>{movie.production_countries?.map((c) => c.name).join(", ") || "—"}</p>
                    </div>

                    <div className="fact">
                        <span>Language</span>
                        <p>{movie.spoken_languages?.map((l) => l.english_name).join(", ") || "—"}</p>
                    </div>

                    <div className="fact">
                        <span>Status</span>
                        <p>{movie.status}</p>
                    </div>
                </div>
            </section>

            {isTrailerOpen && trailer && (
                <div className="trailer-modal" onClick={() => setIsTrailerOpen(false)}>
                    <div
                        className="trailer-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="trailer-close"
                            onClick={() => setIsTrailerOpen(false)}
                        >
                            ✕
                        </button>

                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                            title="Trailer"
                            allow="autoplay"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <div className="movie-bg-glow movie-bg-glow--left"></div>
            <div className="movie-bg-glow movie-bg-glow--center"></div>
            <div className="movie-bg-glow movie-bg-glow--right"></div>
        </main>
    );
};

export default MoviePage;