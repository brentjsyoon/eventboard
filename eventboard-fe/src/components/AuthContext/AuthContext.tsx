import React, { createContext, useState, useEffect } from "react";
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({
        accessToken: localStorage.getItem("accessToken"),
        isAuthenticated: false,
        user: null
    });

    useEffect(() => {
        if (auth.accessToken) {
            try {
                const decoded: any = jwtDecode(auth.accessToken);
                if (decoded.exp * 1000 > Date.now()) {
                    setAuth({
                        accessToken: auth.accessToken,
                        isAuthenticated: true,
                        user: decoded
                    });
                } else {
                    logout();
                }
            } catch {
                logout();
            }
        }
    }, []);

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