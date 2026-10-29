import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext, type AuthState, type JwtUser } from "./AuthContextValue";

const getInitialAuth = (): AuthState => {
    localStorage.removeItem("refreshToken");
    const token = localStorage.getItem("accessToken");
    if (!token) return { accessToken: null, isAuthenticated: false, user: null };

    try {
        const decoded = jwtDecode<JwtUser>(token);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            return { accessToken: token, isAuthenticated: true, user: decoded };
        } else {
            localStorage.removeItem("accessToken");
            return { accessToken: null, isAuthenticated: false, user: null };
        }
    } catch {
        localStorage.removeItem("accessToken");
        return { accessToken: null, isAuthenticated: false, user: null };
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>(getInitialAuth);

    const acceptToken = (token: string) => {
        const decoded = jwtDecode<JwtUser>(token);
        localStorage.setItem("accessToken", token);
        setAuth({ accessToken: token, isAuthenticated: true, user: decoded });
    };

    useEffect(() => {
        let active = true;
        const refreshSession = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER}/token`, {
                    method: "POST",
                    credentials: "include",
                });
                if (!response.ok || !active) return;
                const { accessToken } = await response.json();
                const decoded = jwtDecode<JwtUser>(accessToken);
                localStorage.setItem("accessToken", accessToken);
                setAuth({ accessToken, isAuthenticated: true, user: decoded });
            } catch (error) {
                console.error("Unable to refresh session:", error);
            }
        };
        void refreshSession();

        const interval = window.setInterval(() => {
            if (active) void refreshSession();
        }, 14 * 60 * 1000);
        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, []);

    const login = (token: string) => {
        acceptToken(token);
    };

    const logout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER}/logout`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error(`Logout failed with status ${response.status}`);
        } catch (error) {
            console.error("Unable to revoke session:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setAuth({ accessToken: null, isAuthenticated: false, user: null });
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};