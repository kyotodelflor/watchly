const SETTINGS_KEY = "watchly_app_settings";
const FEEDBACK_KEY = "watchly_feedback";

export const defaultSettings = {
    language: "en",
    country: "Kazakhstan",
    theme: "dark",
    notifications: true,
    autoplayTrailers: true,
    matureContent: false,
    preferredContent: "All",
    defaultSort: "Popularity",
};

export function getAppSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return defaultSettings;
        return { ...defaultSettings, ...JSON.parse(raw) };
    } catch (error) {
        console.error("Failed to read settings:", error);
        return defaultSettings;
    }
}

export function saveAppSettings(nextSettings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
        window.dispatchEvent(new Event("watchlySettingsUpdated"));
    } catch (error) {
        console.error("Failed to save settings:", error);
    }
}

export function updateAppSetting(key, value) {
    const current = getAppSettings();
    const updated = {
        ...current,
        [key]: value,
    };
    saveAppSettings(updated);
    return updated;
}

export function applyTheme(theme) {
    const normalized = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-watchly-theme", normalized);
    document.body.classList.toggle("watchly-light", normalized === "light");
}

export function saveFeedback(text) {
    try {
        const current = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
        const updated = [
            {
                id: crypto.randomUUID(),
                text,
                createdAt: new Date().toISOString(),
            },
            ...current,
        ];
        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error("Failed to save feedback:", error);
        return false;
    }
}