import {
        AuthorizeRequest, Company, CreateCompanyRequest, UpdateCompanyRequest,
        User, CreateUserRequest, UpdateUserRequest
    } from './model';
import { AuthenticatedUser } from './user';

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

export class ApiError extends Error {
    response: Response;

    constructor(response: Response) {
        super(response.statusText);
        Object.setPrototypeOf(this, new.target.prototype);
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

export async function getAllCompanies(authUser: AuthenticatedUser) {
    const response = await sendJsonAuth(authUser, "companies", "GET");
    return await response.json() as Company[];
}

export async function getCompany(authUser: AuthenticatedUser, companyId: string) {
    const response = await sendJsonAuth(authUser, `companies/${companyId}`, "GET");
    return await response.json() as Company;
}

export async function addCompany(authUser: AuthenticatedUser, request: CreateCompanyRequest) {
    const response = await sendJsonAuth(authUser, "companies", "POST", request);
    return await response.json() as Company;
}

export async function editCompany(authUser: AuthenticatedUser, request: UpdateCompanyRequest) {
    const response = await sendJsonAuth(authUser, `companies/${request.id}`, "PATCH", request);
    return await response.json() as Company;
}

export async function getUsersByCompany(authUser: AuthenticatedUser, companyId: string) {
    const response = await sendJsonAuth(authUser, `companies/${companyId}/users`, "GET");
    return await response.json() as User[];
}

export async function addUser(authUser: AuthenticatedUser, request: CreateUserRequest) {
    const response = await sendJsonAuth(authUser, `companies/${request.companyId}/users`, "POST", request);
    return await response.json() as User;
}

export async function editUser(authUser: AuthenticatedUser, request: UpdateUserRequest) {
    const response = await sendJsonAuth(authUser, `companies/${request.companyId}/users/${request.id}`, "PATCH", request);
    return await response.json() as User;
}