import { create } from "zustand";

export const useAuthStore = create(set => ({
    user: JSON.parse(localStorage.getItem("user")) ?? null,
    token: null, // AccessToken stored in memory only (not persisted)
    // RefreshToken is stored in HttpOnly cookie (handled by browser automatically)

    login: (user, token) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, token })
    },

    logout: () => {
        localStorage.removeItem("user");
        set({ user: null, token: null })
    },

    setToken: (token) => {
        set({ token })
    }
}))
