import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Users, Database, ArrowLeft } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#181411] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#b8a99d] hover:text-[#e9883e] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white font-serif mb-4">Privacy Policy</h1>
          <p className="text-[#b8a99d] text-lg">
            Your family's memories are precious. Here's how we protect them.
          </p>
        </div>

        {/* Privacy Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <Shield className="w-8 h-8 text-[#e9883e] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your Data, Your Control</h3>
            <p className="text-[#b8a99d] text-sm">
              You own your memories. We simply provide a secure vault to store and share them with your loved ones.
            </p>
          </div>
          <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <Lock className="w-8 h-8 text-[#e9883e] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">End-to-End Security</h3>
            <p className="text-[#b8a99d] text-sm">
              All uploads are encrypted in transit and at rest. Your memories are protected with enterprise-grade security.
            </p>
          </div>
          <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <Eye className="w-8 h-8 text-[#e9883e] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Privacy by Design</h3>
            <p className="text-[#b8a99d] text-sm">
              We never sell your data. Your memories are private by default and only shared with family members you invite.
            </p>
          </div>
          <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
            <Users className="w-8 h-8 text-[#e9883e] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Family-First Sharing</h3>
            <p className="text-[#b8a99d] text-sm">
              Granular privacy controls let you decide who sees what. From personal memories to family-wide celebrations.
            </p>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white font-serif mb-6">Our Privacy Commitment</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-[#e9883e] mb-3">Information We Collect</h3>
              <p className="text-[#b8a99d] mb-3">
                We collect only the information necessary to provide our service:
              </p>
              <ul className="list-disc list-inside text-[#b8a99d] space-y-1 ml-4">
                <li>Account information (email, name, profile photo)</li>
                <li>Family memories you choose to upload (photos, videos, audio, text)</li>
                <li>Family member invitations and vault memberships</li>
                <li>Usage analytics to improve our service (anonymized)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#e9883e] mb-3">How We Use Your Information</h3>
              <ul className="list-disc list-inside text-[#b8a99d] space-y-1 ml-4">
                <li>To provide secure storage and sharing of your family memories</li>
                <li>To enable collaboration with invited family members</li>
                <li>To send important service updates and security notifications</li>
                <li>To improve our platform based on usage patterns (anonymized data only)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#e9883e] mb-3">Data Security</h3>
              <p className="text-[#b8a99d] mb-3">
                Your memories are protected with industry-leading security measures:
              </p>
              <ul className="list-disc list-inside text-[#b8a99d] space-y-1 ml-4">
                <li>All data encrypted in transit using TLS 1.3</li>
                <li>Files stored with AES-256 encryption at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Multi-factor authentication support</li>
                <li>Secure cloud infrastructure with 99.9% uptime</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#e9883e] mb-3">Your Rights</h3>
              <p className="text-[#b8a99d] mb-3">
                You have complete control over your data:
              </p>
              <ul className="list-disc list-inside text-[#b8a99d] space-y-1 ml-4">
                <li>Download all your memories at any time</li>
                <li>Delete your account and all associated data</li>
                <li>Control who has access to your family vault</li>
                <li>Modify privacy settings for individual memories</li>
                <li>Request data portability to another service</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#e9883e] mb-3">Contact Us</h3>
              <p className="text-[#b8a99d]">
                Questions about our privacy practices? We're here to help. Contact our privacy team at{' '}
                <a href="mailto:privacy@legacy.com" className="text-[#e9883e] hover:underline">
                  privacy@legacy.com
                </a>
              </p>
            </section>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-[#b8a99d] text-sm">
            Last updated: January 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;