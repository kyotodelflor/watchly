import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedSettings = JSON.parse(localStorage.getItem("watchly_settings") || "{}");
const initialLanguage = savedSettings.language || "en";

const resources = {
    en: {
        translation: {
            nav: {
                home: "Home",
                browse: "Browse",
                watchlist: "Watchlist",
                blog: "Blog",
            },
            search: {
                placeholder: "Search movies",
            },
            profileMenu: {
                profile: "Profile",
                settings: "Settings",
                language: "Language",
                country: "Country",
                leaveFeedback: "Leave feedback",
                lightMode: "Light Mode",
                darkMode: "Dark Mode",
                logout: "Log Out",
            },
            feedback: {
                eyebrow: "Support",
                title: "Leave feedback",
                subtitle:
                    "Share your thoughts, report a bug, or suggest a new feature for Watchly.",
                placeholder: "Write your feedback...",
                submit: "Submit",
                sent: "Sent",
            },
            common: {
                loading: "Loading...",
                noImage: "No Image",
                year: "Year",
                genre: "Genre",
                country: "Country",
                director: "Director",
                highRating: "High Rating",
                resetFilters: "Reset Filters",
                typeOfContent: "Type Of Content",
                movie: "Movie",
                series: "Series",
                all: "All",
            },
            watchlist: {
                myList: "My List",
                title: "Watchlist",
                subtitle: "All saved movies and series in one place.",
                emptyTitle: "Your watchlist is empty",
                emptySubtitle: "Add movies or series from the details page.",
            },
            browse: {
                emptyTitle: "No content found",
                emptySubtitle: "Try changing the selected filters.",
            },
        },
    },
    ru: {
        translation: {
            nav: {
                home: "Главная",
                browse: "Поиск",
                watchlist: "Список",
                blog: "Блог",
            },
            search: {
                placeholder: "Поиск фильмов",
            },
            profileMenu: {
                profile: "Профиль",
                settings: "Настройки",
                language: "Язык",
                country: "Страна",
                leaveFeedback: "Оставить отзыв",
                lightMode: "Светлая тема",
                darkMode: "Тёмная тема",
                logout: "Выйти",
            },
            feedback: {
                eyebrow: "Поддержка",
                title: "Оставить отзыв",
                subtitle:
                    "Поделитесь мнением, сообщите об ошибке или предложите новую функцию для Watchly.",
                placeholder: "Напишите ваш отзыв...",
                submit: "Отправить",
                sent: "Отправлено",
            },
            common: {
                loading: "Загрузка...",
                noImage: "Нет постера",
                year: "Год",
                genre: "Жанр",
                country: "Страна",
                director: "Режиссёр",
                highRating: "Высокий рейтинг",
                resetFilters: "Сбросить фильтры",
                typeOfContent: "Тип контента",
                movie: "Фильм",
                series: "Сериал",
                all: "Все",
            },
            watchlist: {
                myList: "Мой список",
                title: "Список просмотра",
                subtitle: "Все сохранённые фильмы и сериалы в одном месте.",
                emptyTitle: "Ваш список пуст",
                emptySubtitle: "Добавьте фильмы или сериалы со страницы деталей.",
            },
            browse: {
                emptyTitle: "Ничего не найдено",
                emptySubtitle: "Попробуйте изменить выбранные фильтры.",
            },
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;