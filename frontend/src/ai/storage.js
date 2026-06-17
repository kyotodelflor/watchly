const WATCH_HISTORY_KEY = "watchly_watch_history";
const WATCHLIST_KEY = "watchlist_items";

export function getWatchHistory() {
    try {
        return JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || "[]");
    } catch (error) {
        console.error("Failed to parse watch history:", error);
        return [];
    }
}

export function saveWatchHistory(history) {
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event("watchHistoryUpdated"));
}

export function addToWatchHistory(item) {
    if (!item?.id || !item?.media_type) return;

    const history = getWatchHistory();

    const existingIndex = history.findIndex(
        (x) => String(x.id) === String(item.id) && x.media_type === item.media_type
    );

    const normalizedItem = {
        id: item.id,
        media_type: item.media_type,
        title: item.title || null,
        name: item.name || null,
        poster_path: item.poster_path || null,
        backdrop_path: item.backdrop_path || null,
        genres: item.genres || [],
        vote_average: item.vote_average || 0,
        original_language: item.original_language || "",
        production_countries: item.production_countries || [],
        release_date: item.release_date || null,
        first_air_date: item.first_air_date || null,
        watchedAt: new Date().toISOString(),
    };

    let updated;

    if (existingIndex !== -1) {
        updated = [...history];
        updated[existingIndex] = {
            ...updated[existingIndex],
            ...normalizedItem,
        };
    } else {
        updated = [normalizedItem, ...history];
    }

    saveWatchHistory(updated);
}

export function getWatchlist() {
    try {
        return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
    } catch (error) {
        console.error("Failed to parse watchlist:", error);
        return [];
    }
}