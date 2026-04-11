"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ItacaPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [correctPass, setCorrectPass] = useState("");
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(false);

  // 1. Cargamos la contraseña real y los módulos desde la DB
  useEffect(() => {
    const fetchData = async () => {
      const { data: passData } = await supabase.from('itaca_config').select('password').single();
      const { data: modData } = await supabase.from('itaca_modules').select('*').order('created_at', { ascending: true });
      if (passData) setCorrectPass(passData.password);
      if (modData) setModules(modData);
    };
    fetchData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPass) {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Fondo decorativo sutil */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1B4F8A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-md w-full bg-[#0a1b3d] rounded-[2rem] p-10 shadow-2xl relative z-10 border border-[#ff4757]/30">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🔒</div>
          <h1 className="text-2xl font-serif font-bold text-white text-center mb-2">Acceso Institucional</h1>
          <p className="text-white/60 text-center mb-8 text-sm">Ingresa la clave del Master ITACA para acceder a los materiales.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white text-center tracking-[0.3em] outline-none focus:border-[#ff4757]"
            />
            {error && <p className="text-red-400 text-xs text-center font-bold">Clave incorrecta. Consulta con administración.</p>}
            <button type="submit" className="w-full bg-[#ff4757] text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-all shadow-lg">
              Entrar al Master →
            </button>
          </form>
          <Link href="/portal" className="block text-center text-white/40 text-xs mt-6 hover:text-white transition-colors">← Volver al Portal</Link>
        </div>
      </main>
    );
  }

  // --- VISTA DE ALUMNOS AUTORIZADOS ---
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-red-100 pb-24 relative overflow-hidden">
      {/* Fondo blanco con ondas sutiles rojas/doradas */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]">
        <svg className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] text-red-500" viewBox="0 0 100 100" fill="currentColor"><polygon points="50 1 95 25 95 75 50 99 5 75 5 25" /></svg>
      </div>

      {/* SECCIÓN HERO CORREGIDA */}
      <section className="relative pt-32 pb-12 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge con mejor contraste */}
          <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-red-500/20">
            Área Exclusiva Alumnos
          </div>
          
          {/* Título en Blanco para que se vea sobre el fondo azul */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 font-serif">
            Master <span className="text-[#F9BC15]">ITACA</span>
          </h1>
          
          {/* Subtítulo en blanco suave (opacidad 80%) */}
          <p className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
            Bienvenido a tu plataforma de formación avanzada.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 gap-4">
          {modules.map((mod) => (
            <div key={mod.id} className="bg-[#0a1b3d] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl border-l-8 border-red-500 group">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{mod.titulo}</h3>
                <p className="text-white/60 text-sm">{mod.descripcion}</p>
              </div>
              <Link href={mod.link} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm border border-white/10 transition-all">
                Ver Módulo →
              </Link>
            </div>
          ))}
          {modules.length === 0 && <p className="text-center text-gray-400 py-20">No hay módulos disponibles todavía.</p>}
        </div>
      </section>
    </main>
  );
}