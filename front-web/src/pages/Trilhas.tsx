import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, MapPin, Loader2, Map, Navigation } from 'lucide-react';
import { trilhaService, parqueService } from '../services/api';
import { imageStorage } from '../services/imageStorage';
import { Trilha, Parque } from '../types';
import ImageGallery from '../components/ImageGallery';
import toast from 'react-hot-toast';

const Trilhas: React.FC = () => {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [filteredTrilhas, setFilteredTrilhas] = useState<Trilha[]>([]);
  const [parques, setParques] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = trilhas.filter(
      (trilha) =>
        trilha.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trilha.dificuldade && trilha.dificuldade.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTrilhas(filtered);
  }, [searchTerm, trilhas]);

  const fetchData = async () => {
    try {
      const [trilhasData, parquesData] = await Promise.all([
        trilhaService.getAll(),
        parqueService.getAll(),
      ]);
      
      const parquesMap = parquesData.reduce((acc, parque) => {
        acc[parque.id] = parque.nome;
        return acc;
      }, {} as Record<number, string>);
      
      // Carregar imagens do localStorage e mesclar com os dados
      const todasImagens = imageStorage.getAllTrilhasImages();
      const trilhasComImagens = trilhasData.map((trilha: Trilha) => ({
        ...trilha,
        imagens: todasImagens[trilha.id] || [],
      }));
      
      setParques(parquesMap);
      setTrilhas(trilhasComImagens);
      setFilteredTrilhas(trilhasComImagens);
    } catch (error) {
      toast.error('Erro ao carregar trilhas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta trilha?')) return;

    setDeleteId(id);
    try {
      await trilhaService.delete(id);
      // Remover imagens do localStorage
      imageStorage.removeTrilhaImages(id);
      toast.success('Trilha excluída com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir trilha');
    } finally {
      setDeleteId(null);
    }
  };

  const getDificuldadeColor = (dificuldade?: string) => {
    switch (dificuldade?.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return 'bg-green-100 text-green-800';
      case 'moderada':
      case 'moderado':
        return 'bg-yellow-100 text-yellow-800';
      case 'difícil':
      case 'dificil':
      case 'dificíl':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trilhas</h1>
          <p className="text-gray-500 mt-1">Gerencie as trilhas e rotas disponíveis</p>
        </div>
        <Link
          to="/trilhas/nova"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Trilha
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar trilhas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Grid */}
      {filteredTrilhas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma trilha encontrada' : 'Nenhuma trilha cadastrada'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Tente buscar com outros termos'
              : 'Comece cadastrando sua primeira trilha'}
          </p>
          {!searchTerm && (
            <Link
              to="/trilhas/nova"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Trilha
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrilhas.map((trilha) => (
            <div
              key={trilha.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image Gallery */}
              <ImageGallery 
                imagens={trilha.imagens || []} 
                nome={trilha.nome}
                type="trilha"
              />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{trilha.nome}</h3>
                  {trilha.dificuldade && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDificuldadeColor(trilha.dificuldade)}`}>
                      {trilha.dificuldade}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {parques[trilha.parque_id] || 'Parque não encontrado'}
                  </div>
                  {trilha.distancia && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      {trilha.distancia} km
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/trilhas/${trilha.id}/editar`)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(trilha.id)}
                    disabled={deleteId === trilha.id}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleteId === trilha.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trilhas;
