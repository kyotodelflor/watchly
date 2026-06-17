const RATINGS_KEY = "watchly_ratings";

export function getRatings() {
    try {
        return JSON.parse(localStorage.getItem(RATINGS_KEY) || "{}");
    } catch (error) {
        console.error("Failed to parse ratings:", error);
        return {};
    }
}

export function getRating(movieId, mediaType = "movie") {
    const ratings = getRatings();
    return ratings[`${mediaType}-${movieId}`]?.value || 0;
}

export function setRating(movieId, mediaType = "movie", rating) {
    const ratings = getRatings();

    ratings[`${mediaType}-${movieId}`] = {
        value: rating,
        updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    window.dispatchEvent(new Event("watchlyRatingsUpdated"));
}