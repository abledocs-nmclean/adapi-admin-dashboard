import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useQueryWithAuth } from './auth-context';
import { getAllCompanies, getCompany, getUsersByCompany } from "./api";
import { useAuthContext } from "./auth-context";
import { AuthenticatedUser } from "./user";
import { Company, User } from "./model";

export function useCompaniesQuery() {
    const { user } = useAuthContext();

    return useQueryWithAuth(useQuery(
        ["companies", user],
        () => getAllCompanies(user!),
        {
            enabled: user !== null,
            retry: false
        }
    ));
}

export function useCompanyQuery(id: string | undefined) {
    const { user } = useAuthContext();

    return useQueryWithAuth(useQuery(
        ["company", user, id],
        () => getCompany(user!, id!),
        {
            enabled: user !== null && id !== undefined,
            retry: false
        }
    ));
}

export function useUsersQuery(id: string | undefined) {
    const { user } = useAuthContext();

    return useQueryWithAuth(useQuery(
        ["users", user, id],
        () => getUsersByCompany(user!, id!),
        {
            enabled: user !== null && id !== undefined,
            retry: false
        }
    ));
}

// add isAdmin to the User type returned from the API
type UserWithAdmin = User & { isAdmin: boolean };

export function useComputedUsers(id: string | undefined): User[] | UserWithAdmin[] | undefined {
    const companyQuery = useCompanyQuery(id);    
    const usersQuery = useUsersQuery(id);

    return useMemo(() => {
        if (usersQuery.isSuccess) {
            if (companyQuery.isSuccess) {
                // when the company data is available, use "adminUserIds" to populate each user's "isAdmin"
                return usersQuery.data.map((userData) => {
                    return {
                        ...userData,
                        isAdmin: companyQuery.data.adminUserIds.includes(userData.id)
                    };
                });
            }
            // when only user data is available, use the original data
            return usersQuery.data;
        }
    }, [companyQuery.isSuccess, usersQuery.isSuccess]);
}