import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Users, Clock, Shield, ArrowLeft } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#181411] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#b8a99d] hover:text-[#e9883e] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white font-serif mb-4">About Legacy</h1>
          <p className="text-[#b8a99d] text-xl leading-relaxed">
            Where every memory finds its forever home, connecting generations through the stories that matter most.
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Star className="w-12 h-12 text-[#e9883e]" />
            <div>
              <h2 className="text-2xl font-bold text-white font-serif">Our Mission</h2>
              <p className="text-[#b8a99d]">Preserving family heritage for future generations</p>
            </div>
          </div>
          <p className="text-[#b8a99d] leading-relaxed">
            Legacy was born from a simple belief: every family has a story worth preserving. In an age where digital memories can be lost in the blink of an eye, we created a sanctuary where your most precious moments can live forever. More than just storage, Legacy is a living testament to your family's journey—a place where grandparents can share their wisdom, parents can document milestones, and children can discover their roots.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <Heart className="w-8 h-8 text-[#e9883e] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Family First</h3>
            <p className="text-[#b8a99d] text-sm leading-relaxed">
              Every feature we build is designed with families in mind. From intuitive sharing controls to multi-generational accessibility, we ensure everyone can participate in preserving your family's legacy.
            </p>
          </div>
          
          <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <Shield className="w-8 h-8 text-[#e9883e] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Privacy & Security</h3>
            <p className="text-[#b8a99d] text-sm leading-relaxed">
              Your memories are sacred. We employ enterprise-grade security to protect your family's digital heritage, ensuring your stories remain private and secure for generations to come.
            </p>
          </div>
          
          <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <Clock className="w-8 h-8 text-[#e9883e] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Built to Last</h3>
            <p className="text-[#b8a99d] text-sm leading-relaxed">
              We're not just building for today—we're creating a platform that will preserve your memories for decades. Our commitment to longevity means your family's story will endure.
            </p>
          </div>
          
          <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <Users className="w-8 h-8 text-[#e9883e] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Community Driven</h3>
            <p className="text-[#b8a99d] text-sm leading-relaxed">
              Legacy grows stronger with every family that joins. We listen to our community and continuously evolve to meet the changing needs of modern families.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white font-serif mb-6">Our Story</h2>
          <div className="space-y-4 text-[#b8a99d] leading-relaxed">
            <p>
              Legacy began when our founder realized that decades of family photos were scattered across old phones, forgotten hard drives, and fading physical albums. Important family stories were being lost, and younger generations were growing up disconnected from their heritage.
            </p>
            <p>
              We envisioned a different future—one where every family could easily preserve, organize, and share their most meaningful moments. A place where a grandmother's handwritten recipe could live alongside a grandchild's first steps, where family traditions could be documented and passed down, and where distance couldn't diminish the bonds that tie families together.
            </p>
            <p>
              Today, Legacy serves thousands of families worldwide, helping them create digital time capsules that will be treasured for generations. Every photo uploaded, every story shared, and every memory preserved adds another thread to the rich tapestry of human experience.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="text-center bg-gradient-to-r from-[rgba(233,136,62,0.1)] to-[rgba(56,47,41,0.1)] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white font-serif mb-4">Our Vision</h2>
          <p className="text-[#b8a99d] text-lg leading-relaxed max-w-2xl mx-auto">
            We dream of a world where no family story is ever lost, where every generation can connect with those who came before, and where the memories that define us are preserved with the care and reverence they deserve.
          </p>
          <div className="mt-6">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-[#e9883e] text-[#181411] font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Your Legacy
              <Star className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;