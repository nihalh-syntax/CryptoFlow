
const Homepage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
    <div>
       <h1 className='text-8xl font-bold bg-linear-to-r from-cyan-600 to-red-700 bg-clip-text text-transparent'>Welcome to CryptoFlow</h1>
       <p className='text-gray-500 text-center px-7 justify-left py-4 w-3/4'>Experience the future of crypto with our advanced analytics and insights,
         real-time data visualization, and seamless integration with your favorite exchanges all in one stunning 
         platform.</p>
       <div className='flex gap-4 mt-7 items-center justify-center -ml-80'>
        <button className='py-3 bg-linear-to-r from-cyan-600 to-red-800 text-white font-semibold px-8 rounded-full hover:opacity-90 transition-opacity cursor-pointer'>
          Start Trading Now →
        </button>
        <button className='py-3 px-8 border border-gray-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer'>
          Watch Demo
        </button>
      </div>
    </div>
    </div>
  );
};

export default Homepage;