'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SobreMiSection from '../components/SobreMi'; // Importamos el componente de arriba

const NetworkBackground = () => {
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
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(43, 158, 212, 0.4)';
        ctx.fill();
      }
    }
    const init = () => {
      resize();
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
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
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(43, 158, 212, ${0.15 - distance / 1200})`;
            ctx.lineWidth = 0.5;
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
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default function Home() {
  return (
    <main className="relative min-h-screen font-sans selection:bg-[#2B9ED4] selection:text-white overflow-x-hidden">
      
      {/* 0. HERO SECTION */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#0a1b3d] to-[#1B4F8A]">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <NetworkBackground />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-12">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col space-y-8 order-2 lg:order-1 pt-10 lg:pt-0">
              <div className="relative w-full max-w-[450px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
                <Image src="/imagenes/Logoblanco.jpg" alt="Logo" fill className="object-cover" priority />
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Leo Eyzaguirre.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2B9ED4] to-[#ffffff] mt-2">
                  Psicoterapia Basada en Evidencia.
                </span>
              </h1>
              
              {/* ==========================================
                  NUEVA SECCIÓN DE BOTONES CONECTADOS
                  ========================================== */}
              <div className="flex flex-col gap-4 pt-4 max-w-xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Botón Flujo Nuevo */}
                  <Link 
                    href="/agendar" 
                    className="flex-1 bg-[#F9BC15] text-[#0a1b3d] font-bold px-8 py-4 rounded-xl hover:bg-white hover:scale-[1.02] transition-all shadow-lg text-lg text-center"
                  >
                    Agendar sesión inicial
                  </Link>
                  
                  {/* Botón Flujo Recurrente */}
                  <Link 
                    href="/sesion" 
                    className="flex-1 bg-white/10 text-white border border-white/20 font-bold px-8 py-4 rounded-xl hover:bg-white/20 hover:scale-[1.02] transition-all shadow-lg text-lg text-center backdrop-blur-sm"
                  >
                    Ya soy consultante
                  </Link>
                </div>
                
                {/* Texto explicativo */}
                <p className="text-white/50 text-sm text-left pl-2">
                  * Si ya estás en proceso, usa <strong>"Ya soy consultante"</strong> para programar o reprogramar un horario rápidamente sin llenar formularios largos.
                </p>
              </div>
              {/* ========================================== */}

            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[2rem] p-3 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-[#0a1b3d]">
                  <Image src="/imagenes/foto-leo.jpg" alt="Leo" fill className="object-cover" priority />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AQUÍ LLAMAMOS AL COMPONENTE EXTERNO */}
      <SobreMiSection />

    </main>
  );
}