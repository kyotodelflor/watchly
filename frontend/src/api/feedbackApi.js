const BASE_URL = "http://localhost:5000/api/feedback";

export async function sendFeedbackApi(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return res.json();
}

export async function getUserFeedbackApi(userId) {
    const res = await fetch(`${BASE_URL}/user/${userId}`);
    return res.json();
}