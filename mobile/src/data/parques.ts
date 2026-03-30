export type Parque = {
  id: string;
  nome: string;
  local: string;
  descricao: string;
  distancia: string;
  nivel: string;
};

export const parques: Parque[] = [
  {
    id: '1',
    nome: 'Parque Nascional da Serra dos Órgãos',
    local: 'Teresópolis',
    descricao: 'Trilha Suspensa: Nível leve, ideal para famílias, passando por aquedutos do século XX e poços.',
    distancia: '1.3 km',
    nivel: 'Fácil',
  },
  {
    id: '2',
    nome: 'Parque Estadual dos Três Picos',
    local: 'Vale dos deuses',
    descricao: 'Paisagens naturais, cachoeiras e áreas de descanso.',
    distancia: '7,8 km',
    nivel: 'Moderado',
  },
  {
    id: '3',
    nome: 'Parque Natural Municipal Montanhas de Terê',
    local: 'Santa Rita - Teresópolis',
    descricao: 'Experiência panorâmica com clima de montanha.',
    distancia: '5,5 km',
    nivel: 'Leve',
  },
];