function Login() {
  return (
    <div className="py-20 px-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Iniciar Sesión
        </h1>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
