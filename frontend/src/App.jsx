import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Portafolio from "./pages/Portafolio";
import SobreMi from "./pages/SobreMi";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import File from "./pages/File"; // 🔹 Asegúrate de crear File.jsx
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router basename="/trabajo"> {/* importante si usas GitHub Pages */}
      <div className="font-sans text-gray-800">

        {/* 🔹 Navbar */}
        <nav className="fixed top-0 w-full bg-white shadow z-50">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Omar Quispe Ore
            </Link>

            {/* Menú desktop */}
            <ul className="hidden md:flex items-center space-x-6 font-medium">
              <li><Link to="/" className="hover:text-indigo-600">Inicio</Link></li>
              <li><Link to="/portafolio" className="hover:text-indigo-600">Portafolio</Link></li>
              <li><Link to="/sobre-mi" className="hover:text-indigo-600">Sobre mí</Link></li>
              <li><Link to="/contacto" className="hover:text-indigo-600">Contacto</Link></li>
              <li>
                <Link
                  to="/login"
                  className="ml-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Login
                </Link>
              </li>
            </ul>

            {/* Botón móvil */}
            <button
              className="md:hidden text-gray-600 text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Menú móvil */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t shadow">
              <ul className="flex flex-col p-4 space-y-4">
                <li><Link to="/" className="hover:text-indigo-600">Inicio</Link></li>
                <li><Link to="/portafolio" className="hover:text-indigo-600">Portafolio</Link></li>
                <li><Link to="/sobre-mi" className="hover:text-indigo-600">Sobre mí</Link></li>
                <li><Link to="/contacto" className="hover:text-indigo-600">Contacto</Link></li>
                <li>
                  <Link
                    to="/login"
                    className="block text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* 🔹 Rutas */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portafolio" element={<Portafolio />} />
            <Route path="/sobre-mi" element={<SobreMi />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/file" element={<File />} /> {/* 🔹 Nueva ruta */}
          </Routes>
        </div>

        {/* 🔹 Footer */}
        <footer className="bg-gray-900 text-white text-center py-8">
          <p className="text-sm">&copy; 2025 - Portafolio personal de Omar</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
