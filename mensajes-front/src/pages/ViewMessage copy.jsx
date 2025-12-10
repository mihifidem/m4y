import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateMessage() {
  const { code } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // FORM STATES
  // =========================================================
  const [text, setText] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [notifyOnRead, setNotifyOnRead] = useState(false);
  const [maxViews, setMaxViews] = useState(50);
  const [durationDays, setDurationDays] = useState(30);

  const [messageStyle, setMessageStyle] = useState("");

  // Preguntas IA
  const [aiData, setAiData] = useState({
    buyerName: "",
    recipientName: "",
    recipientGender: "",
    event: "",
    eventDate: "",
    giftType: "",
    mood: "",
  });

  // =========================================================
  // VIDEO STATES
  // =========================================================
  const videoRef = useRef(null);
  const mediaRecorderVideo = useRef(null);
  const videoChunksRef = useRef([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [recordingVideo, setRecordingVideo] = useState(false);

  // =========================================================
  // AUDIO STATES
  // =========================================================
  const mediaRecorderAudio = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioPreview, setAudioPreview] = useState(null);
  const [recordingAudio, setRecordingAudio] = useState(false);

  // =========================================================
  // IA STATES
  // =========================================================
  const [showAIForm, setShowAIForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIChange = (e) => {
    setAiData({ ...aiData, [e.target.name]: e.target.value });
  };

  // =========================================================
  // AI — GENERATE
  // =========================================================
  const generateAIText = async () => {
    setAiLoading(true);

    const prompt = `
      Genera un mensaje ORIGINAL con el siguiente estilo: ${aiData.mood}.
      Comprador: ${aiData.buyerName}
      Destinatario: ${aiData.recipientName}
      Género: ${aiData.recipientGender}
      Evento: ${aiData.event}
      Fecha: ${aiData.eventDate}
      Tipo de ramo: ${aiData.giftType}
    `;

    try {
      const res = await api.post("/ai/suggest/", { prompt });
      setText(res.data.text);
      setShowAIForm(false);
    } catch (err) {
      alert("Error generando mensaje");
    }

    setAiLoading(false);
  };

  // =========================================================
  // RECORDING FUNCTIONS
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
      }

      videoChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderVideo.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) videoChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: "video/mp4" });
        setVideoPreview(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setRecordingVideo(true);
    } catch (err) {
      console.error("Error cámara:", err);
    }
  };

  const stopVideoRecording = () => {
    setRecordingVideo(false);
    if (mediaRecorderVideo.current) mediaRecorderVideo.current.stop();
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioChunks([]);

      const recorder = new MediaRecorder(stream);
      mediaRecorderAudio.current = recorder;

      recorder.ondataavailable = (e) =>
        setAudioChunks((prev) => [...prev, e.data]);

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/mp3" });
        setAudioPreview(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setRecordingAudio(true);
    } catch (err) {
      console.error("Error micrófono:", err);
    }
  };

  const stopAudioRecording = () => {
    setRecordingAudio(false);
    if (mediaRecorderAudio.current) mediaRecorderAudio.current.stop();
  };

  // =========================================================
  // SUBMIT MESSAGE
  // =========================================================
  const handleSubmit = async () => {
    if (!buyerEmail || emailError) {
      alert("El email es obligatorio y debe ser válido.");
      return;
    }

    const formData = new FormData();

    formData.append("code", code);
    formData.append("text", text);
    formData.append("buyer_email", buyerEmail);

    formData.append("notify_on_read", notifyOnRead ? "true" : "false");
    formData.append("duration_days", durationDays);
    formData.append("max_views", maxViews);

    formData.append("buyer_name", aiData.buyerName);
    formData.append("recipient_name", aiData.recipientName);
    formData.append("recipient_gender", aiData.recipientGender);
    formData.append("gift_type", aiData.giftType);
    formData.append("event_type", aiData.event);
    formData.append("activation_datetime", aiData.eventDate);

    if (videoChunksRef.current.length > 0) {
      const videoBlob = new Blob(videoChunksRef.current, { type: "video/mp4" });
      formData.append("video", videoBlob, "mensaje.mp4");
    }

    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      formData.append("audio", audioBlob, "mensaje.mp3");
    }

    try {
      await api.post("/activate/", formData);
      navigate(`/message-sent/${code}`);
    } catch (err) {
      alert("Error enviando mensaje");
    }
  };

  // =========================================================
  // JSX PREMIUM B
  // =========================================================
  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden bg-gradient-to-br from-[#1a1f2b] to-[#111827]">

      {/* ONDAS ANIMADAS BACKGROUND */}
      <div className="absolute inset-0 opacity-40">
        <div className="wave"></div>
        <div className="wave delay-1"></div>
        <div className="wave delay-2"></div>
      </div>

      {/* PARTICULAS */}
      <div className="absolute inset-0 pointer-events-none stars"></div>

      <div className="relative w-full max-w-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 animate-fadeDrop">

        <h1 className="text-4xl font-bold text-pink-400 mb-6 text-center tracking-wide drop-shadow-xl">
          ✨ Crear mensaje para {code}
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          className="glass-input"
          placeholder="Email del comprador *"
          value={buyerEmail}
          onChange={(e) => {
            const v = e.target.value;
            setBuyerEmail(v);

            if (!v) return setEmailError("Campo obligatorio");
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
              return setEmailError("Formato inválido");

            setEmailError("");
          }}
        />

        {emailError && <p className="text-red-400 text-sm">{emailError}</p>}

        {/* TEXT */}
        <textarea
          className="glass-input min-h-32"
          placeholder="Escribe tu mensaje..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={() => setShowAIForm(true)}
          className="neon-btn w-full mt-4"
        >
          🤖 Crear mensaje con IA
        </button>

        {/* VIDEO */}
        <div className="glass-box mt-8">
          <h2 className="section-title">🎥 Video</h2>

          <video
            ref={videoRef}
            className="rounded-xl w-full bg-black/60 border border-pink-500/30 shadow-lg"
            autoPlay
            muted
            playsInline
          ></video>

          {videoPreview && (
            <video src={videoPreview} controls className="w-full rounded-xl mt-4" />
          )}

          {!recordingVideo ? (
            <button onClick={startVideoRecording} className="neon-btn mt-4">
              🎬 Grabar Video
            </button>
          ) : (
            <button onClick={stopVideoRecording} className="neon-btn-red mt-4">
              ⏹ Detener
            </button>
          )}
        </div>

        {/* AUDIO */}
        <div className="glass-box mt-8">
          <h2 className="section-title">🎤 Audio</h2>

          {audioPreview && (
            <audio controls src={audioPreview} className="w-full mb-4"></audio>
          )}

          {!recordingAudio ? (
            <button onClick={startAudioRecording} className="neon-btn-blue">
              🎙️ Grabar Audio
            </button>
          ) : (
            <button onClick={stopAudioRecording} className="neon-btn-red">
              ⏹ Detener
            </button>
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={!buyerEmail || emailError}
          className="neon-submit-btn mt-10"
        >
          💖 Guardar Mensaje
        </button>
      </div>

      {/* ESTILOS PREMIUM */}
      <style>{`
        .glass-input {
          width: 100%;
          padding: 14px;
          margin-bottom: 15px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 15px;
          color: white;
          outline: none;
          font-size: 1.1rem;
        }

        .glass-box {
          padding: 20px;
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
        }

        .neon-btn {
          background: linear-gradient(90deg, #ff4ecd, #7f5eff);
          padding: 14px 20px;
          border-radius: 15px;
          color: white;
          font-weight: bold;
          text-align: center;
          width: 100%;
          box-shadow: 0 0 15px #ff4ecd88;
        }

        .neon-btn-blue {
          background: linear-gradient(90deg, #4ed0ff, #5a78ff);
          padding: 14px;
          border-radius: 15px;
          width: 100%;
          color: white;
          box-shadow: 0 0 15px #4ed0ff99;
        }

        .neon-btn-red {
          background: linear-gradient(90deg, #ff4e6e, #ff2d2d);
          padding: 14px;
          border-radius: 15px;
          width: 100%;
          color: white;
          box-shadow: 0 0 20px #ff4e6e99;
        }

        .neon-submit-btn {
          width: 100%;
          padding: 16px;
          font-size: 1.3rem;
          background: linear-gradient(90deg, #ff4ecd, #7f5eff, #4ed0ff);
          background-size: 300%;
          animation: gradientShift 4s linear infinite;
          color: white;
          font-weight: 700;
          border-radius: 18px;
          box-shadow: 0 0 25px #ff4ecd88;
        }

        @keyframes gradientShift {
          0% { background-position: 0% }
          100% { background-position: 100% }
        }

        .section-title {
          color: #ffbdf7;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .animate-fadeDrop {
          animation: fadeDrop 0.8s ease-out forwards;
        }
        @keyframes fadeDrop {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stars {
          background-image: url('https://i.imgur.com/4NJl7zS.png');
          background-size: cover;
          opacity: 0.25;
        }

        /* BACKGROUND WAVES */
        .wave {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, #ff4ecd33, transparent 70%);
          animation: waveAnim 10s infinite linear;
        }
        .delay-1 { animation-delay: -3s; }
        .delay-2 { animation-delay: -6s; }

        @keyframes waveAnim {
          from { transform: translate(-30%, -30%) rotate(0deg); }
          to { transform: translate(-30%, -30%) rotate(360deg); }
        }
      `}</style>

      {/* =====================================================
          IA MODAL
      ===================================================== */}
      {showAIForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl animate-fadeDrop">

            <h2 className="text-2xl font-bold text-pink-300 mb-4 text-center">
              💜 Mensaje con IA
            </h2>

            <input name="buyerName" placeholder="Nombre comprador" className="glass-input" onChange={handleAIChange} />
            <input name="recipientName" placeholder="Nombre destinatario" className="glass-input" onChange={handleAIChange} />

            <select name="recipientGender" className="glass-input" onChange={handleAIChange}>
              <option value="">Género</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="sin genero">Prefiero no decirlo</option>
            </select>

            <select name="event" className="glass-input" onChange={handleAIChange}>
              <option value="">Evento</option>
              <option value="cumpleaños">Cumpleaños</option>
              <option value="aniversario">Aniversario</option>
              <option value="graduación">Graduación</option>
              <option value="boda">Boda</option>
            </select>

            <input name="eventDate" type="date" className="glass-input" onChange={handleAIChange} />

            <input name="giftType" placeholder="Tipo de ramo" className="glass-input" onChange={handleAIChange} />

            {/* NUEVO: Estilo del mensaje */}
            <select name="mood" className="glass-input" onChange={handleAIChange}>
              <option value="">Estilo del mensaje</option>
              <option value="romántico">Romántico</option>
              <option value="divertido">Divertido</option>
              <option value="sexy">Sexy</option>
              <option value="profundo">Profundo</option>
              <option value="poético">Poético</option>
              <option value="formal elegante">Formal elegante</option>
            </select>

            {aiLoading && (
              <p className="text-center text-pink-300 mt-3 animate-pulse">
                💭 Generando mensaje...
              </p>
            )}

            <button onClick={generateAIText} className="neon-btn mt-4">
              🎨 Generar con IA
            </button>

            <button onClick={() => setShowAIForm(false)} className="neon-btn-red mt-3">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
