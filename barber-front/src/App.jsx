import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './lib/api';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Perfil from './Pages/Perfil/Perfil';
import CadastroServico from './Pages/Servicos/CadastroServico';
import Agendamento from './Pages/Agendamento/Agendamento';
import MeusAgendamentos from './Pages/MeusAgendamentos/MeusAgendamentos';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('@BarberFlow:token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicos/cadastro"
          element={
            <ProtectedRoute>
              <CadastroServico />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agendar"
          element={
            <ProtectedRoute>
              <Agendamento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meus-agendamentos"
          element={
            <ProtectedRoute>
              <MeusAgendamentos />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;