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
        <div className="border-t border-[#382f29] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-[#b8a99d] text-sm">
            © 2025 Legacy Family Memory Vault. All rights reserved.
          </p>
          <p className="text-[#b8a99d] text-sm mt-2 sm:mt-0">
            Preserving memories, connecting generations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
