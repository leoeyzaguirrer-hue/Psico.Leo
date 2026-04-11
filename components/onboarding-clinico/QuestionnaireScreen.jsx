"use client";
import { useState } from "react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 ${className}`}>
      {children}
    </div>
  );
}

// Componente para Escala del 1 al 10
const Scale = ({ id, label, answers, update }) => (
  <div className="mb-8">
    <label className="text-white/90 text-base md:text-lg font-medium block mb-4">{label}</label>
    <div className="flex flex-wrap gap-2 md:gap-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
        const isSelected = answers[id] === n;
        return (
          <button 
            key={n} 
            onClick={() => update(id, n)} 
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-sm md:text-base transition-all flex items-center justify-center ${
              isSelected 
                ? "bg-psico-yellow text-psico-dark shadow-md scale-110" 
                : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/5"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
    <div className="flex justify-between w-full max-w-[340px] md:max-w-[420px] mt-2 text-white/40 text-xs md:text-sm uppercase tracking-wider">
      <span>Muy poco</span>
      <span>Mucho</span>
    </div>
  </div>
);

// Componente para Sí/No/A veces
const YesNo = ({ id, label, answers, update }) => (
  <div className="mb-8">
    <label className="text-white/90 text-base md:text-lg font-medium block mb-4">{label}</label>
    <div className="flex flex-wrap gap-3">
      {["Sí", "No", "A veces"].map((opt) => (
        <button 
          key={opt} 
          onClick={() => update(id, opt)} 
          className={`py-3 px-6 rounded-xl font-medium text-base transition-all ${
            answers[id] === opt 
              ? "bg-psico-yellow/20 border-psico-yellow text-psico-yellow border shadow-sm" 
              : "bg-white/5 border-white/10 text-white hover:bg-white/10 border"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default function QuestionnaireScreen({ onNext, onSkip, onBack }) {
  const [answers, setAnswers] = useState({});

  const update = (k, v) => setAnswers((a) => ({ ...a, [k]: v }));

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 md:px-12 md:pt-12 md:pb-4 w-full max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="text-psico-yellow text-base md:text-lg font-medium mb-4 hover:underline transition-all"
        >
          ← Volver a Tarifas
        </button>
        
        <div className="inline-block bg-psico-yellow/20 border border-psico-yellow/40 text-psico-yellow text-xs font-bold px-3 py-1 rounded-full tracking-widest mb-4">
          OPCIONAL
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 font-serif tracking-tight">
          Cuestionario breve
        </h2>
        <p className="text-white/60 text-base md:text-xl leading-relaxed">
          Estas respuestas ayudan a preparar tu primera sesión. Puedes saltar este paso si lo prefieres.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full pb-8 pt-4">
          <Card>
            <Scale id="nivelAnsiedad" label="¿Cómo describirías tu nivel de ansiedad o estrés en las últimas dos semanas?" answers={answers} update={update} />
            <Scale id="dormirBien" label="Del 1 al 10, ¿qué tan bien estás durmiendo últimamente?" answers={answers} update={update} />
            
            <div className="w-full h-px bg-white/10 my-8"></div>
            
            <YesNo id="consumoSustancias" label="¿Consumes actualmente alguna sustancia (alcohol, tabaco, medicamentos, u otras)?" answers={answers} update={update} />
            <YesNo id="trabajoEstudio" label="¿Estás pudiendo mantener tu rutina habitual de trabajo o estudio?" answers={answers} update={update} />
            <YesNo id="redApoyo" label="¿Cuentas con personas de confianza en tu vida cotidiana?" answers={answers} update={update} />
          </Card>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-psico-dark/80 border-t border-white/10 backdrop-blur-md flex justify-center">
        <div className="w-full max-w-4xl flex gap-4 md:gap-6">
          <button
            onClick={onSkip}
            className="flex-1 bg-transparent border-2 border-white/20 text-white font-bold text-lg py-4 rounded-full transition-all hover:bg-white/10"
          >
            Omitir
          </button>
          <button
            onClick={() => onNext(answers)}
            className="flex-[2] bg-psico-yellow text-psico-dark font-bold text-lg py-4 rounded-full transition-all hover:scale-[1.02] shadow-lg"
          >
            Finalizar Solicitud →
          </button>
        </div>
      </div>
    </div>
  );
}