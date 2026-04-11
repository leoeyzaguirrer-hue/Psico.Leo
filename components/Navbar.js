"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <>
      {/* Estilos para el movimiento sutil de las partículas hexagonales */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0% { transform: translate(0px, 0px) rotate(0deg) scale(1); opacity: 0.1; }
          33% { transform: translate(30px, -50px) rotate(10deg) scale(1.1); opacity: 0.2; }
          66% { transform: translate(-20px, 20px) rotate(-5deg) scale(0.9); opacity: 0.15; }
          100% { transform: translate(0px, 0px) rotate(0deg) scale(1); opacity: 0.1; }
        }
        @keyframes drift {
          0% { transform: translateX(0); }
          50% { transform: translateX(-40px); }
          100% { transform: translateX(0); }
        }
        .particle-hex {
          animation: float-slow 20s infinite ease-in-out;
        }
        .particle-drift {
          animation: drift 25s infinite ease-in-out;
        }
      `}} />

      {/* Contenedor Fijo Flotante */}
      <header className="fixed top-0 w-full z-50 pt-5 px-4 lg:px-8 flex justify-center pointer-events-none">
        
        {/* BARRA PRINCIPAL: Estructura de Dashboard */}
        <nav className="pointer-events-auto relative flex w-full max-w-7xl h-[100px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-[#1B4F8A]/30">
          
          {/* FONDO DERECHO: Glassmorphism Profundo (Deep Blue) */}
          <div className="absolute inset-0 w-full h-full bg-[#0a1b3d]/75 backdrop-blur-xl z-0"></div>

          {/* SISTEMA DE PARTÍCULAS (Z-index 0, detrás de los links) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen opacity-60">
            {/* Hexágono 1 */}
            <svg className="particle-hex absolute top-[-20px] right-[20%] w-32 h-32 text-[#2B9ED4]" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
            </svg>
            {/* Hexágono 2 */}
            <svg className="particle-drift particle-hex absolute bottom-[-40px] right-[40%] w-48 h-48 text-[#1B4F8A]" viewBox="0 0 100 100" fill="currentColor" style={{ animationDelay: '-5s', animationDuration: '25s' }}>
              <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
            </svg>
            {/* Resplandor sutil */}
            <div className="absolute top-0 right-[10%] w-[300px] h-[100px] bg-[#2B9ED4]/20 blur-[60px] rounded-full"></div>
          </div>

          {/* PANEL IZQUIERDO: Bloque Sólido Blanco con Corte Diagonal */}
          {/* clipPath crea el ángulo inclinado que rompe la monotonía visual */}
          <div 
            className="relative z-10 w-[35%] min-w-[320px] bg-white h-full flex items-center pl-8 pr-16 shadow-[20px_0_30px_-10px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.01] origin-left"
            style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}
          >
           {/* El logo azul ahora vive sobre blanco puro, imposible que se pierda */}
            <Link href="/" className="relative w-full h-[80px] block cursor-pointer">
              <Image 
                src="/imagenes/logo.png" 
                alt="Logo Leo Eyzaguirre"
                fill
                className="object-contain object-left" 
                priority
              />
            </Link>
          </div>

          {/* PANEL DERECHO: Enlaces y CTA (Sobre el cristal y las partículas) */}
          <div className="relative z-10 flex-1 flex justify-end items-center pr-6 space-x-8">
            
            {/* Links iterativos */}
            {/* Links iterativos limpios */}
            <div className="hidden lg:flex items-center space-x-8">
              
              {/* BOTÓN INICIO */}
              <Link 
                href="/" 
                className="group relative font-semibold text-white/90 text-[15px] tracking-wide transition-colors duration-300 hover:text-[#F9BC15]"
              >
                Inicio
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#F9BC15] rounded-full opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_8px_rgba(249,188,21,0.8)]"></span>
              </Link>

              {['Enfoque Clínico', 'Servicios'].map((item) => (
                <Link 
                  key={item} 
                  href={`/#${item.toLowerCase().replace(' ', '-')}`} 
                  className="group relative font-semibold text-white/90 text-[15px] tracking-wide transition-colors duration-300 hover:text-[#F9BC15]"
                >
                  {item}
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#F9BC15] rounded-full opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_8px_rgba(249,188,21,0.8)]"></span>
                </Link>
              ))}
              
              {/* BOTÓN DEL PORTAL PREMIUM */}
              <Link 
                href="/portal" 
                className="group relative font-bold text-[#F9BC15] text-[15px] tracking-wide transition-colors duration-300 hover:text-white flex items-center gap-2"
              >
                <span>Portal Clínico</span>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
              </Link>
            </div>
            
            {/* BOTÓN DE CONTACTO: Dashboard Style */}
            <Link 
              href="https://wa.me/59165677086" 
              className="relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-[#E8720A] to-[#d4af37] text-white px-7 py-3 rounded-xl border border-white/20 shadow-[0_10px_20px_-10px_rgba(232,114,10,0.6)] transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(249,188,21,0.5)] hover:-translate-y-0.5 group"
            >
              {/* Brillo de barrido interior */}
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[30deg] group-hover:left-[200%] transition-all duration-1000 ease-out"></div>
              
              {/* Punto verde estricto de estado */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39ff14]"></span>
              </span>
              
              <span className="font-bold text-[15px] tracking-wide relative z-10">
                Contacto Directo
              </span>
            </Link>

          </div>
        </nav>
      </header>
    </>
  );
}