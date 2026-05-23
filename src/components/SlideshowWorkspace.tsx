/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronLeft, ChevronRight, Minimize, Settings, Sparkles } from 'lucide-react';
import { Photo } from '../types';

interface SlideshowWorkspaceProps {
  photos: Photo[];
  onClose: () => void;
  onOpenPhoto: (photo: Photo) => void;
}

export const SlideshowWorkspace: React.FC<SlideshowWorkspaceProps> = ({
  photos,
  onClose,
  onOpenPhoto,
}) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [transitionSpeed, setTransitionSpeed] = useState(6000); // 6 seconds per slide
  const [progress, setProgress] = useState(0);

  const activePhoto = photos[index];

  // Next / Prev slide helpers
  const handleNext = () => {
    if (photos.length === 0) return;
    setIndex((prev) => (prev + 1) % photos.length);
    setProgress(0);
  };

  const handlePrev = () => {
    if (photos.length === 0) return;
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setProgress(0);
  };

  // Autoplay trigger
  useEffect(() => {
    if (!playing || photos.length <= 1) return;
    
    // Smooth progress bar update
    const intervalTime = 100; // update progress bar every 100ms
    const steps = transitionSpeed / intervalTime;
    let currentStep = 0;

    const progressTimer = setInterval(() => {
      currentStep++;
      const currentPct = (currentStep / steps) * 100;
      setProgress(Math.min(currentPct, 100));

      if (currentStep >= steps) {
        handleNext();
      }
    }, intervalTime);

    return () => {
      clearInterval(progressTimer);
    };
  }, [playing, index, transitionSpeed, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="w-full bg-[#161616] border border-white/5 p-12 text-center rounded-lg font-mono text-xs">
        NO IMAGES IN FILTERED SELECTION TO RUN SLIDESHOW EXHIBITION.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#111111] border border-white/10 rounded-lg overflow-hidden flex flex-col relative text-left">
      
      {/* Top Glass Navigation Bar (20px blur) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 glass-nav z-10">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-[#8e9192] uppercase">
            LIVE EXHIBITION SERIES • {index + 1} OF {photos.length} FILE{photos.length !== 1 ? 'S' : ''}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Transition speeds option */}
          <div className="flex items-center gap-2 border border-white/5 bg-black/40 px-2 py-1 rounded font-mono text-[10px]">
            <span className="text-gray-500">PACE:</span>
            <select
              value={transitionSpeed}
              onChange={(e) => {
                setTransitionSpeed(Number(e.target.value));
                setProgress(0);
              }}
              className="bg-transparent text-white outline-none cursor-pointer"
            >
              <option value="4000">4s Rapid</option>
              <option value="6000">6s Gallery</option>
              <option value="10000">10s Cinematic</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-widest text-[#8e9192] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Minimize size={12} />
            Collapse Cinema
          </button>
        </div>
      </div>

      {/* Progress timeline bar */}
      <div className="w-full h-1 bg-white/5">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main split display container */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[50vh] md:min-h-[60vh] bg-neutral-950">
        
        {/* Left Side: High Density Photographic Stage (8 Cols) */}
        <div className="md:col-span-8 flex items-center justify-center relative p-6 bg-black min-h-[35vh] md:min-h-0">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhoto.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full flex items-center justify-center cursor-pointer"
              onClick={() => onOpenPhoto(activePhoto)}
              title="Click to launch deep EXIF specification analyzer"
            >
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[55vh] object-contain rounded border border-white/5 hover:border-white/20 transition-all duration-300"
              />
            </motion.div>
          </AnimatePresence>

          {/* Quick slider keys inside stage */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="p-1 hover:bg-white/10 rounded text-white hover:text-gray-300 transition-colors cursor-pointer"
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

        {/* Right Side: Editorial Context Card (4 Cols in JetBrains Mono / Plus Jakarta) */}
        <div className="md:col-span-4 bg-surface-low p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 text-xs">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhoto.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 block mb-1">
                  {activePhoto.category} Plate
                </span>
                <h3 className="text-2xl font-plus-jakarta font-bold text-white tracking-tight leading-tight">
                  {activePhoto.title}
                </h3>
                <span className="text-gray-500 font-mono text-[11px] block mt-1">
                  Curated by {activePhoto.photographer}
                </span>
              </div>

              <div className="text-white/85 font-sans leading-relaxed border-l-2 border-white/10 pl-3">
                {activePhoto.description}
              </div>

              {/* Condensed EXIF row block */}
              <div className="space-y-2 border-t border-white/5 pt-4 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Camera</span>
                  <span className="text-white text-right">{activePhoto.exif.camera}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Aperture</span>
                  <span className="text-white">{activePhoto.exif.aperture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Shutter</span>
                  <span className="text-white">{activePhoto.exif.shutterSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Sensitivity</span>
                  <span className="text-white">ISO {activePhoto.exif.iso}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Focal Glass</span>
                  <span className="text-white">{activePhoto.exif.focalLength}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1 text-[10px]">
                  <span className="text-gray-600 uppercase">Location</span>
                  <span className="text-gray-400">{activePhoto.location}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center font-mono text-[10px] text-gray-500">
            <span>Dynamic Speed: {transitionSpeed / 1000}s</span>
            <button 
              onClick={() => onOpenPhoto(activePhoto)}
              className="text-white hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer font-medium"
            >
              <Sparkles size={10} />
              Open Metadata Specs
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
