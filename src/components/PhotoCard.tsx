/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Maximize2, MapPin, Eye } from 'lucide-react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  isLiked: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onClick,
  onLike,
  isLiked,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col w-full cursor-pointer"
      id={`photo-card-${photo.id}`}
      onClick={onClick}
    >
      {/* Image Container with Custom Shape (rounded-lg / 0.5rem) */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-surface-lowest border border-white/5 transition-colors duration-300 group-hover:border-white/20">
        <img
          src={photo.url}
          alt={photo.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Backdrop Blur Info Panel on Hover (Glassmorphism 20px blur) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <span className="bg-black/40 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[10px] font-mono tracking-widest text-white uppercase rounded-sm">
              {photo.category}
            </span>
            <button
              onClick={(e) => onLike(photo.id, e)}
              className="p-1.5 rounded-sm bg-black/40 backdrop-blur-md border border-white/5 text-white hover:text-white hover:bg-black/60 transition-colors cursor-pointer"
              aria-label="Like photograph"
            >
              <Heart
                size={14}
                className={`${isLiked ? 'fill-[#FF3E00] text-[#FF3E00]' : 'text-gray-400 group-hover:text-white'}`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center bg-black/60 backdrop-blur-[20px] border border-white/10 p-2.5 rounded transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-xs font-mono text-white/95 truncate flex items-center gap-1">
              <MapPin size={10} className="text-[#FF3E00]" />
              {photo.location}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF3E00] bg-[#FF3E00]/10 border border-[#FF3E00]/20 px-1.5 py-0.5 rounded-sm flex items-center gap-1 font-semibold">
              <Eye size={10} />
              Full Spec
            </span>
          </div>
        </div>
      </div>

      {/* Under-Card Metadata block strictly in JetBrains Mono per specifications */}
      <div className="mt-3 flex flex-col font-mono text-left select-none">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-white group-hover:text-primary-brand transition-colors">
            {photo.title}
          </h3>
          <span className="text-[10px] text-gray-500">
            {photo.exif.focalLength}
          </span>
        </div>
        
        {/* EXIF Readout row */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-[#8e9192] border-t border-white/5 pt-1">
          <span className="truncate">
            {photo.exif.camera} • {photo.exif.aperture}
          </span>
          <span>
            ISO {photo.exif.iso}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-gray-600">
          <span>{photo.photographer}</span>
          <span>{photo.exif.shutterSpeed}</span>
        </div>
      </div>
    </motion.div>
  );
};
