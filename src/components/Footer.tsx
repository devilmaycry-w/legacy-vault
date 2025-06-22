import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#181411] border-t border-[#382f29] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-8 h-8 text-[#e9883e]" />
              <h3 className="text-2xl font-bold text-white font-serif">Legacy</h3>
            </div>
            <p className="text-[#b8a99d] text-sm leading-relaxed mb-4">
              Where every memory finds its forever home. Legacy is more than a vault; it's a living testament to your family's journey, preserving the moments that define you for generations to come.
            </p>
            <div className="flex items-center gap-2 text-[#b8a99d] text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-[#e9883e]" />
              <span>for families everywhere</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link to="/dashboard" className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors text-sm">
                Dashboard
              </Link>
              <Link to="/timeline" className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors text-sm">
                Timeline
              </Link>
              <Link to="/upload" className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors text-sm">
                Upload Memory
              </Link>
              <Link to="/members" className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors text-sm">
                Manage Members
              </Link>
            </nav>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <nav className="space-y-2">
              <Link to="/about" className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors text-sm">
                About Us
              </Link>
              <Link to="/privacy" className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors text-sm">
                Privacy Policy
              </Link>
              <a href="mailto:support@legacy.com" className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors text-sm">
                Contact Support
              </a>
              <a href="#" className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors text-sm">
                Help Center
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#382f29] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#b8a99d] text-sm">
            © 2025 Legacy Family Memory Vault. All rights reserved.
          </p>
          <p className="text-[#b8a99d] text-sm mt-2 sm:mt-0">
            Preserving memories, connecting generations.
          </p>
          <a
            href="https://www.linkedin.com/in/ankrit-maity-6a37a6351/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#b8a99d] hover:text-[#e9883e] text-sm mt-2 sm:mt-0"
          >
            {/* LinkedIn SVG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11.75 20.5h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.25 12.268h-3v-5.604c0-1.336-.025-3.06-1.867-3.06-1.868 0-2.154 1.459-2.154 2.962v5.702h-3v-11h2.878v1.501h.041c.4-.757 1.377-1.555 2.834-1.555 3.03 0 3.59 1.995 3.59 4.591v6.463z"/>
            </svg>
            Meet The Legacy Creator
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
