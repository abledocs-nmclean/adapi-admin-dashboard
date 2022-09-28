import React, { createContext, useState, useContext } from 'react';
import { AuthenticatedUser, retrieveUser, storeUser, clearUserStorage } from './user';
import { ApiError, authorize } from './api';

type AuthState = "None" | "LoggedIn" | "InvalidCredentials" | "Error" | "TokenExpired";

type AuthContextModelBase = {
    authState: AuthState,
    error: unknown,
    user: AuthenticatedUser | null,
    login: (username: string, password: string) => Promise<void>,
    logout: () => void,
    expire: () => void,
};

// let the type checker know that user is not null when authState = LoggedIn, otherwise null
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
    const [error, setError] = useState<unknown>(null);

    async function login(username: string, password: string) {
        let jwt: string | undefined;
        try {
            jwt = await authorize({username, password, ttl: 60 * 60});
        } catch (err) {
            setError(err);
            if (authState === "LoggedIn") {
                clearUser();
            }
            setAuthState(err instanceof ApiError && err.response.status === 401 ? "InvalidCredentials" : "Error");
            throw err;
        }
        const newUser: AuthenticatedUser = {username, jwt};
        storeUser(newUser);
        setUser(newUser);
        setAuthState("LoggedIn");
        setError(null);
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
        <AuthContext.Provider value={{authState, error, user, login, logout, expire} as AuthContextModel}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)!;
}