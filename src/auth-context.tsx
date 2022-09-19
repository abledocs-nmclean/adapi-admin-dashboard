import React, { createContext, useState, useContext, useMemo } from 'react';
import { AuthenticatedUser, retrieveUser, storeUser, clearUserStorage } from './user';
import { ApiError, authorize } from './api';

type AuthContextModel = {
    user: AuthenticatedUser | null,
    login: (username: string, password: string) => Promise<void>,
    logout: (reason?: LogoutReason) => void,
    logoutReason?: LogoutReason
};

type LogoutReason = "AuthenticationFailed" | "TokenExpired" | "Error";

const AuthContext = createContext<AuthContextModel | null>(null);

export function AuthProvider({children}: React.PropsWithChildren) {
    const [user, setUser] = useState(retrieveUser);

    // logoutReason will update when login state changes.
    // When logged in, it will be undefined, otherwise it will be the reason given for the most recent logout
    const [logoutReason, setLogoutReason] = useState<LogoutReason | undefined>();

    async function login(username: string, password: string) {
        let jwt: string | undefined;
        try {
            jwt = await authorize({username, password});
        } catch (error) {
            logout(error instanceof ApiError && error.response.status === 401 ? "AuthenticationFailed" : "Error");
            throw error;
        }
        const newUser: AuthenticatedUser = {username, jwt};
        storeUser(newUser);
        setUser(newUser);
        setLogoutReason(undefined);
    }

    function logout(reason?: LogoutReason) {
        clearUserStorage();
        setUser(null);
        setLogoutReason(reason);
    }

    return (
        <AuthContext.Provider value={{user, login, logout, logoutReason}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)!;
}