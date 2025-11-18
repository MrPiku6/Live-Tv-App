// app/page.js import { MotionDiv } from "framer-motion";

export default function Home() { return ( <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white"> <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-10 text-center max-w-lg border border-white/20"> <h1 className="text-5xl font-bold mb-4 drop-shadow-xl">Simple Next.js Site</h1> <p className="text-lg mb-6 opacity-90"> Beautiful UI • Smooth Animations • Clean Design </p>

<button className="px-7 py-3 bg-white text-black font-semibold rounded-xl hover:scale-105 hover:bg-gray-200 transition-all duration-300">
      Explore More
    </button>
  </div>
</main>

); }
