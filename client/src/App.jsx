import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import * as XLSX from 'xlsx';

const LOGO_B64 = "data:image/png;base64,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";

// ═══════════════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════
const T = {
  // Brand
  brand:"#00875A", brandD:"#006644", brandL:"#E3FCEF", brandM:"#57D9A3",
  // Sidebar
  side:"#0F1C2E", sideB:"#162032", sideAct:"rgba(0,135,90,0.15)", sideActBdr:"#00875A",
  sideTxt:"rgba(255,255,255,0.45)", sideTxtH:"rgba(255,255,255,0.75)", sideTxtA:"#FFFFFF",
  sideBdr:"rgba(255,255,255,0.06)", sideSect:"rgba(255,255,255,0.2)",
  // Content
  bg:"#F0F2F5", card:"#FFFFFF", bdr:"#E8ECF1", bdrD:"#D0D8E4",
  txt:"#0D1B2A", sub:"#4A5568", muted:"#8B9BB4",
  // Status
  green:"#00875A", greenBg:"#E3FCEF", greenBdr:"#ABF5D1", greenTxt:"#006644",
  red:"#DE350B", redBg:"#FFEBE6", redBdr:"#FFBDAD", redTxt:"#BF2600",
  orange:"#FF8B00", orangeBg:"#FFFAE6", orangeBdr:"#FFE380", orangeTxt:"#974F0C",
  blue:"#0065FF", blueBg:"#DEEBFF", blueBdr:"#4C9AFF", blueTxt:"#0747A6",
  purple:"#6554C0", purpleBg:"#EAE6FF", purpleBdr:"#B3A9FF",
  cyan:"#00B8D9", cyanBg:"#E6FCFF", cyanBdr:"#79E2F2",
  white:"#FFFFFF",
  // Shadows
  sm:"0 1px 2px rgba(0,0,0,.05)",
  md:"0 4px 12px rgba(0,0,0,.08),0 1px 3px rgba(0,0,0,.04)",
  lg:"0 20px 60px rgba(0,0,0,.12),0 8px 24px rgba(0,0,0,.06)",
  xl:"0 32px 80px rgba(0,0,0,.18),0 8px 24px rgba(0,0,0,.08)",
};

// ═══════════════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════════════
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const now = () => new Date().toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
const today = () => new Date().toISOString().split("T")[0];
const fmtDate = v => { if(!v) return "—"; const s=String(v); if(/^\d{4}-\d{2}-\d{2}/.test(s)){const[y,m,d]=s.split("T")[0].split("-");return`${d}/${m}/${y}`;} return s; };
const hashPwd = s => { let h=5381; for(let i=0;i<s.length;i++) h=((h<<5)+h)+s.charCodeAt(i); return (h>>>0).toString(16); };
const pct = (a,b) => b===0 ? 0 : Math.round(a/b*100);

// ═══════════════════════════════════════════════════════════════════
//  DATA DEFAULTS
// ═══════════════════════════════════════════════════════════════════
const DEFAULT_COLS = [
  {k:"reference",  l:"Référence",    required:true},
  {k:"designation",l:"Désignation",  required:true},
  {k:"categorie",  l:"Catégorie"},
  {k:"emplacement",l:"Emplacement"},
  {k:"quantite",   l:"Quantité",     type:"number"},
  {k:"seuil",      l:"Seuil d'alerte",type:"number"},
  {k:"dateEntree", l:"Date entrée",  type:"date"},
  {k:"dateSortie", l:"Date sortie",  type:"date"},
  {k:"etat",       l:"État",         type:"etat"},
  {k:"autresInfos",l:"Notes",        wide:true},
];

const DEFAULT_STATE = {
  clients:{}, activeClient:null,
  users:[{id:"u1",name:"Admin",role:"admin",color:T.brand,pwdHash:hashPwd("admin1234")}],
  activeUser:null, history:[],
  columns:DEFAULT_COLS,
  settings:{
    companyName:"M.R.D.P.S 27",
    companyAddress:"5 Rue du Fond du Val — 27600 Saint-Pierre-la-Garenne",
    companyPhone:"02 32 21 09 23",
    companyMobile:"06 47 61 18 28",
    companyEmail:"comptabilite@mrdps27.fr",
    companyTVA:"FR 72850373994",
    companyRCS:"RCS Évreux 850 373 994",
    companyWeb:"www.mrdps27.fr",
    lowStockAlert:true,
    dateFormat:"DD/MM/YYYY",
    currency:"€",
    language:"fr",
    autoSave:true,
    theme:"light",
    entrepots:[
      {id:"e1", nom:"Siège Social", adresse:"5 Rue du Fond du Val", codePostal:"27600", ville:"Saint-Pierre-la-Garenne", tel:"02 32 21 09 23"},
    ],
  }
};

// ═══════════════════════════════════════════════════════════════════
//  ICON LIBRARY
// ═══════════════════════════════════════════════════════════════════
const ICONS = {
  home:      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10"/>,
  package:   <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
  history:   <><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 101.85-5.31L1 10"/></>,
  users:     <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
  settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></>,
  plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  edit:      <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash:     <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
  search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  upload:    <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
  download:  <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  logout:    <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  alert:     <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  check:     <polyline points="20 6 9 17 4 12"/>,
  x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  eyeoff:    <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
  menu:      <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  chevR:     <polyline points="9 18 15 12 9 6"/>,
  chevD:     <polyline points="18 9 12 15 6 9"/>,
  chevL:     <polyline points="15 18 9 12 15 6"/>,
  key:       <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
  server:    <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>,
  grid:      <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
  list:      <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  drag:      <><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></>,
  barChart:  <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  trend:     <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
  filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
  bell:      <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
  refresh:   <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
  info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  tag:       <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
  lock:      <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
  copy:      <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
  palette:   <><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></>,
  globe:     <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
  building:  <><rect x="2" y="7" width="20" height="15" rx="1"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/><line x1="9" y1="10" x2="9" y2="10"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="10" x2="15" y2="10"/><line x1="15" y1="14" x2="15" y2="14"/></>,
  save:      <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
  arrowUp:   <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
  arrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
  minus:     <line x1="5" y1="12" x2="19" y2="12"/>,
  qr:        <><rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/><rect x="3" y="16" width="5" height="5"/><path d="M21 16h-3v3h3v-3zm-3 5h-2v-2h2v2zm-2-5h-2v2h2v-2zm-4-4h-2v2h2v-2zm0 4h-2v4h2v-4zm4-4h-2v2h2v-2zm4-10H4a1 1 0 000 2h16a1 1 0 000-2zm0 6H4a1 1 0 000 2h16a1 1 0 000-2zm0 6H4a1 1 0 000 2h16a1 1 0 000-2z" style={{display:"none"}}/><line x1="16" y1="16" x2="21" y2="16"/><line x1="16" y1="21" x2="16" y2="16"/><line x1="21" y1="21" x2="16" y2="21"/></>,
  fileText:  <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
  moveIn:    <><polyline points="17 11 21 7 17 3"/><line x1="21" y1="7" x2="9" y2="7"/><polyline points="7 21 3 17 7 13"/><line x1="15" y1="17" x2="3" y2="17"/></>,
  moveOut:   <><polyline points="7 11 3 7 7 3"/><line x1="3" y1="7" x2="15" y2="7"/><polyline points="17 21 21 17 17 13"/><line x1="9" y1="17" x2="21" y2="17"/></>,
  printer:   <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>,
};
const Ic = ({n,s=16,c="currentColor",style:sx}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sx}>
    {ICONS[n]}
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════
const Btn = ({v="primary",onClick,children,sx={},disabled,size="md",full}) => {
  const base = {cursor:disabled?"not-allowed":"pointer",border:"none",fontFamily:"inherit",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,fontWeight:600,transition:"all .15s",opacity:disabled?.55:1,whiteSpace:"nowrap"};
  const sizes = {sm:{padding:"5px 12px",fontSize:12,borderRadius:7},md:{padding:"8px 16px",fontSize:13,borderRadius:9},lg:{padding:"11px 22px",fontSize:14,borderRadius:10}};
  const variants = {
    primary:{background:`linear-gradient(135deg,${T.brand},${T.brandD})`,color:"#fff",boxShadow:`0 2px 8px rgba(0,135,90,.3)`},
    secondary:{background:T.white,color:T.sub,border:`1px solid ${T.bdr}`,boxShadow:T.sm},
    ghost:{background:"transparent",color:T.sub,border:`1px solid ${T.bdr}`},
    danger:{background:T.redBg,color:T.red,border:`1px solid ${T.redBdr}`},
    success:{background:T.greenBg,color:T.green,border:`1px solid ${T.greenBdr}`},
    blue:{background:T.blueBg,color:T.blue,border:`1px solid ${T.blueBdr}`},
  };
  return <button onClick={onClick} disabled={disabled} style={{...base,...sizes[size],...(variants[v]||variants.primary),width:full?"100%":undefined,...sx}}>{children}</button>;
};

const Field = ({label,children,required,hint,row}) => (
  <div style={{gridColumn:row?"1/-1":undefined}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>{label}{required&&<span style={{color:T.red,marginLeft:3}}>*</span>}</label>}
    {children}
    {hint&&<div style={{fontSize:11,color:T.muted,marginTop:4}}>{hint}</div>}
  </div>
);

const Inp = ({value,onChange,onKeyDown,type="text",placeholder,style:sx={},as,autoFocus,readOnly}) => {
  const base = {width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:readOnly?"#f8fafc":T.white,color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border .12s",lineHeight:1.5};
  if(as==="textarea") return <textarea value={value} onChange={onChange} placeholder={placeholder} style={{...base,resize:"vertical",minHeight:80,...sx}}/>;
  return <input type={type} value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder} autoFocus={autoFocus} readOnly={readOnly} style={{...base,...sx}}/>;
};

const Sel = ({value,onChange,children,style:sx={}}) => (
  <select value={value} onChange={onChange} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:T.white,color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",cursor:"pointer",...sx}}>
    {children}
  </select>
);

const Badge = ({v="gray",children,dot,sm}) => {
  const styles = {
    green:{background:T.greenBg,color:T.greenTxt,border:`1px solid ${T.greenBdr}`},
    red:{background:T.redBg,color:T.redTxt,border:`1px solid ${T.redBdr}`},
    orange:{background:T.orangeBg,color:T.orangeTxt,border:`1px solid ${T.orangeBdr}`},
    blue:{background:T.blueBg,color:T.blueTxt,border:`1px solid ${T.blueBdr}`},
    purple:{background:T.purpleBg,color:T.purple,border:`1px solid ${T.purpleBdr}`},
    cyan:{background:T.cyanBg,color:T.cyan,border:`1px solid ${T.cyanBdr}`},
    gray:{background:"#F1F5F9",color:T.sub,border:`1px solid ${T.bdr}`},
  };
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:sm?"2px 8px":"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,whiteSpace:"nowrap",...(styles[v]||styles.gray)}}>
      {dot&&<span style={{width:6,height:6,borderRadius:"50%",background:"currentColor",flexShrink:0}}/>}
      {children}
    </span>
  );
};

const Card = ({children,sx={},p=20,hover}) => (
  <div style={{background:T.card,border:`1px solid ${T.bdr}`,borderRadius:14,boxShadow:T.md,padding:p,transition:"box-shadow .15s",...sx}}>
    {children}
  </div>
);

const Divider = ({sx={}}) => <div style={{height:1,background:T.bdr,...sx}}/>;

const Avatar = ({name,color,size=36,style:sx={}}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:color||T.brand,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,fontWeight:700,flexShrink:0,...sx}}>
    {(name||"?")[0].toUpperCase()}
  </div>
);

// Progress bar
const Prog = ({value,max,color=T.brand,h=6}) => (
  <div style={{background:T.bdr,borderRadius:h,height:h,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(pct(value,max),100)}%`,background:color,borderRadius:h,transition:"width .4s ease"}}/>
  </div>
);

// Stat Card
const StatCard = ({icon,label,value,sub,color,bg,bdr,trend:tr,onClick}) => (
  <div onClick={onClick} style={{background:T.card,border:`1px solid ${T.bdr}`,borderRadius:16,padding:"20px 22px",boxShadow:T.md,cursor:onClick?"pointer":"default",transition:"all .15s"}}>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
      <div style={{width:46,height:46,borderRadius:13,background:bg,border:`1px solid ${bdr}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Ic n={icon} s={20} c={color}/>
      </div>
      {tr!==undefined&&(
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:tr>=0?T.green:T.red}}>
          <Ic n={tr>=0?"trend":"arrowDown"} s={12} c={tr>=0?T.green:T.red}/>
          {Math.abs(tr)}%
        </div>
      )}
    </div>
    <div style={{fontSize:30,fontWeight:800,color:T.txt,lineHeight:1,marginBottom:4}}>{value}</div>
    <div style={{fontSize:12,color:T.muted,fontWeight:500}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:T.muted,marginTop:3}}>{sub}</div>}
  </div>
);

// Modal
const Modal = ({title,subtitle,icon,children,onClose,footer,wide,xl}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(10,18,28,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:24,backdropFilter:"blur(6px)"}}>
    <div style={{background:T.card,borderRadius:20,width:xl?900:wide?660:500,maxWidth:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:T.xl,border:`1px solid ${T.bdr}`}}>
      <div style={{padding:"24px 28px 20px",borderBottom:`1px solid ${T.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {icon&&<div style={{width:46,height:46,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{icon}</div>}
          <div>
            <div style={{fontWeight:700,fontSize:18,color:T.txt}}>{title}</div>
            {subtitle&&<div style={{fontSize:13,color:T.muted,marginTop:3}}>{subtitle}</div>}
          </div>
        </div>
        <button onClick={onClose} style={{background:"#F1F5F9",border:"none",cursor:"pointer",color:T.sub,width:32,height:32,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:16}}>
          <Ic n="x" s={15}/>
        </button>
      </div>
      <div style={{padding:28,overflowY:"auto",flex:1}}>{children}</div>
      {footer&&<div style={{padding:"18px 28px",borderTop:`1px solid ${T.bdr}`,display:"flex",gap:9,justifyContent:"flex-end",flexShrink:0,background:"#FAFBFC",borderRadius:"0 0 20px 20px"}}>{footer}</div>}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
//  LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
//  LOGIN SCREEN — Email + mot de passe
// ═══════════════════════════════════════════════════════════════════
function LoginScreen({onLogin,companyName}){
  const [email,setEmail]=useState("");
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState("");
  const [showPwd,setShowPwd]=useState(false);
  const [loading,setLoading]=useState(false);

  const doLogin=async()=>{
    if(loading)return;
    if(!email.trim()){setErr("Email requis");return;}
    if(!pwd){setErr("Mot de passe requis");return;}
    setLoading(true);setErr("");
    try{
      const sUrl=(window.__SERVER_URL__||"").replace(/\/+$/,"");
      const resp=await fetch(`${sUrl}/api/auth/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:email.trim(),password:pwd})
      });
      const data=await resp.json();
      if(!resp.ok){setErr(data.error||"Erreur de connexion");setLoading(false);return;}
      onLogin(data.token,data.user);
    }catch(e){
      setErr("Impossible de contacter le serveur");
      setLoading(false);
    }
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",fontFamily:"'DM Sans',system-ui,sans-serif",background:"#060D18",overflow:"hidden"}}>
      {/* Background */}
      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60%",height:"70%",background:"radial-gradient(ellipse,rgba(0,135,90,.12) 0%,transparent 70%)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",bottom:"-20%",right:"-10%",width:"50%",height:"60%",background:"radial-gradient(ellipse,rgba(0,101,255,.08) 0%,transparent 70%)",borderRadius:"50%"}}/>
      </div>

      {/* LEFT: Branding */}
      <div style={{width:"55%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"52px 64px",position:"relative",zIndex:1,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:80}}>
          <img src={LOGO_B64} alt="" style={{width:48,height:48,borderRadius:14,objectFit:"cover",border:"2px solid rgba(255,255,255,.12)"}}/>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:20,letterSpacing:.2}}>MRDPSTOCK</div>
            <div style={{color:"rgba(255,255,255,.3)",fontSize:10,letterSpacing:3,textTransform:"uppercase"}}>{companyName||"M.R.D.P.S 27"}</div>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",maxWidth:520}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,135,90,.15)",border:"1px solid rgba(0,135,90,.3)",borderRadius:20,padding:"5px 14px",marginBottom:36,width:"fit-content"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:T.brand}}/>
            <span style={{color:T.brandM,fontSize:12,fontWeight:600,letterSpacing:.5}}>Plateforme de gestion client</span>
          </div>
          <h1 style={{color:"#fff",fontSize:52,fontWeight:800,lineHeight:1.1,marginBottom:20,letterSpacing:-.5}}>MRDPSTOCK</h1>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:15,lineHeight:1.8}}>Gérez vos bases clients, suivez votre stock et pilotez vos alertes depuis un seul espace.</p>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.18)"}}>© 2026 MRDPSTOCK — {companyName||"M.R.D.P.S 27"}. Tous droits réservés.</div>
      </div>

      {/* RIGHT: Formulaire */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40,position:"relative",zIndex:1}}>
        <div style={{width:"100%",maxWidth:420}}>
          <div style={{background:"rgba(255,255,255,.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:24,padding:44,boxShadow:"0 40px 80px rgba(0,0,0,.5)"}}>
            <div style={{marginBottom:36}}>
              <h2 style={{color:"#fff",fontSize:26,fontWeight:700,marginBottom:8}}>Connexion</h2>
              <p style={{color:"rgba(255,255,255,.4)",fontSize:13,lineHeight:1.6}}>Accédez à votre espace de gestion</p>
            </div>
            <div style={{display:"grid",gap:18}}>
              {/* Email */}
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Adresse email</label>
                <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}
                  onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="prenom.nom@entreprise.fr" autoFocus
                  style={{width:"100%",padding:"12px 14px",borderRadius:11,border:`1.5px solid ${err&&!pwd?"#f87171":"rgba(255,255,255,.12)"}`,background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
              </div>
              {/* Mot de passe */}
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Mot de passe</label>
                <div style={{position:"relative"}}>
                  <input type={showPwd?"text":"password"} value={pwd}
                    onChange={e=>{setPwd(e.target.value);setErr("");}}
                    onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="••••••••"
                    style={{width:"100%",padding:"12px 44px 12px 14px",borderRadius:11,border:`1.5px solid ${err?"#f87171":"rgba(255,255,255,.12)"}`,background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
                  <button onClick={()=>setShowPwd(!showPwd)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",color:"rgba(255,255,255,.3)"}}>
                    <Ic n={showPwd?"eyeoff":"eye"} s={16} c="rgba(255,255,255,.4)"/>
                  </button>
                </div>
                {err&&<div style={{marginTop:8,fontSize:12,color:"#f87171",fontWeight:500,display:"flex",alignItems:"center",gap:6}}><Ic n="alert" s={12} c="#f87171"/>{err}</div>}
              </div>
              {/* Bouton */}
              <button onClick={doLogin} disabled={loading}
                style={{width:"100%",padding:14,borderRadius:11,background:loading?"rgba(0,135,90,.5)":`linear-gradient(135deg,${T.brand},${T.brandD})`,color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:loading?"wait":"pointer",fontFamily:"inherit",letterSpacing:.3,boxShadow:"0 4px 20px rgba(0,135,90,.4)",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                {loading?<><div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Connexion...</>:"Se connecter"}
              </button>
            </div>
            <div style={{marginTop:24,textAlign:"center",fontSize:11,color:"rgba(255,255,255,.2)"}}>
              Accès sur invitation uniquement — contactez votre administrateur
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ACTIVATION SCREEN — Page d'activation via lien d'invitation
// ═══════════════════════════════════════════════════════════════════
function ActivationScreen({token,onActivated,companyName}){
  const [info,setInfo]=useState(null);
  const [pwd,setPwd]=useState("");
  const [pwd2,setPwd2]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [checking,setChecking]=useState(true);
  const [invalid,setInvalid]=useState(false);

  useEffect(()=>{
    if(!token){setInvalid(true);setChecking(false);return;}
    const sUrl=(window.__SERVER_URL__||"").replace(/\/+$/,"");
    fetch(`${sUrl}/api/auth/activate/${token}`)
      .then(r=>r.ok?r.json():Promise.reject(r))
      .then(d=>{setInfo(d);setChecking(false);})
      .catch(()=>{setInvalid(true);setChecking(false);});
  },[token]);

  const doActivate=async()=>{
    if(!pwd||pwd.length<8){setErr("Minimum 8 caractères");return;}
    if(pwd!==pwd2){setErr("Les mots de passe ne correspondent pas");return;}
    setLoading(true);setErr("");
    try{
      const sUrl=(window.__SERVER_URL__||"").replace(/\/+$/,"");
      const resp=await fetch(`${sUrl}/api/auth/activate`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({token,password:pwd})
      });
      const data=await resp.json();
      if(!resp.ok){setErr(data.error||"Erreur");setLoading(false);return;}
      onActivated(data.token,data.user);
    }catch(e){setErr("Erreur réseau");setLoading(false);}
  };

  const wrap=(child)=>(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#060D18",fontFamily:"'DM Sans',system-ui,sans-serif",padding:20}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src={LOGO_B64} alt="" style={{width:56,height:56,borderRadius:16,objectFit:"cover",border:"2px solid rgba(255,255,255,.15)",marginBottom:16}}/>
          <div style={{color:"#fff",fontWeight:800,fontSize:22}}>MRDPSTOCK</div>
          <div style={{color:"rgba(255,255,255,.3)",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>{companyName||"M.R.D.P.S 27"}</div>
        </div>
        {child}
      </div>
    </div>
  );

  if(checking) return wrap(<div style={{textAlign:"center",color:"rgba(255,255,255,.4)",fontSize:14}}>Vérification en cours…</div>);

  if(invalid) return wrap(
    <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:36,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:16}}>❌</div>
      <div style={{color:"#f87171",fontWeight:700,fontSize:18,marginBottom:8}}>Lien invalide ou expiré</div>
      <div style={{color:"rgba(255,255,255,.4)",fontSize:13,lineHeight:1.7}}>Ce lien d'activation n'est plus valable.<br/>Contactez votre administrateur pour recevoir une nouvelle invitation.</div>
    </div>
  );

  return wrap(
    <div style={{background:"rgba(255,255,255,.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.1)",borderRadius:24,padding:40,boxShadow:"0 40px 80px rgba(0,0,0,.5)"}}>
      <div style={{background:"rgba(0,135,90,.15)",border:"1px solid rgba(0,135,90,.3)",borderRadius:12,padding:"14px 18px",marginBottom:28}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Compte à activer</div>
        <div style={{color:"#fff",fontWeight:700,fontSize:16}}>{info?.name}</div>
        <div style={{color:"rgba(255,255,255,.5)",fontSize:13}}>{info?.email}</div>
      </div>
      <h2 style={{color:"#fff",fontSize:20,fontWeight:700,marginBottom:6}}>Choisissez votre mot de passe</h2>
      <p style={{color:"rgba(255,255,255,.4)",fontSize:13,lineHeight:1.6,marginBottom:24}}>Minimum 8 caractères. Vous pourrez le modifier à tout moment.</p>
      <div style={{display:"grid",gap:16}}>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>Mot de passe</label>
          <input type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setErr("");}}
            placeholder="Min. 8 caractères"
            style={{width:"100%",padding:"12px 14px",borderRadius:11,border:`1.5px solid ${err?"#f87171":"rgba(255,255,255,.12)"}`,background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>Confirmer</label>
          <input type="password" value={pwd2} onChange={e=>{setPwd2(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&doActivate()} placeholder="Répétez le mot de passe"
            style={{width:"100%",padding:"12px 14px",borderRadius:11,border:`1.5px solid ${err?"#f87171":"rgba(255,255,255,.12)"}`,background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        </div>
        {err&&<div style={{fontSize:12,color:"#f87171",fontWeight:500,display:"flex",alignItems:"center",gap:6}}><Ic n="alert" s={12} c="#f87171"/>{err}</div>}
        <button onClick={doActivate} disabled={loading}
          style={{width:"100%",padding:13,borderRadius:11,background:`linear-gradient(135deg,${T.brand},${T.brandD})`,color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:loading?"wait":"pointer",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(0,135,90,.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          {loading?<><div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Activation...</>:"✅ Activer mon compte"}
        </button>
      </div>
    </div>
  );
}

function App(){
  const [state, setState] = useState(DEFAULT_STATE);
  const [view,  setView]  = useState("dashboard");
  const [subView, setSubView] = useState(null);
  const [search,  setSearch]  = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // {type, data}
  const [serverCfg, setServerCfg] = useState({mode:"local",serverUrl:"",serverKey:"",onedrive:{token:"",fileId:""},gdrive:{token:"",fileId:""},dropbox:{token:""}});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(false);
  const [serverLoaded, setServerLoaded] = useState(false);
  const [serverToken, setServerToken]   = useState(null);
  const [serverVersion, setServerVersion] = useState(0);
  const [syncStatus, setSyncStatus]     = useState("idle"); // "idle"|"syncing"|"ok"|"error"|"offline"
  const fileRef = useRef();

  const COLS = state.columns || DEFAULT_COLS;
  const cl = state.activeClient && state.clients[state.activeClient];
  const items = cl?.items || [];
  const activeUser = state.users.find(u=>u.id===state.activeUser);
  const settings = state.settings || DEFAULT_STATE.settings;

  // Filtered items for stock view
  const filteredItems = useMemo(()=>items.filter(i=>{
    const s = search.toLowerCase();
    const matchS = !s || COLS.some(c=>String(i[c.k]||"").toLowerCase().includes(s));
    const matchStatus = filterStatus==="all"||(filterStatus==="in"&&i.etat==="en_stock")||(filterStatus==="out"&&i.etat==="sorti");
    const matchCat = filterCat==="all"||(i.categorie||"")===(filterCat);
    return matchS&&matchStatus&&matchCat;
  }),[items,search,filterStatus,filterCat,COLS]);

  // Low stock items
  const lowStockItems = useMemo(()=>items.filter(i=>{
    const q=parseInt(i.quantite)||0, s=parseInt(i.seuil)||0;
    return s>0&&q<=s&&i.etat==="en_stock";
  }),[items]);

  const allItems = useMemo(()=>Object.values(state.clients).flatMap(c=>c.items),[state.clients]);
  const globalStats = useMemo(()=>({
    clients: Object.keys(state.clients).length,
    total: allItems.length,
    inStock: allItems.filter(i=>i.etat==="en_stock").length,
    outStock: allItems.filter(i=>i.etat==="sorti").length,
    lowStock: allItems.filter(i=>{const q=parseInt(i.quantite)||0,s=parseInt(i.seuil)||0;return s>0&&q<=s&&i.etat==="en_stock";}).length,
  }),[allItems,state.clients]);

  const categories = useMemo(()=>[...new Set(items.map(i=>i.categorie).filter(Boolean))],[items]);

  useEffect(()=>{
    const link=document.createElement("link");
    link.href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap";
    link.rel="stylesheet"; document.head.appendChild(link);
    if(window.serverConfig){window.serverConfig.get().then(cfg=>{if(cfg)setServerCfg(cfg);setServerLoaded(true);}).catch(()=>setServerLoaded(true));}
    else setServerLoaded(true);

    // Online/offline tracking
    const goOnline = () => {
      setIsOnline(true);
      setPendingSync(true);
      setTimeout(()=>setPendingSync(false), 3000);
    };
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  },[]);

  useEffect(()=>{
    if(!serverLoaded)return;
    (async()=>{
      // ── Helpers réseau ──────────────────────────────────────────
      const sUrl = serverCfg.serverUrl?.replace(/\/+$/,"");
      const sKey  = serverCfg.serverKey;
      const authHeaders = tok => ({
        "Content-Type":"application/json",
        ...(tok ? {"Authorization":`Bearer ${tok}`} : {}),
        ...(sKey? {"X-API-Key":sKey} : {})
      });

      // Tenter de charger depuis le serveur si configuré
      let loadedFromServer = false;
      if(sUrl) {
        try {
          // 1. récupérer le token stocké localement
          let tok = null;
          try { const t=await window.storage.get("mrdpstock_jwt"); tok=t?.value||null; } catch{}
          if(tok) setServerToken(tok);

          const resp = await fetch(`${sUrl}/api/state`, {
            headers: authHeaders(tok),
            signal: AbortSignal.timeout(5000)
          });
          if(resp.ok) {
            const {state:srv, version} = await resp.json();
            // Réintégrer les vrais hashes depuis localStorage (le serveur masque les mots de passe)
            let localPwds = {};
            try{const lc=await window.storage.get("mrdpstock_v4");const ls=JSON.parse(lc?.value||"{}");(ls.users||[]).forEach(u=>{if(u.pwdHash&&u.pwdHash!=="***")localPwds[u.id]=u.pwdHash;});}catch{}
            if(srv.users) srv.users=srv.users.map(u=>({...u,pwdHash:localPwds[u.id]||u.pwdHash}));
            if(!srv.columns) srv.columns=DEFAULT_COLS;
            if(!srv.settings) srv.settings=DEFAULT_STATE.settings;
            setState({...srv,activeUser:null});
            setServerVersion(version||0);
            setSyncStatus("ok");
            // Mettre aussi en cache local
            try{await window.storage.set("mrdpstock_v4",JSON.stringify(srv));}catch{}
            loadedFromServer=true;
          }
        } catch(e) {
          setSyncStatus("offline");
          console.warn("Serveur inaccessible, chargement local:", e.message);
        }
      }

      // Fallback localStorage
      if(!loadedFromServer) {
        try {
          const res=await window.storage.get("mrdpstock_v4");
          if(res?.value){
            const saved=JSON.parse(res.value);
            if(saved.users)saved.users=saved.users.map(u=>u.pwdHash?u:{...u,pwdHash:hashPwd("admin1234")});
            if(!saved.columns)saved.columns=DEFAULT_COLS;
            if(!saved.settings)saved.settings=DEFAULT_STATE.settings;
            setState({...saved,activeUser:null});
          }
        }catch(e){}
      }

      setLoaded(true);
      const loading=document.getElementById("loading");
      const root=document.getElementById("root");
      if(loading)loading.style.display="none";
      if(root)root.style.display="block";
    })();
  },[serverLoaded]);

  // Refs stables pour save() — jamais recréées
  const serverCfgRef     = useRef(serverCfg);
  const serverTokenRef   = useRef(serverToken);
  const serverVersionRef = useRef(serverVersion);
  useEffect(()=>{ serverCfgRef.current     = serverCfg;     },[serverCfg]);
  useEffect(()=>{ serverTokenRef.current   = serverToken;   },[serverToken]);
  useEffect(()=>{ serverVersionRef.current = serverVersion; },[serverVersion]);

  // Sync vers serveur REST — stable via useCallback([])
  const syncToRemote = useCallback(async (ns) => {
    const cfg  = serverCfgRef.current;
    const mode = cfg?.mode;
    if(!mode || mode === "local") return;

    const sUrl = cfg.serverUrl?.replace(/\/+$/,"");
    if(!sUrl) return;

    setSyncStatus("syncing");
    try {
      let tok = serverTokenRef.current;
      if(!tok){ try{const t=await window.storage.get("mrdpstock_jwt"); tok=t?.value||null;}catch{} }
      const resp = await fetch(`${sUrl}/api/state`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          ...(tok ? {"Authorization":`Bearer ${tok}`} : {}),
          ...(cfg.serverKey ? {"X-API-Key":cfg.serverKey} : {})
        },
        body: JSON.stringify({state:ns, clientVersion:serverVersionRef.current}),
        signal: AbortSignal.timeout(8000)
      });
      if(resp.ok){
        const {version} = await resp.json();
        serverVersionRef.current = version;
        setServerVersion(version);
        setSyncStatus("ok");
      } else if(resp.status===409){
        setSyncStatus("error");
        toast_("⚠ Conflit — rechargez la page.","error");
      } else {
        setSyncStatus("error");
      }
    } catch(e){
      setSyncStatus("offline");
    }
  }, []);

  const save = useCallback(async ns=>{
    setState(ns);
    // 1. Sauvegarde locale immédiate (toujours)
    try{await window.storage.set("mrdpstock_v4",JSON.stringify(ns));}catch(e){}
    // 2. Sync distante selon le mode
    const mode = serverCfgRef.current?.mode;
    if(mode && mode!=="local") syncToRemote(ns);
  },[]);
  const toast_ = (msg,type="success") => {setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const addHistory = (action,detail,st) => {
    const u=st.users.find(u=>u.id===st.activeUser);
    return [{id:uid(),ts:now(),user:u?.name||"Inconnu",action,detail},...(st.history||[])].slice(0,1000);
  };

  // ─── Connexion via email (v3) ──────────────────────────────────────
  const handleLoginWithPwd = async (jwtToken, userInfo) => {
    setServerToken(jwtToken);
    serverTokenRef.current = jwtToken;
    try{ await window.storage.set("mrdpstock_jwt", jwtToken); } catch{}

    // Charger l'état depuis le serveur avec le nouveau token
    const sUrl = serverCfgRef.current?.serverUrl?.replace(/\/+$/,"") || "";
    if(sUrl) {
      try{
        const resp = await fetch(`${sUrl}/api/state`,{
          headers:{"Authorization":`Bearer ${jwtToken}`},
          signal: AbortSignal.timeout(5000)
        });
        if(resp.ok){
          const {state:srv, version} = await resp.json();
          if(!srv.columns)  srv.columns  = DEFAULT_COLS;
          if(!srv.settings) srv.settings = DEFAULT_STATE.settings;
          setState({...srv, activeUser: userInfo.id, activeUserInfo: userInfo});
          setServerVersion(version||0);
          setSyncStatus("ok");
          try{ await window.storage.set("mrdpstock_v4", JSON.stringify(srv)); } catch{}
          return;
        }
      } catch(e){ setSyncStatus("offline"); }
    }

    // Fallback local
    setState(prev => {
      const ns = {...prev, activeUser: userInfo.id, activeUserInfo: userInfo};
      const u = ns.users?.find(u => u.id === userInfo.id);
      if(!u) {
        ns.users = [...(ns.users||[]), {
          id: userInfo.id, name: userInfo.name, email: userInfo.email,
          role: userInfo.role, color: userInfo.color
        }];
      }
      ns.history = [{id:uid(),ts:now(),user:userInfo.name,action:"Connexion",detail:userInfo.email}, ...(ns.history||[])].slice(0,1000);
      return ns;
    });
    setSyncStatus("idle");
  };

  const handleLogout = () => {
    const u=activeUser;
    const ns={...state,activeUser:null,activeClient:null};
    ns.history=addHistory("Déconnexion",u?.name,ns);
    save(ns);setView("dashboard");
  };

  const openClient = (id) => {
    save({...state,activeClient:id});
    setView("stock");setSearch("");setFilterStatus("all");setFilterCat("all");
  };

  const createClient = name => {
    if(!name.trim())return;
    const id=uid();
    const ns={...state,clients:{...state.clients,[id]:{name:name.trim(),items:[],createdAt:today()}},activeClient:id};
    ns.history=addHistory("Base créée",`"${name.trim()}"`,ns);
    save(ns);setModal(null);setView("stock");toast_(`Base "${name.trim()}" créée`);
  };

  const saveItem = (formData, editId) => {
    if(!formData.reference?.trim()||!formData.designation?.trim()){toast_("Référence et désignation obligatoires","error");return;}
    let newItems,action;
    if(editId){newItems=items.map(i=>i.id===editId?{...formData,id:editId}:i);action="Article modifié";}
    else{newItems=[...items,{...formData,id:uid()}];action="Article ajouté";}
    const ns={...state,clients:{...state.clients,[state.activeClient]:{...cl,items:newItems}}};
    ns.history=addHistory(action,`${formData.reference} – ${formData.designation}`,ns);
    save(ns);setModal(null);toast_(editId?"Article modifié":"Article ajouté");
  };

  const deleteItem = id => {
    const item=items.find(i=>i.id===id);
    const ns={...state,clients:{...state.clients,[state.activeClient]:{...cl,items:items.filter(i=>i.id!==id)}}};
    ns.history=addHistory("Article supprimé",`${item?.reference||""} – ${item?.designation||""}`,ns);
    save(ns);setModal(null);toast_("Article supprimé","error");
  };

  const deleteClient = id => {
    const name=state.clients[id]?.name;
    const c2={...state.clients};delete c2[id];
    const ns={...state,clients:c2,activeClient:state.activeClient===id?null:state.activeClient};
    ns.history=addHistory("Base supprimée",`"${name}"`,ns);
    save(ns);setModal(null);if(state.activeClient===id)setView("dashboard");toast_("Base supprimée","error");
  };

  const saveUser = (formData, editId) => {
    if(!formData.name?.trim()){toast_("Nom obligatoire","error");return;}
    if(formData.newPwd&&formData.newPwd.length<4){toast_("Mot de passe trop court (min 4)","error");return;}
    if(formData.newPwd&&formData.newPwd!==formData.confirmPwd){toast_("Mots de passe différents","error");return;}
    const base=editId?state.users.find(u=>u.id===editId):null;
    const pwdHash=formData.newPwd?hashPwd(formData.newPwd):(base?.pwdHash||hashPwd("admin1234"));
    const userData={name:formData.name.trim(),role:formData.role,color:formData.color,pwdHash};
    const newUsers=editId?state.users.map(u=>u.id===editId?{...u,...userData}:u):[...state.users,{id:uid(),...userData}];
    const ns={...state,users:newUsers};
    ns.history=addHistory(editId?"Utilisateur modifié":"Utilisateur créé",formData.name,ns);
    save(ns);setModal(null);toast_(editId?"Utilisateur modifié":"Utilisateur créé");
  };

  const deleteUser = id => {
    if(state.users.length<=1){toast_("Impossible: dernier utilisateur","error");setModal(null);return;}
    const u=state.users.find(u=>u.id===id);
    const ns={...state,users:state.users.filter(u=>u.id!==id),activeUser:state.activeUser===id?null:state.activeUser};
    ns.history=addHistory("Utilisateur supprimé",u?.name,ns);
    save(ns);setModal(null);toast_("Utilisateur supprimé","error");
    if(state.activeUser===id)handleLogout();
  };

  const handleImport = (file) => {
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const wb=XLSX.read(ev.target.result,{type:"binary",cellDates:true});
        const ws=wb.Sheets[wb.SheetNames[0]];
        const raw=XLSX.utils.sheet_to_json(ws,{header:1,defval:""});
        if(raw.length<2){toast_("Fichier vide","error");return;}
        const headers=raw[0].map(h=>String(h).trim());
        const rows=raw.slice(1).filter(r=>r.some(c=>c!=="")).map(r=>headers.reduce((o,h,i)=>({...o,[h]:r[i]!==undefined?String(r[i]).trim():""}),{}));
        const aliases={reference:["ref","référence","reference","code"],designation:["désignation","designation","nom","libellé","article"],categorie:["catégorie","categorie","famille","type"],dateEntree:["date entrée","dateentree","entrée","entree"],dateSortie:["date sortie","datesortie","sortie"],emplacement:["emplacement","lieu","localisation","zone"],quantite:["quantité","quantite","qté","qty","stock"],seuil:["seuil","minimum","min","alerte"],etat:["état","etat","statut","status"],autresInfos:["autres","infos","note","notes","commentaire"]};
        const autoMap={};
        headers.forEach(h=>{const hl=h.toLowerCase().replace(/[^a-z0-9]/g,"");for(const[field,alts]of Object.entries(aliases)){if(alts.some(a=>hl.includes(a.replace(/[^a-z0-9]/g,"")))){if(!autoMap[field])autoMap[field]=h;}}});
        setModal({type:"import",data:{rows,headers,preview:rows.slice(0,5),autoMap}});
      }catch(err){toast_("Erreur: "+err.message,"error");}
    };
    reader.readAsBinaryString(file);
  };

  const doImport = (rows,mapping) => {
    const newItems=rows.map(row=>{
      const item={id:uid(),etat:"en_stock"};
      COLS.forEach(col=>{const mapped=mapping[col.k];if(mapped&&row[mapped]!==undefined){let val=row[mapped];if(col.k==="etat"){const v=String(val).toLowerCase();val=(v.includes("sort")||v.includes("out")||v==="0"||v==="false")?"sorti":"en_stock";}item[col.k]=String(val);}else{item[col.k]="";}});
      return item;
    });
    const ns={...state,clients:{...state.clients,[state.activeClient]:{...cl,items:[...items,...newItems]}}};
    ns.history=addHistory("Import Excel",`${newItems.length} articles importés`,ns);
    save(ns);setModal(null);toast_(`${newItems.length} articles importés`);
  };

  const doExport = (selectedCols) => {
    const colsToExp=COLS.filter(c=>selectedCols.includes(c.k));
    const header=colsToExp.map(c=>c.l);
    const rows=filteredItems.map(item=>colsToExp.map(c=>{if(c.type==="etat")return item.etat==="en_stock"?"En stock":"Sorti";if(c.type==="date")return fmtDate(item[c.k]);return item[c.k]||"";}));
    const ws=XLSX.utils.aoa_to_sheet([header,...rows]);
    ws["!cols"]=colsToExp.map(()=>({wch:18}));
    const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,cl?.name||"Stock");
    const fname=`MRDPSTOCK_${(cl?.name||"export").replace(/[^a-z0-9]/gi,"_")}_${today()}.xlsx`;
    XLSX.writeFile(wb,fname);setModal(null);toast_(`Exporté: ${fname}`);
  };

  const saveSettings = ns_settings => {
    const ns={...state,settings:ns_settings};
    save(ns);toast_("Paramètres enregistrés");
  };
  const saveCols = cols => {
    const ns={...state,columns:cols};
    ns.history=addHistory("Colonnes modifiées",`${cols.length} colonnes`,ns);
    save(ns);toast_("Colonnes enregistrées");
  };
  const saveServerCfg = async cfg => {
    setServerCfg(cfg);
    serverCfgRef.current = cfg;
    if(window.serverConfig) await window.serverConfig.set(cfg);
    // Si passage en mode local, forcer un save local immédiat
    if(cfg.mode==="local") {
      try{await window.storage.set("mrdpstock_v4",JSON.stringify(state));}catch(e){}
      setSyncStatus("idle");
    }
    toast_("Configuration serveur enregistrée");
  };
  const changePwd = (cur,nw,conf) => {
    if(hashPwd(cur)!==activeUser.pwdHash){toast_("Mot de passe actuel incorrect","error");return false;}
    if(nw.length<4){toast_("Trop court (min 4 caractères)","error");return false;}
    if(nw!==conf){toast_("Les mots de passe ne correspondent pas","error");return false;}
    const newUsers=state.users.map(u=>u.id===state.activeUser?{...u,pwdHash:hashPwd(nw)}:u);
    const ns={...state,users:newUsers};
    ns.history=addHistory("Mot de passe modifié",activeUser.name,ns);
    save(ns);toast_("Mot de passe modifié avec succès");return true;
  };

  // ─── Gestion de la page d'activation ──────────────────────────────
  const [activationToken, setActivationToken] = useState(null);
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const tok = params.get('token');
    if(tok) setActivationToken(tok);
  },[]);

  if(!loaded) return null;

  // Page activation (lien invitation)
  if(activationToken && !state.activeUser) {
    return <ActivationScreen
      token={activationToken}
      companyName={settings.companyName}
      onActivated={(token, userInfo) => {
        setActivationToken(null);
        window.history.replaceState({}, '', '/');
        handleLoginWithPwd(token, userInfo);
      }}
    />;
  }

  if(!state.activeUser) return <LoginScreen onLogin={handleLoginWithPwd} companyName={settings.companyName}/>;

  // ── NAV CONFIG ──
  const NAV_SECTIONS = [
    {
      label:"Principal",
      items:[
        {id:"dashboard", icon:"home",    label:"Tableau de bord"},
        {id:"search",    icon:"search",  label:"Recherche globale"},
        {id:"warehouses",icon:"package", label:"Bases clients",   badge:globalStats.clients},
        {id:"alerts",    icon:"bell",    label:"Alertes",         badge:globalStats.lowStock, badgeV:"red"},
        {id:"history",   icon:"history", label:"Historique"},
      ]
    },
    {
      label:"Configuration",
      items:[
        {id:"users",       icon:"users",    label:"Utilisateurs"},
        {id:"mouvements",  icon:"moveIn",   label:"Mouvements stock"},
        {id:"bontransport",icon:"moveOut",  label:"Bon de transport"},
        {id:"inventaire",  icon:"check",    label:"Inventaire physique"},
        {id:"rapports",    icon:"save",     label:"Rapports & Export"},
        {id:"labels",      icon:"qr",       label:"Étiquettes QR"},
        {id:"excel",       icon:"grid",     label:"Viewer Excel"},
      ]
    }
  ];

  const gotoStock = (id) => { openClient(id); };

  // ═══════════════════════════════════════════════════════════════════
  //  MODALS RENDERER
  // ═══════════════════════════════════════════════════════════════════
  // ── MODAL SUB-COMPONENTS (each has its own hooks at top level) ──
  const ConfirmModal = ({data}) => (
    <Modal title={data.title} icon={<div style={{width:46,height:46,borderRadius:13,background:T.redBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="alert" s={20} c={T.red}/></div>}
      onClose={()=>setModal(null)}
      footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn v="danger" onClick={data.onConfirm}><Ic n="trash" s={13}/>Supprimer</Btn></>}>
      <p style={{color:T.sub,fontSize:14,lineHeight:1.7}}>{data.msg}</p>
    </Modal>
  );

  const NewClientModal = () => {
    const [name,setName]=useState("");
    return(
      <Modal title="Nouvelle base client" subtitle="Créez un nouvel espace de gestion de stock"
        icon={<div style={{width:46,height:46,borderRadius:13,background:T.greenBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="package" s={20} c={T.green}/></div>}
        onClose={()=>setModal(null)}
        footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={()=>createClient(name)} disabled={!name.trim()}><Ic n="plus" s={13}/>Créer la base</Btn></>}>
        <Field label="Nom de la base client" required>
          <Inp value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createClient(name)} placeholder="Ex: Entrepôt Nord, Client Dupont..." autoFocus/>
        </Field>
      </Modal>
    );
  };

  const RenameClientModal = ({data}) => {
    const [name,setName]=useState(data.name);
    return(
      <Modal title="Renommer la base" onClose={()=>setModal(null)}
        footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={()=>{const id=data.id;const c2={...state.clients,[id]:{...state.clients[id],name:name.trim()}};const ns={...state,clients:c2};ns.history=addHistory("Base renommée",`"${name.trim()}"`,ns);save(ns);setModal(null);toast_("Base renommée");}}>Renommer</Btn></>}>
        <Field label="Nouveau nom" required>
          <Inp value={name} onChange={e=>setName(e.target.value)} autoFocus/>
        </Field>
      </Modal>
    );
  };

  const ItemFormModal = ({data}) => {
    const editId=data.editId;
    const [multiMode,setMultiMode]=useState(false);
    const [multiRefs,setMultiRefs]=useState("");
    const photoRef=useRef();
    const [form,setForm]=useState(data.item?{...data.item,photo:data.item.photo||""}:{reference:"",designation:"",categorie:"",emplacement:"",quantite:"1",seuil:"",dateEntree:today(),dateSortie:"",etat:"en_stock",autresInfos:"",photo:""});
    const handlePhoto=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>setForm(f=>({...f,photo:ev.target.result}));r.readAsDataURL(file);};
    const isLow=parseInt(form.quantite||0)<=parseInt(form.seuil||0)&&parseInt(form.seuil||0)>0;

    // Auto-set dates when etat changes
    const handleEtatChange = (newEtat) => {
      const updates = {etat: newEtat};
      if(newEtat === "sorti" && !form.dateSortie) updates.dateSortie = today();
      if(newEtat === "en_stock" && !form.dateEntree) updates.dateEntree = today();
      setForm(f=>({...f,...updates}));
    };

    // Auto-set dateSortie when quantite reaches 0
    const handleQuantiteChange = (val) => {
      const updates = {quantite: val};
      const q = parseInt(val)||0;
      if(q === 0 && !form.dateSortie) {
        updates.dateSortie = today();
        updates.etat = "sorti";
      }
      if(q > 0 && form.etat === "sorti") {
        updates.etat = "en_stock";
        if(!form.dateEntree) updates.dateEntree = today();
      }
      setForm(f=>({...f,...updates}));
    };

    const handleSaveMulti = () => {
      const lines = multiRefs.split(/\n|,|;/).map(l=>l.trim()).filter(Boolean);
      if(!lines.length){toast_("Aucune référence saisie","error");return;}
      if(!form.designation?.trim()){toast_("Désignation obligatoire","error");return;}
      let newItems=[...items];
      lines.forEach(ref=>{
        newItems=[...newItems,{...form,reference:ref,id:uid()}];
      });
      const ns={...state,clients:{...state.clients,[state.activeClient]:{...cl,items:newItems}}};
      ns.history=addHistory("Articles ajoutés",`${lines.length} références ajoutées`,ns);
      save(ns);setModal(null);toast_(`${lines.length} articles ajoutés`);
    };

    return(
      <Modal title={editId?"Modifier l'article":"Ajouter un article"}
        subtitle={editId?`Référence: ${data.item?.reference||""}`:"Renseignez les informations de l'article"}
        icon={<div style={{width:46,height:46,borderRadius:13,background:editId?T.blueBg:T.greenBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={editId?"edit":"plus"} s={20} c={editId?T.blue:T.green}/></div>}
        wide onClose={()=>setModal(null)}
        footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={multiMode&&!editId?handleSaveMulti:()=>saveItem(form,editId)}><Ic n="save" s={13}/>{editId?"Enregistrer":multiMode?"Ajouter les références":"Ajouter"}</Btn></>}>
        {!editId&&(
          <div style={{display:"flex",gap:8,marginBottom:20,background:T.bg,borderRadius:11,padding:4,border:`1px solid ${T.bdr}`}}>
            {[{v:false,l:"1 référence"},{v:true,l:"Plusieurs références"}].map(opt=>(
              <button key={String(opt.v)} onClick={()=>setMultiMode(opt.v)}
                style={{flex:1,padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                  background:multiMode===opt.v?T.white:"transparent",
                  color:multiMode===opt.v?T.brand:T.muted,
                  boxShadow:multiMode===opt.v?T.sm:"none",
                  fontFamily:"inherit",transition:"all .15s"}}>
                {opt.l}
              </button>
            ))}
          </div>
        )}
        {isLow&&<div style={{background:T.orangeBg,border:`1px solid ${T.orangeBdr}`,borderRadius:10,padding:"10px 14px",marginBottom:20,display:"flex",alignItems:"center",gap:10}}>
          <Ic n="alert" s={15} c={T.orange}/>
          <span style={{fontSize:13,color:T.orangeTxt,fontWeight:500}}>⚠ Stock inférieur ou égal au seuil d'alerte</span>
        </div>}
        {multiMode&&!editId?(
          <div style={{display:"grid",gap:18}}>
            <Field label="Références (une par ligne, ou séparées par virgule/point-virgule)" required>
              <Inp as="textarea" value={multiRefs} onChange={e=>setMultiRefs(e.target.value)} placeholder={"REF001\nREF002\nREF003"} style={{minHeight:120,fontFamily:"monospace"}}/>
            </Field>
            {COLS.filter(c=>c.k!=="reference"&&c.type!=="etat"&&!c.wide).map(col=>(
              <Field key={col.k} label={col.l} required={col.required}>
                <Inp
                  type={col.type==="number"?"number":col.type==="date"?"date":"text"}
                  value={form[col.k]||""}
                  onChange={e=>col.k==="quantite"?handleQuantiteChange(e.target.value):setForm({...form,[col.k]:e.target.value})}
                  placeholder={col.l}/>
              </Field>
            ))}
            <Field label="État">
              <Sel value={form.etat||"en_stock"} onChange={e=>handleEtatChange(e.target.value)}>
                <option value="en_stock">En stock</option>
                <option value="sorti">Sorti</option>
              </Sel>
            </Field>
            {COLS.filter(c=>c.wide).map(col=>(
              <Field key={col.k} label={col.l} row>
                <Inp as="textarea" value={form[col.k]||""} onChange={e=>setForm({...form,[col.k]:e.target.value})} placeholder={col.l}/>
              </Field>
            ))}
          </div>
        ):( 
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
            <div style={{gridColumn:"1/-1",display:"flex",alignItems:"center",gap:16,padding:"12px 16px",background:"#F0FDF4",border:"2px solid #86EFAC",borderRadius:12,marginBottom:2}}>
              {form.photo
                ?<div style={{position:"relative",flexShrink:0}}>
                    <img src={form.photo} alt="photo" style={{width:80,height:80,objectFit:"cover",borderRadius:10,border:"2px solid #16A34A",display:"block"}}/>
                    <button onClick={()=>setForm(f=>({...f,photo:""}))} style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"#EF4444",border:"2px solid white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Ic n="x" s={10} c="#fff"/>
                    </button>
                  </div>
                :<div onClick={()=>photoRef.current?.click()} style={{width:80,height:80,borderRadius:10,border:"2px dashed #86EFAC",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:6,background:"white",flexShrink:0}}>
                    <Ic n="upload" s={20} c="#16A34A"/>
                    <span style={{fontSize:10,textAlign:"center",lineHeight:1.4,color:"#16A34A",fontWeight:600}}>Ajouter<br/>photo</span>
                  </div>
              }
              <div>
                <div style={{fontWeight:700,fontSize:13,color:"#15803D",marginBottom:3}}>📷 Photo de l'article</div>
                <div style={{fontSize:12,color:"#166534"}}>{form.photo?"✓ Photo ajoutée":"Optionnel · JPG, PNG, WEBP"}</div>
                {!form.photo&&<button onClick={()=>photoRef.current?.click()} style={{marginTop:8,background:"#16A34A",color:"white",border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Choisir</button>}
              </div>
            </div>
            {COLS.filter(c=>c.type!=="etat"&&!c.wide).map(col=>(
              <Field key={col.k} label={col.l} required={col.required}>
                <Inp
                  type={col.type==="number"?"number":col.type==="date"?"date":"text"}
                  value={form[col.k]||""}
                  onChange={e=>col.k==="quantite"?handleQuantiteChange(e.target.value):setForm({...form,[col.k]:e.target.value})}
                  placeholder={col.l}/>
              </Field>
            ))}
            <Field label="État">
              <Sel value={form.etat||"en_stock"} onChange={e=>handleEtatChange(e.target.value)}>
                <option value="en_stock">En stock</option>
                <option value="sorti">Sorti</option>
              </Sel>
            </Field>
            {COLS.filter(c=>c.wide).map(col=>(
              <Field key={col.k} label={col.l} row>
                <Inp as="textarea" value={form[col.k]||""} onChange={e=>setForm({...form,[col.k]:e.target.value})} placeholder={col.l}/>
              </Field>
            ))}
          </div>
        )}
      </Modal>
    );
  };

  const UserFormModal = ({data}) => {
    const editId=data.editId;
    const [form,setForm]=useState(data.user?
      {name:data.user.name,role:data.user.role,color:data.user.color,newPwd:"",confirmPwd:""}:
      {name:"",role:"user",color:["#00875A","#0065FF","#FF8B00","#DE350B","#6554C0"][Math.floor(Math.random()*5)],newPwd:"",confirmPwd:""});
    return(
      <Modal title={editId?"Modifier l'utilisateur":"Nouvel utilisateur"}
        icon={<div style={{width:46,height:46,borderRadius:13,background:T.purpleBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="users" s={20} c={T.purple}/></div>}
        onClose={()=>setModal(null)}
        footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={()=>saveUser(form,editId)}><Ic n="check" s={13}/>{editId?"Enregistrer":"Créer"}</Btn></>}>
        <div style={{display:"grid",gap:18}}>
          <Field label="Nom complet" required><Inp value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Prénom Nom" autoFocus/></Field>
          <Field label="Rôle">
            <Sel value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </Sel>
          </Field>
          <div style={{padding:18,borderRadius:12,background:T.bg,border:`1px solid ${T.bdr}`}}>
            <div style={{fontSize:13,fontWeight:600,color:T.txt,marginBottom:14,display:"flex",alignItems:"center",gap:8}}><Ic n="lock" s={14} c={T.muted}/>{editId?"Nouveau mot de passe (vide = inchangé)":"Mot de passe"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label={editId?"Nouveau":"Mot de passe"}><Inp type="password" value={form.newPwd} onChange={e=>setForm({...form,newPwd:e.target.value})} placeholder="Min. 4 caractères"/></Field>
              <Field label="Confirmer"><Inp type="password" value={form.confirmPwd} onChange={e=>setForm({...form,confirmPwd:e.target.value})} placeholder="Répétez"/></Field>
            </div>
            {!editId&&<div style={{marginTop:8,fontSize:11,color:T.muted}}>Défaut si vide: <code style={{background:"#fff",padding:"1px 6px",borderRadius:4,border:`1px solid ${T.bdr}`}}>admin1234</code></div>}
          </div>
          <Field label="Couleur de l'avatar">
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:4}}>
              {["#00875A","#0065FF","#FF8B00","#DE350B","#6554C0","#00B8D9","#DB2777","#EA580C"].map(c=>(
                <div key={c} onClick={()=>setForm({...form,color:c})}
                  style={{width:34,height:34,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?`3px solid ${T.txt}`:"3px solid transparent",boxShadow:form.color===c?`0 0 0 2px white,0 0 0 4px ${c}`:"none",transition:"all .12s"}}/>
              ))}
            </div>
          </Field>
        </div>
      </Modal>
    );
  };

  const ImportModal = ({data}) => {
    const {rows,headers,preview,autoMap} = data;
    const [mapping,setMapping]=useState(autoMap);
    return(
      <Modal title={`Importer ${rows.length} articles`} subtitle="Mappez les colonnes de votre fichier aux champs MRDPSTOCK"
        xl onClose={()=>setModal(null)}
        footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={()=>doImport(rows,mapping)}><Ic n="upload" s={13}/>Importer {rows.length} articles</Btn></>}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
          {COLS.map(col=>(
            <Field key={col.k} label={col.l}>
              <Sel value={mapping[col.k]||""} onChange={e=>setMapping({...mapping,[col.k]:e.target.value||undefined})}>
                <option value="">— Ignorer —</option>
                {headers.map(h=><option key={h} value={h}>{h}</option>)}
              </Sel>
            </Field>
          ))}
        </div>
        <div style={{background:T.bg,borderRadius:12,overflow:"hidden",border:`1px solid ${T.bdr}`}}>
          <div style={{padding:"10px 16px",fontSize:11,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,borderBottom:`1px solid ${T.bdr}`,background:T.card}}>Aperçu — {preview.length} premières lignes</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr>{headers.map(h=><th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,background:"#f8fafc",borderBottom:`1px solid ${T.bdr}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{preview.map((row,i)=><tr key={i}>{headers.map(h=><td key={h} style={{padding:"6px 12px",fontSize:11,color:T.sub,borderBottom:`1px solid ${T.bdrD}`}}>{row[h]||""}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </Modal>
    );
  };

  const ExportModal = () => {
    const [selectedCols,setSelectedCols]=useState(COLS.map(c=>c.k));
    return(
      <Modal title="Exporter en Excel" subtitle={`${filteredItems.length} articles · Choisissez les colonnes`}
        onClose={()=>setModal(null)}
        footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={()=>doExport(selectedCols)} disabled={!selectedCols.length}><Ic n="download" s={13}/>Télécharger .xlsx</Btn></>}>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:14}}>
          <Btn v="ghost" sx={{padding:"5px 10px",fontSize:11}} onClick={()=>setSelectedCols(COLS.map(c=>c.k))}>Tout sélectionner</Btn>
          <Btn v="ghost" sx={{padding:"5px 10px",fontSize:11}} onClick={()=>setSelectedCols([])}>Tout désélectionner</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {COLS.map(col=>{
            const checked=selectedCols.includes(col.k);
            return(
              <div key={col.k} onClick={()=>setSelectedCols(p=>p.includes(col.k)?p.filter(c=>c!==col.k):[...p,col.k])}
                style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:10,border:`1.5px solid ${checked?T.brand:T.bdr}`,background:checked?T.greenBg:T.white,cursor:"pointer",transition:"all .15s"}}>
                <div style={{width:18,height:18,borderRadius:5,background:checked?T.brand:T.white,border:`2px solid ${checked?T.brand:T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                  {checked&&<Ic n="check" s={10} c="#fff"/>}
                </div>
                <span style={{fontSize:13,fontWeight:checked?600:400,color:checked?T.brand:T.txt}}>{col.l}</span>
              </div>
            );
          })}
        </div>
      </Modal>
    );
  };

  const ModalsRenderer = () => {
    if(!modal) return null;
    if(modal.type==="confirm")      return <ConfirmModal data={modal.data}/>;
    if(modal.type==="newClient")    return <NewClientModal/>;
    if(modal.type==="renameClient") return <RenameClientModal data={modal.data}/>;
    if(modal.type==="itemForm")     return <ItemFormModal data={modal.data}/>;
    if(modal.type==="userForm")     return <UserFormModal data={modal.data}/>;
    if(modal.type==="import")       return <ImportModal data={modal.data}/>;
    if(modal.type==="photoView")    return <Modal title={modal.data.ref} onClose={()=>setModal(null)}><div style={{textAlign:"center"}}><img src={modal.data.src} alt="" style={{maxWidth:"100%",maxHeight:"60vh",borderRadius:12,objectFit:"contain"}}/></div></Modal>;
    if(modal.type==="export")       return <ExportModal/>;
    if(modal.type==="movement")     return <MovementModal data={modal.data}/>;
    if(modal.type==="qrView")       return <QRModal data={modal.data}/>;
    return null;
  };

  // ═══════════════════════════════════════════════════════════════════
  //  VIEWS
  // ═══════════════════════════════════════════════════════════════════

  // ── DASHBOARD ──
  const DashboardView = () => {
    const [serverStats, setServerStats] = useState(null);
    const [serverActivity, setServerActivity] = useState([]);
    const [loadingDash, setLoadingDash] = useState(true);

    const loadDashboard = async () => {
      setLoadingDash(true);
      const sUrl = (serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
      const headers = {"Authorization":`Bearer ${serverToken}`};
      try {
        // Charger stats, activité et mouvements en parallèle
        const [statsRes, histRes, mvtRes] = await Promise.all([
          fetch(`${sUrl}/api/items/stats`, {headers}),
          fetch(`${sUrl}/api/history?limit=6`, {headers}),
          fetch(`${sUrl}/api/mouvements/stats?days=7`, {headers}),
        ]);
        if(statsRes.ok)   setServerStats(await statsRes.json());
        if(histRes.ok)    setServerActivity(await histRes.json());
        if(mvtRes.ok)     setMvtData(await mvtRes.json());
      } catch(e) { console.error("Dashboard load error:", e); }
      setLoadingDash(false);
    };

    const [mvtData, setMvtData] = useState([]);

    useEffect(()=>{ loadDashboard(); },[]);

    // Stats : priorité serveur, fallback local
    const stats = serverStats || globalStats;
    const recentActivity = serverActivity.length > 0 ? serverActivity : state.history.slice(0,6);

    // Construire les données graphique mouvements 7 jours depuis le serveur
    const mvtStats = useMemo(()=>{
      const days = 7;
      const result = [];
      for(let d=days-1;d>=0;d--){
        const dt = new Date(); dt.setDate(dt.getDate()-d);
        const label = dt.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric"});
        const dayStr = dt.toISOString().slice(0,10);
        // Depuis serveur si dispo, sinon local
        if(mvtData.length > 0){
          const entrées = mvtData.filter(m=>m.jour===dayStr && m.type==="entree").reduce((s,m)=>s+(m.nb_mouvements||0),0);
          const sorties = mvtData.filter(m=>m.jour===dayStr && m.type==="sortie").reduce((s,m)=>s+(m.nb_mouvements||0),0);
          result.push({label, entries:entrées, exits:sorties});
        } else {
          const fmtDay = dt.toLocaleDateString("fr-FR");
          const entries = state.history.filter(h=>h.ts?.includes(fmtDay)&&h.action==="Entrée stock").length;
          const exits   = state.history.filter(h=>h.ts?.includes(fmtDay)&&h.action==="Sortie stock").length;
          result.push({label, entries, exits});
        }
      }
      return result;
    },[mvtData, state.history]);

    const maxBar = Math.max(1,...mvtStats.map(d=>Math.max(d.entries,d.exits)));

    // Stats catégories
    const catStats = useMemo(()=>{
      const m={};
      Object.values(state.clients).forEach(c=>c.items.forEach(i=>{
        const cat=i.categorie||"Sans catégorie";
        if(!m[cat])m[cat]={count:0,inStock:0};
        m[cat].count++;
        if(i.etat==="en_stock")m[cat].inStock++;
      }));
      // Si serveur a des stats, les utiliser
      if(serverStats?.categories){
        const sm={};
        serverStats.categories.forEach(c=>{ sm[c.categorie||"Sans catégorie"]={count:c.total,inStock:c.en_stock}; });
        return Object.entries(sm).sort((a,b)=>b[1].count-a[1].count).slice(0,6);
      }
      return Object.entries(m).sort((a,b)=>b[1].count-a[1].count).slice(0,6);
    },[state.clients, serverStats]);

    const topClients = Object.entries(state.clients).sort((a,b)=>b[1].items.length-a[1].items.length).slice(0,5);
    const allLowStock = Object.entries(state.clients).flatMap(([cid,c])=>c.items.filter(i=>{const q=parseInt(i.quantite)||0,s=parseInt(i.seuil)||0;return s>0&&q<=s&&i.etat==="en_stock";}).map(i=>({...i,clientName:c.name,clientId:cid}))).slice(0,6);

    const PALETTE=["#00875A","#0065FF","#6554C0","#FF8B00","#00B8D9","#DE350B"];

    const displayTotal   = serverStats?.total   ?? globalStats.total;
    const displayInStock = serverStats?.inStock  ?? globalStats.inStock;
    const displayOut     = serverStats?.outStock ?? globalStats.outStock;
    const displayLow     = serverStats?.lowStock ?? globalStats.lowStock;
    const displayClients = serverStats?.clients  ?? globalStats.clients;

    return(
      <div className="anim">
        {/* Welcome bar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:22,fontWeight:800,color:T.txt}}>Bonjour, {activeUser?.name?.split(" ")[0]} 👋</div>
              {loadingDash&&<div style={{width:14,height:14,border:`2px solid ${T.bdr}`,borderTop:`2px solid ${T.brand}`,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>}
            </div>
            <div style={{fontSize:13,color:T.muted,marginTop:2}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn v="secondary" onClick={loadDashboard}><Ic n="refresh" s={13}/>Actualiser</Btn>
            <Btn v="secondary" onClick={()=>setView("search")}><Ic n="search" s={13}/>Recherche globale</Btn>
            <Btn onClick={()=>setModal({type:"newClient"})} size="lg"><Ic n="plus" s={15}/>Nouvelle base client</Btn>
          </div>
        </div>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:24}}>
          <StatCard icon="package"  label="Bases clients"   value={displayClients} color={T.blue}   bg={T.blueBg}   bdr={T.blueBdr}   onClick={()=>setView("warehouses")}/>
          <StatCard icon="grid"     label="Articles total"  value={displayTotal}   color={T.brand}  bg={T.greenBg}  bdr={T.greenBdr}/>
          <StatCard icon="check"    label="En stock"        value={displayInStock} color={T.green}  bg={T.greenBg}  bdr={T.greenBdr}  sub={`${pct(displayInStock,displayTotal||1)}% du total`}/>
          <StatCard icon="arrowDown"label="Sortis"          value={displayOut}     color={T.red}    bg={T.redBg}    bdr={T.redBdr}/>
          <StatCard icon="bell"     label="Alertes stock"   value={displayLow}     color={T.orange} bg={T.orangeBg} bdr={T.orangeBdr} onClick={()=>setView("alerts")}/>
        </div>

        {/* Charts row */}
        <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:18,marginBottom:18}}>
          {/* Mouvements 7 jours */}
          <Card p={0} sx={{overflow:"hidden"}}>
            <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${T.bdr}`}}>
              <div style={{width:32,height:32,borderRadius:9,background:T.greenBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="barChart" s={14} c={T.green}/></div>
              <div style={{fontWeight:700,fontSize:15,color:T.txt}}>Mouvements — 7 derniers jours</div>
              <div style={{marginLeft:"auto",display:"flex",gap:12,fontSize:11}}>
                <span style={{color:T.green,fontWeight:600}}>● Entrées</span>
                <span style={{color:T.red,fontWeight:600}}>● Sorties</span>
              </div>
            </div>
            <div style={{padding:"20px 20px 16px",display:"flex",alignItems:"flex-end",gap:10,height:120}}>
              {mvtStats.map((d,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{display:"flex",gap:2,alignItems:"flex-end",height:80}}>
                    <div style={{width:12,background:T.green,borderRadius:"3px 3px 0 0",height:`${Math.max(4,(d.entries/maxBar)*76)}px`,transition:"height .4s",title:`${d.entries} entrées`}}/>
                    <div style={{width:12,background:T.red,  borderRadius:"3px 3px 0 0",height:`${Math.max(4,(d.exits/maxBar)*76)}px`,  transition:"height .4s"}}/>
                  </div>
                  <div style={{fontSize:9,color:T.muted,textAlign:"center",whiteSpace:"nowrap"}}>{d.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Catégories */}
          <Card p={0} sx={{overflow:"hidden"}}>
            <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${T.bdr}`}}>
              <div style={{width:32,height:32,borderRadius:9,background:T.purpleBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="tag" s={14} c={T.purple}/></div>
              <div style={{fontWeight:700,fontSize:15,color:T.txt}}>Répartition par catégorie</div>
            </div>
            {catStats.length===0?(
              <div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13}}>Aucune catégorie définie</div>
            ):(
              <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:8}}>
                {catStats.map(([cat,s],i)=>(
                  <div key={cat} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:10,height:10,borderRadius:3,background:PALETTE[i%PALETTE.length],flexShrink:0}}/>
                    <div style={{flex:1,fontSize:12,color:T.txt,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat}</div>
                    <div style={{fontSize:12,fontWeight:700,color:T.txt,minWidth:24,textAlign:"right"}}>{s.count}</div>
                    <div style={{width:80,height:6,background:T.bdr,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",background:PALETTE[i%PALETTE.length],borderRadius:3,width:`${pct(s.count,displayTotal||1)}%`}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Row 2: bases + activity */}
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:18,marginBottom:18}}>
          {/* Bases clients */}
          <Card p={0} sx={{overflow:"hidden"}}>
            <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.bdr}`}}>
              <div style={{fontWeight:700,fontSize:15,color:T.txt,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:9,background:T.blueBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="package" s={14} c={T.blue}/></div>
                Bases clients
              </div>
              <button onClick={()=>setView("warehouses")} style={{background:"none",border:"none",cursor:"pointer",color:T.brand,fontSize:12,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>Tout voir <Ic n="chevR" s={12} c={T.brand}/></button>
            </div>
            {topClients.length===0?(
              <div style={{padding:48,textAlign:"center",color:T.muted,fontSize:13}}>Aucune base client</div>
            ):(
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  {["Base","Articles","En stock","Alertes"].map(h=><th key={h} style={{padding:"8px 16px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`1px solid ${T.bdr}`}}>{h}</th>)}
                </tr></thead>
                <tbody>{topClients.map(([id,c])=>{
                  const total=c.items.length;
                  const inStock=c.items.filter(i=>i.etat==="en_stock").length;
                  const low=c.items.filter(i=>{const q=parseInt(i.quantite)||0,s=parseInt(i.seuil)||0;return s>0&&q<=s&&i.etat==="en_stock";}).length;
                  return(
                    <tr key={id} className="row" onClick={()=>gotoStock(id)} style={{cursor:"pointer"}}>
                      <td style={{padding:"11px 16px"}}><div style={{fontWeight:600,fontSize:13,color:T.txt}}>{c.name}</div></td>
                      <td style={{padding:"11px 16px"}}><span style={{fontWeight:700,fontSize:14,color:T.txt}}>{total}</span></td>
                      <td style={{padding:"11px 16px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{flex:1,maxWidth:80,height:5,background:T.bdr,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:T.brand,width:`${pct(inStock,total||1)}%`,borderRadius:3}}/></div>
                          <span style={{fontSize:12,color:T.muted}}>{inStock}</span>
                        </div>
                      </td>
                      <td style={{padding:"11px 16px"}}>{low>0?<Badge v="orange" dot sm>{low}</Badge>:<Badge v="green" dot sm>OK</Badge>}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            )}
          </Card>

          {/* Activité récente */}
          <Card p={0} sx={{overflow:"hidden"}}>
            <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.bdr}`}}>
              <div style={{fontWeight:700,fontSize:15,color:T.txt,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:9,background:T.cyanBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="history" s={14} c={T.cyan}/></div>
                Activité récente
              </div>
              <button onClick={()=>setView("history")} style={{background:"none",border:"none",cursor:"pointer",color:T.brand,fontSize:12,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>Tout voir <Ic n="chevR" s={12} c={T.brand}/></button>
            </div>
            {recentActivity.length===0?(
              <div style={{padding:48,textAlign:"center",color:T.muted,fontSize:13}}>Aucune activité</div>
            ):(
              <div style={{padding:"6px 0"}}>
                {recentActivity.slice(0,6).map((h,i)=>{
                  const name = h.user_name||h.user||"Inconnu";
                  const u=state.users.find(u=>u.name===name);
                  const isAdd=h.action?.includes("créé")||h.action?.includes("ajouté")||h.action?.includes("mporté")||h.action?.includes("Entrée")||h.action?.includes("activé");
                  const isDel=h.action?.includes("supprimé")||h.action?.includes("Sortie");
                  const isMod=h.action?.includes("modifié")||h.action?.includes("Transfert");
                  const bv=isDel?"red":isAdd?"green":isMod?"blue":"gray";
                  const dateStr = h.created_at||h.ts||"";
                  return(
                    <div key={h.id||i} style={{padding:"10px 20px",display:"flex",alignItems:"flex-start",gap:12,borderBottom:i<5?`1px solid ${T.bdrD}`:"none"}}>
                      <Avatar name={name} color={u?.color} size={32}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                          <span style={{fontSize:12,fontWeight:600,color:T.txt}}>{name}</span>
                          <Badge v={bv} sm>{h.action}</Badge>
                        </div>
                        <div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.detail||""}</div>
                        <div style={{fontSize:10,color:T.bdrD,marginTop:2}}>{dateStr.slice(0,16).replace("T"," ")}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Alertes stock bas */}
        {allLowStock.length>0&&(
          <Card p={0} sx={{overflow:"hidden",border:`1px solid ${T.orangeBdr}`,background:T.orangeBg}}>
            <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Ic n="alert" s={18} c={T.orange}/>
                <span style={{fontWeight:700,fontSize:14,color:T.orangeTxt}}>{allLowStock.length} article{allLowStock.length>1?"s":""} en dessous du seuil d'alerte</span>
              </div>
              <button onClick={()=>setView("alerts")} style={{background:"none",border:"none",cursor:"pointer",color:T.orange,fontWeight:600,fontSize:12,fontFamily:"inherit"}}>Voir toutes les alertes →</button>
            </div>
            <div style={{background:T.card,borderTop:`1px solid ${T.orangeBdr}`,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <tbody>{allLowStock.slice(0,3).map(i=>(
                  <tr key={i.id} className="row" onClick={()=>gotoStock(i.clientId)} style={{cursor:"pointer"}}>
                    <td style={{padding:"11px 20px"}}><span style={{fontWeight:600,fontSize:13,color:T.txt}}>{i.designation}</span><span style={{fontSize:11,color:T.muted,marginLeft:8}}>{i.reference}</span></td>
                    <td style={{padding:"11px 16px"}}><Badge v="gray" sm>{i.clientName}</Badge></td>
                    <td style={{padding:"11px 16px"}}><Badge v="red" dot>Qté: {i.quantite||0}</Badge></td>
                    <td style={{padding:"11px 16px"}}><span style={{fontSize:12,color:T.muted}}>Seuil: {i.seuil}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    );
  };

    // ── WAREHOUSES ──
  const WarehousesView = () => (
    <div className="anim">
      {Object.keys(state.clients).length===0?(
        <Card sx={{textAlign:"center",padding:80}}>
          <div style={{width:72,height:72,borderRadius:20,background:T.greenBg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Ic n="package" s={32} c={T.green}/></div>
          <div style={{fontWeight:800,fontSize:20,color:T.txt,marginBottom:8}}>Aucune base client</div>
          <div style={{color:T.muted,fontSize:14,marginBottom:28}}>Créez votre premier espace pour commencer à gérer votre inventaire</div>
          <Btn onClick={()=>setModal({type:"newClient"})} size="lg"><Ic n="plus" s={15}/>Créer ma première base</Btn>
        </Card>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:18}}>
          {Object.entries(state.clients).map(([id,c])=>{
            const total=c.items.length,inS=c.items.filter(i=>i.etat==="en_stock").length,outS=c.items.filter(i=>i.etat==="sorti").length;
            const lowS=c.items.filter(i=>{const q=parseInt(i.quantite)||0,s=parseInt(i.seuil)||0;return s>0&&q<=s&&i.etat==="en_stock";}).length;
            return(
              <Card key={id} sx={{cursor:"pointer",transition:"all .15s",':hover':{transform:"translateY(-2px)"}}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:46,height:46,borderRadius:13,background:T.greenBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="package" s={20} c={T.green}/></div>
                    <div>
                      <div style={{fontWeight:700,fontSize:16,color:T.txt}}>{c.name}</div>
                      <div style={{fontSize:11,color:T.muted}}>Créée {fmtDate(c.createdAt)||"—"}</div>
                    </div>
                  </div>
                  {lowS>0&&<Badge v="orange" dot>{lowS} alerte{lowS>1?"s":""}</Badge>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
                  {[{l:"Total",v:total,c:T.blue},{l:"En stock",v:inS,c:T.green},{l:"Sortis",v:outS,c:T.red}].map(s=>(
                    <div key={s.l} style={{textAlign:"center",padding:"10px 8px",borderRadius:10,background:T.bg,border:`1px solid ${T.bdr}`}}>
                      <div style={{fontSize:22,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:11,color:T.muted}}>Taux en stock</span>
                    <span style={{fontSize:11,fontWeight:600,color:T.green}}>{pct(inS,total||1)}%</span>
                  </div>
                  <Prog value={inS} max={total||1} color={T.brand} h={6}/>
                </div>
                <div style={{display:"flex",gap:7}}>
                  <Btn onClick={()=>gotoStock(id)} sx={{flex:1,justifyContent:"center"}}><Ic n="eye" s={13}/>Ouvrir</Btn>
                  <button onClick={()=>setModal({type:"renameClient",data:{id,name:c.name}})} style={{background:T.blueBg,border:`1px solid ${T.blueBdr}`,cursor:"pointer",color:T.blue,padding:"7px 10px",borderRadius:8}}><Ic n="edit" s={13}/></button>
                  <button onClick={()=>setModal({type:"confirm",data:{title:"Supprimer la base",msg:`Supprimer "${c.name}" et ses ${total} articles ? Action irréversible.`,onConfirm:()=>deleteClient(id)}})} style={{background:T.redBg,border:`1px solid ${T.redBdr}`,cursor:"pointer",color:T.red,padding:"7px 10px",borderRadius:8}}><Ic n="trash" s={13}/></button>
                </div>
              </Card>
            );
          })}
          <div onClick={()=>setModal({type:"newClient"})}
            style={{border:`2px dashed ${T.bdrD}`,borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:48,cursor:"pointer",transition:"all .15s",color:T.muted,minHeight:200}}>
            <div style={{width:52,height:52,borderRadius:14,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="plus" s={22} c={T.muted}/></div>
            <div style={{fontSize:14,fontWeight:600}}>Nouvelle base client</div>
            <div style={{fontSize:12,textAlign:"center"}}>Créer un nouvel espace de gestion</div>
          </div>
        </div>
      )}
    </div>
  );

  // ── ALERTS ──
  const AlertsView = () => {
    const allLow = Object.entries(state.clients).flatMap(([cid,c])=>c.items.filter(i=>{const q=parseInt(i.quantite)||0,s=parseInt(i.seuil)||0;return s>0&&q<=s&&i.etat==="en_stock";}).map(i=>({...i,clientName:c.name,clientId:cid})));
    return(
      <div className="anim">
        {allLow.length===0?(
          <Card sx={{textAlign:"center",padding:80}}>
            <div style={{width:72,height:72,borderRadius:20,background:T.greenBg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Ic n="check" s={32} c={T.green}/></div>
            <div style={{fontWeight:800,fontSize:20,color:T.txt,marginBottom:8}}>Aucune alerte active</div>
            <div style={{color:T.muted}}>Tous vos articles sont au-dessus de leur seuil d'alerte</div>
          </Card>
        ):(
          <>
            <div style={{background:T.orangeBg,border:`1px solid ${T.orangeBdr}`,borderRadius:12,padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
              <Ic n="alert" s={18} c={T.orange}/>
              <span style={{fontSize:14,fontWeight:600,color:T.orangeTxt}}>{allLow.length} article{allLow.length>1?"s":" "} en dessous du seuil d'alerte</span>
            </div>
            <Card p={0} sx={{overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Article","Base","Quantité","Seuil","Criticité","Action"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`}}>{h}</th>)}</tr></thead>
                <tbody>{allLow.sort((a,b)=>(parseInt(a.quantite)||0)-(parseInt(b.quantite)||0)).map(i=>{
                  const q=parseInt(i.quantite)||0,s=parseInt(i.seuil)||0;
                  const ratio=pct(q,s);
                  const crit=q===0?"critique":ratio<50?"élevée":"modérée";
                  const critV=q===0?"red":ratio<50?"orange":"blue";
                  return(
                    <tr key={i.id} className="row">
                      <td style={{padding:"14px 16px"}}>
                        <div style={{fontWeight:600,color:T.txt}}>{i.designation}</div>
                        <div style={{fontSize:11,color:T.muted}}>{i.reference}</div>
                      </td>
                      <td style={{padding:"14px 16px"}}><Badge v="gray">{i.clientName}</Badge></td>
                      <td style={{padding:"14px 16px"}}><span style={{fontSize:18,fontWeight:800,color:q===0?T.red:T.orange}}>{q}</span></td>
                      <td style={{padding:"14px 16px"}}><span style={{fontSize:13,color:T.muted}}>min. {s}</span></td>
                      <td style={{padding:"14px 16px"}}><Badge v={critV} dot>{crit}</Badge></td>
                      <td style={{padding:"14px 16px"}}>
                        <Btn v="secondary" size="sm" onClick={()=>{save({...state,activeClient:i.clientId});setView("stock");}}>
                          <Ic n="edit" s={12}/>Modifier
                        </Btn>
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    );
  };

  // ── STOCK TABLE ──
  const StockView = () => {
    const statsIn=items.filter(i=>i.etat==="en_stock").length;
    const statsOut=items.filter(i=>i.etat==="sorti").length;
    return(
      <div className="anim">
        {/* Mini KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
          {[
            {l:"Total",v:items.length,icon:"grid",c:T.blue,bg:T.blueBg,bdr:T.blueBdr},
            {l:"En stock",v:statsIn,icon:"check",c:T.green,bg:T.greenBg,bdr:T.greenBdr},
            {l:"Sortis",v:statsOut,icon:"arrowDown",c:T.red,bg:T.redBg,bdr:T.redBdr},
            {l:"Alertes",v:lowStockItems.length,icon:"bell",c:T.orange,bg:T.orangeBg,bdr:T.orangeBdr},
          ].map(s=>(
            <div key={s.l} style={{background:T.card,border:`1px solid ${T.bdr}`,borderRadius:12,padding:"16px 18px",boxShadow:T.sm,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:42,height:42,borderRadius:11,background:s.bg,border:`1px solid ${s.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={s.icon} s={17} c={s.c}/></div>
              <div>
                <div style={{fontSize:26,fontWeight:800,color:T.txt,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>{s.l}</div>
              </div>
              {s.l!=="Total"&&items.length>0&&<div style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:s.c}}>{pct(s.v,items.length)}%</div>}
            </div>
          ))}
        </div>

        {/* Low stock banner */}
        {lowStockItems.length>0&&(
          <div style={{background:T.orangeBg,border:`1px solid ${T.orangeBdr}`,borderRadius:11,padding:"11px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <Ic n="alert" s={15} c={T.orange}/>
            <span style={{fontSize:13,fontWeight:600,color:T.orangeTxt}}>{lowStockItems.length} article{lowStockItems.length>1?"s":""} en dessous du seuil d'alerte :</span>
            {lowStockItems.slice(0,3).map(i=><Badge key={i.id} v="orange" sm>{i.designation} ({i.quantite||0})</Badge>)}
            {lowStockItems.length>3&&<span style={{fontSize:11,color:T.orangeTxt}}>+{lowStockItems.length-3} autres</span>}
          </div>
        )}

        {/* Toolbar */}
        <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
          {/* Status filter */}
          <div style={{display:"flex",background:T.white,border:`1px solid ${T.bdr}`,borderRadius:10,padding:3,gap:2,flexShrink:0}}>
            {[{v:"all",l:"Tous",count:items.length},{v:"in",l:"En stock",count:statsIn},{v:"out",l:"Sortis",count:statsOut}].map(f=>(
              <button key={f.v} onClick={()=>setFilterStatus(f.v)}
                style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:filterStatus===f.v?700:500,
                  background:filterStatus===f.v?(f.v==="out"?T.redBg:T.greenBg):"transparent",
                  color:filterStatus===f.v?(f.v==="out"?T.red:T.green):T.muted,fontFamily:"inherit",transition:"all .12s",display:"flex",alignItems:"center",gap:6}}>
                {f.l}<span style={{fontSize:10,background:filterStatus===f.v?(f.v==="out"?T.red:T.brand):"#f1f5f9",color:filterStatus===f.v?"#fff":T.muted,borderRadius:10,padding:"1px 6px"}}>{f.count}</span>
              </button>
            ))}
          </div>
          {/* Category filter */}
          {categories.length>0&&(
            <select value={filterCat} onChange={e=>setFilterCat(e.target.value)}
              style={{padding:"8px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:T.white,color:T.txt,fontSize:12,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
              <option value="all">Toutes les catégories</option>
              {categories.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>

        {/* Table */}
        <Card p={0} sx={{overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
              <thead><tr>
                {COLS.filter(c=>c.type!=="etat"&&!c.wide).map(col=>(
                  <th key={col.k} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`,whiteSpace:"nowrap"}}>{col.l}</th>
                ))}
                <th style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`}}>État</th>
                <th style={{padding:"10px 16px",textAlign:"right",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`}}>Actions</th>
              </tr></thead>
              <tbody>
                {filteredItems.length===0&&(
                  <tr><td colSpan={COLS.length+1} style={{textAlign:"center",padding:72,color:T.muted}}>
                    <div style={{marginBottom:14}}><Ic n="search" s={36} c={T.bdr}/></div>
                    <div style={{fontWeight:600,color:T.sub,marginBottom:4}}>{items.length===0?"Aucun article":"Aucun résultat"}</div>
                    <div style={{fontSize:12}}>{items.length===0?"Ajoutez votre premier article ou importez un fichier Excel":"Modifiez vos filtres de recherche"}</div>
                    {items.length===0&&<div style={{marginTop:20}}><Btn onClick={()=>setModal({type:"itemForm",data:{}})}><Ic n="plus" s={13}/>Ajouter un article</Btn></div>}
                  </td></tr>
                )}
                {filteredItems.map(item=>{
                  const q=parseInt(item.quantite)||0,s=parseInt(item.seuil)||0;
                  const isLow=s>0&&q<=s&&item.etat==="en_stock";
                  return(
                    <tr key={item.id} className="row" style={{background:isLow?T.orangeBg:undefined}}>
                      {COLS.filter(c=>c.type!=="etat"&&!c.wide).map(col=>(
                        <td key={col.k} style={{padding:"13px 16px",fontSize:13,color:T.txt,borderBottom:`1px solid ${T.bdrD}`,verticalAlign:"middle"}}>
                          {col.k==="reference"
                            ?<div style={{display:"flex",alignItems:"center",gap:8}}>
                                {item.photo&&<img src={item.photo} alt="" style={{width:30,height:30,objectFit:"cover",borderRadius:6,border:`1px solid ${T.bdr}`,flexShrink:0,cursor:"pointer"}} onClick={()=>setModal({type:"photoView",data:{src:item.photo,ref:item.reference}})}/>}
                                <span style={{fontWeight:700,color:T.brand,fontSize:13}}>{item[col.k]||<span style={{color:T.muted}}>—</span>}</span>
                              </div>
                            :col.k==="designation"
                              ?<span style={{fontWeight:600}}>{item[col.k]||"—"}</span>
                              :col.k==="quantite"
                                ?<span style={{display:"inline-flex",alignItems:"center",gap:8}}>
                                    <span style={{width:8,height:8,borderRadius:"50%",background:item.etat==="en_stock"?T.green:T.red,flexShrink:0}}/>
                                    <span style={{fontWeight:700,fontSize:14,color:isLow?T.orange:T.txt}}>{item[col.k]||"0"}</span>
                                    {isLow&&<Ic n="alert" s={13} c={T.orange}/>}
                                  </span>
                                :col.type==="date"
                                  ?<span style={{fontSize:12,color:T.muted}}>{fmtDate(item[col.k])}</span>
                                  :<span style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block",color:item[col.k]?T.sub:T.bdrD}}>{item[col.k]||"—"}</span>
                          }
                        </td>
                      ))}
                      <td style={{padding:"13px 16px",borderBottom:`1px solid ${T.bdrD}`}}>
                        <Badge v={item.etat==="en_stock"?"green":"red"} dot>{item.etat==="en_stock"?"En stock":"Sorti"}</Badge>
                      </td>
                      <td style={{padding:"13px 16px",borderBottom:`1px solid ${T.bdrD}`,textAlign:"right"}}>
                        <div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>
                          <button style={{background:T.greenBg,border:`1px solid ${T.greenBdr}`,cursor:"pointer",color:T.green,padding:"6px 9px",borderRadius:7,transition:"all .12s",fontWeight:700,fontSize:11}} onClick={()=>setModal({type:"movement",data:{item,clientId:state.activeClient}})} title="Entrée/Sortie stock">⇄</button>
                          <button style={{background:T.purpleBg,border:`1px solid ${T.purpleBdr}`,cursor:"pointer",color:T.purple,padding:"6px 9px",borderRadius:7,transition:"all .12s"}} onClick={()=>setModal({type:"qrView",data:{item}})} title="Étiquette QR"><Ic n="qr" s={13}/></button>
                          <button style={{background:T.blueBg,border:`1px solid ${T.blueBdr}`,cursor:"pointer",color:T.blue,padding:"6px 9px",borderRadius:7,transition:"all .12s"}} onClick={()=>setModal({type:"itemForm",data:{item:{...item},editId:item.id}})} title="Modifier"><Ic n="edit" s={13}/></button>
                          <button style={{background:T.redBg,border:`1px solid ${T.redBdr}`,cursor:"pointer",color:T.red,padding:"6px 9px",borderRadius:7,transition:"all .12s"}} onClick={()=>setModal({type:"confirm",data:{title:"Supprimer l'article",msg:`Supprimer "${item.designation}" ? Action irréversible.`,onConfirm:()=>deleteItem(item.id)}})} title="Supprimer"><Ic n="trash" s={13}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredItems.length>0&&<div style={{padding:"10px 16px",borderTop:`1px solid ${T.bdr}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:"#F8FAFC"}}>
            <span style={{fontSize:12,color:T.muted}}>{filteredItems.length} article{filteredItems.length>1?"s":""} affiché{filteredItems.length>1?"s":""}{search||filterStatus!=="all"||filterCat!=="all"?` (filtré sur ${items.length})`:""}</span>
            <div style={{display:"flex",gap:8}}>
              <Badge v="green" dot>{statsIn} en stock</Badge>
              <Badge v="red" dot>{statsOut} sortis</Badge>
            </div>
          </div>}
        </Card>
      </div>
    );
  };

  // ── HISTORY ──
  const HistoryView = () => {
    const [hSearch,setHSearch] = useState("");
    const [serverHistory,setServerHistory] = useState([]);
    const [loadingH,setLoadingH] = useState(false);
    const [expandedRow,setExpandedRow] = useState(null);

    // Charger l'historique depuis le serveur
    const loadHistory = async () => {
      setLoadingH(true);
      try{
        const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
        const r=await fetch(`${sUrl}/api/history?limit=500`,{headers:{"Authorization":`Bearer ${serverToken}`}});
        if(r.ok){
          const data=await r.json();
          // history.js retourne {total, rows} ou tableau direct selon la version
          setServerHistory(Array.isArray(data) ? data : (data.rows||[]));
        }
        else { setServerHistory(state.history||[]); }
      }catch{ setServerHistory(state.history||[]); }
      setLoadingH(false);
    };

    useEffect(()=>{ loadHistory(); },[]);

    // Fusionner historique serveur + local, dédoublonner par id
    const allHistory = serverHistory.length > 0 ? serverHistory : (state.history||[]);

    const filtered = allHistory.filter(h=>{
      if(!hSearch) return true;
      const search = hSearch.toLowerCase();
      return [h.user,h.user_name,h.action,h.detail,h.ts,h.created_at].some(v=>v?.toLowerCase().includes(search));
    });

    const getName = h => h.user_name || h.user || "Inconnu";
    const getDate = h => {
      const d = h.created_at || h.ts || "";
      return d.slice(0,16).replace("T"," ");
    };
    const getDetail = h => h.detail || "";

    return(
      <div className="anim">
        <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"center"}}>
          <div style={{position:"relative",flex:1}}>
            <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:T.muted}}><Ic n="search" s={15}/></span>
            <input value={hSearch} onChange={e=>setHSearch(e.target.value)}
              style={{width:"100%",padding:"9px 12px 9px 36px",borderRadius:10,border:`1.5px solid ${T.bdr}`,background:T.white,color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
              placeholder="Rechercher dans l'historique..."/>
          </div>
          <Btn v="secondary" onClick={loadHistory} disabled={loadingH}>
            {loadingH?<div style={{width:14,height:14,border:`2px solid ${T.bdr}`,borderTop:`2px solid ${T.brand}`,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>:<Ic n="refresh" s={13}/>}
            Actualiser
          </Btn>
        </div>
        <Card p={0} sx={{overflow:"hidden"}}>
          {loadingH&&filtered.length===0?(
            <div style={{padding:48,textAlign:"center",color:T.muted}}>
              <div style={{width:28,height:28,border:`3px solid ${T.bdr}`,borderTop:`3px solid ${T.brand}`,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 12px"}}/>
              <div>Chargement de l'historique...</div>
            </div>
          ):filtered.length===0?(
            <div style={{padding:64,textAlign:"center",color:T.muted}}>
              <Ic n="history" s={36} c={T.bdr}/>
              <div style={{marginTop:12,fontWeight:600,color:T.sub}}>Aucune activité</div>
            </div>
          ):(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                <thead><tr>
                  {["Date / Heure","Utilisateur","Action","Détail"].map(h=>(
                    <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{filtered.map((h,i)=>{
                  const u=state.users.find(u=>u.name===getName(h));
                  const isAdd=h.action?.includes("créé")||h.action?.includes("ajouté")||h.action?.includes("mporté")||h.action?.includes("Connexion")||h.action?.includes("activé");
                  const isDel=h.action?.includes("supprimé");
                  const isMod=h.action?.includes("modifié")||h.action?.includes("Transfert")||h.action?.includes("Entrée")||h.action?.includes("Sortie")||h.action?.includes("Ajustement");
                  const detail=getDetail(h);
                  const isExpanded=expandedRow===i;
                  return(
                    <tr key={h.id||i} className="row" onClick={()=>setExpandedRow(isExpanded?null:i)} style={{cursor:"pointer"}}>
                      <td style={{padding:"11px 16px",fontSize:12,color:T.muted,whiteSpace:"nowrap",borderBottom:`1px solid ${T.bdrD}`,verticalAlign:"top"}}>{getDate(h)}</td>
                      <td style={{padding:"11px 16px",borderBottom:`1px solid ${T.bdrD}`,verticalAlign:"top"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}>
                          <Avatar name={getName(h)} color={u?.color} size={28}/>
                          <span style={{fontSize:13,fontWeight:500,color:T.txt,whiteSpace:"nowrap"}}>{getName(h)}</span>
                        </div>
                      </td>
                      <td style={{padding:"11px 16px",borderBottom:`1px solid ${T.bdrD}`,verticalAlign:"top",whiteSpace:"nowrap"}}>
                        <Badge v={isDel?"red":isAdd?"green":isMod?"blue":"gray"}>{h.action}</Badge>
                      </td>
                      <td style={{padding:"11px 16px",borderBottom:`1px solid ${T.bdrD}`,verticalAlign:"top"}}>
                        {isExpanded?(
                          <span style={{fontSize:12,color:T.sub,wordBreak:"break-word",display:"block"}}>{detail||"—"}</span>
                        ):(
                          <span style={{fontSize:12,color:T.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block",maxWidth:"min(400px, 35vw)"}} title={detail}>{detail||"—"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          )}
          <div style={{padding:"10px 16px",borderTop:`1px solid ${T.bdr}`,fontSize:12,color:T.muted,background:"#F8FAFC",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>{filtered.length} entrée{filtered.length>1?"s":""}{hSearch?" filtrée"+(filtered.length>1?"s":""):""}</span>
            <span style={{fontSize:11,color:T.muted}}>Cliquez sur une ligne pour voir le détail complet</span>
          </div>
        </Card>
      </div>
    );
  };

  // ── USERS ──
  const UsersView = () => {
    const [inviteModal,setInviteModal]=useState(false);
    const [pendingInvites,setPendingInvites]=useState([]);
    const [loadingInvites,setLoadingInvites]=useState(false);

    const loadInvites = async () => {
      setLoadingInvites(true);
      try{
        const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
        const r=await fetch(`${sUrl}/api/auth/invitations`,{headers:{"Authorization":`Bearer ${serverToken}`}});
        if(r.ok) setPendingInvites(await r.json());
      }catch{}
      setLoadingInvites(false);
    };

    useEffect(()=>{loadInvites();},[]);

    const cancelInvite = async (id) => {
      const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
      await fetch(`${sUrl}/api/auth/invitations/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${serverToken}`}});
      loadInvites(); toast_("Invitation annulée");
    };

    return(
      <div className="anim">
        {/* Info */}
        <div style={{background:T.blueBg,border:`1px solid ${T.blueBdr}`,borderRadius:12,padding:"12px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:10}}>
          <Ic n="info" s={15} c={T.blue}/>
          <span style={{fontSize:12,color:T.blueTxt}}>Les nouveaux utilisateurs reçoivent une <strong>invitation par email</strong> pour activer leur compte.</span>
        </div>

        {/* Utilisateurs actifs */}
        <div style={{fontWeight:700,fontSize:15,color:T.txt,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <Ic n="users" s={16} c={T.brand}/>Utilisateurs actifs
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16,marginBottom:28}}>
          {state.users.map(u=>(
            <Card key={u.id}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
                <Avatar name={u.name} color={u.color} size={52}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:15,color:T.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div>
                  {u.email&&<div style={{fontSize:12,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>}
                  <Badge v={u.role==="admin"?"orange":"blue"} sm style={{marginTop:4}}>{u.role==="admin"?"Administrateur":"Utilisateur"}</Badge>
                </div>
              </div>
              <Divider sx={{marginBottom:14}}/>
              <div style={{display:"flex",gap:6}}>
                {state.activeUser===u.id&&<Badge v="green" dot sm sx={{flex:1,justifyContent:"center"}}>Connecté</Badge>}
                <Btn v="blue" size="sm" sx={{flex:1,justifyContent:"center"}} onClick={()=>setModal({type:"userForm",data:{user:u,editId:u.id}})}><Ic n="edit" s={12}/>Modifier</Btn>
                {state.users.length>1&&<button style={{background:T.redBg,border:`1px solid ${T.redBdr}`,cursor:"pointer",color:T.red,padding:"5px 9px",borderRadius:7}} onClick={()=>setModal({type:"confirm",data:{title:"Désactiver l'utilisateur",msg:`Désactiver "${u.name}" ? Il ne pourra plus se connecter.`,onConfirm:()=>deleteUser(u.id)}})}><Ic n="trash" s={13}/></button>}
              </div>
            </Card>
          ))}
          {/* Bouton invitation */}
          <div onClick={()=>setInviteModal(true)}
            style={{border:`2px dashed ${T.bdrD}`,borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:32,cursor:"pointer",color:T.muted,minHeight:160,transition:"all .15s"}}>
            <Ic n="plus" s={24} c={T.muted}/>
            <span style={{fontSize:13,fontWeight:600}}>Inviter un utilisateur</span>
            <span style={{fontSize:11,textAlign:"center",color:T.muted}}>Envoi par email</span>
          </div>
        </div>

        {/* Invitations en attente */}
        {(pendingInvites.length>0||loadingInvites)&&(
          <div>
            <div style={{fontWeight:700,fontSize:15,color:T.txt,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
              <Ic n="bell" s={16} c={T.orange}/>Invitations en attente
              {loadingInvites&&<div style={{width:14,height:14,border:`2px solid ${T.bdr}`,borderTop:`2px solid ${T.brand}`,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>}
            </div>
            <div style={{display:"grid",gap:10}}>
              {pendingInvites.map(inv=>(
                <div key={inv.id} style={{background:T.card,border:`1px solid ${T.orangeBdr}`,borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:42,height:42,borderRadius:11,background:T.orangeBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="bell" s={18} c={T.orange}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:14,color:T.txt}}>{inv.name}</div>
                    <div style={{fontSize:12,color:T.muted}}>{inv.email}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:2}}>Envoyée par {inv.invited_by_name} · Expire le {new Date(inv.expires_at).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <Badge v="orange" sm>{inv.role==="admin"?"Admin":"Utilisateur"}</Badge>
                  <button onClick={()=>cancelInvite(inv.id)} style={{background:T.redBg,border:`1px solid ${T.redBdr}`,cursor:"pointer",color:T.red,padding:"6px 10px",borderRadius:8,fontSize:12,fontFamily:"inherit",fontWeight:600}}>Annuler</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal invitation */}
        {inviteModal&&<InviteModal onClose={()=>{setInviteModal(false);loadInvites();}}/>}
      </div>
    );
  };

  // ── MODAL INVITATION ──
  const InviteModal = ({onClose}) => {
    const [form,setForm]=useState({name:"",email:"",role:"user",color:"#0065FF"});
    const [loading,setLoading]=useState(false);
    const [sent,setSent]=useState(false);
    const [err,setErr]=useState("");

    const doInvite=async()=>{
      if(!form.name.trim()||!form.email.trim()){setErr("Nom et email requis");return;}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setErr("Email invalide");return;}
      setLoading(true);setErr("");
      try{
        const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
        const resp=await fetch(`${sUrl}/api/auth/invite`,{
          method:"POST",
          headers:{"Content-Type":"application/json","Authorization":`Bearer ${serverToken}`},
          body:JSON.stringify(form)
        });
        const data=await resp.json();
        if(!resp.ok){setErr(data.error||"Erreur");setLoading(false);return;}
        if(data.emailSent) setSent(true);
        else{ setErr("Invitation créée mais email non envoyé : "+( data.emailError||"vérifiez la config SMTP"));setLoading(false); }
      }catch(e){setErr("Erreur réseau");setLoading(false);}
    };

    return(
      <Modal title="Inviter un utilisateur" subtitle="Un email sera envoyé avec un lien d'activation"
        icon={<div style={{width:46,height:46,borderRadius:13,background:T.blueBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="users" s={20} c={T.blue}/></div>}
        onClose={onClose}
        footer={!sent&&<><Btn v="ghost" onClick={onClose}>Annuler</Btn><Btn onClick={doInvite} disabled={loading}>{loading?<><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Envoi...</>:<><Ic n="users" s={13}/>Envoyer l'invitation</>}</Btn></>}>
        {sent?(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,marginBottom:16}}>✅</div>
            <div style={{fontWeight:700,fontSize:18,color:T.txt,marginBottom:8}}>Invitation envoyée !</div>
            <div style={{fontSize:14,color:T.muted,lineHeight:1.7}}>
              Un email a été envoyé à <strong>{form.email}</strong>.<br/>
              Le lien est valable <strong>48 heures</strong>.
            </div>
            <Btn onClick={onClose} sx={{marginTop:20}}>Fermer</Btn>
          </div>
        ):(
          <div style={{display:"grid",gap:18}}>
            <Field label="Nom complet" required><Inp value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Prénom Nom" autoFocus/></Field>
            <Field label="Email professionnel" required><Inp type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="prenom.nom@entreprise.fr"/></Field>
            <Field label="Rôle">
              <Sel value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
                <option value="viewer">Lecteur (lecture seule)</option>
              </Sel>
            </Field>
            <Field label="Couleur de l'avatar">
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:4}}>
                {["#00875A","#0065FF","#FF8B00","#DE350B","#6554C0","#00B8D9","#DB2777","#EA580C"].map(c=>(
                  <div key={c} onClick={()=>setForm({...form,color:c})}
                    style={{width:34,height:34,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?`3px solid ${T.txt}`:"3px solid transparent",boxShadow:form.color===c?`0 0 0 2px white,0 0 0 4px ${c}`:"none",transition:"all .12s"}}/>
                ))}
              </div>
            </Field>
            {err&&<div style={{background:T.redBg,border:`1px solid ${T.redBdr}`,borderRadius:9,padding:"10px 14px",fontSize:13,color:T.red,display:"flex",alignItems:"center",gap:8}}><Ic n="alert" s={14} c={T.red}/>{err}</div>}
          </div>
        )}
      </Modal>
    );
  };

  // ── BON DE TRANSPORT ──
  const LOGO_MRDPS27 = "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EhM4MU0jZkRMzolJ7VZ7tjOniye/qHNxr059M5yd4pYjEIgXnIofkq7H3n//vddeey0YDLpcLgAIBv2qpt180y3nnHOeACEHDb6zoWoKyshfl/9pcfkcjy05GAlk2Tr/7sw/OlUbAEVnEAUL+cE1y2BM2bVr58033+T3+1wut9/vVxTtscd+P378KaZpUiqjMETqV01N9eOPP758+XK322W1Wnw+fywaGzfu5N9e89vevftIEWxb7Z2I9tnHnMuyKu33b2ukpba18lBzWWljSWOgLhDxh/Rg1IjopmFCTIAQQAQ3AUBRFIUoGrVaFavL6k6zZmQl5+SldMtJyUtzZ6hEjVs6AjghLB7eTswsW7582auvvrJjxw6P261ZLIZheL3ePn163//AA3169zVN3n6O38G0AiAGNxSqzN/56d/Wv5BiS4/RqBGN3Dfxid7Z/c22ZSxQsFCwkP+OnbVv396bbrqhubklKSkpFArGYvr1119/2WVXgMzJpEp8SwD45z//+fe/v+b3+1JSUggh3pYWVVWnTj393PPOLyoqgvaxyK+niQsui0McMcYfNUIxUw/r4VA0GNR9uqlzzhklKtU0arGoVpvFblecVtXewWWTizOThGT6+BiofLlixbJ33nln7dq1CmMul4sQ4g8EOOfnnnvuDTfcaLc7vuvMmzYBJoYwCWNs0+HVf1r0hGJVCGOt/tZLB1wxfdCFMt8drysULOS/q1kHD5bccssthw4dSktL03W9ubn57LPPvueee61WW0IYvm1ksKTkwJ/+9MfVq1drmuZ0OAzD8La22u32k08ef9ZZM4YOHR53yoSADiaMaMuoko7Y8bpOvG2VPwEApM2B+5pOEUKkonFurl696q233lq7di2l1OVyKYyFw+FAINCrqPeNN940evToxNjWdxUsUxiMKgfq9zzx5YO6GrYLd2Oo9pTCKdePuet77hNBwUK+h29YX1971113b9myOTU1FQCam5uLi4sffPChnj17JYao4vo1d+7s11//5/59e51Ol91uN0xDTq7u33/glCmnnXLKhOTk5ATlEvFUz/jdL9rVCGQyPEnwuqRLGTeg4v8BEo+syX3GNaKmpmbBgvkLF365Z88eAHC5XIyxWCzm9/nT0tLOO++8iy+51GazHZmQcdyOIMixv8qW0ocX3BvTYy7VURetK/L0feD0x1Rm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V1GUyZMnP//883l5eX/605+EEPPnzy8qKrrwwgvljXH77bd36tQJABwOx0knnVRbW/uPf/wjKSlJ07T09PT09PSnn35aCDFt2rSioqJVq1bJu+g3v/lNSkqK1Wq98847r7/++vz8/E2bNgkh7rjjjvz8fHkYQoj7778/Pz//L3/5i3z5xRdfDBkyhBBisVhOP/30/fv3JwqZYRjypOKCBQDyxB988EG5zQcffAAAY8aMAYDf/e538usPPfRQTk6OdMEGDBjw+eefx1vv1q3bBx98MHz4cEVRsrOz77rrLqm/7733Xn5+/tVXXy23/Pjjj/Pz86+66iohxHPPPedyuTRNy8jIyMjIePnll6U6X3rppR6PR1p88RN8/PHHCwoK3n333bFjxzLGOnXqdOONN8plHG+88UZN0ywWi+zGtWvXHjp0qKioaMyYMdIlbG5uvvbaa7OysiilXbt2ffzxx+UvW15eXlBQcMsttzz++ONut9tut48YMWLdunUnjp11olhYO3fulCGDSy+9dOfOnXHL4vzzz1cUhRAyYcKEadOmrVu3rqWlJTc3FwCGDRs2ffp06WLMnz+fc75s2TK5k8mTJ0+ZMqWwsLCxsfHQoUOUUrvdLoT45JNPpB0nhUnX9ZkzZ44cOfLxxx+XuyouLg6Hw5zzU045BQByc3OnTJnidrsBID093efzxf2aU0899amnnpJH8tFHH3XwAuKu3JGCJT8KBoODBw+WLc6cOVMe9ptvvimEWL58uTypCRMmDB06VP59zz33xO/5gQMHCiHeeOMNACgoKHjyySenT59eXFzs9Xrvu+8+j8dDKR0xYsS0adPeeustIUSPHj0AYN68eUKI++67DwDsdvvpp5/epUsXufNly5YJIS688EIAeOqppxIN24cfflgIsXHjRovFQil98MEHr7vuOgDo3bt3IBBIPM1Esf7iiy8A4De/+U337t2Li4vlNjNnzkxJSbn//vsB4NFHH5Xb33LLLX379n3kkUdkcx6PR1oxV1xxhTy2IUOGnHnmmfLvd999Vwjx8ssvA8Bpp50mG3399dflLy6EuP76610uF6V09OjRp59++ieffMI5nzx5MgBMmzbtySefzMrKAgApizfccIPcbf/+/c866yw54PPmm29Go9EzzjiDUqooyqRJk6ZNm7Znz569e/fKw/P7/XH7Kzc395xzzklKSoqf0a5du+Q+nU7nzJkzCwsLAWDw4MHx3x0F65ejWS+99JIc/3I4HLfddpu8Mjjn6enpAHDw4MHEC3T48OHymfbII48AwJQpU4QQl1xyCQDIh60QQhpEJSUl8tqaM2eO0+nMzMyUtkaHuEN5ebnH47FYLLW1tRUVFYqiOByODRs2yIgMISQnJ8c0TRktzsrKkvba559/rqrqzJkz4zvct2/fqlWrEl3XDoKVaIN0795denN//etfCSFSiW6++WZCiNynEELePFI4PvnkE0rpyJEjhRDPP/+8VO24vss9T5gwIX5PSgYNGkQpXbJkiRCiqKiIMfbSSy9JhzctLY1SunLlSiHEr3/9a0rpc889J7919dVXU0off/zx+L191113yY+mTJkCAHKHpmmGw+Hly5dXVFRwzuWPMm/ePAC47bbbbrnlFvnbRaNRm8128cUXv/jiiwDw+9//voPREQ6He/bsCQArVqwQQlx77bWU0nHjxslPzznnHErpAw88IPuKUjp9+nT50RtvvEEpPfPMM+XL0aNHx49NCLFp0yYAyMvLk7Gnd955R1GUX/3qV9KipJQOGTJE/lKXXnopY+zmm2+WjrbT6VRVVf7KQoht27ZRSjMzM03T3Lt3LyEkKSlp7969Qogvv/ySMZaVlRUMBktLS+12OwB88sknQoiVK1cyxtxut/Q3TwTBoifI+KBpmtddd93q1asvvvjiYDD43HPPSd1pbW2VA1t+v19e3/v27SOEDB48WFEU0zTHjRtHCCkvLzcMQ3p/EyZMkMFmq9Uqx2gURQmFQr/+9a8DgcBVV101atSoWCzGGAsEAg888EDfvn2dTmevXr18Pp8cDpfBji5duvTt29c0zREjRqiqGolEKKWyda/X261bN6fTedFFF+m6Lh+/ciDvd7/73UknnRSLxToMqyeaIQBQUlJCCBkwYEBSUpJpmtIXrqysDIVCcnhh3Lhx8voeM2ZM4nAh51zuefr06UVFRevXry8uLh47duzixYsZY1IyACAUCpmmGYvF4mOmiqJEIpHGxkbTNMeOHWuaZk5OTq9eveI7TBwtlf0Wb3fnzp2EkFdeecXpdLrd7gULFsjhV/nbVVdXjx079u9//zshRHZCfOhNGkerV6/esGFDOBy+4IILErslFov94Q9/GDZsmMvlSk5OPnjwYOIeOOcnnXSS/CMnJydxJDd+53cYjJOxcACQgTnO+Z49ewgh9fX1OTk5Tqfz6quvNgxDPnUIIbIJ2WhBQYG8wABAmtLyj/ibMoZIKZWPwIKCgu7du5um2a9fv+Tk5Nra2pqaGqvVGg6HXS7XsGHDTNPs3Lmz3PlRx6B/kSgnyHlKn2jw4MH//ve/L7zwwnPPPfejjz6qrKzMzMyMi45c5y4+2BxXOmhfyjh+YUnzXv7LOVdVtbGxMTMz0+Fw/O1vfzv//POLi4vlWNWf//znoqKil156ye12X3755aFQKJ7CI28DQohsOq6tQoj09PTf/va3sViMUmqxWKRvpSgKANx6660zZ848MlVK7kRVVXmQ8izk3SXH4GWOpWxdviOP/8jcH3kwXbt2Xbdu3auvvvq3v/1txYoVp5122vr16wcMGJDYXR2+m7hQoPzjyGQlRVFkBwYCgcQninS7+vXrJ58EiqLE3dXMzMx33nmnf//+HY42HA6PHDlSVdUPP/wwNTVVUZRTTjlFOnTyV3v55ZfvvPPOjIyMp556qlevXtdcc82BAwcSc/EsFkvir5x4IvGfKRqNdjhOeRjx/gSA7Ozsyy+/PBqNyt+ra9eu8XO3WCwy30r+FkfdT4deYoxJezbxwosfjxDCarXKzj9xdOoEEix5eyxevLixsXHixIkpKSk9e/ZkjMWNFJkRI682IcTgwYOFEKtXr25tbfV4PNL3KSwsVBSlU6dOMu5+/vnnWyyWPXv2ZGdnq6rKOZf+3TvvvHP33XdfffXVS5YssVgsGzZs0DTtgQce+NWvfrV9+/ZQKGSxWHRd79Kli6ZplZWVGzZsGDNmzMqVK6PRaGpqqmmavXv3ZowFg8HLL788Ozs7npYZv8qHDRs2bNiwxIRJefyBQECOwRmGkZSUJL2/jRs3Hjp0KDc3d+7cuUKIvLw8q9WanZ0thFi0aNHNN98MAEuXLo1rsbwNZEP19fUul+uOO+6444475EHGBUs2RymNRCJye3lDyihyU1PTl19+WVxcXF5eLmMucfVnjO3cuZNS2tDQsGrVqvgtN3DgwMWLF6empj7wwANH5q86HI4LLriggw7Kn8xqtZ588snz588nhIwfP95ms0WjUakCALBu3TpN06699trrrrvO6/X6fL643smDSXxOxF/Ky+DgwYMyG/bTTz+Ni4X8lzEWDocppZzzvn37CiFCodA111yTkpISV9LEfSb+THGpkn/IZ5I0QhljiqIYhlFcXKxp2oEDB9avXz9ixIilS5e2tLR06tSpc+fO1dXViftM/L0wD+sXghw4f+ihhwAgIyOjuLjYZrMBwPnnny+DuEOGDAGAbt269e7d+80334zFYiNHjgSAnJycQYMGAYCqqsuWLeOcf/nll/JC6d69u8x+2r59e1VVlbyIg8GgdCEB4JJLLuGcy5hXQUHBzJkzs7KypIl04MABGTkCgOTk5OHDhycnJ1NKc3JypKdw0003ybj19OnTp06d6na7X3nllcRB+g6jhH369JF59snJyampqS6X6x//+IccvJOxfHmCMnjPOV+7dq28xAcMGNC3b1+r1Rofa3v//fdlkFgOcqWmps6YMeOiiy6SlogcSZDh6szMzH79+snUkG7dusWD7v/3f/8nb6SRI0d27txZflGGjWQ+hIxzp6eny3Zl2OjAgQNyOHLAgAHnn39+//79u3btGg8yJqZ3yXOfM2cOAJx33nlCiD//+c9yt6+++qoQQkrevffeK4R4+OGHASAtLe3ss8/u2rWr/N0XL14cPwuZriWE+O1vfwsAd955pxBiy5YtcodFRUWFhYUygz8e7Tr//POlSdW3b18ZCL/88ssBwO12z5gxY/LkyU6n8/XXX48H5m655Rb5RZkGeM0118iAWq9eveSoYu/evefOnXvw4EEAcLlc8hq4/fbbpVIPGTJE/lgy9rd79275W1dXV8fjp/LpcoLEsJj8UX/Jk48IIYSkpqZ6vd7m5uampqbs7OyrrrrqqaeekiNTxcXF+/bta2xslPdAjx49pk2bFolESktLvV7v6NGjX3311XHjxpmmWVhYOGjQoLq6uurq6lAodMYZZ1x88cW6rq9cubKgoOCcc86x2+2jRo3atWtXZWXl4MGDZ86cWVJSUlVVVVdX99RTT40bN66xsfHSSy91uVwnn3xyeXl5Q0OD1Wq96aablixZIv/QNO3UU09NTU2trKzcsWNHY2PjkCFDrr76ajkyIM8l/kRNtCOkVKWkpCQlJU2aNKl3796nn346AJSVldXX1w8dOvT555+fMWMG57xLly6FhYUHDhyoqamZNGlS3759t2zZcvLJJ5988sn19fW7d+8eMGDA9OnTTdNcv379rl27SkpKiouLn3vuuUmTJskQ+4EDB5qbm8Ph8JQpU4YN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NWvWZGdny5pc6enpct5Mfn6+xWIhhCxduvSTTz5Zv359IBBwu91Wq1UW3vvkk0/WrFnj8/ncbrfNZqOURqPRuXPnzpo1q6ysLDMzUyZYtba2fvbZZ2632zTNt956a+XKlRaLJTs7e/fu3e+99962bdsyMzM9Hk881XvVqlUffvjhli1b7Ha7rPBjGMbs2bO9Xm92dvbHH388d+7c1tbWwsJCeVLvvvvuiy++aLVaU1JSqqqq8vLyoD073OPxdOvWrXPnztFo9PPPPw+Hw2lpaR999NG8efP8fn9hYaHUC0rprl273nnnndLS0szMTFmT/oYbbnC73UuWLNm4cWNSUpLb7ZZV8davX+/xeFwuFyFkw4YNs2bNWrFiRUtLi8Ph8Hg8e/bsueGGGwKBQEFBwYEDBwoKChoaGr744ovMzExCyJtvvinrHRNCunXrJitkUEpDodCcOXM++eSTioqKTp06SZEqLy//xz/+kZGRce211+KNhi7hD+kSyrnEf//73ztUsJQ1vP1+/1lnnRXvVavV+vbbb3POt2zZ0rlz569ChoTU19fLJbkAoLS0VAghqynI4gqSUaNGhcPh+fPnA0Dnzp3lxL3GxkZZ6H316tXhcDhevjnenKw0IK22OA0NDbLebnzdwCeeeEIIkZGRAe3Fi6+88srErzz00EMiocKv5LbbbpMlAKWNFjcVly5dKoRYs2YNAIwePVqWggIAh8Nx0003xQ23zp07l5aWysKHic0RQmTReikHWVlZstyF5Morr4zXgI1Xm+nZs2e8CIesSd27d28hRG1tLWOsa9euiUd46623Sk9tzpw5sloDABQWFqalpdntdukSykpbMt1fCDFq1ChoLyf96KOPJnbClVdeWVpaKgUobi4FAgFZ3/WGG26QB3/GGWfEe1j2T1lZmZxlLcnNzZXZ/4sXLwYAaecixwMK1ncTrFdeeUXGgOR9TgiRBUOefvppAJg5c6bX6123bp3b7U5OTo7FYvKKnz59emNj48KFC+VaD4cPH3a73U6ns6ysTAhx6qmnEkJSUlI++uijN998U9bwlsth9O3bFwC++OILzrms/SJrhz733HPx5qQ5kJqaGo1Gpb185plnyub+/Oc/c84XL14si5k8/vjjc+fOLSsr03W9Z8+elNKNGzf6fD7pwixatOjw4cNPPfXUnj17WltbXS6Xoiiz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";

  const BonTransportView = () => {
    const genNumBT = () => {
      const yr = new Date().getFullYear();
      const num = String(Math.floor(Math.random()*9000)+1000).padStart(4,"0");
      return `BT-${yr}-${num}`;
    };

    const entrepots = settings.entrepots || [{id:"e1",nom:"Siège Social",adresse:"5 Rue du Fond du Val",codePostal:"27600",ville:"Saint-Pierre-la-Garenne",tel:"02 32 21 09 23"}];

    // Brouillon persistant en localStorage
    const DRAFT_KEY = "mrdpstock_bt_draft";
    const loadDraft = () => {
      try{
        const d = localStorage.getItem(DRAFT_KEY);
        if(d) return JSON.parse(d);
      }catch{}
      return null;
    };
    const saveDraft = (f) => {
      try{ localStorage.setItem(DRAFT_KEY, JSON.stringify(f)); }catch{}
    };
    const clearDraft = () => {
      try{ localStorage.removeItem(DRAFT_KEY); }catch{}
    };

    const defaultForm = () => ({
      numeroBT:      genNumBT(),
      date:          new Date().toLocaleDateString("fr-FR"),
      direction:     "sortie",  // "sortie" = moi→client | "entree" = client→moi
      entrepotId:    entrepots.length>0 ? entrepots[0].id : "",
      service:       "",
      interlocuteur: activeUser?.name || "",
      express:       false,
      livNom:        "",
      livAdresse:    "",
      autreInfo:     "",
      articles:      [{ref:"",designation:"",qte:""}],
    });

    const [form, setForm] = useState(()=>{
      const draft = loadDraft();
      if(draft) return draft;
      const f = defaultForm();
      // Pré-remplir base active
      if(state.activeClient && state.clients[state.activeClient]){
        f.livNom = state.clients[state.activeClient].name;
      }
      return f;
    });

    const [historique, setHistorique]     = useState([]);
    const [showHistorique, setShowHistorique] = useState(false);

    // Sauvegarder le brouillon à chaque modif
    const setFormAndSave = (updater) => {
      setForm(prev => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        saveDraft(next);
        return next;
      });
    };

    useEffect(()=>{
      try{
        const h = localStorage.getItem("mrdpstock_bt_historique");
        if(h) setHistorique(JSON.parse(h));
      }catch{}
    },[]);

    const selectedEntrepot = entrepots.find(e=>e.id===form.entrepotId) || null;

    const updateArticle = (i, key, val) => {
      const arts = [...form.articles];
      arts[i] = {...arts[i], [key]:val};
      setFormAndSave({...form, articles:arts});
    };
    const addArticle    = () => setFormAndSave({...form, articles:[...form.articles, {ref:"",designation:"",qte:""}]});
    const removeArticle = i  => { if(form.articles.length===1) return; setFormAndSave({...form, articles:form.articles.filter((_,idx)=>idx!==i)}); };

    const saveToHistorique = () => {
      const entry = {...form, id:Date.now(), createdAt:new Date().toLocaleString("fr-FR"), createdBy:activeUser?.name||"Inconnu"};
      const h = [entry, ...historique].slice(0,100);
      setHistorique(h);
      try{ localStorage.setItem("mrdpstock_bt_historique", JSON.stringify(h)); }catch{}
    };

    const deleteFromHistorique = (id) => {
      const h = historique.filter(e=>e.id!==id);
      setHistorique(h);
      try{ localStorage.setItem("mrdpstock_bt_historique", JSON.stringify(h)); }catch{}
    };

    const loadFromHistorique = (entry) => {
      const f = {...entry, numeroBT:genNumBT(), date:new Date().toLocaleDateString("fr-FR")};
      setFormAndSave(f);
      setShowHistorique(false);
      toast_("Bon rechargé — nouveau numéro et date appliqués");
    };

    const newBon = () => {
      clearDraft();
      const f = defaultForm();
      setForm(f);
      toast_("Nouveau bon créé");
    };

    // ── GÉNÉRATION HTML IMPRESSION ────────────────────────────────
    const printBT = (saveFirst=true) => {
      if(saveFirst) saveToHistorique();

      const isSortie = form.direction === "sortie";

      // Expéditeur = entrepôt MRDPS (sortie) ou client (entrée)
      const expediteurHtml = isSortie
        ? `<div style="font-weight:800;font-size:13px">M.R.D.P.S 27</div>
           ${selectedEntrepot ? `
             <div style="color:#2d7a2d;font-weight:700;margin-top:4px">${selectedEntrepot.nom}</div>
             <div style="color:#4A5568;margin-top:3px">${selectedEntrepot.adresse||""}</div>
             <div style="color:#4A5568">${selectedEntrepot.codePostal||""} ${selectedEntrepot.ville||""}</div>
             ${selectedEntrepot.tel ? `<div style="color:#4A5568;margin-top:2px">Tél : ${selectedEntrepot.tel}</div>` : ""}
           ` : '<div style="color:#4A5568;margin-top:4px">5 Rue du Fond du Val — 27600 Saint-Pierre-la-Garenne</div>'}`
        : `<div style="font-weight:800;font-size:13px">${form.livNom||"—"}</div>
           <div style="color:#4A5568;margin-top:4px;white-space:pre-line">${form.livAdresse||""}</div>`;

      // Destinataire = client (sortie) ou entrepôt MRDPS (entrée)
      const destinataireHtml = isSortie
        ? `<div style="font-weight:800;font-size:13px">${form.livNom||"—"}</div>
           <div style="color:#4A5568;margin-top:4px;white-space:pre-line;line-height:1.6">${form.livAdresse||""}</div>`
        : `<div style="font-weight:800;font-size:13px">M.R.D.P.S 27</div>
           ${selectedEntrepot ? `
             <div style="color:#2d7a2d;font-weight:700;margin-top:4px">${selectedEntrepot.nom}</div>
             <div style="color:#4A5568;margin-top:3px">${selectedEntrepot.adresse||""}</div>
             <div style="color:#4A5568">${selectedEntrepot.codePostal||""} ${selectedEntrepot.ville||""}</div>
             ${selectedEntrepot.tel ? `<div style="color:#4A5568;margin-top:2px">Tél : ${selectedEntrepot.tel}</div>` : ""}
           ` : '<div style="color:#4A5568;margin-top:4px">5 Rue du Fond du Val — 27600 Saint-Pierre-la-Garenne</div>'}`;

      const dirLabel = isSortie ? "Sortie de stock" : "Entrée de stock";
      const dirColor = isSortie ? "#dc2626" : "#2d7a2d";

      const articlesRows = form.articles.map(a=>`
        <tr>
          <td style="font-weight:700;color:#2d7a2d">${a.ref||""}</td>
          <td>${a.designation||""}</td>
          <td style="text-align:center;font-weight:700">${a.qte||""}</td>
        </tr>`).join("");

      const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Bon de Transport ${form.numeroBT}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;font-family:Arial,sans-serif;font-size:12px;color:#0D1B2A}
  html,body{height:100%;margin:0}
  body{padding:24px 30px;background:white;display:flex;flex-direction:column;height:100vh}
  .page{flex:1;display:flex;flex-direction:column;height:100%}
  .main{flex:1;display:flex;flex-direction:column}
  .header{display:grid;grid-template-columns:200px 1fr 180px;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:3px solid #2d7a2d}
  .header-center{text-align:center}
  .bt-title{font-size:18px;font-weight:800;color:#0D1B2A;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
  .dir-badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;color:white;background:${dirColor}}
  .bl-num{text-align:right}
  .bl-label{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:1px}
  .bl-val{font-size:20px;font-weight:800;color:#2d7a2d}
  .section-title{font-size:9px;font-weight:700;color:#2d7a2d;text-transform:uppercase;letter-spacing:1.5px;margin:12px 0 8px;border-bottom:1px solid #E8ECF1;padding-bottom:4px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
  .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px}
  .box{background:#F8FAFC;border:1px solid #D0D7E0;border-radius:6px;padding:12px}
  .box-dest{background:#F0FDF4;border:1px solid #86EFAC;border-radius:6px;padding:12px}
  .fl{font-size:9px;color:#8B9BB4;text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px}
  .fv{font-size:12px;font-weight:500;border-bottom:1px solid #E8ECF1;padding:4px 0;min-height:22px}
  .express-row{display:flex;align-items:center;gap:20px;background:#F8FAFC;border:1px solid #D0D7E0;border-radius:6px;padding:8px 14px;margin-bottom:12px}
  .chk{width:14px;height:14px;border:2px solid #CBD5E0;border-radius:3px;display:inline-block;vertical-align:middle;margin-right:5px;position:relative}
  .chk.yes{border-color:#2d7a2d;background:#dcfce7}
  .chk.yes::after{content:"✓";position:absolute;top:-2px;left:1px;font-size:11px;color:#2d7a2d;font-weight:700}
  table{width:100%;border-collapse:collapse;margin-bottom:12px;table-layout:fixed}
  thead th{padding:8px 10px;text-align:left;background:#F8FAFC;border:1px solid #D0D7E0;font-size:10px;font-weight:700;color:#4A5568;text-transform:uppercase;letter-spacing:.8px}
  tbody td{padding:9px 10px;border:1px solid #D0D7E0;font-size:12px;vertical-align:middle}
  tbody tr:nth-child(even) td{background:#FAFBFC}
  .col-ref{width:110px}
  .col-qte{width:60px;text-align:center!important}
  .autres{min-height:40px;border:1px solid #D0D7E0;border-radius:6px;padding:9px 12px;color:#4A5568;background:#FAFBFC;margin-bottom:12px;line-height:1.6}
  .content-wrap{flex:1;display:flex;flex-direction:column}
  .content-top{flex:1}
  .sign-row{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding-top:14px;border-top:1px solid #E8ECF1;padding-bottom:10px;margin-top:24px}
  .sign-zone{border:1px dashed #CBD5E0;border-radius:6px;height:56px}
  .footer{padding-top:10px;border-top:2px solid #2d7a2d;text-align:center;font-size:9px;color:#666;line-height:1.9}
  @media print{body{padding:10px 16px;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:.7cm;size:A4}}
</style></head><body>
<div class="page">
<div class="main">
<div class="content-wrap">
<div class="content-top">
<div class="header">
  <div style="display:flex;align-items:center"><img src="${LOGO_MRDPS27}" style="height:130px;width:auto;object-fit:contain"/></div>
  <div class="header-center">
    <div class="bt-title">Bon de Transport</div>
    <span class="dir-badge">${dirLabel}</span>
  </div>
  <div class="bl-num">
    <div class="bl-label">N° Bon de transport</div>
    <div class="bl-val">${form.numeroBT}</div>
    <div style="font-size:10px;color:#888;margin-top:3px">${form.date}</div>
  </div>
</div>

<div class="grid2">
  <div class="box">
    <div style="font-size:9px;font-weight:700;color:#2d7a2d;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Expéditeur</div>
    ${expediteurHtml}
  </div>
  <div class="box-dest">
    <div style="font-size:9px;font-weight:700;color:#006644;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Destinataire / Point de livraison</div>
    ${destinataireHtml}
  </div>
</div>

<div class="section-title">Informations d'expédition</div>
<div class="grid3">
  <div><div class="fl">Service</div><div class="fv">${form.service||""}</div></div>
  <div><div class="fl">Site / Entrepôt</div><div class="fv">${selectedEntrepot?.nom||""}</div></div>
  <div><div class="fl">Interlocuteur</div><div class="fv">${form.interlocuteur||""}</div></div>
</div>

<div class="express-row">
  <span style="font-weight:700">Express :</span>
  <span><span class="chk ${form.express?"yes":""}"></span> OUI</span>
  <span><span class="chk ${!form.express?"yes":""}"></span> NON</span>
</div>

<div class="section-title">Référence ou Dénomination de Pièce</div>
<table><thead><tr>
  <th class="col-ref">Référence</th>
  <th>Désignation / Dénomination de pièce</th>
  <th class="col-qte">Qté</th>
</tr></thead><tbody>${articlesRows}</tbody></table>

<div class="section-title">Autre info</div>
<div class="autres">${form.autreInfo||""}</div>

</div><!-- fin content-top -->
<div class="sign-row">
  <div><div class="fl">Date</div><div class="fv">${form.date}</div></div>
  <div><div class="fl">Signature</div><div class="sign-zone"></div></div>
</div>
</div><!-- fin content-wrap -->
</div><!-- fin main -->

<div class="footer">
  <div style="font-weight:700;color:#2d7a2d;font-size:10px;margin-bottom:4px">M.R.D.P.S 27 — Stockage · Logistique · Manutention · Désinvestissement industriel</div>
  <div>5 Rue du Fond du Val — 27600 Saint-Pierre-la-Garenne — RCS Évreux 850 373 994</div>
  <div>Tél : 02 32 21 09 23 | Mobile : 06 47 61 18 28 | comptabilite@mrdps27.fr | www.mrdps27.fr</div>
  <div>T.V.A. Intracom N° FR 72850373994 &nbsp;·&nbsp; ${form.numeroBT} — MRDPSTOCK v3</div>
</div>
</div></body></html>`;

      const w = window.open("","_blank","width=820,height=960");
      w.document.write(html);
      w.document.close();
      setTimeout(()=>w.print(), 600);
    };

    const inp = {width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${T.bdr}`,background:T.white,color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
    const lbl = {fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,display:"block",marginBottom:5};
    const sel = {padding:"8px 10px",borderRadius:8,border:`1.5px solid ${T.bdr}`,background:T.white,color:T.txt,fontSize:12,fontFamily:"inherit",outline:"none",flexShrink:0};

    // ── VUE HISTORIQUE ────────────────────────────────────────────
    if(showHistorique) return(
      <div className="anim">
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <Btn v="secondary" onClick={()=>setShowHistorique(false)}><Ic n="chevR" s={13} style={{transform:"rotate(180deg)"}}/>Retour</Btn>
          <div style={{fontWeight:700,fontSize:16,color:T.txt}}>Historique des bons de transport</div>
          <span style={{fontSize:12,color:T.muted}}>({historique.length} bon{historique.length>1?"s":""})</span>
        </div>
        {historique.length===0?(
          <Card><div style={{textAlign:"center",padding:"32px 0",color:T.muted}}>
            <Ic n="history" s={36} c={T.bdr}/>
            <div style={{marginTop:12,fontWeight:600,color:T.sub}}>Aucun bon enregistré</div>
            <div style={{fontSize:12,marginTop:4}}>Les bons imprimés sont sauvegardés automatiquement</div>
          </div></Card>
        ):(
          <Card p={0} sx={{overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                {["N° BT","Type","Créé le","Expéditeur","Destinataire","Articles","Actions"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {historique.map(e=>{
                  const isSortie = e.direction!=="entree";
                  return(
                    <tr key={e.id} className="row">
                      <td style={{padding:"11px 14px",fontWeight:700,color:T.brand,borderBottom:`1px solid ${T.bdrD}`}}>{e.numeroBT}</td>
                      <td style={{padding:"11px 14px",borderBottom:`1px solid ${T.bdrD}`}}>
                        <Badge v={isSortie?"red":"green"} sm>{isSortie?"Sortie":"Entrée"}</Badge>
                      </td>
                      <td style={{padding:"11px 14px",fontSize:12,color:T.muted,borderBottom:`1px solid ${T.bdrD}`,whiteSpace:"nowrap"}}>{e.createdAt}</td>
                      <td style={{padding:"11px 14px",fontSize:12,color:T.txt,borderBottom:`1px solid ${T.bdrD}`}}>
                        {isSortie ? "M.R.D.P.S 27" : (e.livNom||"—")}
                      </td>
                      <td style={{padding:"11px 14px",fontSize:12,color:T.txt,borderBottom:`1px solid ${T.bdrD}`}}>
                        {isSortie ? (e.livNom||"—") : "M.R.D.P.S 27"}
                      </td>
                      <td style={{padding:"11px 14px",fontSize:12,color:T.muted,borderBottom:`1px solid ${T.bdrD}`}}>{e.articles.filter(a=>a.ref).length} art.</td>
                      <td style={{padding:"11px 14px",borderBottom:`1px solid ${T.bdrD}`}}>
                        <div style={{display:"flex",gap:6}}>
                          <Btn v="blue" size="sm" onClick={()=>loadFromHistorique(e)}><Ic n="edit" s={12}/>Recharger</Btn>
                          <Btn v="secondary" size="sm" onClick={()=>{ setForm({...e}); setShowHistorique(false); setTimeout(()=>printBT(false),100); }}><Ic n="save" s={12}/>Réimprimer</Btn>
                          <button onClick={()=>deleteFromHistorique(e.id)} style={{background:T.redBg,border:`1px solid ${T.redBdr}`,cursor:"pointer",color:T.red,padding:"5px 8px",borderRadius:7}}><Ic n="trash" s={12}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    );

    // ── VUE PRINCIPALE ────────────────────────────────────────────
    const isSortie = form.direction === "sortie";

    return(
      <div className="anim">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontWeight:700,fontSize:16,color:T.txt}}>Bon de transport</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>
              {form.direction==="sortie" ? "Sortie : M.R.D.P.S 27 → Client" : "Entrée : Client → M.R.D.P.S 27"}
              <span style={{fontSize:11,color:T.muted,marginLeft:8}}>· Brouillon sauvegardé automatiquement</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn v="secondary" onClick={()=>setShowHistorique(true)}>
              <Ic n="history" s={13}/>Historique ({historique.length})
            </Btn>
            <Btn v="secondary" onClick={newBon}>
              <Ic n="plus" s={13}/>Nouveau bon
            </Btn>
            <Btn v="secondary" onClick={()=>setFormAndSave({...form,numeroBT:genNumBT()})}>
              <Ic n="refresh" s={13}/>Nouveau N°
            </Btn>
            <Btn onClick={()=>printBT(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Imprimer / PDF
            </Btn>
          </div>
        </div>

        {/* Direction du bon */}
        <Card sx={{marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:13,color:T.txt,marginBottom:14}}>Type de bon</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[
              {v:"sortie", icon:"moveOut", label:"Sortie de stock",  desc:"M.R.D.P.S 27  →  Client / Destinataire", color:T.red,   bg:T.redBg,   bdr:T.redBdr},
              {v:"entree", icon:"moveIn",  label:"Entrée de stock",  desc:"Client / Expéditeur  →  M.R.D.P.S 27",  color:T.green, bg:T.greenBg, bdr:T.greenBdr},
            ].map(opt=>(
              <div key={opt.v} onClick={()=>setFormAndSave({...form,direction:opt.v})}
                style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:12,cursor:"pointer",
                  background:form.direction===opt.v?opt.bg:"transparent",
                  border:`2px solid ${form.direction===opt.v?opt.bdr:T.bdr}`,
                  transition:"all .15s"}}>
                <div style={{width:40,height:40,borderRadius:10,background:form.direction===opt.v?opt.color+"22":"#F1F5F9",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ic n={opt.icon} s={18} c={form.direction===opt.v?opt.color:T.muted}/>
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:form.direction===opt.v?opt.color:T.txt}}>{opt.label}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{opt.desc}</div>
                </div>
                {form.direction===opt.v&&<div style={{marginLeft:"auto",width:18,height:18,borderRadius:"50%",background:opt.color,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={10} c="#fff"/></div>}
              </div>
            ))}
          </div>
        </Card>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            <Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><label style={lbl}>N° Bon de transport</label>
                  <input style={{...inp,fontWeight:700,color:T.brand}} value={form.numeroBT} onChange={e=>setFormAndSave({...form,numeroBT:e.target.value})}/>
                </div>
                <div><label style={lbl}>Date</label>
                  <input style={inp} value={form.date} onChange={e=>setFormAndSave({...form,date:e.target.value})}/>
                </div>
              </div>
            </Card>

            {/* EXPÉDITEUR — change selon la direction */}
            <Card>
              <div style={{fontWeight:600,fontSize:13,color:T.txt,marginBottom:12}}>
                Expéditeur {isSortie?"(M.R.D.P.S 27)":"(Client)"}
              </div>
              {isSortie ? (
                <>
                  <div style={{background:T.greenBg,border:`1px solid ${T.greenBdr}`,borderRadius:8,padding:"9px 14px",marginBottom:12,fontSize:12,color:T.green,fontWeight:600}}>
                    M.R.D.P.S 27
                  </div>
                  <label style={lbl}>Site d'envoi (entrepôt)</label>
                  <select style={{...inp,marginBottom:8}} value={form.entrepotId} onChange={e=>setFormAndSave({...form,entrepotId:e.target.value})}>
                    <option value="">— Sélectionner un entrepôt —</option>
                    {entrepots.map(e=><option key={e.id} value={e.id}>{e.nom} — {e.ville||e.adresse}</option>)}
                  </select>
                  {selectedEntrepot&&(
                    <div style={{background:"#F8FAFC",border:`1px solid ${T.bdr}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:T.sub,lineHeight:1.7}}>
                      <div style={{fontWeight:700,color:T.txt}}>{selectedEntrepot.nom}</div>
                      {selectedEntrepot.adresse&&<div>{selectedEntrepot.adresse}</div>}
                      {(selectedEntrepot.codePostal||selectedEntrepot.ville)&&<div>{selectedEntrepot.codePostal} {selectedEntrepot.ville}</div>}
                      {selectedEntrepot.tel&&<div>Tél : {selectedEntrepot.tel}</div>}
                    </div>
                  )}
                  {entrepots.length===0&&<div style={{fontSize:12,color:T.muted,marginTop:6}}>⚠ <button onClick={()=>setView("settings")} style={{background:"none",border:"none",cursor:"pointer",color:T.brand,fontSize:12,fontFamily:"inherit",fontWeight:600}}>Configurer les entrepôts dans Paramètres</button></div>}
                </>
              ) : (
                // Entrée : l'expéditeur c'est le client
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div><label style={lbl}>Nom du client / expéditeur</label>
                    <div style={{display:"flex",gap:8}}>
                      <input style={{...inp,flex:1}} value={form.livNom} onChange={e=>setFormAndSave({...form,livNom:e.target.value})} placeholder="Nom de l'expéditeur"/>
                      <select style={sel} value="" onChange={e=>{if(e.target.value){const c=state.clients[e.target.value];setFormAndSave({...form,livNom:c.name});}}}>
                        <option value="">Base →</option>
                        {Object.entries(state.clients).map(([id,c])=><option key={id} value={id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label style={lbl}>Adresse de l'expéditeur</label>
                    <textarea value={form.livAdresse} onChange={e=>setFormAndSave({...form,livAdresse:e.target.value})}
                      placeholder="Adresse complète..."
                      style={{...inp,height:60,resize:"vertical",lineHeight:1.5}}/>
                  </div>
                </div>
              )}
            </Card>

            {/* DESTINATAIRE — change selon la direction */}
            <Card>
              <div style={{fontWeight:600,fontSize:13,color:T.txt,marginBottom:12}}>
                Destinataire {isSortie?"(Client)":"(M.R.D.P.S 27 — entrepôt de réception)"}
              </div>
              {isSortie ? (
                // Sortie : le destinataire c'est le client
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div><label style={lbl}>Nom / Destinataire</label>
                    <div style={{display:"flex",gap:8}}>
                      <input style={{...inp,flex:1}} value={form.livNom} onChange={e=>setFormAndSave({...form,livNom:e.target.value})} placeholder="Nom du destinataire"/>
                      <select style={sel} value="" onChange={e=>{if(e.target.value){const c=state.clients[e.target.value];setFormAndSave({...form,livNom:c.name});}}}>
                        <option value="">Base →</option>
                        {Object.entries(state.clients).map(([id,c])=><option key={id} value={id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label style={lbl}>Adresse complète</label>
                    <textarea value={form.livAdresse} onChange={e=>setFormAndSave({...form,livAdresse:e.target.value})}
                      placeholder="Adresse, code postal, ville..."
                      style={{...inp,height:60,resize:"vertical",lineHeight:1.5}}/>
                  </div>
                </div>
              ) : (
                // Entrée : le destinataire c'est M.R.D.P.S 27
                <>
                  <div style={{background:T.greenBg,border:`1px solid ${T.greenBdr}`,borderRadius:8,padding:"9px 14px",marginBottom:12,fontSize:12,color:T.green,fontWeight:600}}>
                    M.R.D.P.S 27
                  </div>
                  <label style={lbl}>Entrepôt de réception</label>
                  <select style={{...inp,marginBottom:8}} value={form.entrepotId} onChange={e=>setFormAndSave({...form,entrepotId:e.target.value})}>
                    <option value="">— Sélectionner un entrepôt —</option>
                    {entrepots.map(e=><option key={e.id} value={e.id}>{e.nom} — {e.ville||e.adresse}</option>)}
                  </select>
                  {selectedEntrepot&&(
                    <div style={{background:"#F8FAFC",border:`1px solid ${T.bdr}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:T.sub,lineHeight:1.7}}>
                      <div style={{fontWeight:700,color:T.txt}}>{selectedEntrepot.nom}</div>
                      {selectedEntrepot.adresse&&<div>{selectedEntrepot.adresse}</div>}
                      {(selectedEntrepot.codePostal||selectedEntrepot.ville)&&<div>{selectedEntrepot.codePostal} {selectedEntrepot.ville}</div>}
                      {selectedEntrepot.tel&&<div>Tél : {selectedEntrepot.tel}</div>}
                    </div>
                  )}
                </>
              )}
            </Card>

            <Card>
              <div style={{fontWeight:600,fontSize:13,color:T.txt,marginBottom:12}}>Informations d'expédition</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div><label style={lbl}>Service</label>
                  <input style={inp} value={form.service} onChange={e=>setFormAndSave({...form,service:e.target.value})} placeholder="Ex: Informatique, Logistique..."/>
                </div>
                <div><label style={lbl}>Interlocuteur</label>
                  <input style={inp} value={form.interlocuteur} onChange={e=>setFormAndSave({...form,interlocuteur:e.target.value})}/>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontWeight:600,fontSize:13,color:T.txt}}>Express</span>
                <div style={{display:"flex",gap:10}}>
                  {[{v:true,l:"OUI"},{v:false,l:"NON"}].map(opt=>(
                    <div key={String(opt.v)} onClick={()=>setFormAndSave({...form,express:opt.v})}
                      style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"7px 16px",borderRadius:8,
                        background:form.express===opt.v?(opt.v?T.greenBg:T.redBg):"transparent",
                        border:`1.5px solid ${form.express===opt.v?(opt.v?T.greenBdr:T.redBdr):T.bdr}`,
                        fontWeight:600,fontSize:13,color:form.express===opt.v?(opt.v?T.green:T.red):T.muted,transition:"all .12s"}}>
                      <div style={{width:16,height:16,border:`2px solid ${form.express===opt.v?(opt.v?T.green:T.red):T.bdr}`,borderRadius:3,background:form.express===opt.v?(opt.v?T.greenBg:"#FFF"):T.white,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {form.express===opt.v&&<Ic n="check" s={10} c={opt.v?T.green:T.red}/>}
                      </div>
                      {opt.l}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            <Card p={0} sx={{overflow:"hidden"}}>
              <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.bdr}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{fontWeight:600,fontSize:13,color:T.txt}}>Articles / Références</div>
                <Btn size="sm" onClick={addArticle}><Ic n="plus" s={12}/>Ajouter</Btn>
              </div>
              <div style={{padding:12,display:"flex",flexDirection:"column",gap:7}}>
                {form.articles.map((a,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"110px 1fr 60px 28px",gap:6,alignItems:"center"}}>
                    <input style={{...inp,padding:"6px 8px",fontSize:12,fontWeight:700,color:T.brand}} value={a.ref} onChange={e=>updateArticle(i,"ref",e.target.value)} placeholder="Référence"/>
                    <input style={{...inp,padding:"6px 8px",fontSize:12}} value={a.designation} onChange={e=>updateArticle(i,"designation",e.target.value)} placeholder="Désignation"/>
                    <input type="number" min="0" style={{...inp,padding:"6px 8px",fontSize:12,textAlign:"center"}} value={a.qte} onChange={e=>updateArticle(i,"qte",e.target.value)} placeholder="Qté"/>
                    {form.articles.length>1&&(
                      <button onClick={()=>removeArticle(i)} style={{background:T.redBg,border:`1px solid ${T.redBdr}`,cursor:"pointer",color:T.red,borderRadius:6,padding:"5px 6px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Ic n="trash" s={12}/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{padding:"8px 12px",borderTop:`1px solid ${T.bdr}`,background:"#F8FAFC"}}>
                <Btn v="secondary" size="sm" onClick={()=>{
                  const items=(state.clients[state.activeClient]?.items||[]).filter(it=>it.etat==="en_stock").slice(0,10);
                  if(items.length>0) setFormAndSave({...form,articles:items.map(it=>({ref:it.reference,designation:it.designation,qte:String(it.quantite||"")}))});
                  else toast_("Ouvrez d'abord une base dans Stock","error");
                }}><Ic n="grid" s={12}/>Importer depuis le stock</Btn>
              </div>
            </Card>

            <Card>
              <div style={{fontWeight:600,fontSize:13,color:T.txt,marginBottom:10}}>Autre info</div>
              <textarea value={form.autreInfo} onChange={e=>setFormAndSave({...form,autreInfo:e.target.value})}
                placeholder="Instructions, remarques..."
                style={{...inp,height:90,resize:"vertical",lineHeight:1.6}}/>
            </Card>

            <div style={{background:isSortie?T.redBg:T.greenBg,border:`1px solid ${isSortie?T.redBdr:T.greenBdr}`,borderRadius:12,padding:"16px 20px"}}>
              <div style={{fontSize:11,color:isSortie?T.red:T.green,fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>
                {isSortie?"Sortie de stock":"Entrée de stock"} — Aperçu
              </div>
              <div style={{fontSize:24,fontWeight:800,color:isSortie?T.red:T.green,letterSpacing:1}}>{form.numeroBT}</div>
              <div style={{fontSize:12,color:isSortie?T.red:T.green,marginTop:5,lineHeight:1.7}}>
                <div>{isSortie?"De : M.R.D.P.S 27":"De : "+(form.livNom||"—")}</div>
                <div>{isSortie?"Vers : "+(form.livNom||"—"):"Vers : M.R.D.P.S 27"}</div>
                <div>{form.articles.filter(a=>a.ref).length} article{form.articles.filter(a=>a.ref).length>1?"s":""} · {form.date} {form.express?"· EXPRESS":""}</div>
              </div>
            </div>

          </div>
        </div>

        <div style={{textAlign:"center",marginTop:8}}>
          <Btn onClick={()=>printBT(true)} sx={{padding:"12px 36px",fontSize:15}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Imprimer / Télécharger PDF
          </Btn>
        </div>
      </div>
    );
  };

    // ── INVENTAIRE PHYSIQUE ──
  const InventaireView = () => {
    const [step,setStep]         = useState("select");  // select | count | report
    const [baseId,setBaseId]     = useState("");
    const [items2,setItems2]     = useState([]);
    const [counts,setCounts]     = useState({});       // {itemId: qty_comptée}
    const [loading,setLoading]   = useState(false);
    const [saving,setSaving]     = useState(false);
    const [report,setReport]     = useState(null);

    // Charger les articles de la base sélectionnée
    const loadBase = async (bid) => {
      if(!bid) return;
      setLoading(true);
      try{
        const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
        const r=await fetch(`${sUrl}/api/items?base_id=${bid}`,{headers:{"Authorization":`Bearer ${serverToken}`}});
        if(r.ok){
          const data=await r.json();
          setItems2(data);
          // Pré-remplir avec les quantités théoriques
          const c={};
          data.forEach(it=>{ c[it.id]=String(it.quantite||0); });
          setCounts(c);
          setStep("count");
        }
      }catch(e){toast_("Erreur chargement articles","error");}
      setLoading(false);
    };

    // Calculer le rapport d'écart
    const calcReport = () => {
      const ecarts = items2.map(it=>{
        const theorique = parseInt(it.quantite)||0;
        const physique  = parseInt(counts[it.id])||0;
        const ecart     = physique - theorique;
        return {...it, theorique, physique, ecart};
      }).filter(it=>it.ecart!==0);

      const total_ecart_pos = ecarts.filter(e=>e.ecart>0).reduce((s,e)=>s+e.ecart,0);
      const total_ecart_neg = ecarts.filter(e=>e.ecart<0).reduce((s,e)=>s+e.ecart,0);

      setReport({ecarts, total_ecart_pos, total_ecart_neg, date:new Date().toLocaleString("fr-FR"), baseName: state.clients[baseId]?.name});
      setStep("report");
    };

    // Appliquer les corrections (ajustements de stock)
    const applyCorrections = async () => {
      if(!report || report.ecarts.length===0) return;
      setSaving(true);
      const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
      let ok=0, fail=0;
      for(const e of report.ecarts){
        try{
          const resp=await fetch(`${sUrl}/api/mouvements`,{
            method:"POST",
            headers:{"Content-Type":"application/json","Authorization":`Bearer ${serverToken}`},
            body:JSON.stringify({
              item_id:e.id, type:"ajustement",
              quantite:Math.abs(e.ecart),
              motif:`Inventaire physique du ${report.date} — écart ${e.ecart>0?"+":""}${e.ecart}`
            })
          });
          if(resp.ok) ok++; else fail++;
        }catch{ fail++; }
      }
      setSaving(false);
      if(fail===0) toast_(`✅ ${ok} correction${ok>1?"s":""} appliquée${ok>1?"s":""}`);
      else toast_(`${ok} OK, ${fail} erreur${fail>1?"s":""}`, fail>0?"error":"success");
      setStep("select");
      setBaseId(""); setItems2([]); setCounts({}); setReport(null);
    };

    // Export PDF du rapport
    const exportPDF = () => {
      if(!report) return;
      const rows = report.ecarts.map(e=>
        `${e.reference} | ${e.designation} | Théorique: ${e.theorique} | Physique: ${e.physique} | Écart: ${e.ecart>0?"+":""}${e.ecart}`
      ).join("\n");
      const content2 = `RAPPORT D'INVENTAIRE PHYSIQUE\n${report.baseName}\nDate: ${report.date}\n${"─".repeat(60)}\n${rows}\n${"─".repeat(60)}\nEcarts positifs: +${report.total_ecart_pos}  |  Ecarts négatifs: ${report.total_ecart_neg}\nTotal articles avec écart: ${report.ecarts.length}`;
      const blob=new Blob([content2],{type:"text/plain"});
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=`Inventaire_${report.baseName?.replace(/[^a-z0-9]/gi,"_")}_${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      toast_("Rapport téléchargé");
    };

    return(
      <div className="anim">
        {/* Étape 1 — Sélection de la base */}
        {step==="select"&&(
          <div style={{maxWidth:520}}>
            <div style={{background:T.blueBg,border:`1px solid ${T.blueBdr}`,borderRadius:12,padding:"14px 18px",marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
              <Ic n="info" s={15} c={T.blue}/>
              <div style={{fontSize:13,color:T.blueTxt,lineHeight:1.6}}>
                <strong>L'inventaire physique</strong> vous permet de comparer le stock théorique (dans le système) avec ce que vous comptez réellement sur le terrain, et de corriger les écarts.
              </div>
            </div>
            <Card>
              <div style={{fontWeight:700,fontSize:16,color:T.txt,marginBottom:20}}>Démarrer un inventaire</div>
              <Field label="Choisir la base à inventorier" required>
                <Sel value={baseId} onChange={e=>setBaseId(e.target.value)}>
                  <option value="">— Sélectionner une base —</option>
                  {Object.entries(state.clients).map(([id,c])=><option key={id} value={id}>{c.name} ({c.items.length} articles)</option>)}
                </Sel>
              </Field>
              <div style={{marginTop:20}}>
                <Btn onClick={()=>loadBase(baseId)} disabled={!baseId||loading}>
                  {loading?<><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Chargement...</>:<><Ic n="check" s={13}/>Commencer l'inventaire</>}
                </Btn>
              </div>
            </Card>
          </div>
        )}

        {/* Étape 2 — Saisie des quantités */}
        {step==="count"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontWeight:700,fontSize:16,color:T.txt}}>Inventaire — {state.clients[baseId]?.name}</div>
                <div style={{fontSize:12,color:T.muted,marginTop:2}}>Saisissez les quantités réelles comptées sur le terrain</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn v="secondary" onClick={()=>{setStep("select");setItems2([]);setCounts({});}}>Annuler</Btn>
                <Btn onClick={calcReport}><Ic n="check" s={13}/>Calculer les écarts</Btn>
              </div>
            </div>
            <Card p={0} sx={{overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  {["Référence","Désignation","Catégorie","Stock système","Qté comptée","Écart estimé"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {items2.map(it=>{
                    const theorique=parseInt(it.quantite)||0;
                    const physique=parseInt(counts[it.id])||0;
                    const ecart=physique-theorique;
                    const ecartColor=ecart>0?T.green:ecart<0?T.red:T.muted;
                    return(
                      <tr key={it.id} className="row" style={{background:ecart!==0?"#FFFBF0":undefined}}>
                        <td style={{padding:"10px 14px",fontWeight:700,color:T.brand,fontSize:13,borderBottom:`1px solid ${T.bdrD}`}}>{it.reference}</td>
                        <td style={{padding:"10px 14px",fontWeight:600,color:T.txt,fontSize:13,borderBottom:`1px solid ${T.bdrD}`}}>{it.designation}</td>
                        <td style={{padding:"10px 14px",fontSize:12,color:T.muted,borderBottom:`1px solid ${T.bdrD}`}}>{it.categorie||"—"}</td>
                        <td style={{padding:"10px 14px",textAlign:"center",fontWeight:700,fontSize:14,color:T.txt,borderBottom:`1px solid ${T.bdrD}`}}>{theorique}</td>
                        <td style={{padding:"8px 14px",borderBottom:`1px solid ${T.bdrD}`}}>
                          <input type="number" min="0" value={counts[it.id]??theorique}
                            onChange={e=>setCounts({...counts,[it.id]:e.target.value})}
                            style={{width:80,padding:"6px 10px",borderRadius:8,border:`1.5px solid ${ecart!==0?ecartColor:T.bdr}`,background:T.white,color:T.txt,fontSize:14,fontWeight:700,fontFamily:"inherit",outline:"none",textAlign:"center"}}/>
                        </td>
                        <td style={{padding:"10px 14px",textAlign:"center",borderBottom:`1px solid ${T.bdrD}`}}>
                          {ecart===0?(
                            <span style={{fontSize:12,color:T.muted}}>—</span>
                          ):(
                            <span style={{fontWeight:800,fontSize:14,color:ecartColor}}>{ecart>0?"+":""}{ecart}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{padding:"10px 16px",borderTop:`1px solid ${T.bdr}`,background:"#F8FAFC",display:"flex",justifyContent:"space-between",fontSize:12,color:T.muted}}>
                <span>{items2.length} articles à inventorier</span>
                <span>{Object.values(counts).filter((v,i)=>parseInt(v)!==(parseInt(items2[i]?.quantite)||0)).length} écarts détectés</span>
              </div>
            </Card>
          </div>
        )}

        {/* Étape 3 — Rapport d'écart */}
        {step==="report"&&report&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontWeight:700,fontSize:16,color:T.txt}}>Rapport d'inventaire — {report.baseName}</div>
                <div style={{fontSize:12,color:T.muted,marginTop:2}}>{report.date}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn v="secondary" onClick={()=>setStep("count")}><Ic n="edit" s={13}/>Corriger les saisies</Btn>
                <Btn v="secondary" onClick={exportPDF}><Ic n="save" s={13}/>Télécharger rapport</Btn>
                {report.ecarts.length>0&&<Btn onClick={applyCorrections} disabled={saving}>{saving?"Application...":"Appliquer les corrections"}</Btn>}
              </div>
            </div>

            {/* Résumé */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
              <div style={{background:T.greenBg,border:`1px solid ${T.greenBdr}`,borderRadius:12,padding:"16px 20px"}}>
                <div style={{fontSize:11,color:T.green,fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Articles conformes</div>
                <div style={{fontSize:28,fontWeight:800,color:T.green}}>{items2.length-report.ecarts.length}</div>
                <div style={{fontSize:11,color:T.green}}>sur {items2.length} articles</div>
              </div>
              <div style={{background:T.redBg,border:`1px solid ${T.redBdr}`,borderRadius:12,padding:"16px 20px"}}>
                <div style={{fontSize:11,color:T.red,fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Articles avec écart</div>
                <div style={{fontSize:28,fontWeight:800,color:T.red}}>{report.ecarts.length}</div>
                <div style={{fontSize:11,color:T.red}}>nécessitent correction</div>
              </div>
              <div style={{background:T.orangeBg,border:`1px solid ${T.orangeBdr}`,borderRadius:12,padding:"16px 20px"}}>
                <div style={{fontSize:11,color:T.orange,fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Écart net total</div>
                <div style={{fontSize:28,fontWeight:800,color:T.orange}}>{report.total_ecart_pos+report.total_ecart_neg>0?"+":""}{report.total_ecart_pos+report.total_ecart_neg}</div>
                <div style={{fontSize:11,color:T.orange}}>+{report.total_ecart_pos} / {report.total_ecart_neg}</div>
              </div>
            </div>

            {report.ecarts.length===0?(
              <Card>
                <div style={{textAlign:"center",padding:"24px 0"}}>
                  <div style={{fontSize:36,marginBottom:12}}>✅</div>
                  <div style={{fontWeight:700,fontSize:18,color:T.green,marginBottom:6}}>Inventaire conforme !</div>
                  <div style={{fontSize:14,color:T.muted}}>Tous les articles correspondent au stock système. Aucune correction nécessaire.</div>
                </div>
              </Card>
            ):(
              <Card p={0} sx={{overflow:"hidden"}}>
                <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.bdr}`,fontWeight:700,color:T.txt,fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                  <Ic n="alert" s={15} c={T.orange}/>Articles avec écart — corrections à appliquer
                </div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>
                    {["Référence","Désignation","Stock système","Compté","Écart","Action"].map(h=>(
                      <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {report.ecarts.map(e=>(
                      <tr key={e.id} style={{background:e.ecart<0?"#FFF5F5":"#F0FFF4"}}>
                        <td style={{padding:"11px 14px",fontWeight:700,color:T.brand,borderBottom:`1px solid ${T.bdrD}`}}>{e.reference}</td>
                        <td style={{padding:"11px 14px",fontWeight:600,color:T.txt,borderBottom:`1px solid ${T.bdrD}`}}>{e.designation}</td>
                        <td style={{padding:"11px 14px",textAlign:"center",fontWeight:700,color:T.txt,borderBottom:`1px solid ${T.bdrD}`}}>{e.theorique}</td>
                        <td style={{padding:"11px 14px",textAlign:"center",fontWeight:700,color:T.txt,borderBottom:`1px solid ${T.bdrD}`}}>{e.physique}</td>
                        <td style={{padding:"11px 14px",textAlign:"center",borderBottom:`1px solid ${T.bdrD}`}}>
                          <span style={{fontWeight:800,fontSize:15,color:e.ecart>0?T.green:T.red}}>{e.ecart>0?"+":""}{e.ecart}</span>
                        </td>
                        <td style={{padding:"11px 14px",borderBottom:`1px solid ${T.bdrD}`}}>
                          <Badge v={e.ecart>0?"green":"red"} sm>{e.ecart>0?"Ajout":"Retrait"} de {Math.abs(e.ecart)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}
      </div>
    );
  };

      // ── RAPPORTS PDF ──
  const RapportsView = () => {
    const [generating,setGenerating] = useState(null);
    const [baseFilter,setBaseFilter] = useState("all");
    const [dateFrom,setDateFrom]     = useState(()=>{ const d=new Date(); d.setDate(1); return d.toISOString().slice(0,10); });
    const [dateTo,setDateTo]         = useState(()=>new Date().toISOString().slice(0,10));

    const sUrl = (serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
    const headers = {"Authorization":`Bearer ${serverToken}`};

    // Génère et télécharge un rapport depuis l'API export
    const genRapport = async (type, label) => {
      setGenerating(type);
      try{
        let url = `${sUrl}/api/export/`;
        if(type==="base"&&baseFilter!=="all") url+=`base/${baseFilter}`;
        else url+="all";
        const r=await fetch(url,{headers});
        if(!r.ok){ toast_("Erreur génération rapport","error"); setGenerating(null); return; }
        const blob=await r.blob();
        const a=document.createElement("a");
        a.href=URL.createObjectURL(blob);
        a.download=`MRDPSTOCK_${label.replace(/[^a-z0-9]/gi,"_")}_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click();
        toast_(`Rapport "${label}" téléchargé`);
      }catch(e){ toast_("Erreur réseau","error"); }
      setGenerating(null);
    };

    // Génère un rapport texte d'inventaire / alertes côté client
    const genAlertes = () => {
      const allLow = Object.entries(state.clients).flatMap(([cid,c])=>
        c.items.filter(i=>{ const q=parseInt(i.quantite)||0,s=parseInt(i.seuil)||0; return s>0&&q<=s&&i.etat==="en_stock"; })
               .map(i=>({...i,baseName:c.name}))
      );
      if(allLow.length===0){ toast_("Aucune alerte stock en cours"); return; }
      const lines=[
        "RAPPORT ALERTES STOCK BAS",
        `Date : ${new Date().toLocaleString("fr-FR")}`,
        "═".repeat(60),
        "",
        ...allLow.map(i=>`• ${i.designation} (${i.reference}) — ${i.baseName}  |  Qté: ${i.quantite} / Seuil: ${i.seuil}`),
        "",
        "═".repeat(60),
        `Total : ${allLow.length} article${allLow.length>1?"s":""} en alerte`,
      ];
      const blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=`MRDPSTOCK_Alertes_${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      toast_("Rapport alertes téléchargé");
    };

    const genHistorique = async () => {
      setGenerating("historique");
      try{
        const params=new URLSearchParams({limit:1000});
        if(baseFilter!=="all") params.set("base_id",baseFilter);
        const r=await fetch(`${sUrl}/api/history?${params}`,{headers});
        const rows=r.ok?await r.json():state.history;
        const data=Array.isArray(rows)?rows:(rows.rows||[]);

        const lines=[
          "RAPPORT HISTORIQUE DES ACTIONS",
          `Période : ${dateFrom} au ${dateTo}`,
          baseFilter!=="all"?`Base : ${state.clients[baseFilter]?.name}`:"Toutes les bases",
          `Date génération : ${new Date().toLocaleString("fr-FR")}`,
          "═".repeat(70),
          "",
          "Date/Heure          | Utilisateur        | Action              | Détail",
          "─".repeat(70),
          ...data
            .filter(h=>{
              const d=(h.created_at||h.ts||"").slice(0,10);
              return d>=dateFrom&&d<=dateTo;
            })
            .map(h=>`${(h.created_at||h.ts||"").slice(0,16).replace("T"," ")} | ${(h.user_name||h.user||"").padEnd(18)} | ${(h.action||"").padEnd(20)} | ${h.detail||""}`),
          "",
          "═".repeat(70),
        ];
        const blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
        const a=document.createElement("a");
        a.href=URL.createObjectURL(blob);
        a.download=`MRDPSTOCK_Historique_${dateFrom}_${dateTo}.txt`;
        a.click();
        toast_("Rapport historique téléchargé");
      }catch(e){ toast_("Erreur","error"); }
      setGenerating(null);
    };

    const RAPPORTS = [
      {
        id:"stock",
        icon:"grid",
        color:T.blue, bg:T.blueBg, bdr:T.blueBdr,
        title:"État du stock",
        desc:"Liste complète des articles avec quantités, emplacements et états. Format Excel.",
        badge:"Excel",
        badgeV:"blue",
        action:()=>genRapport("base","Etat_Stock"),
      },
      {
        id:"alertes",
        icon:"bell",
        color:T.orange, bg:T.orangeBg, bdr:T.orangeBdr,
        title:"Alertes stock bas",
        desc:"Articles dont la quantité est en dessous du seuil d'alerte. Format texte imprimable.",
        badge:"Texte",
        badgeV:"orange",
        action:genAlertes,
      },
      {
        id:"mouvements",
        icon:"moveIn",
        color:T.green, bg:T.greenBg, bdr:T.greenBdr,
        title:"Export mouvements",
        desc:"Toutes les entrées, sorties et transferts. Format Excel multi-onglets.",
        badge:"Excel",
        badgeV:"green",
        action:()=>genRapport("all","Export_Complet"),
      },
      {
        id:"historique",
        icon:"history",
        color:T.purple, bg:T.purpleBg, bdr:T.purpleBdr,
        title:"Historique des actions",
        desc:"Journal de toutes les actions utilisateurs sur la période sélectionnée. Format texte.",
        badge:"Texte",
        badgeV:"purple",
        action:genHistorique,
      },
    ];

    return(
      <div className="anim">
        {/* Filtres globaux */}
        <Card sx={{marginBottom:20}}>
          <div style={{fontWeight:600,fontSize:14,color:T.txt,marginBottom:14}}>Paramètres des rapports</div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:14,alignItems:"end"}}>
            <Field label="Base client">
              <Sel value={baseFilter} onChange={e=>setBaseFilter(e.target.value)}>
                <option value="all">Toutes les bases</option>
                {Object.entries(state.clients).map(([id,c])=><option key={id} value={id}>{c.name}</option>)}
              </Sel>
            </Field>
            <Field label="Du">
              <Inp type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/>
            </Field>
            <Field label="Au">
              <Inp type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}/>
            </Field>
          </div>
        </Card>

        {/* Grille de rapports */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {RAPPORTS.map(r=>(
            <div key={r.id} style={{background:T.card,border:`1px solid ${T.bdr}`,borderRadius:14,padding:"22px 24px",boxShadow:T.sm,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:46,height:46,borderRadius:12,background:r.bg,border:`1px solid ${r.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ic n={r.icon} s={20} c={r.color}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:T.txt}}>{r.title}</div>
                  <Badge v={r.badgeV} sm style={{marginTop:3}}>{r.badge}</Badge>
                </div>
              </div>
              <div style={{fontSize:13,color:T.muted,lineHeight:1.6,flex:1}}>{r.desc}</div>
              <button
                onClick={r.action}
                disabled={generating===r.id}
                style={{width:"100%",padding:"10px 16px",borderRadius:10,background:generating===r.id?"rgba(0,135,90,.5)":`linear-gradient(135deg,${T.brand},${T.brandD})`,color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:generating===r.id?"wait":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {generating===r.id?(
                  <><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Génération...</>
                ):(
                  <><Ic n="save" s={13}/>Télécharger</>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info format */}
        <div style={{marginTop:20,padding:"12px 16px",background:T.bg,border:`1px solid ${T.bdr}`,borderRadius:10,fontSize:12,color:T.muted}}>
          <strong style={{color:T.sub}}>Formats disponibles :</strong> Excel (.xlsx) — ouvre directement dans Excel, Google Sheets, LibreOffice. Texte (.txt) — imprimable depuis n'importe quel éditeur.
        </div>
      </div>
    );
  };

        // ── MOUVEMENTS VIEW ──
  const MouvementsView = () => {
    const [mvts,setMvts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [filterBase,setFilterBase]=useState("all");
    const [filterType,setFilterType]=useState("all");
    const [modal2,setModal2]=useState(null);

    const loadMvts=async()=>{
      setLoading(true);
      try{
        const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
        const params=new URLSearchParams({limit:200});
        if(filterBase!=="all") params.set("base_id",filterBase);
        if(filterType!=="all") params.set("type",filterType);
        const r=await fetch(`${sUrl}/api/mouvements?${params}`,{headers:{"Authorization":`Bearer ${serverToken}`}});
        if(r.ok) setMvts(await r.json());
        else { console.error("Mouvements API error:", r.status); }
      }catch(e){ console.error("Mouvements fetch error:", e); }
      setLoading(false);
    };

    useEffect(()=>{loadMvts();},[filterBase,filterType]);

    const typeConfig={
      entree:   {label:"Entrée",   v:"green",  icon:"moveIn"},
      sortie:   {label:"Sortie",   v:"red",    icon:"moveOut"},
      transfert:{label:"Transfert",v:"blue",   icon:"refresh"},
      ajustement:{label:"Ajustement",v:"purple",icon:"edit"},
    };

    const doMouvement=async(itemId,type,quantite,motif,baseDestId)=>{
      try{
        const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
        const resp=await fetch(`${sUrl}/api/mouvements`,{
          method:"POST",
          headers:{"Content-Type":"application/json","Authorization":`Bearer ${serverToken}`},
          body:JSON.stringify({item_id:itemId,type,quantite,motif,base_dest_id:baseDestId})
        });
        const data=await resp.json();
        if(!resp.ok){toast_(data.error||"Erreur","error");return false;}
        toast_(type==="entree"?`+${quantite} en stock`:type==="sortie"?`-${quantite} sorti`:type==="transfert"?"Transfert effectué":"Ajustement enregistré");
        loadMvts();
        return true;
      }catch{toast_("Erreur réseau","error");return false;}
    };

    // Modal nouveau mouvement
    const [mvtModal,setMvtModal] = useState(false);
    const [mvtForm,setMvtForm] = useState({item_id:"",base_id:"all",type:"entree",quantite:1,motif:"",base_dest_id:""});
    const [mvtItems,setMvtItems] = useState([]);
    const [mvtErr,setMvtErr] = useState("");
    const [mvtLoading2,setMvtLoading2] = useState(false);

    const loadItemsForBase = async (baseId) => {
      if(!baseId||baseId==="all"){ setMvtItems([]); return; }
      try{
        const sUrl=(serverCfg.serverUrl||window.location.origin).replace(/\/+$/,"");
        const r=await fetch(`${sUrl}/api/items?base_id=${baseId}`,{headers:{"Authorization":`Bearer ${serverToken}`}});
        if(r.ok) setMvtItems(await r.json());
      }catch{}
    };

    const submitMvt = async () => {
      if(!mvtForm.item_id){setMvtErr("Sélectionnez un article");return;}
      if(!mvtForm.quantite||mvtForm.quantite<1){setMvtErr("Quantité invalide");return;}
      if(mvtForm.type==="transfert"&&!mvtForm.base_dest_id){setMvtErr("Sélectionnez la base destination");return;}
      setMvtLoading2(true);setMvtErr("");
      const ok=await doMouvement(mvtForm.item_id,mvtForm.type,parseInt(mvtForm.quantite),mvtForm.motif,mvtForm.base_dest_id||null);
      setMvtLoading2(false);
      if(ok){setMvtModal(false);setMvtForm({item_id:"",base_id:"all",type:"entree",quantite:1,motif:"",base_dest_id:""});setMvtItems([]);}
      else setMvtErr("Erreur lors du mouvement");
    };

    return(
      <div className="anim">
        {/* Modal nouveau mouvement */}
        {mvtModal&&(
          <Modal title="Nouveau mouvement de stock"
            icon={<div style={{width:46,height:46,borderRadius:13,background:"#E3FCEF",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="moveIn" s={20} c={T.brand}/></div>}
            onClose={()=>{setMvtModal(false);setMvtErr("");}}
            footer={<><Btn v="ghost" onClick={()=>setMvtModal(false)}>Annuler</Btn><Btn onClick={submitMvt} disabled={mvtLoading2}>{mvtLoading2?"En cours...":"Enregistrer"}</Btn></>}>
            <div style={{display:"grid",gap:16}}>
              <Field label="Base client" required>
                <Sel value={mvtForm.base_id} onChange={e=>{setMvtForm({...mvtForm,base_id:e.target.value,item_id:""});loadItemsForBase(e.target.value);}}>
                  <option value="all">— Choisir une base —</option>
                  {Object.entries(state.clients).map(([id,c])=><option key={id} value={id}>{c.name}</option>)}
                </Sel>
              </Field>
              <Field label="Article" required>
                <Sel value={mvtForm.item_id} onChange={e=>setMvtForm({...mvtForm,item_id:e.target.value})} disabled={mvtItems.length===0}>
                  <option value="">{mvtItems.length===0?"— Choisir une base d'abord —":"— Choisir un article —"}</option>
                  {mvtItems.map(it=><option key={it.id} value={it.id}>{it.reference} — {it.designation} (qté: {it.quantite})</option>)}
                </Sel>
              </Field>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Field label="Type de mouvement" required>
                  <Sel value={mvtForm.type} onChange={e=>setMvtForm({...mvtForm,type:e.target.value})}>
                    <option value="entree">Entrée</option>
                    <option value="sortie">Sortie</option>
                    <option value="transfert">Transfert</option>
                    <option value="ajustement">Ajustement</option>
                  </Sel>
                </Field>
                <Field label="Quantité" required>
                  <Inp type="number" min="1" value={mvtForm.quantite} onChange={e=>setMvtForm({...mvtForm,quantite:e.target.value})}/>
                </Field>
              </div>
              {mvtForm.type==="transfert"&&(
                <Field label="Base destination" required>
                  <Sel value={mvtForm.base_dest_id} onChange={e=>setMvtForm({...mvtForm,base_dest_id:e.target.value})}>
                    <option value="">— Choisir la base destination —</option>
                    {Object.entries(state.clients).filter(([id])=>id!==mvtForm.base_id).map(([id,c])=><option key={id} value={id}>{c.name}</option>)}
                  </Sel>
                </Field>
              )}
              <Field label="Motif (optionnel)">
                <Inp value={mvtForm.motif} onChange={e=>setMvtForm({...mvtForm,motif:e.target.value})} placeholder="Ex: livraison fournisseur, réparation..."/>
              </Field>
              {mvtErr&&<div style={{background:T.redBg,border:`1px solid ${T.redBdr}`,borderRadius:9,padding:"10px 14px",fontSize:13,color:T.red}}>{mvtErr}</div>}
            </div>
          </Modal>
        )}

        {/* Filtres */}
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          <select value={filterBase} onChange={e=>setFilterBase(e.target.value)}
            style={{padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:"#fff",color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none"}}>
            <option value="all">Toutes les bases</option>
            {Object.entries(state.clients).map(([id,c])=><option key={id} value={id}>{c.name}</option>)}
          </select>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)}
            style={{padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:"#fff",color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none"}}>
            <option value="all">Tous les mouvements</option>
            <option value="entree">Entrées</option>
            <option value="sortie">Sorties</option>
            <option value="transfert">Transferts</option>
            <option value="ajustement">Ajustements</option>
          </select>
          <Btn v="secondary" onClick={loadMvts}><Ic n="refresh" s={13}/>Actualiser</Btn>
          <Btn onClick={()=>setMvtModal(true)} sx={{marginLeft:"auto"}}><Ic n="plus" s={13}/>Nouveau mouvement</Btn>
        </div>

        {/* Table */}
        <Card p={0} sx={{overflow:"hidden"}}>
          {loading?(
            <div style={{padding:60,textAlign:"center",color:T.muted}}><div style={{width:32,height:32,border:`3px solid ${T.bdr}`,borderTop:`3px solid ${T.brand}`,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 12px"}}/><div>Chargement…</div></div>
          ):mvts.length===0?(
            <div style={{padding:64,textAlign:"center",color:T.muted}}>
              <Ic n="moveIn" s={40} c={T.bdr}/>
              <div style={{marginTop:12,fontWeight:600,color:T.sub}}>Aucun mouvement enregistré</div>
              <div style={{fontSize:12,marginTop:4}}>Les entrées, sorties et transferts apparaîtront ici</div>
            </div>
          ):(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                <thead><tr>
                  {["Date","Article","Base","Type","Qté avant","Mouvement","Qté après","Motif","Par"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`2px solid ${T.bdr}`,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mvts.map(m=>{
                    const tc=typeConfig[m.type]||{label:m.type,v:"gray",icon:"edit"};
                    const delta=m.type==="entree"||m.type==="ajustement"?`+${m.quantite}`:`-${m.quantite}`;
                    const deltaColor=m.type==="entree"?T.green:m.type==="sortie"?T.red:T.blue;
                    return(
                      <tr key={m.id} className="row">
                        <td style={{padding:"11px 14px",fontSize:11,color:T.muted,whiteSpace:"nowrap",borderBottom:`1px solid ${T.bdrD}`}}>{m.created_at?.slice(0,16).replace("T"," ")}</td>
                        <td style={{padding:"11px 14px",borderBottom:`1px solid ${T.bdrD}`}}>
                          <div style={{fontWeight:600,color:T.txt,fontSize:13}}>{m.designation}</div>
                          <div style={{fontSize:11,color:T.muted}}>{m.reference}</div>
                        </td>
                        <td style={{padding:"11px 14px",borderBottom:`1px solid ${T.bdrD}`}}>
                          <div style={{fontSize:12,color:T.sub}}>{m.base_name}</div>
                          {m.base_dest_name&&<div style={{fontSize:11,color:T.muted}}>→ {m.base_dest_name}</div>}
                        </td>
                        <td style={{padding:"11px 14px",borderBottom:`1px solid ${T.bdrD}`}}><Badge v={tc.v} sm>{tc.label}</Badge></td>
                        <td style={{padding:"11px 14px",textAlign:"center",fontSize:13,color:T.muted,borderBottom:`1px solid ${T.bdrD}`}}>{m.quantite_avant??"-"}</td>
                        <td style={{padding:"11px 14px",textAlign:"center",borderBottom:`1px solid ${T.bdrD}`}}>
                          <span style={{fontWeight:800,fontSize:15,color:deltaColor}}>{delta}</span>
                        </td>
                        <td style={{padding:"11px 14px",textAlign:"center",fontSize:13,fontWeight:700,color:T.txt,borderBottom:`1px solid ${T.bdrD}`}}>{m.quantite_apres??"-"}</td>
                        <td style={{padding:"11px 14px",fontSize:12,color:T.sub,borderBottom:`1px solid ${T.bdrD}`,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.motif||"—"}</td>
                        <td style={{padding:"11px 14px",fontSize:12,color:T.sub,borderBottom:`1px solid ${T.bdrD}`,whiteSpace:"nowrap"}}>{m.user_name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {mvts.length>0&&<div style={{padding:"10px 16px",borderTop:`1px solid ${T.bdr}`,fontSize:12,color:T.muted,background:"#F8FAFC"}}>{mvts.length} mouvement{mvts.length>1?"s":""} affiché{mvts.length>1?"s":""}</div>}
        </Card>
      </div>
    );
  };

    // ── SETTINGS ──
  const SettingsView = () => {
    const tabs=[
      {id:"general",   label:"Général",       icon:"building"},
      {id:"entrepots", label:"Entrepôts",     icon:"package"},
      {id:"columns",   label:"Colonnes",      icon:"list"},
      {id:"security",  label:"Sécurité",      icon:"lock"},
      {id:"server",    label:"Connexion",     icon:"server"},
      {id:"data",      label:"Données",       icon:"save"},
    ];
    const [activeTab, setActiveTab] = useState("general");

    // General
    const GeneralTab = () => {
      const [s,setS] = useState({...settings});
      return(
        <div style={{maxWidth:540}}>
          <Card>
            <div style={{fontWeight:700,fontSize:15,color:T.txt,marginBottom:4,paddingBottom:16,borderBottom:`1px solid ${T.bdr}`,marginBottom:20}}>Informations de l'entreprise</div>
            <div style={{display:"grid",gap:16}}>
              <Field label="Nom de l'entreprise">
                <Inp value={s.companyName||""} onChange={e=>setS({...s,companyName:e.target.value})} placeholder="Nom de votre entreprise"/>
              </Field>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Field label="Format de date">
                  <Sel value={s.dateFormat||"DD/MM/YYYY"} onChange={e=>setS({...s,dateFormat:e.target.value})}>
                    <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
                  </Sel>
                </Field>
                <Field label="Devise">
                  <Sel value={s.currency||"€"} onChange={e=>setS({...s,currency:e.target.value})}>
                    <option value="€">Euro (€)</option><option value="$">Dollar ($)</option><option value="FCFA">Franc CFA</option>
                  </Sel>
                </Field>
              </div>
              <Divider/>
              <div style={{fontWeight:700,fontSize:15,color:T.txt,marginBottom:4}}>Alertes et notifications</div>
              {[
                {k:"lowStockAlert",l:"Alertes stock bas",d:"Afficher une alerte quand un article atteint son seuil"},
                {k:"autoSave",l:"Sauvegarde automatique",d:"Sauvegarder automatiquement les modifications"},
              ].map(opt=>(
                <div key={opt.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderRadius:11,background:T.bg,border:`1px solid ${T.bdr}`}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:T.txt}}>{opt.l}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:2}}>{opt.d}</div>
                  </div>
                  <div onClick={()=>setS({...s,[opt.k]:!s[opt.k]})}
                    style={{width:44,height:24,borderRadius:12,background:s[opt.k]?T.brand:T.bdrD,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:s[opt.k]?23:3,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
                  </div>
                </div>
              ))}
              <Btn onClick={()=>saveSettings(s)}><Ic n="save" s={13}/>Enregistrer les paramètres</Btn>
            </div>
          </Card>
        </div>
      );
    };

    // Entrepots
    const EntrepotsTab = () => {
      const [ents, setEnts] = useState([...(settings.entrepots||[])]);
      const empty = {id:"e"+Date.now(), nom:"", adresse:"", codePostal:"", ville:"", tel:""};

      const addEnt = () => setEnts([...ents, {...empty, id:"e"+Date.now()}]);
      const delEnt = id => setEnts(ents.filter(e=>e.id!==id));
      const updEnt = (id, key, val) => setEnts(ents.map(e=>e.id===id?{...e,[key]:val}:e));

      const save = () => {
        saveSettings({...settings, entrepots:ents});
        toast_("Entrepôts sauvegardés");
      };

      const inpS = {width:"100%",padding:"7px 10px",borderRadius:7,border:`1.5px solid ${T.bdr}`,background:T.white,color:T.txt,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};

      return(
        <div style={{maxWidth:640}}>
          <div style={{background:T.blueBg,border:`1px solid ${T.blueBdr}`,borderRadius:10,padding:"11px 16px",marginBottom:20,fontSize:12,color:T.blueTxt}}>
            <Ic n="info" s={13} c={T.blue}/> Ces entrepôts apparaissent dans le <strong>Bon de transport</strong> comme expéditeur.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
            {ents.map((e,i)=>(
              <Card key={e.id}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <div style={{fontWeight:700,fontSize:14,color:T.txt}}>Entrepôt {i+1}</div>
                  {ents.length>1&&<button onClick={()=>delEnt(e.id)} style={{background:T.redBg,border:`1px solid ${T.redBdr}`,cursor:"pointer",color:T.red,padding:"5px 10px",borderRadius:7,fontSize:12,fontFamily:"inherit"}}><Ic n="trash" s={12}/>Supprimer</button>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{gridColumn:"1/-1"}}>
                    <label style={{fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,display:"block",marginBottom:4}}>Nom de l'entrepôt *</label>
                    <input style={{...inpS,fontWeight:600}} value={e.nom} onChange={ev=>updEnt(e.id,"nom",ev.target.value)} placeholder="Ex: Entrepôt Nord, Siège Social..."/>
                  </div>
                  <div style={{gridColumn:"1/-1"}}>
                    <label style={{fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,display:"block",marginBottom:4}}>Adresse</label>
                    <input style={inpS} value={e.adresse} onChange={ev=>updEnt(e.id,"adresse",ev.target.value)} placeholder="Numéro et rue"/>
                  </div>
                  <div>
                    <label style={{fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,display:"block",marginBottom:4}}>Code postal</label>
                    <input style={inpS} value={e.codePostal} onChange={ev=>updEnt(e.id,"codePostal",ev.target.value)} placeholder="27600"/>
                  </div>
                  <div>
                    <label style={{fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,display:"block",marginBottom:4}}>Ville</label>
                    <input style={inpS} value={e.ville} onChange={ev=>updEnt(e.id,"ville",ev.target.value)} placeholder="Saint-Pierre-la-Garenne"/>
                  </div>
                  <div style={{gridColumn:"1/-1"}}>
                    <label style={{fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,display:"block",marginBottom:4}}>Téléphone</label>
                    <input style={inpS} value={e.tel} onChange={ev=>updEnt(e.id,"tel",ev.target.value)} placeholder="02 32 21 09 23"/>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn v="secondary" onClick={addEnt}><Ic n="plus" s={13}/>Ajouter un entrepôt</Btn>
            <Btn onClick={save}><Ic n="save" s={13}/>Enregistrer</Btn>
          </div>
        </div>
      );
    };

    // Columns
    const ColumnsTab = () => {
      const [cols,setCols]=useState([...(state.columns||DEFAULT_COLS)]);
      const [newLabel,setNewLabel]=useState("");
      const [editIdx,setEditIdx]=useState(null);
      const [editLabel,setEditLabel]=useState("");
      return(
        <div style={{maxWidth:600}}>
          <Card>
            <div style={{fontWeight:700,fontSize:15,color:T.txt,marginBottom:6}}>Colonnes du tableau d'inventaire</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:20}}>Personnalisez les colonnes affichées dans vos tableaux de stock. Les colonnes Référence et Désignation sont obligatoires.</div>
            <div style={{marginBottom:16}}>
              {cols.map((col,idx)=>(
                <div key={col.k} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:10,background:idx%2===0?T.bg:T.white,marginBottom:2,border:`1px solid ${T.bdr}`}}>
                  <div style={{color:T.muted,cursor:"grab"}}><Ic n="drag" s={14}/></div>
                  {editIdx===idx?(
                    <input style={{flex:1,padding:"5px 9px",borderRadius:7,border:`1.5px solid ${T.brand}`,background:T.white,color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none"}} value={editLabel}
                      onChange={e=>setEditLabel(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"){const c=[...cols];c[idx]={...c[idx],l:editLabel};setCols(c);setEditIdx(null);}if(e.key==="Escape")setEditIdx(null);}}
                      onBlur={()=>{const c=[...cols];c[idx]={...c[idx],l:editLabel};setCols(c);setEditIdx(null);}} autoFocus/>
                  ):(
                    <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,fontWeight:col.required?700:400,color:T.txt}}>{col.l}</span>
                      {col.required&&<Badge v="gray" sm>obligatoire</Badge>}
                      {col.custom&&<Badge v="blue" sm>personnalisée</Badge>}
                      {col.type&&!col.required&&<Badge v="purple" sm>{col.type}</Badge>}
                    </div>
                  )}
                  <div style={{display:"flex",gap:3}}>
                    <button style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:"3px 5px",borderRadius:5,fontSize:11}} onClick={()=>{if(idx===0)return;const c=[...cols];[c[idx-1],c[idx]]=[c[idx],c[idx-1]];setCols(c);}} disabled={idx===0}>▲</button>
                    <button style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:"3px 5px",borderRadius:5,fontSize:11}} onClick={()=>{if(idx===cols.length-1)return;const c=[...cols];[c[idx],c[idx+1]]=[c[idx+1],c[idx]];setCols(c);}} disabled={idx===cols.length-1}>▼</button>
                    {editIdx!==idx&&<button style={{background:"none",border:"none",cursor:"pointer",color:T.blue,padding:"3px 5px",borderRadius:5}} onClick={()=>{setEditIdx(idx);setEditLabel(col.l);}}><Ic n="edit" s={12}/></button>}
                    {!col.required&&<button style={{background:"none",border:"none",cursor:"pointer",color:T.red,padding:"3px 5px",borderRadius:5}} onClick={()=>setCols(cols.filter((_,i)=>i!==idx))}><Ic n="trash" s={12}/></button>}
                  </div>
                </div>
              ))}
            </div>
            <Divider sx={{marginBottom:16}}/>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <input style={{flex:1,padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:T.white,color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none"}}
                value={newLabel} onChange={e=>setNewLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&newLabel.trim()&&(setCols([...cols,{k:"custom_"+uid(),l:newLabel.trim(),custom:true}]),setNewLabel(""))} placeholder="Nom de la nouvelle colonne..."/>
              <Btn onClick={()=>{if(!newLabel.trim())return;setCols([...cols,{k:"custom_"+uid(),l:newLabel.trim(),custom:true}]);setNewLabel("");}} disabled={!newLabel.trim()}><Ic n="plus" s={13}/>Ajouter</Btn>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>saveCols(cols)}><Ic n="save" s={13}/>Enregistrer</Btn>
              <Btn v="ghost" onClick={()=>{setCols([...DEFAULT_COLS]);toast_("Colonnes réinitialisées");}}>Réinitialiser</Btn>
            </div>
          </Card>
        </div>
      );
    };

    // Security
    const SecurityTab = () => {
      const [cur,setCur]=useState(""),[nw,setNw]=useState(""),[conf,setConf]=useState(""),err_ref=useRef(null);
      return(
        <div style={{maxWidth:440}}>
          <Card>
            <div style={{fontWeight:700,fontSize:15,color:T.txt,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${T.bdr}`}}>Modifier votre mot de passe</div>
            <div style={{display:"grid",gap:16}}>
              <Field label="Mot de passe actuel"><Inp type="password" value={cur} onChange={e=>setCur(e.target.value)} placeholder="••••••••"/></Field>
              <Field label="Nouveau mot de passe"><Inp type="password" value={nw} onChange={e=>setNw(e.target.value)} placeholder="Min. 4 caractères"/></Field>
              <Field label="Confirmer le nouveau"><Inp type="password" value={conf} onChange={e=>setConf(e.target.value)} placeholder="Répétez"/></Field>
              <Btn onClick={()=>{const ok=changePwd(cur,nw,conf);if(ok){setCur("");setNw("");setConf("");}}}><Ic n="lock" s={13}/>Modifier le mot de passe</Btn>
            </div>
          </Card>
          <div style={{marginTop:16,background:T.blueBg,border:`1px solid ${T.blueBdr}`,borderRadius:12,padding:"14px 18px",fontSize:12,color:T.blueTxt,lineHeight:1.7}}>
            <strong>Conseils de sécurité :</strong><br/>
            • Utilisez un mot de passe d'au moins 8 caractères<br/>
            • Mélangez lettres, chiffres et symboles<br/>
            • Ne partagez jamais votre mot de passe
          </div>
        </div>
      );
    };

    // Server
    const ServerTab = () => {
      const [cfg,setCfg]=useState({...serverCfg});
      const [testing,setTesting]=useState(false);
      const [testResult,setTestResult]=useState(null);

      const doTest=async()=>{
        setTesting(true);setTestResult(null);
        try{
          const sUrl=cfg.serverUrl?.replace(/\/+$/,"");
          if(!sUrl){setTestResult({ok:false,msg:"URL manquante"});setTesting(false);return;}
          const r=await fetch(sUrl+"/api/health",{signal:AbortSignal.timeout(5000)});
          const d=await r.json();
          setTestResult(r.ok?{ok:true,msg:"Serveur OK — v"+(d.version||0)}:{ok:false,msg:"Serveur inaccessible"});
        }catch(e){setTestResult({ok:false,msg:"Erreur : "+e.message});}
        setTesting(false);
      };

      return(
        <div style={{maxWidth:520}}>
          <Card sx={{marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:15,color:T.txt,marginBottom:4}}>Mode de stockage</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:18}}>Les données sont toujours sauvegardées sur cet appareil. Le serveur ajoute la synchronisation multi-postes.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {[
                {id:"local",  icon:"💾", title:"Local",        desc:"Données sur cet ordinateur uniquement"},
                {id:"remote", icon:"🖥️", title:"Serveur réseau",desc:"Sync multi-postes via PC réseau ou NAS"},
              ].map(m=>(
                <div key={m.id} onClick={()=>{setCfg({...cfg,mode:m.id});setTestResult(null);}}
                  style={{padding:18,borderRadius:13,border:"2px solid "+(cfg.mode===m.id?T.brand:T.bdr),
                    background:cfg.mode===m.id?T.greenBg:T.white,cursor:"pointer",transition:"all .15s"}}>
                  <div style={{fontSize:26,marginBottom:8}}>{m.icon}</div>
                  <div style={{fontWeight:700,fontSize:13,color:cfg.mode===m.id?T.brand:T.txt,marginBottom:4}}>{m.title}</div>
                  <div style={{fontSize:11,color:T.muted,lineHeight:1.5}}>{m.desc}</div>
                </div>
              ))}
            </div>

            {cfg.mode==="remote"&&(
              <div style={{display:"grid",gap:14,paddingTop:4}}>
                <Field label="URL du serveur" required hint="Adresse IP ou nom de domaine de votre serveur">
                  <Inp value={cfg.serverUrl||""} onChange={e=>setCfg({...cfg,serverUrl:e.target.value})} placeholder="http://192.168.1.10:3001"/>
                </Field>
                <Field label="Clé API" hint="Optionnel — laisser vide si non configurée">
                  <Inp type="password" value={cfg.serverKey||""} onChange={e=>setCfg({...cfg,serverKey:e.target.value})} placeholder="Laisser vide si non configurée"/>
                </Field>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <Btn v="secondary" onClick={doTest} disabled={testing}>
                    <Ic n="refresh" s={13}/>{testing?"Test en cours...":"Tester la connexion"}
                  </Btn>
                  {testResult&&(
                    <span style={{fontSize:12,fontWeight:600,color:testResult.ok?T.green:T.red}}>
                      {testResult.ok?"✓ ":"✗ "}{testResult.msg}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>

          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>saveServerCfg(cfg)}><Ic n="save" s={13}/>Enregistrer</Btn>
            <Btn v="ghost" onClick={()=>{setCfg({...serverCfg});setTestResult(null);}}>Annuler</Btn>
          </div>

          {serverCfg.mode==="remote"&&(
            <div style={{marginTop:16,padding:"10px 14px",borderRadius:10,background:
              syncStatus==="ok"?T.greenBg:syncStatus==="error"||syncStatus==="offline"?T.redBg:T.blueBg,
              border:"1px solid "+(syncStatus==="ok"?T.greenBdr:syncStatus==="error"||syncStatus==="offline"?T.redBdr:T.blueBdr),
              fontSize:12,fontWeight:600,color:syncStatus==="ok"?T.green:syncStatus==="error"||syncStatus==="offline"?T.red:T.blue,
              display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:
                syncStatus==="ok"?"#22c55e":syncStatus==="syncing"?"#f59e0b":
                syncStatus==="error"?"#ef4444":"#94a3b8"}}/>
              {syncStatus==="ok"?"Synchronisé":syncStatus==="syncing"?"Synchronisation en cours...":
               syncStatus==="error"?"Erreur de synchronisation":syncStatus==="offline"?"Hors ligne — données locales":"En attente"}
              {serverVersion>0&&<span style={{marginLeft:"auto",fontWeight:400,opacity:.7}}>v{serverVersion}</span>}
            </div>
          )}
        </div>
      );
    };

    // Data tab
    const DataTab = () => (
      <div style={{maxWidth:500,display:"grid",gap:14}}>
        <Card>
          <div style={{fontWeight:700,fontSize:14,color:T.txt,marginBottom:4}}>Export global</div>
          <div style={{fontSize:12,color:T.muted,marginBottom:16}}>Exportez toutes les bases clients dans un fichier Excel</div>
          <Btn v="secondary" onClick={()=>{
            const allRows=Object.entries(state.clients).flatMap(([_,c])=>c.items.map(i=>({Base:c.name,...COLS.reduce((o,col)=>({...o,[col.l]:col.type==="etat"?i.etat==="en_stock"?"En stock":"Sorti":col.type==="date"?fmtDate(i[col.k]):i[col.k]||""}),{})})));
            const ws=XLSX.utils.json_to_sheet(allRows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Export complet");
            XLSX.writeFile(wb,`MRDPSTOCK_export_complet_${today()}.xlsx`);toast_("Export global téléchargé");
          }}><Ic n="download" s={13}/>Exporter toutes les données</Btn>
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:14,color:T.txt,marginBottom:4}}>Réinitialisation</div>
          <div style={{fontSize:12,color:T.muted,marginBottom:16}}>Effacer toutes les données de l'application. Action irréversible.</div>
          <Btn v="danger" onClick={()=>setModal({type:"confirm",data:{title:"Réinitialiser l'application",msg:"Toutes les bases clients, articles et historique seront supprimés définitivement.",onConfirm:()=>{const ns={...DEFAULT_STATE,users:state.users,settings:state.settings,activeUser:state.activeUser};save(ns);setView("dashboard");toast_("Application réinitialisée","error");}}})}><Ic n="alert" s={13}/>Réinitialiser</Btn>
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:14,color:T.txt,marginBottom:4}}>Informations système</div>
          <div style={{display:"grid",gap:8,marginTop:12}}>
            {[
              {l:"Version",v:"MRDPSTOCK 2.0"},
              {l:"Bases clients",v:globalStats.clients},
              {l:"Total articles",v:globalStats.total},
              {l:"Utilisateurs",v:state.users.length},
              {l:"Entrées historique",v:state.history.length},
            ].map(i=>(
              <div key={i.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.bdrD}`}}>
                <span style={{fontSize:12,color:T.muted}}>{i.l}</span>
                <span style={{fontSize:12,fontWeight:600,color:T.txt}}>{i.v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );

    return(
      <div className="anim" style={{display:"flex",gap:24,alignItems:"flex-start"}}>
        {/* Settings sidebar */}
        <div style={{width:200,flexShrink:0}}>
          <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`,overflow:"hidden",boxShadow:T.sm}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"13px 16px",border:"none",cursor:"pointer",fontSize:13,fontWeight:activeTab===t.id?700:500,
                  background:activeTab===t.id?T.greenBg:"transparent",color:activeTab===t.id?T.brand:T.sub,
                  borderLeft:activeTab===t.id?`3px solid ${T.brand}`:"3px solid transparent",
                  fontFamily:"inherit",transition:"all .12s"}}>
                <Ic n={t.icon} s={14} c={activeTab===t.id?T.brand:T.muted}/>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {/* Tab content */}
        <div style={{flex:1}}>
          {activeTab==="general"&&<GeneralTab/>}
          {activeTab==="entrepots"&&<EntrepotsTab/>}
          {activeTab==="columns"&&<ColumnsTab/>}
          {activeTab==="security"&&<SecurityTab/>}
          {activeTab==="server"&&<ServerTab/>}
          {activeTab==="data"&&<DataTab/>}
        </div>
      </div>
    );
  };


  // ── PAGE TITLES ──
  // ── GLOBAL SEARCH ──
  const GlobalSearchView = () => {
    const [q, setQ] = useState("");
    const inputRef = useRef();
    useEffect(()=>{ inputRef.current?.focus(); },[]);

    const results = useMemo(()=>{
      if(q.length<2) return [];
      const ql = q.toLowerCase();
      return Object.entries(state.clients).flatMap(([cid,c])=>
        c.items.filter(i=>
          Object.values(i).some(v=>String(v||"").toLowerCase().includes(ql))
        ).map(i=>({...i,_clientName:c.name,_clientId:cid}))
      );
    },[q,state.clients]);

    const grouped = useMemo(()=>{
      const g={};
      results.forEach(i=>{ if(!g[i._clientId])g[i._clientId]={name:i._clientName,items:[]}; g[i._clientId].items.push(i); });
      return Object.entries(g);
    },[results]);

    return (
      <div className="anim">
        <div style={{position:"relative",marginBottom:24}}>
          <Ic n="search" s={18} c={T.muted} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)"}}/>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher une référence, désignation, catégorie, emplacement… (toutes bases)"
            style={{width:"100%",padding:"14px 14px 14px 48px",borderRadius:14,border:`2px solid ${q.length>=2?T.brand:T.bdr}`,fontSize:15,fontFamily:"inherit",color:T.txt,outline:"none",boxSizing:"border-box",transition:"border-color .2s",background:"#fff",boxShadow:T.md}}/>
          {q&&<button onClick={()=>setQ("")} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.muted}}><Ic n="x" s={16}/></button>}
        </div>

        {q.length<2&&(
          <div style={{textAlign:"center",padding:"60px 0",color:T.muted}}>
            <Ic n="search" s={48} c={T.bdr}/>
            <div style={{marginTop:16,fontWeight:600,color:T.sub,fontSize:16}}>Recherche multi-bases</div>
            <div style={{fontSize:13,marginTop:4}}>Tapez au moins 2 caractères pour chercher dans toutes vos bases clients</div>
          </div>
        )}

        {q.length>=2&&results.length===0&&(
          <div style={{textAlign:"center",padding:"60px 0",color:T.muted}}>
            <Ic n="x" s={48} c={T.bdr}/>
            <div style={{marginTop:16,fontWeight:600,color:T.sub}}>Aucun résultat pour "{q}"</div>
          </div>
        )}

        {grouped.map(([cid,g])=>(
          <div key={cid} style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:32,height:32,borderRadius:9,background:T.greenBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="package" s={14} c={T.green}/></div>
              <div style={{fontWeight:700,fontSize:15,color:T.txt}}>{g.name}</div>
              <Badge v="blue" sm>{g.items.length} résultat{g.items.length>1?"s":""}</Badge>
              <button onClick={()=>gotoStock(cid)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:T.brand,fontWeight:600,fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>Ouvrir la base <Ic n="chevR" s={12} c={T.brand}/></button>
            </div>
            <Card p={0} sx={{overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  {["Référence","Désignation","Catégorie","Emplacement","Quantité","État"].map(h=>(
                    <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:.8,background:"#F8FAFC",borderBottom:`1px solid ${T.bdr}`}}>{h}</th>
                  ))}
                  <th style={{padding:"9px 14px",background:"#F8FAFC",borderBottom:`1px solid ${T.bdr}`}}/>
                </tr></thead>
                <tbody>
                  {g.items.map(item=>{
                    const ql=q.toLowerCase();
                    const hl = txt => {
                      const t=String(txt||"");
                      const i=t.toLowerCase().indexOf(ql);
                      if(i<0||!ql) return t||"—";
                      return <>{t.slice(0,i)}<mark style={{background:"#FFF3CD",color:"#856404",borderRadius:3,padding:"0 2px"}}>{t.slice(i,i+ql.length)}</mark>{t.slice(i+ql.length)}</>;
                    };
                    return(
                      <tr key={item.id} className="row">
                        <td style={{padding:"11px 14px",fontWeight:700,color:T.brand,fontSize:13,borderBottom:`1px solid ${T.bdrD}`}}>{hl(item.reference)}</td>
                        <td style={{padding:"11px 14px",fontWeight:600,borderBottom:`1px solid ${T.bdrD}`}}>{hl(item.designation)}</td>
                        <td style={{padding:"11px 14px",fontSize:12,color:T.sub,borderBottom:`1px solid ${T.bdrD}`}}>{hl(item.categorie)||"—"}</td>
                        <td style={{padding:"11px 14px",fontSize:12,color:T.sub,borderBottom:`1px solid ${T.bdrD}`}}>{hl(item.emplacement)||"—"}</td>
                        <td style={{padding:"11px 14px",fontWeight:700,borderBottom:`1px solid ${T.bdrD}`}}>{item.quantite||0}</td>
                        <td style={{padding:"11px 14px",borderBottom:`1px solid ${T.bdrD}`}}><Badge v={item.etat==="en_stock"?"green":"red"} dot>{item.etat==="en_stock"?"En stock":"Sorti"}</Badge></td>
                        <td style={{padding:"11px 14px",borderBottom:`1px solid ${T.bdrD}`,textAlign:"right"}}>
                          <button onClick={()=>setModal({type:"movement",data:{item,clientId:cid}})} style={{background:T.greenBg,border:`1px solid ${T.greenBdr}`,cursor:"pointer",color:T.green,padding:"5px 9px",borderRadius:6,fontSize:11,fontWeight:700,fontFamily:"inherit"}}>⇄ Mouvement</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        ))}

        {results.length>0&&(
          <div style={{textAlign:"center",padding:"12px 0",color:T.muted,fontSize:12}}>
            {results.length} résultat{results.length>1?"s":""} dans {grouped.length} base{grouped.length>1?"s":""} — pour "{q}"
          </div>
        )}
      </div>
    );
  };

  // ── LABELS / QR VIEW ──
  const LabelsView = () => {
    const [selBase, setSelBase] = useState("all");
    const [selCat, setSelCat] = useState("all");
    const [selItems, setSelItems] = useState(new Set());

    const allI = useMemo(()=>
      Object.entries(state.clients)
        .filter(([id])=>selBase==="all"||id===selBase)
        .flatMap(([id,c])=>c.items.map(i=>({...i,_clientId:id,_clientName:c.name})))
    ,[state.clients,selBase]);

    const cats = [...new Set(allI.map(i=>i.categorie).filter(Boolean))];
    const filtered = selCat==="all"?allI:allI.filter(i=>i.categorie===selCat);

    const toggleSel = id => setSelItems(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
    const toggleAll = () => setSelItems(s=>s.size===filtered.length?new Set():new Set(filtered.map(i=>i.id)));

    const printSelected = () => {
      const toprint = filtered.filter(i=>selItems.has(i.id));
      if(!toprint.length){toast_("Sélectionnez au moins un article","error");return;}
      const w = window.open("","_blank");
      const labels = toprint.map(item=>`
        <div class="label">
          <div class="ref">${item.reference}</div>
          <div class="des">${item.designation}</div>
          ${item.emplacement?`<div class="sub">📍 ${item.emplacement}</div>`:""}
          ${item.categorie?`<div class="sub">📂 ${item.categorie}</div>`:""}
          <div class="qty">Qté: <strong>${item.quantite||0}</strong></div>
          <div class="base">${item._clientName}</div>
          <div class="barcode">${item.reference}</div>
          <div class="date">${new Date().toLocaleDateString("fr-FR")}</div>
        </div>
      `).join("");
      w.document.write(`<html><head><title>Étiquettes</title>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
        <style>
          body{margin:0;padding:8px;font-family:Arial,sans-serif;}
          .page{display:flex;flex-wrap:wrap;gap:8px;}
          .label{border:1.5px solid #333;padding:10px 12px;width:180px;box-sizing:border-box;page-break-inside:avoid;}
          .ref{font-size:14px;font-weight:900;margin-bottom:2px;}
          .des{font-size:11px;font-weight:600;margin-bottom:3px;}
          .sub{font-size:9px;color:#666;margin:1px 0;}
          .qty{font-size:11px;margin-top:4px;}
          .base{font-size:9px;color:#888;margin-top:2px;}
          .barcode{font-family:'Libre Barcode 128',monospace;font-size:36px;margin:6px 0;letter-spacing:2px;overflow:hidden;}
          .date{font-size:8px;color:#aaa;}
          @media print{@page{margin:5mm;size:A4;}body{padding:0;}}
        </style></head>
        <body><div class="page">${labels}</div>
        <script>setTimeout(()=>{window.print();window.close();},1000);<\/script></body></html>`);
      w.document.close();
    };

    return (
      <div className="anim">
        {/* Filters */}
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          <select value={selBase} onChange={e=>{setSelBase(e.target.value);setSelItems(new Set());}}
            style={{padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:"#fff",color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none"}}>
            <option value="all">Toutes les bases</option>
            {Object.entries(state.clients).map(([id,c])=><option key={id} value={id}>{c.name}</option>)}
          </select>
          {cats.length>0&&<select value={selCat} onChange={e=>{setSelCat(e.target.value);setSelItems(new Set());}}
            style={{padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:"#fff",color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none"}}>
            <option value="all">Toutes les catégories</option>
            {cats.map(c=><option key={c} value={c}>{c}</option>)}
          </select>}
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            {selItems.size>0&&<span style={{fontSize:12,color:T.muted}}>{selItems.size} sélectionné{selItems.size>1?"s":""}</span>}
            <Btn v="secondary" onClick={toggleAll}>{selItems.size===filtered.length?"Désélect. tout":"Sélect. tout"}</Btn>
            <Btn onClick={printSelected}><Ic n="printer" s={13}/>Imprimer {selItems.size>0?`(${selItems.size})`:"sélection"}</Btn>
          </div>
        </div>

        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"60px 0",color:T.muted}}><Ic n="qr" s={48} c={T.bdr}/><div style={{marginTop:16}}>Aucun article</div></div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
            {filtered.map(item=>{
              const sel=selItems.has(item.id);
              return(
                <div key={item.id} onClick={()=>toggleSel(item.id)}
                  style={{border:`2px solid ${sel?T.brand:T.bdr}`,borderRadius:10,padding:"14px",background:sel?T.brandL:"#fff",cursor:"pointer",transition:"all .15s",position:"relative"}}>
                  {sel&&<div style={{position:"absolute",top:8,right:8,width:20,height:20,borderRadius:10,background:T.brand,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={12} c="#fff"/></div>}
                  <div style={{fontWeight:800,fontSize:14,color:T.txt,marginBottom:2}}>{item.reference}</div>
                  <div style={{fontSize:12,color:T.sub,marginBottom:6,fontWeight:500}}>{item.designation}</div>
                  {item.emplacement&&<div style={{fontSize:10,color:T.muted}}>📍 {item.emplacement}</div>}
                  {item.categorie&&<div style={{fontSize:10,color:T.muted}}>📂 {item.categorie}</div>}
                  <div style={{fontSize:11,fontWeight:700,color:T.green,marginTop:6}}>Qté: {item.quantite||0}</div>
                  <div style={{fontSize:10,color:T.muted,marginTop:2}}>{item._clientName}</div>
                  <div style={{marginTop:8,display:"flex",gap:4}}>
                    <button onClick={e=>{e.stopPropagation();setModal({type:"qrView",data:{item}});}}
                      style={{flex:1,padding:"5px",borderRadius:6,border:`1px solid ${T.purpleBdr}`,background:T.purpleBg,color:T.purple,cursor:"pointer",fontSize:10,fontWeight:600,fontFamily:"inherit"}}>
                      🏷 Prévisualiser
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ── EXCEL VIEWER ──
  const ExcelView = () => {
    const [xlData, setXlData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editCell, setEditCell] = useState(null); // {ri, ci}
    const [editVal, setEditVal] = useState("");
    const [selectedCell, setSelectedCell] = useState(null); // {ri, ci}
    const [unsaved, setUnsaved] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const dropRef = useRef();
    const xlRef = useRef();
    const editInputRef = useRef();
    const bodyScrollRef = useRef();

    const colLetter = i => { let s="",n=i+1; while(n>0){s=String.fromCharCode(64+(n%26||26))+s;n=Math.floor((n-1)/26);} return s; };

    const loadFile = file => {
      if(!file) return;
      setLoading(true);
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const wb = XLSX.read(new Uint8Array(ev.target.result), {type:"array", cellDates:false, cellNF:false, cellStyles:false});
          const sheets = wb.SheetNames.map(name => {
            const ws = wb.Sheets[name];
            if(!ws["!ref"]) return {name, rows:[], colCount:0, cw:[]};
            const range = XLSX.utils.decode_range(ws["!ref"]);
            const maxRow = Math.min(range.e.r, 4999);
            const maxCol = Math.min(range.e.c, 99);
            const colCount = maxCol - range.s.c + 1;
            const rawRows = XLSX.utils.sheet_to_json(ws, {header:1, defval:"", range:{s:range.s, e:{r:maxRow,c:maxCol}}});
            const wscols = ws["!cols"]||[];
            const cw = Array.from({length:colCount},(_,c)=>wscols[c]?.wpx||(wscols[c]?.wch?Math.round(wscols[c].wch*7):90));
            return {name, rows:rawRows, colCount, cw};
          });
          setXlData({sheets, active:0, fileName:file.name});
          setUnsaved(false); setEditCell(null); setSelectedCell(null);
          setLoading(false);
        } catch(e){ setLoading(false); toast_("Erreur lecture: "+e.message,"error"); }
      };
      reader.readAsArrayBuffer(file);
    };

    // Update a cell value
    const updateCell = (ri, ci, val) => {
      setXlData(d => {
        const sheets = d.sheets.map((s,si) => {
          if(si!==d.active) return s;
          const rows = s.rows.map((row,r) => {
            if(r!==ri) return row;
            const newRow = [...row];
            newRow[ci] = val;
            return newRow;
          });
          return {...s, rows};
        });
        return {...d, sheets};
      });
      setUnsaved(true);
    };

    // Add row
    const addRow = () => {
      setXlData(d => {
        const s = d.sheets[d.active];
        const emptyRow = Array(s.colCount).fill("");
        const sheets = d.sheets.map((sh,i)=>i===d.active?{...sh,rows:[...sh.rows,emptyRow]}:sh);
        return {...d,sheets};
      });
      setUnsaved(true);
    };

    // Add column
    const addCol = () => {
      setXlData(d => {
        const sheets = d.sheets.map((sh,i)=>i===d.active?{
          ...sh,
          colCount:sh.colCount+1,
          cw:[...sh.cw,90],
          rows:sh.rows.map(r=>[...r,""])
        }:sh);
        return {...d,sheets};
      });
      setUnsaved(true);
    };

    // Delete row
    const deleteRow = ri => {
      setXlData(d=>{
        const sheets=d.sheets.map((sh,i)=>i===d.active?{...sh,rows:sh.rows.filter((_,r)=>r!==ri)}:sh);
        return {...d,sheets};
      });
      setUnsaved(true); setSelectedCell(null);
    };

    // Download as xlsx
    const downloadXlsx = () => {
      if(!xlData) return;
      const wb = XLSX.utils.book_new();
      xlData.sheets.forEach(s => {
        const ws = XLSX.utils.aoa_to_sheet(s.rows);
        XLSX.utils.book_append_sheet(wb, ws, s.name);
      });
      XLSX.writeFile(wb, xlData.fileName.replace(/\.(xlsx?|csv)$/i,"")+".xlsx");
      setUnsaved(false);
      toast_("Fichier téléchargé !");
    };

    // Start editing a cell
    const startEdit = (ri, ci, currentVal) => {
      setEditCell({ri,ci});
      setEditVal(String(currentVal??"")); 
      setSelectedCell({ri,ci});
      setTimeout(()=>editInputRef.current?.focus(),0);
    };

    const commitEdit = () => {
      if(editCell) { updateCell(editCell.ri, editCell.ci, editVal); setEditCell(null); }
    };

    const handleKeyDown = e => {
      if(!editCell) return;
      if(e.key==="Enter"){e.preventDefault();commitEdit();const next={ri:editCell.ri+1,ci:editCell.ci};setSelectedCell(next);}
      if(e.key==="Tab"){e.preventDefault();commitEdit();const next={ri:editCell.ri,ci:editCell.ci+1};setSelectedCell(next);}
      if(e.key==="Escape"){setEditCell(null);}
    };

    const sheet = xlData?.sheets[xlData.active];
    const XL_GREEN="#217346", BORDER="#D0D7CE", HEADER_BG="#E9F0EC";
    const ROW_H=24;

    if(!xlData) return (
      <div className="anim" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"70vh",gap:24}}>
        <input ref={xlRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>{if(e.target.files[0])loadFile(e.target.files[0]);}}/>
        <div ref={dropRef}
          onDragOver={e=>{e.preventDefault();dropRef.current.style.borderColor=XL_GREEN;}}
          onDragLeave={()=>{dropRef.current.style.borderColor="#CBD5E1";}}
          onDrop={e=>{e.preventDefault();dropRef.current.style.borderColor="#CBD5E1";const f=e.dataTransfer.files[0];if(f)loadFile(f);}}
          onClick={()=>xlRef.current.click()}
          style={{width:420,padding:"52px 40px",borderRadius:18,border:"3px dashed #CBD5E1",background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",gap:18,cursor:"pointer",transition:"border-color .2s",boxShadow:T.md}}>
          <div style={{width:72,height:72,borderRadius:18,background:"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none">
              <rect x={3} y={2} width={18} height={20} rx={2} fill={XL_GREEN}/>
              <rect x={7} y={7} width={10} height={1.5} rx={.75} fill="#fff" opacity={.9}/>
              <rect x={7} y={10.5} width={10} height={1.5} rx={.75} fill="#fff" opacity={.9}/>
              <rect x={7} y={14} width={7} height={1.5} rx={.75} fill="#fff" opacity={.9}/>
            </svg>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontWeight:800,fontSize:18,color:T.txt,marginBottom:6}}>{loading?"Chargement...":"Glisser un fichier Excel ici"}</div>
            <div style={{fontSize:13,color:T.muted}}>ou cliquer pour choisir</div>
            <div style={{marginTop:10,fontSize:11,color:"#94A3B8",padding:"4px 14px",background:"#F8FAFC",borderRadius:20,display:"inline-block"}}>.xlsx · .xls · .csv</div>
          </div>
        </div>
      </div>
    );

    const visStart = Math.max(0, Math.floor(scrollTop/ROW_H)-3);
    const visEnd = Math.min(sheet?.rows.length||0, visStart + Math.ceil(520/ROW_H) + 6);

    return (
      <div className="anim" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 110px)"}}>
        {/* Toolbar */}
        <div style={{background:XL_GREEN,padding:"8px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0,borderRadius:"12px 12px 0 0"}}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
            <rect x={3} y={2} width={18} height={20} rx={2} fill="#fff" opacity={.15}/>
            <rect x={7} y={7} width={10} height={1.5} rx={.75} fill="#fff"/>
            <rect x={7} y={10.5} width={10} height={1.5} rx={.75} fill="#fff"/>
            <rect x={7} y={14} width={7} height={1.5} rx={.75} fill="#fff"/>
          </svg>
          <span style={{color:"#fff",fontWeight:700,fontSize:14,flex:1}}>{xlData.fileName}{unsaved&&<span style={{marginLeft:8,fontSize:11,opacity:.7}}>● modifié</span>}</span>
          {/* Toolbar actions */}
          <button onClick={addRow} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
            + Ligne
          </button>
          <button onClick={addCol} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
            + Colonne
          </button>
          {selectedCell&&<button onClick={()=>deleteRow(selectedCell.ri)} style={{background:"rgba(220,53,69,.3)",border:"1px solid rgba(255,100,100,.4)",color:"#ffcccc",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
            🗑 Ligne {selectedCell.ri+1}
          </button>}
          <button onClick={downloadXlsx}
            style={{background:unsaved?"#fff":"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:unsaved?XL_GREEN:"#fff",borderRadius:7,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,transition:"all .2s"}}>
            ⬇ Télécharger .xlsx
          </button>
          <button onClick={()=>{setXlData(null);xlRef.current&&(xlRef.current.value="");setUnsaved(false);}}
            style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.7)",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
            ✕
          </button>
        </div>

        {/* Formula bar */}
        <div style={{background:"#F2F5F2",borderLeft:`1px solid ${BORDER}`,borderRight:`1px solid ${BORDER}`,padding:"4px 10px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <span style={{fontSize:11,fontWeight:700,color:XL_GREEN,minWidth:36,textAlign:"center",background:HEADER_BG,padding:"2px 6px",borderRadius:4,border:`1px solid ${BORDER}`}}>
            {selectedCell?`${colLetter(selectedCell.ci)}${selectedCell.ri+1}`:"—"}
          </span>
          <span style={{color:BORDER,fontSize:14}}>fx</span>
          <input
            value={editCell?editVal:(selectedCell&&sheet?.rows[selectedCell.ri]?String(sheet.rows[selectedCell.ri][selectedCell.ci]??""):"—")}
            onChange={e=>{if(editCell)setEditVal(e.target.value);}}
            onFocus={()=>{if(selectedCell&&!editCell)startEdit(selectedCell.ri,selectedCell.ci,sheet?.rows[selectedCell.ri]?.[selectedCell.ci]??"")} }
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            style={{flex:1,border:"none",background:"transparent",fontSize:13,color:T.txt,fontFamily:"Calibri,'Segoe UI',sans-serif",outline:"none"}}
          />
        </div>

        {/* Sheet tabs */}
        <div style={{background:"#1D6A3E",display:"flex",alignItems:"flex-end",gap:2,padding:"0 8px",flexShrink:0}}>
          {xlData.sheets.map((s,i)=>(
            <button key={i} onClick={()=>{commitEdit();setXlData(d=>({...d,active:i}));setSelectedCell(null);setEditCell(null);setScrollTop(0);}}
              style={{padding:"6px 18px",borderRadius:"6px 6px 0 0",border:"none",cursor:"pointer",fontSize:12,fontWeight:xlData.active===i?700:400,background:xlData.active===i?"#fff":"rgba(255,255,255,.15)",color:xlData.active===i?XL_GREEN:"rgba(255,255,255,.8)",fontFamily:"inherit",transition:"all .12s"}}>
              {s.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {!sheet||sheet.rows.length===0
          ? <div style={{padding:60,textAlign:"center",color:T.muted,background:"#fff",border:`1px solid ${BORDER}`,borderTop:"none",flex:1}}>Feuille vide — cliquez "+ Ligne" pour commencer</div>
          : <div style={{display:"flex",flexDirection:"column",border:`1px solid ${BORDER}`,borderTop:"none",borderRadius:"0 0 12px 12px",overflow:"hidden",flex:1,minHeight:0}}>
              {/* Sticky col headers */}
              <div style={{overflowX:"hidden",flexShrink:0,background:HEADER_BG,borderBottom:`1px solid ${BORDER}`}} id="xl-hdr">
                <table style={{borderCollapse:"collapse",tableLayout:"fixed",fontSize:12,fontFamily:"Calibri,'Segoe UI',sans-serif"}}>
                  <thead><tr>
                    <th style={{width:46,minWidth:46,background:HEADER_BG,border:`1px solid ${BORDER}`,padding:"4px 0",position:"sticky",left:0}}/>
                    {Array.from({length:sheet.colCount},(_,i)=>(
                      <th key={i} style={{width:sheet.cw[i]||90,minWidth:50,background:HEADER_BG,border:`1px solid ${BORDER}`,padding:"4px 8px",textAlign:"center",fontWeight:700,color:"#555",fontSize:11}}>
                        {colLetter(i)}
                      </th>
                    ))}
                    <th style={{width:32,background:HEADER_BG,border:`1px solid ${BORDER}`}}/>
                  </tr></thead>
                </table>
              </div>

              {/* Virtualized body */}
              <div ref={bodyScrollRef} style={{flex:1,overflow:"auto",minHeight:0}}
                onScroll={e=>{
                  setScrollTop(e.target.scrollTop);
                  const hdr=document.getElementById("xl-hdr");
                  if(hdr)hdr.scrollLeft=e.target.scrollLeft;
                }}>
                <div style={{height:sheet.rows.length*ROW_H,position:"relative"}}>
                  <table style={{borderCollapse:"collapse",tableLayout:"fixed",fontSize:12,fontFamily:"Calibri,'Segoe UI',sans-serif",position:"absolute",top:visStart*ROW_H,left:0}}>
                    <colgroup>
                      <col style={{width:46}}/>
                      {Array.from({length:sheet.colCount},(_,i)=><col key={i} style={{width:sheet.cw[i]||90}}/>)}
                      <col style={{width:32}}/>
                    </colgroup>
                    <tbody>
                      {sheet.rows.slice(visStart,visEnd).map((row,ri)=>{
                        const abs=visStart+ri;
                        const isSelRow=selectedCell?.ri===abs;
                        return(
                          <tr key={abs} style={{height:ROW_H,background:isSelRow?"#E8F4FD":abs===0?HEADER_BG:abs%2===0?"#fff":"#F6F8FA"}}>
                            {/* Row number */}
                            <td onClick={()=>setSelectedCell({ri:abs,ci:0})}
                              style={{background:isSelRow?T.blueBg:HEADER_BG,border:`1px solid ${BORDER}`,padding:"2px 6px",textAlign:"center",color:"#666",fontSize:10,fontWeight:600,position:"sticky",left:0,userSelect:"none",width:46,cursor:"pointer"}}>
                              {abs+1}
                            </td>
                            {/* Data cells */}
                            {Array.from({length:sheet.colCount},(_,ci)=>{
                              const isEditing=editCell?.ri===abs&&editCell?.ci===ci;
                              const isSel=selectedCell?.ri===abs&&selectedCell?.ci===ci;
                              const val=row[ci]??""
                              return(
                                <td key={ci}
                                  onClick={()=>{commitEdit();setSelectedCell({ri:abs,ci});}}
                                  onDoubleClick={()=>startEdit(abs,ci,val)}
                                  style={{border:`2px solid ${isSel?T.blue:BORDER}`,padding:0,height:ROW_H,verticalAlign:"middle",
                                    color:abs===0?XL_GREEN:"#212121",fontWeight:abs===0?600:400,cursor:"cell",
                                    background:isSel?"#EBF5FB":isSelRow?"#EDF7FF":"transparent",
                                    outline:"none",position:"relative"}}>
                                  {isEditing
                                    ? <input ref={editInputRef} value={editVal}
                                        onChange={e=>setEditVal(e.target.value)}
                                        onBlur={commitEdit}
                                        onKeyDown={handleKeyDown}
                                        style={{width:"100%",height:"100%",border:"none",padding:"2px 6px",fontSize:12,fontFamily:"Calibri,'Segoe UI',sans-serif",outline:"none",background:"#fff",color:T.txt,boxSizing:"border-box"}}/>
                                    : <div style={{padding:"2px 6px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                        {String(val)}
                                      </div>
                                  }
                                </td>
                              );
                            })}
                            {/* Delete row button */}
                            <td style={{border:`1px solid ${BORDER}`,width:32,textAlign:"center",background:isSelRow?"#FEF2F2":HEADER_BG}}>
                              <button onClick={()=>deleteRow(abs)}
                                style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:14,padding:"0 4px",lineHeight:1}}
                                title="Supprimer cette ligne">×</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div style={{padding:"5px 12px",background:"#F8FAFC",borderTop:`1px solid ${BORDER}`,fontSize:11,color:"#888",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
                <span>{sheet.rows.length} lignes · {sheet.colCount} colonnes</span>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  {unsaved&&<span style={{color:T.orange,fontWeight:600}}>● Modifications non sauvegardées</span>}
                  <button onClick={addRow} style={{background:T.greenBg,border:`1px solid ${T.greenBdr}`,color:T.green,borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>+ Ligne</button>
                  <span style={{color:T.green,fontWeight:600}}>⚡ Rendu rapide</span>
                </div>
              </div>
            </div>
        }
      </div>
    );
  };

  // ── MOVEMENT MODAL (Entrée / Sortie) ──
  const MovementModal = ({data}) => {
    const {item, clientId} = data;
    const [qty, setQty] = useState(1);
    const [motif, setMotif] = useState("");
    const [type, setType] = useState("in"); // "in" or "out"
    const curQty = parseInt(item.quantite)||0;

    const handleConfirm = () => {
      if(qty<=0){toast_("Quantité invalide","error");return;}
      const newQty = type==="in" ? curQty+qty : Math.max(0, curQty-qty);
      const newEtat = newQty>0 ? "en_stock" : "sorti";
      const dateUpdates = {};
      if(type==="in") {
        dateUpdates.dateEntree = today();
      } else {
        dateUpdates.dateSortie = today();
        if(newQty === 0) dateUpdates.etat = "sorti";
      }
      const updatedItem = {...item, quantite:String(newQty), etat:newEtat, ...dateUpdates};
      const tgt = state.clients[clientId];
      const newItems = tgt.items.map(i=>i.id===item.id?updatedItem:i);
      const ns = {...state, clients:{...state.clients,[clientId]:{...tgt,items:newItems}}};
      const label = `${type==="in"?"Entrée":"Sortie"} ×${qty} — ${item.reference} (${item.designation})${motif?` — ${motif}`:""}`;
      ns.history = addHistory(type==="in"?"Entrée stock":"Sortie stock", label, ns);
      save(ns); setModal(null);
      toast_(type==="in"?`+${qty} en stock`:`-${qty} sorti`);
    };

    return (
      <Modal title={`Mouvement — ${item.reference}`} onClose={()=>setModal(null)}
        footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={handleConfirm} v={type==="in"?"primary":"danger"}>{type==="in"?"✅ Confirmer l'entrée":"📤 Confirmer la sortie"}</Btn></>}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Type selector */}
          <div style={{display:"flex",gap:8}}>
            {[{v:"in",l:"📥 Entrée en stock",c:T.green,bg:T.greenBg,bdr:T.greenBdr},{v:"out",l:"📤 Sortie de stock",c:T.red,bg:T.redBg,bdr:T.redBdr}].map(opt=>(
              <button key={opt.v} onClick={()=>setType(opt.v)}
                style={{flex:1,padding:"12px",borderRadius:10,border:`2px solid ${type===opt.v?opt.c:T.bdr}`,background:type===opt.v?opt.bg:"#fff",color:type===opt.v?opt.c:T.muted,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14,transition:"all .15s"}}>
                {opt.l}
              </button>
            ))}
          </div>
          {/* Item info */}
          <div style={{background:"#F8FAFC",borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700,color:T.txt}}>{item.designation}</div>
              <div style={{fontSize:12,color:T.muted}}>{item.reference} — {item.emplacement||"—"}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:22,fontWeight:800,color:T.txt}}>{curQty}</div>
              <div style={{fontSize:11,color:T.muted}}>actuellement</div>
            </div>
          </div>
          {/* Qty input */}
          <div>
            <label style={{fontSize:12,fontWeight:600,color:T.sub,marginBottom:6,display:"block"}}>Quantité à {type==="in"?"ajouter":"retirer"}</label>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:38,height:38,borderRadius:9,border:`1.5px solid ${T.bdr}`,background:"#fff",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",color:T.txt}}>−</button>
              <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))}
                style={{flex:1,padding:"10px",borderRadius:9,border:`1.5px solid ${T.bdr}`,textAlign:"center",fontSize:22,fontWeight:800,color:T.txt,fontFamily:"inherit",outline:"none"}}/>
              <button onClick={()=>setQty(q=>q+1)} style={{width:38,height:38,borderRadius:9,border:`1.5px solid ${T.bdr}`,background:"#fff",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",color:T.txt}}>+</button>
            </div>
            <div style={{marginTop:8,fontSize:12,color:type==="in"?T.green:T.red,fontWeight:600}}>
              → Nouveau stock : <strong>{type==="in"?curQty+qty:Math.max(0,curQty-qty)}</strong>
            </div>
          </div>
          {/* Motif */}
          <div>
            <label style={{fontSize:12,fontWeight:600,color:T.sub,marginBottom:6,display:"block"}}>Motif (optionnel)</label>
            <input value={motif} onChange={e=>setMotif(e.target.value)} placeholder={type==="in"?"Ex: réassort fournisseur…":"Ex: commande client #123…"}
              style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1.5px solid ${T.bdr}`,fontFamily:"inherit",fontSize:13,color:T.txt,outline:"none",boxSizing:"border-box"}}/>
          </div>
        </div>
      </Modal>
    );
  };

  // ── QR/BARCODE MODAL ──
  const QRModal = ({data}) => {
    const {item} = data;
    const printRef = useRef();

    const handlePrint = () => {
      const w = window.open("","_blank","width=400,height=500");
      w.document.write(`<html><head><title>Étiquette — ${item.reference}</title>
        <style>body{font-family:monospace;text-align:center;padding:20px;}
        .label{border:2px solid #000;padding:16px;display:inline-block;width:280px;}
        h2{margin:0 0 8px;font-size:18px;} p{margin:4px 0;font-size:12px;}
        .qr{font-size:80px;letter-spacing:-4px;margin:12px 0;}
        .barcode{font-family:'Libre Barcode 128',monospace;font-size:48px;letter-spacing:2px;}
        @media print{@page{margin:5mm;}}</style>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet"></head>
        <body><div class="label">
          <h2>${item.reference}</h2>
          <p><strong>${item.designation}</strong></p>
          ${item.categorie?`<p>Cat: ${item.categorie}</p>`:""}
          ${item.emplacement?`<p>📍 ${item.emplacement}</p>`:""}
          <p>Qté: ${item.quantite||0}</p>
          <div class="barcode">${item.reference}</div>
          <p style="font-size:10px;color:#666;">${new Date().toLocaleDateString("fr-FR")}</p>
        </div>
        <script>setTimeout(()=>{window.print();window.close();},800);<\/script></body></html>`);
      w.document.close();
    };

    // Simple visual barcode (CSS stripes)
    const drawBarcode = (ref) => {
      const chars = ref.split("").map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join("").split("");
      return chars.slice(0,48).map((b,i)=>(
        <div key={i} style={{width:3,height:48,background:b==="1"?"#000":"transparent",display:"inline-block",verticalAlign:"top"}}/>
      ));
    };

    return (
      <Modal title="Étiquette article" onClose={()=>setModal(null)}
        footer={<><Btn v="ghost" onClick={()=>setModal(null)}>Fermer</Btn><Btn onClick={handlePrint}><Ic n="printer" s={13}/>Imprimer</Btn></>}>
        <div ref={printRef} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{border:"2px solid #000",borderRadius:8,padding:"20px 28px",width:280,textAlign:"center",background:"#fff"}}>
            <div style={{fontSize:20,fontWeight:800,color:T.txt,marginBottom:4}}>{item.reference}</div>
            <div style={{fontSize:14,fontWeight:600,color:T.sub,marginBottom:2}}>{item.designation}</div>
            {item.categorie&&<div style={{fontSize:11,color:T.muted,marginBottom:2}}>📂 {item.categorie}</div>}
            {item.emplacement&&<div style={{fontSize:11,color:T.muted,marginBottom:2}}>📍 {item.emplacement}</div>}
            <div style={{fontSize:13,fontWeight:700,color:T.green,marginBottom:12}}>Qté: {item.quantite||0}</div>
            {/* Visual barcode */}
            <div style={{height:52,display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:4,overflow:"hidden"}}>
              {drawBarcode(item.reference)}
            </div>
            <div style={{fontSize:11,color:T.muted,fontFamily:"monospace"}}>{item.reference}</div>
            <div style={{fontSize:10,color:T.bdrD,marginTop:8}}>{new Date().toLocaleDateString("fr-FR")}</div>
          </div>
          <div style={{fontSize:12,color:T.muted,textAlign:"center"}}>Cliquez sur "Imprimer" pour générer l'étiquette</div>
        </div>
      </Modal>
    );
  };

  const PAGE_TITLES = {
    dashboard:"Tableau de bord",
    search:"Recherche globale",
    warehouses:"Bases clients",
    alerts:"Alertes de stock",
    history:"Historique des actions",
    users:"Gestion des utilisateurs",
    settings:"Paramètres",
    labels:"Étiquettes QR & Codes-barres",
    excel:"Viewer Excel — Migration",
    stock:       cl?.name||"Stock",
    mouvements:  "Mouvements de stock",
    bontransport:"Bon de transport",
    inventaire:  "Inventaire physique",
    rapports:    "Rapports & Export",
  };

  // ── TOPBAR ACTIONS ──
  const exportPDF = () => {
    const w = window.open("","_blank");
    const rows = filteredItems.map(item=>`
      <tr>
        <td>${item.reference||""}</td>
        <td>${item.designation||""}</td>
        <td>${item.categorie||""}</td>
        <td>${item.emplacement||""}</td>
        <td style="text-align:center;font-weight:700;">${item.quantite||0}</td>
        <td style="text-align:center;">${item.etat==="en_stock"?"✅ En stock":"🔴 Sorti"}</td>
        <td>${fmtDate(item.dateEntree)}</td>
      </tr>
    `).join("");
    w.document.write(`<html><head><title>Stock — ${cl?.name}</title>
      <style>
        body{font-family:Arial,sans-serif;margin:20px;color:#1a1a1a;}
        h1{font-size:20px;color:#00875A;margin-bottom:4px;}
        p.sub{font-size:12px;color:#888;margin-bottom:20px;}
        table{width:100%;border-collapse:collapse;font-size:12px;}
        th{background:#00875A;color:#fff;padding:8px 10px;text-align:left;}
        td{padding:7px 10px;border-bottom:1px solid #e8ecf1;}
        tr:nth-child(even)td{background:#f8fafc;}
        .footer{margin-top:20px;font-size:10px;color:#aaa;text-align:right;}
        @media print{@page{margin:10mm;}button{display:none;}}
      </style></head>
      <body>
        <h1>📦 ${cl?.name} — Inventaire stock</h1>
        <p class="sub">Exporté le ${new Date().toLocaleDateString("fr-FR")} · ${filteredItems.length} article${filteredItems.length>1?"s":""}</p>
        <table>
          <thead><tr><th>Référence</th><th>Désignation</th><th>Catégorie</th><th>Emplacement</th><th>Quantité</th><th>État</th><th>Date entrée</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="footer">M.R.D.P.S 27 — MRDPSTOCK</div>
        <script>setTimeout(()=>{window.print();},600);<\/script>
      </body></html>`);
    w.document.close();
  };

  const topbarActions = () => {
    if(view==="stock"&&cl) return(
      <>
        <Btn v="secondary" onClick={()=>fileRef.current.click()}><Ic n="upload" s={13}/>Import Excel</Btn>
        <Btn v="secondary" onClick={exportPDF}><Ic n="fileText" s={13}/>Export PDF</Btn>
        <Btn v="secondary" onClick={()=>setModal({type:"export"})}><Ic n="download" s={13}/>Exporter</Btn>
        <Btn onClick={()=>setModal({type:"itemForm",data:{}})}><Ic n="plus" s={14}/>Ajouter un article</Btn>
      </>
    );
    if(view==="warehouses") return <Btn onClick={()=>setModal({type:"newClient"})}><Ic n="plus" s={14}/>Nouvelle base</Btn>;
    if(view==="users") return <Btn onClick={()=>setModal({type:"userForm",data:{}})}><Ic n="plus" s={14}/>Ajouter</Btn>;
    if(view==="labels") return <Btn onClick={()=>setView("labels")}><Ic n="printer" s={14}/>Étiquettes</Btn>;
    return null;
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans',system-ui,sans-serif",background:T.bg,color:T.txt,overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        input,select,textarea,button{font-family:inherit}
        button:active:not(:disabled){transform:scale(.98)}
        .row:hover td,.row:hover{background:#F5F8FF!important}
        .sidenav-btn:hover{background:${T.sideHov}!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        .anim{animation:fadeUp .2s ease}
        input:focus,select:focus,textarea:focus{border-color:${T.brand}!important;box-shadow:0 0 0 3px ${T.greenBg}!important;outline:none!important}
      `}</style>
      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){handleImport(f);e.target.value="";}}}/>

      {/* ─ TOAST ─ */}
      {toast&&(
        <div style={{position:"fixed",top:20,right:20,zIndex:9999,padding:"13px 20px",borderRadius:13,background:toast.type==="error"?T.red:T.brand,color:"#fff",fontSize:13,fontWeight:600,boxShadow:T.lg,animation:"toastIn .22s ease",display:"flex",alignItems:"center",gap:10,maxWidth:400}}>
          <Ic n={toast.type==="error"?"alert":"check"} s={15} c="#fff"/>
          {toast.msg}
        </div>
      )}

      {/* ─ MODALS ─ */}
      <ModalsRenderer/>

      {/* ═══ SIDEBAR ═══ */}
      <div style={{width:sidebarOpen?240:64,background:T.side,display:"flex",flexDirection:"column",transition:"width .25s cubic-bezier(.4,0,.2,1)",overflow:"hidden",flexShrink:0,borderRight:`1px solid rgba(255,255,255,.05)`}}>
        {/* Logo zone */}
        <div style={{padding:"18px 16px",borderBottom:`1px solid rgba(255,255,255,.06)`,display:"flex",alignItems:"center",gap:12,minHeight:68,flexShrink:0}}>
          <img src={LOGO_B64} alt="" style={{width:36,height:36,borderRadius:10,objectFit:"cover",flexShrink:0,border:"1px solid rgba(255,255,255,.1)"}}/>
          {sidebarOpen&&<div style={{overflow:"hidden"}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:15,whiteSpace:"nowrap"}}>MRDPSTOCK</div>
            <div style={{color:"rgba(255,255,255,.25)",fontSize:9,letterSpacing:2.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{settings.companyName||"M.R.D.P.S 27"}</div>
          </div>}
        </div>

        {/* Nav sections */}
        <div style={{flex:1,overflowY:"auto",padding:"12px 10px"}}>
          {NAV_SECTIONS.map(section=>(
            <div key={section.label} style={{marginBottom:6}}>
              {sidebarOpen&&<div style={{fontSize:9,color:"rgba(255,255,255,.18)",textTransform:"uppercase",letterSpacing:2,padding:"8px 8px 6px",fontWeight:600}}>{section.label}</div>}
              {section.items.map(item=>{
                const active=view===item.id;
                return(
                  <button key={item.id}
                    onClick={()=>{setView(item.id);setState(p=>({...p,activeClient:null}));setSearch("");}}
                    style={{display:"flex",alignItems:"center",gap:11,padding:"9px 10px",borderRadius:9,cursor:"pointer",border:"none",width:"100%",textAlign:"left",
                      background:active?T.sideAct:"transparent",color:active?T.sideTxtA:T.sideTxt,
                      borderLeft:active?`3px solid ${T.sideActBdr}`:"3px solid transparent",
                      fontWeight:active?600:400,fontSize:13,transition:"all .12s",marginBottom:1,position:"relative",
                      whiteSpace:"nowrap"}}>
                    <Ic n={item.icon} s={15} c={active?T.brand:T.sideTxt}/>
                    {sidebarOpen&&<span style={{flex:1}}>{item.label}</span>}
                    {item.badge>0&&sidebarOpen&&<span style={{fontSize:10,background:item.badgeV===T.red||item.badgeV==="red"?T.red:T.brand,color:"#fff",borderRadius:10,padding:"1px 7px",fontWeight:700}}>{item.badge}</span>}
                    {item.badge>0&&!sidebarOpen&&<span style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:item.badgeV==="red"?T.red:T.brand,border:"1.5px solid "+T.side}}/>}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Client list */}
          {sidebarOpen&&Object.keys(state.clients).length>0&&<>
            <div style={{fontSize:9,color:"rgba(255,255,255,.18)",textTransform:"uppercase",letterSpacing:2,padding:"10px 8px 6px",fontWeight:600}}>Mes bases</div>
            {Object.entries(state.clients).map(([id,c])=>{
              const active=state.activeClient===id&&view==="stock";
              return(
                <button key={id} onClick={()=>gotoStock(id)}
                  style={{display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:8,cursor:"pointer",border:"none",
                    background:active?"rgba(0,135,90,.12)":"transparent",color:active?T.sideTxtA:T.sideTxt,
                    borderLeft:active?`3px solid ${T.brand}`:"3px solid transparent",
                    width:"100%",fontSize:12,fontWeight:active?600:400,transition:"all .12s",marginBottom:1}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:active?T.brand:"rgba(255,255,255,.2)",flexShrink:0}}/>
                  <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,.2)",flexShrink:0}}>{c.items.length}</span>
                </button>
              );
            })}
          </>}
        </div>

        {/* User zone */}
        <div style={{padding:"12px 10px",borderTop:`1px solid rgba(255,255,255,.06)`,flexShrink:0}}>
          {sidebarOpen?(
            <>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:11,background:"rgba(255,255,255,.04)",marginBottom:8}}>
                <Avatar name={activeUser?.name} color={activeUser?.color} size={34}/>
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{color:"#fff",fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{activeUser?.name}</div>
                  <div style={{color:"rgba(255,255,255,.3)",fontSize:10,textTransform:"capitalize"}}>{activeUser?.role==="admin"?"Administrateur":"Utilisateur"}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <button onClick={()=>{setView("settings");setState(p=>({...p,activeClient:null}));}}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"7px",borderRadius:8,border:`1px solid rgba(255,255,255,.1)`,background:"transparent",color:T.sideTxt,cursor:"pointer",fontSize:11,fontFamily:"inherit",transition:"all .12s"}}>
                  <Ic n="settings" s={13} c={T.sideTxt}/>Paramètres
                </button>
                <button onClick={handleLogout}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"7px",borderRadius:8,border:`1px solid rgba(220,38,38,.25)`,background:"rgba(220,38,38,.08)",color:"#f87171",cursor:"pointer",fontSize:11,fontFamily:"inherit",transition:"all .12s"}}>
                  <Ic n="logout" s={13} c="#f87171"/>Déco.
                </button>
              </div>
            </>
          ):(
            <button onClick={handleLogout} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:10,borderRadius:9,border:"none",background:"rgba(220,38,38,.1)",color:"#f87171",cursor:"pointer"}} title="Déconnexion">
              <Ic n="logout" s={16} c="#f87171"/>
            </button>
          )}
        </div>
      </div>

      {/* ═══ MAIN ═══ */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* TOPBAR */}
        <div style={{background:T.white,borderBottom:`1px solid ${T.bdr}`,padding:"0 24px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:7,borderRadius:8,display:"flex",alignItems:"center",transition:"background .12s"}}>
              <Ic n="menu" s={18}/>
            </button>
            {/* Breadcrumb */}
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {view==="stock"&&cl&&<>
                <button onClick={()=>setView("dashboard")} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:12,fontFamily:"inherit",padding:0}}>Accueil</button>
                <Ic n="chevR" s={11} c={T.muted}/>
                <button onClick={()=>setView("warehouses")} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:12,fontFamily:"inherit",padding:0}}>Bases</button>
                <Ic n="chevR" s={11} c={T.muted}/>
                <span style={{fontSize:14,fontWeight:700,color:T.txt}}>{cl.name}</span>
                <Badge v="gray" sm>{items.length} articles</Badge>
              </>}
              {view!=="stock"&&<span style={{fontSize:16,fontWeight:800,color:T.txt}}>{PAGE_TITLES[view]||""}</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0,alignItems:"center"}}>
            {view==="stock"&&cl&&(
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:T.muted}}><Ic n="search" s={14}/></span>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  style={{width:260,padding:"7px 12px 7px 32px",borderRadius:9,border:`1.5px solid ${T.bdr}`,background:"#F8FAFC",color:T.txt,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                  placeholder="Rechercher..."/>
              </div>
            )}
            {topbarActions()}
            {/* Sync / Online indicator */}
            {(()=>{
              const cfg = serverCfg.serverUrl ? {
                syncing: {bg:T.orangeBg,bdr:T.orangeBdr,dot:T.orange,txt:T.orangeTxt,label:"Sync...",anim:"pulse 1s infinite"},
                ok:      {bg:T.greenBg, bdr:T.greenBdr, dot:T.green, txt:T.greenTxt, label:"Synchronisé",anim:"none"},
                error:   {bg:T.redBg,  bdr:T.redBdr,   dot:T.red,   txt:T.redTxt,   label:"Erreur sync",anim:"pulse 1.5s infinite"},
                offline: {bg:T.orangeBg,bdr:T.orangeBdr,dot:T.orange,txt:T.orangeTxt,label:"Hors ligne",anim:"pulse 2s infinite"},
                idle:    {bg:T.blueBg, bdr:T.blueBdr,  dot:T.blue,  txt:T.blueTxt,  label:"Serveur",anim:"none"},
              }[syncStatus] : (isOnline
                ? {bg:T.greenBg,bdr:T.greenBdr,dot:T.green,txt:T.greenTxt,label:"En ligne",anim:"none"}
                : {bg:T.redBg,bdr:T.redBdr,dot:T.red,txt:T.redTxt,label:"Hors ligne",anim:"pulse 2s infinite"}
              );
              const tip = serverCfg.serverUrl
                ? `Serveur: ${serverCfg.serverUrl} · Version ${serverVersion}`
                : (isOnline?"Connecté (données locales)":"Hors ligne — données locales");
              return (
                <div title={tip}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:20,
                    background:cfg.bg,border:`1px solid ${cfg.bdr}`,fontSize:11,fontWeight:700,cursor:"default",transition:"all .4s",flexShrink:0}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:cfg.dot,animation:cfg.anim}}/>
                  <span style={{color:cfg.txt}}>{cfg.label}</span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          {view==="dashboard"&&<DashboardView/>}
          {view==="search"&&<GlobalSearchView/>}
          {view==="warehouses"&&<WarehousesView/>}
          {view==="alerts"&&<AlertsView/>}
          {view==="stock"&&cl&&<StockView/>}
          {view==="history"&&<HistoryView/>}
          {view==="users"&&<UsersView/>}
          {view==="mouvements"&&<MouvementsView/>}
          {view==="bontransport"&&<BonTransportView/>}
          {view==="inventaire"&&<InventaireView/>}
          {view==="rapports"&&<RapportsView/>}
          {view==="settings"&&<SettingsView/>}
          {view==="labels"&&<LabelsView/>}
          {view==="excel"&&<ExcelView/>}
        </div>
      </div>
    </div>
  );
}

export default App;
