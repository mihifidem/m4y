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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Routes>
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
