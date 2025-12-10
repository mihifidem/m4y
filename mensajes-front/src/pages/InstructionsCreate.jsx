export default function InstructionsCreate() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Instrucciones para crear mensaje</h1>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Introduce el código en formato NTSF-001-001-ABC.</li>
        <li>Completa el email del comprador y el contenido del mensaje.</li>
        <li>Opcionalmente, graba un video o audio.</li>
        <li>Guarda para activar el mensaje y compartir el código.</li>
      </ul>
    </div>
  );
}