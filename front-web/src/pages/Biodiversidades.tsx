import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Leaf, MapPin, Loader2 } from 'lucide-react';
import { biodiversidadeService, parqueService } from '../services/api';
import { imageStorage } from '../services/imageStorage';
import { Biodiversidade, Parque } from '../types';
import ImageGallery from '../components/ImageGallery';
import toast from 'react-hot-toast';

const Biodiversidades: React.FC = () => {
  const [biodiversidades, setBiodiversidades] = useState<Biodiversidade[]>([]);
  const [filteredBiodiversidades, setFilteredBiodiversidades] = useState<Biodiversidade[]>([]);
  const [parques, setParques] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = biodiversidades.filter(
      (bio) =>
        bio.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bio.tipo && bio.tipo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bio.descricao && bio.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBiodiversidades(filtered);
  }, [searchTerm, biodiversidades]);

  const fetchData = async () => {
    try {
      const [biodiversidadesData, parquesData] = await Promise.all([
        biodiversidadeService.getAll(),
        parqueService.getAll(),
      ]);
      
      const parquesMap = parquesData.reduce((acc, parque) => {
        acc[parque.id] = parque.nome;
        return acc;
      }, {} as Record<number, string>);
      
      // Carregar imagens do localStorage e mesclar com os dados
      const todasImagens = imageStorage.getAllBiodiversidadesImages();
      const biodiversidadesComImagens = biodiversidadesData.map((bio: Biodiversidade) => ({
        ...bio,
        imagens: todasImagens[bio.id] || [],
      }));
      
      setParques(parquesMap);
      setBiodiversidades(biodiversidadesComImagens);
      setFilteredBiodiversidades(biodiversidadesComImagens);
    } catch (error) {
      toast.error('Erro ao carregar biodiversidade');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro de biodiversidade?')) return;

    setDeleteId(id);
    try {
      await biodiversidadeService.delete(id);
      // Remover imagens do localStorage
      imageStorage.removeBiodiversidadeImages(id);
      toast.success('Registro excluído com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir registro');
    } finally {
      setDeleteId(null);
    }
  };

  const getTipoColor = (tipo?: string) => {
    switch (tipo?.toLowerCase()) {
      case 'fauna':
        return 'bg-orange-100 text-orange-800';
      case 'flora':
        return 'bg-green-100 text-green-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Biodiversidade</h1>
          <p className="text-gray-500 mt-1">Gerencie a fauna e flora dos parques</p>
        </div>
        <Link
          to="/biodiversidades/novo"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Registro
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar espécies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Grid */}
      {filteredBiodiversidades.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma espécie encontrada' : 'Nenhum registro cadastrado'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Tente buscar com outros termos'
              : 'Comece cadastrando o primeiro registro de biodiversidade'}
          </p>
          {!searchTerm && (
            <Link
              to="/biodiversidades/novo"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Espécie
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBiodiversidades.map((bio) => (
            <div
              key={bio.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image Gallery */}
              <ImageGallery 
                imagens={bio.imagens || []} 
                nome={bio.especie}
                type="trilha"
              />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{bio.especie}</h3>
                  {bio.tipo && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(bio.tipo)}`}>
                      {bio.tipo}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  {parques[bio.parque_id] || 'Parque não encontrado'}
                </div>

                {bio.descricao && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bio.descricao}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/biodiversidades/${bio.id}/editar`)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(bio.id)}
                    disabled={deleteId === bio.id}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleteId === bio.id ? (
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

export default Biodiversidades;
