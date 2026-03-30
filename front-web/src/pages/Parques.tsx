import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, MapPin, Loader2, Trees } from 'lucide-react';
import { parqueService } from '../services/api';
import { Parque } from '../types';
import ImageGallery from '../components/ImageGallery';
import toast from 'react-hot-toast';

const Parques: React.FC = () => {
  const [parques, setParques] = useState<Parque[]>([]);
  const [filteredParques, setFilteredParques] = useState<Parque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParques();
  }, []);

  useEffect(() => {
    const filtered = parques.filter(
      (parque) =>
        parque.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parque.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParques(filtered);
  }, [searchTerm, parques]);

  const fetchParques = async () => {
    try {
      const data = await parqueService.getAll();
      setParques(data);
      setFilteredParques(data);
    } catch (error) {
      toast.error('Erro ao carregar parques');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este parque?')) return;

    setDeleteId(id);
    try {
      await parqueService.delete(id);
      toast.success('Parque excluído com sucesso!');
      fetchParques();
    } catch (error) {
      toast.error('Erro ao excluir parque');
    } finally {
      setDeleteId(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Parques</h1>
          <p className="text-gray-500 mt-1">Gerencie os parques naturais cadastrados</p>
        </div>
        <Link
          to="/admin/parques/novo"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Parque
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar parques..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Grid */}
      {filteredParques.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Trees className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum parque encontrado' : 'Nenhum parque cadastrado'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Tente buscar com outros termos'
              : 'Comece cadastrando seu primeiro parque'}
          </p>
          {!searchTerm && (
            <Link
              to="/admin/parques/novo"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Parque
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParques.map((parque) => (
            <div
              key={parque.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <ImageGallery 
                imagens={parque.imagens || []} 
                nome={parque.nome}
                type="parque"
              />
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{parque.nome}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  {parque.localizacao}
                </div>
                {parque.descricao && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{parque.descricao}</p>
                )}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/admin/parques/${parque.id}/editar`)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(parque.id)}
                    disabled={deleteId === parque.id}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleteId === parque.id ? (
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

export default Parques;
