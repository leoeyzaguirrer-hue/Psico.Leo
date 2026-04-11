import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🚨 Nueva solicitud de: ${data.personalData.nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #1B4F8A;">Nueva Solicitud de Atención</h2>
          <p><strong>Paciente:</strong> ${data.personalData.nombre}</p>
          <p><strong>Email:</strong> ${data.personalData.email}</p>
          <p><strong>WhatsApp:</strong> ${data.personalData.telefono}</p>
          <p><strong>Modalidad:</strong> ${data.personalData.modalidad}</p>
          <p><strong>Horario solicitado:</strong> ${data.slot.date} a las ${data.slot.time} hs</p>
          <hr/>
          <p><strong>Motivo de consulta:</strong></p>
          <p>${data.personalData.motivoConsulta}</p>
          <br/>
          <a href="http://localhost:3000/leo-admin" style="background: #F9BC15; color: #0a1b3d; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Abrir Panel de Control
          </a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Notificación enviada con éxito" }, { status: 200 });
  } catch (error) {
    console.error("Error en API notificar:", error);
    return NextResponse.json({ error: "No se pudo enviar el correo" }, { status: 500 });
  }
}