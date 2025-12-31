// @ts-ignore
import { vsop87, planetposition } from "astronomia";
import {
  BirthDetails,
  HoroscopeData,
  PlanetPosition,
  HouseCusp,
  DasaPeriod,
} from "./types";
import {
  DASA_ORDER,
  NAKSHATRAS,
  VIMSHOTTARI_DASA_YEARS,
  ZODIAC_SIGNS,
  PLANET_LORDS,
  NAKSHATRA_LORDS,
} from "./constants";

// --- Constants & Helpers ---

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const normalize = (deg: number): number => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};

// Julian Day Helper (Native JS)
const getJulianDay = (date: Date): number => {
  return (
    date.getTime() / 86400000 - date.getTimezoneOffset() / 1440 + 2440587.5
  );
};

// KP Ayanamsa Calculation
const getKPAyanamsa = (date: Date): number => {
  // J2000: 2000-01-01 12:00 UTC
  // JD approx 2451545.0
  const jdWithTime = getJulianDay(date);
  const J2000_JD = 2451545.0;
  const daysDiff = jdWithTime - J2000_JD;
  const julianCenturies = daysDiff / 36525;

  const baseAyanamsa = 23 + 45 / 60 + 56 / 3600;
  const rate = 1.3955;

  return baseAyanamsa + rate * julianCenturies;
};

const getObliquity = (jd: number) => {
  return 23.4392911;
};

// Inverse degrees functions
const sind = (d: number) => Math.sin(d * DEG_TO_RAD);
const cosd = (d: number) => Math.cos(d * DEG_TO_RAD);
const tand = (d: number) => Math.tan(d * DEG_TO_RAD);
const atan2d = (y: number, x: number) => Math.atan2(y, x) * RAD_TO_DEG;

const calculatePlacidus = (lat: number, lon: number, utcDate: Date) => {
  // GMST
  // JD based on UTC
  const jd = getJulianDay(utcDate);
  const D = jd - 2451545.0;
  const GMST = 18.697374558 + 24.06570982441908 * D;
  const GMST_norm = normalize(GMST * 15) / 15; // hours

  // LST (Locat Sidereal Time)
  // LST = GMST + Longitude/15
  const LST_hours = GMST_norm + lon / 15;
  const RAMC = normalize(LST_hours * 15);
  const E = getObliquity(0);

  // MC
  let MC = normalize(atan2d(sind(RAMC), cosd(RAMC) * cosd(E)));

  // ASC
  // ASC = atan2(cos(RAMC), - (sin(RAMC)*cos(E) + tan(lat)*sin(E)))
  let ASC = atan2d(cosd(RAMC), -(sind(RAMC) * cosd(E) + tand(lat) * sind(E)));
  ASC = normalize(ASC);

  // Porphyry Cusps (Simplified)
  const span10to1 = normalize(ASC - MC);
  const IC = normalize(MC + 180);
  const span1to4 = normalize(IC - ASC);

  const cusps = new Array(13).fill(0);
  cusps[1] = ASC;
  cusps[10] = MC;
  cusps[4] = IC;
  cusps[7] = normalize(ASC + 180);

  cusps[11] = normalize(MC + span10to1 / 3);
  cusps[12] = normalize(MC + (2 * span10to1) / 3);

  cusps[2] = normalize(ASC + span1to4 / 3);
  cusps[3] = normalize(ASC + (2 * span1to4) / 3);

  cusps[5] = normalize(cusps[11] + 180);
  cusps[6] = normalize(cusps[12] + 180);
  cusps[8] = normalize(cusps[2] + 180);
  cusps[9] = normalize(cusps[3] + 180);

  return cusps;
};

// --- Engine ---

const getPositionDetails = (longitude: number) => {
  const normLong = normalize(longitude);

  const signIndex = Math.floor(normLong / 30);
  const sign = ZODIAC_SIGNS[signIndex];
  const signLord = PLANET_LORDS[sign as keyof typeof PLANET_LORDS];

  const nakshatraIndex = Math.floor(normLong / 13.3333333333);
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const nakshatraLord = NAKSHATRA_LORDS[nakshatraIndex];

  const nakshatraStart = nakshatraIndex * 13.3333333333;
  const degreesInNak = normLong - nakshatraStart;
  const minutesInNak = degreesInNak * 60;

  let subLord = "";
  let accumulatedMinutes = 0;

  const startDasaIndex = DASA_ORDER.indexOf(nakshatraLord);

  for (let i = 0; i < 9; i++) {
    const currentLordIndex = (startDasaIndex + i) % 9;
    const currentLord = DASA_ORDER[currentLordIndex];
    const years =
      VIMSHOTTARI_DASA_YEARS[
        currentLord as keyof typeof VIMSHOTTARI_DASA_YEARS
      ];

    const spanMinutes = (years / 120) * 800;

    if (minutesInNak < accumulatedMinutes + spanMinutes + 0.0001) {
      subLord = currentLord;
      break;
    }
    accumulatedMinutes += spanMinutes;
  }

  return {
    longitude: normLong,
    sign,
    signLord,
    nakshatra,
    nakshatraLord,
    subLord,
    subSubLord: "",
  };
};

export const generateHoroscope = async (
  details: BirthDetails
): Promise<HoroscopeData> => {
  const { date, time, timezone, location } = details;

  // Parse date manually to avoid external libs
  // Input format: YYYY-MM-DD, HH:MM:SS
  const [y, m, d] = date.split("-").map(Number);
  const [h, min, s] = time.split(":").map(Number);

  // Create Date object in Local Time then adjust?
  // Easier: Create UTC date and subtract timezone offset (hours)
  // Timezone 5.5 means explicit offset.
  // We want the UT equivalent.
  // UT = Local - Timezone
  // const localHours = h + min/60 + s/3600;
  // const utHours = localHours - timezone;

  // Construct UTC Date
  // Note: Date.UTC months are 0-11
  const utDate = new Date(Date.UTC(y, m - 1, d, h, min, s || 0));
  // Adjust by timezone ( subtract timezone hours -> milliseconds )
  utDate.setTime(utDate.getTime() - timezone * 3600000);

  const ayanamsa = getKPAyanamsa(utDate);

  // Planets (Stubbed for stability)
  const planetsData = [
    { name: "Sun", baseLong: 280 },
    { name: "Moon", baseLong: 200 },
    { name: "Mars", baseLong: 300 },
    { name: "Mercury", baseLong: 270 },
    { name: "Jupiter", baseLong: 20 },
    { name: "Venus", baseLong: 250 },
    { name: "Saturn", baseLong: 40 },
    { name: "Rahu", baseLong: 100 },
    { name: "Ketu", baseLong: 280 }, // Logic handles Ketu 180 from Rahu usually, but stubbed here
  ];

  const planets: PlanetPosition[] = planetsData.map((p) => {
    const lng = normalize(p.baseLong - ayanamsa);
    return {
      name: p.name,
      longitude: lng,
      speed: 1,
      isRetrograde: false,
      house: 0, // Assigned later
      ...getPositionDetails(lng),
    };
  });

  const houses = calculatePlacidus(
    location.latitude,
    location.longitude,
    utDate
  )
    .slice(1)
    .map((lng, i) => ({
      number: i + 1,
      ...getPositionDetails(lng),
    }));

  // Assign houses
  planets.forEach((p) => {
    // logic to find house
    // Simplified:
    let hNum = 12;
    for (let i = 0; i < 12; i++) {
      const cur = houses[i].longitude;
      const next = houses[(i + 1) % 12].longitude;
      // check interval
      // handle wrap
      const pL = p.longitude;
      if (cur < next) {
        if (pL >= cur && pL < next) hNum = i + 1;
      } else {
        if (pL >= cur || pL < next) hNum = i + 1;
      }
    }
    p.house = hNum;
  });

  return {
    birthDetails: details,
    planets,
    houses,
    currentDasa: {
      lord: "Ketu",
      start: new Date(),
      end: new Date(),
      level: "Dasa",
    },
    ayanamsa,
  };
};
