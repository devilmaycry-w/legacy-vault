import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, Shield } from 'lucide-react';

const Landing: React.FC = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-[#181411] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(24, 20, 17, 0.7) 0%, rgba(24, 20, 17, 0.9) 70%, #181411 100%), url("https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg")`
        }}
      >
        <div className="absolute inset-0 opacity-30"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-6 font-serif">
            Where Every <span className="text-[#e9883e]">Memory</span> Finds Its Forever.
          </h1>
          <p className="text-lg md:text-xl text-[#b8a99d] mb-10 max-w-xl mx-auto">
            Legacy is more than a vault; it's a living testament to your family's journey. Securely preserve, share, and relive the moments that define you, for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="relative group flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 text-base font-semibold leading-normal tracking-wide transition-all duration-300 transform hover:scale-105"
            >
              {/* Cosmic Background with Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-pulse opacity-30" />
              
              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 p-[2px] group-hover:p-[3px] transition-all duration-300">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600" />
              </div>
              
              {/* Cosmic Particles Effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-60" />
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-40 animation-delay-1000" />
                <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-white rounded-full animate-ping opacity-50 animation-delay-2000" />
              </div>
              
              {/* Text */}
              <span className="relative z-10 text-white font-bold tracking-wide group-hover:text-white transition-colors duration-300">
                Create Your Legacy
              </span>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-purple-400/20 blur-xl" />
            </Link>
            <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/10 border border-white/20 text-white text-base font-semibold leading-normal tracking-wide hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span className="truncate">Explore Features</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="w-8 h-8 text-white/50 animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-[#181411]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-serif">Relive Your Moments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Summer Vacation 2023",
                description: "A collection of sunny days and laughter.",
                image: "https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg"
              },
              {
                title: "Grandma's 80th Birthday",
                description: "Celebrating a milestone with family.",
                image: "https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg"
              },
              {
                title: "First Steps",
                description: "Tiny feet, giant leaps.",
                image: "https://images.pexels.com/photos/1912868/pexels-photo-1912868.jpeg"
              }
            ].map((memory, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 group aspect-square flex flex-col justify-end"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${memory.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-2xl font-semibold mb-2 text-white">{memory.title}</h3>
                  <p className="text-[#f0e9e4] text-sm">{memory.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              to="/signup"
              className="bg-[#e9883e] text-[#181411] font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Memories
            </Link>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 md:py-32 bg-[#382f29]" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(233, 136, 62, 0.1) 0%, rgba(56, 47, 41, 0.1) 100%)'
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Safe, Secure, and Always Yours</h2>
          <p className="text-lg md:text-xl text-[#b8a99d] max-w-2xl mx-auto mb-10">
            We understand the preciousness of your family's memories. Legacy employs state-of-the-art security to ensure your digital heirlooms are protected and accessible only to you and your loved ones.
          </p>
          <div className="flex justify-center">
            <Shield className="w-16 h-16 text-[#e9883e]" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/30 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#b8a99d]">© 2025 Legacy. All Rights Reserved. Weave your story, preserve your heritage.</p>
        </div>
      </footer>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Landing;
