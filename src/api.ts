import { AuthorizeRequest, Company, User } from './model';
import { AuthenticatedUser } from './user';

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
        this.status = status;
    }    
}

async function sendJson(path: string, method: HttpMethod, body: object | null, headers=new Headers()) {
    const requestInit: RequestInit = { method, headers };
    if (body !== null) {
        headers.set("Content-Type", "application/json");
        requestInit.body = JSON.stringify(body);
    }
    const response = await fetch(`${process.env.REACT_APP_ADAPI_BASE_URL}/${path}`, requestInit);
    if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
    }
    return response;
}

export async function authorize(request: AuthorizeRequest) {
    const response = await sendJson("authorize", "POST", request);
    const jwt = await response.text();
    return jwt;
}

function getAuthHeader(user: AuthenticatedUser): {Authorization: string} {
    return {Authorization: `Bearer ${user.jwt}`};
}

export async function getAllCompanies(user: AuthenticatedUser) {
    const response = await sendJson("companies", "GET", null, new Headers(getAuthHeader(user)));
    return await response.json() as Company[];
}

export async function getCompany(user: AuthenticatedUser, id: string) {
    const response = await sendJson(`companies/${id}`, "GET", null, new Headers(getAuthHeader(user)));
    return await response.json() as Company;
}

export async function getUsersByCompany(user: AuthenticatedUser, id: string) {
    const response = await sendJson(`companies/${id}/users`, "GET", null, new Headers(getAuthHeader(user)));
    return await response.json() as User[];
}