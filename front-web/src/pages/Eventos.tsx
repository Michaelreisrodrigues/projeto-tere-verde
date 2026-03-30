import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Calendar, MapPin, Loader2, Filter } from 'lucide-react';
import { eventoService, parqueService } from '../services/api';
import { Evento, Parque } from '../types';
import ImageGallery from '../components/ImageGallery';
import toast from 'react-hot-toast';

const Eventos: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [parques, setParques] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filtrarEventos();
  }, [searchTerm, dataFiltro, eventos]);

  const fetchData = async () => {
    try {
      const [eventosData, parquesData] = await Promise.all([
        eventoService.getAll(),
        parqueService.getAll(),
      ]);
      
      const parquesMap = parquesData.reduce((acc, parque) => {
        acc[parque.id] = parque.nome;
        return acc;
      }, {} as Record<number, string>);
      
      setParques(parquesMap);
      setEventos(eventosData);
      setFilteredEventos(eventosData);
    } catch (error) {
      toast.error('Erro ao carregar eventos');
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarEventos = () => {
    let filtered = eventos.filter(
      (evento) =>
        evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (dataFiltro) {
      filtered = filtered.filter((evento) => {
        const dataEvento = new Date(evento.data).toISOString().split('T')[0];
        return dataEvento === dataFiltro;
      });
    }

    setFilteredEventos(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    setDeleteId(id);
    try {
      await eventoService.delete(id);
      toast.success('Evento excluído com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir evento');
    } finally {
      setDeleteId(null);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setDataFiltro('');
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
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-500 mt-1">Gerencie os eventos dos parques</p>
        </div>
        <Link
          to="/admin/eventos/novo"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Evento
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="relative sm:w-64">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {(searchTerm || dataFiltro) && (
            <button
              onClick={limparFiltros}
              className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Limpar
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          Mostrando {filteredEventos.length} de {eventos.length} eventos
          {dataFiltro && ` para a data ${formatarData(dataFiltro)}`}
        </div>
      </div>

      {/* Grid */}
      {filteredEventos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || dataFiltro ? 'Nenhum evento encontrado' : 'Nenhum evento cadastrado'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || dataFiltro
              ? 'Tente ajustar os filtros de busca'
              : 'Comece cadastrando seu primeiro evento'}
          </p>
          {!searchTerm && !dataFiltro && (
            <Link
              to="/admin/eventos/novo"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Evento
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <ImageGallery 
                imagens={evento.imagens || []} 
                nome={evento.nome}
                type="parque"
              />
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{evento.nome}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatarData(evento.data)}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {parques[evento.parque_id] || 'Parque não encontrado'}
                  </div>
                </div>

                {evento.descricao && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{evento.descricao}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/admin/eventos/${evento.id}/editar`)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(evento.id)}
                    disabled={deleteId === evento.id}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleteId === evento.id ? (
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

export default Eventos;
