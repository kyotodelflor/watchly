// const USERS_KEY = "watchly_users";
// const CURRENT_USER_KEY = "watchly_current_user";

// export const getUsers = () => {
//     return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
// };

// export const registerUser = (user) => {
//     const users = getUsers();

//     const exists = users.find(u => u.email === user.email);
//     if (exists) {
//         return { success: false, message: "User already exists" };
//     }

//     users.push(user);
//     localStorage.setItem(USERS_KEY, JSON.stringify(users));

//     localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

//     return { success: true };
// };


// export const loginUser = (email, password) => {
//     const users = getUsers();

//     const user = users.find(
//         u => u.email === email && u.password === password
//     );

//     if (!user) {
//         return { success: false, message: "Invalid credentials" };
//     }

//     localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

//     return { success: true, user };
// };


// export const logoutUser = () => {
//     localStorage.removeItem(CURRENT_USER_KEY);
// };

// export const getCurrentUser = () => {
//     return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
// };

export function saveAuth(data) {
    localStorage.setItem("watchly_token", data.token);
    localStorage.setItem("watchly_user", JSON.stringify(data.user));
}

export function getUser() {
    return JSON.parse(localStorage.getItem("watchly_user"));
}

export function logout() {
    localStorage.removeItem("watchly_token");
    localStorage.removeItem("watchly_user");
}

export function isAuth() {
    return !!localStorage.getItem("watchly_token");
}