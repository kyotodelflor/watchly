export const translations = {
    en: {
        profile: "Profile",
        settings: "Settings",
        language: "Language",
        country: "Country",
        feedback: "Feedback",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        logout: "Logout",

        preferences: "Preferences",
        settingsTitle: "Settings",
        settingsSubtitle: "Personalize your Watchly experience and keep all your preferences saved.",
        chooseLanguage: "Choose language",
        chooseCountry: "Choose country",
        appearance: "Appearance",
        dark: "Dark",
        light: "Light",
        preferredContent: "Preferred Content",
        defaultContentType: "Default content type",
        browseSorting: "Browse Sorting",
        defaultSortingMode: "Default sorting mode",
        notifications: "Notifications",
        enableNotifications: "Enable notifications",
        notificationsText: "Receive alerts about new releases and updates.",
        autoplayTrailers: "Autoplay trailers",
        autoplayText: "Automatically play previews on movie detail pages.",
        matureContent: "Show mature content",
        matureText: "Allow adult-oriented content in recommendations.",
        currentPreferences: "Current Preferences",
        reset: "Reset",
        saveChanges: "Save Changes",

        account: "Account",
        myProfile: "My Profile",
        profileSubtitle: "View and manage your personal information, avatar, email, and password.",
        editProfile: "Edit Profile",
        cancel: "Cancel",
        saveProfile: "Save Changes",
        personalInfo: "Personal Information",
        name: "Name",
        surname: "Surname",
        username: "Username",
        email: "Email",
        passwordSecurity: "Password & Security",
        currentPassword: "Current Password",
        oldPassword: "Old Password",
        newPassword: "New Password",
        confirmPassword: "Confirm New Password",
        uploadPhoto: "Upload Photo",

        home: "Home",
        browse: "Browse",
        watchlist: "Watchlist",
        blog: "Blog",
        search: "Search...",

        blogJournal: "Watchly Journal",
        blogHeroTitle: "Stories, facts, rankings and ideas from the world of cinema",
        blogHeroDesc:
            "Explore curated articles, iconic movie lists, interesting facts about film culture, and inspiration behind recommendation systems.",

        newArticle: "New Article",

        futureDiscovery: "The future of film discovery is personal",

        futureDiscoveryText:
            "Recommendation engines help viewers find content faster, with less effort and more relevance.",

        readMore: "Read More",

        interestingArticles: "Interesting Articles",
        interestingArticlesDesc:
            "Short reads for movie lovers and streaming fans.",

        cinemaFacts: "Cinema Facts",
        cinemaFactsDesc:
            "Quick facts that make film culture even more interesting.",

        topMovies: "Top 50 Movies",
        topMoviesDesc:
            "A curated list of influential and memorable films.",

        topSeries: "Top 10 Series",
        topSeriesDesc:
            "Series that defined modern streaming culture.",

        frames: "Frames & Stills",
        framesDesc:
            "Visual inspiration from the atmosphere of cinema.",
    },

    ru: {
        profile: "Профиль",
        settings: "Настройки",
        language: "Язык",
        country: "Страна",
        feedback: "Обратная связь",
        lightMode: "Светлая тема",
        darkMode: "Тёмная тема",
        logout: "Выйти",

        preferences: "Параметры",
        settingsTitle: "Настройки",
        settingsSubtitle: "Настройте Watchly под себя и сохраните свои предпочтения.",
        chooseLanguage: "Выберите язык",
        chooseCountry: "Выберите страну",
        appearance: "Внешний вид",
        dark: "Тёмная",
        light: "Светлая",
        preferredContent: "Предпочитаемый контент",
        defaultContentType: "Тип контента по умолчанию",
        browseSorting: "Сортировка",
        defaultSortingMode: "Режим сортировки по умолчанию",
        notifications: "Уведомления",
        enableNotifications: "Включить уведомления",
        notificationsText: "Получать уведомления о новых релизах и обновлениях.",
        autoplayTrailers: "Автовоспроизведение трейлеров",
        autoplayText: "Автоматически запускать превью на страницах фильмов.",
        matureContent: "Показывать взрослый контент",
        matureText: "Разрешить контент 18+ в рекомендациях.",
        currentPreferences: "Текущие настройки",
        reset: "Сбросить",
        saveChanges: "Сохранить",

        account: "Аккаунт",
        myProfile: "Мой профиль",
        profileSubtitle: "Просматривайте и изменяйте личные данные, аватар, email и пароль.",
        editProfile: "Редактировать профиль",
        cancel: "Отмена",
        saveProfile: "Сохранить",
        personalInfo: "Личная информация",
        name: "Имя",
        surname: "Фамилия",
        username: "Никнейм",
        email: "Почта",
        passwordSecurity: "Пароль и безопасность",
        currentPassword: "Текущий пароль",
        oldPassword: "Старый пароль",
        newPassword: "Новый пароль",
        confirmPassword: "Подтвердите новый пароль",
        uploadPhoto: "Загрузить фото",

        home: "Главная",
        browse: "Каталог",
        watchlist: "Список",
        blog: "Блог",
        search: "Поиск...",

        blogJournal: "Журнал Watchly",

        blogHeroTitle:
            "Истории, факты, рейтинги и идеи из мира кино",

        blogHeroDesc:
            "Изучайте статьи, культовые фильмы, интересные факты о киноиндустрии и идеи, лежащие в основе рекомендательных систем.",

        newArticle: "Новая статья",

        futureDiscovery:
            "Будущее поиска фильмов — персонализация",

        futureDiscoveryText:
            "Рекомендательные системы помогают зрителям быстрее находить интересный контент с меньшими усилиями.",

        readMore: "Читать",

        interestingArticles: "Интересные статьи",

        interestingArticlesDesc:
            "Короткие материалы для любителей кино и сериалов.",

        cinemaFacts: "Факты о кино",

        cinemaFactsDesc:
            "Небольшие факты, делающие культуру кино ещё интереснее.",

        topMovies: "Топ 50 фильмов",

        topMoviesDesc:
            "Подборка самых влиятельных и запоминающихся фильмов.",

        topSeries: "Топ 10 сериалов",

        topSeriesDesc:
            "Сериалы, определившие современную стриминговую культуру.",

        frames: "Кадры и атмосфера",

        framesDesc:
            "Визуальное вдохновение из мира кино.",
    },
};

export const getT = () => {
    const settings = JSON.parse(localStorage.getItem("watchly_settings")) || {};
    const lang = settings.language || "en";
    return translations[lang] || translations.en;
};