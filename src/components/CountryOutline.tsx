import React, { useEffect, useRef, useState } from 'react';
import { getCountryGeoJSON } from '../services/geoJsonService';

interface CountryOutlineProps {
  countryCode3: string;
  countryName: string;
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[][][] | number[][][][];
}

interface GeoJSONFeature {
  type: string;
  properties?: Record<string, unknown>;
  geometry: GeoJSONGeometry;
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

export function CountryOutline({ countryCode3, countryName }: CountryOutlineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);

  useEffect(() => {
    loadGeoJSON();
  }, [countryName, countryCode3]);

  useEffect(() => {
    if (geoData && svgRef.current) {
      console.log('[Render] SVG ref ready, rendering...');
      renderGeoJSON(geoData);
    }
  }, [geoData, svgRef.current]);

  const loadGeoJSON = async () => {
    setIsLoading(true);
    setError(false);

    if (!countryCode3) {
      console.error('Missing countryCode3 for:', countryName);
      setError(true);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching GeoJSON for:', countryName, 'with code3:', countryCode3);
      const feature = await getCountryGeoJSON(countryCode3);

      if (!feature) {
        throw new Error('Country not found in GeoJSON data');
      }

      const geoJSON: GeoJSONData = {
        type: 'FeatureCollection',
        features: [feature]
      };

      setGeoData(geoJSON);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading GeoJSON:', err, 'Country:', countryName, 'Code3:', countryCode3);
      setError(true);
      setIsLoading(false);
    }
  };

  const renderGeoJSON = (geoJSON: GeoJSONData) => {
    console.log('[Render] Starting render for', countryName);
    if (!svgRef.current) {
      console.error('[Render] svgRef.current is null!');
      return;
    }

    const svg = svgRef.current;
    svg.innerHTML = '';

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const allPaths: string[] = [];

    if (!geoJSON.features || geoJSON.features.length === 0) {
      console.error('[Render] No features in GeoJSON', geoJSON);
      setError(true);
      return;
    }

    console.log(`[Render] Processing ${geoJSON.features.length} features for ${countryName}`);

    geoJSON.features.forEach((feature) => {
      const geometry = feature.geometry;
      if (!geometry) {
        console.warn('Feature missing geometry', feature);
        return;
      }

      if (geometry.type === 'Polygon') {
        const polygon = geometry.coordinates as number[][][];
        polygon.forEach((ring) => {
          const pathData = ringToPath(ring);
          if (pathData) {
            allPaths.push(pathData);
            updateBounds(ring);
          }
        });
      } else if (geometry.type === 'MultiPolygon') {
        const multiPolygon = geometry.coordinates as number[][][][];
        multiPolygon.forEach((polygon) => {
          polygon.forEach((ring) => {
            const pathData = ringToPath(ring);
            if (pathData) {
              allPaths.push(pathData);
              updateBounds(ring);
            }
          });
        });
      }
    });

    if (allPaths.length === 0) {
      console.error('[Render] No valid paths generated from GeoJSON for', countryName);
      setError(true);
      return;
    }

    console.log(`[Render] Generated ${allPaths.length} paths for ${countryName}`);

    function updateBounds(ring: number[][]) {
      ring.forEach(([lon, lat]) => {
        minX = Math.min(minX, lon);
        minY = Math.min(minY, lat);
        maxX = Math.max(maxX, lon);
        maxY = Math.max(maxY, lat);
      });
    }

    function ringToPath(ring: number[][]): string {
      if (ring.length === 0) return '';

      const path = ring.map(([lon, lat], index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command}${lon},${-lat}`;
      });

      return path.join(' ') + ' Z';
    }

    const width = maxX - minX;
    const height = maxY - minY;

    if (!isFinite(width) || !isFinite(height) || width <= 0 || height <= 0) {
      console.error('[Render] Invalid bounds:', { minX, maxX, minY, maxY, width, height });
      setError(true);
      return;
    }

    const padding = Math.max(width, height) * 0.1;
    const viewBox = `${minX - padding} ${-maxY - padding} ${width + padding * 2} ${height + padding * 2}`;

    console.log('[Render] Setting viewBox:', viewBox);
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    allPaths.forEach((pathData, index) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'currentColor');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '0.1');
      path.setAttribute('stroke-linejoin', 'round');
      g.appendChild(path);
    });

    svg.appendChild(g);
    console.log('[Render] ✓ SVG rendering complete. Paths added:', allPaths.length);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-400 p-4">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="text-sm font-medium mb-1">Map outline not available</p>
          <p className="text-xs opacity-75">{countryName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg
        ref={svgRef}
        className="max-w-full max-h-full text-blue-600 dark:text-blue-400"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
