export type AuthenticatedUser = {username: string, jwt: string};

let currentUser: AuthenticatedUser | null = null;

init();

function init() {
    const userItem = localStorage.getItem("user");
    if (userItem !== null) {
        currentUser = JSON.parse(userItem);
    }
}

export function clearUser() {
    localStorage.removeItem("user");
    currentUser = null;
}

export function setUser(user: AuthenticatedUser) {
    currentUser = user;
    localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
    return currentUser;
}

export function getAuthHeader(): {Authorization?: string} {
    const user = getUser();
    if (user === null) {
        return {};
    }
    return {Authorization: `Bearer ${user.jwt}`};
}
