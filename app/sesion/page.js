"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import CalendarScreen from "@/components/onboarding-clinico/CalendarScreen";
import PaymentScreen from "@/components/onboarding-clinico/PaymentScreen"; // IMPORTAMOS TARIFAS

const SCREENS = {
  IDENTIFY: "IDENTIFY",
  CALENDAR: "CALENDAR",
  PAYMENT: "PAYMENT", // NUEVA PANTALLA
  TRACKING: "TRACKING",
  CONFIRMATION: "CONFIRMATION"
};

// ==========================================
// PANTALLA 1: DATOS RÁPIDOS
// ==========================================
function QuickIdentifyScreen({ onNext }) {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", modalidad: "online" });
  const isValid = form.nombre && form.email && form.telefono;

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 md:px-12 md:pt-12 md:pb-6 w-full max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 font-serif">Agendar Sesión</h2>
        <p className="text-white/60 text-lg">Qué bueno verte de nuevo. Confirma tus datos para continuar.</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 md:px-12 custom-scrollbar pb-8">
        <div className="max-w-4xl mx-auto w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Nombre completo</label>
              <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full bg-black/20 border border-white/20 rounded-xl py-3 px-4 text-white outline-none focus:border-psico-yellow" placeholder="Tu nombre..." />
            </div>
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">WhatsApp</label>
              <input type="text" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} className="w-full bg-black/20 border border-white/20 rounded-xl py-3 px-4 text-white outline-none focus:border-psico-yellow" placeholder="+591..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-white/80 text-sm font-medium block mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-black/20 border border-white/20 rounded-xl py-3 px-4 text-white outline-none focus:border-psico-yellow" placeholder="tu@email.com" />
            </div>
          </div>
          <div>
            <label className="text-white/80 text-sm font-medium block mb-3">Modalidad</label>
            <div className="flex gap-3">
              {[["presencial", "🏢 Presencial"], ["online", "💻 Online"]].map(([val, label]) => (
                <button key={val} onClick={() => setForm({...form, modalidad: val})} className={`py-3 px-6 rounded-xl font-medium transition-all ${form.modalidad === val ? "bg-psico-yellow/20 border-psico-yellow text-psico-yellow border" : "bg-white/5 border-white/10 text-white hover:bg-white/10 border"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-psico-dark/80 border-t border-white/10 flex justify-center">
        <button onClick={() => onNext(form)} disabled={!isValid} className="w-full max-w-4xl bg-psico-yellow text-psico-dark font-bold text-lg py-4 rounded-full transition-all hover:scale-[1.01] disabled:opacity-50">
          Ir al Calendario →
        </button>
      </div>
    </div>
  );
}

// ==========================================
// PANTALLA 3: TERMÓMETRO DE SESIÓN
// ==========================================
function TrackingScreen({ onNext, onBack }) {
  const [form, setForm] = useState({ ansiedad: 5, sueno: 5, motivo: "" });

  const ScaleBtn = ({ value, current, onClick }) => (
    <button onClick={() => onClick(value)} className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-sm md:text-base transition-all flex items-center justify-center ${current === value ? "bg-psico-yellow text-psico-dark shadow-md scale-110" : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/5"}`}>
      {value}
    </button>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 md:px-12 md:pt-12 md:pb-4 w-full max-w-4xl mx-auto">
        <button onClick={onBack} className="text-psico-yellow font-medium mb-4 hover:underline">← Cambiar tarifa</button>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 font-serif">Termómetro de sesión</h2>
        <p className="text-white/60 text-lg">Ayúdame a preparar nuestro espacio de hoy.</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 md:px-12 custom-scrollbar pb-8">
        <div className="max-w-4xl mx-auto w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          
          <div className="mb-8">
            <label className="text-white text-lg font-bold block mb-4">¿Qué tema te gustaría priorizar hoy?</label>
            <textarea value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} rows={3} placeholder="Situaciones recientes, emociones, tareas pendientes..." className="w-full bg-black/20 border border-white/20 rounded-xl py-3 px-4 text-white outline-none focus:border-psico-yellow resize-none custom-scrollbar" />
          </div>

          <div className="mb-8">
            <label className="text-white text-lg font-bold block mb-4">Nivel de ansiedad/estrés (Últimos días)</label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[1,2,3,4,5,6,7,8,9,10].map(n => <ScaleBtn key={n} value={n} current={form.ansiedad} onClick={v => setForm({...form, ansiedad: v})} />)}
            </div>
            <div className="flex justify-between max-w-[420px] mt-2 text-white/40 text-xs uppercase"><span className="text-green-400">Muy bajo</span><span className="text-red-400">Muy alto</span></div>
          </div>

          <div>
            <label className="text-white text-lg font-bold block mb-4">Calidad del sueño (1=Pésimo, 10=Excelente)</label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[1,2,3,4,5,6,7,8,9,10].map(n => <ScaleBtn key={n} value={n} current={form.sueno} onClick={v => setForm({...form, sueno: v})} />)}
            </div>
          </div>

        </div>
      </div>
      <div className="p-6 bg-psico-dark/80 border-t border-white/10 flex justify-center">
        <button onClick={() => onNext(form)} disabled={!form.motivo} className="w-full max-w-4xl bg-psico-yellow text-psico-dark font-bold text-lg py-4 rounded-full transition-all hover:scale-[1.01] disabled:opacity-50 shadow-lg">
          Confirmar Sesión →
        </button>
      </div>
    </div>
  );
}

// ==========================================
// CONTROLADOR PRINCIPAL
// ==========================================
export default function AgendarRetornoPage() {
  const [screen, setScreen] = useState(SCREENS.IDENTIFY);
  const [data, setData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-psico-dark font-sans flex items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-5xl h-[90vh] bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl flex flex-col overflow-hidden relative shadow-2xl">
        
        {screen === SCREENS.IDENTIFY && (
          <QuickIdentifyScreen onNext={(info) => { setData({ ...data, id: info }); setScreen(SCREENS.CALENDAR); }} />
        )}

        {screen === SCREENS.CALENDAR && (
          <CalendarScreen 
            selectedSlot={data.slot} 
            onSelect={(slot) => { setData({ ...data, slot }); setScreen(SCREENS.PAYMENT); }} 
            onBack={() => setScreen(SCREENS.IDENTIFY)} 
          />
        )}

        {/* AQUÍ INSERTAMOS LA PANTALLA DE TARIFAS */}
        {screen === SCREENS.PAYMENT && (
          <PaymentScreen
            isNew={false} // Pasamos false para que el botón no diga "Ir al cuestionario" sino algo más directo
            onNext={(paymentData) => {
              setData({ ...data, payment: paymentData });
              setScreen(SCREENS.TRACKING);
            }}
            onBack={() => setScreen(SCREENS.CALENDAR)}
          />
        )}

        {screen === SCREENS.TRACKING && (
          <TrackingScreen 
            onBack={() => setScreen(SCREENS.PAYMENT)}
            onNext={async (trackingInfo) => {
              setIsSubmitting(true);
              
              const finalPayload = {
                personalData: {
                  nombre: data.id.nombre,
                  email: data.id.email,
                  telefono: data.id.telefono,
                  modalidad: data.id.modalidad,
                  motivoConsulta: trackingInfo.motivo + ` (Ansiedad: ${trackingInfo.ansiedad}/10, Sueño: ${trackingInfo.sueno}/10)`
                },
                slot: data.slot,
                payment: data.payment // Ahora sí mandamos el pago correcto
              };

              const { error } = await supabase.from('appointments').insert([{
                patient_name: data.id.nombre,
                patient_email: data.id.email,
                patient_phone: data.id.telefono,
                modality: data.id.modalidad,
                appointment_date: data.slot.date,
                appointment_time: data.slot.time,
                payment_type: data.payment, // Guardamos en base de datos: 'sesion', 'paquete4' o 'paquete6'
                status: 'pending'
              }]);

              if (!error) {
                await supabase.from('availability').update({ status: 'booked' }).eq('date', data.slot.date).eq('time', data.slot.time);
                
                try { await fetch('/api/notificar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(finalPayload) }); } 
                catch (err) { console.error(err); }
                
                setIsSubmitting(false);
                setScreen(SCREENS.CONFIRMATION);
              } else {
                alert("Error al agendar. Intenta de nuevo.");
                setIsSubmitting(false);
              }
            }} 
          />
        )}

        {screen === SCREENS.CONFIRMATION && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-psico-yellow/20 border-4 border-psico-yellow rounded-full flex items-center justify-center text-4xl mb-8 text-psico-yellow">✓</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">¡Sesión confirmada!</h2>
            <p className="text-white/70 text-lg max-w-md mx-auto mb-10">Nos vemos en nuestro horario. Si necesitas modificarlo, escríbeme por WhatsApp.</p>
            <button onClick={() => window.location.href = '/'} className="bg-psico-yellow text-psico-dark font-bold text-lg py-4 px-10 rounded-full hover:scale-105 transition-transform">
              Volver al inicio
            </button>
          </div>
        )}

        {isSubmitting && (
          <div className="absolute inset-0 bg-psico-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
             <div className="text-psico-yellow font-bold text-xl animate-pulse">Confirmando horario...</div>
          </div>
        )}

      </div>
    </div>
  );
}