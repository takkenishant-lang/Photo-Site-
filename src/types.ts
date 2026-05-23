/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExifData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  resolution: string;
  colorProfile?: string;
}

export interface Photo {
  id: string;
  title: string;
  photographer: string;
  url: string;
  category: string;
  description: string;
  location: string;
  timestamp: string;
  exif: ExifData;
  curated: boolean;
  likes: number;
  tags: string[];
}

export type ViewLayoutMode = 'editorial-grid' | 'art-book' | 'technical-list' | 'slideshow';
