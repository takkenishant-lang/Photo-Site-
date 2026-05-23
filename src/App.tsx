/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, SlidersHorizontal, Search, RotateCcw, Plus, Sparkles, 
  LayoutGrid, BookOpen, List, Play, BarChart2, Check, ExternalLink, 
  MapPin, Heart, ArrowUpRight, Aperture, Settings, Layers, Code, HardDrive 
} from 'lucide-react';

import { Photo, ViewLayoutMode } from './types';
import { getPhotos, savePhotos, resetPhotos } from './data';
import { PhotoCard } from './components/PhotoCard';
import { Lightbox } from './components/Lightbox';
import { UploadWorkspace } from './components/UploadWorkspace';
import { StatsPanel } from './components/StatsPanel';
import { SlideshowWorkspace } from './components/SlideshowWorkspace';
import { TechnicalList } from './components/TechnicalList';

export default function App() {
  // --- core states ---
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // --- layout states ---
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('editorial-grid');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // --- panel toggle states ---
  const [isCurationStudioOpen, setIsCurationStudioOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  
  // --- advanced filter values ---
  const [selectedCameraFilter, setSelectedCameraFilter] = useState<string>('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('All');
  
  // --- user personalization storage ---
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const save = localStorage.getItem('photo_site_likes');
    return save ? new Set(JSON.parse(save)) : new Set();
  });

  // --- retrieve initial data on load ---
  useEffect(() => {
    setPhotos(getPhotos());
  }, []);

  // --- persist likes ---
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening lightbox
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem('photo_site_likes', JSON.stringify(Array.from(next)));
      return next;
    });
    
    // Increment simulated likes counts
    setPhotos(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const isCurrentlyLiked = likedIds.has(id);
          return {
            ...p,
            likes: isCurrentlyLiked ? Math.max(0, p.likes - 1) : p.likes + 1
          };
        }
        return p;
      });
      savePhotos(updated);
      return updated;
    });
  };

  // --- retrieve dynamic filter pools ---
  const cameraBrandsPool = useMemo(() => {
    const brands = new Set<string>();
    photos.forEach(p => {
      const parts = p.exif.camera.split(' ');
      if (parts[0]) brands.add(parts[0]);
    });
    return Array.from(brands);
  }, [photos]);

  const tagsPool = useMemo(() => {
    const tags = new Set<string>();
    photos.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [photos]);

  // --- filtered photos solver ---
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      // 1. Category Filter
      if (activeCategory !== 'All' && photo.category !== activeCategory) {
        return false;
      }

      // 2. Camera Brand Filter
      if (selectedCameraFilter !== 'All') {
        if (!photo.exif.camera.startsWith(selectedCameraFilter)) {
          return false;
        }
      }

      // 3. Tag Filter
      if (selectedTagFilter !== 'All') {
        if (!photo.tags.includes(selectedTagFilter)) {
          return false;
        }
      }

      // 4. Omnipresent Text Search
      if (searchQuery.trim()) {
        const fuzzy = searchQuery.toLowerCase();
        const matchesTitle = photo.title.toLowerCase().includes(fuzzy);
        const matchesAuthor = photo.photographer.toLowerCase().includes(fuzzy);
        const matchesLocation = photo.location.toLowerCase().includes(fuzzy);
        const matchesCamera = photo.exif.camera.toLowerCase().includes(fuzzy);
        const matchesTags = photo.tags.some(t => t.toLowerCase().includes(fuzzy));
        const matchesDescription = photo.description.toLowerCase().includes(fuzzy);

        return matchesTitle || matchesAuthor || matchesLocation || matchesCamera || matchesTags || matchesDescription;
      }

      return true;
    });
  }, [photos, activeCategory, selectedCameraFilter, selectedTagFilter, searchQuery]);

  // --- adding photo to localized master ledger ---
  const handleAddPhoto = (newPhoto: Photo) => {
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    savePhotos(updated);
    setIsCurationStudioOpen(false); // Close drawer on save
    
    // Quick notification fallback
    const triggerNoti = document.createElement('div');
    triggerNoti.textContent = `Locked: "${newPhoto.title}" logged successfully.`;
    triggerNoti.className = 'fixed bottom-6 left-6 bg-white text-black px-4 py-2 text-xs font-mono rounded tracking-wider z-50 shadow-lg border border-neutral-800';
    document.body.appendChild(triggerNoti);
    setTimeout(() => triggerNoti.remove(), 3000);
  };

  // --- reset to factory pristine gallery ---
  const handleFactoryReset = () => {
    if (confirm('Are you sure you want to reset the exhibition? This will restore initial fine art photographs and erase custom uploads.')) {
      const reset = resetPhotos();
      setPhotos(reset);
      setLikedIds(new Set());
      localStorage.removeItem('photo_site_likes');
      setActiveCategory('All');
      setSearchQuery('');
      setSelectedCameraFilter('All');
      setSelectedTagFilter('All');
    }
  };

  // --- index cycles for Lightbox arrows ---
  const handlePrevPhoto = () => {
    if (filteredPhotos.length === 0) return;
    const currentIdx = filteredPhotos.findIndex(p => p.id === selectedPhoto?.id);
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIdx]);
  };

  const handleNextPhoto = () => {
    if (filteredPhotos.length === 0) return;
    const currentIdx = filteredPhotos.findIndex(p => p.id === selectedPhoto?.id);
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIdx]);
  };

  return (
    <div className="min-h-screen bg-background-brand text-on-surface flex" id="photo-site-core">
      {/* SIDEBAR NAVIGATION PANEL - Artistic Flair specifications */}
      <aside className="hidden md:flex w-20 border-r border-white/10 flex-col items-center py-10 justify-between bg-surface-dim shrink-0 select-none sticky top-0 h-screen z-10">
        <div className="rotate-180 [writing-mode:vertical-lr] text-[10px] tracking-[0.4em] uppercase opacity-40 font-mono text-center">
          MNML / EXHIBITION CODES
        </div>
        <div className="h-32 w-[1px] bg-white/10 my-4" />
        <div className="rotate-180 [writing-mode:vertical-lr] text-[11px] tracking-[0.5em] uppercase font-bold text-[#FF3E00] font-mono text-center">
          FINE-ART ARCHIVES
        </div>
      </aside>

      {/* Main Container - filled with relative items */}
      <div className="flex-1 py-10 px-6 md:px-16 relative overflow-hidden flex flex-col justify-between z-10">
        
        {/* Massive atmospheric background titles - Artistic Flair signature alignment */}
        <div className="absolute inset-x-0 top-36 overflow-hidden flex flex-col justify-center px-16 pointer-events-none opacity-[0.015] select-none z-0">
          <h1 className="text-[140px] md:text-[230px] leading-[0.75] font-serif italic tracking-tighter">ARCHIVE</h1>
          <h1 className="text-[140px] md:text-[230px] leading-[0.75] font-serif italic tracking-tighter self-end mt-16">EXPOSURES</h1>
        </div>

        {/* HEADER BAR - Uppercase Elegant Monochromatic Identity */}
        <header className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-16 select-none z-10 relative" id="primary-header">
          <div className="flex flex-col text-left">
            <h1 className="text-sm font-mono tracking-[0.4em] text-white font-bold uppercase flex items-center gap-2">
              <Aperture size={16} className="text-[#FF3E00] shrink-0 animate-spin" style={{ animationDuration: '60s' }} />
              MNML / <span className="text-[#FF3E00]">GALLERY</span>
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF3E00] opacity-80 mt-1">
              Fine-Art Curated System • Vol. I
            </span>
          </div>

          {/* Global Nav Toggles */}
          <div className="flex items-center flex-wrap gap-3">
            <button 
              type="button"
              onClick={() => {
                setIsCurationStudioOpen(!isCurationStudioOpen);
                if (isTelemetryOpen) setIsTelemetryOpen(false);
              }}
              className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-3.5 py-2.5 rounded transition-all cursor-pointer border ${isCurationStudioOpen ? 'bg-[#FF3E00] text-white border-[#FF3E00] font-semibold' : 'bg-transparent border-white/20 text-white hover:border-white'}`}
            >
              <Plus size={14} />
              <span>Exhibition Studio</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setIsTelemetryOpen(!isTelemetryOpen);
                if (isCurationStudioOpen) setIsCurationStudioOpen(false);
              }}
              className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-3.5 py-2.5 rounded transition-all cursor-pointer border ${isTelemetryOpen ? 'bg-[#FF3E00] text-white border-[#FF3E00] font-semibold' : 'bg-transparent border-white/20 text-white hover:border-white'}`}
            >
              <BarChart2 size={14} />
              <span>Telemetry Ledger</span>
            </button>

            <button
              type="button"
              onClick={handleFactoryReset}
              className="p-2.5 rounded border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              title="Restore default curations"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </header>

      {/* DYNAMIC COLLAPSIBLE WORKSPACES */}
      <div className="max-w-7xl mx-auto mb-12">
        <AnimatePresence mode="wait">
          {isCurationStudioOpen && (
            <div className="mb-8" id="collapsible-curation-studio">
              <UploadWorkspace 
                onAddPhoto={handleAddPhoto} 
                onClose={() => setIsCurationStudioOpen(false)} 
              />
            </div>
          )}

          {isTelemetryOpen && (
            <div className="mb-8" id="collapsible-telemetry-panel">
              <StatsPanel photos={photos} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* HERO INTRODUCTION - Immersive Display Headlines in Plus Jakarta Specs */}
      <section className="max-w-7xl mx-auto text-left mb-16 select-none" id="exhibition-editorial-hero">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8e9192] block mb-2">
          INTRODUCING ARCHIVE EXPOSURES
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-sans font-extrabold tracking-tight text-white leading-tight">
          THE SILENT <span className="font-normal italic text-gray-500">FRAME.</span>
        </h2>
        <p className="font-sans text-gray-400 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
          An interactive laboratory celebrating light, scale, and optics. Filter exposures by camera machinery, examine embedded high-fidelity EXIF records, or log custom assets.
        </p>
      </section>

      {/* FILTER & LAYOUT MANAGEMENT AREA */}
      <section className="max-w-7xl mx-auto mb-10 space-y-4" id="filters-workspace">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-5">
          
          {/* Main Category Switches in humble humanistic labels */}
          <div className="flex flex-wrap items-center gap-1.5" id="category-selector-group">
            {['All', 'Street', 'Architecture', 'Landscape', 'Editorial', 'Portrait'].map((cat) => {
              const count = cat === 'All' 
                ? photos.length 
                : photos.filter(p => p.category === cat).length;
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-mono uppercase px-3 py-1.5 rounded transition-all tracking-wider select-none cursor-pointer border ${isActive ? 'bg-[#FF3E00] text-white border-[#FF3E00] font-semibold' : 'bg-[#0f0f0f] border-white/5 text-gray-400 hover:text-white hover:border-white/10'}`}
                >
                  {cat} <span className="text-[10px] opacity-50 ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Realtime Search bar */}
            <div className="relative flex-1 lg:flex-none w-full lg:w-64 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs, tags, coordinates..."
                className="w-full bg-surface-low text-white placeholder-gray-500 text-xs pl-9 pr-8 py-2.5 rounded border border-white/10 focus:border-white outline-none transition-colors font-mono"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Layout view controls */}
            <div className="flex items-center gap-1.5 bg-surface-low border border-white/10 p-1 rounded">
              <button
                onClick={() => setLayoutMode('editorial-grid')}
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${layoutMode === 'editorial-grid' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                title="12-Column Editorial Grid"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setLayoutMode('art-book')}
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${layoutMode === 'art-book' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                title="Large Art Book Layout"
              >
                <BookOpen size={14} />
              </button>
              <button
                onClick={() => setLayoutMode('technical-list')}
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${layoutMode === 'technical-list' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                title="Compact Technical List"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setLayoutMode('slideshow')}
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${layoutMode === 'slideshow' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                title="Virtual Playback Slideshow"
              >
                <Play size={14} />
              </button>
            </div>

            {/* Advanced Filters expander */}
            <button
              onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
              className={`p-2.5 rounded border transition-colors cursor-pointer flex items-center gap-2 text-xs font-mono uppercase tracking-wider ${isAdvancedFiltersOpen ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden md:inline">Specs Dial</span>
            </button>
          </div>

        </div>

        {/* Collapsible Advanced Filters (Specs Dial) */}
        <AnimatePresence>
          {isAdvancedFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-[#161616] rounded-md border border-white/5 p-4 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-on-surface">
                
                {/* Brand Filter */}
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">
                    Filter by Camera Manufacturer Brand
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedCameraFilter('All')}
                      className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${selectedCameraFilter === 'All' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-400 hover:text-white'}`}
                    >
                      All Machinery
                    </button>
                    {cameraBrandsPool.map(brand => (
                      <button
                        key={brand}
                        onClick={() => setSelectedCameraFilter(brand)}
                        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-all ${selectedCameraFilter === brand ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-400 hover:text-white'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">
                    Filter by Semantic Element Tag
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                    <button
                      onClick={() => setSelectedTagFilter('All')}
                      className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${selectedTagFilter === 'All' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-400 hover:text-white'}`}
                    >
                      All Tags
                    </button>
                    {tagsPool.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTagFilter(tag)}
                        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-all ${selectedTagFilter === tag ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-500 hover:text-white'}`}
                      >
                        #{tag.toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Filter Reset row */}
              {(selectedCameraFilter !== 'All' || selectedTagFilter !== 'All') && (
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedCameraFilter('All');
                      setSelectedTagFilter('All');
                    }}
                    className="text-[10px] font-mono text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    Reset advanced filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic active filters status display */}
        {(activeCategory !== 'All' || selectedCameraFilter !== 'All' || selectedTagFilter !== 'All' || searchQuery) && (
          <div className="flex justify-between items-center bg-[#1c1b1b] border border-white/5 px-4 py-2 text-[10px] font-mono rounded" id="filters-status-panel">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-500">ACTIVE PARAMETERS:</span>
              {activeCategory !== 'All' && (
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">
                  Category: {activeCategory}
                </span>
              )}
              {selectedCameraFilter !== 'All' && (
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">
                  Gear: {selectedCameraFilter}
                </span>
              )}
              {selectedTagFilter !== 'All' && (
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">
                  Tag: #{selectedTagFilter}
                </span>
              )}
              {searchQuery && (
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px] max-w-[150px] truncate">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
            
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setSelectedCameraFilter('All');
                setSelectedTagFilter('All');
              }}
              className="text-gray-400 hover:text-white hover:underline uppercase tracking-wide cursor-pointer ml-3"
            >
              Reset All
            </button>
          </div>
        )}
      </section>

      {/* RENDER DYNAMIC PHOTOS VIEWS & MODES */}
      <main className="max-w-7xl mx-auto mb-20 min-h-[40vh]" id="exhibition-primary-gallery">
        <AnimatePresence mode="popLayout">
          {layoutMode === 'slideshow' ? (
            <div key="inline-slideshow">
              <SlideshowWorkspace 
                photos={filteredPhotos} 
                onClose={() => setLayoutMode('editorial-grid')} 
                onOpenPhoto={(p) => setSelectedPhoto(p)}
              />
            </div>
          ) : layoutMode === 'technical-list' ? (
            <div key="technical-list">
              <TechnicalList 
                photos={filteredPhotos} 
                onOpenPhoto={(p) => setSelectedPhoto(p)}
                onLike={handleLike}
                likedIds={likedIds}
              />
            </div>
          ) : layoutMode === 'art-book' ? (
            // Immersively spaced large 1-column layouts
            <div key="art-book" className="flex flex-col gap-28 items-center max-w-3xl mx-auto">
              {filteredPhotos.map((photo) => {
                const isLiked = likedIds.has(photo.id);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                    transition={{ duration: 0.6 }}
                    key={photo.id}
                    className="w-full flex flex-col space-y-4 text-left select-none group"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="aspect-[3/2] overflow-hidden rounded-lg bg-surface-lowest border border-white/5 group-hover:border-white/20 transition-all cursor-pointer">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between pt-2 gap-4">
                      {/* Serif elegant visual title */}
                      <div className="max-w-md">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8e9192]">
                          {photo.category} Exposure
                        </span>
                        <h3 className="text-2xl font-plus-jakarta font-bold text-white mt-0.5">
                          {photo.title}
                        </h3>
                        <p className="font-sans text-xs text-gray-400 mt-2 leading-relaxed">
                          {photo.description}
                        </p>
                      </div>

                      {/* Side Technical values */}
                      <div className="font-mono text-[11px] text-gray-500 space-y-1.5 shrink-0 select-text">
                        <div className="text-white/80 font-semibold">{photo.exif.camera}</div>
                        <div>{photo.exif.lens}</div>
                        <div className="flex flex-wrap gap-2 text-[10px] text-gray-600">
                          <span>{photo.exif.focalLength}</span>
                          <span>{photo.exif.aperture}</span>
                          <span>{photo.exif.shutterSpeed}</span>
                          <span>ISO {photo.exif.iso}</span>
                        </div>
                        <div className="text-gray-600 block pt-1.5 text-[10px]">
                          CAPTURE IN {photo.location.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-white/10 pb-4 flex justify-between tracking-widest font-mono text-[10px] text-gray-600 items-center">
                      <span>CHRONO ARCHIVE: {photo.timestamp.substring(0, 10)}</span>
                      <button
                        onClick={(e) => handleLike(photo.id, e)}
                        className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-white transition-colors"
                      >
                        <Heart size={12} className={isLiked ? 'fill-white text-white' : ''} />
                        <span>{isLiked ? 'FAVORITED' : 'PRESERVE'}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              {filteredPhotos.length === 0 && (
                <div className="text-center font-mono text-xs text-gray-500 py-12">
                  NO PLATES MATCH CURRENT CRITERIA INDEX.
                </div>
              )}
            </div>
          ) : (
            // DEFAULT: Responsive Editorial Masonry / Balanced Grid
            // Desktop: 12-column grid pattern (using bento column widths, e.g. span 4 or 6)
            <div 
              key="editorial-grid" 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8"
            >
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onClick={() => setSelectedPhoto(photo)}
                  onLike={handleLike}
                  isLiked={likedIds.has(photo.id)}
                />
              ))}
              
              {filteredPhotos.length === 0 && (
                <div className="col-span-full text-center font-mono text-xs text-gray-500 py-16">
                  NO PHOTOGRAPHS LOGGED UNDER SPECIFIED CATEGORY FILTERS.
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* DETAILED DIALOG LIGHTBOX */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Lightbox
              photo={selectedPhoto}
              onClose={() => setSelectedPhoto(null)}
              onPrev={handlePrevPhoto}
              onNext={handleNextPhoto}
              onLike={handleLike}
              isLiked={likedIds.has(selectedPhoto.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER BAR - Understated, clean monochrome style without tech-larping logs */}
      <footer className="max-w-7xl mx-auto border-t border-white/10 pt-10 text-center text-xs font-mono text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4 select-none mt-20" id="primary-footer">
        <div className="flex flex-col items-start gap-1">
          <span>MNML PHOTO SYSTEM v1.3.0</span>
          <span className="text-[10px] text-gray-700">Digital Archive Workspace</span>
        </div>
        
        <div className="flex items-center gap-4 text-[11px]">
          <span>© {new Date().getFullYear()} Aspect Studio</span>
          <span className="text-gray-700">|</span>
          <button 
            onClick={handleFactoryReset}
            className="hover:text-white transition-colors cursor-pointer text-gray-500 underline decoration-white/20 hover:decoration-white"
          >
            Factory Reset App
          </button>
        </div>
      </footer>

      </div>
    </div>
  );
}
