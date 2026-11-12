import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Scissors, ArrowLeft, Calendar, Clock, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function Agendamento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [error, setError] = useState('');

  const [barberId, setBarberId] = useState('');
  const [serviceId, setServiceId] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [barbersRes, servicesRes] = await Promise.all([
          api.get('/list/barbers'),
          api.get('/services/list')
        ]);

        setBarbers(barbersRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadAvailableTimes() {
      if (!selectedDate || !barberId) {
        setAvailableTimes([]);
        return;
      }

      setLoadingTimes(true);
      try {
        const response = await api.get('/appointments/available', {
          params: {
            date: selectedDate,
            barber_id: barberId
          }
        });
        setAvailableTimes(response.data);
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
        setAvailableTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    }

    loadAvailableTimes();
  }, [selectedDate, barberId]);

  async function handleCreateAppointment(e) {
    e.preventDefault();

    if (!selectedTime) {
      setError('Selecione um horário disponível!');
      return;
    }

    setLoading(true);
    try {
      const fullDate = new Date(`${selectedDate}T${selectedTime}:00`);

      await api.post('/appointments/create', {
        barber_id: barberId,
        service_id: serviceId,
        date: fullDate.toISOString(),
      });

      alert('✅ Agendamento realizado com sucesso!');
      navigate('/home');
    } catch (error) {
      console.error('Erro ao agendar:', error);
      const message = error.response?.data?.error || 'Erro ao agendar. Tente novamente.';
      alert('❌ ' + message);
    } finally {
      setLoading(false);
    }
  }

  // Valida se é domingo ou segunda
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    const dateSelected = new Date(dateValue + 'T00:00:00');

    if (dateSelected.getDay() === 0 || dateSelected.getDay() === 1) {
      alert("Ops! A barbearia não abre aos domingos e segundas-feiras. 😴");
      setSelectedDate('');
      setSelectedTime('');
      return;
    }

    setSelectedDate(dateValue);
    setSelectedTime('');
  };

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

      <main className="max-w-md mx-auto px-6 py-12">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Agendar Horário</h1>
            <p className="text-zinc-400">Escolha o melhor horário para você</p>
          </header>

          <form onSubmit={handleCreateAppointment} className="space-y-6">
            {/* Seleção de Barbeiro */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                <User size={16} />
                Barbeiro
              </label>
              <select
                required
                value={barberId}
                onChange={e => {
                  setBarberId(e.target.value);
                  setSelectedTime('');
                }}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none cursor-pointer text-white"
              >
                <option value="">Selecione o profissional</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.id}>{barber.name}</option>
                ))}
                {barbers.length === 0 && <option value="" disabled>Nenhum barbeiro disponível</option>}
              </select>
            </div>

            {/* Seleção de Serviço */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                <Scissors size={16} />
                Serviço
              </label>
              <select
                required
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none cursor-pointer text-white"
              >
                <option value="">O que vamos fazer?</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} — R$ {Number(service.price).toFixed(2).replace('.', ',')}
                  </option>
                ))}
                {services.length === 0 && <option value="" disabled>Nenhum serviço disponível</option>}
              </select>
            </div>

            {/* Seleção de Data */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Dia do Agendamento
              </label>
              <input
                type="date"
                min={today}
                required
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-white"
              />
            </div>

            {/* Seleção de Horário */}
            {selectedDate && (
              <div>
                <label className="block text-zinc-400 text-sm mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  {loadingTimes ? 'Buscando horários...' : 'Horários Disponíveis'}
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.length > 0 ? (
                    availableTimes.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                          selectedTime === time
                            ? 'bg-amber-500 border-amber-500 text-zinc-950'
                            : 'bg-zinc-800/50 border-white/10 text-zinc-300 hover:border-amber-500'
                        }`}
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    !loadingTimes && <p className="col-span-3 text-xs text-zinc-500 text-center py-4">Nenhum horário disponível para este dia.</p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedTime}
              className="w-full bg-white text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Finalizar Agendamento
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}