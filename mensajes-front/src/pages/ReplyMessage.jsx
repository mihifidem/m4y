import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ReplyMessage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");

  // VIDEO
  const videoRef = useRef(null);
  const mediaRecorderVideo = useRef(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [recordingVideo, setRecordingVideo] = useState(false);

  // AUDIO
  const mediaRecorderAudio = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioPreview, setAudioPreview] = useState(null);
  const [recordingAudio, setRecordingAudio] = useState(false);

  const [sending, setSending] = useState(false);
  const [alreadyReplied, setAlreadyReplied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si ya se envió una respuesta
  useEffect(() => {
    const checkReply = async () => {
      try {
        const response = await api.get(`/message/${code}/`);
        // Si el mensaje tiene replies (al menos uno), bloquear nuevo envío
        if (response.data.replies && response.data.replies.length > 0) {
          setAlreadyReplied(true);
        }
      } catch (err) {
        console.error("Error verificando respuesta:", err);
      } finally {
        setLoading(false);
      }
    };
    checkReply();
  }, [code]);


  // =============================================
  // VIDEO RECORDING
  // =============================================
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

      const chunks = [];
      setVideoChunks([]);

      const recorder = new MediaRecorder(stream);
      mediaRecorderVideo.current = recorder;

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
        setVideoChunks((prev) => [...prev, e.data]);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        setVideoPreview(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      recorder.start();
      setRecordingVideo(true);
    } catch (err) {
      console.error("Error cámara:", err);
    }
  };

  const stopVideoRecording = () => {
    setRecordingVideo(false);
    if (mediaRecorderVideo.current) {
      mediaRecorderVideo.current.stop();
    }
  };


  // =============================================
  // AUDIO RECORDING
  // =============================================
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const chunks = [];
      setAudioChunks([]);
      const recorder = new MediaRecorder(stream);
      mediaRecorderAudio.current = recorder;

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
        setAudioChunks((prev) => [...prev, e.data]);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mp3" });
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
    if (mediaRecorderAudio.current) {
      mediaRecorderAudio.current.stop();
    }
  };


  // =============================================
  // ENVIAR RESPUESTA
  // =============================================
  const handleSubmit = async () => {
    setSending(true);

    const formData = new FormData();
    formData.append("text", text);

    if (videoChunks.length > 0) {
      const videoBlob = new Blob(videoChunks, { type: "video/mp4" });
      formData.append("video", videoBlob, "reply_video.mp4");
    }

    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      formData.append("audio", audioBlob, "reply_audio.mp3");
    }

    try {
      await api.post(`/message/${code}/reply/`, formData);
      navigate(`/reply-sent/${code}`);
    } catch (err) {
      console.error(err);
      alert("Error enviando la respuesta.");
    }

    setSending(false);
  };


  // ==================================================================================
  // RENDER
  // ==================================================================================
  return (
    <div className="relative min-h-screen bg-rose-50 flex justify-center p-6">

      {/* Fondo floral */}
      <div className="absolute inset-0 opacity-30 bg-cover bg-center z-0" style={{ backgroundImage: "url('/f1.jpg')" }}></div>

      <div className="relative bg-white p-8 rounded-3xl max-w-3xl w-full shadow-xl animate-fadeIn">

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        ) : alreadyReplied ? (
          // MENSAJE DE CONFIRMACIÓN - YA SE ENVIÓ RESPUESTA
          <div className="relative text-center py-8 min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-30 bg-cover bg-center z-0" style={{ backgroundImage: "url('/f1.jpg')" }}></div>
            <div className="relative z-10 w-full flex flex-col items-center justify-center">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              ✅ Respuesta ya enviada
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Tu respuesta a este mensaje ya ha sido enviada exitosamente. 
              No es posible enviar múltiples respuestas al mismo mensaje.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-colors"
            >
              Volver al inicio
            </button>
            </div>
          </div>
        ) : (
          // FORMULARIO NORMAL DE RESPUESTA
          <>
            <h1 className="text-3xl font-bold text-rose-600 mb-6 text-center">
              💬 Responder al mensaje
            </h1>

        {/* TEXTO */}
        <textarea
          className="w-full p-4 border rounded-xl min-h-32 mb-6"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu respuesta..."
        ></textarea>

        {/* =====================================================
            VIDEO
        ====================================================== */}
        <div className="border p-4 rounded-xl mb-6">
          <h2 className="text-xl font-bold mb-3">🎥 Grabar Video</h2>

          <video
            ref={videoRef}
            className="w-full rounded-xl bg-black mb-3"
            autoPlay
            muted
            playsInline
          ></video>

          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="w-full rounded-xl shadow mb-3"
            ></video>
          )}

          {!recordingVideo ? (
            <button
              onClick={startVideoRecording}
              className="bg-rose-500 text-white px-4 py-2 rounded-xl"
            >
              🔴 Grabar Video
            </button>
          ) : (
            <button
              onClick={stopVideoRecording}
              className="bg-gray-700 text-white px-4 py-2 rounded-xl"
            >
              ⏹ Detener
            </button>
          )}
        </div>

        {/* =====================================================
            AUDIO
        ====================================================== */}
        <div className="border p-4 rounded-xl mb-6">
          <h2 className="text-xl font-bold mb-3">🎤 Grabación de audio</h2>

          {audioPreview && (
            <audio controls src={audioPreview} className="w-full mb-3"></audio>
          )}

          {!recordingAudio ? (
            <button
              onClick={startAudioRecording}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl"
            >
              🎙️ Grabar Audio
            </button>
          ) : (
            <button
              onClick={stopAudioRecording}
              className="bg-gray-700 text-white px-4 py-2 rounded-xl"
            >
              ⏹ Detener
            </button>
          )}
        </div>

        {/* BOTÓN ENVIAR */}
        <button
          onClick={handleSubmit}
          disabled={sending}
          className={`w-full py-3 text-white rounded-xl text-lg font-semibold ${
            sending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {sending ? "Enviando..." : "📩 Enviar respuesta"}
        </button>

        {/* VOLVER */}
        <button
          onClick={() => navigate(`/view/${code}`)}
          className="w-full mt-3 bg-gray-200 py-3 rounded-xl"
        >
          ⬅ Volver al mensaje
        </button>
          </>
        )}
      </div>

      {/* Animación */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
