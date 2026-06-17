import React from "react";
import "../styles/got.css";
import {
    FaRegImage,
    FaVideo,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

import gotBg from "../imgs/gotBg.png";
import explore1 from "../imgs/MoviePosters/vikings.png";
import explore2 from "../imgs/MoviePosters/barbaren.png";
import explore3 from "../imgs/MoviePosters/knightfall.png";

const exploreMovies = [
    {
        id: 44217,
        type: "tv",
        img: "https://image.tmdb.org/t/p/w500/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg",
        alt: "Vikings",
    },
    {
        id: 93785,
        type: "tv",
        img: "https://image.pmgstatic.com/cache/resized/w420/files/images/film/posters/165/100/165100816_fddb1a.jpg",
        alt: "Barbarians",
    },
    {
        id: 73117,
        type: "tv",
        img: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p14604048_b_v8_aa.jpg",
        alt: "Knightfall",
    },
    {
        id: 63333,
        type: "tv",
        img: "https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg",
        alt: "The Last Kingdom",
    },
    {
        id: 652,
        type: "movie",
        img: "https://image.tmdb.org/t/p/w500/a07wLy4ONfpsjnBqMwhlWTJTcm.jpg",
        alt: "Troy",
    },
    {
        id: 98,
        type: "movie",
        img: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
        alt: "Gladiator",
    },
];

const genres = [
    "Epic",
    "Dark Fantasy",
    "Action",
    "Psychological Drama",
    "Adventure",
    "Sword & Sorcery",
    "Tragedy",
];

const Got = () => {
    return (
        <section className="got">
            <img src={gotBg} alt="Game of Thrones" className="got__bg" />

            <div className="got__overlay got__overlay--dark"></div>
            <div className="got__overlay got__overlay--left"></div>
            <div className="got__overlay got__overlay--bottom"></div>
            <div className="got__overlay got__overlay--blue"></div>

            <div className="got__container">
                <div className="got__top">
                    <div className="got__left">
                        <p className="got__description">
                            Nine noble families fight for control over the lands of Westeros,
                            while an ancient enemy returns after being dormant for millennia.
                        </p>

                        <div className="got__genres">
                            {genres.map((genre) => (
                                <span key={genre} className="got__genre">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        <div className="got__info-row">
                            <div className="got__cards">
                                <Link to="/got/photos" className="got__media-card">
                                    <FaRegImage className="got__media-icon" />
                                    <span>Photos</span>
                                </Link>

                                <Link to="/got/videos" className="got__media-card">
                                    <FaVideo className="got__media-icon" />
                                    <span>Videos</span>
                                </Link>
                                {/* <div className="got__media-card">
                                    <FaRegImage className="got__media-icon" />
                                    <span>Photos</span>
                                </div>

                                <div className="got__media-card">
                                    <FaVideo className="got__media-icon" />
                                    <span>Videos</span>
                                </div> */}
                            </div>

                            <div className="got__meta">
                                <p>Creators: David Benioff &amp; D.B. Weiss</p>
                                <p>Stars: Emilia Clarke &amp; Peter Dinklage &amp; Kit Harington</p>
                            </div>
                        </div>
                    </div>

                    <div className="got__right">
                        <div className="got__explore-title">
                            <span className="got__explore-line"></span>
                            <h3>More To Explore</h3>
                        </div>

                        <div className="got__explore-scroll">
                            <div className="got__explore-list">
                                {exploreMovies.map((item) => (
                                    <Link
                                        to={`/details/${item.type}/${item.id}`}
                                        className="got__explore-card"
                                        key={`${item.type}-${item.id}`}
                                    >
                                        <img src={item.img} alt={item.alt} />

                                        <div className="got__explore-overlay">
                                            <span>{item.alt}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="got__logo">
                    <h1>GAME OF</h1>
                    <h1>THRONES</h1>
                </div>
            </div>
        </section>
    );
};

export default Got;
