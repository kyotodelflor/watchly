// import React, { useEffect, useRef, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { getUser, saveAuth } from "../utils/auth";
// import {
//     Eye,
//     EyeOff,
//     Upload,
//     UserRound,
//     Mail,
//     LockKeyhole,
//     PencilLine,
//     Save,
//     X,
//     CheckCircle2,
//     TriangleAlert,
// } from "lucide-react";
// import "../styles/profile.css";

// const defaultUser = {
//     name: "Alex",
//     surname: "Wesker",
//     username: "alexwesker01",
//     email: "alex@email.com",
//     password: "12345678",
//     avatar: "",
// };

// const Profile = () => {
//     const [user, setUser] = useState(defaultUser);
//     const [draftUser, setDraftUser] = useState(defaultUser);
//     const [editMode, setEditMode] = useState(false);

//     const [showMainPassword, setShowMainPassword] = useState(false);
//     const [showOldPassword, setShowOldPassword] = useState(false);
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const [passwordForm, setPasswordForm] = useState({
//         oldPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });

//     const [errors, setErrors] = useState({
//         email: "",
//         oldPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//         general: "",
//     });

//     const [message, setMessage] = useState({
//         type: "",
//         text: "",
//     });

//     const fileInputRef = useRef(null);

//     useEffect(() => {
//         const savedUser = getUser();

//         if (savedUser) {
//             const normalizedUser = {
//                 ...savedUser,
//                 password: "********",
//             };

//             setUser(normalizedUser);
//             setDraftUser(normalizedUser);
//         }
//     }, []);

//     const validateEmail = (email) => {
//         return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
//     };

//     const resetMessages = () => {
//         setErrors({
//             email: "",
//             oldPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//             general: "",
//         });

//         setMessage({
//             type: "",
//             text: "",
//         });
//     };

//     const handleEditToggle = () => {
//         setDraftUser(user);
//         setEditMode(true);
//         resetMessages();
//     };

//     const handleCancel = () => {
//         setDraftUser(user);
//         setPasswordForm({
//             oldPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//         });
//         setEditMode(false);
//         resetMessages();
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setDraftUser((prev) => ({
//             ...prev,
//             [name]: value,
//         }));

//         if (name === "email") {
//             setErrors((prev) => ({
//                 ...prev,
//                 email: "",
//             }));
//         }
//     };

//     const handlePasswordFormChange = (e) => {
//         const { name, value } = e.target;

//         setPasswordForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));

//         setErrors((prev) => ({
//             ...prev,
//             oldPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//             general: "",
//         }));
//     };

//     const handleAvatarUpload = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         if (!file.type.startsWith("image/")) {
//             setMessage({
//                 type: "error",
//                 text: "Please upload an image file.",
//             });
//             return;
//         }

//         const reader = new FileReader();

//         reader.onloadend = () => {
//             setDraftUser((prev) => ({
//                 ...prev,
//                 avatar: reader.result,
//             }));

//             setMessage({
//                 type: "success",
//                 text: "Avatar uploaded successfully.",
//             });
//         };

//         reader.readAsDataURL(file);
//     };

//     const validateProfile = () => {
//         let hasError = false;

//         const nextErrors = {
//             email: "",
//             oldPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//             general: "",
//         };

//         if (!validateEmail(draftUser.email)) {
//             nextErrors.email = "Please enter a valid email address.";
//             hasError = true;
//         }

//         const wantsToChangePassword =
//             passwordForm.newPassword || passwordForm.confirmPassword;

//         if (wantsToChangePassword) {


//             if (passwordForm.newPassword.length < 6) {
//                 nextErrors.newPassword = "New password must be at least 6 characters.";
//                 hasError = true;
//             }


//             if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//                 nextErrors.confirmPassword = "Passwords do not match.";
//                 hasError = true;
//             }
//         }

//         setErrors(nextErrors);
//         return !hasError;
//     };

//     const handleSave = () => {
//         resetMessages();

//         const isValid = validateProfile();

//         if (!isValid) {
//             setMessage({
//                 type: "error",
//                 text: "Please fix the highlighted fields.",
//             });
//             return;
//         }

//         const updatedUser = {
//             ...draftUser,
//             password: passwordForm.newPassword ? passwordForm.newPassword : user.password,
//         };

//         setUser(updatedUser);
//         setDraftUser(updatedUser);


//         const currentAuthUser = getUser();

//         const userForStorage = {
//             ...currentAuthUser,
//             name: updatedUser.name,
//             surname: updatedUser.surname,
//             username: updatedUser.username,
//             email: updatedUser.email,
//             avatar: updatedUser.avatar,
//         };

//         localStorage.setItem("watchly_user", JSON.stringify(userForStorage));
//         localStorage.setItem("watchly_user_profile", JSON.stringify(userForStorage));
//         window.dispatchEvent(new Event("userUpdated"));

//         setPasswordForm({
//             oldPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//         });

//         setEditMode(false);

//         setMessage({
//             type: "success",
//             text: "Profile updated successfully.",
//         });
//     };

//     const getInitials = () => {
//         const first = draftUser.name?.[0] || "";
//         const second = draftUser.surname?.[0] || "";
//         return `${first}${second}`.toUpperCase();
//     };

//     if (!getUser()) {
//         return <Navigate to="/login" replace />;
//     }

//     return (
//         <main className="profile-page">
//             <div className="profile-page__glow profile-page__glow--left"></div>
//             <div className="profile-page__glow profile-page__glow--right"></div>

//             <div className="profile-page__container">
//                 <div className="profile-page__header">
//                     <div>
//                         <p className="profile-page__eyebrow">Account</p>
//                         <h1 className="profile-page__title">My Profile</h1>
//                         <p className="profile-page__subtitle">
//                             View and manage your personal information, avatar, email, and password.
//                         </p>
//                     </div>

//                     <div className="profile-page__header-actions">
//                         {!editMode ? (
//                             <button
//                                 type="button"
//                                 className="profile-action-btn profile-action-btn--edit"
//                                 onClick={handleEditToggle}
//                             >
//                                 <PencilLine size={16} />
//                                 <span>Edit Profile</span>
//                             </button>
//                         ) : (
//                             <>
//                                 <button
//                                     type="button"
//                                     className="profile-action-btn profile-action-btn--ghost"
//                                     onClick={handleCancel}
//                                 >
//                                     <X size={16} />
//                                     <span>Cancel</span>
//                                 </button>

//                                 <button
//                                     type="button"
//                                     className="profile-action-btn profile-action-btn--save"
//                                     onClick={handleSave}
//                                 >
//                                     <Save size={16} />
//                                     <span>Save Changes</span>
//                                 </button>
//                             </>
//                         )}
//                     </div>
//                 </div>

//                 {message.text && (
//                     <div
//                         className={`profile-alert ${message.type === "success"
//                             ? "profile-alert--success"
//                             : "profile-alert--error"
//                             }`}
//                     >
//                         {message.type === "success" ? (
//                             <CheckCircle2 size={18} />
//                         ) : (
//                             <TriangleAlert size={18} />
//                         )}
//                         <span>{message.text}</span>
//                     </div>
//                 )}

//                 <div className="profile-card">
//                     <div className="profile-card__sidebar">
//                         <div className="profile-avatar-box">
//                             <div className="profile-avatar">
//                                 {draftUser.avatar ? (
//                                     <img src={draftUser.avatar} alt="User avatar" />
//                                 ) : (
//                                     <span>{getInitials()}</span>
//                                 )}
//                             </div>

//                             {editMode && (
//                                 <>
//                                     <input
//                                         ref={fileInputRef}
//                                         type="file"
//                                         accept="image/*"
//                                         className="profile-hidden-file"
//                                         onChange={handleAvatarUpload}
//                                         hidden
//                                     />

//                                     <button
//                                         type="button"
//                                         className="upload-btn"
//                                         onClick={() => fileInputRef.current?.click()}
//                                     >
//                                         <Upload size={16} />
//                                         <span>Upload Photo</span>
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         <div className="profile-summary">
//                             <h2>
//                                 {draftUser.name} {draftUser.surname}
//                             </h2>
//                             <p>@{draftUser.username}</p>
//                         </div>
//                     </div>

//                     <div className="profile-card__content">
//                         <section className="profile-section">
//                             <h3 className="profile-section__title">Personal Information</h3>

//                             <div className="profile-grid">
//                                 <div className="profile-field">
//                                     <label>
//                                         <UserRound size={16} />
//                                         <span>Name</span>
//                                     </label>
//                                     {editMode ? (
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             value={draftUser.name}
//                                             onChange={handleChange}
//                                             placeholder="Enter your name"
//                                         />
//                                     ) : (
//                                         <div className="profile-value">{user.name}</div>
//                                     )}
//                                 </div>

//                                 <div className="profile-field">
//                                     <label>
//                                         <UserRound size={16} />
//                                         <span>Surname</span>
//                                     </label>
//                                     {editMode ? (
//                                         <input
//                                             type="text"
//                                             name="surname"
//                                             value={draftUser.surname}
//                                             onChange={handleChange}
//                                             placeholder="Enter your surname"
//                                         />
//                                     ) : (
//                                         <div className="profile-value">{user.surname}</div>
//                                     )}
//                                 </div>

//                                 <div className="profile-field">
//                                     <label>
//                                         <UserRound size={16} />
//                                         <span>Username</span>
//                                     </label>
//                                     {editMode ? (
//                                         <input
//                                             type="text"
//                                             name="username"
//                                             value={draftUser.username}
//                                             onChange={handleChange}
//                                             placeholder="Enter your username"
//                                         />
//                                     ) : (
//                                         <div className="profile-value">@{user.username}</div>
//                                     )}
//                                 </div>

//                                 <div className="profile-field">
//                                     <label>
//                                         <Mail size={16} />
//                                         <span>Email</span>
//                                     </label>
//                                     {editMode ? (
//                                         <>
//                                             <input
//                                                 type="email"
//                                                 name="email"
//                                                 value={draftUser.email}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter your email"
//                                                 className={errors.email ? "input-error" : ""}
//                                             />
//                                             {errors.email && (
//                                                 <small className="field-error">{errors.email}</small>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <div className="profile-value">{user.email}</div>
//                                     )}
//                                 </div>
//                             </div>
//                         </section>

//                         <section className="profile-section">
//                             <h3 className="profile-section__title">Password & Security</h3>

//                             <div className="profile-password-preview">
//                                 <label>
//                                     <LockKeyhole size={16} />
//                                     <span>Current Password</span>
//                                 </label>

//                                 <div className="password-preview-box">
//                                     <span>
//                                         {showMainPassword ? user.password : "•".repeat(user.password.length)}
//                                     </span>
//                                     <button
//                                         type="button"
//                                         className="password-toggle-btn"
//                                         onClick={() => setShowMainPassword((prev) => !prev)}
//                                     >
//                                         {showMainPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                     </button>
//                                 </div>
//                             </div>

//                             {editMode && (
//                                 <div className="profile-password-grid">
//                                     <div className="profile-field">
//                                         <label>
//                                             <LockKeyhole size={16} />
//                                             <span>Old Password</span>
//                                         </label>
//                                         <div
//                                             className={`password-input-wrap ${errors.oldPassword ? "input-error-wrap" : ""
//                                                 }`}
//                                         >
//                                             <input
//                                                 type={showOldPassword ? "text" : "password"}
//                                                 name="oldPassword"
//                                                 value={passwordForm.oldPassword}
//                                                 onChange={handlePasswordFormChange}
//                                                 placeholder="Enter old password"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="password-toggle-btn"
//                                                 onClick={() => setShowOldPassword((prev) => !prev)}
//                                             >
//                                                 {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                             </button>
//                                         </div>
//                                         {errors.oldPassword && (
//                                             <small className="field-error">{errors.oldPassword}</small>
//                                         )}
//                                     </div>

//                                     <div className="profile-field">
//                                         <label>
//                                             <LockKeyhole size={16} />
//                                             <span>New Password</span>
//                                         </label>
//                                         <div
//                                             className={`password-input-wrap ${errors.newPassword ? "input-error-wrap" : ""
//                                                 }`}
//                                         >
//                                             <input
//                                                 type={showNewPassword ? "text" : "password"}
//                                                 name="newPassword"
//                                                 value={passwordForm.newPassword}
//                                                 onChange={handlePasswordFormChange}
//                                                 placeholder="Enter new password"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="password-toggle-btn"
//                                                 onClick={() => setShowNewPassword((prev) => !prev)}
//                                             >
//                                                 {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                             </button>
//                                         </div>
//                                         {errors.newPassword && (
//                                             <small className="field-error">{errors.newPassword}</small>
//                                         )}
//                                     </div>

//                                     <div className="profile-field profile-field--full">
//                                         <label>
//                                             <LockKeyhole size={16} />
//                                             <span>Confirm New Password</span>
//                                         </label>
//                                         <div
//                                             className={`password-input-wrap ${errors.confirmPassword ? "input-error-wrap" : ""
//                                                 }`}
//                                         >
//                                             <input
//                                                 type={showConfirmPassword ? "text" : "password"}
//                                                 name="confirmPassword"
//                                                 value={passwordForm.confirmPassword}
//                                                 onChange={handlePasswordFormChange}
//                                                 placeholder="Repeat new password"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="password-toggle-btn"
//                                                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                                             >
//                                                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                             </button>
//                                         </div>
//                                         {errors.confirmPassword && (
//                                             <small className="field-error">{errors.confirmPassword}</small>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </section>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default Profile;

import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Upload,
    UserRound,
    Mail,
    LockKeyhole,
    PencilLine,
    Save,
    X,
    CheckCircle2,
    TriangleAlert,
} from "lucide-react";
import "../styles/profile.css";
import { getUser } from "../utils/auth";
import { getT } from "../utils/translations";

const defaultUser = {
    name: "User",
    surname: "",
    username: "user",
    email: "user@email.com",
    password: "********",
    avatar: "",
};

const Profile = () => {
    const [user, setUser] = useState(defaultUser);
    const [draftUser, setDraftUser] = useState(defaultUser);
    const [editMode, setEditMode] = useState(false);
    const [t, setT] = useState(getT());

    const [showMainPassword, setShowMainPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        general: "",
    });

    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        const savedUser = getUser();

        if (savedUser) {
            const normalizedUser = {
                ...defaultUser,
                ...savedUser,
                password: "********",
            };

            setUser(normalizedUser);
            setDraftUser(normalizedUser);
        }
    }, []);

    useEffect(() => {
        const syncLanguage = () => setT(getT());

        window.addEventListener("watchlySettingsUpdated", syncLanguage);

        return () => {
            window.removeEventListener("watchlySettingsUpdated", syncLanguage);
        };
    }, []);

    if (!getUser()) {
        return <Navigate to="/login" replace />;
    }

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
    };

    const resetMessages = () => {
        setErrors({
            email: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            general: "",
        });

        setMessage({
            type: "",
            text: "",
        });
    };

    const handleEditToggle = () => {
        setDraftUser(user);
        setEditMode(true);
        resetMessages();
    };

    const handleCancel = () => {
        setDraftUser(user);
        setPasswordForm({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setEditMode(false);
        resetMessages();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDraftUser((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "email") {
            setErrors((prev) => ({
                ...prev,
                email: "",
            }));
        }
    };

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            general: "",
        }));
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage({
                type: "error",
                text: "Please upload an image file.",
            });
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setDraftUser((prev) => ({
                ...prev,
                avatar: reader.result,
            }));

            setMessage({
                type: "success",
                text: "Avatar uploaded successfully.",
            });
        };

        reader.readAsDataURL(file);
    };

    const validateProfile = () => {
        let hasError = false;

        const nextErrors = {
            email: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            general: "",
        };

        if (!validateEmail(draftUser.email)) {
            nextErrors.email = "Please enter a valid email address.";
            hasError = true;
        }

        const wantsToChangePassword =
            passwordForm.newPassword || passwordForm.confirmPassword;

        if (wantsToChangePassword) {
            if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
                nextErrors.newPassword =
                    "New password must be at least 6 characters.";
                hasError = true;
            }

            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                nextErrors.confirmPassword = "Passwords do not match.";
                hasError = true;
            }
        }

        setErrors(nextErrors);
        return !hasError;
    };

    const handleSave = () => {
        resetMessages();

        const isValid = validateProfile();

        if (!isValid) {
            setMessage({
                type: "error",
                text: "Please fix the highlighted fields.",
            });
            return;
        }

        const currentAuthUser = getUser();

        const userForStorage = {
            ...currentAuthUser,
            name: draftUser.name,
            surname: draftUser.surname,
            username: draftUser.username,
            email: draftUser.email,
            avatar: draftUser.avatar,
        };

        const updatedUser = {
            ...userForStorage,
            password: "********",
        };

        setUser(updatedUser);
        setDraftUser(updatedUser);

        localStorage.setItem("watchly_user", JSON.stringify(userForStorage));
        localStorage.setItem("watchly_user_profile", JSON.stringify(userForStorage));

        window.dispatchEvent(new Event("userUpdated"));

        setPasswordForm({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setEditMode(false);

        setMessage({
            type: "success",
            text: "Profile updated successfully.",
        });
    };

    const getInitials = () => {
        const first = draftUser.name?.[0] || "";
        const second = draftUser.surname?.[0] || "";
        return `${first}${second}`.toUpperCase() || "U";
    };

    return (
        <main className="profile-page">
            <div className="profile-page__glow profile-page__glow--left"></div>
            <div className="profile-page__glow profile-page__glow--right"></div>

            <div className="profile-page__container">
                <div className="profile-page__header">
                    <div>
                        <p className="profile-page__eyebrow">{t.account}</p>
                        <h1 className="profile-page__title">{t.myProfile}</h1>
                        <p className="profile-page__subtitle">
                            {t.profileSubtitle}
                        </p>
                    </div>

                    <div className="profile-page__header-actions">
                        {!editMode ? (
                            <button
                                type="button"
                                className="profile-action-btn profile-action-btn--edit"
                                onClick={handleEditToggle}
                            >
                                <PencilLine size={16} />
                                <span>{t.editProfile}</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="profile-action-btn profile-action-btn--ghost"
                                    onClick={handleCancel}
                                >
                                    <X size={16} />
                                    <span>{t.cancel}</span>
                                </button>

                                <button
                                    type="button"
                                    className="profile-action-btn profile-action-btn--save"
                                    onClick={handleSave}
                                >
                                    <Save size={16} />
                                    <span>{t.saveProfile}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {message.text && (
                    <div
                        className={`profile-alert ${message.type === "success"
                                ? "profile-alert--success"
                                : "profile-alert--error"
                            }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle2 size={18} />
                        ) : (
                            <TriangleAlert size={18} />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="profile-card">
                    <div className="profile-card__sidebar">
                        <div className="profile-avatar-box">
                            <div className="profile-avatar">
                                {draftUser.avatar ? (
                                    <img src={draftUser.avatar} alt="User avatar" />
                                ) : (
                                    <span>{getInitials()}</span>
                                )}
                            </div>

                            {editMode && (
                                <>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="profile-hidden-file"
                                        onChange={handleAvatarUpload}
                                        hidden
                                    />

                                    <button
                                        type="button"
                                        className="upload-btn"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload size={16} />
                                        <span>{t.uploadPhoto}</span>
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="profile-summary">
                            <h2>
                                {draftUser.name} {draftUser.surname}
                            </h2>
                            <p>@{draftUser.username}</p>
                        </div>
                    </div>

                    <div className="profile-card__content">
                        <section className="profile-section">
                            <h3 className="profile-section__title">
                                {t.personalInfo}
                            </h3>

                            <div className="profile-grid">
                                <div className="profile-field">
                                    <label>
                                        <UserRound size={16} />
                                        <span>{t.name}</span>
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={draftUser.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                        />
                                    ) : (
                                        <div className="profile-value">{user.name}</div>
                                    )}
                                </div>

                                <div className="profile-field">
                                    <label>
                                        <UserRound size={16} />
                                        <span>{t.surname}</span>
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="surname"
                                            value={draftUser.surname}
                                            onChange={handleChange}
                                            placeholder="Enter your surname"
                                        />
                                    ) : (
                                        <div className="profile-value">
                                            {user.surname}
                                        </div>
                                    )}
                                </div>

                                <div className="profile-field">
                                    <label>
                                        <UserRound size={16} />
                                        <span>{t.username}</span>
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={draftUser.username}
                                            onChange={handleChange}
                                            placeholder="Enter your username"
                                        />
                                    ) : (
                                        <div className="profile-value">
                                            @{user.username}
                                        </div>
                                    )}
                                </div>

                                <div className="profile-field">
                                    <label>
                                        <Mail size={16} />
                                        <span>{t.email}</span>
                                    </label>
                                    {editMode ? (
                                        <>
                                            <input
                                                type="email"
                                                name="email"
                                                value={draftUser.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                className={errors.email ? "input-error" : ""}
                                            />
                                            {errors.email && (
                                                <small className="field-error">
                                                    {errors.email}
                                                </small>
                                            )}
                                        </>
                                    ) : (
                                        <div className="profile-value">{user.email}</div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h3 className="profile-section__title">
                                {t.passwordSecurity}
                            </h3>

                            <div className="profile-password-preview">
                                <label>
                                    <LockKeyhole size={16} />
                                    <span>{t.currentPassword}</span>
                                </label>

                                <div className="password-preview-box">
                                    <span>
                                        {showMainPassword
                                            ? user.password
                                            : "•".repeat(user.password.length)}
                                    </span>
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() =>
                                            setShowMainPassword((prev) => !prev)
                                        }
                                    >
                                        {showMainPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {editMode && (
                                <div className="profile-password-grid">
                                    <div className="profile-field">
                                        <label>
                                            <LockKeyhole size={16} />
                                            <span>{t.oldPassword}</span>
                                        </label>
                                        <div
                                            className={`password-input-wrap ${errors.oldPassword
                                                    ? "input-error-wrap"
                                                    : ""
                                                }`}
                                        >
                                            <input
                                                type={
                                                    showOldPassword ? "text" : "password"
                                                }
                                                name="oldPassword"
                                                value={passwordForm.oldPassword}
                                                onChange={handlePasswordFormChange}
                                                placeholder="Enter old password"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() =>
                                                    setShowOldPassword((prev) => !prev)
                                                }
                                            >
                                                {showOldPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.oldPassword && (
                                            <small className="field-error">
                                                {errors.oldPassword}
                                            </small>
                                        )}
                                    </div>

                                    <div className="profile-field">
                                        <label>
                                            <LockKeyhole size={16} />
                                            <span>{t.newPassword}</span>
                                        </label>
                                        <div
                                            className={`password-input-wrap ${errors.newPassword
                                                    ? "input-error-wrap"
                                                    : ""
                                                }`}
                                        >
                                            <input
                                                type={
                                                    showNewPassword ? "text" : "password"
                                                }
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordFormChange}
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() =>
                                                    setShowNewPassword((prev) => !prev)
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <small className="field-error">
                                                {errors.newPassword}
                                            </small>
                                        )}
                                    </div>

                                    <div className="profile-field profile-field--full">
                                        <label>
                                            <LockKeyhole size={16} />
                                            <span>{t.confirmPassword}</span>
                                        </label>
                                        <div
                                            className={`password-input-wrap ${errors.confirmPassword
                                                    ? "input-error-wrap"
                                                    : ""
                                                }`}
                                        >
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="confirmPassword"
                                                value={
                                                    passwordForm.confirmPassword
                                                }
                                                onChange={handlePasswordFormChange}
                                                placeholder="Repeat new password"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (prev) => !prev
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <small className="field-error">
                                                {errors.confirmPassword}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;