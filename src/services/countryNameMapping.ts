export const countryNameToGeoJSON: Record<string, string> = {
  'United States': 'usa',
  'United Kingdom': 'united_kingdom',
  'South Korea': 'south_korea',
  'North Korea': 'north_korea',
  'Czech Republic': 'czech_republic',
  'Dominican Republic': 'dominican_republic',
  'Central African Republic': 'central_african_republic',
  'Democratic Republic of the Congo': 'democratic_congo',
  'Republic of the Congo': 'congo',
  'Congo': 'congo',
  'DR Congo': 'democratic_congo',
  'Bosnia and Herzegovina': 'bosnia_and_herzegovina',
  'Trinidad and Tobago': 'trinidad_and_tobago',
  'Antigua and Barbuda': 'antigua_and_barbuda',
  'Saint Kitts and Nevis': 'saint_kitts_and_nevis',
  'Saint Vincent and the Grenadines': 'saint_vincent_and_the_grenadines',
  'São Tomé and Príncipe': 'sao_tome_and_principe',
  'Côte d\'Ivoire': 'cote_divoire',
  'Ivory Coast': 'cote_divoire',
  'United Arab Emirates': 'united_arab_emirates',
};

export function getGeoJSONFilename(countryName: string): string {
  if (countryNameToGeoJSON[countryName]) {
    return countryNameToGeoJSON[countryName];
  }

  return countryName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}
