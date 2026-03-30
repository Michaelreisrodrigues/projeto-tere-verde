import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trees, Map, Leaf, Calendar, ChevronLeft, Mountain, 
  MapPin, Navigation, Clock, Loader2, Info, X, Search,
  ChevronRight, Sun, CloudRain
} from 'lucide-react';
import { parqueService, trilhaService, eventoService, biodiversidadeService } from '../services/api';
import { Parque, Trilha, Evento, Biodiversidade } from '../types';
import ImageGallery from '../components/ImageGallery';
import toast from 'react-hot-toast';

type TabType = 'parques' | 'trilhas' | 'biodiversidade' | 'eventos';

const Visitante: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('parques');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [parques, setParques] = useState<Parque[]>([]);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [biodiversidades, setBiodiversidades] = useState<Biodiversidade[]>([]);
  const [parquesMap, setParquesMap] = useState<Record<number, string>>({});

  // Modal states
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<TabType | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [parquesData, trilhasData, eventosData, biodiversidadesData] = await Promise.all([
        parqueService.getAll(),
        trilhaService.getAll(),
        eventoService.getAll(),
        biodiversidadeService.getAll(),
      ]);

      const pMap = parquesData.reduce((acc, parque) => {
        acc[parque.id] = parque.nome;
        return acc;
      }, {} as Record<number, string>);

      setParques(parquesData);
      setTrilhas(trilhasData);
      setEventos(eventosData);
      setBiodiversidades(biodiversidadesData);
      setParquesMap(pMap);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'parques':
        return parques.filter(p => 
          p.nome.toLowerCase().includes(term) || 
          p.localizacao.toLowerCase().includes(term)
        );
      case 'trilhas':
        return trilhas.filter(t => 
          t.nome.toLowerCase().includes(term) || 
          t.dificuldade?.toLowerCase().includes(term)
        );
      case 'biodiversidade':
        return biodiversidades.filter(b => 
          b.especie.toLowerCase().includes(term) || 
          b.tipo?.toLowerCase().includes(term)
        );
      case 'eventos':
        return eventos.filter(e => 
          e.nome.toLowerCase().includes(term) || 
          e.descricao.toLowerCase().includes(term)
        );
      default:
        return [];
    }
  };

  const getDificuldadeColor = (dificuldade?: string) => {
    switch (dificuldade?.toLowerCase()) {
      case 'fácil':
      case 'facil':
      case 'leve':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderada':
      case 'moderado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'difícil':
      case 'dificil':
      case 'dificíl':
      case 'pesada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoIcon = (tipo?: string) => {
    return tipo?.toLowerCase() === 'fauna' ? '🐾' : '🌿';
  };

  const openModal = (item: any, type: TabType) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };

  const tabs = [
    { id: 'parques' as TabType, label: 'Parques', icon: Trees, color: 'emerald' },
    { id: 'trilhas' as TabType, label: 'Trilhas', icon: Map, color: 'blue' },
    { id: 'biodiversidade' as TabType, label: 'Biodiversidade', icon: Leaf, color: 'green' },
    { id: 'eventos' as TabType, label: 'Eventos', icon: Calendar, color: 'purple' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Trees className="w-8 h-8 text-emerald-300" />
                  Tere Verde
                </h1>
                <p className="text-emerald-200 text-sm">Portal do Visitante</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              Área do Administrador
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                  }}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? `bg-${tab.color}-50 text-${tab.color}-700 border border-${tab.color}-200`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? `text-${tab.color}-600` : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Title */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 mt-1">
                {activeTab === 'parques' && 'Conheça os parques naturais de Teresópolis'}
                {activeTab === 'trilhas' && 'Explore as trilhas disponíveis'}
                {activeTab === 'biodiversidade' && 'Descubra a fauna e flora local'}
                {activeTab === 'eventos' && 'Participe dos eventos especiais'}
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Buscar ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum item cadastrado'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Tente buscar com outros termos' : 'Volte mais tarde para novidades'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Parques Grid */}
            {activeTab === 'parques' && filteredItems.map((parque: Parque) => (
              <div
                key={parque.id}
                onClick={() => openModal(parque, 'parques')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <ImageGallery 
                  imagens={parque.imagens || []} 
                  nome={parque.nome}
                  type="parque"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {parque.nome}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    {parque.localizacao}
                  </div>
                  {parque.descricao && (
                    <p className="text-gray-600 text-sm line-clamp-2">{parque.descricao}</p>
                  )}
                  <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                    <span>Ver detalhes</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}

            {/* Trilhas Grid */}
            {activeTab === 'trilhas' && filteredItems.map((trilha: Trilha) => (
              <div
                key={trilha.id}
                onClick={() => openModal(trilha, 'trilhas')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <ImageGallery 
                  imagens={trilha.imagens || []} 
                  nome={trilha.nome}
                  type="trilha"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {trilha.nome}
                    </h3>
                    {trilha.dificuldade && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDificuldadeColor(trilha.dificuldade)}`}>
                        {trilha.dificuldade}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {parquesMap[trilha.parque_id] || 'Parque não encontrado'}
                  </div>
                  {trilha.distancia && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      {trilha.distancia} km
                    </div>
                  )}
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    <span>Ver detalhes</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}

            {/* Biodiversidade Grid */}
            {activeTab === 'biodiversidade' && filteredItems.map((bio: Biodiversidade) => (
              <div
                key={bio.id}
                onClick={() => openModal(bio, 'biodiversidade')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <ImageGallery 
                  imagens={bio.imagens || []} 
                  nome={bio.especie}
                  type="parque"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {bio.especie}
                    </h3>
                    <span className="text-2xl">{getTipoIcon(bio.tipo)}</span>
                  </div>
                  {bio.tipo && (
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                      bio.tipo.toLowerCase() === 'fauna' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {bio.tipo}
                    </span>
                  )}
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {parquesMap[bio.parque_id] || 'Parque não encontrado'}
                  </div>
                  {bio.descricao && (
                    <p className="text-gray-600 text-sm line-clamp-2">{bio.descricao}</p>
                  )}
                  <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                    <span>Ver detalhes</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}

            {/* Eventos Grid */}
            {activeTab === 'eventos' && filteredItems.map((evento: Evento) => (
              <div
                key={evento.id}
                onClick={() => openModal(evento, 'eventos')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <ImageGallery 
                  imagens={evento.imagens || []} 
                  nome={evento.nome}
                  type="parque"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {evento.nome}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(evento.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {parquesMap[evento.parque_id] || 'Parque não encontrado'}
                  </div>
                  {evento.descricao && (
                    <p className="text-gray-600 text-sm line-clamp-2">{evento.descricao}</p>
                  )}
                  <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                    <span>Ver detalhes</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedItem && modalType && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'parques' && selectedItem.nome}
                {modalType === 'trilhas' && selectedItem.nome}
                {modalType === 'biodiversidade' && selectedItem.especie}
                {modalType === 'eventos' && selectedItem.nome}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              {(selectedItem.imagens?.length > 0) ? (
                <ImageGallery 
                  imagens={selectedItem.imagens} 
                  nome={selectedItem.nome || selectedItem.especie}
                  type={modalType === 'trilhas' ? 'trilha' : 'parque'}
                  className="rounded-xl mb-6"
                />
              ) : (
                <div className={`h-64 rounded-xl mb-6 flex items-center justify-center ${
                  modalType === 'parques' ? 'bg-emerald-100' :
                  modalType === 'trilhas' ? 'bg-blue-100' :
                  modalType === 'biodiversidade' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  {modalType === 'parques' && <Trees className="w-20 h-20 text-emerald-400" />}
                  {modalType === 'trilhas' && <Map className="w-20 h-20 text-blue-400" />}
                  {modalType === 'biodiversidade' && <Leaf className="w-20 h-20 text-green-400" />}
                  {modalType === 'eventos' && <Calendar className="w-20 h-20 text-purple-400" />}
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                {/* Parque Details */}
                {modalType === 'parques' && (
                  <>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-emerald-600" />
                      <span>{selectedItem.localizacao}</span>
                    </div>
                    {selectedItem.descricao && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Sobre</h4>
                        <p className="text-gray-600">{selectedItem.descricao}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Trilha Details */}
                {modalType === 'trilhas' && (
                  <>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{parquesMap[selectedItem.parque_id]}</span>
                    </div>
                    {selectedItem.dificuldade && (
                      <div className="flex items-center">
                        <Mountain className="w-5 h-5 mr-3 text-blue-600" />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDificuldadeColor(selectedItem.dificuldade)}`}>
                          {selectedItem.dificuldade}
                        </span>
                      </div>
                    )}
                    {selectedItem.distancia && (
                      <div className="flex items-center text-gray-600">
                        <Navigation className="w-5 h-5 mr-3 text-blue-600" />
                        <span>{selectedItem.distancia} km</span>
                      </div>
                    )}
                  </>
                )}

                {/* Biodiversidade Details */}
                {modalType === 'biodiversidade' && (
                  <>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-green-600" />
                      <span>{parquesMap[selectedItem.parque_id]}</span>
                    </div>
                    {selectedItem.tipo && (
                      <div className="flex items-center">
                        <Leaf className="w-5 h-5 mr-3 text-green-600" />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedItem.tipo.toLowerCase() === 'fauna' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {getTipoIcon(selectedItem.tipo)} {selectedItem.tipo}
                        </span>
                      </div>
                    )}
                    {selectedItem.descricao && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
                        <p className="text-gray-600">{selectedItem.descricao}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Evento Details */}
                {modalType === 'eventos' && (
                  <>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                      <span>{parquesMap[selectedItem.parque_id]}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                      <span>{new Date(selectedItem.data).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                    {selectedItem.descricao && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Sobre o Evento</h4>
                        <p className="text-gray-600">{selectedItem.descricao}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-gray-600">
              <Trees className="w-5 h-5 mr-2 text-emerald-600" />
              <span className="font-medium">Tere Verde</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 - Conectando você com a natureza de Teresópolis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Visitante;
