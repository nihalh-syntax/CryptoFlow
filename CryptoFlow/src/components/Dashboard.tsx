import CryptoChart from "./CryptoChart";

export default function Dashboard() {
 
  return (
    <>    
    <div className="w-full max-w-7xl px-4 py-12">
      <h2 className="text-6xl font-bold bg-linear-to-r from-cyan-500 to-red-600 bg-clip-text text-transparent text-center mb-10 -ml-5 mt-10">Crypto Command Center</h2>
      <p className="text-gray-500 text-center mb-10 -ml-10 mt-10">Stay on top of your crypto portfolio with real-time data and actionable insights.</p>
      <CryptoChart />
    </div>
    </>
  );
}