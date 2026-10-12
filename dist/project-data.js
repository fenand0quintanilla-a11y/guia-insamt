// Datos revisados: solo se publican proyectos cuya ubicación y permisos fueron confirmados.
export const ROOM_TARGETS = {
  "Aula 1": {
    "route": "ground",
    "target": [
      6.1,
      34.4,
      0.34
    ]
  },
  "Aula 2": {
    "route": "ground",
    "target": [
      6.1,
      43.6,
      0.34
    ]
  },
  "Aula 3": {
    "route": "ground",
    "target": [
      6.1,
      46.4,
      0.34
    ]
  },
  "Aula 4": {
    "route": "ground",
    "target": [
      6.1,
      55.6,
      0.34
    ]
  },
  "Aula 5": {
    "route": "upper",
    "target": [
      28.8,
      17.75,
      2.55
    ]
  },
  "Aula 6": {
    "route": "upper",
    "target": [
      28.8,
      25.25,
      2.55
    ]
  },
  "Aula 7": {
    "route": "upper",
    "target": [
      28.8,
      43.6,
      2.55
    ]
  },
  "Aula 8 / Laboratorio": {
    "route": "upper",
    "target": [
      29.35,
      47.8,
      2.55
    ]
  },
  "Clínica": {
    "route": "upper",
    "target": [
      28.8,
      46.85,
      2.55
    ]
  },
  "Aula 9": {
    "route": "upstairs",
    "target": [
      28.8,
      37.6,
      5.55
    ]
  },
  "Aula 10": {
    "route": "upstairs",
    "target": [
      28.8,
      43.6,
      5.55
    ]
  },
  "OPV": {
    "route": "upstairs",
    "target": [
      29.35,
      47.8,
      5.55
    ]
  },
  "Aula 11": {
    "route": "upstairsL",
    "target": [
      27.05,
      47.8,
      5.55
    ]
  },
  "Taller automotriz": {
    "route": "ground",
    "target": [
      5.7,
      6.2,
      0.38
    ]
  },
  "Cancha": {
    "route": "upperFront",
    "target": [
      20,
      8.5,
      2.55
    ]
  },
  "Chalet 1": {
    "route": "upperFront",
    "target": [
      29.4,
      0.2,
      2.55
    ]
  },
  "Chalet 2": {
    "route": "upperRear",
    "target": [
      19.9,
      50.4,
      2.55
    ]
  }
};

const approved = [
  {
    "name": "InnovaBoard",
    "section": "1.º BTV Desarrollo de Software",
    "members": [],
    "room": "Aula 4",
    "description": "Pizarra digital que busca mostrar en tiempo real los trazos hechos con un plumón físico.",
    "photo": ""
  },
  {
    "name": "Math Box",
    "section": "1.º BTV Desarrollo de Software",
    "members": [],
    "room": "Aula 4",
    "description": "",
    "photo": ""
  },
  {
    "name": "Way Corp",
    "section": "1.º BTV Desarrollo de Software",
    "members": [],
    "room": "Aula 3",
    "description": "",
    "photo": ""
  },
  {
    "name": "AgroIA",
    "section": "1.º BTV Desarrollo de Software",
    "members": [],
    "room": "Aula 3",
    "description": "",
    "photo": ""
  }
];

export const PROJECTS = approved.map(p=>({...p,group:p.section,...ROOM_TARGETS[p.room]}));
