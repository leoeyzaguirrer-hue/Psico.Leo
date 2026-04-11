"use client";
import { useState } from "react";

// Tarjeta reutilizable
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 ${className}`}>
      {children}
    </div>
  );
}

// SOLUCIÓN: Movemos Field AFUERA de la pantalla principal.
// Ahora recibe 'value' y 'onChange' como propiedades.
const Field = ({ label, id, value, onChange, type = "text", placeholder, multiline, required }) => (
  <div className="mb-6">
    <label className="text-white/80 text-base font-medium block mb-2">
      {label} {required && <span className="text-psico-yellow">*</span>}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-black/20 border border-white/20 rounded-xl py-3 px-4 text-white text-base md:text-lg outline-none focus:border-psico-yellow focus:ring-1 focus:ring-psico-yellow transition-all resize-y custom-scrollbar"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/20 border border-white/20 rounded-xl py-3 px-4 text-white text-base md:text-lg outline-none focus:border-psico-yellow focus:ring-1 focus:ring-psico-yellow transition-all"
      />
    )}
  </div>
);

export default function PersonalDataScreen({ name, onNext, onBack }) {
  const [form, setForm] = useState({
    nombre: name || "", 
    email: "",
    telefono: "",
    emergenciaNombre: "",
    emergenciaTelefono: "",
    motivoConsulta: "",
    tratamientoPrevio: "",
    modalidad: "presencial",
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Validación básica
  const isFormValid = form.nombre && form.email && form.telefono && form.motivoConsulta;

  return (
    <div className="h-full flex flex-col">
      {/* Cabecera */}
      <div className="p-6 md:px-12 md:pt-12 md:pb-6 w-full max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="text-psico-yellow text-base md:text-lg font-medium mb-6 hover:underline transition-all"
        >
          ← Volver al consentimiento
        </button>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 font-serif tracking-tight">
          Tus datos
        </h2>
        <p className="text-white/60 text-base md:text-xl">
          Esta información es estrictamente confidencial.
        </p>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full pb-8">
          
          <Card className="mb-6">
            <h4 className="text-psico-yellow font-bold text-xl md:text-2xl mb-6">Información personal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {/* Ahora le pasamos value y onChange a cada Field */}
              <Field label="Nombre completo" id="nombre" value={form.nombre} onChange={update} placeholder="Tu nombre" required />
              <Field label="Email" id="email" value={form.email} onChange={update} type="email" placeholder="tu@email.com" required />
              <div className="md:col-span-2">
                <Field label="Teléfono / WhatsApp" id="telefono" value={form.telefono} onChange={update} placeholder="+591 ..." required />
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h4 className="text-psico-yellow font-bold text-xl md:text-2xl mb-6">Contacto de emergencia</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="Nombre del contacto" id="emergenciaNombre" value={form.emergenciaNombre} onChange={update} placeholder="Familiar o persona de confianza" />
              <Field label="Teléfono del contacto" id="emergenciaTelefono" value={form.emergenciaTelefono} onChange={update} placeholder="+591 ..." />
            </div>
          </Card>

          <Card className="mb-6">
            <h4 className="text-psico-yellow font-bold text-xl md:text-2xl mb-6">Sobre tu proceso</h4>
            
            <Field 
              label="¿Qué te trae a consulta?" 
              id="motivoConsulta" 
              value={form.motivoConsulta}
              onChange={update}
              multiline 
              required
              placeholder="Cuéntame brevemente qué te gustaría trabajar..." 
            />
            
            <div className="mb-8 mt-6">
              <label className="text-white/80 text-base font-medium block mb-3">
                ¿Has tenido tratamiento psicológico antes?
              </label>
              <div className="flex flex-wrap gap-3">
                {["Sí", "No"].map((opt) => (
                  <button 
                    key={opt} 
                    onClick={() => update("tratamientoPrevio", opt)} 
                    className={`py-2 px-6 rounded-full font-medium text-base transition-all ${
                      form.tratamientoPrevio === opt 
                        ? "bg-psico-yellow text-psico-dark" 
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/80 text-base font-medium block mb-3">
                Modalidad de atención preferida
              </label>
              <div className="flex flex-wrap gap-3">
                {[["presencial", "🏢 Presencial (Irpavi)"], ["online", "💻 Online"]].map(([val, label]) => (
                  <button 
                    key={val} 
                    onClick={() => update("modalidad", val)} 
                    className={`py-3 px-6 rounded-xl font-medium text-base transition-all ${
                      form.modalidad === val 
                        ? "bg-psico-yellow/20 border-psico-yellow text-psico-yellow border" 
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10 border"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* Footer / Botón de acción */}
      <div className="p-6 md:p-8 bg-psico-dark/80 border-t border-white/10 backdrop-blur-md flex justify-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => onNext(form)}
            disabled={!isFormValid}
            className="w-full bg-psico-yellow text-psico-dark font-bold text-lg md:text-xl py-4 px-8 rounded-full transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            Continuar al Calendario →
          </button>
        </div>
      </div>
    </div>
  );
}