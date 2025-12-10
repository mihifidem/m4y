import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      alert("💐 Cuenta creada con éxito.");
      nav("/login");
    } catch {
      alert("Error al registrar la cuenta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="card-romantic w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-[#E86B87]">
          🌷 Crea tu cuenta
        </h2>

        <input
          type="text"
          placeholder="Tu nombre"
          className="input-romantic"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Tu email"
          className="input-romantic"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Crea una contraseña"
          className="input-romantic"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn-romantic w-full">Crear cuenta</button>

        <p className="text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="link-romantic">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
