import { useNavigate } from "react-router-dom";
import "../styles/premium.css";

export default function HeaderLogo() {
  const navigate = useNavigate();

  return (
    <div
      className="header-logo"
      onClick={() => navigate("/")}
    >
      <img
        src="/ntsf_logo.png"
        alt="NTSF Logo"
        className="header-logo-img"
      />
      <span className="header-logo-text">No Todo Son Flores</span>
    </div>
  );
}
