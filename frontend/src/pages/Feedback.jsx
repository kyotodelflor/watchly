import React, { useEffect, useState } from "react";
import "../styles/feedback.css";
import { getUser } from "../utils/auth";
import { getUserFeedbackApi, sendFeedbackApi } from "../api/feedbackApi";

const Feedback = () => {
    const [text, setText] = useState("");
    const [type, setType] = useState("general");
    const [priority, setPriority] = useState("medium");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const user = getUser();

    const loadHistory = async () => {
        if (!user) return;

        const data = await getUserFeedbackApi(user.id);
        setHistory(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleSubmit = async () => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        setLoading(true);

        await sendFeedbackApi({
            user_id: user?.id || null,
            type,
            priority,
            message: trimmed,
        });

        setText("");
        setSent(true);
        await loadHistory();

        setTimeout(() => setSent(false), 1800);
        setLoading(false);
    };

    return (
        <main className="feedback-page">
            <div className="feedback-page__container">
                <p className="feedback-page__eyebrow">Support</p>
                <h1>Leave Feedback</h1>
                <p className="feedback-page__subtitle">
                    Share your opinion, report a bug, or suggest a new feature for Watchly.
                </p>

                <div className="feedback-card">
                    <div className="feedback-controls">
                        <label>
                            Type
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="general">General</option>
                                <option value="bug">Bug report</option>
                                <option value="feature">Feature request</option>
                                <option value="ui">UI/UX</option>
                            </select>
                        </label>

                        <label>
                            Priority
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </label>
                    </div>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your feedback..."
                    />

                    <button type="button" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Sending..." : sent ? "Sent!" : "Submit"}
                    </button>
                </div>

                <section className="feedback-history">
                    <h2>Your Feedback History</h2>

                    {history.length > 0 ? (
                        history.map((item) => (
                            <article className="feedback-history-card" key={item.id}>
                                <div className="feedback-history-card__top">
                                    <span>{item.type}</span>
                                    <b>{item.status}</b>
                                </div>

                                <p>{item.message}</p>

                                {item.admin_reply && (
                                    <div className="feedback-admin-reply">
                                        <strong>Admin reply:</strong>
                                        <p>{item.admin_reply}</p>
                                    </div>
                                )}

                                <small>{new Date(item.created_at).toLocaleString()}</small>
                            </article>
                        ))
                    ) : (
                        <p className="feedback-empty">No feedback sent yet.</p>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Feedback;