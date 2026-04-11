"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; 
import ConsentScreen from "@/components/onboarding-clinico/ConsentScreen";
import PersonalDataScreen from "@/components/onboarding-clinico/PersonalDataScreen";
import CalendarScreen from "@/components/onboarding-clinico/CalendarScreen";
import PaymentScreen from "@/components/onboarding-clinico/PaymentScreen";
import QuestionnaireScreen from "@/components/onboarding-clinico/QuestionnaireScreen";

const SCREENS = {
  CONSENT: "CONSENT",
  PERSONAL_DATA: "PERSONAL_DATA",
  CALENDAR: "CALENDAR", 
  PAYMENT: "PAYMENT",
  QUESTIONNAIRE: "QUESTIONNAIRE",
  CONFIRMATION: "CONFIRMATION", 
  WELCOME: "WELCOME" 
};

export default function AgendarPage() {
  const [screen, setScreen] = useState(SCREENS.CONSENT);
  const [isNewUser, setIsNewUser] = useState(true); 
  const [data, setData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 

  return (
    <div className="min-h-screen bg-psico-dark font-sans flex items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-5xl h-[90vh] bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl flex flex-col overflow-hidden relative shadow-2xl">
        
        {screen === SCREENS.CONSENT && (
          <ConsentScreen
            onAccept={(name) => {
              setData((d) => ({ ...d, consentName: name }));
              setScreen(SCREENS.PERSONAL_DATA);
            }}
            onBack={() => window.location.href = '/'} 
          />
        )}

        {screen === SCREENS.PERSONAL_DATA && (
          <PersonalDataScreen
            name={data.consentName}
            onNext={(formData) => {
              setData((d) => ({ ...d, personalData: formData }));
              setScreen(SCREENS.CALENDAR);
            }}
            onBack={() => setScreen(SCREENS.CONSENT)} 
          />
        )}

        {screen === SCREENS.CALENDAR && (
          <CalendarScreen
            selectedSlot={data.slot}
            onSelect={(slotData) => {
              setData((d) => ({ ...d, slot: slotData }));
              setScreen(SCREENS.PAYMENT);
            }}
            onBack={() => setScreen(SCREENS.PERSONAL_DATA)}
          />
        )}

        {screen === SCREENS.PAYMENT && (
          <PaymentScreen
            isNew={isNewUser}
            onNext={(paymentData) => {
              setData((d) => ({ ...d, payment: paymentData }));
              setScreen(isNewUser ? SCREENS.QUESTIONNAIRE : SCREENS.CONFIRMATION);
            }}
            onBack={() => setScreen(SCREENS.CALENDAR)}
          />
        )}

        {screen === SCREENS.QUESTIONNAIRE && (
          <QuestionnaireScreen
            onNext={async (answers) => {
              setIsSubmitting(true);
              
              // 1. Armamos el paquete de datos
              const finalData = { ...data, questionnaire: answers };
              setData(finalData);

              // 2. Guardamos los datos del paciente en Supabase
              const { error } = await supabase
                .from('appointments')
                .insert([
                  {
                    patient_name: finalData.personalData.nombre,
                    patient_email: finalData.personalData.email,
                    patient_phone: finalData.personalData.telefono,
                    modality: finalData.personalData.modalidad,
                    appointment_date: finalData.slot.date,
                    appointment_time: finalData.slot.time,
                    payment_type: finalData.payment,
                    status: 'pending'
                  }
                ]);

              // 3. Verificamos cómo nos fue
              if (error) {
                console.error("Error de Supabase:", error);
                alert("Hubo un error al enviar tu solicitud. Intenta de nuevo.");
                setIsSubmitting(false);
              } else {
                
                // ==========================================
                // NUEVO: BLOQUEAMOS EL HORARIO PARA QUE NADIE MÁS LO USE
                // ==========================================
                await supabase
                  .from('availability')
                  .update({ status: 'booked' })
                  .eq('date', finalData.slot.date)
                  .eq('time', finalData.slot.time);

                // 4. Enviamos el correo a tu Gmail
                try {
                  await fetch('/api/notificar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData)
                  });
                } catch (err) {
                  console.error("Error al enviar el correo:", err);
                }
                
                // 5. Ocultamos el cargador y pasamos a la pantalla de éxito
                setIsSubmitting(false);
                setScreen(SCREENS.CONFIRMATION);
              }
              // 3. Verificamos cómo nos fue
              if (error) {
                console.error("Error de Supabase:", error);
                alert("Hubo un error al enviar tu solicitud. Intenta de nuevo.");
                setIsSubmitting(false);
              } else {
                // 4. Si se guardó en la base de datos, enviamos el correo a tu Gmail
                try {
                  await fetch('/api/notificar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData)
                  });
                } catch (err) {
                  console.error("Error al enviar el correo:", err);
                }
                
                // 5. Ocultamos el cargador y pasamos a la pantalla de éxito
                setIsSubmitting(false);
                setScreen(SCREENS.CONFIRMATION);
              }
            }}
            onSkip={() => setScreen(SCREENS.CONFIRMATION)}
            onBack={() => setScreen(SCREENS.PAYMENT)}
          />
        )}

        {/* PANTALLA DE CONFIRMACIÓN */}
        {screen === SCREENS.CONFIRMATION && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-psico-yellow/20 border-4 border-psico-yellow rounded-full flex items-center justify-center text-4xl mb-8 animate-pulse text-psico-yellow">
              ✓
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">¡Solicitud enviada!</h2>
            <p className="text-white/70 text-lg max-w-md mx-auto mb-10">
              Leo revisará tu solicitud y te contactará directamente para confirmar la sesión.
            </p>
            <button 
              onClick={() => setScreen(SCREENS.WELCOME)}
              className="bg-psico-yellow text-psico-dark font-bold text-lg py-4 px-10 rounded-full hover:scale-105 transition-transform"
            >
              Leer carta de bienvenida →
            </button>
          </div>
        )}

        {/* CARTA DE BIENVENIDA */}
        {screen === SCREENS.WELCOME && (
          <div className="flex flex-col h-full">
            <div className="p-10 text-center border-b border-white/10">
              <h2 className="text-3xl md:text-5xl font-bold text-white font-serif">Bienvenido/a a este espacio</h2>
              <div className="w-16 h-1 bg-psico-yellow mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar text-white/80 text-lg leading-relaxed space-y-6 max-w-3xl mx-auto">
              <p>Trabajaremos desde un enfoque llamado <strong className="text-psico-yellow">Terapia de Aceptación y Compromiso (ACT)</strong>. No se trata solo de hablar sobre problemas; somos un equipo para ayudarte a construir la vida que deseas vivir.</p>
              <p>Aprenderemos habilidades para desengancharse de pensamientos y emociones difíciles, quitándoles su poder para que no te detengan.</p>
              <p className="italic text-white/50 text-base mt-10">Puedes cerrar esta ventana. Si tienes dudas antes de la sesión, escríbeme a leo.eyzaguirrer@gmail.com o al +591 65677086.</p>
            </div>
            <div className="p-8 text-center bg-black/30">
               <button onClick={() => window.location.href = '/'} className="text-psico-yellow font-bold hover:underline">Volver al inicio</button>
            </div>
          </div>
        )}

        {/* Pantalla de carga superpuesta si está enviando a la base de datos */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-psico-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
             <div className="text-psico-yellow font-bold text-xl animate-pulse">Enviando solicitud a Leo...</div>
          </div>
        )}

      </div>
    </div>
  );
}