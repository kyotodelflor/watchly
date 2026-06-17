import { getRatings } from "./ratings";

function getYearFromItem(item) {
    const raw = item.release_date || item.first_air_date;
    if (!raw) return null;
    const year = Number(String(raw).slice(0, 4));
    return Number.isFinite(year) ? year : null;
}

function getDecade(year) {
    if (!year) return null;
    return Math.floor(year / 10) * 10;
}

function getDaysAgo(dateString) {
    if (!dateString) return 30;
    const diff = Date.now() - new Date(dateString).getTime();
    return diff / (1000 * 60 * 60 * 24);
}

export function buildUserProfile(watchHistory = [], watchlist = []) {
    const ratings = getRatings();

    const genreWeights = {};
    const typeWeights = {};
    const languageWeights = {};
    const countryWeights = {};
    const decadeWeights = {};
    const yearWeights = {};

    const allItems = [
        ...watchHistory.map((item) => ({ ...item, source: "history" })),
        ...watchlist.map((item) => ({ ...item, source: "watchlist" })),
    ];

    allItems.forEach((item) => {
        const key = `${item.media_type}-${item.id}`;
        const userRating = ratings[key]?.value || 0;

        const baseWeight = item.source === "history" ? 2.4 : 1.5;

        let ratingBoost = 1;
        if (userRating >= 5) ratingBoost = 3.4;
        else if (userRating === 4) ratingBoost = 2.5;
        else if (userRating === 3) ratingBoost = 1.5;
        else if (userRating === 2) ratingBoost = 0.7;
        else if (userRating === 1) ratingBoost = 0.25;

        const daysAgo = getDaysAgo(item.watchedAt || item.savedAt);
        const recencyBoost = Math.max(0.7, 1.7 - daysAgo / 40);

        const finalWeight = baseWeight * ratingBoost * recencyBoost;

        (item.genres || []).forEach((genre) => {
            const genreId = typeof genre === "object" ? genre.id : genre;
            if (!genreId) return;
            genreWeights[genreId] = (genreWeights[genreId] || 0) + finalWeight;
        });

        if (item.media_type) {
            typeWeights[item.media_type] = (typeWeights[item.media_type] || 0) + finalWeight;
        }

        if (item.original_language) {
            languageWeights[item.original_language] =
                (languageWeights[item.original_language] || 0) + finalWeight;
        }

        (item.production_countries || []).forEach((country) => {
            const code = typeof country === "object" ? country.iso_3166_1 : country;
            if (!code) return;
            countryWeights[code] = (countryWeights[code] || 0) + finalWeight;
        });

        const year = getYearFromItem(item);
        const decade = getDecade(year);

        if (year) {
            yearWeights[year] = (yearWeights[year] || 0) + finalWeight;
        }

        if (decade) {
            decadeWeights[decade] = (decadeWeights[decade] || 0) + finalWeight;
        }
    });

    const favoriteGenres = Object.entries(genreWeights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => Number(id));

    const favoriteCountries = Object.entries(countryWeights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([code]) => code);

    const favoriteLanguages = Object.entries(languageWeights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([code]) => code);

    const favoriteDecades = Object.entries(decadeWeights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([decade]) => Number(decade));

    return {
        genreWeights,
        typeWeights,
        languageWeights,
        countryWeights,
        decadeWeights,
        yearWeights,
        favoriteGenres,
        favoriteCountries,
        favoriteLanguages,
        favoriteDecades,
    };
}