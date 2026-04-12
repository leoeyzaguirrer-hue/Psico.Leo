"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ==========================================
// COMPONENTE: FONDO DE RED ITACA (Rojo/Dorado)
// ==========================================
const ItacaWaveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 1.2 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += 0.005;
        this.x += Math.sin(this.angle) * 0.15;
        this.y += Math.cos(this.angle) * 0.15;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 71, 87, 0.4)'; // Rojo ITACA sutil
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < numParticles; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 188, 21, ${0.1 - distance / 1000})`; // Conexiones doradas sutiles
            ctx.lineWidth = 0.4;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />;
};

export default function ItacaPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [correctPass, setCorrectPass] = useState("");
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: passData } = await supabase.from('itaca_config').select('password').single();
      const { data: modData } = await supabase.from('itaca_modules').select('*').order('created_at', { ascending: true });
      if (passData) {
        setCorrectPass(passData.password);
        const savedPass = localStorage.getItem("itaca_saved_pass");
        if (savedPass === passData.password) setIsAuthorized(true);
      }
      if (modData) setModules(modData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPass) {
      setIsAuthorized(true);
      setError(false);
      localStorage.setItem("itaca_saved_pass", password);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("itaca_saved_pass");
    setIsAuthorized(false);
    setPassword("");
  };

  if (isLoading) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse text-[#0a1b3d] font-bold">Verificando acceso al Master...</div>
    </main>
  );

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
        <ItacaWaveBackground />
        <div className="max-w-md w-full bg-[#0a1b3d] rounded-[2.5rem] p-10 shadow-2xl relative z-10 border border-[#F9BC15]/20">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🔒</div>
          <h1 className="text-2xl font-serif font-bold text-white text-center mb-2">Acceso Institucional</h1>
          <p className="text-white/60 text-center mb-8 text-sm">Clave del Master ITACA requerida.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white text-center tracking-[0.3em] outline-none focus:border-[#F9BC15]"
            />
            {error && <p className="text-red-400 text-xs text-center font-bold">Contraseña no válida.</p>}
            <button type="submit" className="w-full bg-[#F9BC15] text-[#0a1b3d] font-bold py-4 rounded-xl hover:scale-[1.02] transition-all">Acceder</button>
          </form>
          <Link href="/portal" className="block text-center text-white/40 text-xs mt-6">← Volver al Portal</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-red-50 pb-24 relative overflow-hidden">
      <ItacaWaveBackground />
      
      {/* Patrón Hexagonal de Marca (Alta Visibilidad) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-itaca" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <path d="M25 0 L50 14.4 L50 43.4 L25 57.8 L0 43.4 L0 14.4 Z" fill="none" stroke="#0a1b3d" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-itaca)" />
        </svg>
      </div>

      <section className="relative pt-32 pb-12 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center relative">
          <button onClick={handleLogout} className="absolute -top-16 right-0 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Cerrar Sesión 🔒</button>
          <Link href="/portal" className="text-[#1B4F8A] font-bold mb-6 inline-block hover:text-[#2B9ED4]">← Volver al Portal</Link>
          
          <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-md">Área Exclusiva Alumnos</div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#0a1b3d] tracking-tight mb-6 font-serif">Master <span className="text-[#F9BC15]">ITACA</span></h1>
          <p className="text-gray-600 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">Bienvenido a tu plataforma de formación avanzada.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 gap-4">
          {modules.map((mod) => (
            <div key={mod.id} className="bg-[#0a1b3d] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl border-l-8 border-[#F9BC15] group hover:scale-[1.01] transition-transform">
              <div className="text-left w-full">
                <h3 className="text-xl font-bold text-white mb-1">{mod.titulo}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{mod.descripcion}</p>
              </div>
              <Link href={mod.link} className="w-full md:w-auto text-center bg-[#F9BC15] text-[#0a1b3d] px-8 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all">Ver Módulo</Link>
            </div>
          ))}
          {modules.length === 0 && <p className="text-center text-gray-400 py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">Aún no hay módulos cargados en el Master.</p>}
        </div>
      </section>
    </main>
  );
}