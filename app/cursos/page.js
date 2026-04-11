"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // ¡NUEVO: Conectamos la base de datos!

// Las formaciones de paga y categorías las dejamos fijas por ahora
const FORMACIONES = [
  {
    id: 101,
    titulo: "Entrenamiento Intensivo en ACT",
    descripcion: "Programa completo de 8 semanas para terapeutas que buscan dominar el hexaflex.",
    estado: "Próximamente",
    imagen: "/imagenes/foto-leo2.jpg" 
  }
];

const CATEGORIAS = ["Todos", "ACT", "DBT", "FAP", "Análisis Funcional", "Activación Conductual", "RFT"];

export default function CursosPage() {
  const [activeTab, setActiveTab] = useState("capsulas"); 
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  
  // NUEVO: Estados para guardar las cápsulas reales
  const [capsulasDB, setCapsulasDB] = useState([]);
  const [loading, setLoading] = useState(true);

  // NUEVO: Función que va a Supabase a buscar tus cápsulas
  useEffect(() => {
    const fetchCapsulas = async () => {
      const { data, error } = await supabase
        .from('capsulas')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setCapsulasDB(data);
      }
      setLoading(false);
    };

    fetchCapsulas();
  }, []);

  // Filtramos la base de datos real
  const capsulasFiltradas = capsulasDB.filter(c => 
    filtroActivo === "Todos" ? true : c.categoria === filtroActivo
  );

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#F9BC15] selection:text-[#0a1b3d] pb-24 relative overflow-hidden">
      
      {/* ANIMACIONES CSS PARA EL FONDO DORADO */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-gold {
          0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          33% { transform: translate(40px, -60px) rotate(15deg) scale(1.05); }
          66% { transform: translate(-30px, 40px) rotate(-10deg) scale(0.95); }
          100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
        }
        .gold-shape {
          animation: float-gold 25s infinite ease-in-out;
        }
      `}} />

      {/* FIGURAS DORADAS FLOTANTES EN EL FONDO */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="gold-shape absolute top-[-5%] right-[-10%] w-[500px] h-[500px] text-[#F9BC15] opacity-[0.15]" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
        </svg>
        <svg className="gold-shape absolute bottom-[10%] left-[-15%] w-[600px] h-[600px] text-[#F9BC15] opacity-[0.12]" viewBox="0 0 100 100" fill="currentColor" style={{ animationDelay: '-12s', animationDuration: '35s' }}>
          <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
        </svg>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1B4F8A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* 1. CABECERA / HERO */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <Link href="/" className="text-[#1B4F8A] font-bold hover:text-[#F9BC15] transition-colors mb-8 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0a1b3d] tracking-tight mb-6 font-serif">
            Espacio de <span className="text-[#F9BC15]">Entrenamiento</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Recursos clínicos, herramientas interactivas y programas de profundización basados en evidencia.
          </p>
        </div>
      </section>

      {/* 2. SELECTOR DE PESTAÑAS (Tabs) */}
      <section className="max-w-5xl mx-auto px-6 mb-12 relative z-10">
        <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200 max-w-xl mx-auto shadow-inner">
          <button 
            onClick={() => setActiveTab("capsulas")}
            className={`flex-1 py-4 text-sm md:text-base font-bold rounded-xl transition-all duration-300 ${activeTab === "capsulas" ? "bg-[#1B4F8A] text-white shadow-md" : "text-gray-500 hover:text-[#1B4F8A]"}`}
          >
            ⚡ Micro-Cápsulas
          </button>
          <button 
            onClick={() => setActiveTab("formaciones")}
            className={`flex-1 py-4 text-sm md:text-base font-bold rounded-xl transition-all duration-300 ${activeTab === "formaciones" ? "bg-[#1B4F8A] text-white shadow-md" : "text-gray-500 hover:text-[#1B4F8A]"}`}
          >
            📚 Formaciones
          </button>
        </div>
      </section>

      {/* 3. CONTENIDO PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* === VISTA: MICRO-CÁPSULAS === */}
        {activeTab === "capsulas" && (
          <div className="animate-fade-in">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-12">
              {CATEGORIAS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFiltroActivo(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    filtroActivo === cat 
                      ? "bg-[#F9BC15] text-[#0a1b3d] shadow-[0_4px_15px_rgba(249,188,21,0.4)] border border-[#F9BC15]" 
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#F9BC15] hover:text-[#0a1b3d]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cuadrícula de Cápsulas */}
            {loading ? (
               <div className="text-center py-20 text-[#1B4F8A] font-bold animate-pulse text-xl">
                 Cargando recursos clínicos...
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {capsulasFiltradas.length > 0 ? (
                  capsulasFiltradas.map(capsula => (
                    <div key={capsula.id} className="bg-[#1B4F8A] rounded-[2rem] p-8 flex flex-col h-full hover:-translate-y-2 transition-all duration-300 group shadow-xl border-b-8 border-[#F9BC15] relative overflow-hidden">
                      
                      {/* Brillo decorativo interno */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <span className="bg-[#0a1b3d] text-[#F9BC15] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                          {capsula.categoria}
                        </span>
                        <span className="text-[#2B9ED4] text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg">
                          ⏳ {capsula.tiempo}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{capsula.titulo}</h3>
                      <p className="text-white/80 mb-8 flex-1 leading-relaxed relative z-10">{capsula.descripcion}</p>
                      
                      <Link href={capsula.link} className="w-full bg-transparent border-2 border-[#F9BC15] text-[#F9BC15] font-bold py-3.5 rounded-xl text-center group-hover:bg-[#F9BC15] group-hover:text-[#0a1b3d] transition-all duration-300 shadow-[0_0_15px_rgba(249,188,21,0.1)] relative z-10">
                        Abrir cápsula →
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
                    <span className="text-5xl mb-4 block opacity-50">⚙️</span>
                    <p className="text-gray-500 font-medium text-lg">Próximamente subiremos cápsulas para esta categoría.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* === VISTA: FORMACIONES DE PAGA === */}
        {activeTab === "formaciones" && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            {FORMACIONES.map(formacion => (
              <div key={formacion.id} className="bg-[#0a1b3d] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border border-[#1B4F8A]">
                <div className="relative h-64 w-full bg-white">
                  <Image src={formacion.imagen} alt={formacion.titulo} fill className="object-cover" />
                  <div className="absolute top-5 right-5 bg-[#F9BC15] text-[#0a1b3d] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    {formacion.estado}
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-1 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 text-[#1B4F8A] opacity-30 w-40 h-40">
                    <svg viewBox="0 0 100 100" fill="currentColor"><polygon points="50 1 95 25 95 75 50 99 5 75 5 25" /></svg>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-4 relative z-10">{formacion.titulo}</h3>
                  <p className="text-[#2B9ED4] text-lg mb-8 flex-1 leading-relaxed relative z-10">{formacion.descripcion}</p>
                  <button disabled className="w-full bg-white/10 border border-white/20 text-white/50 font-bold py-4 rounded-xl cursor-not-allowed relative z-10">
                    Lista de espera (Muy pronto)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}