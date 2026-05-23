/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Camera, Layers, Aperture, BarChart2, Hash, Eye, Award } from 'lucide-react';
import { Photo } from '../types';

interface StatsPanelProps {
  photos: Photo[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ photos }) => {
  // Compute Stats
  const totalPhotos = photos.length;
  const totalLikes = photos.reduce((acc, p) => acc + p.likes, 0);

  // Cameras aggregation
  const cameraCounts: { [key: string]: number } = {};
  photos.forEach((p) => {
    const cam = p.exif.camera;
    cameraCounts[cam] = (cameraCounts[cam] || 0) + 1;
  });
  const cameraDistribution = Object.entries(cameraCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Focal lengths aggregation
  const focalCounts: { [key: string]: number } = {};
  photos.forEach((p) => {
    const fl = p.exif.focalLength.split(' ')[0] || 'Unknown'; // e.g. 50mm
    focalCounts[fl] = (focalCounts[fl] || 0) + 1;
  });
  const focalDistribution = Object.entries(focalCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Category counts
  const categoryCounts: { [key: string]: number } = {};
  photos.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-[#161616] border border-white/10 rounded-lg p-6 font-mono text-left"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#FF3E00] font-semibold">
            Exhibition Telemetry & Analytics
          </span>
          <h2 className="text-xl font-plus-jakarta font-bold tracking-tight text-white">
            Curator Metadata Ledger
          </h2>
        </div>
        <div className="text-[11px] text-gray-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded mt-2 md:mt-0">
          STABLE FEED • LOCAL EXIF
        </div>
      </div>

      {/* Grid of Key Numerical Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-lowest border border-white/5 p-4 rounded">
          <span className="text-[10px] text-gray-500 uppercase block mb-1">Total Plates</span>
          <div className="text-2xl font-bold font-plus-jakarta text-white">{totalPhotos}</div>
          <span className="text-[9px] text-[#8e9192] mt-1 block">Active exposures</span>
        </div>

        <div className="bg-surface-lowest border border-white/5 p-4 rounded">
          <span className="text-[10px] text-gray-500 uppercase block mb-1">Total Curated Favorites</span>
          <div className="text-2xl font-bold font-plus-jakarta text-white">
            {photos.filter((p) => p.curated).length}
          </div>
          <span className="text-[9px] text-[#8e9192] mt-1 block">Highlight series filtered</span>
        </div>

        <div className="bg-surface-lowest border border-white/5 p-4 rounded">
          <span className="text-[10px] text-gray-500 uppercase block mb-1">Cumulative Interest</span>
          <div className="text-2xl font-bold font-plus-jakarta text-white">{totalLikes}</div>
          <span className="text-[9px] text-[#8e9192] mt-1 block">Interactive impressions</span>
        </div>

        <div className="bg-surface-lowest border border-white/5 p-4 rounded">
          <span className="text-[10px] text-gray-500 uppercase block mb-1">Dynamic Range Scale</span>
          <div className="text-2xl font-bold font-plus-jakarta text-white">16 Bit</div>
          <span className="text-[9px] text-[#8e9192] mt-1 block">Linear output sensor log</span>
        </div>
      </div>

      {/* Ratios & Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category distribution */}
        <div className="border border-white/5 bg-surface-lowest p-4 rounded flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-2 mb-4 border-b border-white/5 pb-1 select-none">
              <BarChart2 size={12} className="text-[#FF3E00]" />
              Subject Categories
            </h4>
            
            <div className="space-y-3">
              {['Street', 'Architecture', 'Landscape', 'Editorial', 'Portrait'].map((cat) => {
                const count = categoryCounts[cat] || 0;
                const pct = totalPhotos > 0 ? (count / totalPhotos) * 100 : 0;
                return (
                  <div key={cat} className="text-xs">
                    <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                      <span>{cat}</span>
                      <span>{count} plate{count !== 1 ? 's' : ''} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-sm overflow-hidden">
                      <div 
                        className="bg-[#FF3E00] h-full rounded-sm transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="text-[9px] text-gray-600 block mt-4">Subject balance distribution graph</span>
        </div>

        {/* Favorite Cameras */}
        <div className="border border-white/5 bg-surface-lowest p-4 rounded flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-2 mb-4 border-b border-white/5 pb-1 select-none">
              <Camera size={12} className="text-[#FF3E00]" />
              Standard System Distribution
            </h4>
            
            <div className="space-y-3">
              {cameraDistribution.map(([camName, count]) => {
                const pct = totalPhotos > 0 ? (count / totalPhotos) * 100 : 0;
                return (
                  <div key={camName} className="text-xs">
                    <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                      <span className="truncate pr-2">{camName}</span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-sm overflow-hidden">
                      <div 
                        className="bg-[#FF3E00]/80 h-full rounded-sm transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {cameraDistribution.length === 0 && (
                <div className="text-xs text-gray-500 py-4 text-center">No camera data.</div>
              )}
            </div>
          </div>
          <span className="text-[9px] text-gray-600 block mt-4">Camera system frequency index</span>
        </div>

        {/* Focal Length Breakdown */}
        <div className="border border-white/5 bg-surface-lowest p-4 rounded flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-2 mb-4 border-b border-white/5 pb-1 select-none">
              <Layers size={12} className="text-[#FF3E00]" />
              Optic Focal Profiles
            </h4>
            
            <div className="space-y-3">
              {focalDistribution.map(([focal, count]) => {
                const pct = totalPhotos > 0 ? (count / totalPhotos) * 100 : 0;
                return (
                  <div key={focal} className="text-xs">
                    <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                      <span>{focal} focus lens</span>
                      <span>{count} capture{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-sm overflow-hidden">
                      <div 
                        className="bg-[#FF3E00]/60 h-full rounded-sm transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {focalDistribution.length === 0 && (
                <div className="text-xs text-gray-500 py-4 text-center">No focal length data loaded.</div>
              )}
            </div>
          </div>
          <span className="text-[9px] text-gray-600 block mt-4">Preferred glass optic selection ledger</span>
        </div>

      </div>

      {/* Helpful Technical Diagnostics Info */}
      <div className="bg-white/5 border border-white/15 rounded p-3 mt-6 text-xs text-white/80 flex items-start gap-2.5">
        <Award size={14} className="text-[#8e9192] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Curator Insight:</span> 
          <span> Large-format medium sensors (Hasselblad X2D, GFX) are favored for structural/architectural voids. Street projects rely heavily on rapid ranges (Sony A7R V) or minimalist mechanical speedfinders (Leica M11) with prime lengths (35mm or 50mm).</span>
        </div>
      </div>

    </motion.div>
  );
};
