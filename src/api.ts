
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

type AuthorizeRequest = {username: string, password: string, ttl?: number};

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
    return await sendJson("authorize", "POST", request);
}

