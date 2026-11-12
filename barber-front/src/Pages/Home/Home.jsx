import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Scissors, LogOut, User, Calendar, ShieldCheck, Zap, Brush } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('@BarberFlow:token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        localStorage.removeItem('@BarberFlow:token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('@BarberFlow:token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-700 rounded-xl flex items-center justify-center">
              <Scissors size={20} className="text-zinc-950" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              Barber<span className="text-amber-500">Flow</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-zinc-500">Logado como</p>
              <p className="font-medium text-white">{user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-zinc-800/50 border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all flex items-center justify-center"
              title="Sair"
            >
              <LogOut size={20} className="text-zinc-400 hover:text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-950/50 border border-white/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-50%] w-[60%] h-[60%] bg-amber-600/5 blur-[150px] rounded-full" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Olá, <span className="text-amber-500">{user.name.split(' ')[0]}</span>! 👋
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mb-8">
                Bem-vindo ao seu painel de agendamentos. Gerencie seus horários, barbeiros e serviços de forma simples e elegante.
              </p>
              <button
                onClick={() => navigate('/agendar')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/25 active:scale-[0.98]"
              >
                <Calendar size={24} className="group-hover:animate-bounce" />
                <span className="text-lg">Agendar Horário</span>
                <span className="hidden sm:inline">Marcar meu corte</span>
              </button>
              <div className="mt-8 flex flex-wrap gap-4">
                <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-500" />
                  {user.role === 'BARBER' ? 'Barbeiro' : 'Cliente'}
                </span>
                <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300 flex items-center gap-2">
                  <User size={16} className="text-amber-500" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={24} className="text-amber-500" />
            Ações rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/meus-agendamentos')}
              className="group p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all text-left cursor-pointer"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Calendar size={24} className="text-amber-500" />
              </div>
              <h4 className="text-white font-semibold mb-1">Meus Agendamentos</h4>
              <p className="text-zinc-500 text-sm">Ver e gerenciar horários</p>
            </button>

            <button
              onClick={() => navigate('/servicos/cadastro')}
              className="group p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all text-left cursor-pointer"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Brush size={24} className="text-amber-500" />
              </div>
              <h4 className="text-white font-semibold mb-1">Serviços</h4>
              <p className="text-zinc-500 text-sm">Cortes, barba, sobrancelha</p>
            </button>

            <button
              onClick={() => navigate('/perfil')}
              className="group p-6 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-amber-500/50 hover:bg-zinc-900 transition-all text-left cursor-pointer"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <User size={24} className="text-amber-500" />
              </div>
              <h4 className="text-white font-semibold mb-1">Perfil</h4>
              <p className="text-zinc-500 text-sm">Dados pessoais e foto</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}