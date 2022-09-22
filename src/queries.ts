import { useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addCompany, getAllCompanies, getCompany, getUsersByCompany } from "./api";
import { useAuthContext } from "./auth-context";
import { ApiError } from './api';
import { Company, CreateCompanyRequest, User } from "./model";

// React hook that updates the auth state when we detect authorization has expired from an error response
export function useTokenExpiryEffect(error: unknown) {
    const { expire } = useAuthContext();

    useEffect(() => {
        if (error instanceof ApiError && error.response.status === 401) {
            expire();
        }
    }, [expire, error]);
}

export function useCompaniesQuery() {
    const { user } = useAuthContext();

    const query = useQuery(
        ["companies", user],
        () => getAllCompanies(user!),
        {
            enabled: user !== null,
            retry: false
        }
    );

    useTokenExpiryEffect(query.error);

    return query;
}

export function useCompanyQuery(id: string | undefined) {
    const { user } = useAuthContext();

    const query = useQuery(
        ["company", user, id],
        () => getCompany(user!, id!),
        {
            enabled: user !== null && id !== undefined,
            retry: false
        }
    );

    useTokenExpiryEffect(query.error);

    return query;
}

export function useCompanyAddMutation() {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    const mutation = useMutation(
        (request: CreateCompanyRequest) => {
            return addCompany(user!, request);
        },
        {
            onSuccess: (company) => {
                queryClient.setQueryData<Company>(["company", user, company.id], company);
                
                // if the companies query has already loaded, add the new company to the existing list
                queryClient.setQueryData<Company[]>(["companies", user], (existingCompanies) => {
                    if (!existingCompanies) return;
                    return [...existingCompanies, company];
                });
                // todo do this for each [comapny, user, id] on [companies, user] success
            }
        }
    );

    useTokenExpiryEffect(mutation.error);

    return mutation;
}

export function useUsersQuery(id: string | undefined) {
    const { user } = useAuthContext();

    const query = useQuery(
        ["users", user, id],
        () => getUsersByCompany(user!, id!),
        {
            enabled: user !== null && id !== undefined,
            retry: false
        }
    );

    return query;
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
    }, [companyQuery.isSuccess, companyQuery.data?.adminUserIds, usersQuery.isSuccess, usersQuery.data]);
}