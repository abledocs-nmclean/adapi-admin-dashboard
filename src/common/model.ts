export type AuthorizeRequest = {
    username: string,
    password: string,
    ttl?: number
};

export type Company = {
    id: string, 
    adminUserIds: string[],
    adoClientId: number,
    isActive: boolean,
    isTrial?: boolean,
    name: string,
    templates: DocumentTemplate[]
};

// helper to replace specific required properties with optional ones
type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};

export type CreateCompanyRequest = MakeOptional<Omit<Company, "id">, "adminUserIds" | "templates">;

export type UpdateCompanyRequest = Pick<Company, "id"> & Partial<Omit<Company, "name">>;

export type DocumentTemplate = {
    commonFileId: string,
    match: string,
    name: string,
    lang?: string,
    expiry?: string
};

export type User = {
    id: string,
    companyId: string,
    username: string,
    password: string,
    secondaryPassword: string,
    accessKey: string,
    passwordChangeRequired?: boolean,
    isActive: boolean,
    email?: string,
    isTrial?: boolean
};

export type CreateUserRequest = Omit<User, "id" | "passwordChangeRequired">;

export type UpdateUserRequest = Pick<User, "id" | "companyId"> & Partial<User>;