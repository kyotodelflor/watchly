const BASE_URL = "http://localhost:5000/api/watchlist";

export async function getUserWatchlist(userId) {
    const res = await fetch(`${BASE_URL}/${userId}`);
    return res.json();
}

export async function addToWatchlistApi(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return res.json();
}

export async function removeFromWatchlistApi(userId, mediaType, movieId) {
    const res = await fetch(`${BASE_URL}/${userId}/${mediaType}/${movieId}`, {
        method: "DELETE",
    });

    return res.json();
}

export async function checkWatchlistApi(userId, mediaType, movieId) {
    const res = await fetch(`${BASE_URL}/${userId}/${mediaType}/${movieId}/check`);
    return res.json();
}