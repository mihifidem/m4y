import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Account() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    comercial_name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Obtener información del proveedor asociado
    const fetchProveedor = async () => {
      try {
        const response = await api.get("/user/proveedor/");
        if (response.data.has_proveedor) {
          setProveedor(response.data.proveedor);
          setFormData({
            comercial_name: response.data.proveedor.comercial_name || "",
            address: response.data.proveedor.address || "",
            phone: response.data.proveedor.phone || "",
            email: response.data.proveedor.email || "",
            website: response.data.proveedor.website || "",
            facebook: response.data.proveedor.facebook || "",
            instagram: response.data.proveedor.instagram || "",
            twitter: response.data.proveedor.twitter || ""
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error cargando información:", err);
        setLoading(false);
      }
    };

    fetchProveedor();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      // Añadir name y prefix si existen en proveedor
      const dataToSend = {
        ...formData,
        name: proveedor?.name || "",
        prefix: proveedor?.prefix || ""
      };
      const response = await api.put("/user/proveedor/", dataToSend);
      if (response.data.success) {
        setProveedor(response.data.proveedor);
        setEditing(false);
        setMessage({ type: "success", text: "Información actualizada correctamente" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      console.error("Error actualizando información:", err);
      let errorMsg = "Error al actualizar la información";
      if (err.response && err.response.data && err.response.data.errors) {
        errorMsg += ": " + JSON.stringify(err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.error) {
        errorMsg += ": " + err.response.data.error;
      }
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Restaurar datos originales
    setFormData({
      comercial_name: proveedor?.comercial_name || "",
      address: proveedor?.address || "",
      phone: proveedor?.phone || "",
      email: proveedor?.email || "",
      website: proveedor?.website || "",
      facebook: proveedor?.facebook || "",
      instagram: proveedor?.instagram || "",
      twitter: proveedor?.twitter || ""
    });
    setMessage({ type: "", text: "" });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mi Cuenta</h1>
                <p className="text-gray-600">{user?.email}</p>
                {proveedor && (
                  <p className="text-sm text-purple-600 font-semibold mt-1">
                    {proveedor.comercial_name || proveedor.name}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Información del Usuario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Usuario</p>
              <p className="text-lg font-semibold text-gray-800">{user?.email?.split('@')[0]}</p>
            </div>
          </div>
        </div>

        {/* Mensaje si no hay proveedor */}
        {!proveedor && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <svg className="w-8 h-8 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-lg font-bold text-yellow-800 mb-2">Sin Proveedor Asignado</h3>
                <p className="text-yellow-700">
                  Este usuario no tiene un proveedor asignado todavía. Contacta al administrador para obtener acceso a tu negocio.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información del Proveedor */}
        {proveedor && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Información del Negocio
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            {/* Información del usuario asociado */}
            {proveedor.user_info && (
              <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-blue-800">Usuario Asociado al Proveedor</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Email:</span>
                    <span className="ml-2 text-blue-800">{proveedor.user_info.email}</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Username:</span>
                    <span className="ml-2 text-blue-800">{proveedor.user_info.username}</span>
                  </div>
                  {(proveedor.user_info.first_name || proveedor.user_info.last_name) && (
                    <div className="sm:col-span-2">
                      <span className="text-blue-600 font-medium">Nombre:</span>
                      <span className="ml-2 text-blue-800">
                        {proveedor.user_info.first_name} {proveedor.user_info.last_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Prefijo</p>
                <p className="text-lg font-semibold text-gray-800">{proveedor.prefix}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nombre</p>
                <p className="text-lg font-semibold text-gray-800">{proveedor.name}</p>
              </div>
            </div>

            {/* Campos editables */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Comercial {formData.comercial_name && <span className="text-green-600">✓</span>}
                </label>
                <input
                  type="text"
                  name="comercial_name"
                  value={formData.comercial_name}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none' : 'bg-gray-100 border-gray-200'} transition-colors`}
                  placeholder="Nombre comercial del negocio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección {formData.address && <span className="text-green-600">✓</span>}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none' : 'bg-gray-100 border-gray-200'} transition-colors`}
                  placeholder="Dirección física del negocio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono {formData.phone && <span className="text-green-600">✓</span>}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none' : 'bg-gray-100 border-gray-200'} transition-colors`}
                    placeholder="+34 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto {formData.email && <span className="text-green-600">✓</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none' : 'bg-gray-100 border-gray-200'} transition-colors`}
                    placeholder="contacto@negocio.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio Web {formData.website && <span className="text-green-600">✓</span>}
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none' : 'bg-gray-100 border-gray-200'} transition-colors`}
                  placeholder="https://www.tuempresa.com"
                />
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  Redes Sociales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook {formData.facebook && <span className="text-green-600">✓</span>}
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none' : 'bg-gray-100 border-gray-200'} transition-colors`}
                      placeholder="URL de Facebook"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram {formData.instagram && <span className="text-green-600">✓</span>}
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none' : 'bg-gray-100 border-gray-200'} transition-colors`}
                      placeholder="URL de Instagram"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter {formData.twitter && <span className="text-green-600">✓</span>}
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className={`w-full px-4 py-2 border rounded-lg ${editing ? 'bg-white border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none' : 'bg-gray-100 border-gray-200'} transition-colors`}
                      placeholder="URL de Twitter"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold"
                  >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all hover:scale-105 shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-semibold">Ir al Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-lg transition-all hover:scale-105 shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold">Volver al Inicio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
