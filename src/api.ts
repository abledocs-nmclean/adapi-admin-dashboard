
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

export type AuthorizeRequest = {username: string, password: string, ttl?: number};

export type AuthenticatedUser = {username: string, jwt: string};

export function getUser() {
    const userItem = localStorage.getItem("user");

    if (userItem === null) {
        return null;
    }

    return JSON.parse(userItem) as AuthenticatedUser;
}

async function sendJson(path: string, method: HttpMethod, body: object) {
    return await fetch(    
        `${process.env.REACT_APP_ADAPI_BASE_URL}/${path}`,
        {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }
    );
}

export async function authorize(request: AuthorizeRequest) {
    localStorage.removeItem("user");
    const response = await sendJson("authorize", "POST", request);
    if (response.ok) {
        const jwt = await response.text();
        const user: AuthenticatedUser = {username: request.username, jwt};
        localStorage.setItem("user", JSON.stringify(user));
    }
    return response;
}