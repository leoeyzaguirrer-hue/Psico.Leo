"use client";
import React, { useEffect, useRef } from 'react';
import Link from "next/link";

// ==========================================
// COMPONENTE: FONDO DE RED DORADA EN ONDAS
// ==========================================
const GoldenWaveBackground = () => {
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
        this.vx = (Math.random() - 0.5) * 0.3; // Velocidad muy suave
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.angle = Math.random() * Math.PI * 2; // Para el movimiento en onda
      }
      update() {
        // Movimiento base
        this.x += this.vx;
        this.y += this.vy;
        
        // Efecto sutil de onda
        this.angle += 0.01;
        this.x += Math.sin(this.angle) * 0.2;
        this.y += Math.cos(this.angle) * 0.2;

        // Rebote en los bordes
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249, 188, 21, 0.6)'; // Dorado F9BC15
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      // Menos partículas para que sea elegante y no sature el fondo blanco
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000); 
      for (let i = 0; i < numParticles; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Conectar los puntos con líneas doradas
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 188, 21, ${0.15 - distance / 800})`; // Opacidad dinámica
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

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />;
};

// ==========================================
// PÁGINA PRINCIPAL DEL PORTAL
// ==========================================
export default function PortalPage() {
  const modulos = [
    {
      id: "cursos",
      titulo: "Formación y Micro-Cápsulas",
      desc: "Entrenamientos intensivos y cápsulas interactivas para terapeutas.",
      link: "/cursos",
      color: "border-[#F9BC15]", // Dorado
      icon: "⚙️"
    },
    {
      id: "recursos",
      titulo: "Herramientas Terapéuticas",
      desc: "Arsenal clínico: registros, metáforas y tests para uso profesional.",
      link: "/recursos",
      color: "border-[#2ECC71]", // Esmeralda
      icon: "🛠️"
    },
    {
      id: "consultantes",
      titulo: "Espacio para Consultantes",
      desc: "Material de apoyo, lecturas y ejercicios para trabajo entre sesiones.",
      link: "/consultantes",
      color: "border-[#2B9ED4]", // Celeste
      icon: "🧭"
    },
    {
      id: "blog",
      titulo: "Blog y Artículos Clínicos",
      desc: "Reflexiones, análisis de casos y divulgación científica.",
      link: "/blog",
      color: "border-[#E8720A]", // Naranja
      icon: "📄"
    },
    {
      id: "itaca",
      titulo: "Master ITACA",
      desc: "Área exclusiva para alumnos. Requiere clave de acceso institucional.",
      link: "/itaca",
      color: "border-[#ff4757]", // Rojo
      icon: "🔒",
      isLocked: true
    }
  ];

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#2B9ED4] selection:text-white pb-24 relative overflow-hidden">
      
      {/* 1. FONDO ANIMADO DORADO */}
      <GoldenWaveBackground />
      
      {/* Malla sutil para añadir textura al fondo blanco */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#1B4F8A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* 2. CABECERA */}
      <section className="relative pt-32 pb-16 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/" className="text-[#1B4F8A] font-bold hover:text-[#F9BC15] transition-colors mb-8 inline-block">
            ← Volver a Inicio
          </Link>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#0a1b3d] tracking-tight mb-6 font-serif">
            Portal <span className="text-[#F9BC15]">Clínico</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Selecciona el área de trabajo a la que deseas ingresar.
          </p>
        </div>
      </section>

      {/* 3. MÓDULOS (Cajas Azules) */}
      <section className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modulos.map((mod) => (
            <Link 
              key={mod.id} 
              href={mod.link}
              className={`block bg-[#0a1b3d] rounded-2xl p-8 border-l-8 ${mod.color} hover:-translate-y-2 transition-all duration-300 shadow-2xl shadow-[#1B4F8A]/10 group overflow-hidden relative`}
            >
              {/* Brillo sutil de hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/10 transition-colors"></div>

              <div className="flex items-start gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                  {mod.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    {mod.titulo}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    {mod.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}