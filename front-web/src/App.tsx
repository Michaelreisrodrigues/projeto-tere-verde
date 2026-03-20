import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Parques from './pages/Parques';
import ParqueForm from './pages/ParqueForm';
import Trilhas from './pages/Trilhas';
import TrilhaForm from './pages/TrilhaForm';
import Eventos from './pages/Eventos';
import EventoForm from './pages/EventoForm';
import Biodiversidades from './pages/Biodiversidades';
import BiodiversidadeForm from './pages/BiodiversidadeForm';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
      />

      {/* Protected Routes com Layout */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* Parques Routes */}
          <Route path="parques" element={<Parques />} />
          <Route path="parques/novo" element={<ParqueForm />} />
          <Route path="parques/:id/editar" element={<ParqueForm />} />
          
          {/* Trilhas Routes */}
          <Route path="trilhas" element={<Trilhas />} />
          <Route path="trilhas/nova" element={<TrilhaForm />} />
          <Route path="trilhas/:id/editar" element={<TrilhaForm />} />
          
          {/* Eventos Routes */}
          <Route path="eventos" element={<Eventos />} />
          <Route path="eventos/novo" element={<EventoForm />} />
          <Route path="eventos/:id/editar" element={<EventoForm />} />
          
          {/* Biodiversidade Routes */}
          <Route path="biodiversidades" element={<Biodiversidades />} />
          <Route path="biodiversidades/novo" element={<BiodiversidadeForm />} />
          <Route path="biodiversidades/:id/editar" element={<BiodiversidadeForm />} />
        </Route>
      </Route>

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;