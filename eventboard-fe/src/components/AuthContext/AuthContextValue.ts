import { createContext } from "react";

export type JwtUser = {
    exp?: number;
    fullName?: string;
    email?: string;
};

export interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    user: JwtUser | null;
}

export const AuthContext = createContext<{
    auth: AuthState;
    login: (token: string) => void;
    logout: () => Promise<void>;
}>({
    auth: { accessToken: null, isAuthenticated: false, user: null },
    login: () => {},
    logout: async () => {},
});
