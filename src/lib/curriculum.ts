/** Versioned contracts. Changing questions/features requires another instrument version. */
export const CURRICULUM_VERSION = "simpus-web-2026-v1";
export const LEGACY_CURRICULUM_VERSION = "legacy-srs-v1";
export const PRETEST_INSTRUMENT_VERSION = "simpus-mcq-v2";
export const PRETEST_MODULES = ["HTML", "CSS", "JavaScript"] as const;
export const FEATURE_BOUNDS = [[0,1],[0,1],[0,1],[0,1800],[0,1800],[0,1800],[1,5],[0,100]];
export const legacyMapping: Record<string,string[]> = {
 H1:["H01"],H2:["H03","H02"],H3:["H05"],H4:["H02"],
 C1:["C01"],C2:["C02"],C3:["C03"],C4:["C04"],C5:["C07","C08","C09"],
 J1:["J01"],J2:["J02"],J3:["J03"],J4:["J04"],J5:["J05"],J6:["J06","J09"],J7:["J07"],J8:["J10","J11"],
 R1:[],R2:[],R3:[],
};
