import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/blog.css";
import { searchByType } from "../api/tmdb";
import { getT } from "../utils/translations";

const featuredArticle = {
    title: "How AI Can Change Movie Recommendations",
    category: "Featured",
    description:
        "Modern recommendation systems analyze genre, ratings, watch history, mood, and patterns of user behavior to suggest films that feel personal and relevant. This is one of the key ideas behind Watchly.",
    image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
};

const articles = [
    {
        title: "Why some movies become timeless classics",
        text: "Great films combine story, emotion, direction, music, and performances in a way that still feels powerful years later.",
        image:
            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
        tag: "Cinema",
    },
    {
        title: "The rise of streaming platforms",
        text: "Streaming changed how audiences discover content, making personalized recommendations and instant access the new standard.",
        image:
            "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80",
        tag: "Industry",
    },
    {
        title: "How trailers shape expectations",
        text: "A strong trailer can create excitement, define the mood, and become the first emotional connection between viewer and story.",
        image:
            "https://www.slashfilm.com/img/gallery/best-movie-trailers-of-the-decade/l-intro-1630003829.jpg",
        tag: "Trailers",
    },
];

const facts = [
    "The first public movie screening by the Lumière brothers happened in 1895.",
    "Many modern blockbusters rely heavily on digital production workflows and CGI.",
    "A strong soundtrack can dramatically improve how memorable a scene feels.",
    "Series often build stronger long-term audience attachment because of character development over multiple seasons.",
    "Recommendation systems usually become better when they combine content data with user behavior data.",
    "Poster design still plays a huge role in attracting clicks, views, and curiosity.",
];

const topMovies = [
    "The Godfather",
    "The Shawshank Redemption",
    "The Dark Knight",
    "Pulp Fiction",
    "Fight Club",
    "Interstellar",
    "Inception",
    "Parasite",
    "Gladiator",
    "The Lord of the Rings: The Return of the King",
    "Forrest Gump",
    "Se7en",
    "Whiplash",
    "The Green Mile",
    "Schindler’s List",
    "Dune",
    "Dune: Part Two",
    "The Matrix",
    "La La Land",
    "Blade Runner 2049",
    "Prisoners",
    "Arrival",
    "The Wolf of Wall Street",
    "Taxi Driver",
    "Goodfellas",
    "The Departed",
    "Shutter Island",
    "The Hateful Eight",
    "Inglourious Basterds",
    "Kill Bill: Vol. 1",
    "Once Upon a Time in Hollywood",
    "Saving Private Ryan",
    "Jurassic Park",
    "Jaws",
    "Napoleon",
    "The Martian",
    "Alien",
    "Prometheus",
    "The Conjuring",
    "Harry Potter and the Prisoner of Azkaban",
    "The Grand Budapest Hotel",
    "Lady Bird",
    "The Social Network",
    "No Country for Old Men",
    "Her",
    "A Beautiful Mind",
    "The Prestige",
    "Memento",
    "Django Unchained",
    "Oppenheimer",
];

const topSeries = [
    "Game of Thrones",
    "Breaking Bad",
    "Dark",
    "Stranger Things",
    "The Last of Us",
    "Sherlock",
    "Chernobyl",
    "True Detective",
    "The Boys",
    "House of the Dragon",
];

const gallery = [
    "https://burst.shopifycdn.com/photos/buildings-downtown-manhattan-nyc.jpg?width=1000&format=pjpg&exif=0&iptc=0",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    "https://plus.unsplash.com/premium_photo-1661936697264-84cc3925cf5c?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485465053475-dd55ed3894b9?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    "https://www.historic-uk.com/wp-content/uploads/2017/01/harry-potter-film-locations.jpg",
];

const Blog = () => {
    const navigate = useNavigate();
    const t = getT();

    const openTitlePage = async (title, type) => {
        try {
            const data = await searchByType(title, 1, type);
            const result = data.results?.[0];

            if (!result) {
                alert("Title not found");
                return;
            }

            navigate(`/details/${type}/${result.id}`);
        } catch (error) {
            console.error("Open title error:", error);
            alert("Failed to open title");
        }
    };

    return (
        <main className="blog-page">
            <div className="blog-page__glow blog-page__glow--left"></div>
            <div className="blog-page__glow blog-page__glow--center"></div>
            <div className="blog-page__glow blog-page__glow--right"></div>

            <div className="blog-page__container">
                <section className="blog-hero">
                    <div className="blog-hero__text">
                        <p className="blog-hero__eyebrow">
                            {t.blogJournal}
                        </p>

                        <h1>{t.blogHeroTitle}</h1>

                        <p className="blog-hero__description">
                            {t.blogHeroDesc}
                        </p>
                    </div>

                    <div className="blog-hero__card">
                        <span>{t.newArticle}</span>

                        <h3>{t.futureDiscovery}</h3>

                        <p>{t.futureDiscoveryText}</p>
                    </div>
                </section>

                <section className="featured-article">
                    <div className="featured-article__image">
                        <img
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                        />
                    </div>

                    <div className="featured-article__content">
                        <span className="featured-article__tag">
                            {featuredArticle.category}
                        </span>

                        <h2>{featuredArticle.title}</h2>

                        <p>{featuredArticle.description}</p>

                        <button type="button" className="blog-btn">
                            {t.readMore}
                        </button>
                    </div>
                </section>

                <section className="blog-section">
                    <div className="section-heading">
                        <h2>{t.interestingArticles}</h2>

                        <p>{t.interestingArticlesDesc}</p>
                    </div>

                    <div className="articles-grid">
                        {articles.map((article, index) => (
                            <article className="article-card" key={index}>
                                <div className="article-card__image">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                    />
                                </div>

                                <div className="article-card__content">
                                    <span>{article.tag}</span>

                                    <h3>{article.title}</h3>

                                    <p>{article.text}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="blog-section">
                    <div className="section-heading">
                        <h2>{t.cinemaFacts}</h2>

                        <p>{t.cinemaFactsDesc}</p>
                    </div>

                    <div className="facts-grid">
                        {facts.map((fact, index) => (
                            <div className="fact-card" key={index}>
                                <span>0{index + 1}</span>

                                <p>{fact}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="blog-section blog-ranking">
                    <div className="ranking-block">
                        <div className="section-heading">
                            <h2>{t.topMovies}</h2>

                            <p>{t.topMoviesDesc}</p>
                        </div>

                        <div className="ranking-list">
                            {topMovies.map((movie, index) => (
                                <button
                                    type="button"
                                    className="ranking-item ranking-item--clickable"
                                    key={movie}
                                    onClick={() =>
                                        openTitlePage(movie, "movie")
                                    }
                                >
                                    <span>{index + 1}</span>

                                    <p>{movie}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="ranking-block">
                        <div className="section-heading">
                            <h2>{t.topSeries}</h2>

                            <p>{t.topSeriesDesc}</p>
                        </div>

                        <div className="ranking-list">
                            {topSeries.map((series, index) => (
                                <button
                                    type="button"
                                    className="ranking-item ranking-item--clickable"
                                    key={series}
                                    onClick={() =>
                                        openTitlePage(series, "tv")
                                    }
                                >
                                    <span>{index + 1}</span>

                                    <p>{series}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="blog-section">
                    <div className="section-heading">
                        <h2>{t.frames}</h2>

                        <p>{t.framesDesc}</p>
                    </div>

                    <div className="gallery-grid">
                        {gallery.map((image, index) => (
                            <div className="gallery-card" key={index}>
                                <img
                                    src={image}
                                    alt={`Cinema still ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Blog;