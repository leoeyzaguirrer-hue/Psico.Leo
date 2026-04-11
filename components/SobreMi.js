'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- COMPONENTE DE FONDO DINÁMICO (NODOS/RED) - HERO ---
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
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
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

// --- COMPONENTE: PATRÓN HEXAGONAL ---
const HexagonGrid = ({ strokeColor, opacity }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id={`hexagons-${strokeColor.replace('#', '')}`} width="60" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
        <path
          d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeOpacity={opacity}
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#hexagons-${strokeColor.replace('#', '')})`} />
  </svg>
);

// --- PÁGINA PRINCIPAL ---
export default function Home() {
  return (
    <main className="relative min-h-screen font-sans selection:bg-[#2B9ED4] selection:text-white overflow-x-hidden">
      
      
      {/* ========================================================= */}
      {/* 1. SOBRE MÍ */}
      {/* ========================================================= */}
      {/* Añadido id="sobre-mí" por si en el futuro lo agregas al menú */}
      <section id="sobre-mí" className="relative z-10 bg-[#f4f5f7] py-24 px-6 overflow-hidden">
        <HexagonGrid strokeColor="#e0e3e8" opacity="1" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[350px] aspect-[3/4] rounded-3xl p-3 bg-white shadow-[0_20px_50px_rgba(27,79,138,0.1)] border border-gray-100">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src="/imagenes/foto-leo2.jpg"
                    alt="Leo Eyzaguirre"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-[-10px] right-[-10px] w-12 h-12 text-[#F9BC15] fill-current">
                     <svg viewBox="0 0 100 100"><polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col space-y-6">
              <h2 className="text-5xl font-extrabold text-[#0a1b3d]">Sobre mí</h2>
              
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Soy psicoterapeuta conductual-contextual. Trabajo desde el análisis funcional, integrando procesos como regulación emocional, flexibilidad psicológica y el estudio del lenguaje humano. Mi enfoque es colaborativo, claro y respetuoso, orientado a comprender tu historia y tus patrones aprendidos sin juicios.
              </p>
              
              <div className="bg-[#1B4F8A] p-6 rounded-2xl mt-4 border-l-8 border-[#F9BC15] shadow-lg">
                <p className="text-xl text-white font-medium leading-relaxed m-0">
                  Mi trabajo es ayudarte a abrir espacio para lo que importa y construir repertorios más flexibles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. MI TRABAJO Y ENFOQUE TERAPÉUTICO */}
      {/* ========================================================= */}
      <section className="relative z-10 bg-[#eef0f3] py-24 px-6 overflow-hidden">
        <HexagonGrid strokeColor="#d8dde3" opacity="1" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl font-extrabold text-[#0a1b3d] mb-12">Mi trabajo y enfoque terapéutico</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 flex flex-col space-y-6">
              
              {[
                "Soy Leonardo Eyzaguirre, psicólogo y psicoterapeuta especializado en terapias conductuales-contextuales. Este enfoque se centra en entender la conducta en contexto, identificar patrones aprendidos y construir formas más flexibles de relacionarnos con nuestras experiencias internas y externas. Trabajo desde el respeto por tu historia, acompañándote con herramientas basadas en evidencia científica.",
                "Trabajo con modelos psicoterapéuticos como ACT, FAP, AC y DBT. Estos enfoques permiten comprender la función de la conducta en tu historia y contexto actual, integrando habilidades prácticas orientadas a la regulación emocional, la flexibilidad psicológica y el fortalecimiento de repertorios valiosos.",
                "Ofrezco terapia presencial en La Paz (Irpavi, Calle 16) y sesiones online para personas dentro y fuera del país. Las sesiones duran entre 50 y 60 minutos y pueden realizarse de manera semanal o quincenal, según tus objetivos y necesidades.",
                "El proceso terapéutico comienza con una evaluación basada en análisis funcional, que ayuda a identificar patrones que influyen en tu vida actual. El objetivo no es eliminar pensamientos o emociones, sino ampliar tu repertorio conductual, reducir la evitación y construir una vida más alineada con tus valores.",
                "Cuento con formación especializada en terapias conductuales-contextuales, análisis funcional, modelos transdiagnósticos y Proces-Based Behavior Therapy. He completado entrenamientos intensivos en ACT, FAP, DBT, AC, PBBT e IBT, además de una Maestría en Análisis Funcional del Comportamiento. Mi práctica se sustenta en supervisión clínica continua y actualización permanente."
              ].map((text, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(27,79,138,0.06)] border-l-4 border-[#2B9ED4] hover:shadow-[0_8px_30px_rgba(27,79,138,0.12)] transition-shadow">
                  <p className="text-gray-700 text-lg leading-relaxed">{text}</p>
                </div>
              ))}

            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end items-start pt-2">
              <div className="relative w-full max-w-[380px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/imagenes/foto-leo.jpg"
                  alt="Leonardo Eyzaguirre en consulta"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 border-4 border-[#1B4F8A]/20 rounded-3xl pointer-events-none"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SERVICIOS */}
      {/* ========================================================= */}
      {/* AQUÍ ESTÁ EL ID QUE SE CONECTA CON EL MENÚ */}
      <section id="servicios" className="relative z-10 bg-[#f4f5f7] py-24 px-6 overflow-hidden">
        <HexagonGrid strokeColor="#e0e3e8" opacity="1" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#0a1b3d] mb-4">Servicios</h2>
            <div className="w-16 h-1 bg-[#E8720A] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1B4F8A] rounded-[2rem] p-10 shadow-2xl flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 text-[#F9BC15] fill-current mb-6">
                 <svg viewBox="0 0 100 100"><polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Psicoterapia individual</h3>
              <p className="text-[#2B9ED4] font-medium leading-relaxed">Acompañamiento clínico desde un enfoque basado en procesos, ajustado a tus necesidades actuales y a tu historia única.</p>
            </div>

            <div className="bg-[#0a1b3d] rounded-[2rem] p-10 shadow-2xl flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 text-[#2B9ED4] stroke-current mb-6" fill="none" strokeWidth="8">
                 <svg viewBox="0 0 100 100"><polyline points="30,30 50,70 80,40" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Consultoría y supervisión clínica</h3>
              <p className="text-gray-300 font-medium leading-relaxed">Guía profesional basada en análisis funcional, RFT y terapias conductuales contemporáneas.</p>
            </div>

            <div className="bg-[#1B4F8A] rounded-[2rem] p-10 shadow-2xl flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 text-[#E8720A] fill-current mb-6">
                 <svg viewBox="0 0 100 100"><polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Procesos terapéuticos basados en evidencia</h3>
              <p className="text-[#2B9ED4] font-medium leading-relaxed">Intervenciones centradas en flexibilidad psicológica, habilidades conductuales y cambios sostenibles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. MI MANERA DE TRABAJAR CONTIGO (Premium Oscuro) */}
      {/* ========================================================= */}
      <section className="relative z-10 bg-[#eef0f3] py-24 px-6 overflow-hidden">
        <HexagonGrid strokeColor="#d8dde3" opacity="1" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#0a1b3d] mb-4">Mi manera de trabajar contigo</h2>
            <div className="w-16 h-1 bg-[#F9BC15] mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col space-y-8">
            
            <div className="bg-[#0a1b3d] p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 border border-[#1B4F8A]">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#F9BC15]/10 rounded-full blur-3xl group-hover:bg-[#F9BC15]/20 transition-all"></div>
              
              <div className="w-20 h-20 rounded-2xl bg-[#1B4F8A] flex items-center justify-center shrink-0 border border-[#F9BC15]/30 shadow-[0_0_15px_rgba(249,188,21,0.2)]">
                <div className="w-10 h-10 text-[#F9BC15] fill-current">
                   <svg viewBox="0 0 100 100"><polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" /></svg>
                </div>
              </div>
              
              <p className="text-gray-200 text-xl font-light leading-relaxed relative z-10">
                "La terapia que realizo está basada en evidencia y centrada en procesos, no en etiquetas diagnósticas. Mi objetivo es acompañarte a comprender cómo funciona tu conducta en tu historia y contexto actual, para construir cambios que sean sostenibles y significativos."
              </p>
            </div>

            <div className="bg-[#1B4F8A] p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 border border-[#2B9ED4]/20">
              <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-[#E8720A]/10 rounded-full blur-3xl group-hover:bg-[#E8720A]/20 transition-all"></div>
              
              <div className="w-20 h-20 rounded-2xl bg-[#0a1b3d] flex items-center justify-center shrink-0 border border-[#E8720A]/30 shadow-[0_0_15px_rgba(232,114,10,0.2)]">
                <div className="w-10 h-10 text-[#E8720A] fill-current">
                   <svg viewBox="0 0 100 100"><polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" /></svg>
                </div>
              </div>
              
              <p className="text-white text-xl font-light leading-relaxed relative z-10">
                "Trabajo contigo desde el respeto, la claridad y la coherencia. Buscamos construir repertorios más flexibles, disminuir la evitación y aumentar tu capacidad para actuar en dirección a tus valores."
              </p>
            </div>

            <div className="bg-[#0a1b3d] p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 border border-[#1B4F8A]">
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-[#2B9ED4]/10 rounded-full blur-3xl group-hover:bg-[#2B9ED4]/20 transition-all"></div>
              
              <div className="w-20 h-20 rounded-2xl bg-[#1B4F8A] flex items-center justify-center shrink-0 border border-[#2B9ED4]/30 shadow-[0_0_15px_rgba(43,158,212,0.2)]">
                <div className="w-10 h-10 text-[#2B9ED4] stroke-current" fill="none" strokeWidth="8">
                   <svg viewBox="0 0 100 100"><polyline points="20,20 50,80 80,60" /></svg>
                </div>
              </div>
              
              <p className="text-gray-200 text-xl font-light leading-relaxed relative z-10">
                "Cada sesión tiene un propósito: explorar tus patrones, entender sus funciones, y generar alternativas que te permitan vivir con más libertad psicológica."
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. MODELOS TERAPÉUTICOS */}
      {/* ========================================================= */}
      <section className="relative z-10 bg-[#1B4F8A] py-24 px-6 overflow-hidden">
        <HexagonGrid strokeColor="#205a9c" opacity="1" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">Modelos Terapéuticos que Utilizo</h2>
            <div className="w-16 h-1 bg-[#F9BC15] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { sigla: 'ACT', nombre: 'Terapia de Aceptación y Compromiso', emoji: '🧭', border: 'border-[#F9BC15]' },
              { sigla: 'FAP', nombre: 'Terapia Analítico-Funcional', emoji: '🤝', border: 'border-[#E8720A]' },
              { sigla: 'DBT', nombre: 'Terapia Dialéctico-Conductual', emoji: '🌊', border: 'border-[#2B9ED4]' },
              { sigla: 'AC', nombre: 'Activación Conductual', emoji: '🏃', border: 'border-[#F9BC15]' },
              { sigla: 'PBBT', nombre: 'Terapia Basada en Procesos', emoji: '⚙️', border: 'border-[#2B9ED4]' },
              { sigla: 'IBT', nombre: 'Terapia Conductual Integrativa', emoji: '🧩', border: 'border-[#E8720A]' },
            ].map((modelo) => (
              <div key={modelo.sigla} className={`bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center border-b-8 ${modelo.border} transform hover:-translate-y-1 transition-all`}>
                <div className="bg-[#f4f5f7] w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl" role="img" aria-hidden="true">{modelo.emoji}</span>
                </div>
                <h3 className="text-3xl font-extrabold text-[#0a1b3d] mb-2">{modelo.sigla}</h3>
                <p className="text-gray-600 font-semibold">{modelo.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. MI ENFOQUE CLÍNICO (Glassmorphism) */}
      {/* ========================================================= */}
      {/* AQUÍ ESTÁ EL ID QUE SE CONECTA CON EL MENÚ */}
      <section id="enfoque-clínico" className="relative z-10 bg-[#0a1b3d] py-24 px-6 overflow-hidden">
        <HexagonGrid strokeColor="#112959" opacity="1" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-gradient-to-r from-[#F9BC15] to-[#E8720A] rounded-3xl p-[2px] mb-12 shadow-2xl">
            <div className="bg-[#0a1b3d] rounded-[23px] p-10 text-center h-full w-full">
               <h2 className="text-4xl font-extrabold text-white mb-4">Mi enfoque clínico</h2>
               <p className="text-xl text-gray-300">Trabajo desde procesos, no etiquetas, integrando diferentes modelos conductuales contemporáneos.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-bold text-[#2B9ED4] mb-3">Comprender tu historia</h3>
              <p className="text-gray-300">Trabajamos tus patrones aprendidos, tu experiencia actual y las funciones de tus acciones.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-bold text-[#2B9ED4] mb-3">Cambiar patrones aprendidos</h3>
              <p className="text-gray-300">Exploramos cómo el lenguaje influye en tu conducta y cómo construir nuevas relaciones más flexibles.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-bold text-[#F9BC15] mb-3">Regular emociones intensas</h3>
              <p className="text-gray-300">Habilidades prácticas para modular emociones y responder de forma más efectiva.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-bold text-[#F9BC15] mb-3">Activación conductual</h3>
              <p className="text-gray-300">Aumentar compromiso con actividades valiosas, reducir evitación y recuperar vitalidad.</p>
            </div>
          </div>

          <div className="bg-[#1B4F8A]/40 backdrop-blur-md rounded-2xl p-8 border border-[#2B9ED4]/50 text-center max-w-3xl mx-auto mt-8">
            <h3 className="text-2xl font-bold text-white mb-3">Terapia Conductual Basada en Procesos (PBBT)</h3>
            <p className="text-[#2B9ED4] font-medium">Intervenciones centradas en procesos transdiagnósticos, precisión funcional y cambio sostenible.</p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. CÓMO ES UNA SESIÓN */}
      {/* ========================================================= */}
      <section className="relative z-10 bg-[#eef0f3] py-24 px-6 overflow-hidden">
        <HexagonGrid strokeColor="#d8dde3" opacity="1" />

        <div className="max-w-6xl mx-auto relative z-10 bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(27,79,138,0.12)] border-t-8 border-[#1B4F8A] p-12 lg:p-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-[#0a1b3d] mb-6">Cómo es una sesión</h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-medium">
              En sesión trabajamos desde tus objetivos y tu contexto. Exploramos tus patrones, observamos funciones, analizamos tu historia y construimos alternativas más flexibles. No buscamos juzgar ni cambiar pensamientos de forma forzada; buscamos abrir posibilidades.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            {[
              "Espacio seguro",
              "Enfoque colaborativo",
              "Basado en evidencia",
              "Sin juicios",
              "Ritmo humano",
              "Centrado en procesos"
            ].map((punto, index) => (
              <div key={index} className="flex items-center gap-4 bg-[#f4f5f7] p-4 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#2B9ED4]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#2B9ED4] text-lg font-bold">✓</span>
                </div>
                <span className="text-lg font-bold text-[#1B4F8A]">{punto}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}