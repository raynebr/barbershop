import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Scissors, ArrowLeft, Calendar, Clock, User, AlertCircle, Loader2, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MeusAgendamentos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const response = await api.get('/appointments/client');
        setAppointments(response.data);
      } catch (err) {
        console.error("Erro ao carregar agendamentos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'CONFIRMED': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'COMPLETED': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/50';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'CONFIRMED': return 'Confirmado';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  async function handleCancelAppointment(appointmentId) {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      await api.patch(`/appointments/${appointmentId}/cancel`);
      alert('✅ Agendamento cancelado com sucesso!');
      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      const message = error.response?.data?.error || 'Erro ao cancelar. Tente novamente.';
      alert('❌ ' + message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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

          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Meus Agendamentos</h1>
          <p className="text-zinc-400">Acompanhe seus horários agendados</p>
        </header>

        {appointments.length === 0 ? (
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-12 text-center">
            <Calendar size={48} className="mx-auto text-zinc-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Nenhum agendamento encontrado</h2>
            <p className="text-zinc-400 mb-6">Você ainda não tem horários marcados.</p>
            <button
              onClick={() => navigate('/agendar')}
              className="bg-white text-zinc-950 font-bold py-3 px-8 rounded-2xl hover:bg-amber-500 transition-all"
            >
              Agendar Horário
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div
                key={appointment.id}
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                      <Scissors size={24} className="text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{appointment.service?.name || 'Serviço'}</h3>
                      <p className="text-zinc-400 text-sm">R$ {Number(appointment.service?.price || 0).toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(appointment.date)}
                    </span>
                    {appointment.barber && (
                      <span className="flex items-center gap-1">
                        <User size={16} />
                        {appointment.barber.name}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                </div>

                {appointment.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <XCircle size={18} />
                    Cancelar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}