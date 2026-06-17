import React from "react";
import Napoleon from "../components/Napoleon";
import TrendingBlock from "../components/TrendingBlock";
import Got from "../components/Got";
import HomeRecommendations from "../components/HomeRecommendations";

const Home = () => {
    return (

        <main className="home">
            <Napoleon />
            <HomeRecommendations />
            <TrendingBlock />
            <Got />
        </main>

    );
};

export default Home;