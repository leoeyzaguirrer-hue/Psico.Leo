import { Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'Leo Eyzaguirre | Psicoterapeuta',
  description: 'Psicoterapeuta Conductual-Contextual',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased bg-[#fbfbfd]`}>
        <Navbar />
        {children}

        {/* BOTÓN FLOTANTE DE WHATSAPP */}
        <a 
          href="https://wa.me/59165677086" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-[60] bg-[#25D366] p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform active:scale-95 group"
        >
          <div className="absolute -top-12 right-0 bg-white text-psico-dark text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap">
            ¿Hablamos? 👋
          </div>
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.406c0 6.556-5.333 11.888-11.889 11.888-2.01 0-3.987-.508-5.741-1.472L0 24zm6.135-4.561l.405.241c1.585.94 3.413 1.436 5.3 1.436 5.638 0 10.226-4.587 10.226-10.225 0-2.731-1.064-5.298-2.994-7.229-1.93-1.93-4.496-2.995-7.23-2.995-5.639 0-10.226 4.588-10.226 10.226 0 1.954.557 3.864 1.611 5.519l.265.414-1.05 3.832 3.933-1.033z"/>
          </svg>
        </a>
      </body>
    </html>
  )
}