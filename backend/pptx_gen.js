#!/usr/bin/env node
// pptx_gen.js — called from FastAPI via subprocess
// Usage: node pptx_gen.js '<json_data>' '<theme>' '<output_path>'

const PptxGenJS = require("pptxgenjs");

const data = JSON.parse(process.argv[2]);
const theme = process.argv[3] || "orange";
const outPath = process.argv[4] || "output.pptx";

// ── THEMES ────────────────────────────────────────────────────────────────────
const THEMES = {
  orange: { bg: "FDF6EC", accent: "FF5C1A", ink: "1A0F00", ink2: "3D2B10", card: "FFFFFF", muted: "7A6045", font: "Georgia" },
  blue:   { bg: "EFF6FF", accent: "2563EB", ink: "0F172A", ink2: "1E3A5F", card: "FFFFFF", muted: "64748B", font: "Calibri" },
  green:  { bg: "F0FDF4", accent: "16A34A", ink: "052E16", ink2: "14532D", card: "FFFFFF", muted: "4B7A5A", font: "Georgia" },
  purple: { bg: "FAF5FF", accent: "7C3AED", ink: "1E0A3C", ink2: "3B1572", card: "FFFFFF", muted: "6B5C8C", font: "Calibri" },
  dark:   { bg: "0F172A", accent: "38BDF8", ink: "F8FAFC", ink2: "CBD5E1", card: "1E293B", muted: "64748B", font: "Georgia" },
  red:    { bg: "FFF5F5", accent: "DC2626", ink: "1A0505", ink2: "450A0A", card: "FFFFFF", muted: "8A4040", font: "Georgia" },
};

const T = THEMES[theme] || THEMES.orange;
const W = 10, H = 5.625;

let pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";
pres.title = data.startup_name || "Pitch Deck";

function hexNoHash(h) { return h.replace("#",""); }
const BG = hexNoHash(T.bg);
const ACCENT = hexNoHash(T.accent);
const INK = hexNoHash(T.ink);
const INK2 = hexNoHash(T.ink2);
const CARD = hexNoHash(T.card);
const MUTED = hexNoHash(T.muted);
const FONT = T.font;

function addSlide() {
  const s = pres.addSlide();
  s.background = { color: BG };
  // subtle bottom bar
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:H-0.06, w:W, h:0.06, fill:{ color:ACCENT }, line:{ color:ACCENT } });
  return s;
}

function addHeader(s, title, y=0.4) {
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:0.06, h:0.45, fill:{color:ACCENT}, line:{color:ACCENT} });
  s.addText(title, { x:0.7, y, w:8.5, h:0.45, fontSize:22, bold:true, color:INK, fontFace:FONT, margin:0, valign:"middle" });
}

function addCard(s, x, y, w, h) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{color:CARD}, line:{color:"E8D9C0",width:1}, shadow:{type:"outer",color:"000000",blur:8,offset:2,angle:135,opacity:0.06} });
}

// ── SLIDE RENDERERS ──────────────────────────────────────────────────────────
function renderCover(s, slide) {
  // Big accent circle decoration
  s.addShape(pres.shapes.OVAL, { x:7.5, y:-1, w:4, h:4, fill:{color:ACCENT, transparency:88}, line:{color:ACCENT, transparency:88} });
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:W, h:0.08, fill:{color:ACCENT}, line:{color:ACCENT} });
  // Tag
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.5, y:0.6, w:1.4, h:0.32, fill:{color:ACCENT}, rectRadius:0.05, line:{color:ACCENT} });
  s.addText("PITCH DECK", { x:0.5, y:0.6, w:1.4, h:0.32, fontSize:9, bold:true, color:"FFFFFF", fontFace:"Calibri", align:"center", valign:"middle", margin:0 });
  // Name
  s.addText(data.startup_name || "Startup", { x:0.5, y:1.1, w:8, h:1.4, fontSize:52, bold:true, color:INK, fontFace:FONT, valign:"top" });
  // Tagline
  s.addText(data.tagline || "", { x:0.5, y:2.6, w:7, h:0.6, fontSize:16, color:ACCENT, fontFace:FONT, italic:true });
  // Body
  if (slide.body) s.addText(slide.body, { x:0.5, y:3.35, w:6, h:1.5, fontSize:12, color:INK2, fontFace:"Calibri", lineSpacingMultiple:1.4 });
}

function renderProblem(s, slide) {
  addHeader(s, slide.title || "The Problem");
  // Stat box
  addCard(s, 0.5, 1.05, 3.5, 1.6);
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.05, w:3.5, h:0.06, fill:{color:ACCENT}, line:{color:ACCENT} });
  s.addText("MARKET PAIN", { x:0.5, y:1.15, w:3.5, h:0.3, fontSize:9, color:MUTED, fontFace:"Calibri", align:"center", bold:true });
  s.addText(slide.stat || "", { x:0.5, y:1.45, w:3.5, h:0.9, fontSize:28, bold:true, color:ACCENT, fontFace:FONT, align:"center", valign:"middle" });
  // Body
  if (slide.body) s.addText(slide.body, { x:0.5, y:2.8, w:3.8, h:1.4, fontSize:12, color:INK2, fontFace:"Calibri", lineSpacingMultiple:1.4 });
  // Bullets
  const bullets = (slide.bullets||[]).slice(0,3);
  bullets.forEach((b,i) => {
    addCard(s, 4.3, 1.05 + i*1.35, 5.2, 1.2);
    s.addShape(pres.shapes.RECTANGLE, { x:4.3, y:1.05+i*1.35, w:0.06, h:1.2, fill:{color:ACCENT}, line:{color:ACCENT} });
    s.addText(`0${i+1}`, { x:4.45, y:1.1+i*1.35, w:0.5, h:0.3, fontSize:10, bold:true, color:ACCENT, fontFace:"Calibri" });
    s.addText(b, { x:4.45, y:1.4+i*1.35, w:4.9, h:0.7, fontSize:12, color:INK2, fontFace:"Calibri", lineSpacingMultiple:1.3 });
  });
}

function renderSolution(s, slide) {
  addHeader(s, slide.title || "Our Solution");
  if (slide.body) s.addText(slide.body, { x:0.5, y:1.1, w:8.5, h:0.8, fontSize:13, color:INK2, fontFace:"Calibri", lineSpacingMultiple:1.5 });
  const bullets = (slide.bullets||[]).slice(0,4);
  bullets.forEach((b,i) => {
    addCard(s, 0.5, 2.05+i*0.82, 8.5, 0.7);
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:2.05+i*0.82, w:0.06, h:0.7, fill:{color:ACCENT}, line:{color:ACCENT} });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.7, y:2.12+i*0.82, w:0.36, h:0.36, fill:{color:ACCENT}, rectRadius:0.06, line:{color:ACCENT} });
    s.addText("✓", { x:0.7, y:2.12+i*0.82, w:0.36, h:0.36, fontSize:12, bold:true, color:"FFFFFF", fontFace:"Calibri", align:"center", valign:"middle", margin:0 });
    s.addText(b, { x:1.18, y:2.1+i*0.82, w:7.6, h:0.5, fontSize:13, color:INK, fontFace:"Calibri", valign:"middle" });
  });
}

function renderMarket(s, slide) {
  addHeader(s, slide.title || "Market Opportunity");
  if (slide.body) s.addText(slide.body, { x:0.5, y:1.1, w:8.5, h:0.5, fontSize:12, color:INK2, fontFace:"Calibri" });
  const markets = [["TAM","Total Addressable Market",slide.tam,ACCENT],["SAM","Serviceable Addressable Market",slide.sam,INK2],["SOM","Serviceable Obtainable Market",slide.som,MUTED]];
  markets.forEach(([lbl,desc,val],i) => {
    addCard(s, 0.5+i*3.05, 1.75, 2.8, 2.6);
    s.addText(lbl, { x:0.5+i*3.05, y:1.85, w:2.8, h:0.35, fontSize:10, bold:true, color:MUTED, fontFace:"Calibri", align:"center" });
    s.addText(val||"—", { x:0.5+i*3.05, y:2.25, w:2.8, h:0.9, fontSize:32, bold:true, color:markets[i][3], fontFace:FONT, align:"center" });
    s.addText(desc, { x:0.5+i*3.05, y:3.2, w:2.8, h:0.7, fontSize:10, color:INK2, fontFace:"Calibri", align:"center", lineSpacingMultiple:1.3 });
  });
}

function renderProduct(s, slide) {
  addHeader(s, slide.title || "How It Works");
  const steps = (slide.steps||[]).slice(0,3);
  const bgs = [INK, "E8E0D4", CARD];
  const fgs = ["FFFFFF", INK, INK];
  steps.forEach((step, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.3+i*3.15, y:1.05, w:3.0, h:3.8, fill:{color:bgs[i]}, line:{color:"E8D9C0",width:1} });
    s.addText(step.step||`0${i+1}`, { x:0.3+i*3.15, y:1.15, w:3.0, h:0.9, fontSize:44, bold:true, color:i===0?ACCENT:MUTED, fontFace:FONT, align:"center" });
    s.addText(step.title||"", { x:0.4+i*3.15, y:2.1, w:2.8, h:0.5, fontSize:14, bold:true, color:fgs[i], fontFace:FONT, align:"center" });
    s.addText(step.desc||"", { x:0.4+i*3.15, y:2.7, w:2.8, h:1.9, fontSize:11, color:i===0?"DDDDDD":INK2, fontFace:"Calibri", align:"center", lineSpacingMultiple:1.4 });
    if (i < steps.length-1) {
      s.addShape(pres.shapes.RECTANGLE, { x:3.3+i*3.15, y:2.7, w:0.04, h:0.6, fill:{color:ACCENT}, line:{color:ACCENT} });
    }
  });
}

function renderTraction(s, slide) {
  addHeader(s, slide.title || "Traction");
  const metrics = (slide.metrics||[]).slice(0,4);
  metrics.forEach((m,i) => {
    const col = i%2, row = Math.floor(i/2);
    const dark = (i%2===0);
    addCard(s, 0.5+col*4.6, 1.05+row*2.05, 4.3, 1.85);
    if (dark) s.addShape(pres.shapes.RECTANGLE, { x:0.5+col*4.6, y:1.05+row*2.05, w:4.3, h:1.85, fill:{color:INK}, line:{color:INK} });
    s.addText(m.value||"", { x:0.6+col*4.6, y:1.2+row*2.05, w:4.1, h:0.9, fontSize:36, bold:true, color:dark?ACCENT:INK, fontFace:FONT });
    s.addText(m.label||"", { x:0.6+col*4.6, y:2.1+row*2.05, w:4.1, h:0.5, fontSize:11, color:dark?"BBBBBB":MUTED, fontFace:"Calibri" });
  });
  if (slide.body) s.addText(slide.body, { x:0.5, y:5.0, w:9, h:0.4, fontSize:11, color:MUTED, fontFace:"Calibri", italic:true });
}

function renderBusinessModel(s, slide) {
  addHeader(s, slide.title || "Business Model");
  const streams = (slide.revenue_streams||[]).slice(0,4);
  streams.forEach((r,i) => {
    addCard(s, 0.5, 1.05+i*1.05, 8.5, 0.9);
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.05+i*1.05, w:0.06, h:0.9, fill:{color:ACCENT}, line:{color:ACCENT} });
    s.addText(r.name||"", { x:0.7, y:1.1+i*1.05, w:2.5, h:0.4, fontSize:13, bold:true, color:INK, fontFace:FONT });
    s.addText(r.desc||"", { x:0.7, y:1.52+i*1.05, w:6, h:0.35, fontSize:11, color:INK2, fontFace:"Calibri" });
    s.addText(r.pct||"", { x:7.8, y:1.15+i*1.05, w:1.0, h:0.65, fontSize:20, bold:true, color:ACCENT, fontFace:FONT, align:"right", valign:"middle" });
  });
}

function renderCompetition(s, slide) {
  addHeader(s, slide.title || "Competitive Landscape");
  if (slide.body) s.addText(slide.body, { x:0.5, y:1.1, w:4.5, h:1.4, fontSize:12, color:INK2, fontFace:"Calibri", lineSpacingMultiple:1.5 });
  s.addText("OUR ADVANTAGES", { x:5.2, y:1.1, w:4.3, h:0.3, fontSize:9, bold:true, color:MUTED, fontFace:"Calibri", charSpacing:2 });
  (slide.advantages||[]).slice(0,4).forEach((a,i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:5.2, y:1.5+i*0.88, w:0.3, h:0.3, fill:{color:ACCENT}, rectRadius:0.05, line:{color:ACCENT} });
    s.addText("★", { x:5.2, y:1.5+i*0.88, w:0.3, h:0.3, fontSize:10, color:"FFFFFF", fontFace:"Calibri", align:"center", valign:"middle", margin:0 });
    s.addText(a, { x:5.62, y:1.52+i*0.88, w:3.8, h:0.5, fontSize:12, color:INK2, fontFace:"Calibri", lineSpacingMultiple:1.3 });
  });
}

function renderTeam(s, slide) {
  addHeader(s, slide.title || "The Team");
  const colors = [ACCENT, INK2, MUTED];
  (slide.members||[]).slice(0,3).forEach((m,i) => {
    addCard(s, 0.4+i*3.12, 1.1, 2.9, 3.8);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.85+i*3.12, y:1.3, w:0.9, h:0.9, fill:{color:colors[i%3]}, rectRadius:0.12, line:{color:colors[i%3]} });
    s.addText((m.name||"?").charAt(0).toUpperCase(), { x:0.85+i*3.12, y:1.3, w:0.9, h:0.9, fontSize:30, bold:true, color:"FFFFFF", fontFace:FONT, align:"center", valign:"middle", margin:0 });
    s.addText(m.name||"", { x:0.45+i*3.12, y:2.35, w:2.8, h:0.4, fontSize:14, bold:true, color:INK, fontFace:FONT, align:"center" });
    s.addText(m.role||"", { x:0.45+i*3.12, y:2.75, w:2.8, h:0.3, fontSize:10, bold:true, color:colors[i%3], fontFace:"Calibri", align:"center" });
    s.addText(m.background||"", { x:0.55+i*3.12, y:3.15, w:2.6, h:1.5, fontSize:11, color:INK2, fontFace:"Calibri", align:"center", lineSpacingMultiple:1.3 });
  });
}

function renderAsk(s, slide) {
  addHeader(s, slide.title || "The Ask");
  // Big amount
  addCard(s, 0.5, 1.05, 3.5, 2.4);
  s.addText(slide.amount||"$2M", { x:0.5, y:1.3, w:3.5, h:1.2, fontSize:52, bold:true, color:ACCENT, fontFace:FONT, align:"center" });
  s.addText((slide.round||"Seed")+" ROUND", { x:0.5, y:2.55, w:3.5, h:0.4, fontSize:11, bold:true, color:MUTED, fontFace:"Calibri", align:"center", charSpacing:2 });
  // Use of funds
  s.addText("USE OF FUNDS", { x:4.3, y:1.1, w:5.2, h:0.3, fontSize:9, bold:true, color:MUTED, fontFace:"Calibri", charSpacing:2 });
  (slide.use_of_funds||[]).slice(0,4).forEach((f,i) => {
    const pct = f.pct||25;
    s.addText(`${f.category||""} — ${pct}%`, { x:4.3, y:1.5+i*0.78, w:4.0, h:0.3, fontSize:12, bold:true, color:INK, fontFace:"Calibri" });
    s.addText(f.desc||"", { x:4.3, y:1.8+i*0.78, w:5.0, h:0.25, fontSize:10, color:MUTED, fontFace:"Calibri" });
    // Progress bar bg
    s.addShape(pres.shapes.RECTANGLE, { x:4.3, y:2.05+i*0.78, w:5.0, h:0.1, fill:{color:"E8D9C0"}, line:{color:"E8D9C0"} });
    s.addShape(pres.shapes.RECTANGLE, { x:4.3, y:2.05+i*0.78, w:(5.0*pct/100), h:0.1, fill:{color:ACCENT}, line:{color:ACCENT} });
  });
  if (slide.vision) {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:3.6, w:9, h:1.4, fill:{color:INK}, line:{color:INK} });
    s.addText(`"${slide.vision}"`, { x:0.7, y:3.65, w:8.6, h:1.3, fontSize:13, color:"EEEEEE", fontFace:FONT, italic:true, lineSpacingMultiple:1.4, valign:"middle" });
  }
}

// ── RENDER ALL SLIDES ────────────────────────────────────────────────────────
const renderers = { cover:renderCover, problem:renderProblem, solution:renderSolution, market:renderMarket, product:renderProduct, traction:renderTraction, business_model:renderBusinessModel, competition:renderCompetition, team:renderTeam, ask:renderAsk };

for (const slide of (data.slides||[])) {
  const s = addSlide();
  const fn = renderers[slide.id];
  if (fn) fn(s, slide);
}

pres.writeFile({ fileName: outPath })
  .then(() => { process.stdout.write("OK:" + outPath); })
  .catch(e => { process.stderr.write("ERROR:" + e.message); process.exit(1); });
