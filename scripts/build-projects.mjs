import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ROOM_TARGETS } from '../dist/project-data.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const entries=JSON.parse(readFileSync(resolve(root,'data/projects-approved.json'),'utf8'));
if(!Array.isArray(entries))throw new Error('La lista aprobada debe ser un arreglo.');
if(!entries.length)throw new Error('La guía necesita al menos un proyecto aprobado.');
const names=new Set();
const valid=entries.map((p,index)=>{
  const num=index+1;
  const check=(key,max,required=false)=>{
    const value=p[key];
    if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new Error(`Proyecto ${num}: ${key} inválido (máximo ${max} caracteres).`);
    return value.trim();
  };
  const name=check('name',80,true),section=check('section',90,true),room=check('room',40,true);
  const description=check('description',280),photo=check('photo',400);
  if(!ROOM_TARGETS[room])throw new Error(`Proyecto ${num}: lugar desconocido ${room}.`);
  const slug=name.toLocaleLowerCase('es');
  if(names.has(slug))throw new Error(`Proyecto duplicado: ${name}.`);
  names.add(slug);
  if(!Array.isArray(p.members)||p.members.length>20||p.members.some(m=>typeof m!=='string'||!m.trim()||m.length>90))throw new Error(`Proyecto ${num}: integrantes inválidos.`);
  if(photo&&!/^(https:\/\/|\.\/assets\/)[^\s]*$/.test(photo))throw new Error(`Proyecto ${num}: fotografía debe ser HTTPS o ./assets/.`);
  return {name,section,members:p.members.map(m=>m.trim()),room,description,photo};
});
const output=`// Datos revisados: solo se publican proyectos cuya ubicación y permisos fueron confirmados.\nexport const ROOM_TARGETS = ${JSON.stringify(ROOM_TARGETS,null,2)};\n\nconst approved = ${JSON.stringify(valid,null,2)};\n\nexport const PROJECTS = approved.map(p=>({...p,group:p.section,...ROOM_TARGETS[p.room]}));\n`;
writeFileSync(resolve(root,'dist/project-data.js'),output);
console.log(`${valid.length} proyectos aprobados preparados para el mapa.`);
