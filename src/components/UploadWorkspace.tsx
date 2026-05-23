/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Sparkles, Upload, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Photo, ExifData } from '../types';

interface UploadWorkspaceProps {
  onAddPhoto: (photo: Photo) => void;
  onClose: () => void;
}

interface CameraPreset {
  name: string;
  brand: string;
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  resolution: string;
  colorProfile: string;
  tags: string[];
}

const PRESETS: CameraPreset[] = [
  {
    name: 'Leica Summicron Street',
    brand: 'Leica',
    camera: 'Leica M11',
    lens: 'Apo-Summicron-M 35mm f/2 ASPH',
    focalLength: '35mm',
    aperture: 'f/2.8',
    shutterSpeed: '1/500s',
    iso: 200,
    resolution: '9528 × 6328',
    colorProfile: 'Leica Monochrome Classic',
    tags: ['Street', 'Monochrome', 'Shadows', 'Decisive Moment']
  },
  {
    name: 'Fujifilm GFX Editorial',
    brand: 'Fujifilm',
    camera: 'Fujifilm GFX 100S',
    lens: 'GF 80mm f/1.7 R WR',
    focalLength: '80mm (63mm equiv.)',
    aperture: 'f/1.7',
    shutterSpeed: '1/125s',
    iso: 100,
    resolution: '11648 × 8736',
    colorProfile: 'Classic Neg.',
    tags: ['Editorial', 'Analog Look', 'Grain', 'Studio']
  },
  {
    name: 'Hasselblad Landscape',
    brand: 'Hasselblad',
    camera: 'Hasselblad X2D 100C',
    lens: 'XCD 21mm f/4',
    focalLength: '21mm (17mm equiv.)',
    aperture: 'f/11',
    shutterSpeed: '1.2s',
    iso: 64,
    resolution: '11656 × 8742',
    colorProfile: 'Hasselblad Natural Color Solution',
    tags: ['Landscape', 'Fjord', 'Long Exposure', 'Infinity']
  },
  {
    name: 'Sony High-Speed Action',
    brand: 'Sony',
    camera: 'Sony A1',
    lens: 'FE 135mm f/1.8 GM',
    focalLength: '135mm',
    aperture: 'f/1.8',
    shutterSpeed: '1/4000s',
    iso: 400,
    resolution: '8640 × 5760',
    colorProfile: 'S-Log3 Cinetone',
    tags: ['Action', 'Portrait', 'Razor Sharp', 'Bokeh']
  }
];

// Beautiful default premium photolink selections to avoid broken image links
const PHOTO_URL_PRESETS = [
  { name: 'Rainy Night Street', url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=1200', category: 'Street' },
  { name: 'Abstract Architectural Slab', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200', category: 'Architecture' },
  { name: 'Misty Wilderness Cliffs', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200', category: 'Landscape' },
  { name: 'Elegant Studio Portrait', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200', category: 'Portrait' },
];

export const UploadWorkspace: React.FC<UploadWorkspaceProps> = ({
  onAddPhoto,
  onClose,
}) => {
  // Main form states
  const [title, setTitle] = useState('');
  const [photographer, setPhotographer] = useState('Nishant Takke');
  const [url, setUrl] = useState(PHOTO_URL_PRESETS[0].url);
  const [category, setCategory] = useState('Street');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('New York City, USA');
  const [tagsInput, setTagsInput] = useState('Minimal, Shadow, Architecture');

  // EXIF states
  const [camera, setCamera] = useState('Sony A7R V');
  const [lens, setLens] = useState('FE 35mm f/1.4 GM');
  const [focalLength, setFocalLength] = useState('35mm');
  const [aperture, setAperture] = useState('f/1.4');
  const [shutterSpeed, setShutterSpeed] = useState('1/160s');
  const [iso, setIso] = useState(800);
  const [resolution, setResolution] = useState('9504 × 6336');
  const [colorProfile, setColorProfile] = useState('Real-time LUT');

  const [dragActive, setDragActive] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  // Apply one of the presets to the form fields
  const applyPreset = (preset: CameraPreset) => {
    setCamera(preset.camera);
    setLens(preset.lens);
    setFocalLength(preset.focalLength);
    setAperture(preset.aperture);
    setShutterSpeed(preset.shutterSpeed);
    setIso(preset.iso);
    setResolution(preset.resolution);
    setColorProfile(preset.colorProfile);
    setTagsInput(preset.tags.join(', '));
  };

  // Drag over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Simulating drop file upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorStatus('Please upload an image file type only.');
        return;
      }
      
      // Simulate file load and convert to object URL
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      setTitle(file.name.split('.')[0].replace(/[-_]/g, ' '));
      setErrorStatus('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorStatus('Please enter a photo title.');
      return;
    }
    if (!url.trim()) {
      setErrorStatus('Please choose or paste an image URL.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newPhoto: Photo = {
      id: `custom-photo-${Date.now()}`,
      title,
      photographer: photographer || 'Anonymous',
      url,
      category,
      description: description || 'No archive description written.',
      location: location || 'Global Latitude',
      timestamp: new Date().toISOString(),
      exif: {
        camera,
        lens,
        focalLength,
        aperture,
        shutterSpeed,
        iso,
        resolution,
        colorProfile,
      },
      curated: false,
      likes: 1,
      tags: tagsArray.length > 0 ? tagsArray : ['FineArt', 'Archive']
    };

    onAddPhoto(newPhoto);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-surface-low border border-white/10 rounded-lg p-6 font-sans relative text-left"
    >
      <button 
        onClick={onClose}
        className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Close studio form"
      >
        <X size={18} />
      </button>

      <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#8e9192]">
        Exhibition Studio Workspace
      </span>
      <h2 className="text-2xl font-plus-jakarta font-bold tracking-tight text-white mb-2">
        Curate & Add Masterpiece
      </h2>
      <p className="text-xs text-gray-400 max-w-xl mb-6">
        Log new photography assets into your localized state. Use high-performance templates or custom-calibrate each EXIF dial to reflect precise mechanics.
      </p>

      {/* Camera Gear Templates Selector */}
      <div className="mb-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-2">
          Apply Professional Gear Presets (EXIF Auto-loader)
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left p-2.5 rounded border border-white/5 hover:border-white/20 bg-surface-lowest text-xs font-mono transition-colors cursor-pointer"
            >
              <div className="text-white/80 font-bold truncate flex items-center justify-between">
                <span>{preset.camera}</span>
                <Sparkles size={10} className="text-[#FF3E00] opacity-90 ml-1" />
              </div>
              <div className="text-gray-500 text-[9px] mt-0.5 truncate">{preset.lens}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Error bar */}
        {errorStatus && (
          <div className="bg-red-950/40 border border-red-500/20 text-red-200 text-xs px-3 py-2.5 rounded flex items-center gap-2 font-mono">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Visual Selection Section */}
          <div className="space-y-4">
            
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#8e9192] border-b border-white/5 pb-1 select-none">
              1. Visual & Source Selection
            </h3>

            {/* Drag and Drop Box */}
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed ${dragActive ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/25'} rounded-lg p-5 text-center transition-colors relative cursor-pointer group`}
            >
              <input 
                type="file" 
                id="file-upload-input"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const objectUrl = URL.createObjectURL(e.target.files[0]);
                    setUrl(objectUrl);
                    setTitle(e.target.files[0].name.split('.')[0].replace(/[-_]/g, ' '));
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <Upload size={24} className="mx-auto text-gray-500 group-hover:text-white transition-colors mb-2" />
              <p className="text-xs text-white/90">Drag & drop raw file, or click to choose</p>
              <p className="text-[10px] text-gray-500 mt-1">Supports JPEG, JPG, PNG or transparent PNGs</p>
            </div>

            {/* Pasting URL or Presets */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/55 block">
                Pasted Image URL Or Presets
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste URL (https://...)"
                  className="w-full bg-surface-lowest text-white placeholder-gray-600 border border-white/10 focus:border-white text-xs px-3 py-2.5 rounded outline-none transition-colors font-mono"
                />
              </div>

              {/* URL Sample Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PHOTO_URL_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setUrl(p.url);
                      setCategory(p.category);
                      if (!title) setTitle(p.name);
                    }}
                    className={`text-[9px] font-mono px-2 py-1 rounded-sm border ${url === p.url ? 'bg-[#FF3E00] text-white border-[#FF3E00]' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/25'} cursor-pointer transition-all`}
                  >
                    Preset: {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Live Preview */}
            {url && (
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-1.5">
                  Live View Boundary Reference
                </span>
                <div className="aspect-[3/2] w-full bg-surface-lowest rounded overflow-hidden border border-white/5">
                  <img 
                    src={url} 
                    alt="Preview content placeholder" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover text-xs text-gray-600 flex items-center justify-center bg-black/40"
                    onError={() => {
                      setErrorStatus('The specified URL is unreachable or invalid. Please check link validity.');
                    }}
                    onLoad={() => {
                      if (errorStatus === 'The specified URL is unreachable or invalid. Please check link validity.') {
                        setErrorStatus('');
                      }
                    }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* Curation details Input Fields */}
          <div className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8e9192] border-b border-white/5 pb-1 select-none">
                2. Curatorial Context
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/55 block mb-1">
                    Photo Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spectral Arch"
                    className="w-full bg-surface-lowest text-white placeholder-gray-600 border border-white/10 focus:border-white text-xs px-3 py-2.5 rounded outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/55 block mb-1">
                    Curation Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-3 py-2.5 rounded outline-none transition-colors cursor-pointer"
                  >
                    <option value="Street">Street</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Portrait">Portrait</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/55 block mb-1">
                    Photographer
                  </label>
                  <input
                    type="text"
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-3 py-2.5 rounded outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/55 block mb-1">
                    Capture Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-3 py-2.5 rounded outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/55 block mb-1">
                  Exhibition Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain lighting, atmosphere, context, historical relevance of this photographic plate..."
                  rows={2}
                  className="w-full bg-surface-lowest text-white placeholder-gray-600 border border-white/10 focus:border-white text-xs px-3 py-2 rounded outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/55 block mb-1">
                  Descriptive Tags (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Geometry, Shadow, brutalist"
                  className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-3 py-2.5 rounded outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8e9192] border-b border-white/5 pb-1 select-none">
                3. Technical EXIF Spec Setup
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-0.5">
                    Camera Body
                  </label>
                  <input
                    type="text"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-2.5 py-2 rounded outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-0.5">
                    Optics Glass Lens
                  </label>
                  <input
                    type="text"
                    value={lens}
                    onChange={(e) => setLens(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-2.5 py-2 rounded outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-0.5 truncate">
                    Focal Length
                  </label>
                  <input
                    type="text"
                    value={focalLength}
                    onChange={(e) => setFocalLength(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-2 py-2 rounded outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-0.5 truncate">
                    Aperture
                  </label>
                  <input
                    type="text"
                    value={aperture}
                    onChange={(e) => setAperture(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-2 py-2 rounded outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-0.5 truncate">
                    Shutter
                  </label>
                  <input
                    type="text"
                    value={shutterSpeed}
                    onChange={(e) => setShutterSpeed(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-2 py-2 rounded outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-0.5 truncate">
                    ISO
                  </label>
                  <input
                    type="number"
                    value={iso}
                    onChange={(e) => setIso(Number(e.target.value))}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-2 py-2 rounded outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-0.5">
                    Sensor Resolution
                  </label>
                  <input
                    type="text"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-2.5 py-2 rounded outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-0.5">
                    Emulation Profile
                  </label>
                  <input
                    type="text"
                    value={colorProfile}
                    onChange={(e) => setColorProfile(e.target.value)}
                    placeholder="Classic Chrome"
                    className="w-full bg-surface-lowest text-white border border-white/10 focus:border-white text-xs px-2.5 py-2 rounded outline-none font-mono"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Action button rows */}
        <div className="border-t border-white/10 pt-5 flex justify-end gap-3.5 items-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="bg-[#FF3E00] hover:bg-[#E03600] text-white font-mono text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg border border-[#FF3E00]"
          >
            <span>Lock into Exhibition</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </form>
    </motion.div>
  );
};
