import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthenticatedUser, retrieveUser, storeUser, clearUserStorage } from './user';
import { ApiError, authorize } from './api';

type AuthState = "None" | "LoggedIn" | "InvalidCredentials" | "Error" | "TokenExpired";

type AuthContextModelBase = {
    authState: AuthState
    user: AuthenticatedUser | null,
    login: (username: string, password: string) => Promise<void>,
    logout: () => void,
    expire: () => void,
};

// let the type checker know that user is not null when authState = LoggedIn
interface AuthContextModelLoggedIn extends AuthContextModelBase {
    authState: "LoggedIn";
    user: AuthenticatedUser;
}
interface AuthContextModelLoggedOut extends AuthContextModelBase {
    authState: "None" | "InvalidCredentials" | "Error" | "TokenExpired";
    user: null;
}
type AuthContextModel = AuthContextModelLoggedIn | AuthContextModelLoggedOut;

const AuthContext = createContext<AuthContextModel | null>(null);

export function AuthProvider({children}: React.PropsWithChildren) {
    const [user, setUser] = useState(retrieveUser);

    const [authState, setAuthState] = useState<AuthState>(() => user ? "LoggedIn" : "None");

    async function login(username: string, password: string) {
        let jwt: string | undefined;
        try {
            jwt = await authorize({username, password});
        } catch (error) {
            if (authState === "LoggedIn") {
                clearUser();
            }
            setAuthState(error instanceof ApiError && error.response.status === 401 ? "InvalidCredentials" : "Error");
            throw error;
        }
        const newUser: AuthenticatedUser = {username, jwt};
        storeUser(newUser);
        setUser(newUser);
        setAuthState("LoggedIn");
    }

    function clearUser() {
        clearUserStorage();
        setUser(null);
    }

    function logout() {
        clearUser();
        setAuthState("None");
    }

    function expire() {
        clearUser();
        setAuthState("TokenExpired");
    }

    return (
        <AuthContext.Provider value={{authState, user, login, logout, expire} as AuthContextModel}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)!;
}