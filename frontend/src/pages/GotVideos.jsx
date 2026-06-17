import React, { useEffect, useState } from "react";
import { getVideosByType } from "../api/tmdb";
import "../styles/got-videos.css";

const GotVideos = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        const data = await getVideosByType(1399, "tv");

        setVideos(data.results.slice(0, 12));
    };

    return (
        <main className="got-videos">
            <h1>Game of Thrones Videos</h1>

            <div className="got-videos__grid">
                {videos.map((video) => (
                    <iframe
                        key={video.id}
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        allowFullScreen
                    />
                ))}
            </div>
        </main>
    );
};

export default GotVideos;