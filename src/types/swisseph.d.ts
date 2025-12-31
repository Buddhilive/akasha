declare module "swisseph" {
  export const SE_SUN: number;
  export const SE_MOON: number;
  export const SE_MERCURY: number;
  export const SE_VENUS: number;
  export const SE_MARS: number;
  export const SE_JUPITER: number;
  export const SE_SATURN: number;
  export const SE_URANUS: number;
  export const SE_NEPTUNE: number;
  export const SE_PLUTO: number;
  export const SE_MEAN_NODE: number; // Rahu mean
  export const SE_TRUE_NODE: number; // Rahu true

  export const SE_GREG_CAL: number;
  export const SE_JUL_CAL: number;

  export const SEFLG_SWIEPH: number;
  export const SEFLG_SPEED: number;
  export const SEFLG_SIDEREAL: number;

  export const SE_SIDM_KRISHNAMURTI: number; // KP Ayanamsa

  export function swe_calc_ut(
    julianDay: number,
    planet: number,
    flags: number,
    callback: (result: any) => void
  ): void;
  export function swe_julday(
    year: number,
    month: number,
    day: number,
    hour: number,
    gregflag: number,
    callback: (result: number) => void
  ): void;
  export function swe_houses(
    julianDay: number,
    lat: number,
    lon: number,
    hsys: string,
    callback: (result: any) => void
  ): void;
  export function swe_set_sid_mode(
    mode: number,
    t0: number,
    ayan_t0: number
  ): void;
  export function swe_get_ayanamsa_ut(
    julianDay: number,
    callback: (result: number) => void
  ): void;
  export function swe_set_ephe_path(path: string): void;
}
