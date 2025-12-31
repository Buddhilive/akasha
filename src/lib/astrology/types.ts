export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface BirthDetails {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  location: GeoLocation;
  timezone: number; // Offset from UTC in hours (e.g., 5.5 for IST)
}

export interface PlanetPosition {
  name: string;
  longitude: number;
  speed: number;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  subLord: string;
  subSubLord: string;
  house: number; // House occupied
  isRetrograde: boolean;
}

export interface HouseCusp {
  number: number;
  longitude: number;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  subLord: string;
  subSubLord: string;
}

export interface DasaPeriod {
  lord: string;
  start: Date;
  end: Date;
  level: "Dasa" | "Bhukti" | "Antra";
  subPeriods?: DasaPeriod[];
}

export interface HoroscopeData {
  birthDetails: BirthDetails;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  currentDasa: DasaPeriod;
  ayanamsa: number;
}
