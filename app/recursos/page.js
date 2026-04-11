"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CATEGORIAS = ["Todos", "ACT", "DBT", "FAP", "AC", "General"];

export default function RecursosPage() {
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [recursosDB, setRecursosDB] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecursos = async () => {
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setRecursosDB(data);
      setLoading(false);
    };
    fetchRecursos();
  }, []);

  const recursosFiltrados = recursosDB.filter(r => 
    filtroActivo === "Todos" ? true : r.categoria === filtroActivo
  );

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#2ECC71] selection:text-white pb-24 relative overflow-hidden">
      
      {/* ANIMACIONES CSS PARA EL FONDO ESMERALDA/CELESTE */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-tool {
          0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          33% { transform: translate(-30px, 50px) rotate(-15deg) scale(1.05); }
          66% { transform: translate(40px, -30px) rotate(10deg) scale(0.95); }
          100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
        }
        .tool-shape {
          animation: float-tool 28s infinite ease-in-out;
        }
      `}} />

      {/* FIGURAS FLOTANTES EN EL FONDO (Diferentes posiciones y colores para Recursos) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Hexágono esmeralda */}
        <svg className="tool-shape absolute top-[5%] left-[-10%] w-[450px] h-[450px] text-[#2ECC71] opacity-[0.08]" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
        </svg>
        {/* Hexágono celeste */}
        <svg className="tool-shape absolute bottom-[5%] right-[-10%] w-[550px] h-[550px] text-[#2B9ED4] opacity-[0.08]" viewBox="0 0 100 100" fill="currentColor" style={{ animationDelay: '-10s', animationDuration: '32s' }}>
          <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
        </svg>
        {/* Malla sutil */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1B4F8A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* 1. CABECERA / HERO */}
      <section className="relative pt-32 pb-12 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/" className="text-[#1B4F8A] font-bold hover:text-[#2ECC71] transition-colors mb-8 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0a1b3d] tracking-tight mb-6 font-serif">
            Herramientas <span className="text-[#2ECC71]">Clínicas</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Ejercicios interactivos, metáforas, tests y registros para trabajar dentro y fuera de sesión.
          </p>
        </div>
      </section>

      {/* 2. CONTENIDO PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-16">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroActivo(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                filtroActivo === cat 
                  ? "bg-[#2ECC71] text-white shadow-[0_4px_15px_rgba(46,204,113,0.4)] border border-[#2ECC71]" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#2ECC71] hover:text-[#0a1b3d]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cuadrícula de Recursos */}
        {loading ? (
          <div className="text-center py-20 text-[#2ECC71] font-bold animate-pulse text-xl">
            Cargando arsenal clínico...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recursosFiltrados.length > 0 ? (
              recursosFiltrados.map(recurso => (
                <div key={recurso.id} className="bg-[#0a1b3d] rounded-[2rem] p-8 flex flex-col h-full hover:-translate-y-2 transition-all duration-300 shadow-xl border-b-8 border-[#2ECC71] relative overflow-hidden group">
                  
                  {/* Brillo decorativo */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <span className="bg-[#1B4F8A] text-[#2ECC71] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {recurso.categoria}
                    </span>
                    <span className="text-white/80 text-xs font-bold border border-white/20 px-3 py-1.5 rounded-lg bg-white/5">
                      {recurso.tipo}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{recurso.titulo}</h3>
                  <p className="text-white/70 mb-8 flex-1 leading-relaxed relative z-10">{recurso.descripcion}</p>
                  
                  <Link href={recurso.link} className="w-full bg-transparent border-2 border-[#2ECC71] text-[#2ECC71] font-bold py-3.5 rounded-xl text-center group-hover:bg-[#2ECC71] group-hover:text-[#0a1b3d] transition-all duration-300 shadow-[0_0_15px_rgba(46,204,113,0.1)] relative z-10">
                    Abrir Herramienta →
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
                <span className="text-5xl mb-4 block opacity-50">🛠️</span>
                <p className="text-gray-500 font-medium text-lg">Próximamente subiremos herramientas para esta categoría.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}