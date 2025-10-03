export default function Home() {
  return (
    <div className="font-sans text-gray-800">
      {/* 🔹 Hero */}
      <header className="relative flex items-center justify-center text-center min-h-screen bg-indigo-100">
        <div className="px-4">
          <h1 className="text-5xl font-bold text-indigo-700 mb-4">Bienvenido</h1>
          <h2 className="text-xl md:text-2xl text-indigo-800 mb-6">
            Soy <strong>Omar</strong>, estudiante de Ingeniería de Sistemas
          </h2>
          <a
            href="/sobre-mi"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full text-lg hover:bg-indigo-700 transition"
          >
            Conóceme más
          </a>
        </div>
      </header>

      {/* 🔹 Intro */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Explora mi sitio</h2>
          <p className="text-gray-700">Información general sobre mi formación y proyectos académicos.</p>
        </div>
      </section>

      {/* 🔹 Portafolio */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Portafolio</h2>
          <p className="text-gray-600 mb-12">Algunos proyectos que forman parte de mi formación académica.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Proyecto 1 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-2">Arquitectura de Software</h3>
              <p className="text-gray-600 mb-4">Explora conceptos, patrones y prácticas de arquitectura.</p>
              <a href="/curso/arquitectura" className="text-indigo-600 hover:underline">
                Ver Curso →
              </a>
            </div>

            {/* Proyecto 2 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2">Machine Learning</h3>
              <p className="text-gray-600 mb-4">Algoritmos, redes neuronales y aplicaciones prácticas.</p>
              <a href="/curso/ml" className="text-indigo-600 hover:underline">
                Ver Curso →
              </a>
            </div>

            {/* Proyecto 3 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <div className="text-indigo-600 text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Inglés</h3>
              <p className="text-gray-600 mb-4">Prácticas de escritura, lectura, conversación y listening.</p>
              <a href="/curso/ingles" className="text-indigo-600 hover:underline">
                Ver Curso →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 CTA */}
      <section className="py-16 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">¿Quieres saber más?</h2>
          <p className="mb-6">Visita la sección de contacto para comunicarte conmigo.</p>
          <a
            href="/contacto"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            Contáctame
          </a>
        </div>
      </section>
    </div>
  );
}
