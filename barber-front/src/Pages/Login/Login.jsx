import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Scissors, CheckCircle2, ShieldCheck, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Não limpa o erro aqui - deixa visível até o próximo submit
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não conferem');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await api.post(endpoint, payload);

      if (response.data.token) {
        localStorage.setItem('@BarberFlow:token', response.data.token);
        navigate('/home');
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao autenticar. Tente novamente.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Detalhe de luz de fundo (Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 blur-[120px] rounded-full" />

      <div className="max-w-[400px] w-full z-10">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] mb-6 rotate-3">
            <Scissors size={40} className="text-zinc-950 -rotate-3" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Barber<span className="text-amber-500">Flow</span>
          </h1>
          <div className="h-1 w-12 bg-amber-500 mt-2 rounded-full" />
        </div>

        {/* Card Principal */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-xl font-semibold text-zinc-100 mb-2 text-center">
            {isRegister ? 'Criar conta' : 'Bem-vindo de volta'}
          </h2>
          <p className="text-zinc-500 text-sm mb-8 text-center px-4">
            {isRegister
              ? 'Preencha seus dados para começar'
              : 'Acesse sua conta para gerenciar seus agendamentos.'}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 text-red-300 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-zinc-400 text-sm mb-1.5">Nome completo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={isRegister}
                    className="w-full bg-zinc-800/50 border border-white/10 pl-12 pr-4 py-3 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-zinc-400 text-sm mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800/50 border border-white/10 pl-12 pr-4 py-3 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-zinc-400 text-sm mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800/50 border border-white/10 pl-12 pr-12 py-3 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="block text-zinc-400 text-sm mb-1.5">Confirmar senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-800/50 border border-white/10 pl-12 pr-4 py-3 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-white text-zinc-950 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          {/* Alternar modo */}
          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-amber-500 hover:text-amber-400 font-semibold transition-colors"
              >
                {isRegister ? 'Faça login' : 'Cadastre-se'}
              </button>
            </p>
          </div>

          {/* Benefícios rápidos */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-zinc-400 text-xs">
              <CheckCircle2 size={16} className="text-amber-500" />
              <span>Agendamento em menos de 1 minuto</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400 text-xs">
              <ShieldCheck size={16} className="text-amber-500" />
              <span>Acesso seguro com email e senha</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[10px] text-zinc-600 text-center uppercase tracking-[0.2em]">
          Estilo & Tradição • Desde 2024
        </p>
      </div>
    </div>
  );
}