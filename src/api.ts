
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

type AuthorizeRequest = {username: string, password: string, ttl?: number};

export type AuthenticatedUser = {username: string, jwt: string};

async function sendJson(path: string, method: HttpMethod, request: object) {
    return await fetch(
        `${process.env.REACT_APP_ADAPI_BASE_URL}/${path}`,
        {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
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

