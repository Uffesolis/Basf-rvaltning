import { useState, useRef, useEffect } from 'react';

const SIZES = [
  { id:'S',  label:'S',         hours:1.5,  bg:'#EAF3DE', border:'#639922', text:'#27500A' },
  { id:'M',  label:'M',         hours:5,    bg:'#E6F1FB', border:'#378ADD', text:'#0C447C' },
  { id:'L',  label:'L',         hours:12,   bg:'#FAEEDA', border:'#BA7517', text:'#633806' },
  { id:'XL', label:'XL',        hours:20,   bg:'#FCEBEB', border:'#E24B4A', text:'#791F1F' },
  { id:'NA', label:'N/A',       hours:0,    bg:'#F1EFE8', border:'#888780', text:'#444441' },
  { id:'EJ', label:'Ej uppsk.', hours:0,    bg:'#EEEDFE', border:'#7F77DD', text:'#3C3489' },
];

const AREAS = [
  {
    id:'samverkan', label:'Samverkan', icon:'🤝', accent:'#378ADD',
    goal:'Samverkan med objektsledare, leverantör och IT-specialist sker enligt objektplanen.',
    cats:[
      { id:'planering', label:'Planering & uppföljning', desc:'Rapportering av basförvaltning, årsplan för förvaltning och uppföljning.', ex:'Månadsrapport · Årsplan · Uppföljning' },
      { id:'moten', label:'Möten & samordning', desc:'Förvaltingsmöten, leverantörsmöten, avtalsuppföljning och omvärldsbevakning.', ex:'Leverantörsmöte · Förvaltingsmöte · Omvärldsbevakning' },
    ]
  },
  {
    id:'anvandarstod', label:'Användarstöd', icon:'👥', accent:'#1D9E75',
    goal:'Användarna får stöd, dokumentation är uppdaterad och utbildning genomförd enligt årsplan.',
    cats:[
      { id:'kommunikation', label:'Kommunikation', desc:'Kommunicera nyheter, förändringar och kända fel till verksamheten.', ex:'Nyhetsbrev · Driftstörning · Releaseinfo' },
      { id:'utbildning', label:'Utbildning & Support', desc:'Planera utbildning, ge användarsupport och ta emot felanmälningar.', ex:'Onboarding · Support · FAQ' },
      { id:'dok_anv', label:'Dokumentation', desc:'Framtagande och uppdatering av guider, manualer och lathundar.', ex:'Lathund · Manual · Snabbguide' },
    ]
  },
  {
    id:'andringshantering', label:'Ändringshantering', icon:'🔧', accent:'#D85A30',
    goal:'Kvalitets- och säkerhetsnivåer uppfylls. Ändringsförslag är mottagna och beredda.',
    cats:[
      { id:'krav', label:'Krav & beställning leverantör', desc:'Identifiera behov, beställa förändringar och samordna med leverantör och IT.', ex:'Kravspec · Buggrättning · Förändringsorder' },
      { id:'bestallning_verk', label:'Beställning verksamhet', desc:'Statistik, rapporter och konfigurationsbeställningar från verksamheten.', ex:'Ny rapport · Konfiguration · Behörighet' },
      { id:'felhantering', label:'Felhantering', desc:'Felsöka, felanmäla, följa upp och acceptanstesta lösningar och workarounds.', ex:'Felanmälan · Acceptanstest · Workaround' },
      { id:'inforing', label:'Införande & test', desc:'Acceptanstesta leveranser av beställningar och ärenden.', ex:'UAT · Testprotokoll · Godkännande' },
      { id:'prioritering', label:'Prioritering & förankring', desc:'Prioritera ärenden och förankra servicefönster i verksamheten.', ex:'Prioritering · Förankring · Servicefönster' },
      { id:'underhall', label:'Underhåll', desc:'Central konfiguration, administration och avveckling av system eller moduler.', ex:'Rensa konton · Avveckla modul · Konfigurera' },
      { id:'sakerhet', label:'Säkerhet', desc:'Riskanalys, informationsklassning och behörighetshantering.', ex:'Allrisk · Informationsklassning · Behörighet' },
      { id:'tillganglighet', label:'Digital tillgänglighet & arkiv', desc:'Tillgänglighetsredogörelse, registerutdrag, gallring och bevarande.', ex:'DOS-lagen · Registerutdrag · Gallringsplan' },
      { id:'dok_and', label:'Dokumentation', desc:'Uppdatera förvaltningsdokumentation löpande.', ex:'Systemkarta · Förvaltningsplan · Process' },
    ]
  },
  {
    id:'drift', label:'Drift & underhåll', icon:'⚙️', accent:'#7F77DD',
    goal:'Servicenivåer (tillgänglighet, öppettider, svarstider) uppfylls enligt verksamhetens behov.',
    cats:[
      { id:'kontroll', label:'Löpande kontroll (IT)', desc:'Övervakning, logghantering, certifikathantering och licensuppföljning.', ex:'Logganalys · Certifikat · Licenser' },
      { id:'juridik', label:'Juridik & arkiv', desc:'Möjliggör gallring och bevarande tekniskt. Hantera registerutdrag.', ex:'Gallring · Arkivuttag · GDPR' },
      { id:'dok_drift', label:'Dokumentation & order', desc:'Uppdatering av dokumentation och systemöversikt. Samordna driftbeställningar.', ex:'Driftdok · Systemöversikt · Driftbeställning' },
    ]
  },
];

// ── Colours ──────────────────────────────────────────────────────────────
const navy   = '#0f1f3d';
const teal   = '#00b4a6';
const border = '#d1d9e6';
const muted  = '#6b7c99';
const bg     = '#f0f4f8';
const white  = '#ffffff';

// ── Reusable tiny components ─────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{ background: white, borderRadius: 14, border: `1px solid ${border}`,
      boxShadow: '0 2px 12px rgba(15,31,61,.07)', padding: '22px 20px',
      marginBottom: 14, ...style }}>
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      background: teal, color: white, border: 'none', borderRadius: 9,
      padding: '9px 18px', fontWeight: 600, fontSize: 13,
      cursor: 'pointer', transition: 'background .15s', ...style
    }}
      onMouseEnter={e => e.target.style.background = '#009e91'}
      onMouseLeave={e => e.target.style.background = teal}>
      {children}
    </button>
  );
}

function SecondaryBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ fontSize: 13, color: muted, background: 'transparent', border: `1px solid ${border}` }}>
      {children}
    </button>
  );
}

function Tag({ label, onRemove, color }) {
  const colors = {
    blue: { bg: '#E6F1FB', border: '#378ADD', text: '#0C447C' },
    green: { bg: '#EAF3DE', border: '#639922', text: '#27500A' },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px',
      borderRadius: 7, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {label}
      {onRemove && <span onClick={onRemove} style={{ cursor: 'pointer', opacity: .7, fontSize: 14, lineHeight: 1 }}>×</span>}
    </span>
  );
}

function Bubble({ msg }) {
  const isAI = msg.role === 'ai';
  return (
    <div style={{ display: 'flex', gap: 8, flexDirection: isAI ? 'row' : 'row-reverse',
      alignSelf: isAI ? 'flex-start' : 'flex-end', maxWidth: '88%',
      animation: 'fadeIn .2s ease' }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        background: isAI ? teal : navy, color: white,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
        {isAI ? 'AI' : 'Du'}
      </div>
      <div style={{ padding: '9px 13px', borderRadius: 12, fontSize: 13, lineHeight: 1.65,
        background: isAI ? white : navy, color: isAI ? navy : white,
        border: isAI ? `1px solid ${border}` : 'none',
        borderBottomLeftRadius: isAI ? 3 : 12, borderBottomRightRadius: isAI ? 12 : 3 }}
        dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '8px 14px' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: teal,
          animation: `bounce 1.1s ${i * .18}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

function ChatPanel({ msgs, onSend, input, setInput, loading, chatRef, children }) {
  return (
    <div style={{ background: white, border: `1px solid ${border}`, borderRadius: 14,
      boxShadow: '0 2px 12px rgba(15,31,61,.07)', display: 'flex',
      flexDirection: 'column', height: 400, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ background: `linear-gradient(90deg,${navy},#1a3060)`,
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: white, fontSize: 12, fontWeight: 700 }}>AI</div>
        <div>
          <div style={{ color: white, fontSize: 13, fontWeight: 600 }}>Basförvaltningscoachen</div>
          <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 11 }}>Svara på svenska · max 100 ord</div>
        </div>
        {children}
      </div>
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 14,
        display: 'flex', flexDirection: 'column', gap: 10, background: bg }}>
        {msgs.map((m, i) => <Bubble key={i} msg={m} />)}
        {loading && <LoadingDots />}
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '10px 12px',
        borderTop: `1px solid ${border}`, background: white }}>
        <textarea rows={1} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder="Skriv din fråga eller svar här..."
          style={{ flex: 1, resize: 'none', height: 38, paddingTop: 9 }} />
        <PrimaryBtn onClick={onSend} style={{ padding: '8px 14px', alignSelf: 'flex-end' }}>↑</PrimaryBtn>
      </div>
    </div>
  );
}

function StepDots({ step, goTo }) {
  const steps = [['1','Kom igång'],['2','Digitala stöd'],['3','Uppskattning'],['4','Resultat']];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
      marginBottom: 16, padding: '10px 14px',
      background: white, borderRadius: 12, border: `1px solid ${border}`,
      flexWrap: 'wrap' }}>
      {steps.map(([n, lbl], i) => {
        const num = parseInt(n);
        const isActive = step === num, isDone = step > num;
        return [
          <div key={n} onClick={() => isDone && goTo(num)}
            style={{ display: 'flex', alignItems: 'center', gap: 6,
              cursor: isDone ? 'pointer' : 'default' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%',
              background: isActive || isDone ? teal : '#eef2fb',
              border: `1.5px solid ${isActive || isDone ? teal : border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: isActive || isDone ? white : muted }}>
              {isDone ? '✓' : n}
            </div>
            <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400,
              color: isActive ? navy : muted }}>{lbl}</span>
          </div>,
          i < steps.length - 1 && <div key={'l'+i} style={{ flex: 1, height: 1, background: border, minWidth: 12 }} />
        ];
      })}
    </div>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14,
      padding: '9px 14px', background: white, borderRadius: 10, border: `1px solid ${border}` }}>
      {SIZES.map(sz => (
        <div key={sz.id} style={{ display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, color: muted }}>
          <div style={{ width: 9, height: 9, borderRadius: 2, background: sz.border }} />
          {sz.id === 'NA' ? 'N/A = ej aktuell'
            : sz.id === 'EJ' ? 'Ej uppsk. = dialog'
            : `${sz.id} = ${sz.hours} h/mån`}
        </div>
      ))}
    </div>
  );
}

function Notification({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 999,
      background: white, border: `1px solid ${teal}`, borderRadius: 10,
      padding: '10px 16px', fontSize: 13, color: navy,
      boxShadow: '0 4px 16px rgba(0,0,0,.12)', maxWidth: 280 }}>
      {msg}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]         = useState(1);
  const [form, setForm]         = useState({ name:'', email:'', produkt:'', roll:'', context:'' });
  const [stod, setStod]         = useState([]);
  const [newStod, setNewStod]   = useState('');
  const [specs, setSpecs]       = useState([]);
  const [newSpec, setNewSpec]   = useState('');
  const [assess, setAssess]     = useState({});
  const [open, setOpen]         = useState({ samverkan:true, anvandarstod:true, andringshantering:false, drift:false });
  const [chat, setChat]         = useState([]);
  const [chatIn, setChatIn]     = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOn, setChatOn]     = useState(false);
  const [chat3, setChat3]       = useState([]);
  const [chat3In, setChat3In]   = useState('');
  const [chat3Loading, setChat3Loading] = useState(false);
  const [chat3On, setChat3On]   = useState(false);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [sent, setSent]         = useState(false);
  const [notif, setNotif]       = useState('');
  const chatRef  = useRef(null);
  const chat3Ref = useRef(null);
  const hist     = useRef([]);
  const hist3    = useRef([]);

  useEffect(() => { if (chatRef.current)  chatRef.current.scrollTop  = 9999; }, [chat]);
  useEffect(() => { if (chat3Ref.current) chat3Ref.current.scrollTop = 9999; }, [chat3]);

  const notify = msg => { setNotif(msg); setTimeout(() => setNotif(''), 3200); };

  const sysPrompt = `Du är en vänlig, coachande AI-assistent specialiserad på basförvaltning enligt PM3-modellen. T-shirt-modellen: S=1.5h, M=5h, L=12h, XL=20h/mån. Fyra delmål: Samverkan, Användarstöd, Ändringshantering, Drift & Underhåll. Användare: ${form.name}, Roll: ${form.roll}, Produkt: ${form.produkt}, Kontext: ${form.context}. Svara alltid på svenska. Max 110 ord per svar. Var uppmuntrande och pedagogisk – ställ en följdfråga per svar.`;

  const callAI = async (history, system) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system, messages: history })
    });
    const d = await res.json();
    return d.content?.map(c => c.text || '').join('') || 'Något gick fel, försök igen.';
  };

  const startChat = async () => {
    if (!form.name) { notify('Ange ditt namn för att starta.'); return; }
    const welcome = `Hej ${form.name}! 👋 Jag är din basförvaltningscoach.\n\nJag hjälper dig uppskatta din tid i basförvaltning av **${form.produkt || 'din objektprodukt'}**.\n\nBerätta – hur länge har du förvaltat det här systemet, och vad är dina största utmaningar just nu?`;
    setChat([{ role: 'ai', text: welcome }]);
    hist.current = [{ role: 'assistant', content: welcome }];
    setChatOn(true);
  };

  const sendChat = async () => {
    const msg = chatIn.trim();
    if (!msg || chatLoading) return;
    setChatIn('');
    setChat(p => [...p, { role: 'user', text: msg }]);
    hist.current.push({ role: 'user', content: msg });
    setChatLoading(true);
    try {
      const r = await callAI(hist.current, sysPrompt);
      setChat(p => [...p, { role: 'ai', text: r }]);
      hist.current.push({ role: 'assistant', content: r });
    } catch { setChat(p => [...p, { role: 'ai', text: 'Kunde inte nå AI-tjänsten just nu.' }]); }
    setChatLoading(false);
  };

  const openChat3 = () => {
    setChat3On(true);
    if (!chat3.length) {
      const w = 'Hej! Jag hjälper dig välja rätt storlek för specifika uppgifter. Vilken kategori funderar du på?';
      setChat3([{ role: 'ai', text: w }]);
      hist3.current = [{ role: 'assistant', content: w }];
    }
  };

  const sendChat3 = async () => {
    const msg = chat3In.trim();
    if (!msg || chat3Loading) return;
    setChat3In('');
    setChat3(p => [...p, { role: 'user', text: msg }]);
    hist3.current.push({ role: 'user', content: msg });
    setChat3Loading(true);
    try {
      const r = await callAI(hist3.current, sysPrompt + ' Användaren gör sin uppskattning och frågar om specifika uppgifter.');
      setChat3(p => [...p, { role: 'ai', text: r }]);
      hist3.current.push({ role: 'assistant', content: r });
    } catch { setChat3(p => [...p, { role: 'ai', text: 'Kunde inte nå AI-tjänsten.' }]); }
    setChat3Loading(false);
  };

  const goTo = n => {
    if (n === 3 && !stod.length) { notify('Lägg till minst ett digitalt stöd.'); return; }
    setStep(n);
    if (n === 4) setReceiptEmail(form.email);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const assessors = specs.length ? specs : [form.name || 'Jag'];

  const calcResults = () => {
    let tot = 0;
    const sh = stod.map(() => 0);
    const miss = [], ej = [];
    AREAS.forEach(area => area.cats.forEach(cat => stod.forEach((s, si) => assessors.forEach((asr, ai) => {
      const key = `${cat.id}_${si}_${ai}`;
      const val = assess[key];
      if (!val) miss.push({ area: area.label, cat: cat.label, stod: s, spec: specs.length ? asr : null });
      else if (val === 'EJ') ej.push({ area: area.label, cat: cat.label, stod: s, spec: specs.length ? asr : null });
      else { const sz = SIZES.find(x => x.id === val); if (sz) { tot += sz.hours; sh[si] += sz.hours; } }
    }))));
    return { tot, sh, miss, ej };
  };

  // ── STEP 1 ────────────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <div style={{ background: `linear-gradient(135deg,${navy},#1a3060)`, padding: '36px 24px 28px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,180,166,.18)', color: '#00d4c4',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(0,180,166,.3)', marginBottom: 14 }}>
            PM3 · Basförvaltning · Specialist
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,36px)',
            color: white, marginBottom: 8, lineHeight: 1.2 }}>
            Uppskatta din tid i{' '}
            <em style={{ color: '#00d4c4' }}>basförvaltning</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, maxWidth: 480, lineHeight: 1.7 }}>
            En AI-driven coach hjälper dig förstå uppdraget och uppskatta insats per uppgift — för varje digitalt stöd i objektprodukten.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px 60px' }}>
        <StepDots step={step} goTo={goTo} />
        <Legend />

        <Card>
          <div style={{ fontSize: 17, fontWeight: 600, color: navy, marginBottom: 4 }}>Berätta om dig och ditt uppdrag</div>
          <p style={{ color: muted, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
            Dina svar används av AI-coachen för att anpassa dialogen och råden till din situation.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: muted, marginBottom: 4 }}>Ditt namn</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Förnamn Efternamn" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: muted, marginBottom: 4 }}>E-post (för kvitto)</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="din@epost.se" />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: muted, marginBottom: 4 }}>Objektproduktens namn</label>
            <input value={form.produkt} onChange={e => setForm(p => ({ ...p, produkt: e.target.value }))} placeholder="t.ex. Ärendehanteringssystemet" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: muted, marginBottom: 4 }}>Din roll / specialistområde</label>
            <input value={form.roll} onChange={e => setForm(p => ({ ...p, roll: e.target.value }))} placeholder="t.ex. Specialist verksamhet, IT-specialist..." />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: muted, marginBottom: 4 }}>Beskriv kortfattat ditt uppdrag och kontext</label>
            <textarea rows={3} value={form.context} onChange={e => setForm(p => ({ ...p, context: e.target.value }))}
              placeholder="t.ex. Jag ansvarar för ärendesystemet i kommunens socialförvaltning..." />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <PrimaryBtn onClick={startChat}>▶ Starta AI-coach</PrimaryBtn>
            <SecondaryBtn onClick={() => goTo(2)}>Hoppa till steg 2 →</SecondaryBtn>
          </div>
        </Card>

        {chatOn && (
          <ChatPanel msgs={chat} onSend={sendChat} input={chatIn} setInput={setChatIn}
            loading={chatLoading} chatRef={chatRef} />
        )}

        {chatOn && (
          <div style={{ display: 'flex', gap: 8 }}>
            <PrimaryBtn onClick={() => goTo(2)}>Nästa: lägg till digitala stöd →</PrimaryBtn>
          </div>
        )}
      </div>
      <Notification msg={notif} />
    </div>
  );

  // ── STEP 2 ────────────────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px 60px' }}>
        <StepDots step={step} goTo={goTo} />
        <Legend />

        <Card>
          <div style={{ fontSize: 17, fontWeight: 600, color: navy, marginBottom: 4 }}>Vilka digitala stöd ingår i objektprodukten?</div>
          <p style={{ color: muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            Varje digitalt stöd får en egen kolumn i uppskattningsmatrisen. Lägg till alla system du förvaltar.
          </p>
          <div style={{ background: '#eef9f8', borderLeft: `4px solid ${teal}`, borderRadius: '0 8px 8px 0',
            padding: '10px 14px', fontSize: 13, color: navy, lineHeight: 1.6, marginBottom: 18 }}>
            💡 Lägg till eventuella kollegor under <strong>Specialister</strong> om ni delar på ansvaret — varje specialist får då möjlighet att bedöma sina delar.
          </div>

          <label style={{ display: 'block', fontSize: 12, color: muted, marginBottom: 6 }}>Digitala stöd</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 8, minHeight: 32 }}>
            {stod.map((s, i) => (
              <Tag key={i} label={`💻 ${s}`} color="blue" onRemove={() => setStod(p => p.filter((_, j) => j !== i))} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <input style={{ flex: 1 }} value={newStod} onChange={e => setNewStod(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newStod.trim()) { setStod(p => [...p, newStod.trim()]); setNewStod(''); } }}
              placeholder="Namn på digitalt stöd..." />
            <button onClick={() => { if (newStod.trim()) { setStod(p => [...p, newStod.trim()]); setNewStod(''); } }}>+ Lägg till</button>
          </div>

          <label style={{ display: 'block', fontSize: 12, color: muted, marginBottom: 6 }}>Specialister som delar ansvaret (frivilligt)</label>
          {!specs.length && <p style={{ fontSize: 12, color: muted, marginBottom: 8 }}>Inga specialister tillagda – du gör uppskattningen ensam.</p>}
          {specs.map((sp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              background: '#f5f8ff', border: `1px solid ${border}`, borderRadius: 9, marginBottom: 7 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: navy,
                color: white, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i+1}</div>
              <span style={{ flex: 1, fontSize: 13 }}>{sp}</span>
              <span onClick={() => setSpecs(p => p.filter((_, j) => j !== i))} style={{ cursor: 'pointer', color: muted, fontSize: 18 }}>×</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <input style={{ flex: 1 }} value={newSpec} onChange={e => setNewSpec(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newSpec.trim()) { setSpecs(p => [...p, newSpec.trim()]); setNewSpec(''); } }}
              placeholder="Namn på specialist..." />
            <button onClick={() => { if (newSpec.trim()) { setSpecs(p => [...p, newSpec.trim()]); setNewSpec(''); } }}>+ Lägg till</button>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <PrimaryBtn onClick={() => goTo(3)}>Nästa: gör uppskattningen →</PrimaryBtn>
            <SecondaryBtn onClick={() => goTo(1)}>← Tillbaka</SecondaryBtn>
          </div>
        </Card>
      </div>
      <Notification msg={notif} />
    </div>
  );

  // ── STEP 3 ────────────────────────────────────────────────────────────
  if (step === 3) return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px 60px' }}>
        <StepDots step={step} goTo={goTo} />
        <Legend />

        <Card>
          <div style={{ fontSize: 17, fontWeight: 600, color: navy, marginBottom: 4 }}>Uppskatta insats per uppgift och digitalt stöd</div>
          <p style={{ color: muted, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
            Välj storlek (S/M/L/XL) för varje uppgift. Välj <em>N/A</em> om uppgiften inte är aktuell, eller <em>Ej uppsk.</em> om du behöver mer dialog.
          </p>

          {AREAS.map(area => (
            <div key={area.id} style={{ marginBottom: 14 }}>
              <div onClick={() => setOpen(p => ({ ...p, [area.id]: !p[area.id] }))}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                  background: '#f5f8ff', border: `1px solid ${border}`, cursor: 'pointer',
                  borderRadius: open[area.id] ? '10px 10px 0 0' : 10,
                  borderLeft: `4px solid ${area.accent}` }}>
                <span style={{ fontSize: 18 }}>{area.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: navy }}>{area.label}</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{area.goal.substring(0, 80)}...</div>
                </div>
                <span style={{ color: muted, transition: 'transform .25s', transform: open[area.id] ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>

              {open[area.id] && (
                <div style={{ border: `1px solid ${border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', background: white }}>
                  {area.cats.map((cat, ci) => (
                    <div key={cat.id} style={{ borderBottom: ci < area.cats.length - 1 ? `1px solid ${border}` : 'none' }}>
                      <div style={{ background: '#f8fafd', padding: '9px 14px', fontSize: 12,
                        fontWeight: 600, color: navy, borderBottom: `1px solid ${border}` }}>
                        📂 {cat.label}
                      </div>
                      <div style={{ background: '#f8fafd', padding: '3px 14px 9px', fontSize: 11,
                        color: muted, lineHeight: 1.55, borderBottom: `1px solid ${border}` }}>
                        {cat.desc} <em style={{ color: '#b0bcd4' }}>· Exempel: {cat.ex}</em>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)',
                        padding: '5px 14px', background: '#eef2fb', fontSize: 10, fontWeight: 700,
                        color: muted, textTransform: 'uppercase', letterSpacing: '0.06em',
                        borderBottom: `1px solid ${border}` }}>
                        <div>Digitalt stöd</div><div>Uppskattning</div>
                      </div>
                      {stod.map((stodName, si) => (
                        <div key={si} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)',
                          padding: '9px 14px', borderBottom: si < stod.length - 1 ? `1px solid #f0f2f8` : 'none',
                          alignItems: 'start', gap: 8 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a3060', paddingTop: 3 }}>💻 {stodName}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {assessors.map((asr, ai) => {
                              const key = `${cat.id}_${si}_${ai}`;
                              return (
                                <div key={ai} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                  {specs.length > 0 && (
                                    <span style={{ fontSize: 10, color: muted, minWidth: 70, fontWeight: 500 }}>{asr}</span>
                                  )}
                                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    {SIZES.map(sz => {
                                      const sel = assess[key] === sz.id;
                                      return (
                                        <button key={sz.id}
                                          onClick={() => setAssess(p => ({ ...p, [key]: sz.id }))}
                                          title={sz.hours > 0 ? `${sz.hours} h/mån` : sz.id === 'NA' ? 'Ej aktuell' : 'Behöver dialog'}
                                          style={{ padding: '3px 9px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                                            cursor: 'pointer', border: `1.5px solid ${sel ? sz.border : border}`,
                                            background: sel ? sz.bg : white, color: sel ? sz.text : muted,
                                            opacity: sel ? 1 : 0.7, transition: 'all .12s' }}>
                                          {sz.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <PrimaryBtn onClick={() => goTo(4)}>Se resultat →</PrimaryBtn>
          <SecondaryBtn onClick={() => goTo(2)}>← Tillbaka</SecondaryBtn>
          <SecondaryBtn onClick={openChat3}>💬 Fråga coachen</SecondaryBtn>
        </div>

        {chat3On && (
          <ChatPanel msgs={chat3} onSend={sendChat3} input={chat3In} setInput={setChat3In}
            loading={chat3Loading} chatRef={chat3Ref}>
            <button onClick={() => setChat3On(false)}
              style={{ marginLeft: 'auto', background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 18 }}>×</button>
          </ChatPanel>
        )}
      </div>
      <Notification msg={notif} />
    </div>
  );

  // ── STEP 4 ────────────────────────────────────────────────────────────
  const res = calcResults();
  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px 60px' }}>
        <StepDots step={step} goTo={goTo} />

        <Card>
          <div style={{ fontSize: 17, fontWeight: 600, color: navy, marginBottom: 4 }}>📊 Sammanfattning – din basförvaltning</div>
          <p style={{ color: muted, fontSize: 13, marginBottom: 20 }}>
            {form.name && `${form.name} · `}{form.produkt || 'Objektprodukten'} · {stod.length} digitalt/a stöd
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10, marginBottom: 22 }}>
            {[
              { num: res.tot.toFixed(1), lbl: 'Totalt tim/mån' },
              { num: res.sh.filter(h => h > 0).length, lbl: 'Stöd med insats' },
              { num: res.miss.length, lbl: 'Saknar bedömning' },
              { num: res.ej.length, lbl: 'Behöver dialog' },
            ].map((st, i) => (
              <div key={i} style={{ background: bg, borderRadius: 10, padding: '14px 16px', textAlign: 'center', border: `1px solid ${border}` }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: navy }}>{st.num}</div>
                <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{st.lbl}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: muted, marginBottom: 12 }}>Timmar per digitalt stöd</div>
            {stod.map((s, si) => {
              const pct = res.tot > 0 ? Math.round(res.sh[si] / res.tot * 100) : 0;
              return (
                <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 }}>
                  <span style={{ minWidth: 130, fontSize: 12, fontWeight: 600, color: navy }}>💻 {s}</span>
                  <div style={{ flex: 1, height: 9, background: '#eef2fb', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: teal, width: `${pct}%`, borderRadius: 5, transition: 'width .8s' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: navy, minWidth: 50, textAlign: 'right' }}>{res.sh[si].toFixed(1)} h</span>
                </div>
              );
            })}
          </div>

          {res.miss.length > 0 && (
            <div style={{ background: '#FAEEDA', border: '1px solid #BA7517', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#633806', marginBottom: 8 }}>
                ⚠️ Saknar uppskattning – behöver bedömas ({res.miss.length} st)
              </div>
              {res.miss.slice(0, 10).map((m, i) => (
                <div key={i} style={{ fontSize: 12, color: '#854F0B', padding: '3px 0', borderBottom: '1px solid #EF9F27' }}>
                  ▸ <strong>{m.area}</strong> › {m.cat} › {m.stod}{m.spec ? ` (${m.spec})` : ''}
                </div>
              ))}
              {res.miss.length > 10 && <div style={{ fontSize: 12, color: '#854F0B', fontStyle: 'italic', marginTop: 5 }}>...och {res.miss.length - 10} till.</div>}
            </div>
          )}

          {res.ej.length > 0 && (
            <div style={{ background: '#EEEDFE', border: '1px solid #7F77DD', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#3C3489', marginBottom: 8 }}>
                🔮 Ej uppskattade – behöver dialog ({res.ej.length} st)
              </div>
              {res.ej.map((m, i) => (
                <div key={i} style={{ fontSize: 12, color: '#534AB7', padding: '3px 0', borderBottom: '1px solid #AFA9EC' }}>
                  ▸ <strong>{m.area}</strong> › {m.cat} › {m.stod}{m.spec ? ` (${m.spec})` : ''}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', fontSize: 12, color: muted, marginBottom: 5 }}>Din e-post för kvitto</label>
            <input type="email" value={receiptEmail} onChange={e => setReceiptEmail(e.target.value)} placeholder="din@epost.se" />
          </div>

          {sent && (
            <div style={{ background: '#EAF3DE', border: '1px solid #639922', borderRadius: 10,
              padding: '12px 16px', fontSize: 13, color: '#27500A', marginBottom: 14 }}>
              ✅ Kvitto skickat till {receiptEmail}. I en driftsatt version skickas detta som ett riktigt e-postkvitto till dig och en notifiering till objektledaren.
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            <PrimaryBtn onClick={() => {
              if (!receiptEmail) { notify('Ange e-postadress.'); return; }
              setSent(true); notify('✅ Kvitto skickat till ' + receiptEmail);
            }}>
              {sent ? '✓ Kvitto skickat' : '📧 Skicka kvitto'}
            </PrimaryBtn>
            <SecondaryBtn onClick={() => goTo(3)}>← Justera uppskattning</SecondaryBtn>
          </div>
        </Card>
      </div>
      <Notification msg={notif} />
    </div>
  );
}
