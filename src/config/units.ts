
export const UNIDADES_PM = [
    "CPI-7",
    "7 BPM-I",
    "12 BPM-I",
    "14 BAEP",
    "22 BPM-I",
    "40 BPM-I",
    "50 BPM-I",
    "53 BPM-I",
    "54 BPM-I",
    "55 BPM-I"
] as const;

export type UnidadePM = typeof UNIDADES_PM[number];
