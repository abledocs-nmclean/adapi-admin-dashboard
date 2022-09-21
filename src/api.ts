import { AuthorizeRequest, Company, User, CreateCompanyRequest } from './model';
import { AuthenticatedUser } from './user';

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

export class ApiError extends Error {
    response: Response;

    constructor(response: Response) {
        super(response.statusText);
        Object.setPrototypeOf(this, ApiError.prototype);
        this.response = response;
    }
}

// send an object as json (or null for no body) to the given API path
async function sendJson(path: string, method: HttpMethod, body: object | null = null, headers = new Headers()) {
    const requestInit: RequestInit = { method, headers };
    if (body !== null) {
        headers.set("Content-Type", "application/json");
        requestInit.body = JSON.stringify(body);
    }
    const response = await fetch(`${process.env.REACT_APP_ADAPI_BASE_URL}/${path}`, requestInit);
    if (!response.ok) {
        throw new ApiError(response);
    }
    return response;
}

async function sendJsonAuth(user: AuthenticatedUser, path: string, method: HttpMethod, body: object | null = null, headers = new Headers()) {
    headers.set("Authorization", `Bearer ${user.jwt}`);
    return sendJson(path, method, body, headers);
}

export async function authorize(request: AuthorizeRequest) {
    const response = await sendJson("authorize", "POST", request);
    const jwt = await response.text();
    return jwt;
}

export async function getAllCompanies(user: AuthenticatedUser) {
    const response = await sendJsonAuth(user, "companies", "GET");
    return await response.json() as Company[];
}

export async function getCompany(user: AuthenticatedUser, id: string) {
    const response = await sendJsonAuth(user, `companies/${id}`, "GET");
    return await response.json() as Company;
}

export async function getUsersByCompany(user: AuthenticatedUser, id: string) {
    const response = await sendJsonAuth(user, `companies/${id}/users`, "GET");
    return await response.json() as User[];
}

export async function addCompany(user: AuthenticatedUser, request: CreateCompanyRequest) {
    const response = await sendJsonAuth(user, "companies", "POST", request);
    return await response.json() as Company;
}