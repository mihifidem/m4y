export default function RomanticCardHeader({ title, subtitle }) {
  return (
    <div className="card-romantic max-w-md mx-auto mt-4 mb-4 text-center space-y-3">
      <h2 className="text-3xl font-bold text-[#E86B87]">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
