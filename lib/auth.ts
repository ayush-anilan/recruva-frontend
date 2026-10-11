import { api } from "./api";

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface RegisterResponse {
    message: string;
    email: string;
    success: boolean;
}

export async function registerUser(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/auth/register", request);
    return response.data;
} 
