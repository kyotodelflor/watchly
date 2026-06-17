import React, { useEffect, useState } from "react";
import {
    getPhotosByType,
    getGalleryImageUrl
} from "../api/tmdb";

import "../styles/got-photos.css";

const GotPhotos = () => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        const data = await getPhotosByType(1399, "tv");

        setPhotos(data.images.backdrops.slice(0, 24));
    };

    return (
        <main className="got-gallery">
            <h1>Game of Thrones Photos</h1>

            <div className="got-gallery__grid">
                {photos.map((img) => (
                    <img
                        key={img.file_path}
                        src={getGalleryImageUrl(img.file_path)}
                        alt=""
                    />
                ))}
            </div>
        </main>
    );
};

export default GotPhotos;