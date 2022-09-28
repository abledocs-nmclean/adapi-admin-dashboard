export type AuthenticatedUser = {username: string, jwt: string};

export function retrieveUser() {
    const userItem = localStorage.getItem("user");
    if (userItem === null) {
        return null;
    }
    return JSON.parse(userItem) as AuthenticatedUser;
}

export function clearUserStorage() {
    localStorage.removeItem("user");
}

export function storeUser(user: AuthenticatedUser) {
    localStorage.setItem("user", JSON.stringify(user));
}