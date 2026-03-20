import axios, { AxiosError } from 'axios';
import { LoginCredentials, TokenResponse, Parque, ParqueCreate, Trilha, TrilhaCreate, Evento, EventoCreate, Biodiversidade, BiodiversidadeCreate } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await axios.post<TokenResponse>(
      `${API_URL}/login/token`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  },
};

// Parque Service
export const parqueService = {
  getAll: async (): Promise<Parque[]> => {
    const response = await api.get<Parque[]>('/parques');
    return response.data;
  },

  getById: async (id: number): Promise<Parque> => {
    const response = await api.get<Parque>(`/parques/${id}`);
    return response.data;
  },

  create: async (parque: ParqueCreate): Promise<Parque> => {
    const response = await api.post<Parque>('/parques', parque);
    return response.data;
  },

  update: async (id: number, parque: ParqueCreate): Promise<Parque> => {
    const response = await api.put<Parque>(`/parques/${id}`, parque);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/parques/${id}`);
  },
};

// Trilha Service
export const trilhaService = {
  getAll: async (): Promise<Trilha[]> => {
    const response = await api.get<Trilha[]>('/trilhas');
    return response.data;
  },

  getById: async (id: number): Promise<Trilha> => {
    const response = await api.get<Trilha>(`/trilhas/${id}`);
    return response.data;
  },

  create: async (trilha: TrilhaCreate): Promise<Trilha> => {
    const response = await api.post<Trilha>('/trilhas', trilha);
    return response.data;
  },

  update: async (id: number, trilha: TrilhaCreate): Promise<Trilha> => {
    const response = await api.put<Trilha>(`/trilhas/${id}`, trilha);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/trilhas/${id}`);
  },
};

// Evento Service
export const eventoService = {
  getAll: async (): Promise<Evento[]> => {
    const response = await api.get<Evento[]>('/eventos');
    return response.data;
  },

  getById: async (id: number): Promise<Evento> => {
    const response = await api.get<Evento>(`/eventos/${id}`);
    return response.data;
  },

  create: async (evento: EventoCreate): Promise<Evento> => {
    const response = await api.post<Evento>('/eventos', evento);
    return response.data;
  },

  update: async (id: number, evento: EventoCreate): Promise<Evento> => {
    const response = await api.put<Evento>(`/eventos/${id}`, evento);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/eventos/${id}`);
  },
};

// Biodiversidade Service
export const biodiversidadeService = {
  getAll: async (): Promise<Biodiversidade[]> => {
    const response = await api.get<Biodiversidade[]>('/biodiversidades');
    return response.data;
  },

  getById: async (id: number): Promise<Biodiversidade> => {
    const response = await api.get<Biodiversidade>(`/biodiversidades/${id}`);
    return response.data;
  },

  create: async (biodiversidade: BiodiversidadeCreate): Promise<Biodiversidade> => {
    const response = await api.post<Biodiversidade>('/biodiversidades', biodiversidade);
    return response.data;
  },

  update: async (id: number, biodiversidade: BiodiversidadeCreate): Promise<Biodiversidade> => {
    const response = await api.put<Biodiversidade>(`/biodiversidades/${id}`, biodiversidade);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/biodiversidades/${id}`);
  },
};

export default api;