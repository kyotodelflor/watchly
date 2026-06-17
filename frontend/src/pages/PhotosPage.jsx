import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import "../styles/photos-page.css";
import {
    getBackdropUrl,
    getGalleryImageUrl,
    getPhotosByType,
    getPosterUrl,
} from "../api/tmdb";

const PhotosPage = () => {
    const { id, type } = useParams();

    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("backdrops");
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        const loadPhotos = async () => {
            setLoading(true);

            try {
                const data = await getPhotosByType(id, type);
                setMedia(data);
            } catch (error) {
                console.error("Failed to load photos:", error);
                setMedia(null);
            } finally {
                setLoading(false);
            }
        };

        loadPhotos();
    }, [id, type]);

    const title = media?.title || media?.name || "Photos";
    const backdrops = media?.images?.backdrops || [];
    const posters = media?.images?.posters || [];
    const activeImages = activeTab === "backdrops" ? backdrops : posters;

    const heroBg = media?.backdrop_path
        ? getBackdropUrl(media.backdrop_path)
        : media?.poster_path
            ? getPosterUrl(media.poster_path)
            : "";

    const selectedImage = useMemo(() => {
        if (selectedIndex === null || !activeImages[selectedIndex]) return null;
        return activeImages[selectedIndex];
    }, [activeImages, selectedIndex]);

    const openImage = (index) => {
        setSelectedIndex(index);
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    const showPrev = () => {
        if (selectedIndex === null || !activeImages.length) return;
        setSelectedIndex((prev) =>
            prev === 0 ? activeImages.length - 1 : prev - 1
        );
    };

    const showNext = () => {
        if (selectedIndex === null || !activeImages.length) return;
        setSelectedIndex((prev) =>
            prev === activeImages.length - 1 ? 0 : prev + 1
        );
    };

    if (loading) {
        return (
            <main className="photos-page">
                <div className="photos-page__container">
                    <div className="photos-page__loading">Loading photos...</div>
                </div>
            </main>
        );
    }

    if (!media) {
        return (
            <main className="photos-page">
                <div className="photos-page__container">
                    <div className="photos-page__loading">Photos not found.</div>
                </div>
            </main>
        );
    }

    return (
        <main className="photos-page">
            <div className="photos-page__bg photos-page__bg--one"></div>
            <div className="photos-page__bg photos-page__bg--two"></div>
            <div className="photos-page__bg photos-page__bg--three"></div>

            <section
                className="photos-page__hero"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="photos-page__hero-overlay"></div>

                <div className="photos-page__hero-content">
                    <Link to={`/details/${type}/${id}`} className="photos-page__back">
                        ← Back to details
                    </Link>

                    <p className="photos-page__eyebrow">Media Gallery</p>
                    <h1>{title}</h1>
                    <p className="photos-page__subtitle">
                        Browse official backdrops and posters for this {type === "tv" ? "series" : "movie"}.
                    </p>

                    <div className="photos-page__tabs">
                        <button
                            type="button"
                            className={`photos-page__tab ${activeTab === "backdrops" ? "photos-page__tab--active" : ""}`}
                            onClick={() => {
                                setActiveTab("backdrops");
                                setSelectedIndex(null);
                            }}
                        >
                            Backdrops ({backdrops.length})
                        </button>

                        <button
                            type="button"
                            className={`photos-page__tab ${activeTab === "posters" ? "photos-page__tab--active" : ""}`}
                            onClick={() => {
                                setActiveTab("posters");
                                setSelectedIndex(null);
                            }}
                        >
                            Posters ({posters.length})
                        </button>
                    </div>
                </div>
            </section>

            <div className="photos-page__container">
                <section className="photos-page__grid">
                    {activeImages.length > 0 ? (
                        activeImages.map((image, index) => (
                            <button
                                key={`${image.file_path}-${index}`}
                                type="button"
                                className={`photos-card ${activeTab === "posters" ? "photos-card--poster" : "photos-card--backdrop"
                                    }`}
                                onClick={() => openImage(index)}
                            >
                                <img
                                    src={getGalleryImageUrl(image.file_path)}
                                    alt={`${title} ${activeTab} ${index + 1}`}
                                />
                                <div className="photos-card__overlay">
                                    <span>View</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="photos-page__empty">
                            No images available in this section.
                        </div>
                    )}
                </section>
            </div>

            {selectedImage && (
                <div className="photos-lightbox" onClick={closeLightbox}>
                    <button
                        type="button"
                        className="photos-lightbox__close"
                        onClick={closeLightbox}
                    >
                        <FaTimes />
                    </button>

                    <button
                        type="button"
                        className="photos-lightbox__arrow photos-lightbox__arrow--left"
                        onClick={(e) => {
                            e.stopPropagation();
                            showPrev();
                        }}
                    >
                        <FaChevronLeft />
                    </button>

                    <div
                        className="photos-lightbox__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={getBackdropUrl(selectedImage.file_path)}
                            alt={`${title} preview`}
                        />
                    </div>

                    <button
                        type="button"
                        className="photos-lightbox__arrow photos-lightbox__arrow--right"
                        onClick={(e) => {
                            e.stopPropagation();
                            showNext();
                        }}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </main>
    );
};

export default PhotosPage;