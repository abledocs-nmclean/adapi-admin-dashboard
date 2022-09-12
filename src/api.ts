import { clearUser, setUser } from './user';

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

export type AuthorizeRequest = {username: string, password: string, ttl?: number};

async function sendJson(path: string, method: HttpMethod, body: object, headers=new Headers()) {
    headers.set("Content-Type", "application/json");
    return await fetch(    
        `${process.env.REACT_APP_ADAPI_BASE_URL}/${path}`,
        {
            method,
            headers,
            body: JSON.stringify(body)
        }
    );
}

export async function authorize(request: AuthorizeRequest) {
    clearUser();
    const response = await sendJson("authorize", "POST", request);
    if (response.ok) {
        const jwt = await response.text();
        setUser({username: request.username, jwt});
    }
    return response;
}

