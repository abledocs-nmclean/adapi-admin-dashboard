import React, { createContext, useState, useContext } from 'react';
import { QueryObserverBaseResult } from '@tanstack/react-query';
import { AuthenticatedUser, retrieveUser, storeUser, clearUserStorage } from './user';
import { ApiError, authorize } from './api';

type AuthContextModel = {
    user: AuthenticatedUser | null,
    login: (username: string, password: string) => Promise<void>,
    logout: () => void
};

const AuthContext = createContext<AuthContextModel | null>(null);

export function AuthProvider({children}: React.PropsWithChildren) {
    const [user, setUser] = useState(retrieveUser);

    async function login(username: string, password: string) {
        let jwt: string | undefined;
        try {
            jwt = await authorize({username, password});
        } catch (err) {
            if (user !== null) {
                logout();
            }
            throw err;
        }
        const newUser: AuthenticatedUser = {username, jwt};
        storeUser(newUser);
        setUser(newUser);
    }

    function logout() {
        clearUserStorage();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)!;
}

// wrap a query that uses authorization, to trigger a logout when an Unauthorized response is returned
export function useQueryWithAuth<TQuery extends QueryObserverBaseResult>(query: TQuery) {
    const context = useAuthContext();

    if (query.isError && query.error instanceof ApiError && query.error.status == 401) {
        context.logout();
    }

    return query;
}