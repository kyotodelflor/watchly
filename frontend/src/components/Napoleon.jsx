// import React from "react";
// import "../styles/napoleon.css";
// import napoleonBg from "../imgs/napoleonBg.png";
// import {
//     FaPlay,
//     FaPlus,
//     FaInfoCircle,
//     FaStar,
//     FaRegStar,
//     FaRegImage,
// } from "react-icons/fa";

// const Napoleon = () => {
//     return (
//         <section className="napoleon">
//             <img src={napoleonBg} alt="Napoleon" className="napoleon__bg" />

//             <div className="napoleon__overlay napoleon__overlay--dark"></div>
//             <div className="napoleon__overlay napoleon__overlay--left"></div>
//             <div className="napoleon__overlay napoleon__overlay--bottom"></div>
//             <div className="napoleon__overlay napoleon__overlay--blue"></div>

//             <div className="napoleon__container">
//                 <div className="napoleon__content">
//                     <h1 className="napoleon__title">Napoleon</h1>

//                     <div className="napoleon__genres">
//                         <span className="napoleon__genre">History</span>
//                         <span className="napoleon__genre">Drama</span>
//                         <span className="napoleon__genre">Biography</span>
//                     </div>

//                     <div className="napoleon__rating">
//                         <div className="napoleon__stars">
//                             <FaStar />
//                             <FaStar />
//                             <FaStar />
//                             <FaRegStar />
//                             <FaRegStar />
//                         </div>
//                         <span className="napoleon__score">3.5</span>
//                     </div>

//                     <p className="napoleon__description">
//                         An epic that details the chequered rise and fall of French Emperor
//                         Napoleon Bonaparte and his relentless journey to power through the
//                         prism of his addictive, volatile relationship with his wife,
//                         Josephine.
//                     </p>

//                     <div className="napoleon__actions">
//                         <button className="napoleon__btn napoleon__btn--primary">
//                             <span className="napoleon__btn-icon napoleon__btn-icon--play">
//                                 <FaPlay />
//                             </span>
//                             Watch Trailer
//                         </button>

//                         <button className="napoleon__btn napoleon__btn--secondary">
//                             <span className="napoleon__btn-icon">
//                                 <FaPlus />
//                             </span>
//                             Add To Watchlist
//                         </button>

//                         <button className="napoleon__icon-btn">
//                             <FaInfoCircle />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="napoleon__side">
//                     <div className="napoleon__photo-box">
//                         <FaRegImage className="napoleon__photo-icon" />
//                         <span className="napoleon__photo-text">Photos</span>
//                     </div>

//                     <div className="napoleon__info">
//                         <p>Released: 2023</p>
//                         <p>Director: Ridley Scott</p>
//                         <p>Writer: David Scarpa</p>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Napoleon;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import napoleonBg from "../imgs/napoleonBg.png";
import "../styles/napoleon.css";

import {
    FaPlay,
    FaPlus,
    FaInfoCircle,
    FaStar,
    FaRegStar,
    FaCheck,
} from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";

const NAPOLEON_ID = 753342;
const NAPOLEON_TYPE = "movie";

const napoleonData = {
    id: NAPOLEON_ID,
    media_type: NAPOLEON_TYPE,
    title: "Napoleon",
    poster_path: null,
    backdrop_path: null,
    vote_average: 6.3,
    release_date: "2023-11-22",
    genres: [
        { id: 36, name: "History" },
        { id: 18, name: "Drama" },
        { id: 36, name: "Biography" },
    ],
    production_countries: [{ iso_3166_1: "GB", name: "United Kingdom" }],
    original_language: "en",
    overview:
        "An epic that details the chequered rise and fall of French Emperor Napoleon Bonaparte and his relentless journey to power through the prism of his addictive, volatile relationship with his wife, Josephine.",
};

const Napoleon = () => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const syncWatchlistState = () => {
            const saved = JSON.parse(localStorage.getItem("watchlist_items") || "[]");
            const exists = saved.some(
                (item) =>
                    String(item.id) === String(NAPOLEON_ID) &&
                    item.media_type === NAPOLEON_TYPE
            );
            setIsSaved(exists);
        };

        syncWatchlistState();
        window.addEventListener("watchlistUpdated", syncWatchlistState);

        return () => {
            window.removeEventListener("watchlistUpdated", syncWatchlistState);
        };
    }, []);

    const handleWatchlistToggle = () => {
        const saved = JSON.parse(localStorage.getItem("watchlist_items") || "[]");

        const exists = saved.some(
            (item) =>
                String(item.id) === String(NAPOLEON_ID) &&
                item.media_type === NAPOLEON_TYPE
        );

        let updated;

        if (exists) {
            updated = saved.filter(
                (item) =>
                    !(
                        String(item.id) === String(NAPOLEON_ID) &&
                        item.media_type === NAPOLEON_TYPE
                    )
            );
            setIsSaved(false);
        } else {
            updated = [
                ...saved,
                {
                    ...napoleonData,
                    savedAt: new Date().toISOString(),
                },
            ];
            setIsSaved(true);
        }

        localStorage.setItem("watchlist_items", JSON.stringify(updated));
        window.dispatchEvent(new Event("watchlistUpdated"));
    };

    const handleWatchTrailer = () => {
        window.open(
            "https://www.youtube.com/results?search_query=Napoleon+2023+official+trailer",
            "_blank"
        );
    };

    const handleOpenDetails = () => {
        navigate(`/details/${NAPOLEON_TYPE}/${NAPOLEON_ID}`);
    };

    return (
        <section className="napoleon">
            <img src={napoleonBg} alt="Napoleon" className="napoleon__bg" />
            <div className="napoleon__overlay"></div>

            <div className="napoleon__container">
                <div className="napoleon__content">
                    <div className="napoleon__left">
                        <h1 className="napoleon__title">Napoleon</h1>

                        <div className="napoleon__genres">
                            {["History", "Drama", "Biography"].map((genre) => (
                                <span key={genre} className="napoleon__genre">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        <div className="napoleon__rating">
                            <div className="napoleon__stars">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaRegStar />
                            </div>
                            <span className="napoleon__rating-value">4</span>
                        </div>

                        <p className="napoleon__description">
                            An epic that details the chequered rise and fall of French Emperor
                            Napoleon Bonaparte and his relentless journey to power through the
                            prism of his addictive, volatile relationship with his wife,
                            Josephine.
                        </p>

                        <div className="napoleon__actions">
                            <button
                                className="napoleon-btn primary"
                                onClick={handleWatchTrailer}
                            >
                                <span className="napoleon__btn-icon">
                                    <FaPlay />
                                </span>
                                Watch Trailer
                            </button>

                            <button
                                className="napoleon-btn secondary"
                                onClick={handleWatchlistToggle}
                            >
                                <span className="napoleon__btn-icon">
                                    {isSaved ? <FaCheck /> : <FaPlus />}
                                </span>
                                {isSaved ? "Added To Watchlist" : "Add To Watchlist"}
                            </button>

                            <button
                                className="napoleon-btn info"
                                onClick={handleOpenDetails}
                                aria-label="Open details"
                            >
                                <span className="napoleon__btn-icon">
                                    <FaInfoCircle />
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="napoleon__right">
                        <Link
                            to={`/details/${NAPOLEON_TYPE}/${NAPOLEON_ID}/photos`}
                            className="napoleon__photos-card"
                        >
                            <div className="napoleon__photos-icon">
                                <FaRegImage />
                            </div>
                            <span>Photos</span>
                        </Link>

                        <div className="napoleon__credits">
                            <p>Released: 2023</p>
                            <p>Director: Ridley Scott</p>
                            <p>Writer: David Scarpa</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Napoleon;