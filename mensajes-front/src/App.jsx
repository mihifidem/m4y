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
import MessageSent from "./pages/MessageSent";
import ReplyMessage from "./pages/ReplyMessage";
import ReplySent from "./pages/ReplySent";
import ErrorPage from "./pages/ErrorPage";
import ExpiredMessage from "./pages/ExpiredMessage";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import InstructionsCreate from "./pages/InstructionsCreate.jsx";
import InstructionsView from "./pages/InstructionsView.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
        <Routes>

        {/* Público */}
        <Route path="/" element={<Landing />} />
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

        {/* Crear mensaje (comprador) */}
        <Route path="/create-message/:code" element={<CreateMessage />} />
        <Route path="/instrucciones/crear" element={<InstructionsCreate />} />

        {/* Ver mensaje (destinatario) */}
        <Route path="/view-message" element={<ViewMessageForm />} />
        <Route path="/view/:code" element={<ViewMessage />} />
        <Route path="/instrucciones/ver" element={<InstructionsView />} />

        {/* Zona privada del usuario logueado */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/message-sent/:code" element={<MessageSent />} />
        <Route path="/reply/:code" element={<ReplyMessage />} />
        <Route path="/reply-sent/:code" element={<ReplySent />} />
        <Route path="/error" element={<ErrorPage />} />
          <Route path="/expired/:code" element={<ExpiredMessage />} />

        {/* CRUD de códigos para admin */}
        <Route
          path="/admin-codes"
          element={
            <PrivateRoute>
              <AdminCodes />
            </PrivateRoute>
          }
        />

{/* navigate("/error", { state: { msg: "El mensaje ha expirado o no existe." } }); */}


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
