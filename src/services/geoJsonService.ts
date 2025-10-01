interface GeoJSONGeometry {
  type: string;
  coordinates: number[][][] | number[][][][];
}

interface GeoJSONFeature {
  type: string;
  id?: string;
  properties?: {
    name?: string;
    NAME?: string;
    iso_a3?: string;
    ISO_A3?: string;
    [key: string]: unknown;
  };
  geometry: GeoJSONGeometry;
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

let cachedGeoJSON: GeoJSONData | null = null;

export async function loadAllCountriesGeoJSON(): Promise<GeoJSONData> {
  if (cachedGeoJSON) {
    console.log('[GeoJSON] Returning cached data with', cachedGeoJSON.features.length, 'countries');
    return cachedGeoJSON;
  }

  const url = '/countries.geojson';

  try {
    console.log('[GeoJSON] Fetching from:', url);
    const response = await fetch(url);
    console.log('[GeoJSON] Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Failed to fetch countries GeoJSON: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[GeoJSON] Parsed JSON, features count:', data.features?.length);

    cachedGeoJSON = data;
    console.log('[GeoJSON] Successfully loaded', cachedGeoJSON.features.length, 'countries');
    console.log('[GeoJSON] Sample countries:', cachedGeoJSON.features.slice(0, 3).map(f => ({
      name: f.properties?.NAME || f.properties?.name,
      code: f.properties?.ISO_A3 || f.properties?.iso_a3
    })));

    return cachedGeoJSON;
  } catch (error) {
    console.error('[GeoJSON] Error loading countries GeoJSON:', error);
    throw error;
  }
}

export async function getCountryGeoJSON(countryCode3: string): Promise<GeoJSONFeature | null> {
  console.log('[GeoJSON] Looking for country with code:', countryCode3);
  const allCountries = await loadAllCountriesGeoJSON();

  const feature = allCountries.features.find(f => {
    const isoCode = f.properties?.ISO_A3 || f.properties?.iso_a3;
    return isoCode?.toLowerCase() === countryCode3.toLowerCase();
  });

  if (!feature) {
    console.warn('[GeoJSON] No GeoJSON found for 3-letter country code:', countryCode3);
    console.warn('[GeoJSON] Available codes sample:', allCountries.features.slice(0, 5).map(f => f.properties?.ISO_A3 || f.properties?.iso_a3));
    return null;
  }

  const countryName = feature.properties?.NAME || feature.properties?.name;
  console.log('[GeoJSON] ✓ Found feature for:', countryCode3, 'Name:', countryName);
  return feature;
}
