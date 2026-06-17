import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MoviePage from './pages/MoviePage';
import Watchlist from './pages/Watchlist';
import Blog from './pages/Blog';
import PhotosPage from './pages/PhotosPage';
import ChatWidget from './components/ChatWidget';
import Feedback from './pages/Feedback';
import Register from './pages/Register';
import Login from './pages/Login';
import GotPhotos from "./pages/GotPhotos";
import GotVideos from "./pages/GotVideos";
import ReviewPage from "./pages/ReviewPage";

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/details/:type/:id" element={<MoviePage />} />
        <Route path="/details/:type/:id/photos" element={<PhotosPage />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/got/photos" element={<GotPhotos />} />
        <Route path="/got/videos" element={<GotVideos />} />
        <Route path="/details/:type/:id/reviews" element={<ReviewPage />} />
        {/* <Route path="/movie/:id" element={<MoviePage />} /> */}
      </Routes>
      <ChatWidget />
      <Footer />
    </BrowserRouter>
  )
}

export default App
