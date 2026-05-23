/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, ChevronRight, Camera, Cpu, Layers, 
  MapPin, Calendar, Compass, Share2, Clipboard, Heart 
} from 'lucide-react';
import { Photo } from '../types';

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  isLiked: boolean;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photo,
  onClose,
  onPrev,
  onNext,
  onLike,
  isLiked,
}) => {
  // Keypress event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  // Prevent scroll background
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const copyMetadata = () => {
    const text = `${photo.title} by ${photo.photographer}\nLocation: ${photo.location}\nCamera: ${photo.exif.camera}\nLens: ${photo.exif.lens}\nTechnical Spec: ${photo.exif.focalLength}, ${photo.exif.aperture}, ${photo.exif.shutterSpeed}, ISO ${photo.exif.iso}\nColorspace: ${photo.exif.colorProfile || 'sRGB'}`;
    navigator.clipboard.writeText(text);
    // Custom popup alert alternative
    const notifier = document.getElementById('lightbox-noti');
    if (notifier) {
      notifier.textContent = 'EXIF Metadata Copied to Clipboard';
      notifier.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 text-xs font-mono rounded tracking-wider z-[110] opacity-100 transition-all duration-300';
      setTimeout(() => {
        notifier.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 text-xs font-mono rounded tracking-wider z-[110] opacity-0 pointer-events-none transition-all duration-300';
      }, 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#070707]/98 select-none overflow-y-auto"
      id="lightbox-container"
    >
      {/* Toast Notifier */}
      <div 
        id="lightbox-noti" 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 text-xs font-mono rounded tracking-wider z-[110] opacity-0 pointer-events-none transition-all duration-300"
      />

      {/* Background Subtle Silhouette */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden flex items-center justify-center">
        <img 
          src={photo.url} 
          alt="" 
          className="w-full h-full object-cover blur-[80px]" 
        />
      </div>

      {/* Main Structural Layout */}
      <div className="relative w-full h-full flex flex-col md:flex-row items-stretch justify-between p-4 md:p-8 gap-6 z-10">
        
        {/* Left Interactive Image Stage */}
        <div className="flex-1 flex flex-col justify-center items-center relative min-h-[50vh] md:min-h-0">
          
          {/* Top Panel Bar */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center text-white/50 px-2 py-4 pointer-events-none">
            <div className="font-mono text-xs flex items-center gap-2 select-none pointer-events-auto">
              <span className="text-white/80 font-bold">{photo.title}</span> 
              <span className="text-white/30">|</span>
              <span className="text-white/50">{photo.photographer}</span>
            </div>
            
            <div className="flex items-center gap-3 pointer-events-auto">
              <button 
                onClick={(e) => onLike(photo.id, e)}
                className="p-2 hover:bg-white/10 rounded-sm text-white transition-colors cursor-pointer"
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart size={16} className={isLiked ? 'fill-[#FF3E00] text-[#FF3E00]' : 'text-white/60'} />
              </button>
              <button 
                onClick={copyMetadata}
                className="p-2 hover:bg-white/10 rounded-sm text-white/60 hover:text-white transition-colors cursor-pointer"
                title="Copy EXIF metadata"
              >
                <Clipboard size={16} />
              </button>
            </div>
          </div>

          {/* Navigation controls */}
          <button 
            onClick={onPrev}
            className="absolute left-0 p-3 hover:bg-white/5 rounded-sm text-white/40 hover:text-white transition-all cursor-pointer z-20"
            aria-label="Previous photograph"
          >
            <ChevronLeft size={28} />
          </button>

          <button 
            onClick={onNext}
            className="absolute right-0 p-3 hover:bg-white/5 rounded-sm text-white/40 hover:text-white transition-all cursor-pointer z-20"
            aria-label="Next photograph"
          >
            <ChevronRight size={28} />
          </button>

          {/* Core Image Display with Entrance Fade */}
          <motion.div 
            key={photo.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[70vh] md:max-h-[85vh] w-full flex items-center justify-center"
          >
            <img 
              src={photo.url} 
              alt={photo.title}
              referrerPolicy="no-referrer"
              className="max-h-[65vh] md:max-h-[82vh] max-w-[90%] md:max-w-full object-contain rounded-md shadow-2xl border border-white/5"
            />
          </motion.div>

          {/* Bottom Humanistic Details Label */}
          <div className="absolute bottom-0 text-center text-white/40 font-mono text-[11px] hidden md:block">
            USE LEFT & RIGHT ARROWS TO NAVIGATE • PRESS ESC TO EXIT LIGHTBOX
          </div>
        </div>

        {/* Right Info Panel - Glassmorphism, 20px Backdrop Blur, 10% white tint */}
        <div className="w-full md:w-[380px] shrink-0 bg-[#161616]/75 backdrop-blur-[20px] border-t md:border-t-0 md:border-l border-white/10 p-5 md:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header: Title / Exit */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#FF3E00] uppercase block mb-1 font-semibold">
                  {photo.category} • EXIF RECORDING
                </span>
                <h2 className="text-xl font-plus-jakarta font-bold tracking-tight text-white">
                  {photo.title}
                </h2>
                <p className="text-xs text-white/60 mt-1">
                  by {photo.photographer}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white transition-colors rounded-sm cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Description Text */}
            <div className="mb-6">
              <p className="text-xs text-white/80 font-sans leading-relaxed">
                {photo.description}
              </p>
            </div>

            {/* TECHNICAL DETAILS SECTION - JetBrains Mono */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-white/40 border-b border-white/5 pb-1">
                Metadata Specs
              </h4>

              {/* Grid Metadata */}
              <div className="grid grid-cols-1 gap-3.5 font-mono text-xs">
                
                <div className="flex items-start gap-3">
                  <Camera size={14} className="text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-white/30 uppercase block">Camera System</span>
                    <span className="text-white/90">{photo.exif.camera}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Cpu size={14} className="text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-white/30 uppercase block">Optics System</span>
                    <span className="text-white/90">{photo.exif.lens}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-3">
                    <Layers size={14} className="text-white/40 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block">Aperture</span>
                      <span className="text-white/90">{photo.exif.aperture}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Compass size={14} className="text-white/40 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block">Focal Length</span>
                      <span className="text-white/90">{photo.exif.focalLength}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-bold text-white/30 shrink-0 mt-0.5 w-[14px] text-center">SS</span>
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block">Shutter Speed</span>
                      <span className="text-white/90">{photo.exif.shutterSpeed}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-bold text-white/30 shrink-0 mt-0.5 w-[14px] text-center">ISO</span>
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block">Sensitivity</span>
                      <span className="text-white/90">ISO {photo.exif.iso}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[11px] font-bold text-white/30 shrink-0 mt-0.5 w-[14px] text-center">PX</span>
                  <div>
                    <span className="text-[10px] text-white/30 uppercase block">Resolution</span>
                    <span className="text-white/90">{photo.exif.resolution}</span>
                  </div>
                </div>

                {photo.exif.colorProfile && (
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-bold text-white/30 shrink-0 mt-0.5 w-[14px] text-center">CS</span>
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block">Color Profile</span>
                      <span className="text-white/90">{photo.exif.colorProfile}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 border-t border-white/5 pt-3.5 mt-1">
                  <MapPin size={14} className="text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-white/30 uppercase block">Capture Location</span>
                    <span className="text-white/90">{photo.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={14} className="text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-white/30 uppercase block">Capture Date</span>
                    <span className="text-white/90">
                      {new Date(photo.timestamp).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC'
                      })} UTC
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Tags section */}
            <div className="mt-8">
              <h5 className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">
                Descriptive Tags
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {photo.tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-[10px] font-mono bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-sm hover:text-white hover:bg-white/10 transition-colors"
                  >
                    #{tag.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive footer actions */}
          <div className="mt-8 border-t border-white/10 pt-4 flex gap-3">
            <button
              onClick={(e) => onLike(photo.id, e)}
              className={`flex-1 font-mono text-xs uppercase tracking-wider py-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-medium ${isLiked ? 'bg-[#FF3E00] hover:bg-[#E03600] text-white' : 'bg-white hover:bg-[#e2e2e2] text-black'}`}
            >
              <Heart size={12} className={isLiked ? 'fill-white text-white' : ''} />
              {isLiked ? 'Favorited' : 'Add Favorite'}
            </button>
            <button
              onClick={copyMetadata}
              className="flex-1 border border-white/25 hover:border-white text-white font-mono text-xs uppercase tracking-wider py-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 size={12} />
              Share Specs
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
