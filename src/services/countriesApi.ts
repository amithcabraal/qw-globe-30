import { Country } from '../types';

interface RestCountryResponse {
  name: {
    common: string;
  };
  cca2: string;
  cca3: string;
  capital?: string[];
  population: number;
  region: string;
  flags: {
    svg: string;
    png: string;
  };
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
}

const COUNTRIES_CACHE_KEY = 'countries_cache';
const CACHE_VERSION = 3;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const funFacts: Record<string, string> = {
  'United States': 'Home to the world\'s largest economy and Hollywood.',
  'China': 'Has the world\'s longest wall, stretching over 13,000 miles.',
  'India': 'The birthplace of yoga and has over 22 official languages.',
  'Brazil': 'Contains 60% of the Amazon rainforest.',
  'Russia': 'The largest country by land area, spanning 11 time zones.',
  'Japan': 'Has more than 6,800 islands.',
  'Germany': 'Known for engineering excellence and Oktoberfest.',
  'France': 'The most visited country in the world.',
  'United Kingdom': 'Once ruled over a quarter of the world\'s population.',
  'Italy': 'Has more UNESCO World Heritage Sites than any other country.',
  'Canada': 'Has the longest coastline in the world.',
  'Australia': 'Home to more kangaroos than people.',
  'Mexico': 'Birthplace of chocolate and invented color television.',
  'Spain': 'Second most mountainous country in Europe.',
  'Indonesia': 'Made up of over 17,000 islands.',
  'South Korea': 'World leader in internet connectivity.',
  'Turkey': 'Straddles two continents: Europe and Asia.',
  'Saudi Arabia': 'The world\'s largest oil exporter.',
  'Argentina': 'Invented the tango dance.',
  'South Africa': 'Has 11 official languages.',
  'Egypt': 'Home to the last remaining ancient wonder of the world, the Great Pyramid.',
  'Nigeria': 'Africa\'s most populous country and largest economy.',
  'Ethiopia': 'One of the oldest nations, never colonized by Europeans.',
  'Kenya': 'The birthplace of long-distance running champions.',
  'Morocco': 'Has a city painted entirely blue, Chefchaouen.',
  'Algeria': 'The largest country in Africa by area.',
  'Ghana': 'First African country to gain independence in 1957.',
  'Tanzania': 'Home to Mount Kilimanjaro, Africa\'s highest peak.',
  'Uganda': 'Has the source of the Nile River.',
  'Angola': 'One of the fastest-growing economies in Africa.',
  'Pakistan': 'Has the world\'s second-highest mountain, K2.',
  'Bangladesh': 'Has more rivers than any other country of its size.',
  'Vietnam': 'Largest exporter of cashew nuts and black pepper.',
  'Philippines': 'Contains over 7,600 islands.',
  'Thailand': 'The only Southeast Asian country never colonized.',
  'Myanmar': 'Home to over 2,000 ancient temples in Bagan.',
  'Malaysia': 'Has the world\'s oldest rainforests.',
  'Nepal': 'Contains 8 of the world\'s 10 highest mountains.',
  'Afghanistan': 'Known as the crossroads of Central Asia.',
  'Yemen': 'Has one of the oldest continuously inhabited cities, Sana\'a.',
  'Poland': 'Gave the world Marie Curie and Nicolaus Copernicus.',
  'Ukraine': 'Known as the breadbasket of Europe.',
  'Romania': 'Home to Dracula\'s castle, Bran Castle.',
  'Netherlands': 'Has more bicycles than people.',
  'Belgium': 'Produces over 220,000 tons of chocolate per year.',
  'Greece': 'Birthplace of democracy and the Olympic Games.',
  'Czech Republic': 'Drinks more beer per capita than any other country.',
  'Portugal': 'One of the world\'s top cork producers.',
  'Sweden': 'Has the world\'s first national park, established in 1909.',
  'Austria': 'Gave birth to famous composers Mozart and Strauss.',
  'Switzerland': 'Has not been in a military conflict since 1815.',
  'Norway': 'Home to the Northern Lights and midnight sun.',
  'Denmark': 'Consistently ranked as one of the happiest countries.',
  'Finland': 'Has more saunas than cars.',
  'Ireland': 'St. Patrick\'s Day is celebrated worldwide.',
  'New Zealand': 'First country to give women the right to vote.',
  'Singapore': 'One of only three surviving city-states in the world.',
  'Israel': 'Has the highest concentration of tech startups outside Silicon Valley.',
  'UAE': 'Dubai has the world\'s tallest building, Burj Khalifa.',
  'Qatar': 'Has the world\'s highest GDP per capita.',
  'Kuwait': 'Sits on about 8% of the world\'s oil reserves.',
  'Colombia': 'Second most biodiverse country in the world.',
  'Peru': 'Home to Machu Picchu and the source of the Amazon.',
  'Chile': 'Contains the driest desert in the world, Atacama.',
  'Ecuador': 'Named after the equator which runs through it.',
  'Venezuela': 'Has the world\'s highest waterfall, Angel Falls.',
  'Cuba': 'Has one of the highest literacy rates in the world.',
  'Dominican Republic': 'Invented merengue music and dance.',
  'Guatemala': 'Mayan civilization flourished here for over 2,000 years.',
  'Bolivia': 'Has two capital cities: La Paz and Sucre.',
  'Honduras': 'Name means "great depths" referring to coastal waters.',
  'Paraguay': 'One of only two landlocked countries in South America.',
  'Nicaragua': 'Has the largest freshwater lake in Central America.',
  'Costa Rica': 'Has no standing army since 1949.',
  'Panama': 'The famous Panama Canal connects two oceans.',
  'Jamaica': 'Birthplace of reggae music and Bob Marley.',
  'Iceland': 'Has no mosquitoes and uses geothermal energy.',
  'Croatia': 'Invented the necktie, originally worn by Croatian soldiers.',
  'Serbia': 'Has one of the oldest cities in Europe, Belgrade.',
  'Bulgaria': 'Bulgarians nod for "no" and shake their heads for "yes".',
  'Slovakia': 'Has the highest number of castles per capita.',
  'Lithuania': 'Center point of Europe is located here.',
  'Latvia': 'Has the widest waterfall in Europe, Ventas Rumba.',
  'Estonia': 'Most digitally advanced society, invented Skype.',
  'Slovenia': 'Over half the country is covered in forest.',
  'Luxembourg': 'Has the highest minimum wage in the EU.',
  'Malta': 'One of the most densely populated countries.',
  'Cyprus': 'Aphrodite, goddess of love, was born here.',
  'Mongolia': 'Has more horses than people.',
  'Cambodia': 'Angkor Wat is the largest religious monument.',
  'Laos': 'The most bombed country per capita in history.',
  'Mozambique': 'Has an AK-47 on its national flag.',
  'Zimbabwe': 'Victoria Falls is twice the height of Niagara Falls.',
  'Zambia': 'Named after the Zambezi River.',
  'Botswana': 'Over 17% of land is protected national parks.',
  'Namibia': 'Has the world\'s oldest desert, the Namib.',
  'Madagascar': 'About 90% of wildlife is found nowhere else.',
  'Senegal': 'Pink Lake gets its color from salt-loving microbes.',
  'Tunisia': 'Star Wars was filmed in the Sahara here.',
  'Libya': 'Contains part of the Sahara, 90% is desert.',
  'Chad': 'Named after Lake Chad, once the world\'s sixth largest.',
  'Mali': 'Timbuktu was a center of learning in the 14th century.',
  'Niger': 'Named after the Niger River running through it.',
  'Burkina Faso': 'Name means "Land of Honest Men".',
  'Somalia': 'Has the longest coastline in mainland Africa.',
  'Rwanda': 'Known as the land of a thousand hills.',
  'Burundi': 'One of the smallest countries in Africa.',
  'Eritrea': 'Gained independence in 1993 after 30-year struggle.',
  'Mauritius': 'The dodo bird lived only here before extinction.',
  'Uruguay': 'First country to legalize marijuana fully.',
  'Lebanon': 'The cedar tree on its flag is a national symbol.',
  'Jordan': 'Petra is one of the New Seven Wonders.',
  'Oman': 'Over 500 forts dot the landscape.',
  'Bahrain': 'Built the first oil well in the Persian Gulf.',
  'Armenia': 'First nation to adopt Christianity as state religion.',
  'Georgia': 'Birthplace of wine, produced for 8,000 years.',
  'Azerbaijan': 'Land of fire due to natural gas fires.',
  'Albania': 'Has never had a McDonald\'s restaurant.',
  'North Macedonia': 'Mother Teresa was born here.',
  'Bosnia and Herzegovina': 'Has a pyramid taller than Egypt\'s Great Pyramid.',
  'Moldova': 'Has the world\'s largest wine cellar.',
  'Belarus': 'About 40% is covered by forests.',
  'Kazakhstan': 'World\'s largest landlocked country.',
  'Uzbekistan': 'Doubly landlocked (all neighbors are landlocked too).',
  'Turkmenistan': 'Has a crater called "Door to Hell" burning since 1971.',
  'Kyrgyzstan': 'Over 90% is mountainous terrain.',
  'Tajikistan': 'Mountains cover 93% of the country.',
  'Brunei': 'Sultan\'s palace has 1,788 rooms.',
  'Papua New Guinea': 'Has over 800 languages spoken.',
  'Fiji': 'Contains 333 islands, 110 permanently inhabited.',
  'Sri Lanka': 'Ancient name was Serendib, origin of "serendipity".',
  'Haiti': 'First black republic to gain independence.',
  'El Salvador': 'Smallest country in Central America.',
  'Trinidad and Tobago': 'Invented the steel pan instrument.',
  'Bhutan': 'Measures Gross National Happiness instead of GDP.',
  'Maldives': 'Lowest country in the world, average 1.5m above sea level.',
  'Suriname': 'Most forested country, 93% forest coverage.',
  'Guyana': 'Has the world\'s largest single-drop waterfall by volume.',
  'Belize': 'Home to the Great Blue Hole, a giant marine sinkhole.',
  'Timor-Leste': 'Asia\'s youngest country, independent since 2002.',
  'Eswatini': 'One of the last absolute monarchies in Africa.',
  'Lesotho': 'Entirely surrounded by South Africa.',
  'Djibouti': 'Lake Assal is the lowest point in Africa.',
  'Gabon': 'About 11% is protected national parks.',
  'Guinea': 'Called the water tower of West Africa.',
  'Benin': 'Birthplace of the voodoo religion.',
  'Togo': 'One of the smallest countries in Africa.',
  'Sierra Leone': 'Has the world\'s third largest natural harbor.',
  'Liberia': 'Africa\'s oldest republic.',
  'Mauritania': 'Desert covers 90% of the land.',
  'Gambia': 'Africa\'s smallest mainland country.',
  'Guinea-Bissau': 'Known for cashew nut production.',
  'Equatorial Guinea': 'Only African country with Spanish as official language.',
  'Cape Verde': 'An archipelago of 10 volcanic islands.',
  'Comoros': 'The only country with four official languages.',
  'São Tomé and Príncipe': 'Second smallest African country.',
  'Seychelles': 'Has the only granite islands in mid-ocean.',
  'Antigua and Barbuda': 'Has 365 beaches, one for each day.',
  'Barbados': 'Rihanna was born here.',
  'Dominica': 'Nature Island of the Caribbean.',
  'Grenada': 'Known as the Spice Isle.',
  'Saint Lucia': 'Only country named after a woman.',
  'Saint Vincent and the Grenadines': 'Filming location for Pirates of the Caribbean.',
  'Saint Kitts and Nevis': 'Smallest country in the Western Hemisphere.',
  'Monaco': 'Second smallest country, most densely populated.',
  'San Marino': 'World\'s oldest republic, founded in 301 AD.',
  'Vatican City': 'World\'s smallest country at 0.17 square miles.',
  'Liechtenstein': 'Doubly landlocked, between Switzerland and Austria.',
  'Andorra': 'Has no airport, highest capital city in Europe.',
  'Palau': 'First country to ban reef-toxic sunscreen.',
  'Micronesia': 'Composed of 607 islands.',
  'Marshall Islands': 'Has more than 1,200 islands and islets.',
  'Kiribati': 'Spreads across all four hemispheres.',
  'Nauru': 'Third smallest country, once wealthiest per capita.',
  'Tuvalu': 'Fourth smallest country, slowly sinking.',
  'Vanuatu': 'Has the world\'s most accessible active volcano.',
  'Samoa': 'First country to see the sunrise each day.',
  'Tonga': 'Never been colonized by a foreign power.',
  'Solomon Islands': 'Site of fierce WWII battles.',
};

const exports: Record<string, string[]> = {
  'United States': ['Aircraft', 'Machinery', 'Electronics'],
  'China': ['Electronics', 'Machinery', 'Textiles'],
  'India': ['Software services', 'Textiles', 'Pharmaceuticals'],
  'Brazil': ['Soybeans', 'Iron ore', 'Coffee'],
  'Russia': ['Natural gas', 'Oil', 'Metals'],
  'Japan': ['Vehicles', 'Electronics', 'Machinery'],
  'Germany': ['Vehicles', 'Machinery', 'Chemicals'],
  'France': ['Aircraft', 'Wine', 'Luxury goods'],
  'United Kingdom': ['Financial services', 'Machinery', 'Pharmaceuticals'],
  'Italy': ['Machinery', 'Fashion', 'Food products'],
  'Canada': ['Oil', 'Vehicles', 'Wood'],
  'Australia': ['Iron ore', 'Coal', 'Gold'],
  'Mexico': ['Vehicles', 'Electronics', 'Oil'],
  'Spain': ['Vehicles', 'Food products', 'Machinery'],
  'Indonesia': ['Palm oil', 'Coal', 'Natural gas'],
  'South Korea': ['Electronics', 'Vehicles', 'Ships'],
  'Turkey': ['Textiles', 'Vehicles', 'Machinery'],
  'Saudi Arabia': ['Oil', 'Petrochemicals', 'Plastics'],
  'Argentina': ['Soybeans', 'Corn', 'Beef'],
  'South Africa': ['Gold', 'Diamonds', 'Platinum'],
};

export async function fetchCountries(): Promise<Country[]> {
  const cached = localStorage.getItem(COUNTRIES_CACHE_KEY);

  if (cached) {
    const { data, timestamp, version } = JSON.parse(cached);
    if (version === CACHE_VERSION && Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,capital,population,region,flags,maps');

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const data: RestCountryResponse[] = await response.json();

    const countries: Country[] = data
      .filter(country => country.population > 0)
      .map(country => ({
        name: country.name.common,
        code: country.cca2,
        code3: country.cca3,
        capital: country.capital?.[0] || 'N/A',
        population: country.population,
        region: country.region,
        flag: country.flags.svg,
        maps: country.maps.googleMaps,
        exports: exports[country.name.common] || ['Various goods', 'Services', 'Natural resources'],
        funFact: funFacts[country.name.common] || 'A fascinating country with rich culture and history.',
      }))
      .sort((a, b) => b.population - a.population);

    localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify({
      data: countries,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    }));

    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);

    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }

    throw error;
  }
}

export function getCountriesByDifficulty(countries: Country[], difficulty: 'easy' | 'medium' | 'hard'): Country[] {
  switch (difficulty) {
    case 'easy':
      return countries.slice(0, 30);
    case 'medium':
      return countries.slice(30, 80);
    case 'hard':
      return countries.slice(80, 200);
    default:
      return countries.slice(0, 30);
  }
}

export function getRandomCountry(countries: Country[]): Country {
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
}

export function getOutlineMapUrl(countryCode: string): string {
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}
