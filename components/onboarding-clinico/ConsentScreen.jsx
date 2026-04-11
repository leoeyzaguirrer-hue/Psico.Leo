"use client";
import { useState, useRef } from "react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 ${className}`}>
      {children}
    </div>
  );
}

const ConsentItem = ({ children }) => (
  <li className="text-white/80 text-base md:text-lg leading-relaxed mb-4 pl-2">
    {children}
  </li>
);

export default function ConsentScreen({ onAccept, onBack }) {
  const [accepted, setAccepted] = useState(false);
  const [name, setName] = useState("");
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef();

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setScrolledToBottom(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 md:px-12 md:pt-12 md:pb-6 w-full max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="text-psico-yellow text-base md:text-lg font-medium mb-6 hover:underline transition-all"
        >
          ← Volver al inicio
        </button>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 font-serif tracking-tight">
          Consentimiento Informado
        </h2>
        <p className="text-white/60 text-base md:text-xl">
          Por favor, lee con atención antes de continuar.
        </p>
        
        {!scrolledToBottom && (
          <div className="bg-psico-yellow/10 border border-psico-yellow/30 rounded-lg py-3 px-6 mt-4 text-base text-psico-yellow font-medium inline-block shadow-lg">
            ↓ Desplázate hasta el final para poder aceptar
          </div>
        )}
      </div>

      <div 
        ref={scrollRef} 
        onScroll={handleScroll} 
        className="flex-1 overflow-y-auto px-6 md:px-12 custom-scrollbar"
      >
        <div className="max-w-4xl mx-auto w-full pb-8">
          <Card className="mb-6">
            <h4 className="text-psico-yellow font-bold text-lg md:text-xl mb-3">Sobre el terapeuta</h4>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              Leonardo Eyzaguirre Rojas es Magíster en Psicología y especialista en Psicoterapias Conductuales-Contextuales (ACT, FAP, DBT, AC), con formación por CIPCO y Maestría en Análisis Funcional del Comportamiento otorgada por SAVECC.
            </p>
          </Card>

          <Card className="mb-6">
            <h4 className="text-psico-yellow font-bold text-lg md:text-xl mb-3">Sobre el enfoque terapéutico</h4>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              El enfoque es conductual-contextual, basado en el análisis funcional del comportamiento. No busca únicamente reducir síntomas, sino acompañar a construir una vida con mayor flexibilidad psicológica, sentido y bienestar.
            </p>
          </Card>

          <Card className="mb-6">
            <h4 className="text-psico-yellow font-bold text-xl md:text-2xl mb-5">Contrato terapéutico</h4>
            <ul className="list-disc pl-5 m-0 marker:text-psico-yellow/50">
              <ConsentItem>Toda la información obtenida durante el proceso terapéutico se mantendrá en absoluta reserva. Se establece un vínculo de confidencialidad profesional.</ConsentItem>
              <ConsentItem>La información de la consulta no podrá utilizarse con fines judiciales. Ante requerimiento judicial, solo se informará el número de sesiones, asistentes y duración.</ConsentItem>
              <ConsentItem>El terapeuta comunicará sus limitaciones si el problema presentado escapa a su formación profesional, y realizará la derivación correspondiente.</ConsentItem>
              <ConsentItem>Cualquier registro de sesiones (apuntes, grabación, video) requiere autorización explícita del consultante.</ConsentItem>
              <ConsentItem>Las evaluaciones psicométricas o psicodiagnósticas requieren autorización y sus resultados se comunican oral y exclusivamente al evaluado, sin posibilidad de informes escritos para terceros sin autorización expresa.</ConsentItem>
              <ConsentItem>Las interconsultas con otros profesionales requieren autorización del consultante sobre la información a compartir.</ConsentItem>
              <ConsentItem>Si el consultante es menor de edad o tiene capacidades diferenciadas, se aplican los mismos principios de confidencialidad y beneficencia.</ConsentItem>
              <ConsentItem>El consultante puede abandonar la terapia cuando lo considere pertinente. Solo ante riesgo de suicidio, maltrato o daño a terceros, el terapeuta propondrá continuar; la decisión final siempre es del consultante.</ConsentItem>
              <ConsentItem>Si una sesión previa se prolongara, los minutos serán repuestos.</ConsentItem>
              <ConsentItem>En caso de necesitar postergar una sesión, se notificará con al menos dos días de anticipación y se coordinará la nueva fecha a la brevedad.</ConsentItem>
              <ConsentItem>El terapeuta es responsable de lo que ocurre dentro del espacio terapéutico. No se hace responsable de situaciones ocurridas fuera de las sesiones.</ConsentItem>
            </ul>
          </Card>

          <Card className="mb-6">
            <h4 className="text-psico-yellow font-bold text-xl md:text-2xl mb-4">Sobre la teleterapia (sesiones online)</h4>
            <p className="text-white/60 text-base md:text-lg mb-3 italic">Beneficios:</p>
            <ul className="list-disc pl-5 m-0 marker:text-psico-yellow/50">
              <ConsentItem>Acceso a servicios en lugares o momentos donde no estarían disponibles de otro modo.</ConsentItem>
              <ConsentItem>Mayor comodidad y menores retrasos que las sesiones presenciales.</ConsentItem>
              <ConsentItem>Posibilidad de recibir terapia cuando el traslado al consultorio no es posible.</ConsentItem>
            </ul>
            <p className="text-white/60 text-base md:text-lg mt-6 mb-3 italic">Riesgos:</p>
            <ul className="list-disc pl-5 m-0 marker:text-psico-yellow/50">
              <ConsentItem>Los servicios pueden verse afectados por fallas técnicas o de conexión.</ConsentItem>
              <ConsentItem>Existen riesgos potenciales de privacidad asociados a los medios digitales, aunque se toman todos los recaudos posibles.</ConsentItem>
              <ConsentItem>Las posibilidades de intervención directa en crisis pueden ser más limitadas que en la modalidad presencial.</ConsentItem>
            </ul>
          </Card>

          <Card className="mb-8 border-psico-yellow/30 bg-psico-dark/40">
            <h4 className="text-psico-yellow font-bold text-xl md:text-2xl mb-4">Declaración de aceptación</h4>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
              He leído el consentimiento informado para asistir a psicoterapia con el Mgtr. Leonardo Eyzaguirre Rojas.
              Entiendo que se trata de un servicio profesional y he sido adecuadamente informado/a sobre mis derechos,
              obligaciones y el encuadre terapéutico. Mi participación es totalmente voluntaria y puedo retirarme cuando lo considere pertinente.
            </p>
            
            <div className="mb-6">
              <label className="text-white/60 text-base block mb-2 font-medium">Tu nombre completo</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Escribe tu nombre..."
                className="w-full bg-black/20 border border-white/20 rounded-xl py-4 px-5 text-white text-base md:text-lg outline-none focus:border-psico-yellow focus:ring-1 focus:ring-psico-yellow transition-all"
              />
            </div>
            
            <label className={`flex items-start gap-4 cursor-pointer ${!scrolledToBottom ? 'opacity-50' : ''} p-4 rounded-xl hover:bg-white/5 transition-colors`}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                disabled={!scrolledToBottom}
                className="mt-1 w-6 h-6 accent-psico-yellow cursor-pointer rounded"
              />
              <span className="text-white/80 text-base md:text-lg leading-relaxed">
                Acepto el consentimiento informado y me comprometo a participar, seguir las
                indicaciones y obligaciones descritas como consultante del consultorio.
              </span>
            </label>
          </Card>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-psico-dark/80 border-t border-white/10 backdrop-blur-md flex justify-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => onAccept(name)}
            disabled={!accepted || !name.trim() || !scrolledToBottom}
            className="w-full bg-psico-yellow text-psico-dark font-bold text-lg md:text-xl py-4 px-8 rounded-full transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}