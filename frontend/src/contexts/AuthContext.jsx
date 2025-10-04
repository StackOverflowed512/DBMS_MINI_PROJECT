import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get("/api/auth/me");
            setUser(response.data.data);
        } catch (error) {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post("/api/auth/login", {
                email,
                password,
            });
            const { token, ...userData } = response.data.data;

            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post("/api/auth/register", userData);
            const { token, ...userInfo } = response.data.data;

            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(userInfo);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
