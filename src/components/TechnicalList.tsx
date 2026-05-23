/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Eye, ArrowUpRight, MapPin } from 'lucide-react';
import { Photo } from '../types';

interface TechnicalListProps {
  photos: Photo[];
  onOpenPhoto: (photo: Photo) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  likedIds: Set<string>;
}

export const TechnicalList: React.FC<TechnicalListProps> = ({
  photos,
  onOpenPhoto,
  onLike,
  likedIds,
}) => {
  if (photos.length === 0) {
    return (
      <div className="w-full bg-[#161616] border border-white/5 p-12 text-center rounded-lg font-mono text-xs text-gray-500">
        NO EXPOSURE ITEMS FOUND MATCHING CURRENT FILTER COEFFICIENT.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-mono" id="technical-exposure-list">
      
      {/* Table grid head labels */}
      <div className="grid grid-cols-12 gap-4 pb-2 border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-widest text-left select-none px-4">
        <div className="col-span-4 md:col-span-3">Title & Index</div>
        <div className="col-span-4 md:col-span-2">Category</div>
        <div className="col-span-4 md:col-span-3">Camera / Optics</div>
        <div className="hidden md:block col-span-2">ISO / Specs</div>
        <div className="hidden md:block col-span-1">Action</div>
      </div>

      <div className="divide-y divide-white/10">
        {photos.map((photo, index) => {
          const isLiked = likedIds.has(photo.id);
          const formattedIndex = String(index + 1).padStart(2, '0');

          return (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={photo.id}
              className="grid grid-cols-12 gap-4 items-center py-6 text-left hover:bg-white/[0.02] transition-colors rounded-sm group cursor-pointer px-4"
              onClick={() => onOpenPhoto(photo)}
            >
              
              {/* Image, Title & Index */}
              <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                <span className="text-[10px] text-gray-600 block shrink-0">
                  {formattedIndex}
                </span>
                
                <div className="h-10 w-16 bg-surface-lowest overflow-hidden rounded-sm shrink-0 border border-white/10 relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="truncate">
                  <h4 className="text-xs font-bold text-white group-hover:text-primary-brand transition-colors truncate">
                    {photo.title}
                  </h4>
                  <span className="text-[9px] text-[#8e9192] flex items-center gap-1 mt-0.5 truncate">
                    <MapPin size={8} className="text-[#FF3E00]" />
                    {photo.location}
                  </span>
                </div>
              </div>

              {/* Category tag */}
              <div className="col-span-4 md:col-span-2">
                <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-[#FF3E00] bg-[#FF3E00]/10 border border-[#FF3E00]/20 px-2 py-0.5 rounded-sm font-semibold">
                  {photo.category}
                </span>
              </div>

              {/* Camera / Optics specification row */}
              <div className="col-span-4 md:col-span-3 text-xs text-gray-400 select-none truncate">
                <div className="text-[11px] text-white/90 font-medium truncate">
                  {photo.exif.camera}
                </div>
                <div className="text-[9px] text-gray-500 truncate mt-0.5">
                  {photo.exif.lens}
                </div>
              </div>

              {/* TECHNICAL PARAMETERS: ISO, SS, Aperture */}
              <div className="hidden md:grid md:col-span-2 text-[11px] text-gray-400 gap-y-0.5 font-mono select-none">
                <div>
                  <span className="text-gray-600 mr-1.5">SENS:</span>
                  <span className="text-white">ISO {photo.exif.iso}</span>
                </div>
                <div>
                  <span className="text-gray-600 mr-1.5">DIAL:</span>
                  <span className="text-white">{photo.exif.aperture} @ {photo.exif.shutterSpeed}</span>
                </div>
              </div>

              {/* Actions columns */}
              <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3 px-2">
                
                <button
                  onClick={(e) => onLike(photo.id, e)}
                  title={isLiked ? 'Unlike' : 'Like'}
                  className="p-1.5 hover:bg-white/10 rounded-sm text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Heart size={13} className={isLiked ? 'fill-[#FF3E00] text-[#FF3E00]' : ''} />
                </button>

                <button
                  type="button"
                  className="p-1.5 hover:bg-white/10 rounded-sm text-gray-400 group-hover:text-[#FF3E00] transition-colors flex items-center gap-1 cursor-pointer font-bold text-[10px]"
                >
                  <ArrowUpRight size={13} className="opacity-60 group-hover:opacity-100 group-hover:text-[#FF3E00] transition-opacity" />
                  <span className="hidden lg:inline uppercase tracking-widest font-mono select-none">SPEC</span>
                </button>

              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
