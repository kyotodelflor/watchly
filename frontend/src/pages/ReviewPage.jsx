import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getDetailsByType, getPosterUrl } from "../api/tmdb";
import { getUser } from "../utils/auth";
import "../styles/review-page.css";

const ReviewPage = () => {
    const { type, id } = useParams();

    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);

    const user = getUser();

    useEffect(() => {
        const loadData = async () => {
            try {
                const movieData = await getDetailsByType(id, type);
                setMovie(movieData);
                await loadReviews();
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, type]);

    const loadReviews = async () => {
        const res = await fetch(`http://localhost:5000/api/reviews/${type}/${id}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
    };

    const handleSubmit = async () => {
        if (!user) {
            alert("Please login first.");
            return;
        }

        if (!reviewText.trim()) {
            alert("Write your review first.");
            return;
        }

        await fetch("http://localhost:5000/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.id,
                movie_id: Number(id),
                media_type: type,
                rating,
                review: reviewText.trim(),
            }),
        });

        setReviewText("");
        setRating(0);
        await loadReviews();
    };

    if (!user) return <Navigate to="/login" replace />;
    if (loading || !movie) return <main className="review-page">Loading...</main>;

    const title = movie.title || movie.name;
    const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);

    const getAvatarSrc = (avatar) => {
        if (!avatar || avatar === "/default-avatar.png") return null;
        return avatar;
    };

    return (
        <main className="review-page">
            <div className="review-page__glow review-page__glow--left"></div>
            <div className="review-page__glow review-page__glow--right"></div>

            <div className="review-page__container">
                <section className="review-hero">
                    <img
                        src={getPosterUrl(movie.poster_path)}
                        alt={title}
                        className="review-hero__poster"
                    />

                    <div className="review-hero__info">
                        <p className="review-hero__eyebrow">Review</p>
                        <h1>{title}</h1>

                        <div className="review-hero__meta">
                            <span>{year || "—"}</span>
                            <span>TMDB ⭐ {movie.vote_average?.toFixed(1) || "—"}</span>
                            <span>{type === "tv" ? "Series" : "Movie"}</span>
                        </div>

                        <p className="review-hero__overview">{movie.overview}</p>
                    </div>
                </section>

                <section className="review-form-card">
                    <div className="review-form-card__top">
                        <div>
                            <h2>Leave your review</h2>
                            <p>Share your opinion and rating with other Watchly users.</p>
                        </div>

                        <div className="review-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={
                                        (hoverRating || rating) >= star
                                            ? "review-star review-star--active"
                                            : "review-star"
                                    }
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    ★
                                </span>
                            ))}
                            <b>{rating ? `${rating}/5` : "Rate"}</b>
                        </div>
                    </div>

                    <div className="review-input-row">
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review..."
                        />

                        <button type="button" onClick={handleSubmit}>
                            Submit Review
                        </button>
                    </div>
                </section>

                <section className="reviews-list">
                    <h2>User Reviews</h2>

                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <article className="review-user-card" key={review.id}>
                                <div className="review-user-card__avatar">
                                    {/* {review.avatar ? (
                                        <img src={review.avatar} alt={review.username} />
                                    ) : (
                                        <span>
                                            {(review.name?.[0] || "U").toUpperCase()}
                                        </span>
                                    )} */}
                                    {getAvatarSrc(review.avatar) ? (
                                        <img src={getAvatarSrc(review.avatar)} alt={review.username} />
                                    ) : (
                                        <span>
                                            {(review.name?.[0] || review.username?.[0] || "U").toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="review-user-card__content">
                                    <div className="review-user-card__head">
                                        <div>
                                            <h3>
                                                {review.name} {review.surname}
                                            </h3>
                                            <p>@{review.username}</p>
                                        </div>

                                        <div className="review-user-card__rating">
                                            ⭐ {review.rating || "—"}/5
                                        </div>
                                    </div>

                                    <p className="review-user-card__text">
                                        {review.review}
                                    </p>

                                    <span className="review-user-card__date">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="reviews-empty">
                            <h3>No reviews yet</h3>
                            <p>Be the first to review this title.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default ReviewPage;