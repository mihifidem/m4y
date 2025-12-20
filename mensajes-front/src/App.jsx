import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import AdminCodes from "./pages/AdminCodes";
import PrivateRoute from "./auth/PrivateRoute";
import CreateMessage from "./pages/CreateMessage";
import ViewMessage from "./pages/ViewMessage";
import ViewMessageForm from "./pages/ViewMessageForm";
import Landing from "./pages/Landing.jsx";
import HomeInfo from "./pages/HomeInfo.jsx";
import MessageSent from "./pages/MessageSent";
import ReplyMessage from "./pages/ReplyMessage";
import ReplySent from "./pages/ReplySent";
import ErrorPage from "./pages/ErrorPage";
import ExpiredMessage from "./pages/ExpiredMessage";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import InstructionsCreate from "./pages/InstructionsCreate.jsx";
import InstructionsView from "./pages/InstructionsView.jsx";
import QueOfrecemos from "./pages/QueOfrecemos.jsx";
import ComoFunciona from "./pages/ComoFunciona.jsx";
import VentajasNFCQR from "./pages/VentajasNFCQR.jsx";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes.jsx";
import ContactoSoporte from "./pages/ContactoSoporte.jsx";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad.jsx";
import TerminosServicio from "./pages/TerminosServicio.jsx";

import ContactoComercial from "./pages/ContactoComercial.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Routes>
                        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                        <Route path="/terminos-servicio" element={<TerminosServicio />} />
            {/* Público */}
            <Route path="/" element={<Landing />} />
            <Route path="/home-info" element={<HomeInfo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Cuenta de usuario */}
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            {/* Admin Codes (protegido) */}
            <Route
              path="/admin-codes"
              element={
                <PrivateRoute>
                  <AdminCodes />
                </PrivateRoute>
              }
            />
            {/* Dashboard (protegido) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* Crear mensaje (comprador) */}
            <Route path="/create-message/:code" element={<CreateMessage />} />
            <Route path="/instrucciones/crear" element={<InstructionsCreate />} />
            <Route path="/instrucciones/ver" element={<InstructionsView />} />
            <Route path="/que-ofrecemos" element={<QueOfrecemos />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/ventajas-nfc-qr" element={<VentajasNFCQR />} />
            <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
            <Route path="/contacto-soporte" element={<ContactoSoporte />} />
            {/* Contacto comercial */}
            <Route path="/contacto-comercial" element={<ContactoComercial />} />
            {/* Mensaje enviado */}
            <Route path="/message-sent/:code" element={<MessageSent />} />
            {/* Ver mensaje (destinatario) */}
            <Route path="/view-message" element={<ViewMessageForm />} />
            <Route path="/view/:code" element={<ViewMessage />} />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
