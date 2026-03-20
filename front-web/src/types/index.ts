export interface Parque {
  id: number;
  nome: string;
  localizacao: string;
  descricao?: string;
  imagens?: string[];
}

export interface ParqueCreate {
  nome: string;
  localizacao: string;
  descricao?: string;
  imagens?: string[];
}

export interface Trilha {
  id: number;
  nome: string;
  dificuldade?: string;
  distancia?: number;
  parque_id: number;
  imagens?: string[];
}

export interface TrilhaCreate {
  nome: string;
  dificuldade?: string;
  distancia?: number;
  parque_id: number;
  imagens?: string[];
}

export interface Administrador {
  id: number;
  nome: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data: string;
  parque_id: number;
  imagens?: string[];
}

export interface EventoCreate {
  nome: string;
  descricao: string;
  data: string;
  parque_id: number;
  imagens?: string[];
}

export interface Biodiversidade {
  id: number;
  especie: string;
  tipo?: string;
  descricao?: string;
  parque_id: number;
  imagens?: string[];
}

export interface BiodiversidadeCreate {
  especie: string;
  tipo?: string;
  descricao?: string;
  parque_id: number;
  imagens?: string[];
}