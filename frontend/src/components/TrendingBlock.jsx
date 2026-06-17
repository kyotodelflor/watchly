// import React from "react";
// import "../styles/trendingblock.css";
// import {
//     FaBolt,
//     FaArrowTrendUp,
//     FaChevronLeft,
//     FaChevronRight,
//     FaFilter,
// } from "react-icons/fa6";

// import poster6 from "../imgs/MoviePosters/alien.png";
// import poster2 from "../imgs/MoviePosters/sinners.png";
// import poster3 from "../imgs/MoviePosters/civilwar.png";
// import poster4 from "../imgs/MoviePosters/pride&prejudice.png";
// import poster5 from "../imgs/MoviePosters/theoutrun.png";
// import poster1 from "../imgs/MoviePosters/tenet.png";

// import trend6 from "../imgs/MoviePosters/hamnet.png";
// import trend2 from "../imgs/MoviePosters/devilprada.png";
// import trend3 from "../imgs/MoviePosters/housemaid.png";
// import trend4 from "../imgs/MoviePosters/strangerthings.png";
// import trend5 from "../imgs/MoviePosters/shawshank.png";
// import trend1 from "../imgs/MoviePosters/wutheringheights.png";

// const recommendedMovies = [
//     poster1,
//     poster2,
//     poster3,
//     poster4,
//     poster5,
//     poster6,
// ];

// const trendingMovies = [
//     trend1,
//     trend2,
//     trend3,
//     trend4,
//     trend5,
//     trend6,
// ];

// const genres = ["Comedy", "Romance", "Sci-Fi", "Drama", "Action"];

// const TrendingBlock = () => {
//     return (
//         <section className="trending-block">
//             <div className="trending-block__glow trending-block__glow--left"></div>
//             <div className="trending-block__glow trending-block__glow--center"></div>
//             <div className="trending-block__glow trending-block__glow--right"></div>

//             <div className="trending-block__container">
//                 <div className="trending-block__top">
//                     <div className="section-heading">
//                         <div className="section-heading__icon">
//                             <FaBolt />
//                         </div>
//                         <div>
//                             <h2>Recommended For You</h2>
//                             <p>AI Powered</p>
//                         </div>
//                     </div>

//                     <div className="genre-filter">
//                         <div className="genre-filter__chips">
//                             {genres.map((genre) => (
//                                 <button key={genre} className="genre-chip">
//                                     {genre}
//                                 </button>
//                             ))}
//                         </div>

//                         <button className="genre-filter__button">
//                             <span>Filter By Genre</span>
//                             <FaFilter />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="movies-row-wrapper">
//                     <button className="slider-arrow slider-arrow--left">
//                         <FaChevronLeft />
//                     </button>

//                     <div className="movies-row">
//                         {recommendedMovies.map((movie, index) => (
//                             <div
//                                 className={`movie-card ${index === 0 || index === recommendedMovies.length - 1 ? "movie-card--side" : ""}`}
//                                 key={index}
//                             >
//                                 <img src={movie} alt={`recommended-${index}`} />
//                             </div>
//                         ))}
//                     </div>

//                     <button className="slider-arrow slider-arrow--right">
//                         <FaChevronRight />
//                     </button>
//                 </div>

//                 <div className="trending-block__divider">
//                     <div className="divider-line"></div>
//                     <span className="divider-dot active"></span>
//                     <span className="divider-dot"></span>
//                     <div className="divider-line short"></div>
//                 </div>

//                 <div className="trending-block__bottom-heading">
//                     <div className="section-heading">
//                         <div className="section-heading__icon">
//                             <FaArrowTrendUp />
//                         </div>
//                         <div>
//                             <h2>Trending Now</h2>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="movies-row-wrapper movies-row-wrapper--bottom">
//                     <button className="slider-arrow slider-arrow--left">
//                         <FaChevronLeft />
//                     </button>

//                     <div className="movies-row">
//                         {trendingMovies.map((movie, index) => (
//                             <div
//                                 className={`movie-card ${index === 0 || index === trendingMovies.length - 1 ? "movie-card--side" : ""}`}
//                                 key={index}
//                             >
//                                 <img src={movie} alt={`trending-${index}`} />
//                             </div>
//                         ))}
//                     </div>

//                     <button className="slider-arrow slider-arrow--right">
//                         <FaChevronRight />
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default TrendingBlock;

import React, { useMemo, useState } from "react";
import "../styles/trendingblock.css";
import {
    FaBolt,
    FaArrowTrendUp,
    FaChevronLeft,
    FaChevronRight,
    FaFilter,
} from "react-icons/fa6";

const genres = ["Comedy", "Romance", "Sci-Fi", "Drama", "Action"];

const recommendedMovies = [
    {
        id: 1,
        img: "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
        alt: "Wonder Woman 1984",
    },
    {
        id: 2,
        img: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        alt: "The Dark Knight",
    },
    {
        id: 3,
        img: "https://www.originalfilmart.com/cdn/shop/products/interstellar_2014_advance_original_film_art_682852f2-23f6-46de-a1db-4029d5b6f0b4_5000x.jpg?v=1574284010",
        alt: "Interstellar",
    },
    {
        id: 4,
        img: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        alt: "The Godfather",
    },
    {
        id: 5,
        img: "https://image.tmdb.org/t/p/original/5N5v0BipcnasK9HACuoCWnFdZmh.jpg",
        alt: "Parasite",
    },
    {
        id: 6,
        img: "https://image.tmdb.org/t/p/w500/7D430eqZj8y3oVkLFfsWXGRcpEG.jpg",
        alt: "Civil War",
    },
    {
        id: 7,
        img: "https://image.tmdb.org/t/p/w500/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg",
        alt: "La La Land",
    },
    {
        id: 8,
        img: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
        alt: "Pride and Prejudice",
    },
    {
        id: 9,
        img: "https://www.prints4u.net/wp-content/uploads/2025/03/The-Outrun-001.jpg",
        alt: "The Outrun",
    },
];

const trendingMovies = [
    {
        id: 1,
        img: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
        alt: "The Lord of the Rings",
    },
    {
        id: 2,
        img: "https://image.tmdb.org/t/p/w500/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg",
        alt: "The Matrix",
    },
    {
        id: 3,
        img: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
        alt: "Spider-Man",
    },
    {
        id: 4,
        img: "https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg",
        alt: "The Shawshank Redemption",
    },
    {
        id: 5,
        img: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        alt: "Fight Club",
    },
    {
        id: 6,
        img: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        alt: "The Devil Wears Prada",
    },
    {
        id: 7,
        img: "https://image.tmdb.org/t/p/w500/2EewmxXe72ogD0EaWM8gqa0ccIw.jpg",
        alt: "Stranger Things",
    },
    {
        id: 8,
        img: "https://image.tmdb.org/t/p/w500/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
        alt: "Sinners",
    },
    {
        id: 9,
        img: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        alt: "The Godfather",
    },
];

const VISIBLE_COUNT = 6;

function MovieSlider({
    title,
    subtitle,
    icon,
    movies,
    withGenres = false,
    showDivider = false,
}) {
    const [startIndex, setStartIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const maxIndex = Math.max(0, movies.length - VISIBLE_COUNT);

    const handlePrev = () => {
        if (startIndex === 0) return;

        setIsAnimating(true);
        setTimeout(() => {
            setStartIndex((prev) => Math.max(prev - 1, 0));
            setIsAnimating(false);
        }, 200);
    };

    const handleNext = () => {
        if (startIndex === maxIndex) return;

        setIsAnimating(true);
        setTimeout(() => {
            setStartIndex((prev) => Math.min(prev + 1, maxIndex));
            setIsAnimating(false);
        }, 200);
    };

    const visibleMovies = useMemo(() => {
        return movies.slice(startIndex, startIndex + VISIBLE_COUNT);
    }, [movies, startIndex]);

    return (
        <div className="slider-section">
            <div className="trending-block__top">
                <div className="section-heading">
                    <div className="section-heading__icon">{icon}</div>
                    <div>
                        <h2>{title}</h2>
                        {subtitle && <p>{subtitle}</p>}
                    </div>
                </div>

                {withGenres && (
                    <div className="genre-filter">
                        <div className="genre-filter__chips">
                            {genres.map((genre) => (
                                <button key={genre} className="genre-chip">
                                    {genre}
                                </button>
                            ))}
                        </div>

                        <button className="genre-filter__button">
                            <span>Filter By Genre</span>
                            <FaFilter />
                        </button>
                    </div>
                )}
            </div>

            <div className="movies-row-wrapper">
                <button
                    className="slider-arrow slider-arrow--left"
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                    type="button"
                >
                    <FaChevronLeft />
                </button>

                <div className={`movies-row ${isAnimating ? "movies-row--animating" : ""}`}>
                    {visibleMovies.map((movie, index) => {
                        const isSide = index === 0 || index === visibleMovies.length - 1;

                        return (
                            <div
                                className={`movie-card ${isSide ? "movie-card--side" : ""}`}
                                key={`${movie.id}-${startIndex}-${index}`}
                            >
                                <img src={movie.img} alt={movie.alt} />
                            </div>
                        );
                    })}
                </div>

                <button
                    className="slider-arrow slider-arrow--right"
                    onClick={handleNext}
                    disabled={startIndex === maxIndex}
                    type="button"
                >
                    <FaChevronRight />
                </button>
            </div>

            {showDivider && (
                <div className="trending-block__divider">
                    <div className="divider-line"></div>

                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            className={`divider-dot ${index === startIndex ? "active" : ""}`}
                            onClick={() => setStartIndex(index)}
                            type="button"
                        />
                    ))}

                    <div className="divider-line short"></div>
                </div>
            )}
        </div>
    );
}

const TrendingBlock = () => {
    return (
        <section className="trending-block">
            <div className="trending-block__glow trending-block__glow--left"></div>
            <div className="trending-block__glow trending-block__glow--center"></div>
            <div className="trending-block__glow trending-block__glow--right"></div>

            <div className="trending-block__container">
                <MovieSlider
                    title="Recommended For You"
                    subtitle="AI Powered"
                    icon={<FaBolt />}
                    movies={recommendedMovies}
                    withGenres={true}
                    showDivider={true}
                />

                <div className="trending-block__bottom-heading">
                    <MovieSlider
                        title="Trending Now"
                        icon={<FaArrowTrendUp />}
                        movies={trendingMovies}
                    />
                </div>
            </div>
        </section>
    );
};

export default TrendingBlock;