export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white text-center px-6">

      <h1 className="text-5xl font-bold mb-6">
        Smart Crypto Intelligence
      </h1>

      <p className="text-lg max-w-xl mb-8 text-gray-300">
        Track cryptocurrency prices, analyze market trends and stay ahead
        with real-time crypto insights.
      </p>

      <button className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-lg">
        Get Started
      </button>

    </section>
  );
}