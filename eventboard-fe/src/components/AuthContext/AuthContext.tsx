import React, { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    user: any | null;
}

export const AuthContext = createContext<{
    auth: AuthState;
    login: (token: string) => void;
    logout: () => void;
}>({
    auth: { accessToken: null, isAuthenticated: false, user: null },
    login: () => {},
    logout: () => {}
});

const getInitialAuth = (): AuthState => {
    const token = localStorage.getItem("accessToken");
    if (!token) return { accessToken: null, isAuthenticated: false, user: null };

    try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
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

    const login = (token: string) => {
        localStorage.setItem("accessToken", token);
        const decoded: any = jwtDecode(token);
        setAuth({ accessToken: token, isAuthenticated: true, user: decoded });
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuth({ accessToken: null, isAuthenticated: false, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};