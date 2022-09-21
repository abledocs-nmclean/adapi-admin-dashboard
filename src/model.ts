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

type OptionalCompanyProps = Pick<Company, "adminUserIds" | "templates">;
export type CreateCompanyRequest =
    Omit<Company, keyof (Pick<Company, "id"> & OptionalCompanyProps)>
    & Partial<OptionalCompanyProps>;

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