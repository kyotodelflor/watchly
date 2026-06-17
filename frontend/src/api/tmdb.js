const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);

    url.searchParams.set("api_key", API_KEY);
    url.searchParams.set("language", "en-US");

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "All") {
            url.searchParams.set(key, value);
        }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`TMDB request failed: ${response.status}`);
    }

    return response.json();
}

export function getPosterUrl(path) {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : "";
}

export function getBackdropUrl(path) {
    return path ? `https://image.tmdb.org/t/p/original${path}` : "";
}

export function getGalleryImageUrl(path) {
    return path ? `https://image.tmdb.org/t/p/w1280${path}` : "";
}

export async function getMovieGenres() {
    return tmdbFetch("/genre/movie/list");
}

export async function getTvGenres() {
    return tmdbFetch("/genre/tv/list");
}

export async function discoverByType({
    type = "movie",
    page = 1,
    genre,
    year,
    country,
    rating,
    sortBy,
} = {}) {
    const endpoint = type === "tv" ? "/discover/tv" : "/discover/movie";

    const params =
        type === "tv"
            ? {
                page,
                with_genres: genre,
                first_air_date_year: year,
                with_origin_country: country,
                "vote_average.gte": rating,
                sort_by: sortBy || "popularity.desc",
            }
            : {
                page,
                with_genres: genre,
                primary_release_year: year,
                with_origin_country: country,
                "vote_average.gte": rating,
                sort_by: sortBy || "popularity.desc",
            };

    return tmdbFetch(endpoint, params);
}

export async function searchByType(query, page = 1, type = "movie") {
    const endpoint = type === "tv" ? "/search/tv" : "/search/movie";

    return tmdbFetch(endpoint, {
        query,
        page,
        include_adult: false,
    });
}

export async function getDetailsByType(id, type = "movie") {
    const endpoint = type === "tv" ? `/tv/${id}` : `/movie/${id}`;

    return tmdbFetch(endpoint, {
        append_to_response: "videos,credits,images,similar",
        include_image_language: "en,null",
    });
}

export async function getPhotosByType(id, type = "movie") {
    const endpoint = type === "tv" ? `/tv/${id}` : `/movie/${id}`;

    return tmdbFetch(endpoint, {
        append_to_response: "images",
        include_image_language: "en,null",
    });
}

export async function getVideosByType(id, type = "movie") {
    const endpoint = type === "tv" ? `/tv/${id}/videos` : `/movie/${id}/videos`;

    return tmdbFetch(endpoint);
}