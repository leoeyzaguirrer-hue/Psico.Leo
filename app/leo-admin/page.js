"use client";
import { useEffect, useState } from "react";
// Importamos todas las acciones necesarias
import { 
  getAppointments, confirmAppointment, deleteAppointment, 
  getAvailability, addAvailability, deleteAvailability, addBulkAvailability,
  getCapsulas, addCapsula, deleteCapsula,
  getRecursos, addRecurso, deleteRecurso,
  getBlog, addBlog, deleteBlog,
  getConsultantes, addConsultante, deleteConsultante,
  getItacaPassword, updateItacaPassword,
  getItacaModules, addItacaModule, deleteItacaModule // <-- NUEVAS ACCIONES PARA ITACA HTML
} from "./acciones";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  // --- ESTADOS DE DATOS ---
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [capsulas, setCapsulas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [blogItems, setBlogItems] = useState([]);
  const [consultantesItems, setConsultantesItems] = useState([]);
  const [itacaPass, setItacaPass] = useState("");
  const [itacaModules, setItacaModules] = useState([]); // <-- ESTADO PARA ITACA HTML

  // --- ESTADOS DE FORMULARIOS ---
  // Agenda Masiva
  const [bulkTime, setBulkTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [weeksToGenerate, setWeeksToGenerate] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  // Cápsulas
  const [capTitulo, setCapTitulo] = useState(""); const [capDesc, setCapDesc] = useState(""); const [capCat, setCapCat] = useState("ACT"); const [capTiempo, setCapTiempo] = useState(""); const [capLink, setCapLink] = useState("");
  // Recursos
  const [recTitulo, setRecTitulo] = useState(""); const [recDesc, setRecDesc] = useState(""); const [recCat, setRecCat] = useState("ACT"); const [recTipo, setRecTipo] = useState("Ejercicio"); const [recLink, setRecLink] = useState("");
  // Blog
  const [blogTitulo, setBlogTitulo] = useState(""); const [blogExtracto, setBlogExtracto] = useState(""); const [blogCat, setBlogCat] = useState("Reflexión"); const [blogLink, setBlogLink] = useState("");
  // Consultantes
  const [consTitulo, setConsTitulo] = useState(""); const [consDesc, setConsDesc] = useState(""); const [consTipo, setConsTipo] = useState("Documento"); const [consLink, setConsLink] = useState("");
  // ITACA
  const [newItacaPass, setNewItacaPass] = useState("");
  const [itacaModTitulo, setItacaModTitulo] = useState(""); const [itacaModDesc, setItacaModDesc] = useState(""); const [itacaModLink, setItacaModLink] = useState(""); // <-- FORMS PARA ITACA HTML

  useEffect(() => {
    if (sessionStorage.getItem("leo_admin_auth") === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem("leo_admin_auth", "true"); setIsAuthenticated(true); setErrorMsg("");
    } else { setErrorMsg("Contraseña incorrecta."); setPasswordInput(""); }
  };

  const handleLogout = () => { sessionStorage.removeItem("leo_admin_auth"); setIsAuthenticated(false); };

  // --- CARGA DE DATOS (RESTAURADA Y COMPLETA) ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Usamos Promise.all para cargar todo en paralelo
      const [appts, avails, caps, recs, blogs, cons, pass, itacaMods] = await Promise.all([
        getAppointments(), getAvailability(), getCapsulas(), getRecursos(), getBlog(), getConsultantes(), getItacaPassword(), getItacaModules()
      ]);
      setAppointments(appts || []);
      setAvailability(avails || []);
      setCapsulas(caps || []);
      setRecursos(recs || []);
      setBlogItems(blogs || []);
      setConsultantesItems(cons || []);
      setItacaPass(pass || "");
      setItacaModules(itacaMods || []); // <-- CARGAMOS MÓDULOS ITACA
    } catch (error) {
      console.error("Error cargando datos del panel:", error);
    }
    setLoading(false);
  };

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  // --- ACCIONES DE UI (CITAS Y AGENDA RESTAURADAS) ---
  const handleConfirm = async (id) => { try { await confirmAppointment(id); fetchData(); } catch (error) { alert("Error al confirmar."); } };
  const handleDelete = async (id) => { if (window.confirm("¿Eliminar solicitud?")) { try { await deleteAppointment(id); fetchData(); } catch (error) { alert("Error al eliminar."); } } };
  
  // Agenda
  const toggleDay = (dayIndex) => { selectedDays.includes(dayIndex) ? setSelectedDays(selectedDays.filter(d => d !== dayIndex)) : setSelectedDays([...selectedDays, dayIndex]); };
  const handleBulkGenerate = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0 || !bulkTime) return alert("Selecciona días y hora.");
    setIsGenerating(true);
    const slotsToInsert = [];
    const today = new Date();
    const daysToLookAhead = weeksToGenerate * 7;
    for (let i = 0; i <= daysToLookAhead; i++) {
      const currentDate = new Date(today); currentDate.setDate(today.getDate() + i);
      if (selectedDays.includes(currentDate.getDay())) {
        slotsToInsert.push({ date: currentDate.toISOString().split('T')[0], time: bulkTime, status: 'free' });
      }
    }
    try { await addBulkAvailability(slotsToInsert); fetchData(); alert(`¡Agenda generada! (${slotsToInsert.length} espacios)`); } 
    catch (error) { alert("Error al generar agenda."); }
    setIsGenerating(false);
  };
  const handleDeleteSchedule = async (id) => { try { await deleteAvailability(id); fetchData(); } catch (error) { alert("Error."); } };

  // --- ACCIONES DE GUARDADO (CÁPSULAS Y RECURSOS RESTAURADAS) ---
  const handleAddCapsula = async (e) => { e.preventDefault(); try { await addCapsula({ titulo: capTitulo, descripcion: capDesc, categoria: capCat, nivel: 'Básico', tiempo: capTiempo, link: capLink, is_free: true }); fetchData(); setCapTitulo(""); setCapDesc(""); setCapTiempo(""); setCapLink(""); alert("Cápsula publicada."); } catch (error) { alert("Error: " + error.message); } };
  const handleDeleteCapsula = async (id) => { if (window.confirm("¿Eliminar cápsula?")) { try { await deleteCapsula(id); fetchData(); } catch (error) { alert("Error."); } } };

  const handleAddRecurso = async (e) => { e.preventDefault(); try { await addRecurso({ titulo: recTitulo, descripcion: recDesc, categoria: recCat, tipo: recTipo, link: recLink }); fetchData(); setRecTitulo(""); setRecDesc(""); setRecLink(""); alert("Herramienta publicada."); } catch (error) { alert("Error: " + error.message); } };
  const handleDeleteRecurso = async (id) => { if (window.confirm("¿Eliminar herramienta?")) { try { await deleteRecurso(id); fetchData(); } catch (error) { alert("Error."); } } };

  // --- ACCIONES DE GUARDADO (NUEVOS MÓDULOS) ---
  const handleAddBlog = async (e) => { e.preventDefault(); try { await addBlog({ titulo: blogTitulo, extracto: blogExtracto, categoria: blogCat, link: blogLink }); fetchData(); setBlogTitulo(""); setBlogExtracto(""); setBlogLink(""); alert("Artículo publicado"); } catch (e) { alert("Error"); } };
  const handleDeleteBlog = async (id) => { if (window.confirm("¿Borrar artículo?")) { try { await deleteBlog(id); fetchData(); } catch (e) { alert("Error"); } } };
  
  const handleAddCons = async (e) => { e.preventDefault(); try { await addConsultante({ titulo: consTitulo, descripcion: consDesc, tipo: consTipo, link: consLink }); fetchData(); setConsTitulo(""); setConsDesc(""); setConsLink(""); alert("Material publicado"); } catch (e) { alert("Error"); } };
  const handleDeleteCons = async (id) => { if (window.confirm("¿Borrar material?")) { try { await deleteConsultante(id); fetchData(); } catch (e) { alert("Error"); } } };

  const handleUpdateItacaPass = async (e) => { e.preventDefault(); try { await updateItacaPassword(newItacaPass); fetchData(); setNewItacaPass(""); alert("Contraseña de ITACA actualizada"); } catch (e) { alert("Error"); } };

  const handleAddItacaMod = async (e) => { e.preventDefault(); try { await addItacaModule({ titulo: itacaModTitulo, descripcion: itacaModDesc, link: itacaModLink }); fetchData(); setItacaModTitulo(""); setItacaModDesc(""); setItacaModLink(""); alert("Módulo de ITACA publicado"); } catch (e) { alert("Error"); } };
  const handleDeleteItacaMod = async (id) => { if (window.confirm("¿Borrar módulo de ITACA?")) { try { await deleteItacaModule(id); fetchData(); } catch (e) { alert("Error"); } } };


  // ==========================================
  // RENDERIZADO DEL PANEL
  // ==========================================

  if (!isAuthenticated) {
    // Pantalla de Login (Mantenida igual)
    return (
      <div className="min-h-screen bg-[#0a1b3d] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-[#F9BC15]/20 rounded-full flex items-center justify-center mb-6"><span className="text-3xl">🔒</span></div>
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Acceso Restringido</h2>
          <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Contraseña..." className="w-full bg-black/20 border border-white/20 rounded-xl py-4 px-5 text-white text-lg outline-none focus:border-[#F9BC15] text-center tracking-[0.2em] mb-4" />
          {errorMsg && <p className="text-[#ff4757] text-sm mb-4">{errorMsg}</p>}
          <button type="submit" className="w-full bg-[#F9BC15] text-[#0a1b3d] font-bold py-4 rounded-xl">Entrar al Panel</button>
        </form>
      </div>
    );
  }

  // Contenido principal del dashboard
  return (
    // CAMBIO CSS: Fondo blanco, padding-top aumentado para la navbar fija
    <main className="min-h-screen bg-white font-sans selection:bg-[#F9BC15] selection:text-[#0a1b3d] pt-32 pb-16 px-4 md:px-8 relative overflow-hidden">
      
      {/* SILUETAS DORADAS DE FONDO (Igual que en cursos/recursos) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.05]">
        <svg className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] text-[#F9BC15]" viewBox="0 0 100 100" fill="currentColor"><polygon points="50 1 95 25 95 75 50 99 5 75 5 25" /></svg>
        <svg className="absolute bottom-[10%] left-[-15%] w-[600px] h-[600px] text-[#F9BC15]" viewBox="0 0 100 100" fill="currentColor"><polygon points="50 1 95 25 95 75 50 99 5 75 5 25" /></svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* CABECERA DEL PANEL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#0a1b3d] mb-1">Centro de Mando</h1>
            <p className="text-gray-500">Gestiona todo tu ecosistema clínico desde aquí</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="bg-gray-100 text-[#0a1b3d] px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-200 transition-all">🔄 Actualizar</button>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-all">Cerrar Sesión</button>
          </div>
        </div>

        {/* PESTAÑAS DESLIZABLES (Fondo gris claro para contraste) */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1 mb-8">
          <div className="flex overflow-x-auto gap-1 custom-scrollbar">
            {[
              { id: "pending", name: "Nuevas", color: "text-[#F9BC15]", bg: "bg-[#F9BC15]" },
              { id: "confirmed", name: "Confirmadas", color: "text-[#2ECC71]", bg: "bg-[#2ECC71]" },
              { id: "agenda", name: "📅 Agenda", color: "text-[#2B9ED4]", bg: "bg-[#2B9ED4]" },
              { id: "capsulas", name: "⚡ Cápsulas", color: "text-[#F9BC15]", bg: "bg-[#F9BC15]" },
              { id: "recursos", name: "🛠️ Herramientas", color: "text-[#2ECC71]", bg: "bg-[#2ECC71]" },
              { id: "consultantes", name: "🧭 Consultantes", color: "text-[#2B9ED4]", bg: "bg-[#2B9ED4]" },
              { id: "blog", name: "📄 Blog", color: "text-[#E8720A]", bg: "bg-[#E8720A]" },
              { id: "itaca", name: "🔒 ITACA", color: "text-red-600", bg: "bg-red-500" }
            ].map(tab => (
              <button 
                key={tab.id} onClick={() => setActiveTab(tab.id)} 
                className={`px-5 py-3 whitespace-nowrap font-bold rounded-xl transition-all duration-300 ${activeTab === tab.id ? `${tab.bg} text-white shadow-md` : `text-gray-500 hover:${tab.color} hover:bg-gray-100`}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-[#0a1b3d] animate-pulse font-bold text-xl bg-gray-50 rounded-3xl border border-gray-100">Cargando base de datos clínica...</div>
        ) : (
          
          <div className="grid grid-cols-1 gap-8">
            
            {/* ============================================================================
                VISTAS DE PACIENTES (PENDIENTES Y CONFIRMADAS) - RESTAURADAS
                ============================================================================ */}
            {(activeTab === 'pending' || activeTab === 'confirmed') && (
              appointments.filter(a => a.status === activeTab).length === 0 ? (
                <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">No hay solicitudes en esta categoría.</div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {appointments.filter(a => a.status === activeTab).map(appt => (
                    // CAMBIO CSS: Caja azul, borde dorado
                    <div key={appt.id} className="bg-[#0a1b3d] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl border border-[#F9BC15]/30 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                      <div className="flex-1 relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2">{appt.patient_name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-4">
                          <span>📧 {appt.patient_email}</span><span>📱 {appt.patient_phone}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-white/10 border border-white/20 px-3 py-1 rounded text-xs uppercase font-bold tracking-wider">{appt.modality}</span>
                          <span className="bg-white/10 border border-white/20 px-3 py-1 rounded text-xs uppercase font-bold tracking-wider">{appt.payment_type}</span>
                        </div>
                      </div>
                      <div className="text-left md:text-right bg-black/30 p-5 rounded-xl border border-white/10 min-w-[250px] relative z-10">
                        <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Horario Solicitado</div>
                        <div className="text-[#F9BC15] font-bold text-xl mb-4">{appt.appointment_date} · {appt.appointment_time.substring(0, 5)} hs</div>
                        <div className="flex flex-col gap-2">
                          {appt.status === 'pending' && <button onClick={() => handleConfirm(appt.id)} className="w-full bg-[#2ECC71]/20 text-[#2ECC71] hover:bg-[#2ECC71]/30 border border-[#2ECC71]/50 py-2.5 rounded-lg font-bold transition-all">✅ Confirmar</button>}
                          <button onClick={() => handleDelete(appt.id)} className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 py-2.5 rounded-lg font-bold transition-all">🗑️ Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ============================================================================
                VISTA AGENDA - RESTAURADA
                ============================================================================ */}
            {activeTab === 'agenda' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario Generador Semanal (Caja Azul, Borde Dorado) */}
                <div className="lg:col-span-1 bg-[#0a1b3d] border border-[#F9BC15]/30 rounded-2xl p-6 shadow-xl h-fit relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <h3 className="text-xl font-bold text-[#F9BC15] mb-2 relative z-10">⚡ Generador Semanal</h3>
                  <form onSubmit={handleBulkGenerate} className="flex flex-col gap-4 relative z-10">
                    <div>
                      <label className="text-white/80 text-sm mb-2 block font-medium">Días</label>
                      <div className="flex justify-between gap-1">
                        {[{n:"L", i:1}, {n:"M", i:2}, {n:"X", i:3}, {n:"J", i:4}, {n:"V", i:5}, {n:"S", i:6}].map(day => (
                          <button key={day.i} type="button" onClick={() => toggleDay(day.i)} className={`w-10 h-10 rounded-full font-bold transition-all ${selectedDays.includes(day.i) ? 'bg-[#F9BC15] text-[#0a1b3d]' : 'bg-white/10 text-white/40'}`}>{day.n}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <input type="time" value={bulkTime} onChange={(e) => setBulkTime(e.target.value)} required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none" />
                      <select value={weeksToGenerate} onChange={(e) => setWeeksToGenerate(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none appearance-none"><option value={1}>1 Sem</option><option value={2}>2 Sem</option><option value={4}>1 Mes</option></select>
                    </div>
                    <button type="submit" disabled={isGenerating || selectedDays.length === 0 || !bulkTime} className="w-full bg-[#F9BC15] text-[#0a1b3d] font-bold py-3.5 rounded-xl mt-2 disabled:opacity-50">{isGenerating ? "Generando..." : "Abrir Horarios Semanales"}</button>
                  </form>
                </div>
                {/* Lista de Horarios Abiertos (Caja Gris Claro, Borde Gris) */}
                <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-6 min-h-[500px]">
                  <h3 className="text-xl font-bold text-[#0a1b3d] mb-6">Horarios Visibles al Público</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availability.filter(a => a.status === 'free').map(slot => (
                      <div key={slot.id} className="bg-white border border-gray-100 p-4 rounded-xl flex flex-col items-center gap-1 group shadow-sm">
                        <span className="text-gray-400 text-xs font-bold">{slot.date}</span>
                        <span className="text-[#0a1b3d] font-bold text-2xl">{slot.time.substring(0, 5)}</span>
                        <button onClick={() => handleDeleteSchedule(slot.id)} className="mt-3 text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg w-full hover:bg-red-100 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100">Eliminar</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================================
                VISTA CÁPSULAS Y HERRAMIENTAS - RESTAURADAS
                ============================================================================ */}
            {(activeTab === 'capsulas' || activeTab === 'recursos') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario (Caja Azul, Borde Dorado) */}
                <div className={`lg:col-span-1 ${activeTab === 'capsulas' ? 'bg-[#1B4F8A]/30 border border-[#2B9ED4]/30' : 'bg-emerald-900/20 border border-emerald-500/30'} rounded-2xl p-6 h-fit relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <h3 className="text-xl font-bold text-white mb-1 relative z-10">{activeTab === 'capsulas' ? 'Subir Nueva Cápsula' : 'Añadir Herramienta'}</h3>
                  <p className={`text-sm mb-6 relative z-10 ${activeTab === 'capsulas' ? 'text-[#2B9ED4]' : 'text-emerald-400'}`}>Sube el HTML a la carpeta correcta antes de vincularlo.</p>
                  
                  {activeTab === 'capsulas' ? (
                    <form onSubmit={handleAddCapsula} className="flex flex-col gap-4 relative z-10">
                      <input type="text" value={capTitulo} onChange={e => setCapTitulo(e.target.value)} placeholder="Título: Trabajando la Culpa" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#2B9ED4]" />
                      <textarea value={capDesc} onChange={e => setCapDesc(e.target.value)} placeholder="Estrategias de afrontamiento..." rows="2" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#2B9ED4] resize-none" />
                      <div className="grid grid-cols-2 gap-3">
                        <select value={capCat} onChange={e => setCapCat(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-[#2B9ED4] appearance-none"><option>ACT</option><option>DBT</option><option>FAP</option><option>AC</option><option>RFT</option></select>
                        <input type="text" value={capTiempo} onChange={e => setCapTiempo(e.target.value)} placeholder="Ej: 40 min" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-[#2B9ED4]" />
                      </div>
                      <input type="text" value={capLink} onChange={e => setCapLink(e.target.value)} placeholder="/capsulas/culpa.html" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#2B9ED4]" />
                      <button type="submit" className="w-full bg-[#2B9ED4] text-white font-bold py-3.5 rounded-xl mt-4 hover:scale-[1.02] transition-all">+ Publicar Cápsula</button>
                    </form>
                  ) : (
                    <form onSubmit={handleAddRecurso} className="flex flex-col gap-4 relative z-10">
                      <input type="text" value={recTitulo} onChange={e => setRecTitulo(e.target.value)} placeholder="Ej: Test de Flexibilidad" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-emerald-500" />
                      <textarea value={recDesc} onChange={e => setRecDesc(e.target.value)} placeholder="Instrucción breve..." rows="2" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-emerald-500 resize-none" />
                      <div className="grid grid-cols-2 gap-3">
                        <select value={recCat} onChange={e => setRecCat(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-emerald-500 appearance-none"><option>ACT</option><option>DBT</option><option>FAP</option><option>AC</option><option>General</option></select>
                        <select value={recTipo} onChange={e => setRecTipo(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-emerald-500 appearance-none"><option>Ejercicio</option><option>Test</option><option>Registro</option><option>Metáfora</option></select>
                      </div>
                      <input type="text" value={recLink} onChange={e => setRecLink(e.target.value)} placeholder="/recursos/test1.html" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-emerald-500" />
                      <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl mt-4 hover:bg-emerald-600 transition-all">+ Publicar Herramienta</button>
                    </form>
                  )}
                </div>
                {/* Lista (Caja Gris Claro, Borde Gris) */}
                <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-6 min-h-[500px]">
                  <h3 className="text-xl font-bold text-[#0a1b3d] mb-6">{activeTab === 'capsulas' ? `Cápsulas Publicadas (${capsulas.length})` : `Herramientas Publicadas (${recursos.length})`}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(activeTab === 'capsulas' ? capsulas : recursos).map(item => (
                      <div key={item.id} className="bg-white border border-gray-100 p-5 rounded-xl flex flex-col gap-1.5 relative group shadow-sm">
                        <div className="flex justify-between items-start text-xs font-bold uppercase">
                          <span className={activeTab === 'capsulas' ? 'text-[#2B9ED4]' : 'text-emerald-500'}>{item.categoria}</span>
                          <span className="text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{activeTab === 'capsulas' ? item.tiempo : item.tipo}</span>
                        </div>
                        <h4 className="text-lg font-bold text-[#0a1b3d] line-clamp-1">{item.titulo}</h4>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-2">{activeTab === 'capsulas' ? item.descripcion : item.descripcion}</p>
                        <div className="text-gray-400 text-xs font-mono bg-gray-50 p-2 rounded truncate border border-gray-100">{item.link}</div>
                        <button onClick={() => (activeTab === 'capsulas' ? handleDeleteCapsula(item.id) : handleDeleteRecurso(item.id))} className="absolute top-2.5 right-2.5 bg-red-50 text-red-600 border border-red-100 w-8 h-8 rounded-lg flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-100">🗑️</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================================
                VISTA BLOG Y CONSULTANTES - ACTUALIZADA CON DISEÑO BLANCO/AZUL/DORADO
                ============================================================================ */}
            {(activeTab === 'blog' || activeTab === 'consultantes') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario (Caja Azul, Borde Dorado) */}
                <div className={`lg:col-span-1 ${activeTab === 'blog' ? 'bg-[#E8720A]/10 border border-[#E8720A]/30' : 'bg-[#2B9ED4]/10 border border-[#2B9ED4]/30'} rounded-2xl p-6 h-fit relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <h3 className="text-xl font-bold text-white mb-4 relative z-10">{activeTab === 'blog' ? 'Escribir Artículo' : 'Subir Material'}</h3>
                  
                  {activeTab === 'blog' ? (
                    <form onSubmit={handleAddBlog} className="flex flex-col gap-4 relative z-10">
                      <input type="text" value={blogTitulo} onChange={e=>setBlogTitulo(e.target.value)} placeholder="Título: Análisis de ACT" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#E8720A]" />
                      <select value={blogCat} onChange={e=>setBlogCat(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-[#E8720A] appearance-none"><option>Reflexión</option><option>Análisis de Caso</option><option>Divulgación</option></select>
                      <textarea value={blogExtracto} onChange={e=>setBlogExtracto(e.target.value)} placeholder="Breve extracto..." rows="3" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#E8720A] resize-none" />
                      <input type="text" value={blogLink} onChange={e=>setBlogLink(e.target.value)} placeholder="/blog/articulo1.html" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#E8720A]" />
                      <button type="submit" className="w-full bg-[#E8720A] text-white font-bold py-3.5 rounded-xl mt-2">Publicar Artículo</button>
                    </form>
                  ) : (
                    <form onSubmit={handleAddCons} className="flex flex-col gap-4 relative z-10">
                      <input type="text" value={consTitulo} onChange={e=>setConsTitulo(e.target.value)} placeholder="Título: Registro de AC" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#2B9ED4]" />
                      <select value={consTipo} onChange={e=>setConsTipo(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-[#2B9ED4] appearance-none"><option>Documento / PDF</option><option>Audio</option><option>Ejercicio</option></select>
                      <textarea value={consDesc} onChange={e=>setConsDesc(e.target.value)} placeholder="Descripción breve..." rows="2" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#2B9ED4] resize-none" />
                      <input type="text" value={consLink} onChange={e=>setConsLink(e.target.value)} placeholder="/material/pdf1.html" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#2B9ED4]" />
                      <button type="submit" className="w-full bg-[#2B9ED4] text-white font-bold py-3.5 rounded-xl mt-2">Publicar Material</button>
                    </form>
                  )}
                </div>
                {/* Lista (Caja Gris Claro, Borde Gris) */}
                <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-6 min-h-[500px]">
                  <h3 className="text-xl font-bold text-[#0a1b3d] mb-6">{activeTab === 'blog' ? `Artículos Publicados (${blogItems.length})` : `Materiales Publicados (${consultantesItems.length})`}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(activeTab === 'blog' ? blogItems : consultantesItems).map(item => (
                      <div key={item.id} className="bg-white border border-gray-100 p-5 rounded-xl flex flex-col gap-1 relative group shadow-sm">
                        <div className="flex justify-between items-start text-xs font-bold uppercase">
                          <span className={activeTab === 'blog' ? 'text-[#E8720A]' : 'text-[#2B9ED4]'}>{activeTab === 'blog' ? item.categoria : item.tipo}</span>
                        </div>
                        <h4 className="text-lg font-bold text-[#0a1b3d] line-clamp-1">{item.titulo}</h4>
                        <div className="text-gray-400 text-xs font-mono bg-gray-50 p-2 rounded truncate border border-gray-100">{item.link}</div>
                        <button onClick={() => (activeTab === 'blog' ? handleDeleteBlog(item.id) : handleDeleteCons(item.id))} className="absolute top-2.5 right-2.5 bg-red-50 text-red-600 border border-red-100 w-8 h-8 rounded-lg flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-100">🗑️</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================================
                VISTA ITACA (BÓVEDA Y NUEVO SISTEMA DE HTMLS) - ACTUALIZADA
                ============================================================================ */}
            {activeTab === 'itaca' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* 1. Gestión de Contraseña (Caja Roja, Borde Rojo) */}
                <div className="lg:col-span-1 bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center shadow-xl relative overflow-hidden h-fit">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 relative z-10">🔒</div>
                  <h2 className="text-xl font-bold text-white mb-1 relative z-10">Bóveda ITACA</h2>
                  <p className="text-white/60 text-sm mb-6 relative z-10">Clave de acceso institucional para alumnos.</p>
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6 relative z-10">
                    <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Contraseña Actual:</p>
                    <p className="text-2xl text-red-400 font-mono tracking-widest">{itacaPass}</p>
                  </div>
                  <form onSubmit={handleUpdateItacaPass} className="flex flex-col gap-3 relative z-10">
                    <input type="text" value={newItacaPass} onChange={e=>setNewItacaPass(e.target.value)} placeholder="Nueva contraseña..." required className="bg-black/30 border border-white/10 rounded-xl p-3.5 text-white text-center font-mono tracking-widest outline-none focus:border-red-400" />
                    <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg">Cambiar Clave</button>
                  </form>
                </div>

                {/* 2. Subir Nuevo Módulo HTML (Caja Azul, Borde Dorado) */}
                <div className="lg:col-span-1 bg-[#0a1b3d] border border-[#F9BC15]/30 rounded-2xl p-6 h-fit relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <h3 className="text-xl font-bold text-[#F9BC15] mb-2 relative z-10">Añadir Módulo Master</h3>
                  <p className="text-white/60 text-sm mb-6 relative z-10">Sube el HTML a `public/itaca` antes de vincularlo.</p>
                  <form onSubmit={handleAddItacaMod} className="flex flex-col gap-4 relative z-10">
                    <input type="text" value={itacaModTitulo} onChange={e=>setItacaModTitulo(e.target.value)} placeholder="Ej: Módulo 1 - Bases Teóricas" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#F9BC15]" />
                    <textarea value={itacaModDesc} onChange={e=>setItacaModDesc(e.target.value)} placeholder="Breve resumen del contenido..." rows="2" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#F9BC15] resize-none" />
                    <input type="text" value={itacaModLink} onChange={e=>setItacaModLink(e.target.value)} placeholder="/itaca/modulo1.html" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#F9BC15]" />
                    <button type="submit" className="w-full bg-[#F9BC15] text-[#0a1b3d] font-bold py-3.5 rounded-xl shadow-lg">+ Publicar Módulo</button>
                  </form>
                </div>

                {/* 3. Lista de Módulos Activos (Caja Gris Claro, Borde Gris) */}
                <div className="lg:col-span-1 bg-gray-50 border border-gray-200 rounded-2xl p-6 min-h-[300px]">
                  <h3 className="text-xl font-bold text-[#0a1b3d] mb-6">Módulos en el Master ({itacaModules.length})</h3>
                  {itacaModules.length === 0 ? <p className="text-center text-gray-400 py-10">Aún no hay módulos subidos.</p> : (
                    <div className="grid grid-cols-1 gap-4">
                      {itacaModules.map(item => (
                        <div key={item.id} className="bg-white border border-gray-100 p-4 rounded-xl flex flex-col gap-1 relative group shadow-sm">
                          <h4 className="font-bold text-[#0a1b3d] line-clamp-1">{item.titulo}</h4>
                          <div className="text-gray-400 text-xs font-mono bg-gray-50 p-2 rounded truncate border border-gray-100">{item.link}</div>
                          <button onClick={() => handleDeleteItacaMod(item.id)} className="absolute top-2 right-2 bg-red-50 text-red-600 border border-red-100 w-8 h-8 rounded-lg flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-100">🗑️</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}