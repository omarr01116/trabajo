function Contacto() {
  return (
    <div className="py-20 px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Contacto</h1>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Si deseas ponerte en contacto conmigo, completa el siguiente formulario:
      </p>
      <form className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Tu nombre"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Tu correo"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <textarea
          placeholder="Escribe tu mensaje..."
          className="w-full px-4 py-2 border rounded-lg"
          rows="4"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Contacto;
