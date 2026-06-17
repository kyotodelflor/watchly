import React, { useEffect, useState } from "react";
import {
    Globe,
    Languages,
    Moon,
    Bell,
    Film,
    ArrowUpDown,
    RotateCcw,
    Save,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";
import "../styles/settings.css";
import { getT } from "../utils/translations";

const defaultSettings = {
    language: "en",
    country: "Kazakhstan",
    theme: "Dark",
    notifications: true,
    autoplayTrailers: true,
    matureContent: false,
    preferredContent: "all",
    defaultSort: "popularity.desc",
};

const languageLabels = {
    en: "English",
    ru: "Русский",
};

const preferredContentLabels = {
    all: "All",
    movie: "Movies",
    tv: "Series",
};

const sortLabels = {
    "popularity.desc": "Popularity",
    "vote_average.desc": "Rating",
    "primary_release_date.desc": "Newest",
    "original_title.asc": "Alphabetical",
};

const Settings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [saved, setSaved] = useState(false);
    const [t, setT] = useState(getT());

    useEffect(() => {
        const stored = localStorage.getItem("watchly_settings");

        if (stored) {
            const parsed = JSON.parse(stored);
            const merged = { ...defaultSettings, ...parsed };

            setSettings(merged);
            document.body.setAttribute("data-theme", merged.theme);
        } else {
            localStorage.setItem("watchly_settings", JSON.stringify(defaultSettings));
            document.body.setAttribute("data-theme", defaultSettings.theme);
        }
    }, []);

    useEffect(() => {
        const syncLanguage = () => setT(getT());

        window.addEventListener("watchlySettingsUpdated", syncLanguage);

        return () => {
            window.removeEventListener("watchlySettingsUpdated", syncLanguage);
        };
    }, []);

    const handleChange = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));

        if (key === "theme") {
            document.body.setAttribute("data-theme", value);
        }

        setSaved(false);
    };

    const handleToggle = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));

        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem("watchly_settings", JSON.stringify(settings));

        document.body.setAttribute("data-theme", settings.theme);

        window.dispatchEvent(new Event("watchlySettingsUpdated"));
        window.dispatchEvent(new Event("userUpdated"));

        setT(getT());
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2200);
    };

    const handleReset = () => {
        setSettings(defaultSettings);

        localStorage.setItem("watchly_settings", JSON.stringify(defaultSettings));
        document.body.setAttribute("data-theme", defaultSettings.theme);

        window.dispatchEvent(new Event("watchlySettingsUpdated"));
        window.dispatchEvent(new Event("userUpdated"));

        setT(getT());
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2200);
    };

    return (
        <main className="settings-page">
            <div className="settings-page__bg settings-page__bg--one"></div>
            <div className="settings-page__bg settings-page__bg--two"></div>
            <div className="settings-page__bg settings-page__bg--three"></div>

            <div className="settings-page__container">
                <section className="settings-page__header">
                    <div>
                        <p className="settings-page__eyebrow">{t.preferences}</p>
                        <h1>{t.settingsTitle}</h1>
                        <p className="settings-page__subtitle">
                            {t.settingsSubtitle}
                        </p>
                    </div>

                    <div className="settings-page__header-actions">
                        {saved && (
                            <div className="settings-saved">
                                <CheckCircle2 size={16} />
                                <span>Saved</span>
                            </div>
                        )}

                        <button
                            type="button"
                            className="settings-btn settings-btn--ghost"
                            onClick={handleReset}
                        >
                            <RotateCcw size={16} />
                            <span>{t.reset}</span>
                        </button>

                        <button
                            type="button"
                            className="settings-btn settings-btn--primary"
                            onClick={handleSave}
                        >
                            <Save size={16} />
                            <span>{t.saveChanges}</span>
                        </button>
                    </div>
                </section>

                <div className="settings-grid">
                    <section className="settings-card">
                        <div className="settings-card__title">
                            <Languages size={18} />
                            <h2>{t.language}</h2>
                        </div>

                        <label className="settings-field">
                            <span>{t.chooseLanguage}</span>
                            <div className="select-wrapper">
                                <select
                                    value={settings.language}
                                    onChange={(e) =>
                                        handleChange("language", e.target.value)
                                    }
                                >
                                    <option value="en">English</option>
                                    <option value="ru">Русский</option>
                                </select>
                            </div>
                        </label>
                    </section>

                    <section className="settings-card">
                        <div className="settings-card__title">
                            <Globe size={18} />
                            <h2>{t.country}</h2>
                        </div>

                        <label className="settings-field">
                            <span>{t.chooseCountry}</span>
                            <div className="select-wrapper">
                                <select
                                    value={settings.country}
                                    onChange={(e) =>
                                        handleChange("country", e.target.value)
                                    }
                                >
                                    <option>Kazakhstan</option>
                                    <option>USA</option>
                                    <option>UK</option>
                                    <option>Germany</option>
                                    <option>France</option>
                                    <option>Japan</option>
                                    <option>South Korea</option>
                                </select>
                            </div>
                        </label>
                    </section>

                    <section className="settings-card">
                        <div className="settings-card__title">
                            <Moon size={18} />
                            <h2>{t.appearance}</h2>
                        </div>

                        <div className="theme-switcher">
                            <button
                                type="button"
                                className={`theme-option ${settings.theme === "Dark"
                                    ? "theme-option--active"
                                    : ""
                                    }`}
                                onClick={() => handleChange("theme", "Dark")}
                            >
                                {t.dark}
                            </button>

                            <button
                                type="button"
                                className={`theme-option ${settings.theme === "light"
                                    ? "theme-option--active"
                                    : ""
                                    }`}
                                onClick={() => handleChange("theme", "light")}
                            >
                                {t.light}
                            </button>
                        </div>
                    </section>

                    <section className="settings-card">
                        <div className="settings-card__title">
                            <Film size={18} />
                            <h2>{t.preferredContent}</h2>
                        </div>

                        <label className="settings-field">
                            <span>{t.defaultContentType}</span>
                            <div className="select-wrapper">
                                <select
                                    value={settings.preferredContent}
                                    onChange={(e) =>
                                        handleChange("preferredContent", e.target.value)
                                    }
                                >
                                    <option value="all">All</option>
                                    <option value="movie">Movies</option>
                                    <option value="tv">Series</option>
                                </select>
                            </div>
                        </label>
                    </section>

                    <section className="settings-card">
                        <div className="settings-card__title">
                            <ArrowUpDown size={18} />
                            <h2>{t.browseSorting}</h2>
                        </div>

                        <label className="settings-field">
                            <span>{t.defaultSortingMode}</span>
                            <div className="select-wrapper">
                                <select
                                    value={settings.defaultSort}
                                    onChange={(e) =>
                                        handleChange("defaultSort", e.target.value)
                                    }
                                >
                                    <option value="popularity.desc">Popularity</option>
                                    <option value="vote_average.desc">Rating</option>
                                    <option value="primary_release_date.desc">Newest</option>
                                    <option value="original_title.asc">Alphabetical</option>
                                </select>
                            </div>
                        </label>
                    </section>

                    <section className="settings-card settings-card--toggles">
                        <div className="settings-card__title">
                            <Bell size={18} />
                            <h2>{t.notifications}</h2>
                        </div>

                        <div className="toggle-row">
                            <div>
                                <h3>{t.enableNotifications}</h3>
                                <p>{t.notificationsText}</p>
                            </div>
                            <button
                                type="button"
                                className={`toggle ${settings.notifications ? "toggle--on" : ""
                                    }`}
                                onClick={() => handleToggle("notifications")}
                            >
                                <span></span>
                            </button>
                        </div>

                        <div className="toggle-row">
                            <div>
                                <h3>{t.autoplayTrailers}</h3>
                                <p>{t.autoplayText}</p>
                            </div>
                            <button
                                type="button"
                                className={`toggle ${settings.autoplayTrailers ? "toggle--on" : ""
                                    }`}
                                onClick={() => handleToggle("autoplayTrailers")}
                            >
                                <span></span>
                            </button>
                        </div>

                        <div className="toggle-row">
                            <div>
                                <h3>{t.matureContent}</h3>
                                <p>{t.matureText}</p>
                            </div>
                            <button
                                type="button"
                                className={`toggle ${settings.matureContent ? "toggle--on" : ""
                                    }`}
                                onClick={() => handleToggle("matureContent")}
                            >
                                <span></span>
                            </button>
                        </div>
                    </section>

                    <section className="settings-card settings-card--summary">
                        <div className="settings-card__title">
                            <ShieldCheck size={18} />
                            <h2>{t.currentPreferences}</h2>
                        </div>

                        <div className="settings-summary">
                            <div className="settings-summary__item">
                                <span>{t.language}</span>
                                <p>{languageLabels[settings.language]}</p>
                            </div>

                            <div className="settings-summary__item">
                                <span>{t.country}</span>
                                <p>{settings.country}</p>
                            </div>

                            <div className="settings-summary__item">
                                <span>Theme</span>
                                <p>{settings.theme}</p>
                            </div>

                            <div className="settings-summary__item">
                                <span>{t.preferredContent}</span>
                                <p>{preferredContentLabels[settings.preferredContent]}</p>
                            </div>

                            <div className="settings-summary__item">
                                <span>{t.browseSorting}</span>
                                <p>{sortLabels[settings.defaultSort]}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Settings;

// import React, { useEffect, useState } from "react";
// import {
//     Globe,
//     Languages,
//     Moon,
//     Bell,
//     PlayCircle,
//     ShieldCheck,
//     Film,
//     ArrowUpDown,
//     RotateCcw,
//     Save,
//     CheckCircle2,
// } from "lucide-react";
// import "../styles/settings.css";
// import { getT } from "../utils/translations";


// const defaultSettings = {
//     language: "en",
//     country: "Kazakhstan",
//     theme: "dark",
//     notifications: true,
//     autoplayTrailers: true,
//     matureContent: false,
//     preferredContent: "all",
//     defaultSort: "popularity.desc",
// };

// const Settings = () => {
//     const [settings, setSettings] = useState(defaultSettings);
//     const [saved, setSaved] = useState(false);

//     useEffect(() => {
//         const stored = localStorage.getItem("watchly_settings");
//         // const stored = localStorage.getItem("watchly_app_settings");
//         if (stored) {
//             const parsed = JSON.parse(stored);
//             setSettings({ ...defaultSettings, ...parsed });
//         }
//     }, []);

//     useEffect(() => {
//         applyTheme(settings.theme);
//     }, [settings.theme]);

//     useEffect(() => {
//         const syncLanguage = () => setT(getT());

//         window.addEventListener("watchlySettingsUpdated", syncLanguage);

//         return () => {
//             window.removeEventListener("watchlySettingsUpdated", syncLanguage);
//         };
//     }, []);

//     const applyTheme = (theme) => {
//         document.documentElement.setAttribute("data-watchly-theme", theme);
//         document.body.classList.toggle("watchly-light", theme === "light");
//     };

//     const handleChange = (key, value) => {
//         setSettings((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//         setSaved(false);
//     };

//     const handleToggle = (key) => {
//         setSettings((prev) => ({
//             ...prev,
//             [key]: !prev[key],
//         }));
//         setSaved(false);
//     };

//     const handleSave = () => {
//         localStorage.setItem(
//             "watchly_settings",
//             JSON.stringify(settings)
//         );

//         applyTheme(settings.theme);

//         window.dispatchEvent(new Event("watchlySettingsUpdated"));
//         window.dispatchEvent(new Event("userUpdated"));

//         setSaved(true);

//         setTimeout(() => {
//             setSaved(false);
//         }, 2200);

//         setT(getT());
//     };


//     const handleReset = () => {
//         setSettings(defaultSettings);

//         localStorage.setItem(
//             "watchly_settings",
//             JSON.stringify(defaultSettings)
//         );

//         applyTheme(defaultSettings.theme);

//         window.dispatchEvent(new Event("watchlySettingsUpdated"));

//         setSaved(true);

//         setTimeout(() => {
//             setSaved(false);
//         }, 2200);
//     };

//     const [t, setT] = useState(getT());

//     return (
//         <main className="settings-page">
//             <div className="settings-page__bg settings-page__bg--one"></div>
//             <div className="settings-page__bg settings-page__bg--two"></div>
//             <div className="settings-page__bg settings-page__bg--three"></div>

//             <div className="settings-page__container">
//                 <section className="settings-page__header">
//                     <div>
//                         <p className="settings-page__eyebrow">Preferences</p>
//                         <h1>Settings</h1>
//                         <p className="settings-page__subtitle">
//                             Personalize your Watchly experience and keep all your preferences saved.
//                         </p>
//                     </div>

//                     <div className="settings-page__header-actions">
//                         {saved && (
//                             <div className="settings-saved">
//                                 <CheckCircle2 size={16} />
//                                 <span>Saved</span>
//                             </div>
//                         )}

//                         <button
//                             type="button"
//                             className="settings-btn settings-btn--ghost"
//                             onClick={handleReset}
//                         >
//                             <RotateCcw size={16} />
//                             <span>Reset</span>
//                         </button>

//                         <button
//                             type="button"
//                             className="settings-btn settings-btn--primary"
//                             onClick={handleSave}
//                         >
//                             <Save size={16} />
//                             <span>Save Changes</span>
//                         </button>
//                     </div>
//                 </section>

//                 <div className="settings-grid">
//                     <section className="settings-card">
//                         <div className="settings-card__title">
//                             <Languages size={18} />
//                             <h2>Language</h2>
//                         </div>

//                         <label className="settings-field">
//                             <span>Choose language</span>
//                             <div className="select-wrapper">

//                                 <select
//                                     value={settings.language}
//                                     onChange={(e) => handleChange("language", e.target.value)}
//                                 >
//                                     <option value="en">English</option>
//                                     <option value="ru">Русский</option>
//                                 </select>
//                             </div>
//                         </label>
//                     </section>

//                     <section className="settings-card">
//                         <div className="settings-card__title">
//                             <Globe size={18} />
//                             <h2>Country</h2>
//                         </div>

//                         <label className="settings-field">
//                             <span>Choose country</span>
//                             <div className="select-wrapper">
//                                 <select
//                                     value={settings.country}
//                                     onChange={(e) => handleChange("country", e.target.value)}
//                                 >
//                                     <option>Kazakhstan</option>
//                                     <option>USA</option>
//                                     <option>UK</option>
//                                     <option>Germany</option>
//                                     <option>France</option>
//                                     <option>Japan</option>
//                                     <option>South Korea</option>
//                                 </select>
//                             </div>
//                         </label>
//                     </section>

//                     <section className="settings-card">
//                         <div className="settings-card__title">
//                             <Moon size={18} />
//                             <h2>Appearance</h2>
//                         </div>

//                         <div className="theme-switcher">
//                             <button
//                                 type="button"
//                                 className={`theme-option ${settings.theme === "dark" ? "theme-option--active" : ""}`}
//                                 onClick={() => handleChange("theme", "dark")}
//                             >
//                                 Dark
//                             </button>

//                             <button
//                                 type="button"
//                                 className={`theme-option ${settings.theme === "light" ? "theme-option--active" : ""}`}
//                                 onClick={() => handleChange("theme", "light")}
//                             >
//                                 Light
//                             </button>
//                         </div>
//                     </section>

//                     <section className="settings-card">
//                         <div className="settings-card__title">
//                             <Film size={18} />
//                             <h2>Preferred Content</h2>
//                         </div>

//                         <label className="settings-field">
//                             <span>Default content type</span>
//                             <div className="select-wrapper">


//                                 <select
//                                     value={settings.preferredContent}
//                                     onChange={(e) => handleChange("preferredContent", e.target.value)}
//                                 >
//                                     <option value="all">All</option>
//                                     <option value="movie">Movies</option>
//                                     <option value="tv">Series</option>
//                                 </select>
//                             </div>
//                         </label>
//                     </section>

//                     <section className="settings-card">
//                         <div className="settings-card__title">
//                             <ArrowUpDown size={18} />
//                             <h2>Browse Sorting</h2>
//                         </div>

//                         <label className="settings-field">
//                             <span>Default sorting mode</span>
//                             <div className="select-wrapper">


//                                 <select
//                                     value={settings.defaultSort}
//                                     onChange={(e) => handleChange("defaultSort", e.target.value)}
//                                 >
//                                     <option value="popularity.desc">Popularity</option>
//                                     <option value="vote_average.desc">Rating</option>
//                                     <option value="primary_release_date.desc">Newest</option>
//                                     <option value="original_title.asc">Alphabetical</option>
//                                 </select>
//                             </div>
//                         </label>
//                     </section>

//                     <section className="settings-card settings-card--toggles">
//                         <div className="settings-card__title">
//                             <Bell size={18} />
//                             <h2>Notifications</h2>
//                         </div>

//                         <div className="toggle-row">
//                             <div>
//                                 <h3>Enable notifications</h3>
//                                 <p>Receive alerts about new releases and updates.</p>
//                             </div>
//                             <button
//                                 type="button"
//                                 className={`toggle ${settings.notifications ? "toggle--on" : ""}`}
//                                 onClick={() => handleToggle("notifications")}
//                             >
//                                 <span></span>
//                             </button>
//                         </div>

//                         <div className="toggle-row">
//                             <div>
//                                 <h3>Autoplay trailers</h3>
//                                 <p>Automatically play previews on movie detail pages.</p>
//                             </div>
//                             <button
//                                 type="button"
//                                 className={`toggle ${settings.autoplayTrailers ? "toggle--on" : ""}`}
//                                 onClick={() => handleToggle("autoplayTrailers")}
//                             >
//                                 <span></span>
//                             </button>
//                         </div>

//                         <div className="toggle-row">
//                             <div>
//                                 <h3>Show mature content</h3>
//                                 <p>Allow adult-oriented content in recommendations.</p>
//                             </div>
//                             <button
//                                 type="button"
//                                 className={`toggle ${settings.matureContent ? "toggle--on" : ""}`}
//                                 onClick={() => handleToggle("matureContent")}
//                             >
//                                 <span></span>
//                             </button>
//                         </div>
//                     </section>

//                     <section className="settings-card settings-card--summary">
//                         <div className="settings-card__title">
//                             <ShieldCheck size={18} />
//                             <h2>Current Preferences</h2>
//                         </div>

//                         <div className="settings-summary">
//                             <div className="settings-summary__item">
//                                 <span>Language</span>
//                                 <p>{settings.language}</p>
//                             </div>

//                             <div className="settings-summary__item">
//                                 <span>Country</span>
//                                 <p>{settings.country}</p>
//                             </div>

//                             <div className="settings-summary__item">
//                                 <span>Theme</span>
//                                 <p>{settings.theme}</p>
//                             </div>

//                             <div className="settings-summary__item">
//                                 <span>Preferred Content</span>
//                                 <p>{settings.preferredContent}</p>
//                             </div>

//                             <div className="settings-summary__item">
//                                 <span>Sorting</span>
//                                 <p>{settings.defaultSort}</p>
//                             </div>
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default Settings;

