import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();

    // Configuramos el cartero (Nodemailer) con tus credenciales
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Diseñamos el correo que vas a recibir
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Te lo envías a ti mismo
      subject: `🚨 Nueva solicitud de: ${data.personalData.nombre}`,
      html: `
        <h2>Tienes una nueva solicitud de agendamiento</h2>
        <p><strong>Paciente:</strong> ${data.personalData.nombre}</p>
        <p><strong>Email:</strong> ${data.personalData.email}</p>
        <p><strong>Teléfono:</strong> ${data.personalData.telefono}</p>
        <p><strong>Modalidad:</strong> ${data.personalData.modalidad}</p>
        <p><strong>Fecha solicitada:</strong> ${data.slot.date} a las ${data.slot.time} hs</p>
        <p><strong>Motivo de consulta:</strong> ${data.personalData.motivoConsulta}</p>
        <br/>
        <a href="http://localhost:3000/leo-admin">Ver en el Panel de Control</a>
      `,
    };

    // Enviamos el correo
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Correo enviado" }), { status: 200 });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return new Response(JSON.stringify({ error: "Error enviando correo" }), { status: 500 });
  }
}