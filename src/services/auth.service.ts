// auth.service.ts
import { api } from "./api.service";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type MeResponse = {
  userId: string;
  email: string;
};

export type RegisterResponse =
  | {
      _id?: string;
      name?: string;
      email: string;
      createdAt?: string;
      updatedAt?: string;
    }
  | MeResponse;

export type LoginResponse = {
  success: boolean;
};

async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);
  return data;
}

async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}

async function logout(): Promise<{ success: boolean }> {
  const { data } = await api.post<{ success: boolean }>("/auth/logout");
  return data;
}

async function me(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>("/auth/me");
  return data;
}

export const AuthService = {
  register,
  login,
  logout,
  me,
};

export default AuthService;
