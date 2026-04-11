"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  // Estado para controlar si el menú del celular está abierto o cerrado
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <header className="fixed top-0 w-full z-50 pt-3 md:pt-5 px-3 md:px-8 flex justify-center pointer-events-none">
        
        {/* BARRA PRINCIPAL: Altura adaptable (h-[80px] en móvil, h-[100px] en PC) */}
        <nav className="pointer-events-auto relative flex w-full max-w-7xl h-[80px] md:h-[100px] rounded-3xl md:rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-[#1B4F8A]/30">
          
          {/* FONDO DERECHO: Glassmorphism */}
          <div className="absolute inset-0 w-full h-full bg-[#0a1b3d]/85 backdrop-blur-xl z-0"></div>

          {/* SISTEMA DE PARTÍCULAS (Z-index 0) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen opacity-60">
            <svg className="particle-hex absolute top-[-20px] right-[20%] w-32 h-32 text-[#2B9ED4]" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
            </svg>
            <svg className="particle-drift particle-hex absolute bottom-[-40px] right-[40%] w-48 h-48 text-[#1B4F8A]" viewBox="0 0 100 100" fill="currentColor" style={{ animationDelay: '-5s', animationDuration: '25s' }}>
              <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
            </svg>
            <div className="absolute top-0 right-[10%] w-[300px] h-[100px] bg-[#2B9ED4]/20 blur-[60px] rounded-full"></div>
          </div>

          {/* PANEL IZQUIERDO: Ancho adaptable (w-[60%] en móvil para que quepa el logo) */}
          <div 
            className="relative z-10 w-[60%] md:w-[35%] min-w-[200px] md:min-w-[320px] bg-white h-full flex items-center pl-4 md:pl-8 pr-8 md:pr-16 shadow-[20px_0_30px_-10px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.01] origin-left"
            style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}
          >
            <Link href="/" className="relative w-full h-[50px] md:h-[80px] block cursor-pointer">
              <Image 
                src="/imagenes/logo.png" 
                alt="Logo Leo Eyzaguirre"
                fill
                className="object-contain object-left" 
                priority
              />
            </Link>
          </div>

          {/* PANEL DERECHO: Enlaces y Menú */}
          <div className="relative z-10 flex-1 flex justify-end items-center pr-4 md:pr-6 space-x-8">
            
            {/* Links Desktop (Ocultos en móvil) */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="group relative font-semibold text-white/90 text-[15px] tracking-wide transition-colors duration-300 hover:text-[#F9BC15]">
                Inicio
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#F9BC15] rounded-full opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_8px_rgba(249,188,21,0.8)]"></span>
              </Link>
              {['Enfoque Clínico', 'Servicios'].map((item) => (
                <Link key={item} href={`/#${item.toLowerCase().replace(' ', '-')}`} className="group relative font-semibold text-white/90 text-[15px] tracking-wide transition-colors duration-300 hover:text-[#F9BC15]">
                  {item}
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#F9BC15] rounded-full opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_8px_rgba(249,188,21,0.8)]"></span>
                </Link>
              ))}
              <Link href="/portal" className="group relative font-bold text-[#F9BC15] text-[15px] tracking-wide transition-colors duration-300 hover:text-white flex items-center gap-2">
                <span>Portal Clínico</span>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
              </Link>
            </div>
            
            {/* BOTÓN DE CONTACTO: Oculto en móviles muy pequeños, visible en tablet/PC */}
            <Link href="https://wa.me/59165677086" className="hidden md:flex relative overflow-hidden items-center gap-3 bg-gradient-to-r from-[#E8720A] to-[#d4af37] text-white px-7 py-3 rounded-xl border border-white/20 shadow-[0_10px_20px_-10px_rgba(232,114,10,0.6)] transition-all duration-300 hover:-translate-y-0.5 group">
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[30deg] group-hover:left-[200%] transition-all duration-1000 ease-out"></div>
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-80"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[#39ff14]"></span></span>
              <span className="font-bold text-[15px] tracking-wide relative z-10">Contacto Directo</span>
            </Link>

            {/* BOTÓN HAMBURGUESA (Solo visible en móvil) */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 focus:outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </nav>
      </header>

      {/* ==========================================
          MENÚ MÓVIL PANTALLA COMPLETA
          ========================================== */}
      <div 
        className={`fixed inset-0 z-40 bg-[#0a1b3d]/95 backdrop-blur-2xl transition-all duration-500 flex flex-col items-center justify-center lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className={`flex flex-col items-center space-y-8 transition-transform duration-500 delay-100 ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-10'}`}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-[#F9BC15]">Inicio</Link>
          <Link href="/#enfoque-clínico" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-[#F9BC15]">Enfoque Clínico</Link>
          <Link href="/#servicios" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-[#F9BC15]">Servicios</Link>
          <Link href="/portal" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-extrabold text-[#F9BC15]">Portal Clínico</Link>
          
          <Link href="https://wa.me/59165677086" onClick={() => setIsMobileMenuOpen(false)} className="mt-8 bg-gradient-to-r from-[#E8720A] to-[#d4af37] text-white px-10 py-4 rounded-xl font-bold text-xl shadow-[0_10px_25px_-5px_rgba(249,188,21,0.5)]">
            Contacto Directo
          </Link>
        </div>
      </div>
    </>
  );
}