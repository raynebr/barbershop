import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Scissors, ArrowLeft, Save, Clock, DollarSign, Type, FileText, AlertCircle, List, Trash2, Edit, Loader2, CheckCircle2, Shield, Lock } from 'lucide-react';

export default function CadastroServico() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
  });
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const fetchServices = async () => {
    try {
      const { data } = await api.post('/services/list');
      setServices(data);
    } catch (err) {
      console.error('Erro ao listar serviços:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      navigate('/login');
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.duration_minutes) {
      setError('Nome, preço e duração são obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes),
      };

      await api.post('/services/create', payload);

      setSuccess('Serviço cadastrado com sucesso!');
      setFormData({ name: '', description: '', price: '', duration_minutes: '' });
      await fetchServices();
    } catch (err) {
      console.error('Erro ao cadastrar serviço:', err);
      setError(err.response?.data?.error || 'Erro ao cadastrar serviço. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const isAdmin = user?.role === 'ADMIN';

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

          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {isLoadingUser ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-amber-500" />
          </div>
        ) : (
          <>
            {/* Formulário de Cadastro - SÓ ADMIN */}
            {isAdmin && (
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Cadastrar Novo Serviço</h2>
                    <p className="text-zinc-400">Adicione um novo serviço ao seu catálogo</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                      <Type size={16} />
                      Nome do Serviço *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Corte Masculino"
                      className="w-full bg-zinc-800/50 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                      <FileText size={16} />
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Descreva o serviço..."
                      rows={3}
                      className="w-full bg-zinc-800/50 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                        <DollarSign size={16} />
                        Valor (R$) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full bg-zinc-800/50 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="duration_minutes" className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                        <Clock size={16} />
                        Duração (minutos) *
                      </label>
                      <input
                        type="number"
                        id="duration_minutes"
                        name="duration_minutes"
                        value={formData.duration_minutes}
                        onChange={handleChange}
                        placeholder="30"
                        min="1"
                        className="w-full bg-zinc-800/50 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-zinc-950 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Save size={20} />
                        Cadastrar Serviço
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Listagem de Serviços - TODOS USUÁRIOS LOGADOS */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <List size={20} className="text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold">Serviços Cadastrados</h2>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-sm text-amber-400">
                  {services.length} serviço{services.length !== 1 ? 's' : ''}
                </span>
              </div>

              {isLoadingList ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-amber-500" />
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={48} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-400 text-lg">Nenhum serviço cadastrado ainda</p>
                  {isAdmin ? (
                    <p className="text-zinc-500 mt-1">Cadastre seu primeiro serviço acima</p>
                  ) : (
                    <p className="text-zinc-500 mt-1">Entre em contato com o administrador</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-zinc-800/50 border border-white/5 rounded-2xl p-5 hover:border-amber-500/30 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-lg truncate">{service.name}</h3>
                          <span className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs text-amber-400 flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            Ativo
                          </span>
                        </div>
                        {service.description && (
                          <p className="text-zinc-400 text-sm truncate">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} />
                            {formatPrice(service.price)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {service.duration_minutes} min
                          </span>
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            className="p-2 rounded-xl bg-zinc-700/50 border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all text-zinc-400 hover:text-white"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-2 rounded-xl bg-zinc-700/50 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-zinc-400 hover:text-red-400"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}