import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    
    <div className="font-sans text-gray-800">
      {/* 🔹 Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <a href="/" className="text-2xl font-bold text-indigo-600">
            OmarDev
          </a>
          {/* Desktop menu */}
          <nav className="bg-white shadow-md">
            <ul className="flex items-center justify-center space-x-6 py-4 font-medium">
              <li><a href="/" className="hover:text-indigo-600">Inicio</a></li>
              <li><a href="/portafolio" className="hover:text-indigo-600">Portafolio</a></li>
              <li><a href="/sobre-mi" className="hover:text-indigo-600">Sobre mí</a></li>
              <li><a href="/contacto" className="hover:text-indigo-600">Contacto</a></li>
              <li>
                <a
                  href="/login"
                  className="ml-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Login
                </a>
              </li>
            </ul>
          </nav>
 

          {/* Mobile button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t shadow">
            <ul className="flex flex-col p-4 space-y-4">
              <li><a href="/" className="hover:text-indigo-600">Inicio</a></li>
              <li><a href="/portafolio" className="hover:text-indigo-600">Portafolio</a></li>
              <li><a href="/sobre-mi" className="hover:text-indigo-600">Sobre mí</a></li>
              <li><a href="/contacto" className="hover:text-indigo-600">Contacto</a></li>
              <li>
                <a
                  href="/login"
                  className="block text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* 🔹 Hero */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center pt-32 pb-24">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Bienvenido a mi Portafolio
        </h1>
        <p className="text-lg md:text-xl font-light mb-6">
          Soy Omar, estudiante de Ingeniería de Sistemas
        </p>
        <a
          href="/sobre-mi"
          className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Conóceme más
        </a>
      </header>

      {/* 🔹 Intro */}
      <section className="text-center py-16 px-6">
        <h3 className="text-3xl font-semibold mb-4">Explora mi sitio</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Información general sobre mi formación y proyectos académicos.
        </p>
      </section>

      {/* 🔹 Portafolio */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Portafolio</h2>
        <div className="grid gap-10 max-w-6xl mx-auto md:grid-cols-3">
          {/* Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition">
            <h3 className="text-xl font-semibold mb-2">Arquitectura de Software</h3>
            <p className="text-gray-600 mb-4">
              Explora conceptos, patrones y prácticas de arquitectura.
            </p>
            <a href="/curso/arquitectura" className="text-indigo-600 font-medium hover:underline">
              Ver Curso →
            </a>
          </div>
          {/* Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition">
            <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
            <p className="text-gray-600 mb-4">
              Algoritmos, redes neuronales y aplicaciones prácticas.
            </p>
            <a href="/curso/ml" className="text-indigo-600 font-medium hover:underline">
              Ver Curso →
            </a>
          </div>
          {/* Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition">
            <h3 className="text-xl font-semibold mb-2">Inglés</h3>
            <p className="text-gray-600 mb-4">
              Prácticas de escritura, lectura, conversación y listening.
            </p>
            <a href="/curso/ingles" className="text-indigo-600 font-medium hover:underline">
              Ver Curso →
            </a>
          </div>
        </div>
      </section>
          <div className="bg-red-500 text-white p-4">
            Tailwind funciona
          </div>

      {/* 🔹 Footer */}
      <footer className="bg-gray-900 text-white text-center py-8">
        <p className="text-sm">&copy; 2025 - Portafolio personal de Omar</p>
      </footer>
    </div>
    
  );
}

export default App;
