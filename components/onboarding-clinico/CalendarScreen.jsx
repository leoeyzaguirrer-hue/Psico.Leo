"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function CalendarScreen({ selectedSlot, onSelect, onBack }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState(null);
  const [selected, setSelected] = useState(selectedSlot || null);

  // CARGAR DISPONIBILIDAD REAL DESDE SUPABASE
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('status', 'free') // Solo mostramos los que están libres
        .gte('date', new Date().toISOString().split('T')[0]) // Solo fechas de hoy en adelante
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error("Error cargando disponibilidad:", error);
      } else {
        // Agrupamos los datos por fecha para el diseño de la web
        const grouped = data.reduce((acc, curr) => {
          const date = curr.date;
          if (!acc[date]) {
            const d = new Date(date + "T12:00:00");
            acc[date] = {
              date: date,
              dayName: new Intl.DateTimeFormat("es-BO", { weekday: "short" }).format(d),
              dayNumber: d.getDate(),
              monthName: new Intl.DateTimeFormat("es-BO", { month: "short" }).format(d),
              slots: []
            };
          }
          acc[date].slots.push({ time: curr.time.substring(0, 5), available: true });
          return acc;
        }, {});
        
        const scheduleArray = Object.values(grouped);
        setSchedule(scheduleArray);
        if (scheduleArray.length > 0) setActiveDate(scheduleArray[0].date);
      }
      setLoading(false);
    };

    fetchAvailability();
  }, []);

  const activeDayData = schedule.find(d => d.date === activeDate);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 md:px-12 md:pt-12 md:pb-6 w-full max-w-4xl mx-auto">
        <button onClick={onBack} className="text-psico-yellow text-base md:text-lg font-medium mb-6 hover:underline transition-all">
          ← Volver a mis datos
        </button>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 font-serif tracking-tight">Elige tu horario</h2>
        <p className="text-white/60 text-base md:text-xl">Selecciona un espacio disponible para tu atención.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full pb-8">
          
          {loading ? (
            <div className="text-psico-yellow animate-pulse text-center py-20 text-xl font-serif">Buscando horarios disponibles...</div>
          ) : schedule.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-white/50">
              No hay horarios disponibles esta semana. Por favor, contacta a Leo directamente.
            </div>
          ) : (
            <>
              {/* Días */}
              <div className="mb-8">
                <h4 className="text-white/80 font-medium mb-4 text-sm uppercase tracking-wider">Próximos días</h4>
                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                  {schedule.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setActiveDate(day.date)}
                      className={`flex flex-col items-center justify-center min-w-[90px] p-4 rounded-2xl border transition-all ${
                        activeDate === day.date 
                          ? "bg-psico-yellow border-psico-yellow text-psico-dark shadow-lg shadow-psico-yellow/20" 
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase mb-1">{day.dayName}</span>
                      <span className="text-2xl font-black">{day.dayNumber}</span>
                      <span className="text-xs capitalize">{day.monthName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horas */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activeDayData?.slots.map((slot, index) => {
                    const isSelected = selected?.date === activeDate && selected?.time === slot.time;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelected({ date: activeDate, time: slot.time })}
                        className={`py-4 px-6 rounded-xl font-bold text-lg transition-all border ${
                          isSelected ? "bg-psico-yellow border-psico-yellow text-psico-dark" : "bg-white/5 border-white/10 text-white hover:border-psico-yellow/50"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 bg-psico-dark/80 border-t border-white/10 backdrop-blur-md flex justify-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => onSelect(selected)}
            disabled={!selected}
            className="w-full bg-psico-yellow text-psico-dark font-bold text-lg md:text-xl py-4 px-8 rounded-full transition-all hover:scale-[1.01] disabled:opacity-50 shadow-lg flex justify-between items-center"
          >
            <span>{selected ? `Confirmar ${selected.time}` : "Selecciona un horario"}</span>
            <span>Continuar →</span>
          </button>
        </div>
      </div>
    </div>
  );
}