import { useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import {
        ApiError,
        getAllCompanies, getCompany, addCompany, editCompany,
        getUsersByCompany, addUser, editUser
    } from "./api";
import { useAuthContext } from "./auth-context";
import { AuthenticatedUser } from "./user";
import {
        Company, CreateCompanyRequest, UpdateCompanyRequest,
        User, CreateUserRequest, UpdateUserRequest
    } from "./model";

// React hook that updates the auth state when we detect authorization has expired from an error response
export function useTokenExpiryEffect(error: unknown) {
    const { expire } = useAuthContext();

    useEffect(() => {
        if (error instanceof ApiError && error.response.status === 401) {
            expire();
        }
    }, [expire, error]);
}

export function useCompanyQuery(companyId: string | undefined) {
    const { user } = useAuthContext();

    const query = useQuery(
        ["company", user, companyId],
        () => getCompany(user!, companyId!),
        {
            enabled: user !== null && companyId !== undefined
        }
    );

    useTokenExpiryEffect(query.error);

    return query;
}

export function useCompaniesQuery() {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    const query = useQuery(
        ["companies", user],
        () => getAllCompanies(user!),
        {
            enabled: user !== null,
            onSuccess: (companies) => {
                companies.forEach((company) => {
                    queryClient.setQueryData<Company>(["company", user, company.id], company);
                });
            }
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
            }
        }
    );

    useTokenExpiryEffect(mutation.error);

    return mutation;
}

export function useCompanyEditMutation() {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    const mutation = useMutation(
        (request: UpdateCompanyRequest) => editCompany(user!, request),
        {
            onSuccess: (company) => {
                queryClient.setQueryData<Company>(["company", user, company.id], company);

                queryClient.setQueryData<Company[]>(["companies", user], (existingCompanies) => {
                    return existingCompanies?.map(c => c.id === company.id ? company : c);
                })
            }
        }
    );

    useTokenExpiryEffect(mutation.error);

    return mutation;
}

export function useUsersQuery(companyId: string | undefined) {
    const { user } = useAuthContext();

    const query = useQuery(
        ["users", user, companyId],
        () => getUsersByCompany(user!, companyId!),
        {
            enabled: user !== null && companyId !== undefined
        }
    );

    useTokenExpiryEffect(query.error);

    return query;
}

// add isAdmin to the User type returned from the API
type UserWithAdmin = User & { isAdmin: boolean };

export function useComputedUsers(id: string | undefined): User[] | UserWithAdmin[] | undefined {
    const companyQuery = useCompanyQuery(id);    
    const usersQuery = useUsersQuery(id);

    return useMemo(() => {
        if (usersQuery.data) {
            if (companyQuery.data?.adminUserIds) {
                // when the company data is available, use "adminUserIds" to populate each user's "isAdmin"
                return usersQuery.data.map((user) => {
                    return {
                        ...user,
                        isAdmin: companyQuery.data.adminUserIds.includes(user.id)
                    };
                });
            }
            // when only user data is available, use the original data
            return usersQuery.data;
        }
    }, [companyQuery.data?.adminUserIds, usersQuery.data]);
}

async function updateCompanyAdminList(queryClient: QueryClient, authUser: AuthenticatedUser, user: User, isAdmin: boolean) {
    // get the existing admin user id list
    let { adminUserIds } = await queryClient.fetchQuery(
        ["company", authUser, user.companyId],
        () => getCompany(authUser, user.companyId));

    const idSet = new Set(adminUserIds);
    if (isAdmin && !idSet.has(user.id)) {
        idSet.add(user.id);
    } else if (idSet.has(user.id)) {
        idSet.delete(user.id);
    } else {
        // nothing needed to be added or deleted
        return;
    }
    adminUserIds = Array.from(idSet);

    // set new id list in existing local company data
    queryClient.setQueryData<Company>(["company", authUser, user.companyId], (existingCompany) => {
        if (existingCompany) return {...existingCompany, adminUserIds};
    } );
    queryClient.setQueryData<Company[]>(["companies", authUser], (existingCompanies) => {
        return existingCompanies?.map(c => c.id === user.companyId ? {...c, adminUserIds} : c);
    });

    // begin the API call to add the admin user id on the server in the background
    editCompany(authUser, {id: user.companyId, adminUserIds});
}

export function useUserAddMutation() {
    const queryClient = useQueryClient();
    const { user: authUser } = useAuthContext();

    const mutation = useMutation(
        (request: CreateUserRequest) => addUser(authUser!, request),
        {
            onSuccess: (user, request) => {
                // if the users query for this company has already loaded, add the new user to the existing list
                queryClient.setQueryData<User[]>(["users", authUser, user.companyId], (existingUsers) => {
                    if (!existingUsers) return;
                    return [...existingUsers, user];
                });

                if (request.isAdmin !== undefined) {
                    updateCompanyAdminList(queryClient, authUser!, user, request.isAdmin);
                }
            }
        }
    );

    useTokenExpiryEffect(mutation.error);

    return mutation;
}

export function useUserEditMutation() {
    const queryClient = useQueryClient();
    const { user: authUser } = useAuthContext();

    const mutation = useMutation(
        (request: UpdateUserRequest) => editUser(authUser!, request),
        {
            onSuccess: (user, request) => {
                queryClient.setQueryData<User[]>(["users", authUser, user.companyId], (existingUsers) => {
                    return existingUsers?.map(u => u.id === user.id ? user : u);
                });

                if (request.isAdmin !== undefined) {
                    updateCompanyAdminList(queryClient, authUser!, user, request.isAdmin);
                }
            }
        }
    );

    useTokenExpiryEffect(mutation.error);

    return mutation;
}