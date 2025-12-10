export default function InstructionsView() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Instrucciones para ver mensaje</h1>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Usa el código compartido para acceder al mensaje.</li>
        <li>Respeta el límite de vistas y tiempo disponible.</li>
        <li>Si el mensaje expira, verás una notificación.</li>
      </ul>
    </div>
  );
}