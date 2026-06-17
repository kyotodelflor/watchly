import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/browse.css";
import {
    discoverByType,
    getMovieGenres,
    getPosterUrl,
    getTvGenres,
    searchByType,
} from "../api/tmdb";

const movieYears = [
    "All", "2025", "2024", "2023", "2022", "2021", "2020",
    "2019", "2018", "2017", "2016", "2015", "2014", "2013",
    "2012", "2011", "2010", "2009", "2008", "2007", "2006",
    "2005", "2004", "2003", "2002", "2001", "2000", "1990",
    "1980", "1970",
];

const countryOptions = [
    { label: "All", value: "All" },
    { label: "USA", value: "US" },
    { label: "UK", value: "GB" },
    { label: "France", value: "FR" },
    { label: "Germany", value: "DE" },
    { label: "Japan", value: "JP" },
    { label: "South Korea", value: "KR" },
    { label: "Italy", value: "IT" },
    { label: "Spain", value: "ES" },
    { label: "Kazakhstan", value: "KZ" },
    { label: "Soviet Cinema", value: "SU" },
];

const ratingOptions = [
    { label: "All", value: "All" },
    { label: "8+", value: "8" },
    { label: "7+", value: "7" },
    { label: "6+", value: "6" },
];

const typeOptions = [
    { label: "All", value: "all" },
    { label: "Movie", value: "movie" },
    { label: "Series", value: "tv" },
];

const directorOptions = [
    { label: "All", value: "All" },
    { label: "Christopher Nolan", value: "Christopher Nolan" },
    { label: "Quentin Tarantino", value: "Quentin Tarantino" },
    { label: "Steven Spielberg", value: "Steven Spielberg" },
    { label: "Martin Scorsese", value: "Martin Scorsese" },
    { label: "Denis Villeneuve", value: "Denis Villeneuve" },
    { label: "Ridley Scott", value: "Ridley Scott" },
    { label: "David Benioff & D.B. Weiss", value: "David Benioff & D.B. Weiss" },
];

const titleDirectorMap = {
    Inception: "Christopher Nolan",
    Interstellar: "Christopher Nolan",
    "The Dark Knight": "Christopher Nolan",
    Dunkirk: "Christopher Nolan",
    Oppenheimer: "Christopher Nolan",
    Tenet: "Christopher Nolan",
    "Pulp Fiction": "Quentin Tarantino",
    "Kill Bill: Vol. 1": "Quentin Tarantino",
    "Kill Bill: Vol. 2": "Quentin Tarantino",
    "Once Upon a Time in Hollywood": "Quentin Tarantino",
    "Inglourious Basterds": "Quentin Tarantino",
    "Django Unchained": "Quentin Tarantino",
    "Schindler's List": "Steven Spielberg",
    "Jurassic Park": "Steven Spielberg",
    "Saving Private Ryan": "Steven Spielberg",
    Jaws: "Steven Spielberg",
    "Catch Me If You Can": "Steven Spielberg",
    "The Wolf of Wall Street": "Martin Scorsese",
    "Shutter Island": "Martin Scorsese",
    "Taxi Driver": "Martin Scorsese",
    Goodfellas: "Martin Scorsese",
    "The Departed": "Martin Scorsese",
    Dune: "Denis Villeneuve",
    "Dune: Part Two": "Denis Villeneuve",
    "Blade Runner 2049": "Denis Villeneuve",
    Arrival: "Denis Villeneuve",
    Prisoners: "Denis Villeneuve",
    Sicario: "Denis Villeneuve",
    Napoleon: "Ridley Scott",
    Gladiator: "Ridley Scott",
    "The Martian": "Ridley Scott",
    Alien: "Ridley Scott",
    Prometheus: "Ridley Scott",
    "Game of Thrones": "David Benioff & D.B. Weiss",
};

const toggleButtons = [
    { key: "isNew", label: "New" },
    { key: "isRecommended", label: "Recommendations" },
    { key: "isForeign", label: "Foreign Cinema" },
];

const defaultSettings = {
    preferredContent: "all",
    defaultSort: "popularity.desc",
    matureContent: false,
};

const getSavedSettings = () => {
    try {
        return {
            ...defaultSettings,
            ...(JSON.parse(localStorage.getItem("watchly_settings")) || {}),
        };
    } catch {
        return defaultSettings;
    }
};

const getInitialFilters = (settings) => ({
    type: settings.preferredContent || "all",
    genre: "All",
    year: "All",
    country: "All",
    rating: "All",
    director: "All",
    isNew: false,
    isRecommended: false,
    isForeign: false,
});

const FilterDropdown = ({
    displayValue,
    value,
    options,
    isOpen,
    onToggle,
    onSelect,
    buttonRef,
    menuRef,
}) => {
    return (
        <div className={`browse-filter ${isOpen ? "browse-filter--open" : ""}`}>
            <button
                type="button"
                className={`browse-filter__button ${value !== "All" && value !== "all"
                    ? "browse-filter__button--active"
                    : ""
                    }`}
                onClick={onToggle}
                ref={buttonRef}
            >
                <span>{displayValue}</span>
                <span className="browse-filter__arrow">▾</span>
            </button>

            {isOpen && (
                <div className="browse-filter__menu" ref={menuRef}>
                    {options.map((option) => {
                        const optionValue = typeof option === "object" ? option.value : option;
                        const optionLabel = typeof option === "object" ? option.label : option;

                        return (
                            <button
                                key={optionValue}
                                type="button"
                                className={`browse-filter__option ${String(value) === String(optionValue)
                                    ? "browse-filter__option--selected"
                                    : ""
                                    }`}
                                onClick={() => onSelect(optionValue)}
                            >
                                {optionLabel}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Browse = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchValue = searchParams.get("search") || "";

    const [appSettings, setAppSettings] = useState(getSavedSettings);
    const [genres, setGenres] = useState([{ id: "All", name: "All" }]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [newItemsIds, setNewItemsIds] = useState([]);

    const [filters, setFilters] = useState(() =>
        getInitialFilters(getSavedSettings())
    );

    const refs = {
        type: { button: useRef(null), menu: useRef(null) },
        genre: { button: useRef(null), menu: useRef(null) },
        year: { button: useRef(null), menu: useRef(null) },
        country: { button: useRef(null), menu: useRef(null) },
        rating: { button: useRef(null), menu: useRef(null) },
        director: { button: useRef(null), menu: useRef(null) },
    };

    useEffect(() => {
        const syncSettings = () => {
            const nextSettings = getSavedSettings();
            setAppSettings(nextSettings);

            setFilters((prev) => ({
                ...prev,
                type: nextSettings.preferredContent || "all",
            }));

            setMovies([]);
            setPage(1);
            setHasMore(true);
        };

        window.addEventListener("watchlySettingsUpdated", syncSettings);

        return () => {
            window.removeEventListener("watchlySettingsUpdated", syncSettings);
        };
    }, []);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const [movieGenres, tvGenres] = await Promise.all([
                    getMovieGenres(),
                    getTvGenres(),
                ]);

                const merged = new Map();

                (movieGenres.genres || []).forEach((g) => merged.set(g.id, g.name));
                (tvGenres.genres || []).forEach((g) => merged.set(g.id, g.name));

                const mergedGenres = [{ id: "All", name: "All" }].concat(
                    [...merged.entries()].map(([id, name]) => ({ id, name }))
                );

                setGenres(mergedGenres);
            } catch (error) {
                console.error("Failed to load genres:", error);
            }
        };

        loadGenres();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!openDropdown) return;

            const current = refs[openDropdown];
            const clickedButton = current?.button?.current?.contains(event.target);
            const clickedMenu = current?.menu?.current?.contains(event.target);

            if (!clickedButton && !clickedMenu) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdown]);

    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
    }, [filters, searchValue, appSettings]);

    useEffect(() => {
        const loadContent = async () => {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            try {
                const selectedTypes =
                    filters.type === "all" ? ["movie", "tv"] : [filters.type];

                const sortBy = filters.isRecommended
                    ? "vote_average.desc"
                    : appSettings.defaultSort || "popularity.desc";

                const requests = selectedTypes.map((type) => {
                    if (searchValue.trim()) {
                        return searchByType(searchValue.trim(), page, type);
                    }

                    return discoverByType({
                        type,
                        page,
                        genre: filters.genre === "All" ? undefined : filters.genre,
                        year: filters.year === "All" ? undefined : filters.year,
                        country:
                            filters.country === "All" ||
                                filters.country === "SU" ||
                                filters.country === "KZ"
                                ? undefined
                                : filters.country,
                        rating: filters.rating === "All" ? undefined : filters.rating,
                        sortBy,
                    });
                });

                const responses = await Promise.all(requests);

                let results = responses.flatMap((data, index) => {
                    const currentType = selectedTypes[index];

                    return (data.results || []).map((item) => ({
                        ...item,
                        media_type: currentType,
                    }));
                });

                if (!appSettings.matureContent) {
                    results = results.filter((item) => item.adult !== true);
                }

                if (filters.country === "KZ") {
                    results = results.filter((item) => {
                        return (
                            (item.origin_country && item.origin_country.includes("KZ")) ||
                            item.original_language === "kk"
                        );
                    });
                } else if (filters.country === "SU") {
                    results = results.filter((item) => {
                        const itemYear =
                            item.release_date?.slice(0, 4) ||
                            item.first_air_date?.slice(0, 4);

                        return (
                            itemYear &&
                            Number(itemYear) >= 1922 &&
                            Number(itemYear) <= 1991 &&
                            (item.original_language === "ru" ||
                                (item.origin_country &&
                                    item.origin_country.includes("RU")))
                        );
                    });
                }

                if (filters.isNew) {
                    results = results.filter((item) => {
                        const itemYear =
                            item.release_date?.slice(0, 4) ||
                            item.first_air_date?.slice(0, 4);

                        return itemYear === "2024" || itemYear === "2025";
                    });
                }

                if (filters.isForeign) {
                    results = results.filter((item) => item.original_language !== "en");
                }

                if (filters.director !== "All") {
                    results = results.filter((item) => {
                        const title = item.title || item.name || "";
                        return titleDirectorMap[title] === filters.director;
                    });
                }

                if (!results.length) {
                    setHasMore(false);
                    return;
                }

                setMovies((prev) => {
                    const prevIds = new Set(prev.map((item) => `${item.media_type}-${item.id}`));

                    const newItems = results.filter(
                        (item) => !prevIds.has(`${item.media_type}-${item.id}`)
                    );

                    const combined = page === 1 ? results : [...prev, ...results];

                    const uniqueMap = new Map();

                    combined.forEach((item) => {
                        const key = `${item.media_type}-${item.id}`;
                        if (!uniqueMap.has(key)) {
                            uniqueMap.set(key, item);
                        }
                    });

                    if (page !== 1) {
                        setNewItemsIds(
                            newItems.map((item) => `${item.media_type}-${item.id}`)
                        );
                    }

                    return [...uniqueMap.values()];
                });

                // setMovies((prev) => {
                //     const combined = page === 1 ? results : [...prev, ...results];
                //     const uniqueMap = new Map();

                //     combined.forEach((item) => {
                //         const key = `${item.media_type}-${item.id}`;

                //         if (!uniqueMap.has(key)) {
                //             uniqueMap.set(key, item);
                //         }
                //     });

                //     return [...uniqueMap.values()];
                // });

                const totalPages = Math.max(
                    ...responses.map((res) => res.total_pages || 1)
                );

                if (page >= totalPages) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Failed to load content:", error);

                if (page === 1) {
                    setMovies([]);
                }

                setHasMore(false);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        loadContent();
    }, [page, filters, searchValue, appSettings]);

    useEffect(() => {
        if (!newItemsIds.length) return;

        const timeout = setTimeout(() => {
            setNewItemsIds([]);
        }, 700);

        return () => clearTimeout(timeout);
    }, [newItemsIds]);

    const handleDropdownSelect = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));

        setOpenDropdown(null);
    };

    const toggleTagFilter = (key) => {
        setFilters((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const getGenreLabel = () => {
        if (filters.genre === "All") return "Genre";

        const found = genres.find((g) => String(g.id) === String(filters.genre));
        return found ? found.name : "Genre";
    };

    const getCountryLabel = () => {
        if (filters.country === "All") return "Country";

        const found = countryOptions.find((c) => c.value === filters.country);
        return found ? found.label : "Country";
    };

    const getRatingLabel = () => {
        return filters.rating === "All" ? "High Rating" : `${filters.rating}+`;
    };

    const getYearLabel = () => {
        return filters.year === "All" ? "Year" : filters.year;
    };

    const getTypeLabel = () => {
        if (filters.type === "all") return "Type Of Content";

        const found = typeOptions.find((item) => item.value === filters.type);
        return found ? found.label : "Type Of Content";
    };

    const getDirectorLabel = () => {
        return filters.director === "All" ? "Director" : filters.director;
    };

    const sortedMovies = useMemo(() => {
        const sortMode = filters.isRecommended
            ? "vote_average.desc"
            : appSettings.defaultSort || "popularity.desc";

        return [...movies].sort((a, b) => {
            if (sortMode === "vote_average.desc") {
                return (b.vote_average || 0) - (a.vote_average || 0);
            }

            if (
                sortMode === "primary_release_date.desc" ||
                sortMode === "first_air_date.desc"
            ) {
                const dateA = new Date(a.release_date || a.first_air_date || 0);
                const dateB = new Date(b.release_date || b.first_air_date || 0);

                return dateB - dateA;
            }

            if (sortMode === "original_title.asc") {
                const titleA = (a.title || a.name || "").toLowerCase();
                const titleB = (b.title || b.name || "").toLowerCase();

                return titleA.localeCompare(titleB);
            }

            return (b.popularity || 0) - (a.popularity || 0);
        });
    }, [movies, filters.isRecommended, appSettings.defaultSort]);

    const handleResetFilters = () => {
        const latestSettings = getSavedSettings();

        setAppSettings(latestSettings);
        setFilters(getInitialFilters(latestSettings));
        setSearchParams({});
        setMovies([]);
        setPage(1);
        setHasMore(true);
    };

    const handleLoadMore = () => {
        if (loadingMore || loading || !hasMore) return;

        setPage((prev) => prev + 1);
    };

    return (
        <main className="browse-page">
            <div className="browse-page__container">
                <section className="browse-filters">
                    <div className="browse-filters__row">
                        <FilterDropdown
                            displayValue={getTypeLabel()}
                            value={filters.type}
                            options={typeOptions}
                            isOpen={openDropdown === "type"}
                            onToggle={() =>
                                setOpenDropdown((prev) =>
                                    prev === "type" ? null : "type"
                                )
                            }
                            onSelect={(value) => handleDropdownSelect("type", value)}
                            buttonRef={refs.type.button}
                            menuRef={refs.type.menu}
                        />

                        <FilterDropdown
                            displayValue={getGenreLabel()}
                            value={filters.genre}
                            options={genres.map((g) => ({
                                label: g.name,
                                value: g.id,
                            }))}
                            isOpen={openDropdown === "genre"}
                            onToggle={() =>
                                setOpenDropdown((prev) =>
                                    prev === "genre" ? null : "genre"
                                )
                            }
                            onSelect={(value) => handleDropdownSelect("genre", value)}
                            buttonRef={refs.genre.button}
                            menuRef={refs.genre.menu}
                        />

                        <FilterDropdown
                            displayValue={getYearLabel()}
                            value={filters.year}
                            options={movieYears}
                            isOpen={openDropdown === "year"}
                            onToggle={() =>
                                setOpenDropdown((prev) =>
                                    prev === "year" ? null : "year"
                                )
                            }
                            onSelect={(value) => handleDropdownSelect("year", value)}
                            buttonRef={refs.year.button}
                            menuRef={refs.year.menu}
                        />

                        <FilterDropdown
                            displayValue={getCountryLabel()}
                            value={filters.country}
                            options={countryOptions}
                            isOpen={openDropdown === "country"}
                            onToggle={() =>
                                setOpenDropdown((prev) =>
                                    prev === "country" ? null : "country"
                                )
                            }
                            onSelect={(value) => handleDropdownSelect("country", value)}
                            buttonRef={refs.country.button}
                            menuRef={refs.country.menu}
                        />

                        <FilterDropdown
                            displayValue={getRatingLabel()}
                            value={filters.rating}
                            options={ratingOptions}
                            isOpen={openDropdown === "rating"}
                            onToggle={() =>
                                setOpenDropdown((prev) =>
                                    prev === "rating" ? null : "rating"
                                )
                            }
                            onSelect={(value) => handleDropdownSelect("rating", value)}
                            buttonRef={refs.rating.button}
                            menuRef={refs.rating.menu}
                        />

                        <FilterDropdown
                            displayValue={getDirectorLabel()}
                            value={filters.director}
                            options={directorOptions}
                            isOpen={openDropdown === "director"}
                            onToggle={() =>
                                setOpenDropdown((prev) =>
                                    prev === "director" ? null : "director"
                                )
                            }
                            onSelect={(value) => handleDropdownSelect("director", value)}
                            buttonRef={refs.director.button}
                            menuRef={refs.director.menu}
                        />

                        {toggleButtons.map((tag) => (
                            <button
                                key={tag.key}
                                type="button"
                                className={`browse-tag ${filters[tag.key] ? "browse-tag--active" : ""
                                    }`}
                                onClick={() => toggleTagFilter(tag.key)}
                            >
                                {tag.label}
                            </button>
                        ))}
                    </div>

                    <div className="browse-filters__line"></div>

                    <div className="browse-filters__search-row">
                        <button
                            type="button"
                            className="browse-reset"
                            onClick={handleResetFilters}
                        >
                            Reset Filters
                        </button>
                    </div>
                </section>

                <section className="browse-grid">
                    {loading && page === 1 ? (
                        <div className="browse-empty">
                            <h3>Loading...</h3>
                        </div>
                    ) : sortedMovies.length > 0 ? (
                        sortedMovies.map((movie) => (
                            <Link
                                to={`/details/${movie.media_type}/${movie.id}`}
                                // className="browse-card"
                                className={`browse-card ${newItemsIds.includes(`${movie.media_type}-${movie.id}`)
                                    ? "browse-card--new"
                                    : ""
                                    }`}
                                key={`${movie.media_type}-${movie.id}`}
                            >
                                <div className="browse-card__poster">
                                    {movie.poster_path ? (
                                        <img
                                            src={getPosterUrl(movie.poster_path)}
                                            alt={movie.title || movie.name}
                                        />
                                    ) : (
                                        <div className="browse-no-poster">🎬</div>
                                    )}
                                </div>

                                <div className="browse-card__overlay">
                                    <h3>{movie.title || movie.name}</h3>
                                    <p>
                                        {(movie.release_date ||
                                            movie.first_air_date ||
                                            ""
                                        ).slice(0, 4) || "—"}
                                    </p>
                                    <span>
                                        ⭐ {movie.vote_average?.toFixed(1) || "—"}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="browse-empty">
                            <h3>No content found</h3>
                            <p>Try changing the selected filters.</p>
                        </div>
                    )}
                </section>

                {sortedMovies.length > 0 && (
                    <div className="browse-load-more">
                        {hasMore ? (
                            <button
                                type="button"
                                className="load-more-btn"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? "Loading..." : "Load More"}
                            </button>
                        ) : (
                            <p className="browse-end-text">You reached the end.</p>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Browse;
