import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { House, Compass, Clapperboard, BookOpen, Search } from "lucide-react";
import {
    FaUserCircle,
    FaCog,
    FaLanguage,
    FaGlobe,
    FaRegCommentDots,
    FaMoon,
    FaSun,
    FaSignOutAlt,
} from "react-icons/fa";
import "../styles/header.css";
import logo from "../imgs/logo.svg";
import { getUser, logout } from "../utils/auth";
import { getT } from "../utils/translations";

const defaultUser = {
    name: "User",
    username: "@User",
    avatar: "/default-avatar.png",
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [user, setUser] = useState(defaultUser);

    const [settings, setSettings] = useState({
        language: "en",
        country: "Kazakhstan",
        theme: "dark",
    });

    const [t, setT] = useState(getT());

    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            const savedUser = getUser();

            if (!savedUser) {
                setUser(defaultUser);
                return;
            }

            setUser({
                name: `${savedUser.name || ""} ${savedUser.surname || ""}`.trim() || "User",
                username: savedUser.username?.startsWith("@")
                    ? savedUser.username
                    : `@${savedUser.username || "user"}`,
                avatar: savedUser.avatar || "/default-avatar.png",
            });
        };

        loadUser();
        window.addEventListener("userUpdated", loadUser);

        return () => window.removeEventListener("userUpdated", loadUser);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("watchly_settings");

        if (saved) {
            const parsed = JSON.parse(saved);
            const theme = parsed.theme || "dark";

            setSettings({
                language: parsed.language || "en",
                country: parsed.country || "Kazakhstan",
                theme,
            });

            document.body.setAttribute("data-theme", theme);
        } else {
            document.body.setAttribute("data-theme", "dark");
        }
    }, []);

    const updateSetting = (key, value) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        localStorage.setItem("watchly_settings", JSON.stringify(updated));

        setT(getT());
        window.dispatchEvent(new Event("watchlySettingsUpdated"));

        if (key === "theme") {
            document.body.setAttribute("data-theme", value);
        }
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem("watchly_user_profile");
        setUser(defaultUser);
        setIsMenuOpen(false);
        window.dispatchEvent(new Event("userUpdated"));
        navigate("/login");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        if (!searchValue.trim()) return;

        navigate(`/browse?search=${encodeURIComponent(searchValue.trim())}`);
        setSearchValue("");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setIsMenuOpen(false);
                setOpenSubmenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header__left">
                <Link to="/">
                    <img src={logo} className="header__logo" alt="Watchly" />
                </Link>

                <nav className="header__nav">
                    <NavLink to="/" className="nav__link">
                        <House size={15} /> {t.home}
                    </NavLink>

                    <NavLink to="/browse" className="nav__link">
                        <Compass size={15} /> {t.browse}
                    </NavLink>

                    <NavLink to="/watchlist" className="nav__link">
                        <Clapperboard size={15} /> {t.watchlist}
                    </NavLink>

                    <NavLink to="/blog" className="nav__link">
                        <BookOpen size={15} /> {t.blog}
                    </NavLink>
                </nav>
            </div>

            <div className="header__right">
                <form className="search-box" onSubmit={handleSearchSubmit}>
                    <Search size={16} />
                    <input
                        value={searchValue}
                        placeholder={t.search}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </form>

                <button
                    ref={buttonRef}
                    className="profile-btn"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                    <img src={user.avatar} alt={user.name} />
                </button>

                {isMenuOpen && (
                    <div className="profile-modal" ref={menuRef}>
                        <div className="profile-modal__user">
                            <img src={user.avatar} alt={user.name} />
                            <div>
                                <h3>{user.name}</h3>
                                <p>{user.username}</p>
                            </div>
                        </div>

                        <Link
                            to="/profile"
                            className="profile-modal__item"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FaUserCircle />
                            {t.profile}
                            {/* Profile */}
                        </Link>

                        <Link
                            to="/settings"
                            className="profile-modal__item"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FaCog />
                            {t.settings}
                            {/* Settings */}
                        </Link>

                        <div
                            className="profile-modal__item"
                            onClick={() =>
                                setOpenSubmenu(openSubmenu === "lang" ? null : "lang")
                            }
                        >
                            <FaLanguage />
                            {t.language}
                            {/* Language */}
                        </div>

                        {openSubmenu === "lang" && (
                            <div className="profile-modal__submenu">
                                <button onClick={() => updateSetting("language", "en")}>
                                    English
                                </button>
                                <button onClick={() => updateSetting("language", "ru")}>
                                    Русский
                                </button>
                            </div>
                        )}

                        <div
                            className="profile-modal__item"
                            onClick={() =>
                                setOpenSubmenu(openSubmenu === "country" ? null : "country")
                            }
                        >
                            <FaGlobe />
                            {t.country}
                            {/* Country */}
                        </div>

                        {openSubmenu === "country" && (
                            <div className="profile-modal__submenu">
                                <button onClick={() => updateSetting("country", "Kazakhstan")}>
                                    Kazakhstan
                                </button>
                                <button onClick={() => updateSetting("country", "USA")}>
                                    USA
                                </button>
                            </div>
                        )}

                        <Link
                            to="/feedback"
                            className="profile-modal__item"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FaRegCommentDots />
                            {t.feedback}
                            {/* Feedback */}
                        </Link>

                        <div
                            className="profile-modal__item"
                            onClick={() =>
                                updateSetting(
                                    "theme",
                                    settings.theme === "dark" ? "light" : "dark"
                                )
                            }
                        >
                            {settings.theme === "dark" ? <FaSun /> : <FaMoon />}
                            {settings.theme === "dark" ? t.lightMode : t.darkMode}
                            {/* {settings.theme === "dark" ? "Light Mode" : "Dark Mode"} */}
                        </div>

                        <button
                            type="button"
                            className="profile-modal__logout"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            {t.logout}
                            {/* Logout */}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

// import React, { useEffect, useRef, useState } from "react";
// import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
// import {
//     House,
//     Compass,
//     Clapperboard,
//     BookOpen,
//     Search,
//     UserRound,
// } from "lucide-react";
// import {
//     FaUserCircle,
//     FaCog,
//     FaLanguage,
//     FaGlobe,
//     FaRegCommentDots,
//     FaMoon,
//     FaSun,
//     FaSignOutAlt,
//     FaChevronRight,
// } from "react-icons/fa";
// import "../styles/header.css";
// import logo from "../imgs/logo.svg";
// import { getCurrentUser, logoutUser } from "../utils/auth";

// const Header = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [settings, setSettings] = useState({
//         language: "en",
//         country: "Kazakhstan",
//         theme: "dark",
//     });
//     const [user, setUser] = useState({
//         name: "Pierre Bourne",
//         username: "@pierrchick",
//         avatar: "/default-avatar.png",
//     });

//     const [openSubmenu, setOpenSubmenu] = useState(null);
//     const [searchValue, setSearchValue] = useState("");

//     const menuRef = useRef(null);
//     const buttonRef = useRef(null);

//     const navigate = useNavigate();
//     const location = useLocation();

//     // const user = getCurrentUser();


//     useEffect(() => {
//         const loadUser = () => {
//             const saved = localStorage.getItem("watchly_user_profile");
//             if (!saved) return;

//             const parsed = JSON.parse(saved);

//             setUser({
//                 name: `${parsed.name || ""} ${parsed.surname || ""}`.trim() || "User",
//                 username: parsed.username?.startsWith("@")
//                     ? parsed.username
//                     : `@${parsed.username || "user"}`,
//                 avatar: parsed.avatar || "/default-avatar.png",
//             });
//         };

//         loadUser();
//         window.addEventListener("userUpdated", loadUser);

//         return () => {
//             window.removeEventListener("userUpdated", loadUser);
//         };
//     }, []);

//     useEffect(() => {
//         const saved = localStorage.getItem("watchly_settings");

//         if (saved) {
//             const parsed = JSON.parse(saved);
//             const theme = parsed.theme || "dark";

//             setSettings({
//                 language: parsed.language || "en",
//                 country: parsed.country || "Kazakhstan",
//                 theme,
//             });

//             document.body.setAttribute("data-theme", theme);
//         } else {
//             document.body.setAttribute("data-theme", "dark");
//         }
//     }, []);

//     const updateSetting = (key, value) => {
//         const updated = { ...settings, [key]: value };
//         setSettings(updated);

//         localStorage.setItem("watchly_settings", JSON.stringify(updated));

//         if (key === "theme") {
//             document.body.setAttribute("data-theme", value);
//         }
//     };

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         navigate(`/browse?search=${searchValue}`);
//     };

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (
//                 menuRef.current &&
//                 !menuRef.current.contains(e.target) &&
//                 !buttonRef.current.contains(e.target)
//             ) {
//                 setIsMenuOpen(false);
//                 setOpenSubmenu(null);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     return (
//         <header className="header">
//             <div className="header__left">
//                 <Link to="/">
//                     <img src={logo} className="header__logo" />
//                 </Link>

//                 <nav className="header__nav">
//                     <NavLink to="/" className="nav__link"> <House size={15} /> Home </NavLink>
//                     <NavLink to="/browse" className="nav__link"> <Compass size={15} /> Browse </NavLink>
//                     <NavLink to="/watchlist" className="nav__link"> <Clapperboard size={15} /> Watchlist </NavLink>
//                     <NavLink to="/blog" className="nav__link"> <BookOpen size={15} /> Blog </NavLink>
//                 </nav>
//             </div>

//             <div className="header__right">
//                 <form className="search-box" onSubmit={handleSearchSubmit}>
//                     <Search size={16} />
//                     <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
//                 </form>

//                 <button
//                     ref={buttonRef}
//                     className="profile-btn"
//                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 >
//                     <img src={user.avatar} />
//                 </button>

//                 {isMenuOpen && (
//                     <div className="profile-modal" ref={menuRef}>

//                         <div className="profile-modal__user">
//                             <img src={user.avatar} />
//                             <div>
//                                 <h3>{user.name}</h3>
//                                 <p>{user.username}</p>
//                             </div>
//                         </div>

//                         <Link to="/profile" className="profile-modal__item">
//                             <FaUserCircle /> Profile
//                         </Link>

//                         <Link to="/settings" className="profile-modal__item">
//                             <FaCog /> Settings
//                         </Link>

//                         <div
//                             className="profile-modal__item"
//                             onClick={() => setOpenSubmenu(openSubmenu === "lang" ? null : "lang")}
//                         >
//                             <FaLanguage /> Language
//                         </div>

//                         {openSubmenu === "lang" && (
//                             <div className="profile-modal__submenu">
//                                 <button onClick={() => updateSetting("language", "en")}>English</button>
//                                 <button onClick={() => updateSetting("language", "ru")}>Русский</button>
//                             </div>
//                         )}

//                         <div
//                             className="profile-modal__item"
//                             onClick={() => setOpenSubmenu(openSubmenu === "country" ? null : "country")}
//                         >
//                             <FaGlobe /> Country
//                         </div>

//                         {openSubmenu === "country" && (
//                             <div className="profile-modal__submenu">
//                                 <button onClick={() => updateSetting("country", "Kazakhstan")}>Kazakhstan</button>
//                                 <button onClick={() => updateSetting("country", "USA")}>USA</button>
//                             </div>
//                         )}

//                         <Link to="/feedback" className="profile-modal__item">
//                             <FaRegCommentDots /> Feedback
//                         </Link>

//                         <div
//                             className="profile-modal__item"
//                             onClick={() =>
//                                 updateSetting("theme", settings.theme === "dark" ? "light" : "dark")
//                             }
//                         >
//                             {settings.theme === "dark" ? <FaSun /> : <FaMoon />}
//                             {settings.theme === "dark" ? "Light Mode" : "Dark Mode"}
//                         </div>

//                         <div className="profile-modal__logout">
//                             <FaSignOutAlt /> Logout
//                         </div>

//                     </div>


//                 )}
//             </div>
//         </header>
//     );
// };

// export default Header;