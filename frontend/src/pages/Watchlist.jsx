// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { X } from "lucide-react";
// import "../styles/watchlist.css";
// import { getPosterUrl } from "../api/tmdb";
// import { getRating } from "../ai/ratings";

// const movieYears = [
//     "All",
//     "2025",
//     "2024",
//     "2023",
//     "2022",
//     "2021",
//     "2020",
//     "2019",
//     "2018",
//     "2017",
//     "2016",
//     "2015",
//     "2014",
//     "2013",
//     "2012",
//     "2011",
//     "2010",
//     "2009",
//     "2008",
//     "2007",
//     "2006",
//     "2005",
//     "2004",
//     "2003",
//     "2002",
//     "2001",
//     "2000",
//     "1990",
//     "1980",
//     "1970",
// ];

// const countryOptions = [
//     { label: "All", value: "All" },
//     { label: "USA", value: "US" },
//     { label: "UK", value: "GB" },
//     { label: "France", value: "FR" },
//     { label: "Germany", value: "DE" },
//     { label: "Japan", value: "JP" },
//     { label: "South Korea", value: "KR" },
//     { label: "Italy", value: "IT" },
//     { label: "Spain", value: "ES" },
//     { label: "Kazakhstan", value: "KZ" },
//     { label: "Soviet Cinema", value: "SU" },
// ];

// const ratingOptions = [
//     { label: "All", value: "All" },
//     { label: "8+", value: "8" },
//     { label: "7+", value: "7" },
//     { label: "6+", value: "6" },
// ];

// const typeOptions = [
//     { label: "All", value: "all" },
//     { label: "Movie", value: "movie" },
//     { label: "Series", value: "tv" },
// ];

// const directorOptions = [
//     { label: "All", value: "All" },
//     { label: "Christopher Nolan", value: "Christopher Nolan" },
//     { label: "Quentin Tarantino", value: "Quentin Tarantino" },
//     { label: "Steven Spielberg", value: "Steven Spielberg" },
//     { label: "Martin Scorsese", value: "Martin Scorsese" },
//     { label: "Denis Villeneuve", value: "Denis Villeneuve" },
//     { label: "Ridley Scott", value: "Ridley Scott" },
//     { label: "David Benioff & D.B. Weiss", value: "David Benioff & D.B. Weiss" },
// ];

// const titleDirectorMap = {
//     Inception: "Christopher Nolan",
//     Interstellar: "Christopher Nolan",
//     "The Dark Knight": "Christopher Nolan",
//     Dunkirk: "Christopher Nolan",
//     Oppenheimer: "Christopher Nolan",
//     Tenet: "Christopher Nolan",

//     "Pulp Fiction": "Quentin Tarantino",
//     "Kill Bill: Vol. 1": "Quentin Tarantino",
//     "Kill Bill: Vol. 2": "Quentin Tarantino",
//     "Once Upon a Time in Hollywood": "Quentin Tarantino",
//     "Inglourious Basterds": "Quentin Tarantino",
//     "Django Unchained": "Quentin Tarantino",

//     "Schindler's List": "Steven Spielberg",
//     "Jurassic Park": "Steven Spielberg",
//     "Saving Private Ryan": "Steven Spielberg",
//     Jaws: "Steven Spielberg",
//     "Catch Me If You Can": "Steven Spielberg",

//     "The Wolf of Wall Street": "Martin Scorsese",
//     "Shutter Island": "Martin Scorsese",
//     "Taxi Driver": "Martin Scorsese",
//     Goodfellas: "Martin Scorsese",
//     "The Departed": "Martin Scorsese",

//     Dune: "Denis Villeneuve",
//     "Dune: Part Two": "Denis Villeneuve",
//     "Blade Runner 2049": "Denis Villeneuve",
//     Arrival: "Denis Villeneuve",
//     Prisoners: "Denis Villeneuve",
//     Sicario: "Denis Villeneuve",

//     Napoleon: "Ridley Scott",
//     Gladiator: "Ridley Scott",
//     "The Martian": "Ridley Scott",
//     Alien: "Ridley Scott",
//     Prometheus: "Ridley Scott",

//     "Game of Thrones": "David Benioff & D.B. Weiss",
// };

// const toggleButtons = [
//     { key: "isNew", label: "New" },
//     { key: "isRecommended", label: "Recommendations" },
//     { key: "isForeign", label: "Foreign Cinema" },
// ];

// const FilterDropdown = ({
//     label,
//     displayValue,
//     value,
//     options,
//     isOpen,
//     onToggle,
//     onSelect,
//     buttonRef,
//     menuRef,
// }) => {
//     return (
//         <div className={`watchlist-filter ${isOpen ? "watchlist-filter--open" : ""}`}>
//             <button
//                 type="button"
//                 className={`watchlist-filter__button ${value !== "All" && value !== "all" ? "watchlist-filter__button--active" : ""
//                     }`}
//                 onClick={onToggle}
//                 ref={buttonRef}
//             >
//                 <span>{displayValue}</span>
//                 <span className="watchlist-filter__arrow">▾</span>
//             </button>

//             {isOpen && (
//                 <div className="watchlist-filter__menu" ref={menuRef}>
//                     {options.map((option) => {
//                         const optionValue = typeof option === "object" ? option.value : option;
//                         const optionLabel = typeof option === "object" ? option.label : option;

//                         return (
//                             <button
//                                 key={optionValue}
//                                 type="button"
//                                 className={`watchlist-filter__option ${String(value) === String(optionValue)
//                                     ? "watchlist-filter__option--selected"
//                                     : ""
//                                     }`}
//                                 onClick={() => onSelect(optionValue)}
//                             >
//                                 {optionLabel}
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// const Watchlist = () => {
//     const [items, setItems] = useState([]);
//     const [openDropdown, setOpenDropdown] = useState(null);

//     const [filters, setFilters] = useState({
//         type: "all",
//         genre: "All",
//         year: "All",
//         country: "All",
//         rating: "All",
//         director: "All",
//         isNew: false,
//         isRecommended: false,
//         isForeign: false,
//     });

//     const refs = {
//         type: { button: useRef(null), menu: useRef(null) },
//         genre: { button: useRef(null), menu: useRef(null) },
//         year: { button: useRef(null), menu: useRef(null) },
//         country: { button: useRef(null), menu: useRef(null) },
//         rating: { button: useRef(null), menu: useRef(null) },
//         director: { button: useRef(null), menu: useRef(null) },
//     };

//     useEffect(() => {
//         const loadWatchlist = () => {
//             const saved = JSON.parse(localStorage.getItem("watchlist_items") || "[]");
//             setItems(saved);
//         };

//         loadWatchlist();
//         window.addEventListener("watchlistUpdated", loadWatchlist);

//         return () => {
//             window.removeEventListener("watchlistUpdated", loadWatchlist);
//         };
//     }, []);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (!openDropdown) return;

//             const current = refs[openDropdown];
//             const clickedButton = current?.button?.current?.contains(event.target);
//             const clickedMenu = current?.menu?.current?.contains(event.target);

//             if (!clickedButton && !clickedMenu) {
//                 setOpenDropdown(null);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [openDropdown]);

//     const uniqueGenres = useMemo(() => {
//         const map = new Map();
//         items.forEach((item) => {
//             (item.genres || []).forEach((genre) => {
//                 map.set(genre.id, genre.name);
//             });
//         });

//         return [{ id: "All", name: "All" }].concat(
//             [...map.entries()].map(([id, name]) => ({ id, name }))
//         );
//     }, [items]);

//     const filteredItems = useMemo(() => {
//         let result = [...items];

//         if (filters.type !== "all") {
//             result = result.filter((item) => item.media_type === filters.type);
//         }

//         if (filters.genre !== "All") {
//             result = result.filter((item) =>
//                 (item.genres || []).some((genre) => String(genre.id) === String(filters.genre))
//             );
//         }

//         if (filters.year !== "All") {
//             result = result.filter((item) => {
//                 const year =
//                     item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
//                 return year === filters.year;
//             });
//         }

//         if (filters.country === "KZ") {
//             result = result.filter((item) =>
//                 (item.production_countries || []).some(
//                     (country) => country.iso_3166_1 === "KZ"
//                 )
//             );
//         } else if (filters.country === "SU") {
//             result = result.filter((item) => {
//                 const year =
//                     item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);

//                 const countries = (item.production_countries || []).map(
//                     (country) => country.iso_3166_1
//                 );

//                 return (
//                     year &&
//                     Number(year) >= 1922 &&
//                     Number(year) <= 1991 &&
//                     (
//                         countries.includes("RU") ||
//                         countries.includes("UA") ||
//                         countries.includes("BY") ||
//                         countries.includes("KZ") ||
//                         countries.includes("AM") ||
//                         countries.includes("GE") ||
//                         countries.includes("UZ") ||
//                         countries.includes("KG") ||
//                         countries.includes("TJ") ||
//                         countries.includes("TM") ||
//                         countries.includes("AZ") ||
//                         countries.includes("MD") ||
//                         countries.includes("LT") ||
//                         countries.includes("LV") ||
//                         countries.includes("EE")
//                     )
//                 );
//             });
//         } else if (filters.country !== "All") {
//             result = result.filter((item) =>
//                 (item.production_countries || []).some(
//                     (country) => country.iso_3166_1 === filters.country
//                 )
//             );
//         }

//         if (filters.rating !== "All") {
//             result = result.filter((item) => Number(item.vote_average) >= Number(filters.rating));
//         }

//         if (filters.director !== "All") {
//             result = result.filter((item) => {
//                 const title = item.title || item.name || "";
//                 return titleDirectorMap[title] === filters.director;
//             });
//         }

//         if (filters.isNew) {
//             result = result.filter((item) => {
//                 const year =
//                     item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
//                 return year === "2024" || year === "2025";
//             });
//         }

//         if (filters.isRecommended) {
//             result = result.filter((item) => Number(item.vote_average) >= 7.5);
//         }

//         if (filters.isForeign) {
//             result = result.filter((item) => item.original_language !== "en");
//         }

//         return result;
//     }, [items, filters]);

//     const removeFromWatchlist = (id, mediaType) => {
//         const updated = items.filter(
//             (item) => !(String(item.id) === String(id) && item.media_type === mediaType)
//         );

//         localStorage.setItem("watchlist_items", JSON.stringify(updated));
//         setItems(updated);
//         window.dispatchEvent(new Event("watchlistUpdated"));
//     };

//     const handleDropdownSelect = (key, value) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//         setOpenDropdown(null);
//     };

//     const toggleTagFilter = (key) => {
//         setFilters((prev) => ({
//             ...prev,
//             [key]: !prev[key],
//         }));
//     };

//     const getGenreLabel = () => {
//         if (filters.genre === "All") return "Genre";
//         const found = uniqueGenres.find((g) => String(g.id) === String(filters.genre));
//         return found ? found.name : "Genre";
//     };

//     const getCountryLabel = () => {
//         if (filters.country === "All") return "Country";
//         const found = countryOptions.find((c) => c.value === filters.country);
//         return found ? found.label : "Country";
//     };

//     const getRatingLabel = () => {
//         return filters.rating === "All" ? "High Rating" : `${filters.rating}+`;
//     };

//     const getYearLabel = () => {
//         return filters.year === "All" ? "Year" : filters.year;
//     };

//     const getTypeLabel = () => {
//         if (filters.type === "all") return "Type Of Content";
//         const found = typeOptions.find((item) => item.value === filters.type);
//         return found ? found.label : "Type Of Content";
//     };

//     const getDirectorLabel = () => {
//         return filters.director === "All" ? "Director" : filters.director;
//     };

//     return (
//         <main className="watchlist-page">
//             <div className="watchlist-page__container">
//                 <section className="watchlist-header">
//                     <div>
//                         <p className="watchlist-header__eyebrow">My List</p>
//                         <h1>Watchlist</h1>
//                         <p className="watchlist-header__subtitle">
//                             All saved movies and series in one place.
//                         </p>
//                     </div>

//                     <div className="watchlist-header__count">
//                         {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
//                     </div>
//                 </section>

//                 <section className="watchlist-filters">
//                     <div className="watchlist-filters__row">
//                         <FilterDropdown
//                             label="Type Of Content"
//                             displayValue={getTypeLabel()}
//                             value={filters.type}
//                             options={typeOptions}
//                             isOpen={openDropdown === "type"}
//                             onToggle={() =>
//                                 setOpenDropdown((prev) => (prev === "type" ? null : "type"))
//                             }
//                             onSelect={(value) => handleDropdownSelect("type", value)}
//                             buttonRef={refs.type.button}
//                             menuRef={refs.type.menu}
//                         />

//                         <FilterDropdown
//                             label="Genre"
//                             displayValue={getGenreLabel()}
//                             value={filters.genre}
//                             options={uniqueGenres.map((g) => ({ label: g.name, value: g.id }))}
//                             isOpen={openDropdown === "genre"}
//                             onToggle={() =>
//                                 setOpenDropdown((prev) => (prev === "genre" ? null : "genre"))
//                             }
//                             onSelect={(value) => handleDropdownSelect("genre", value)}
//                             buttonRef={refs.genre.button}
//                             menuRef={refs.genre.menu}
//                         />

//                         <FilterDropdown
//                             label="Year"
//                             displayValue={getYearLabel()}
//                             value={filters.year}
//                             options={movieYears}
//                             isOpen={openDropdown === "year"}
//                             onToggle={() =>
//                                 setOpenDropdown((prev) => (prev === "year" ? null : "year"))
//                             }
//                             onSelect={(value) => handleDropdownSelect("year", value)}
//                             buttonRef={refs.year.button}
//                             menuRef={refs.year.menu}
//                         />

//                         <FilterDropdown
//                             label="Country"
//                             displayValue={getCountryLabel()}
//                             value={filters.country}
//                             options={countryOptions}
//                             isOpen={openDropdown === "country"}
//                             onToggle={() =>
//                                 setOpenDropdown((prev) => (prev === "country" ? null : "country"))
//                             }
//                             onSelect={(value) => handleDropdownSelect("country", value)}
//                             buttonRef={refs.country.button}
//                             menuRef={refs.country.menu}
//                         />

//                         <FilterDropdown
//                             label="High Rating"
//                             displayValue={getRatingLabel()}
//                             value={filters.rating}
//                             options={ratingOptions}
//                             isOpen={openDropdown === "rating"}
//                             onToggle={() =>
//                                 setOpenDropdown((prev) => (prev === "rating" ? null : "rating"))
//                             }
//                             onSelect={(value) => handleDropdownSelect("rating", value)}
//                             buttonRef={refs.rating.button}
//                             menuRef={refs.rating.menu}
//                         />

//                         <FilterDropdown
//                             label="Director"
//                             displayValue={getDirectorLabel()}
//                             value={filters.director}
//                             options={directorOptions}
//                             isOpen={openDropdown === "director"}
//                             onToggle={() =>
//                                 setOpenDropdown((prev) => (prev === "director" ? null : "director"))
//                             }
//                             onSelect={(value) => handleDropdownSelect("director", value)}
//                             buttonRef={refs.director.button}
//                             menuRef={refs.director.menu}
//                         />

//                         {toggleButtons.map((tag) => (
//                             <button
//                                 key={tag.key}
//                                 type="button"
//                                 className={`watchlist-tag ${filters[tag.key] ? "watchlist-tag--active" : ""}`}
//                                 onClick={() => toggleTagFilter(tag.key)}
//                             >
//                                 {tag.label}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="watchlist-filters__line"></div>

//                     <div className="watchlist-filters__actions">
//                         <button
//                             type="button"
//                             className="watchlist-reset"
//                             onClick={() =>
//                                 setFilters({
//                                     type: "all",
//                                     genre: "All",
//                                     year: "All",
//                                     country: "All",
//                                     rating: "All",
//                                     director: "All",
//                                     isNew: false,
//                                     isRecommended: false,
//                                     isForeign: false,
//                                 })
//                             }
//                         >
//                             Reset Filters
//                         </button>
//                     </div>
//                 </section>

//                 <section className="watchlist-grid">
//                     {filteredItems.length > 0 ? (
//                         filteredItems.map((item) => (
//                             <article className="watchlist-card" key={`${item.media_type}-${item.id}`}>
//                                 <button
//                                     type="button"
//                                     className="watchlist-card__remove"
//                                     onClick={() => removeFromWatchlist(item.id, item.media_type)}
//                                     aria-label="Remove from watchlist"
//                                 >
//                                     <X size={16} />
//                                 </button>

//                                 <Link
//                                     to={`/details/${item.media_type}/${item.id}`}
//                                     className="watchlist-card__link"
//                                 >
//                                     <div className="watchlist-card__poster">
//                                         {/* <img
//                                             src={getPosterUrl(item.poster_path)}
//                                             alt={item.title || item.name}
//                                         /> */}
//                                         {item.poster_path ? (
//                                             <img
//                                                 src={getPosterUrl(item.poster_path)}
//                                                 alt={item.title || item.name}
//                                             />
//                                         ) : (
//                                             <div className="watchlist-card__no-poster">No Image</div>
//                                         )}
//                                     </div>

//                                     {/* <div className="watchlist-card__overlay">
//                                         <h3>{item.title || item.name}</h3>
//                                         <p>
//                                             {(item.release_date || item.first_air_date)?.slice(0, 4) || "—"}
//                                         </p>
//                                         <span>⭐ {item.vote_average?.toFixed(1) || "—"}</span>
//                                     </div> */}
//                                     <div className="watchlist-card__overlay">
//                                         <h3>{item.title || item.name}</h3>

//                                         <p>
//                                             {(item.release_date || item.first_air_date)?.slice(0, 4) || "—"}
//                                         </p>

//                                         <span>⭐ {item.vote_average?.toFixed(1) || "—"}</span>

//                                         <p className="watchlist-user-rating">
//                                             Your rating: {getRating(item.id, item.media_type) || "—"}
//                                         </p>
//                                     </div>
//                                 </Link>
//                             </article>
//                         ))
//                     ) : (
//                         <div className="watchlist-empty">
//                             <h2>Your watchlist is empty</h2>
//                             <p>Add movies or series from the details page.</p>
//                         </div>
//                     )}
//                 </section>
//             </div>
//         </main>
//     );
// };

// export default Watchlist;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { X } from "lucide-react";
import "../styles/watchlist.css";
import { getPosterUrl } from "../api/tmdb";
import { getRating } from "../ai/ratings";
import { getUser } from "../utils/auth";

const Watchlist = () => {
    const [items, setItems] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);

    const user = getUser();

    const [filters, setFilters] = useState({
        type: "all",
        genre: "All",
        year: "All",
        country: "All",
        rating: "All",
        director: "All",
        isNew: false,
        isRecommended: false,
        isForeign: false,
    });

    const loadWatchlist = async () => {
        if (!user) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/watchlist/${user.id}`
            );

            const data = await res.json();

            const normalized = data.map((item) => ({
                ...item,
                id: item.movie_id,
                title: item.title,
                name: item.title,
                genres: [], 
                production_countries: [],
            }));

            setItems(normalized);
        } catch (error) {
            console.error("Watchlist load error:", error);
            setItems([]);
        }
    };

    useEffect(() => {
        loadWatchlist();

        window.addEventListener("watchlistUpdated", loadWatchlist);

        return () => {
            window.removeEventListener("watchlistUpdated", loadWatchlist);
        };
    }, []);

    const removeFromWatchlist = async (id, mediaType) => {
        if (!user) return;

        try {
            await fetch(
                `http://localhost:5000/api/watchlist/${user.id}/${mediaType}/${id}`,
                {
                    method: "DELETE",
                }
            );

            loadWatchlist();
        } catch (error) {
            console.error("Remove error:", error);
        }
    };

    const filteredItems = useMemo(() => {
        let result = [...items];

        if (filters.type !== "all") {
            result = result.filter((item) => item.media_type === filters.type);
        }

        if (filters.year !== "All") {
            result = result.filter((item) => {
                const year =
                    item.release_date?.slice(0, 4) ||
                    item.first_air_date?.slice(0, 4);
                return year === filters.year;
            });
        }

        if (filters.rating !== "All") {
            result = result.filter(
                (item) => Number(item.vote_average) >= Number(filters.rating)
            );
        }

        if (filters.isNew) {
            result = result.filter((item) => {
                const year =
                    item.release_date?.slice(0, 4) ||
                    item.first_air_date?.slice(0, 4);
                return year === "2024" || year === "2025";
            });
        }

        if (filters.isRecommended) {
            result = result.filter(
                (item) => Number(item.vote_average) >= 7.5
            );
        }

        if (filters.isForeign) {
            result = result.filter(
                (item) => item.original_language !== "en"
            );
        }

        return result;
    }, [items, filters]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="watchlist-page">
            <div className="watchlist-page__container">
                <section className="watchlist-header">
                    <div>
                        <p className="watchlist-header__eyebrow">My List</p>
                        <h1>Watchlist</h1>
                    </div>

                    <div className="watchlist-header__count">
                        {filteredItems.length} items
                    </div>
                </section>

                <section className="watchlist-grid">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <article
                                className="watchlist-card"
                                key={`${item.media_type}-${item.id}`}
                            >
                                <button
                                    className="watchlist-card__remove"
                                    onClick={() =>
                                        removeFromWatchlist(
                                            item.id,
                                            item.media_type
                                        )
                                    }
                                >
                                    <X size={16} />
                                </button>

                                <Link
                                    to={`/details/${item.media_type}/${item.id}`}
                                >
                                    <div className="watchlist-card__poster">
                                        {item.poster_path ? (
                                            <img
                                                src={getPosterUrl(
                                                    item.poster_path
                                                )}
                                                alt={item.title}
                                            />
                                        ) : (
                                            <div>No Image</div>
                                        )}
                                    </div>

                                    <div className="watchlist-card__overlay">
                                        <h3>{item.title}</h3>

                                        <p>
                                            {(item.release_date ||
                                                item.first_air_date)?.slice(
                                                    0,
                                                    4
                                                ) || "—"}
                                        </p>

                                        <span>
                                            ⭐{" "}
                                            {item.vote_average?.toFixed(1) ||
                                                "—"}
                                        </span>

                                        <p className="watchlist-user-rating">
                                            Your rating:{" "}
                                            {getRating(
                                                item.id,
                                                item.media_type
                                            ) || "—"}
                                        </p>
                                    </div>
                                </Link>
                            </article>
                        ))
                    ) : (
                        <div className="watchlist-empty">
                            <h2>Your watchlist is empty</h2>
                            <p>Add movies from movie page</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Watchlist;