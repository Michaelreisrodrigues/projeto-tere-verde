import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trees, User, Shield, Leaf, Map, Mountain } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Trees className="w-10 h-10 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tere Verde
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Explore a natureza exuberante de Teresópolis. Descubra parques, trilhas, 
            fauna, flora e eventos especiais em um só lugar.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visitante Card */}
          <button
            onClick={() => navigate('/visitante')}
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-left transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4">
              <Leaf className="w-8 h-8 text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-colors">
              <User className="w-8 h-8 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Sou Visitante
            </h2>
            <p className="text-emerald-200 mb-6">
              Explore parques, trilhas, conheça a biodiversidade local e descubra 
              eventos especiais. Uma experiência completa na natureza.
            </p>
            <div className="flex items-center text-emerald-300 font-medium group-hover:text-white transition-colors">
              <span>Explorar agora</span>
              <Map className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Administrador Card */}
          <button
            onClick={() => navigate('/login')}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-left transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4">
              <Mountain className="w-8 h-8 text-amber-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6 group-hover:bg-amber-500/30 transition-colors">
              <Shield className="w-8 h-8 text-amber-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Sou Administrador
            </h2>
            <p className="text-gray-300 mb-6">
              Acesse o painel administrativo para gerenciar parques, trilhas, 
              eventos e biodiversidade. Controle completo do sistema.
            </p>
            <div className="flex items-center text-amber-300 font-medium group-hover:text-white transition-colors">
              <span>Acessar painel</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-emerald-300/70 text-sm">
            <div className="flex items-center">
              <Trees className="w-4 h-4 mr-2" />
              <span>Parques Naturais</span>
            </div>
            <div className="flex items-center">
              <Map className="w-4 h-4 mr-2" />
              <span>Trilhas</span>
            </div>
            <div className="flex items-center">
              <Leaf className="w-4 h-4 mr-2" />
              <span>Biodiversidade</span>
            </div>
          </div>
          <p className="mt-6 text-emerald-400/50 text-xs">
            © 2026 Tere Verde - Conectando você com a natureza
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
