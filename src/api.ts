import { AuthorizeRequest } from './model';
import { clearUser, setUser, getAuthHeader } from './user';

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

async function sendJson(path: string, method: HttpMethod, body: object | null, headers=new Headers()) {
    const requestInit: RequestInit = { method, headers };
    if (body !== null) {
        headers.set("Content-Type", "application/json");
        requestInit.body = JSON.stringify(body);
    }
    return await fetch(`${process.env.REACT_APP_ADAPI_BASE_URL}/${path}`, requestInit);
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

export async function getAllCompanies() {
    return await sendJson("companies", "GET", null, new Headers(getAuthHeader()));
}