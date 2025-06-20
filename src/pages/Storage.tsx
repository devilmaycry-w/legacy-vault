import React from 'react';

const STORAGE_LIMIT_GB = 25; // Cloudinary free tier
const usedGB = 2.4; // Replace with your real value if you can calculate it

const percentUsed = (usedGB / STORAGE_LIMIT_GB) * 100;

const Storage: React.FC = () => (
  <div className="max-w-2xl mx-auto p-8 bg-[rgba(56,47,41,0.8)] rounded-xl shadow-lg mt-10">
    <h1 className="text-2xl font-semibold mb-6 font-serif">Storage Usage</h1>
    <div className="mb-6">
      <div className="text-lg font-semibold mb-2">Your Vault's Storage</div>
      <div className="w-full bg-[#382f29] rounded-full h-6 relative mb-2">
        <div
          className="bg-[#e9883e] h-6 rounded-full transition-all"
          style={{ width: `${percentUsed}%` }}
        ></div>
        <div className="absolute left-1/2 top-0 text-xs text-[#b8a99d] font-bold" style={{transform: 'translate(-50%, 0)'}}>
          {usedGB.toFixed(2)} GB / {STORAGE_LIMIT_GB} GB
        </div>
      </div>
      <p className="text-[#b8a99d] text-sm">
        <b>Note:</b> Cloudinary's free tier allows up to 25GB. If you approach this limit, consider deleting old memories or upgrading your plan.
      </p>
    </div>
    <div className="bg-[#181411] p-4 rounded-lg">
      <h2 className="font-bold mb-2">Tips to Save Storage</h2>
      <ul className="list-disc pl-6 text-[#b8a99d] text-sm space-y-1">
        <li>Delete unnecessary or duplicate memories.</li>
        <li>Compress images/videos before uploading.</li>
        <li>Monitor your usage regularly.</li>
      </ul>
    </div>
  </div>
);

export default Storage;
