export type AuthorizeRequest = {username: string, password: string, ttl?: number};

export type Company = {
    id: string, 
    adminUserIds: string[],
    adoClientId: number,
    isActive: boolean,
    isTrial?: boolean,
    name: string,
    templates: DocumentTemplate
};

export type DocumentTemplate = {
    commonileId: string,
    match: string,
    name: string,
    lang?: string,
    expiry?: string
};