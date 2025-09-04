// auth-store.ts
import { create } from "zustand";
import axios from "axios";
import { error } from "console";

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    image_url?: string | null;
}
interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (data: { email: string, password: string }) => Promise<boolean>;
    logout: () => void;
    hydrate: () => void;
    register: (data: { first_name: string; last_name: string; email: string}) => Promise<boolean>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    setUserAndToken: (user: any, token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    loading: false,
    error: null,

    register: async (data) => {
        set({ loading: true, error: null });
        try {
            await axios.post("http://localhost:5000/api/auth/register", data);
            set({ loading: false });
            
            return true;
        } catch (err: any) {
        set({
            loading: false,
            error: err.response?.data?.message || "Gagal daftar",
        });

        return false;
        }
    },

    login: async(data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", data);
            const { user, token } = res.data.data;

            set({ user , token, loading: false });
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            return true;
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Login gagal", loading: false });
            return false;
        }
    },

    logout: () => {
        set({ user: null, token: null })
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    hydrate: () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            set({ token,user: JSON.parse(user) })
        }
    },

    loginWithGoogle: async (idToken) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post("http://localhost:5000/api/auth/google-login", {
                idToken,
            });
            set({ user: res.data.user, token: res.data.token, loading: false });
        } catch (err: any) {
            set({
                loading: false,
                error: err.response?.data?.message || "Login Google gagal",
            });
        }
    },

    setUserAndToken: (user, token) => set({ user, token }),
}));
