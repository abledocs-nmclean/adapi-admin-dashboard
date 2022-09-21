export type AuthorizeRequest = {username: string, password: string, ttl?: number};

export type Company = {
    id: string, 
    adminUserIds: string[],
    adoClientId: number,
    isActive: boolean,
    isTrial?: boolean,
    name: string,
    templates: DocumentTemplate[]
};

// helper to replace required properties with optional ones
type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};

export type CreateCompanyRequest = MakeOptional<Omit<Company, "id">, "adminUserIds" | "templates">;

export type DocumentTemplate = {
    commonFileId: string,
    match: string,
    name: string,
    lang?: string,
    expiry?: string
};

export type User = {
    id: string,
    username: string,
    accessKey: string,
    companyId: string,
    isActive: boolean,
    partitionKey: string,
    callbackUrlRemediation?: string,
    callbackUrlConformanceScan?: string,
    email?: string,
    isTrial?: boolean
};