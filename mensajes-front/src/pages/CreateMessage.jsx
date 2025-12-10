import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function CreateMessage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = new URLSearchParams(location.search).get('edit') === '1';
  const [codeValidated, setCodeValidated] = useState(false);
  const [validating, setValidating] = useState(true);
  const [messageExists, setMessageExists] = useState(false);
  const [existingMessage, setExistingMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });

  // =========================================================
  // CODE INPUT (4 PARTS)
  // =========================================================
  const [codePart1, setCodePart1] = useState(""); // NTSF
  const [codePart2, setCodePart2] = useState(""); // 001
  const [codePart3, setCodePart3] = useState(""); // 001
  const [codePart4, setCodePart4] = useState(""); // ABC
  const fullCode = `${codePart1}-${codePart2}-${codePart3}-${codePart4}`;

  useEffect(() => {
    if (code) {
      const parts = code.split("-");
      if (parts.length === 4) {
        setCodePart1(parts[0]);
        setCodePart2(parts[1]);
        setCodePart3(parts[2]);
        setCodePart4(parts[3]);
        
        // Validar el código con el backend
        api.post("/check_code/", { code })
          .then((res) => {
            if (res.data.valid) {
              setCodeValidated(true);
              
              // Verificar si ya existe un mensaje para este código (peek sin incrementar vistas)
              api.get(`/message/${code}/peek/`)
                .then((msgRes) => {
                  console.log("Respuesta del mensaje:", msgRes.data);
                  
                  // Si el backend devuelve exists: true, hay un mensaje
                  if (msgRes.data && msgRes.data.exists !== false && msgRes.data.created_at) {
                    // Verificar si han pasado más de 7 días desde la creación
                    const createdDate = new Date(msgRes.data.created_at);
                    const now = new Date();
                    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
                    
                    console.log("Mensaje existente detectado");
                    console.log("Fecha creación:", createdDate);
                    console.log("Días desde creación:", daysDiff);
                    
                    if (daysDiff <= 7) {
                      // Menos de una semana, permitir editar/borrar
                      console.log("✅ Permitiendo editar/borrar (menos de 7 días)");
                      setMessageExists(true);
                      setExistingMessage(msgRes.data);
                    } else {
                      // Más de una semana, no permitir modificaciones
                      console.log("❌ Más de 7 días, no se puede modificar");
                      setValidating(false);
                      // No redirigir, solo mostrar mensaje de periodo caducado
                      setMessageExists(false);
                      setExistingMessage({ ...msgRes.data, expired_edit: true });
                    }
                  } else {
                    console.log("No hay mensaje o no tiene created_at");
                    setMessageExists(false);
                  }
                })
                .catch((err) => {
                  // Silenciar 404 de inexistencia
                  if (err.response?.status !== 404) {
                    console.warn('Error comprobando mensaje (peek):', err);
                  }
                  setMessageExists(false);
                });
            } else {
              // Código no válido (posiblemente inactivo). Si estamos en modo edición intentar cargar el mensaje igualmente.
              if (isEditMode) {
                api.get(`/message/${code}/peek/`)
                  .then((msgRes) => {
                    if (msgRes.data && msgRes.data.exists !== false && msgRes.data.created_at) {
                      setCodeValidated(true); // permitir render
                      setMessageExists(true);
                      setExistingMessage(msgRes.data);
                    } else {
                      // No hay mensaje → no se puede editar
                      setCodeValidated(false);
                    }
                  })
                  .catch((err) => {
                    if (err.response?.status === 404) {
                      // No existe mensaje para editar
                      setCodeValidated(false);
                    } else {
                      console.warn('Error peek en modo edición:', err);
                    }
                  })
                  .finally(() => {
                    setValidating(false);
                  });
              } else {
                navigate("/", { replace: true });
              }
            }
          })
          .catch(() => {
            if (isEditMode) {
              // Intentar peek como último recurso
              api.get(`/message/${code}/peek/`)
                .then((msgRes) => {
                  if (msgRes.data && msgRes.data.exists !== false && msgRes.data.created_at) {
                    setCodeValidated(true);
                    setMessageExists(true);
                    setExistingMessage(msgRes.data);
                  } else {
                    setCodeValidated(false);
                  }
                })
                .catch(() => {
                  setCodeValidated(false);
                })
                .finally(() => setValidating(false));
            } else {
              navigate("/", { replace: true });
            }
          })
          .finally(() => {
            // Evitar doble finalización cuando ya se gestionó en fallback edición
            if (validating) setValidating(false);
          });
      } else {
        if (!isEditMode) navigate("/", { replace: true });
      }
    } else {
      if (!isEditMode) navigate("/", { replace: true });
    }
  }, [code, navigate]);

  const handlePasteCode = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().toUpperCase();
    const parts = pasted.split("-");
    if (parts.length === 4) {
      setCodePart1(parts[0].slice(0, 4));
      setCodePart2(parts[1].slice(0, 3));
      setCodePart3(parts[2].slice(0, 3));
      setCodePart4(parts[3].slice(0, 3));
    }
  };

  const handleCodePart1Change = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    setCodePart1(val);
    if (val.length === 4) document.getElementById("codePart2")?.focus();
  };

  const handleCodePart2Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    setCodePart2(val);
    if (val.length === 3) document.getElementById("codePart3")?.focus();
  };

  const handleCodePart3Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    setCodePart3(val);
    if (val.length === 3) document.getElementById("codePart4")?.focus();
  };

  const handleCodePart4Change = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    setCodePart4(val);
  };

  // =========================================================
  // THEME BY PROVIDER PREFIX (first 4 letters)
  // =========================================================
  const [theme, setTheme] = useState({
    background: "bg-gray-50",
    backgroundImage: null,
    primaryText: "text-gray-800",
    accent: "bg-gray-600",
    card: "bg-white",
  });

  useEffect(() => {
    const prefix = (codePart1 || "").toUpperCase();
    if (prefix && prefix.length === 4) {
      // Fetch provider design by prefix
      api
        .get(`/proveedor/${prefix}/`)
        .then((res) => {
          const d = res.data || {};
          setTheme({
            background: d.background_class || "bg-gray-50",
            backgroundImage: d.background_image || null,
            primaryText: d.primary_text_class || "text-gray-800",
            accent: d.accent_class || "bg-gray-600",
            card: d.card_class || "bg-white",
          });
        })
        .catch(() => {
          setTheme({
            background: "bg-gray-50",
            backgroundImage: null,
            primaryText: "text-gray-800",
            accent: "bg-gray-600",
            card: "bg-white",
          });
        });
    }
  }, [codePart1]);

  // =========================================================
  // FORM STATES
  // =========================================================
  const [text, setText] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [notifyOnRead, setNotifyOnRead] = useState(false);
  const [maxViews, setMaxViews] = useState(50);
  const [durationDays, setDurationDays] = useState(30);

  // =========================================================
  // VIDEO STATES
  // =========================================================
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderVideo = useRef(null);
  const videoChunksRef = useRef([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [videoRecordingTime, setVideoRecordingTime] = useState(0);
  const videoTimerRef = useRef(null);
  const [videoDecoration, setVideoDecoration] = useState("none");
  const animationFrameRef = useRef(null);
  const [previewMode, setPreviewMode] = useState(false);

  // =========================================================
  // AUDIO STATES
  // =========================================================
  const mediaRecorderAudio = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioPreview, setAudioPreview] = useState(null);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [audioRecordingTime, setAudioRecordingTime] = useState(0);
  const audioTimerRef = useRef(null);

  // =========================================================
  // AI STATES
  // =========================================================
  const [showAIForm, setShowAIForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState({
    buyerName: "",
    recipientName: "",
    recipientGender: "",
    event: "",
    eventDate: "",
    giftType: "",
    messageStyle: "romántico",
  });

  const handleAIChange = (e) => {
    setAiData({ ...aiData, [e.target.name]: e.target.value });
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // =========================================================
  // AI — GENERATE
  // =========================================================
  const generateAIText = async () => {
    setAiLoading(true);

    const prompt = `
      Crea un mensaje ${aiData.messageStyle} y elegante.
      Comprador: ${aiData.buyerName}
      Destinatario: ${aiData.recipientName}
      Género: ${aiData.recipientGender}
      Evento: ${aiData.event}
      Fecha: ${aiData.eventDate}
      Tipo de ramo: ${aiData.giftType}
      Estilo del mensaje: ${aiData.messageStyle}
    `;

    try {
      const res = await api.post("/ai/suggest/", { prompt });
      setText(res.data.text);
      setShowAIForm(false);
    } catch (err) {
      setShowAlert({ 
        isOpen: true, 
        title: "❌ Error", 
        message: "Error generando mensaje con IA. Intenta de nuevo.", 
        type: "danger" 
      });
    }

    setAiLoading(false);
  };

  // =========================================================
  // VIDEO DECORATION RENDERING
  // =========================================================
  const drawVideoWithDecoration = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Dibujar el video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Aplicar decoración según selección
    if (videoDecoration === "hearts") {
      // Corazones flotantes
      ctx.font = '40px Arial';
      const hearts = ['💕', '❤️', '💖', '💗', '💝'];
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(Date.now() / 1000 + i) * 0.3 + 0.5) * canvas.width;
        const y = ((Date.now() / 2000 + i * 0.2) % 1) * canvas.height;
        ctx.fillText(hearts[i % hearts.length], x, y);
      }
    } else if (videoDecoration === "stars") {
      // Estrellas brillantes
      ctx.font = '35px Arial';
      const stars = ['⭐', '✨', '🌟', '💫'];
      for (let i = 0; i < 6; i++) {
        const x = (Math.cos(Date.now() / 800 + i) * 0.3 + 0.5) * canvas.width;
        const y = ((Date.now() / 1500 + i * 0.15) % 1) * canvas.height;
        ctx.fillText(stars[i % stars.length], x, y);
      }
    } else if (videoDecoration === "flowers") {
      // Flores decorativas
      ctx.font = '38px Arial';
      const flowers = ['🌸', '🌺', '🌼', '🌻', '🌷'];
      for (let i = 0; i < 4; i++) {
        const x = (Math.sin(Date.now() / 1200 + i * 1.5) * 0.35 + 0.5) * canvas.width;
        const y = ((Date.now() / 1800 + i * 0.25) % 1) * canvas.height;
        ctx.fillText(flowers[i % flowers.length], x, y);
      }
    } else if (videoDecoration === "balloons") {
      // Globos flotando
      ctx.font = '42px Arial';
      const balloons = ['🎈', '🎉', '🎊', '🎁'];
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(Date.now() / 900 + i * 2) * 0.25 + 0.5) * canvas.width;
        const y = canvas.height - ((Date.now() / 1300 + i * 0.2) % 1) * canvas.height;
        ctx.fillText(balloons[i % balloons.length], x, y);
      }
    } else if (videoDecoration === "frame-gold") {
      // Marco dorado
      ctx.strokeStyle = 'gold';
      ctx.lineWidth = 20;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 5;
      ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
    } else if (videoDecoration === "frame-rose") {
      // Marco rosa con corazones en esquinas
      ctx.strokeStyle = '#FF1493';
      ctx.lineWidth = 15;
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
      ctx.font = '50px Arial';
      ctx.fillText('💖', 20, 60);
      ctx.fillText('💖', canvas.width - 70, 60);
      ctx.fillText('💖', 20, canvas.height - 20);
      ctx.fillText('💖', canvas.width - 70, canvas.height - 20);
    } else if (videoDecoration === "confetti") {
      // Confeti cayendo
      ctx.font = '25px Arial';
      const confetti = ['🎊', '🎉', '🎈', '✨', '💫'];
      for (let i = 0; i < 8; i++) {
        const x = (i * 0.125 + Math.sin(Date.now() / 500 + i) * 0.05) * canvas.width;
        const y = ((Date.now() / 1000 + i * 0.12) % 1) * canvas.height;
        ctx.fillText(confetti[i % confetti.length], x, y);
      }
    } else if (videoDecoration === "snow") {
      // Nieve cayendo
      ctx.font = '30px Arial';
      const snowflakes = ['❄️', '⛄', '🌨️'];
      for (let i = 0; i < 10; i++) {
        const x = (i * 0.1 + Math.sin(Date.now() / 700 + i) * 0.03) * canvas.width;
        const y = ((Date.now() / 1500 + i * 0.1) % 1) * canvas.height;
        ctx.fillText(snowflakes[i % snowflakes.length], x, y);
      }
    } else if (videoDecoration === "butterflies") {
      // Mariposas volando
      ctx.font = '35px Arial';
      const butterflies = ['🦋', '🦋', '🦋'];
      for (let i = 0; i < 4; i++) {
        const x = (Math.sin(Date.now() / 800 + i * 2) * 0.4 + 0.5) * canvas.width;
        const y = (Math.cos(Date.now() / 1000 + i) * 0.3 + 0.5) * canvas.height;
        ctx.fillText(butterflies[i % butterflies.length], x, y);
      }
    } else if (videoDecoration === "rainbow") {
      // Arcoíris y nubes
      ctx.font = '45px Arial';
      ctx.fillText('🌈', canvas.width * 0.1, canvas.height * 0.2);
      ctx.fillText('☁️', canvas.width * 0.7, canvas.height * 0.15);
      ctx.fillText('☁️', canvas.width * 0.2, canvas.height * 0.8);
      ctx.font = '30px Arial';
      const sparkles = ['✨', '💫'];
      for (let i = 0; i < 6; i++) {
        const x = (Math.sin(Date.now() / 600 + i * 1.5) * 0.3 + 0.5) * canvas.width;
        const y = (Math.cos(Date.now() / 800 + i) * 0.3 + 0.5) * canvas.height;
        ctx.fillText(sparkles[i % sparkles.length], x, y);
      }
    } else if (videoDecoration === "fire") {
      // Fuego y llamas
      ctx.font = '40px Arial';
      const fire = ['🔥', '🔥', '🔥', '💥', '⚡'];
      for (let i = 0; i < 6; i++) {
        const x = (i * 0.15 + Math.sin(Date.now() / 300 + i) * 0.05) * canvas.width;
        const y = canvas.height - ((Date.now() / 600 + i * 0.15) % 0.4) * canvas.height;
        ctx.fillText(fire[i % fire.length], x, y);
      }
    } else if (videoDecoration === "love") {
      // Amor intenso con besos y corazones
      ctx.font = '38px Arial';
      const love = ['💋', '💗', '💘', '💝', '💖', '💕'];
      for (let i = 0; i < 7; i++) {
        const x = (Math.sin(Date.now() / 900 + i * 1.2) * 0.35 + 0.5) * canvas.width;
        const y = (Math.cos(Date.now() / 1100 + i * 0.8) * 0.35 + 0.5) * canvas.height;
        ctx.fillText(love[i % love.length], x, y);
      }
    } else if (videoDecoration === "party") {
      // Fiesta total
      ctx.font = '35px Arial';
      const party = ['🎉', '🎊', '🥳', '🎈', '🎁', '🍾', '🎆'];
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(Date.now() / 500 + i) * 0.3 + 0.5) * canvas.width;
        const y = ((Date.now() / 1200 + i * 0.125) % 1) * canvas.height;
        ctx.fillText(party[i % party.length], x, y);
      }
    } else if (videoDecoration === "tropical") {
      // Tropical con frutas
      ctx.font = '40px Arial';
      const tropical = ['🌺', '🌴', '🥥', '🍹', '🦜', '🌊'];
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(Date.now() / 1000 + i * 1.8) * 0.3 + 0.5) * canvas.width;
        const y = (Math.cos(Date.now() / 1400 + i) * 0.3 + 0.5) * canvas.height;
        ctx.fillText(tropical[i % tropical.length], x, y);
      }
    } else if (videoDecoration === "music") {
      // Notas musicales
      ctx.font = '38px Arial';
      const music = ['🎵', '🎶', '🎸', '🎹', '🎤', '🎧'];
      for (let i = 0; i < 7; i++) {
        const x = (i * 0.14 + Math.sin(Date.now() / 700 + i) * 0.08) * canvas.width;
        const y = ((Date.now() / 1600 + i * 0.14) % 1) * canvas.height;
        ctx.fillText(music[i % music.length], x, y);
      }
    } else if (videoDecoration === "space") {
      // Espacio con planetas
      ctx.font = '40px Arial';
      const space = ['🌙', '⭐', '🪐', '🌟', '✨', '🚀', '🛸'];
      for (let i = 0; i < 6; i++) {
        const x = (Math.sin(Date.now() / 1500 + i * 2) * 0.35 + 0.5) * canvas.width;
        const y = (Math.cos(Date.now() / 2000 + i) * 0.35 + 0.5) * canvas.height;
        ctx.fillText(space[i % space.length], x, y);
      }
    } else if (videoDecoration === "halloween") {
      // Halloween terrorífico
      ctx.font = '38px Arial';
      const halloween = ['🎃', '👻', '🦇', '🕷️', '💀', '🕸️'];
      for (let i = 0; i < 6; i++) {
        const x = (Math.sin(Date.now() / 800 + i * 1.5) * 0.3 + 0.5) * canvas.width;
        const y = ((Date.now() / 1400 + i * 0.16) % 1) * canvas.height;
        ctx.fillText(halloween[i % halloween.length], x, y);
      }
    } else if (videoDecoration === "christmas") {
      // Navidad festiva
      ctx.font = '38px Arial';
      const christmas = ['🎄', '🎅', '🎁', '⛄', '🔔', '🌟'];
      for (let i = 0; i < 6; i++) {
        const x = (Math.sin(Date.now() / 1000 + i * 1.3) * 0.3 + 0.5) * canvas.width;
        const y = (Math.cos(Date.now() / 1300 + i * 0.9) * 0.3 + 0.5) * canvas.height;
        ctx.fillText(christmas[i % christmas.length], x, y);
      }
    } else if (videoDecoration === "food") {
      // Comida deliciosa
      ctx.font = '38px Arial';
      const food = ['🍕', '🍔', '🍰', '🍦', '🍩', '🍪', '🍓'];
      for (let i = 0; i < 6; i++) {
        const x = (Math.sin(Date.now() / 900 + i * 1.6) * 0.3 + 0.5) * canvas.width;
        const y = ((Date.now() / 1500 + i * 0.16) % 1) * canvas.height;
        ctx.fillText(food[i % food.length], x, y);
      }
    } else if (videoDecoration === "animals") {
      // Animales adorables
      ctx.font = '38px Arial';
      const animals = ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🦄'];
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(Date.now() / 1100 + i * 1.4) * 0.3 + 0.5) * canvas.width;
        const y = (Math.cos(Date.now() / 1500 + i) * 0.3 + 0.5) * canvas.height;
        ctx.fillText(animals[i % animals.length], x, y);
      }
    } else if (videoDecoration === "frame-purple") {
      // Marco morado con estrellas
      ctx.strokeStyle = '#9333EA';
      ctx.lineWidth = 18;
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
      ctx.font = '45px Arial';
      ctx.fillText('⭐', 25, 55);
      ctx.fillText('⭐', canvas.width - 65, 55);
      ctx.fillText('⭐', 25, canvas.height - 15);
      ctx.fillText('⭐', canvas.width - 65, canvas.height - 15);
    } else if (videoDecoration === "frame-rainbow") {
      // Marco arcoíris multicolor
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#FF0000');
      gradient.addColorStop(0.17, '#FF7F00');
      gradient.addColorStop(0.33, '#FFFF00');
      gradient.addColorStop(0.5, '#00FF00');
      gradient.addColorStop(0.67, '#0000FF');
      gradient.addColorStop(0.83, '#4B0082');
      gradient.addColorStop(1, '#9400D3');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 22;
      ctx.strokeRect(11, 11, canvas.width - 22, canvas.height - 22);
    } else if (videoDecoration === "vintage") {
      // Filtro vintage sepia
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = r * 0.393 + g * 0.769 + b * 0.189;
        data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
        data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
      }
      ctx.putImageData(imageData, 0, 0);
    } else if (videoDecoration === "blackwhite") {
      // Blanco y negro
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    
    animationFrameRef.current = requestAnimationFrame(drawVideoWithDecoration);
  };

  // =========================================================
  // VIDEO RECORDING
  // =========================================================
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Esperar a que el video esté listo y comenzar animación
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoDecoration !== "none") {
            drawVideoWithDecoration();
          }
        };
      }

      videoChunksRef.current = [];

      // Si hay decoración, grabar desde el canvas; si no, desde el video
      const recordStream = (videoDecoration !== "none" && canvasRef.current)
        ? canvasRef.current.captureStream(30)
        : stream;
      
      // Agregar audio del stream original
      if (videoDecoration !== "none" && canvasRef.current) {
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          recordStream.addTrack(audioTrack);
        }
      }

      const recorder = new MediaRecorder(recordStream);
      mediaRecorderVideo.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: "video/mp4" });
        setVideoPreview(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        // Detener el timer
        if (videoTimerRef.current) {
          clearInterval(videoTimerRef.current);
        }
      };

      recorder.start();
      setRecordingVideo(true);
      setVideoRecordingTime(0);
      
      // Iniciar contador de tiempo
      videoTimerRef.current = setInterval(() => {
        setVideoRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error cámara:", err);
    }
  };

  const stopVideoRecording = () => {
    setRecordingVideo(false);
    if (mediaRecorderVideo.current) {
      mediaRecorderVideo.current.stop();
    }
    if (videoTimerRef.current) {
      clearInterval(videoTimerRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // =========================================================
  // PREVIEW MODE
  // =========================================================
  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoDecoration !== "none") {
            drawVideoWithDecoration();
          }
        };
      }

      setPreviewMode(true);
    } catch (err) {
      console.error("Error cámara:", err);
      setShowAlert({ 
        isOpen: true, 
        title: "❌ Error de cámara", 
        message: "No se pudo acceder a la cámara. Verifica los permisos.", 
        type: "danger" 
      });
    }
  };

  const stopPreview = () => {
    setPreviewMode(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // =========================================================
  // AUDIO RECORDING
  // =========================================================
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const chunks = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderAudio.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioPreview(URL.createObjectURL(blob));
        setAudioChunks(chunks);
        stream.getTracks().forEach((t) => t.stop());
        // Detener el timer
        if (audioTimerRef.current) {
          clearInterval(audioTimerRef.current);
        }
      };

      recorder.start();
      setRecordingAudio(true);
      setAudioRecordingTime(0);
      
      // Iniciar contador de tiempo
      audioTimerRef.current = setInterval(() => {
        setAudioRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error micrófono:", err);
    }
  };

  const stopAudioRecording = () => {
    setRecordingAudio(false);
    if (mediaRecorderAudio.current) {
      mediaRecorderAudio.current.stop();
    }
    if (audioTimerRef.current) {
      clearInterval(audioTimerRef.current);
    }
  };

  // =========================================================
  // SUBMIT MESSAGE
  // =========================================================
  const handleSubmit = async () => {
    if (!buyerEmail || emailError) {
      setShowAlert({ 
        isOpen: true, 
        title: "⚠️ Email requerido", 
        message: "El email es obligatorio y debe ser válido.", 
        type: "danger" 
      });
      return;
    }

    const formData = new FormData();
    formData.append("code", fullCode);
    formData.append("text", text);
    formData.append("buyer_email", buyerEmail);
    formData.append("notify_on_read", notifyOnRead ? "true" : "false");
    formData.append("duration_days", durationDays);
    formData.append("max_views", maxViews);

    if (videoChunksRef.current.length > 0) {
      const videoBlob = new Blob(videoChunksRef.current, { type: "video/mp4" });
      formData.append("video", videoBlob, "mensaje.mp4");
    }

    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      formData.append("audio", audioBlob, "mensaje.webm");
    }

    try {
      // Si estamos editando un mensaje existente, usar PUT; si no, usar POST
      if (existingMessage) {
        await api.put(`/message/${fullCode}/update/`, formData);
        setToast({ isOpen: true, message: "✅ Mensaje actualizado correctamente", type: "success" });
        setTimeout(() => navigate(`/message-sent/${fullCode}`), 1500);
      } else {
        await api.post("/activate/", formData);
        navigate(`/message-sent/${fullCode}`);
      }
    } catch (err) {
      console.error("Error guardando mensaje:", err);
      setShowAlert({ 
        isOpen: true, 
        title: "❌ Error", 
        message: existingMessage ? "Error actualizando mensaje" : "Error enviando mensaje", 
        type: "danger" 
      });
    }
  };

  // =========================================================
  // JSX
  // =========================================================
  const backgroundStyle = theme.backgroundImage 
    ? {
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  const bgClass = theme.backgroundImage ? '' : theme.background;

  // Mostrar loading mientras valida
  if (validating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Validando código...</p>
        </div>
      </div>
    );
  }

  // Si no está validado, no mostrar nada (ya redirigió)
  if (!codeValidated) {
    return null;
  }

  // Debug: ver estados actuales
  console.log("🔍 RENDER CreateMessage - messageExists:", messageExists, "existingMessage:", existingMessage, "validating:", validating);

  // Función para borrar mensaje
  const handleDeleteMessage = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/message/${code}/delete/`);
      setToast({ isOpen: true, message: "✅ Mensaje borrado exitosamente", type: "success" });
      setMessageExists(false);
      setExistingMessage(null);
    } catch (err) {
      console.error("Error borrando mensaje:", err);
      setToast({ isOpen: true, message: "Error al borrar el mensaje. Intenta de nuevo.", type: "error" });
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} p-6 flex justify-center items-center relative overflow-hidden`} style={backgroundStyle}>
      {isEditMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-800 shadow-lg">
          <span className="font-bold">Modo edición</span>
          <span className="ml-2 text-sm">Estás editando el mensaje de código {code}</span>
        </div>
      )}
      {/* Overlay si hay imagen de fondo */}
      {theme.backgroundImage && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      )}

      {/* Fondo animado con burbujas - solo si no hay imagen */}
      {!theme.backgroundImage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 h-64 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full opacity-20 blur-3xl animate-float-slow -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-gradient-to-br from-purple-300 to-blue-400 rounded-full opacity-15 blur-3xl animate-float-medium top-1/3 -right-32"></div>
          <div className="absolute w-80 h-80 bg-gradient-to-br from-rose-400 to-orange-300 rounded-full opacity-10 blur-3xl animate-float-fast bottom-0 left-1/4"></div>
        </div>
      )}

      <div className={`${theme.card} shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-3xl p-4 sm:p-6 md:p-8 relative z-10 animate-fade-in-up border border-gray-100`}>

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h1 className={`text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient`}>
            {messageExists ? "📝 Mensaje existente" : "✨ Crear mensaje"}
          </h1>
          <Link to="/instrucciones/crear" className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-300 text-sm font-medium">📖 Ver instrucciones</Link>
        </div>

        {/* SI YA EXISTE UN MENSAJE */}
        {messageExists && existingMessage && !existingMessage.expired_edit && (
          <div className="space-y-6">
            {/* Código */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-inner">
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <span className="text-2xl">🎫</span>
                Código del mensaje
              </label>
              <div className="mt-2 flex items-center gap-2 justify-center">
                <input value={codePart1} readOnly className="w-24 p-3 border-2 border-gray-300 rounded-xl text-center uppercase bg-white cursor-not-allowed font-bold text-lg shadow-sm" />
                <span className="text-gray-400 text-xl font-bold">-</span>
                <input value={codePart2} readOnly className="w-16 p-3 border-2 border-gray-300 rounded-xl text-center bg-white cursor-not-allowed font-bold text-lg shadow-sm" />
                <span className="text-gray-400 text-xl font-bold">-</span>
                <input value={codePart3} readOnly className="w-16 p-3 border-2 border-gray-300 rounded-xl text-center bg-white cursor-not-allowed font-bold text-lg shadow-sm" />
                <span className="text-gray-400 text-xl font-bold">-</span>
                <input value={codePart4} readOnly className="w-20 p-3 border-2 border-gray-300 rounded-xl text-center uppercase bg-white cursor-not-allowed font-bold text-lg shadow-sm" />
              </div>
            </div>

            {/* Alerta de mensaje existente */}
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <span className="text-5xl">ℹ️</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">¡Ya existe un mensaje para este código!</h3>
                  <p className="text-blue-700 mb-4">
                    Este código ya tiene un mensaje asociado. Puedes editarlo para modificar su contenido o borrarlo para crear uno nuevo.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-inner">
                    <p className="text-gray-700 text-sm mb-2"><strong>Vista previa del mensaje:</strong></p>
                    <p className="text-gray-600 italic line-clamp-3">{existingMessage.text || "Sin texto"}</p>
                    {existingMessage.video && <p className="text-sm text-green-600 mt-2">📹 Incluye video</p>}
                    {existingMessage.audio && <p className="text-sm text-blue-600 mt-1">🎤 Incluye audio</p>}
                  </div>
                  
                  {/* Información de fechas y caducidad */}
                  <div className="space-y-2">
                    {/* Fecha de creación */}
                    <div className="flex items-center gap-2 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
                      <span className="text-lg">📅</span>
                      <div className="flex-1">
                        <strong>Fecha de creación:</strong>{' '}
                        {new Date(existingMessage.created_at).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    {/* Última modificación */}
                    {existingMessage.updated_at && existingMessage.updated_at !== existingMessage.created_at && (
                      <div className="flex items-center gap-2 text-sm bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <span className="text-lg">🔄</span>
                        <div className="flex-1">
                          <strong>Última modificación:</strong>{' '}
                          {new Date(existingMessage.updated_at).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Tiempo restante para caducidad */}
                    <div className="flex items-center gap-2 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <span className="text-lg">⏰</span>
                      <div className="flex-1">
                        {(() => {
                          const createdDate = new Date(existingMessage.created_at);
                          const expiryDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                          const now = new Date();
                          const timeLeft = expiryDate - now;
                          const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                          const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          
                          return (
                            <>
                              <strong>Tiempo restante para editar:</strong>{' '}
                              {daysLeft > 0 ? (
                                <span className="text-green-700 font-bold">
                                  {daysLeft} día{daysLeft !== 1 ? 's' : ''} y {hoursLeft} hora{hoursLeft !== 1 ? 's' : ''}
                                </span>
                              ) : hoursLeft > 0 ? (
                                <span className="text-orange-700 font-bold">
                                  {hoursLeft} hora{hoursLeft !== 1 ? 's' : ''} (¡Último día!)
                                </span>
                              ) : (
                                <span className="text-red-700 font-bold">Menos de 1 hora</span>
                              )}
                              <div className="text-xs text-gray-600 mt-1">
                                Caduca el {expiryDate.toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => {
                  // Cargar datos existentes para editar
                  setText(existingMessage.text || "");
                  setBuyerEmail(existingMessage.buyer_email || "");
                  if (existingMessage.video) {
                    setVideoPreview(`${import.meta.env.VITE_API_URL}${existingMessage.video}`);
                  }
                  if (existingMessage.audio) {
                    setAudioPreview(`${import.meta.env.VITE_API_URL}${existingMessage.audio}`);
                  }
                  setMessageExists(false);
                }}
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span className="text-2xl">✏️</span>
                Editar mensaje
              </button>
              
              <button
                onClick={handleDeleteMessage}
                className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span className="text-2xl">🗑️</span>
                Borrar mensaje
              </button>
            </div>

            {/* Botón cancelar */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl text-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              ← Volver al inicio
            </button>
          </div>
        )}

        {/* MENSAJE DE PERIODO CADUCADO */}
        {!messageExists && existingMessage && existingMessage.expired_edit && (
          <div className="space-y-6">
            {/* Código */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-inner">
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <span className="text-2xl">🎫</span>
                Código del mensaje
              </label>
              <div className="mt-2 flex items-center gap-2 justify-center">
                <input value={codePart1} readOnly className="w-24 p-3 border-2 border-gray-300 rounded-xl text-center uppercase bg-white cursor-not-allowed font-bold text-lg shadow-sm" />
                <span className="text-gray-400 text-xl font-bold">-</span>
                <input value={codePart2} readOnly className="w-16 p-3 border-2 border-gray-300 rounded-xl text-center bg-white cursor-not-allowed font-bold text-lg shadow-sm" />
                <span className="text-gray-400 text-xl font-bold">-</span>
                <input value={codePart3} readOnly className="w-16 p-3 border-2 border-gray-300 rounded-xl text-center bg-white cursor-not-allowed font-bold text-lg shadow-sm" />
                <span className="text-gray-400 text-xl font-bold">-</span>
                <input value={codePart4} readOnly className="w-20 p-3 border-2 border-gray-300 rounded-xl text-center uppercase bg-white cursor-not-allowed font-bold text-lg shadow-sm" />
              </div>
            </div>

            {/* Alerta de periodo caducado */}
            <div className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-400 rounded-2xl p-6 shadow-lg animate-shake">
              <div className="flex items-start gap-4">
                <span className="text-5xl">⏰</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-800 mb-2">⚠️ Período de modificación caducado</h3>
                  <p className="text-red-700 mb-4">
                    Este mensaje fue creado hace más de 7 días y el período de edición ha expirado. 
                    Por seguridad y para proteger los mensajes enviados, no es posible realizar modificaciones después de este tiempo.
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-inner">
                    <p className="text-gray-700 text-sm mb-2"><strong>Información del mensaje:</strong></p>
                    <p className="text-gray-600">
                      <strong>Fecha de creación:</strong> {new Date(existingMessage.created_at).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Período de edición:</strong> Hasta {new Date(new Date(existingMessage.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                    <span className="text-lg">💡</span>
                    <span>
                      El mensaje sigue activo y puede ser visualizado por el destinatario. Solo no es posible editarlo o borrarlo.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón para ver el mensaje */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => navigate(`/message/${code}`)}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
              >
                <span className="text-2xl">👁️</span>
                Ver mensaje
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
              >
                <span className="text-2xl">🏠</span>
                Volver al inicio
              </button>
            </div>
          </div>
        )}

        {/* FORMULARIO NORMAL (cuando no existe mensaje o se clickeó editar) */}
        {/* Mostrar banner también cuando se edita (messageExists true) pero en edición usamos misma sección de formulario */}
        {(!messageExists || isEditMode) && !existingMessage?.expired_edit && (
          <>
        

        {/* CODE 4 INPUTS - READ ONLY SI MODO EDICION O MENSAJE EXISTE */}
        <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-inner">
          <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <span className="text-2xl">🎫</span>
            Código del mensaje
          </label>
          <div className="mt-2 flex items-center gap-2 justify-center">
            <input id="codePart1" value={codePart1} readOnly={true} className="w-24 p-3 border-2 border-gray-300 rounded-xl text-center uppercase bg-white cursor-not-allowed font-bold text-lg shadow-sm" placeholder="NTSF" />
            <span className="text-gray-400 text-xl font-bold">-</span>
            <input id="codePart2" value={codePart2} readOnly={true} className="w-16 p-3 border-2 border-gray-300 rounded-xl text-center bg-white cursor-not-allowed font-bold text-lg shadow-sm" placeholder="001" />
            <span className="text-gray-400 text-xl font-bold">-</span>
            <input id="codePart3" value={codePart3} readOnly={true} className="w-16 p-3 border-2 border-gray-300 rounded-xl text-center bg-white cursor-not-allowed font-bold text-lg shadow-sm" placeholder="001" />
            <span className="text-gray-400 text-xl font-bold">-</span>
            <input id="codePart4" value={codePart4} readOnly={true} className="w-20 p-3 border-2 border-gray-300 rounded-xl text-center uppercase bg-white cursor-not-allowed font-bold text-lg shadow-sm" placeholder="ABC" />
          </div>
          <p className="mt-3 text-sm text-gray-500 text-center">{isEditMode || messageExists ? '🔒 Código bloqueado en modo edición' : '🔒 Código asignado (no editable)'}</p>
        </div>

        {/* EMAIL */}
        <label className={`font-semibold ${theme.primaryText} flex items-center gap-2 mb-2`}>
          <span className="text-xl">📧</span>
          Email del comprador *
        </label>

        <input
          type="email"
          className={`w-full p-4 border-2 rounded-xl mb-1 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${emailError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-rose-500"}`}
          placeholder="tuemail@gmail.com"
          value={buyerEmail}
          onChange={(e) => {
            const value = e.target.value;
            setBuyerEmail(value);

            if (!value) {
              setEmailError("El email es obligatorio.");
              return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              setEmailError("Formato inválido.");
              return;
            }

            setEmailError("");
          }}
        />

        {emailError && (
          <p className="text-red-500 text-sm mb-3 animate-shake">⚠️ {emailError}</p>
        )}

        {/* TEXT AREA */}
        <div className="mb-6 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl sm:rounded-2xl border-2 border-rose-200 shadow-md hover:shadow-lg transition-all duration-300">
          <label className="font-semibold text-gray-800 flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl">
            <span className="text-2xl sm:text-3xl">💬</span>
            Tu mensaje
          </label>
          <textarea
            className="w-full min-h-40 sm:min-h-60 md:min-h-80 p-3 sm:p-4 md:p-6 border-2 border-gray-300 rounded-lg sm:rounded-xl transition-all duration-300 focus:border-rose-500 focus:shadow-xl focus:scale-[1.01] resize-vertical text-base sm:text-lg leading-relaxed bg-white"
            placeholder="Escribe aquí tu mensaje especial..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 flex items-center gap-2">
            <span>💡</span>
            <span>Expresa tus sentimientos, este mensaje será único y especial</span>
          </p>
        </div>

        {/* AI BUTTON */}
        <button
          type="button"
          onClick={() => {
            console.log("Abriendo formulario IA");
            setShowAIForm(true);
          }}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl mb-6 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse-slow w-full"
        >
          ✨ Crear mensaje con IA
        </button>

        {/* VIDEO BLOCK */}
        <div className="border-2 border-gray-200 p-6 rounded-2xl mb-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🎥</span>
            Video
          </h2>

          {/* Selector de decoración */}
          <div className="mb-4">
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <span className="text-xl">🎨</span>
              Decoración del video
            </label>
            <select
              value={videoDecoration}
              onChange={(e) => setVideoDecoration(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              disabled={recordingVideo}
            >
              <option value="none">✨ Sin decoración</option>
              <optgroup label="❤️ Emociones">
                <option value="hearts">💕 Corazones flotantes</option>
                <option value="love">💋 Amor intenso</option>
              </optgroup>
              <optgroup label="🎉 Celebraciones">
                <option value="balloons">🎈 Globos festivos</option>
                <option value="party">🥳 Fiesta total</option>
                <option value="confetti">🎊 Confeti cayendo</option>
              </optgroup>
              <optgroup label="🌸 Naturaleza">
                <option value="flowers">🌸 Flores decorativas</option>
                <option value="butterflies">🦋 Mariposas volando</option>
                <option value="tropical">🌺 Tropical</option>
                <option value="snow">❄️ Nieve cayendo</option>
              </optgroup>
              <optgroup label="✨ Magia y Fantasía">
                <option value="stars">⭐ Estrellas brillantes</option>
                <option value="rainbow">🌈 Arcoíris mágico</option>
                <option value="space">🚀 Espacio sideral</option>
              </optgroup>
              <optgroup label="🔥 Energía">
                <option value="fire">🔥 Fuego y llamas</option>
                <option value="music">🎵 Notas musicales</option>
              </optgroup>
              <optgroup label="🎃 Temáticas">
                <option value="halloween">🎃 Halloween</option>
                <option value="christmas">🎄 Navidad</option>
              </optgroup>
              <optgroup label="😊 Diversión">
                <option value="food">🍕 Comida deliciosa</option>
                <option value="animals">🐶 Animales adorables</option>
              </optgroup>
              <optgroup label="🖼️ Marcos">
                <option value="frame-gold">👑 Marco dorado</option>
                <option value="frame-rose">💖 Marco rosa</option>
                <option value="frame-purple">💜 Marco morado</option>
                <option value="frame-rainbow">🌈 Marco arcoíris</option>
              </optgroup>
              <optgroup label="🎨 Filtros">
                <option value="vintage">📷 Vintage sepia</option>
                <option value="blackwhite">⚫⚪ Blanco y negro</option>
              </optgroup>
            </select>
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
              <span>💡</span>
              <span>Elige una decoración y haz clic en "Ver preview" para probarla</span>
            </p>
          </div>

          {/* Contenedor del video con canvas superpuesto */}
          <div className="relative w-full mb-3">
            <video
              ref={videoRef}
              className="w-full rounded-xl bg-black"
              autoPlay
              muted
              playsInline
              style={{ display: videoDecoration === "none" ? "block" : "none" }}
            ></video>
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl bg-black"
              style={{ display: videoDecoration !== "none" ? "block" : "none" }}
            ></canvas>
          </div>

          {videoPreview && (
            <video src={videoPreview} controls className="w-full rounded-xl mt-3" />
          )}

          {recordingVideo && (
            <div className="bg-red-100 border-2 border-red-400 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
              <span className="text-red-600 text-3xl animate-pulse">⏺</span>
              <span className="text-2xl font-bold text-red-700 font-mono">{formatTime(videoRecordingTime)}</span>
            </div>
          )}

          <div className="flex gap-3">
            {!previewMode && !recordingVideo && !videoPreview && (
              <button
                onClick={startPreview}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                👁️ Ver preview
              </button>
            )}

            {previewMode && !recordingVideo && (
              <button
                onClick={stopPreview}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                ❌ Cerrar preview
              </button>
            )}

            {!recordingVideo && !videoPreview && (
              <button
                onClick={startVideoRecording}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                🔴 Grabar Video
              </button>
            )}

            {recordingVideo && (
              <button
                onClick={stopVideoRecording}
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold animate-pulse shadow-lg"
              >
                ⏹ Detener grabación
              </button>
            )}

            {videoPreview && !recordingVideo && (
              <button
                onClick={() => {
                  setVideoPreview(null);
                  videoChunksRef.current = [];
                }}
                className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                🔄 Grabar de nuevo
              </button>
            )}
          </div>
        </div>

        {/* AUDIO BLOCK */}
        <div className="border-2 border-gray-200 p-6 rounded-2xl mb-6 bg-gradient-to-br from-green-50 to-teal-50 shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🎤</span>
            Audio
          </h2>

          {audioPreview && (
            <audio controls src={audioPreview} className="w-full mb-3"></audio>
          )}

          {recordingAudio && (
            <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-4 mb-3 flex items-center justify-center gap-3">
              <span className="text-blue-600 text-3xl animate-pulse">⏺</span>
              <span className="text-2xl font-bold text-blue-700 font-mono">{formatTime(audioRecordingTime)}</span>
            </div>
          )}

          {!recordingAudio ? (
            <button
              onClick={startAudioRecording}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              🎙️ Grabar Audio
            </button>
          ) : (
            <button
              onClick={stopAudioRecording}
              className="bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold animate-pulse shadow-lg"
            >
              ⏹ Detener
            </button>
          )}
        </div>

        {/* SUBMIT */}
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 py-4 rounded-xl text-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            ← Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!buyerEmail || emailError}
            className={`flex-1 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-bold transition-all duration-300 shadow-lg ${
              !buyerEmail || emailError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white hover:scale-105 hover:shadow-xl"
            }`}
          >
            ✨ Guardar Mensaje →
          </button>
        </div>
        </>
        )}
      </div>

      {/* ANIMACIONES CSS */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -40px) scale(1.1); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-float-slow { animation: float-slow 20s infinite ease-in-out; }
        .animate-float-medium { animation: float-medium 15s infinite ease-in-out; }
        .animate-float-fast { animation: float-fast 10s infinite ease-in-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
      `}</style>

      {/* IA MODAL */}
      {showAIForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl relative z-60 animate-fade-in-up">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">💜 Generar mensaje con IA</h2>

            <input
              name="buyerName"
              className="w-full p-2 sm:p-3 border rounded-lg sm:rounded-xl mb-2 sm:mb-3 text-sm sm:text-base"
              placeholder="Nombre del comprador"
              onChange={handleAIChange}
            />

            <input
              name="recipientName"
              className="w-full p-3 border rounded mb-3"
              placeholder="Nombre del destinatario"
              onChange={handleAIChange}
            />

            <select
              name="recipientGender"
              className="w-full p-3 border rounded mb-3"
              onChange={handleAIChange}
            >
              <option value="">Género</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="sin genero">Prefiero no decirlo</option>
            </select>

            <select
              name="event"
              className="w-full p-3 border rounded mb-3"
              onChange={handleAIChange}
            >
              <option value="">Evento</option>
              <option value="cumpleaños">Cumpleaños</option>
              <option value="aniversario">Aniversario</option>
              <option value="santo">Santo</option>
              <option value="graduación">Graduación</option>
              <option value="boda">Boda</option>
              <option value="compromiso">Compromiso</option>
              <option value="bautizo">Bautizo</option>
              <option value="primera comunión">Primera Comunión</option>
              <option value="jubilación">Jubilación</option>
            </select>

            <input
              name="eventDate"
              type="date"
              className="w-full p-3 border rounded mb-3"
              onChange={handleAIChange}
            />

            <select
              name="giftType"
              className="w-full p-3 border rounded mb-3"
              onChange={handleAIChange}
            >
              <option value="">Tipo de ramo</option>
              <option value="bombones">Bombones</option>
              <option value="caramelos">Caramelos</option>
              <option value="jabones">Jabones</option>
              <option value="crochet">Crochet</option>
              <option value="cervezas">Cervezas</option>
              <option value="cava">Cava</option>
            </select>

            <select
              name="messageStyle"
              className="w-full p-3 border rounded-xl mb-3 font-semibold bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              onChange={handleAIChange}
              value={aiData.messageStyle}
            >
              <option value="">✨ Estilo del mensaje</option>
              <option value="romántico">💕 Romántico</option>
              <option value="formal">🎩 Formal</option>
              <option value="amigable">😊 Amigable</option>
              <option value="sexy">🔥 Sexy</option>
              <option value="divertido">🎉 Divertido</option>
              <option value="emotivo">😢 Emotivo</option>
              <option value="inspirador">✨ Inspirador</option>
              <option value="cariñoso">🥰 Cariñoso</option>
              <option value="humorístico">😂 Humorístico</option>
            </select>

            {aiLoading && (
              <div className="text-center py-3 text-purple-600 font-semibold animate-pulse">
                💭 Estoy pensando qué escribir... un momento por favor 🌸
              </div>
            )}

            <button
              onClick={generateAIText}
              disabled={aiLoading}
              className={`w-full py-2 rounded-xl mb-3 text-white ${
                aiLoading
                  ? "bg-purple-300"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {aiLoading ? "Generando..." : "💜 Generar mensaje"}
            </button>

            <button
              onClick={() => setShowAIForm(false)}
              disabled={aiLoading}
              className="w-full bg-gray-300 py-2 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación para borrar */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="¿Borrar mensaje?"
        message={`¿Estás seguro de que quieres borrar este mensaje?\n\nEsta acción no se puede deshacer.`}
        confirmText="Sí, borrar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de alerta/info */}
      <ConfirmModal
        isOpen={showAlert.isOpen}
        onClose={() => setShowAlert({ ...showAlert, isOpen: false })}
        onConfirm={() => setShowAlert({ ...showAlert, isOpen: false })}
        title={showAlert.title}
        message={showAlert.message}
        confirmText="Entendido"
        cancelText=""
        type={showAlert.type}
      />

      {/* Toast para notificaciones rápidas */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
