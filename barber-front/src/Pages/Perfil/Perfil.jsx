import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Scissors, LogOut, User, Mail, Phone, Calendar, ShieldCheck, ArrowLeft, BadgeInfo } from 'lucide-react';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile/me');
        setUser(data);
      } catch (e) {
        console.error('Erro ao carregar perfil:', e);
        localStorage.removeItem('@BarberFlow:token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('@BarberFlow:token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-';

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
            <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
              Voltar
            </button>
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

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Cabeçalho do perfil */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-3xl font-bold text-zinc-950">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-zinc-400 mt-1">{user.email}</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-sm flex items-center gap-1">
                  <ShieldCheck size={16} /> {user.role === 'BARBER' ? 'Barbeiro' : 'Cliente'}
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm">
                  Membro desde {createdAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informações pessoais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BadgeInfo size={20} className="text-amber-500" /> Dados Pessoais
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={18} className="text-zinc-500" />
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide">Nome completo</p>
                  <p className="text-white">{user.name || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-zinc-500" />
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide">Email</p>
                  <p className="text-white">{user.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-zinc-500" />
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide">Telefone</p>
                  <p className="text-white">{user.phone || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-amber-500" /> Conta
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wide">ID do usuário</p>
                <p className="text-zinc-200 font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wide">Perfil</p>
                <p className="text-white">{user.role}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wide">Criado em</p>
                <p className="text-white">{createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
