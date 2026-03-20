// Serviço para armazenar imagens localmente já que o backend não suporta
const STORAGE_KEY_PARQUES = 'tereverde_parques_imagens';
const STORAGE_KEY_TRILHAS = 'tereverde_trilhas_imagens';
const STORAGE_KEY_EVENTOS = 'tereverde_eventos_imagens';
const STORAGE_KEY_BIODIVERSIDADES = 'tereverde_biodiversidades_imagens';

export const imageStorage = {
  // Salvar imagens de um parque
  saveParqueImages: (parqueId: number, imagens: string[]) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_PARQUES) || '{}');
      storage[parqueId] = imagens;
      localStorage.setItem(STORAGE_KEY_PARQUES, JSON.stringify(storage));
      return true;
    } catch (error) {
      console.error('Erro ao salvar imagens do parque:', error);
      return false;
    }
  },

  // Carregar imagens de um parque
  getParqueImages: (parqueId: number): string[] => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_PARQUES) || '{}');
      return storage[parqueId] || [];
    } catch (error) {
      console.error('Erro ao carregar imagens do parque:', error);
      return [];
    }
  },

  // Remover imagens de um parque
  removeParqueImages: (parqueId: number) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_PARQUES) || '{}');
      delete storage[parqueId];
      localStorage.setItem(STORAGE_KEY_PARQUES, JSON.stringify(storage));
    } catch (error) {
      console.error('Erro ao remover imagens do parque:', error);
    }
  },

  // Salvar imagens de uma trilha
  saveTrilhaImages: (trilhaId: number, imagens: string[]) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_TRILHAS) || '{}');
      storage[trilhaId] = imagens;
      localStorage.setItem(STORAGE_KEY_TRILHAS, JSON.stringify(storage));
      return true;
    } catch (error) {
      console.error('Erro ao salvar imagens da trilha:', error);
      return false;
    }
  },

  // Carregar imagens de uma trilha
  getTrilhaImages: (trilhaId: number): string[] => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_TRILHAS) || '{}');
      return storage[trilhaId] || [];
    } catch (error) {
      console.error('Erro ao carregar imagens da trilha:', error);
      return [];
    }
  },

  // Remover imagens de uma trilha
  removeTrilhaImages: (trilhaId: number) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_TRILHAS) || '{}');
      delete storage[trilhaId];
      localStorage.setItem(STORAGE_KEY_TRILHAS, JSON.stringify(storage));
    } catch (error) {
      console.error('Erro ao remover imagens da trilha:', error);
    }
  },

  // Carregar todas as imagens de parques
  getAllParquesImages: (): Record<number, string[]> => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_PARQUES) || '{}');
    } catch (error) {
      console.error('Erro ao carregar todas as imagens dos parques:', error);
      return {};
    }
  },

  // Carregar todas as imagens de trilhas
  getAllTrilhasImages: (): Record<number, string[]> => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_TRILHAS) || '{}');
    } catch (error) {
      console.error('Erro ao carregar todas as imagens das trilhas:', error);
      return {};
    }
  },

  // Salvar imagens de um evento
  saveEventoImages: (eventoId: number, imagens: string[]) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTOS) || '{}');
      storage[eventoId] = imagens;
      localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(storage));
      return true;
    } catch (error) {
      console.error('Erro ao salvar imagens do evento:', error);
      return false;
    }
  },

  // Carregar imagens de um evento
  getEventoImages: (eventoId: number): string[] => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTOS) || '{}');
      return storage[eventoId] || [];
    } catch (error) {
      console.error('Erro ao carregar imagens do evento:', error);
      return [];
    }
  },

  // Remover imagens de um evento
  removeEventoImages: (eventoId: number) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTOS) || '{}');
      delete storage[eventoId];
      localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(storage));
    } catch (error) {
      console.error('Erro ao remover imagens do evento:', error);
    }
  },

  // Carregar todas as imagens de eventos
  getAllEventosImages: (): Record<number, string[]> => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTOS) || '{}');
    } catch (error) {
      console.error('Erro ao carregar todas as imagens dos eventos:', error);
      return {};
    }
  },

  // Salvar imagens de uma biodiversidade
  saveBiodiversidadeImages: (biodiversidadeId: number, imagens: string[]) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_BIODIVERSIDADES) || '{}');
      storage[biodiversidadeId] = imagens;
      localStorage.setItem(STORAGE_KEY_BIODIVERSIDADES, JSON.stringify(storage));
      return true;
    } catch (error) {
      console.error('Erro ao salvar imagens da biodiversidade:', error);
      return false;
    }
  },

  // Carregar imagens de uma biodiversidade
  getBiodiversidadeImages: (biodiversidadeId: number): string[] => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_BIODIVERSIDADES) || '{}');
      return storage[biodiversidadeId] || [];
    } catch (error) {
      console.error('Erro ao carregar imagens da biodiversidade:', error);
      return [];
    }
  },

  // Remover imagens de uma biodiversidade
  removeBiodiversidadeImages: (biodiversidadeId: number) => {
    try {
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY_BIODIVERSIDADES) || '{}');
      delete storage[biodiversidadeId];
      localStorage.setItem(STORAGE_KEY_BIODIVERSIDADES, JSON.stringify(storage));
    } catch (error) {
      console.error('Erro ao remover imagens da biodiversidade:', error);
    }
  },

  // Carregar todas as imagens de biodiversidades
  getAllBiodiversidadesImages: (): Record<number, string[]> => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_BIODIVERSIDADES) || '{}');
    } catch (error) {
      console.error('Erro ao carregar todas as imagens das biodiversidades:', error);
      return {};
    }
  },
};

export default imageStorage;
