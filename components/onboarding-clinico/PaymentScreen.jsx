"use client";
import { useState } from "react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}

export default function PaymentScreen({ onNext, onBack, isNew }) {
  const [tipo, setTipo] = useState("");
  const [moneda, setMoneda] = useState("bolivianos");

  const options = [
    { id: "sesion", label: "Sesión individual", price: moneda === "bolivianos" ? "200 Bs" : "$35 USD", icon: "📅" },
    { id: "paquete4", label: "Paquete 4 sesiones", price: moneda === "bolivianos" ? "700 Bs" : "≈ $127 USD", icon: "📦" },
    { id: "paquete6", label: "Paquete 6 sesiones", price: moneda === "bolivianos" ? "1100 Bs" : "≈ $190 USD", icon: "🎯" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Cabecera */}
      <div className="p-6 md:px-12 md:pt-12 md:pb-6 w-full max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="text-psico-yellow text-base md:text-lg font-medium mb-6 hover:underline transition-all"
        >
          ← Volver al calendario
        </button>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 font-serif tracking-tight">
          Tipo de sesión
        </h2>
        <p className="text-white/60 text-base md:text-xl">
          Elige la modalidad que mejor se adapte a tu proceso.
        </p>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full pb-8">
          
          <div className="mb-8">
            <label className="text-white/80 text-base font-medium block mb-4 uppercase tracking-wider text-sm">Moneda de pago</label>
            <div className="flex flex-wrap gap-4">
              {[["bolivianos", "🇧🇴 Bolivianos (Bs)"], ["dolares", "🌎 Dólares (USD)"]].map(([val, label]) => (
                <button 
                  key={val} 
                  onClick={() => setMoneda(val)} 
                  className={`py-3 px-6 rounded-full font-bold text-base transition-all ${
                    moneda === val 
                      ? "bg-psico-yellow text-psico-dark shadow-lg shadow-psico-yellow/20" 
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {options.map((opt) => {
              const isSelected = tipo === opt.id;
              return (
                <button 
                  key={opt.id} 
                  onClick={() => setTipo(opt.id)} 
                  className={`w-full text-left rounded-2xl p-6 md:p-8 flex items-center justify-between transition-all border-2 ${
                    isSelected 
                      ? "bg-psico-yellow/10 border-psico-yellow shadow-lg" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-5 md:gap-6">
                    <span className="text-4xl md:text-5xl">{opt.icon}</span>
                    <span className={`font-bold text-lg md:text-xl ${isSelected ? "text-psico-yellow" : "text-white"}`}>
                      {opt.label}
                    </span>
                  </div>
                  <span className="font-black text-xl md:text-3xl text-white font-serif">
                    {opt.price}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 bg-black/20 border border-white/10 rounded-xl p-5">
            <p className="text-white/50 text-sm md:text-base leading-relaxed">
              💳 El pago se realiza un día antes o el mismo día de la sesión. Aceptamos efectivo (presencial), transferencia QR (Bolivia), Wise o Link de pago seguro (Internacional).
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="p-6 md:p-8 bg-psico-dark/80 border-t border-white/10 backdrop-blur-md flex justify-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => onNext(tipo)}
            disabled={!tipo}
            className="w-full bg-psico-yellow text-psico-dark font-bold text-lg md:text-xl py-4 px-8 rounded-full transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            {isNew ? "Continuar al Cuestionario →" : "Confirmar solicitud →"}
          </button>
        </div>
      </div>
    </div>
  );
}