// export function scoreMovie(movie, profile) {
//     let score = 0;

//     const genres = movie.genre_ids || movie.genres?.map((g) => g.id) || [];

//     genres.forEach((genreId) => {
//         score += (profile.genreWeights[genreId] || 0) * 5;
//     });

//     if (movie.media_type && profile.typeWeights[movie.media_type]) {
//         score += profile.typeWeights[movie.media_type] * 3;
//     }

//     if (movie.original_language && profile.languageWeights[movie.original_language]) {
//         score += profile.languageWeights[movie.original_language] * 2;
//     }

//     const countryCodes =
//         movie.production_countries?.map((c) => c.iso_3166_1) ||
//         movie.origin_country ||
//         [];

//     countryCodes.forEach((code) => {
//         score += (profile.countryWeights[code] || 0) * 1.5;
//     });

//     if (movie.vote_average) {
//         score += movie.vote_average * 1.4;
//     }

//     if (movie.popularity) {
//         score += movie.popularity * 0.025;
//     }

//     return score;
// }

// export function recommendMovies(candidates = [], profile, excludedIds = []) {
//     const excludedSet = new Set(excludedIds.map(String));

//     return candidates
//         .filter((movie) => !excludedSet.has(String(movie.id)))
//         .map((movie) => ({
//             ...movie,
//             recommendationScore: scoreMovie(movie, profile),
//         }))
//         .sort((a, b) => b.recommendationScore - a.recommendationScore);
// }

function getYear(movie) {
    const raw = movie.release_date || movie.first_air_date;
    if (!raw) return null;
    const year = Number(String(raw).slice(0, 4));
    return Number.isFinite(year) ? year : null;
}

function getDecade(year) {
    if (!year) return null;
    return Math.floor(year / 10) * 10;
}

export function scoreMovie(movie, profile) {
    let score = 0;

    const genres = movie.genre_ids || movie.genres?.map((g) => g.id) || [];

    genres.forEach((genreId) => {
        score += (profile.genreWeights[genreId] || 0) * 6;
    });

    if (movie.media_type && profile.typeWeights[movie.media_type]) {
        score += profile.typeWeights[movie.media_type] * 3;
    }

    if (movie.original_language && profile.languageWeights[movie.original_language]) {
        score += profile.languageWeights[movie.original_language] * 4;
    }

    const countryCodes =
        movie.production_countries?.map((c) => c.iso_3166_1) ||
        movie.origin_country ||
        [];

    countryCodes.forEach((code) => {
        score += (profile.countryWeights[code] || 0) * 4.5;
    });

    const year = getYear(movie);
    const decade = getDecade(year);

    if (decade && profile.decadeWeights[decade]) {
        score += profile.decadeWeights[decade] * 5;
    }

    if (year && profile.yearWeights[year]) {
        score += profile.yearWeights[year] * 2.5;
    }

    if (movie.vote_average) {
        score += movie.vote_average * 1.25;
    }

    if (movie.popularity) {
        score += movie.popularity * 0.012;
    }

    return score;
}

export function recommendMovies(candidates = [], profile, excludedIds = []) {
    const excludedSet = new Set(excludedIds.map(String));

    return candidates
        .filter((movie) => !excludedSet.has(String(movie.id)))
        .map((movie) => ({
            ...movie,
            recommendationScore: scoreMovie(movie, profile),
        }))
        .sort((a, b) => b.recommendationScore - a.recommendationScore);
}