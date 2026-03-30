import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trees, Map, Calendar, Leaf, Sparkles, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { parqueService, trilhaService, eventoService, biodiversidadeService } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    parques: 0,
    trilhas: 0,
    eventos: 0,
    biodiversidades: 0,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [parques, trilhas, eventos, biodiversidades] = await Promise.all([
          parqueService.getAll(),
          trilhaService.getAll(),
          eventoService.getAll(),
          biodiversidadeService.getAll(),
        ]);
        setStats({
          parques: parques.length,
          trilhas: trilhas.length,
          eventos: eventos.length,
          biodiversidades: biodiversidades.length,
          loading: false,
        });
      } catch (error: any) {
        const errorMsg = error.response?.data?.detail || error.message || 'Erro desconhecido';
        setStats((prev) => ({ 
          ...prev, 
          loading: false, 
          error: `Erro: ${errorMsg}` 
        }));
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Parques',
      count: stats.parques,
      icon: Trees,
      color: 'bg-emerald-500',
      link: '/admin/parques',
      description: 'Áreas naturais cadastradas',
    },
    {
      title: 'Trilhas',
      count: stats.trilhas,
      icon: Map,
      color: 'bg-blue-500',
      link: '/admin/trilhas',
      description: 'Caminhos e rotas disponíveis',
    },
    {
      title: 'Eventos',
      count: stats.eventos,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/admin/eventos',
      description: 'Eventos programados',
    },
    {
      title: 'Biodiversidade',
      count: stats.biodiversidades,
      icon: Leaf,
      color: 'bg-green-500',
      link: '/admin/biodiversidades',
      description: 'Espécies catalogadas',
    },
  ];

  const quickActions = [
    { label: 'Novo Parque', icon: Trees, link: '/admin/parques/novo', color: 'bg-emerald-600' },
    { label: 'Nova Trilha', icon: Map, link: '/admin/trilhas/nova', color: 'bg-blue-600' },
    { label: 'Novo Evento', icon: Calendar, link: '/admin/eventos/novo', color: 'bg-purple-600' },
    { label: 'Nova Espécie', icon: Leaf, link: '/admin/biodiversidades/novo', color: 'bg-green-600' },
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-red-600 mb-4">{stats.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.loading ? '-' : card.count}
                </h3>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-xs text-gray-400 mt-1">{card.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.link}
                className={`${action.color} text-white rounded-lg p-4 flex items-center justify-between hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{action.label}</span>
                </div>
                <Plus className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Bem-vindo ao Tere Verde!</h2>
            <p className="text-primary-100 mt-1 text-sm">
              Gerencie parques, trilhas, eventos e biodiversidade de forma simples e eficiente.
              Use o menu lateral para navegar entre as seções.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
