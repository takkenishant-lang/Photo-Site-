/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Photo } from './types';

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'tokyo-shibuya-neon',
    title: 'Neon Drift',
    photographer: 'Eiji Sato',
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=1200',
    category: 'Street',
    description: 'Rain-slicked asphalt reflecting Tokyo’s digital canvas during midnight hours.',
    location: 'Shibuya, Tokyo',
    timestamp: '2026-04-12T15:23:40Z',
    exif: {
      camera: 'Sony A7R V',
      lens: 'FE 35mm f/1.4 GM',
      focalLength: '35mm',
      aperture: 'f/1.4',
      shutterSpeed: '1/160s',
      iso: 800,
      resolution: '9504 × 6336',
      colorProfile: 'Real-time Lut / S-Cinetone'
    },
    curated: true,
    likes: 342,
    tags: ['Neon', 'Night', 'Reflections', 'Rain']
  },
  {
    id: 'nyc-street-shadow',
    title: 'The Great Divide',
    photographer: 'Sarah Jenkins',
    url: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=1200',
    category: 'Street',
    description: 'A singular pedestrian cutting through high-contrast shadows cast by Manhattan high-rises.',
    location: 'Lower East Side, NYC',
    timestamp: '2026-03-08T09:44:12Z',
    exif: {
      camera: 'Leica M11',
      lens: 'Summicron-M 28mm f/2 ASPH',
      focalLength: '28mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/1000s',
      iso: 200,
      resolution: '9528 × 6328',
      colorProfile: 'Leica Monochrome Classic'
    },
    curated: true,
    likes: 512,
    tags: ['Shadows', 'Monochrome', 'Geometry', 'Silhouette']
  },
  {
    id: 'minimal-underpass-scale',
    title: 'Underpass Cyan',
    photographer: 'Marcus Vance',
    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200',
    category: 'Street',
    description: 'Symmetric concrete structural columns illuminated by cold underpass lights.',
    location: 'Berlin, Germany',
    timestamp: '2026-05-02T22:15:30Z',
    exif: {
      camera: 'Sony A7R V',
      lens: 'FE 24-70mm f/2.8 GM II',
      focalLength: '24mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/60s',
      iso: 1600,
      resolution: '9504 × 6336',
      colorProfile: 'Eterna Sim'
    },
    curated: false,
    likes: 189,
    tags: ['Minimal', 'Symmetry', 'Lines', 'Industrial']
  },
  {
    id: 'brutalist-concrete-geometry',
    title: 'Monolithic Void',
    photographer: 'Hana Lindqvist',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    category: 'Architecture',
    description: 'Intersecting precast concrete planes creating abstract negative shapes against a white sky.',
    location: 'Zurich, Switzerland',
    timestamp: '2026-01-15T11:05:00Z',
    exif: {
      camera: 'Fujifilm GFX 100S',
      lens: 'GF 45mm f/2.8 R WR',
      focalLength: '45mm (36mm equiv.)',
      aperture: 'f/8.0',
      shutterSpeed: '1/250s',
      iso: 100,
      resolution: '11648 × 8736',
      colorProfile: 'PRO Neg. Hi'
    },
    curated: true,
    likes: 729,
    tags: ['Brutalist', 'Concrete', 'Geometry', 'Abstract']
  },
  {
    id: 'architectural-spiral-lines',
    title: 'Chamber of Light',
    photographer: 'Diana Rossi',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    category: 'Architecture',
    description: 'Looking directly up a winding spiral atrium, utilizing soft directional natural light.',
    location: 'Vatican City',
    timestamp: '2026-02-28T14:30:15Z',
    exif: {
      camera: 'Hasselblad X2D 100C',
      lens: 'XCD 38mm f/2.5',
      focalLength: '38mm (30mm equiv.)',
      aperture: 'f/4.0',
      shutterSpeed: '1/125s',
      iso: 64,
      resolution: '11656 × 8742',
      colorProfile: 'Hasselblad Natural Color'
    },
    curated: true,
    likes: 924,
    tags: ['Spiral', 'Symmetry', 'Atrium', 'Scale']
  },
  {
    id: 'modernist-concrete-facade',
    title: 'Structured Rythm',
    photographer: 'Hana Lindqvist',
    url: 'https://images.unsplash.com/photo-1508333706533-1ec43ecb1606?auto=format&fit=crop&q=80&w=1200',
    category: 'Architecture',
    description: 'Grid patterns of balconies and sunshades casting a sharp, rhythmic shadow sequence.',
    location: 'Marseille, France',
    timestamp: '2026-05-18T16:05:22Z',
    exif: {
      camera: 'Leica M11',
      lens: 'Apo-Summicron-M 50mm f/2 ASPH',
      focalLength: '50mm',
      aperture: 'f/11',
      shutterSpeed: '1/500s',
      iso: 64,
      resolution: '9528 × 6328',
      colorProfile: 'Classic Chrome'
    },
    curated: false,
    likes: 125,
    tags: ['Balcony', 'Shadows', 'Rhythm', 'Minimal']
  },
  {
    id: 'misty-forest-silent',
    title: 'The Whispering Pines',
    photographer: 'Alistair Thorne',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200',
    category: 'Landscape',
    description: 'Old-growth pine trees standing in heavy coastal fog, creating flat, atmospheric silhouettes.',
    location: 'Oregon Coast, USA',
    timestamp: '2026-02-14T07:11:00Z',
    exif: {
      camera: 'Fujifilm X-T5',
      lens: 'XF 18-55mm f/2.8-4 R LM OIS',
      focalLength: '35mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/125s',
      iso: 400,
      resolution: '7728 × 5152',
      colorProfile: 'Nostalgic Neg.'
    },
    curated: true,
    likes: 418,
    tags: ['Forest', 'Fog', 'Trees', 'Atmospheric']
  },
  {
    id: 'black-beach-coastal',
    title: 'Volcanic Surrender',
    photographer: 'Viggo Karlsson',
    url: 'https://images.unsplash.com/photo-1504893524553-ac55fce698be?auto=format&fit=crop&q=80&w=1200',
    category: 'Landscape',
    description: 'The relentless North Atlantic waves breaking onto basalt black sand beaches, creating white foam lines.',
    location: 'Vik, Iceland',
    timestamp: '2025-11-30T13:42:09Z',
    exif: {
      camera: 'Phase One XT',
      lens: 'Rodenstock HR Digaron-W 23mm f/5.6',
      focalLength: '23mm (15mm equiv.)',
      aperture: 'f/8.0',
      shutterSpeed: '1.6s',
      iso: 50,
      resolution: '14204 × 10652',
      colorProfile: 'Phase One IIQ RAW'
    },
    curated: true,
    likes: 856,
    tags: ['Coastal', 'Ocean', 'Long Exposure', 'Basalt']
  },
  {
    id: 'sahara-dunes-curve',
    title: 'Golden Divide',
    photographer: 'Karim Mansour',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1200',
    category: 'Landscape',
    description: 'The sharp ridge of a desert wind-sculpted sand dune splitting illuminated and shadow-drowned slopes.',
    location: 'Erg Chebbi, Morocco',
    timestamp: '2026-04-30T17:50:00Z',
    exif: {
      camera: 'Canon EOS R5',
      lens: 'RF 70-200mm f/2.8 L IS USM',
      focalLength: '135mm',
      aperture: 'f/5.6',
      shutterSpeed: '1/320s',
      iso: 100,
      resolution: '8192 × 5464',
      colorProfile: 'Landscape Neutral'
    },
    curated: true,
    likes: 673,
    tags: ['Desert', 'Dune', 'Shadows', 'Minimal']
  },
  {
    id: 'fashion-editorial-bw',
    title: 'Chiaroscuro Suit',
    photographer: 'Amari Vance',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    category: 'Editorial',
    description: 'High-contrast studio lighting highlighting structural shoulder lines and a tailored silhouette.',
    location: 'Paris Studio, France',
    timestamp: '2026-03-22T10:14:55Z',
    exif: {
      camera: 'Canon EOS R5',
      lens: 'RF 85mm f/1.2 L USM DS',
      focalLength: '85mm',
      aperture: 'f/1.2',
      shutterSpeed: '1/125s',
      iso: 100,
      resolution: '8192 × 5464',
      colorProfile: 'Faithful Monochrome'
    },
    curated: true,
    likes: 890,
    tags: ['Studio', 'BW', 'Fashion', 'Sartorial']
  },
  {
    id: 'cinematic-portrait-ambient',
    title: 'The Curation Space',
    photographer: 'Hana Lindqvist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    category: 'Portrait',
    description: 'A quiet, introspective portrait in natural ambient window illumination inside a concrete studio.',
    location: 'Copenhagen, Denmark',
    timestamp: '2026-01-20T14:48:30Z',
    exif: {
      camera: 'Leica SL2',
      lens: 'Summilux-SL 50mm f/1.4 ASPH',
      focalLength: '50mm',
      aperture: 'f/1.4',
      shutterSpeed: '1/200s',
      iso: 160,
      resolution: '8368 × 5584',
      colorProfile: 'Leica Classic Chrome'
    },
    curated: true,
    likes: 1045,
    tags: ['Ambient', 'Natural Light', 'Concrete', 'Introspection']
  },
  {
    id: 'moody-candid-portrait',
    title: 'Subtle Gaze',
    photographer: 'Sarah Jenkins',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200',
    category: 'Portrait',
    description: 'Close-quarters candid framing with a shallow depth of field, drawing attention purely to expression.',
    location: 'London, UK',
    timestamp: '2026-05-10T12:05:00Z',
    exif: {
      camera: 'Leica M11',
      lens: 'Noctilux-M 50mm f/0.95 ASPH',
      focalLength: '50mm',
      aperture: 'f/0.95',
      shutterSpeed: '1/500s',
      iso: 64,
      resolution: '9528 × 6328',
      colorProfile: 'Warm Portrait Preset'
    },
    curated: false,
    likes: 402,
    tags: ['Candid', 'Bokeh', 'Expression', 'Warm']
  }
];

const LOCAL_STORAGE_KEY = 'photo_site_galleries_v1';

export function getPhotos(): Photo[] {
  if (typeof window === 'undefined') return INITIAL_PHOTOS;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PHOTOS));
    return INITIAL_PHOTOS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PHOTOS;
  }
}

export function savePhotos(photos: Photo[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(photos));
  }
}

export function resetPhotos(): Photo[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PHOTOS));
  }
  return INITIAL_PHOTOS;
}
