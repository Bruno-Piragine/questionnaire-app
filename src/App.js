import React, { useState } from 'react';

// ─── Design Tokens ────────────────────────────────────────────────
const T = {
  color: {
    primary:        '#534AB7',
    primaryHover:   '#453DA0',
    primaryLight:   '#EEEDFE',
    primaryBorder:  '#E5E3FA',
    bgPage:         '#F8F7FF',
    bgSurface:      '#FFFFFF',
    textPrimary:    '#2C2C2A',
    textSecondary:  '#6B6B68',
    textTertiary:   '#9B9B98',
    successBg:      '#EAF3DE',
    successBorder:  '#97C459',
    successText:    '#27500A',
    errorBg:        '#FCEBEB',
    errorBorder:    '#F09595',
    errorText:      '#791F1F',
    infoBg:         '#EFF6FF',
    infoText:       '#1D4ED8',
  },
  trait: {
    E: { color: '#534AB7', bg: '#EEEDFE', name: 'Schizoid' },
    O: { color: '#378ADD', bg: '#E6F1FB', name: 'Oral' },
    P: { color: '#D85A30', bg: '#FAECE7', name: 'Psychopath' },
    M: { color: '#BA7517', bg: '#FAEEDA', name: 'Masochist' },
    R: { color: '#1D9E75', bg: '#E1F5EE', name: 'Rigid' },
  },
  font: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    data: "'Roboto Mono', 'Courier New', monospace",
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20 },
  shadow: '0 1px 3px rgba(83,74,183,0.08), 0 4px 16px rgba(83,74,183,0.06)',
};

// ─── Body Parts Data ──────────────────────────────────────────────
const BODY_PARTS = [
  {
    id: 'head', name: 'Head Shape',
    descriptions: {
      E: 'Large, elongated head with a prominent forehead',
      O: 'Round head with full, chubby cheeks',
      P: 'Triangular — upper part wider than the lower',
      M: 'Square shaped, with a dense jaw',
      R: 'Harmonious and proportional',
    },
  },
  {
    id: 'eyes', name: 'Eyes & Gaze',
    descriptions: {
      E: 'Unfocused gaze, large eyes, deep dark circles — often wearing glasses',
      O: 'Small eyes with a connecting gaze that shows sadness or emptiness',
      P: 'Evaluating and penetrating gaze — eyebrows slightly contracted, showing tension',
      M: 'More harmonious and outlined — seductive intention or deep connection',
      R: 'Evaluating gaze with intention — as if wanting something in return',
    },
  },
  {
    id: 'mouth', name: 'Mouth & Lips',
    descriptions: {
      E: 'Thin lips, usually without color or expression',
      O: 'Large mouth with thick, rosy lips — pout shape with a childlike aspect',
      P: 'Crooked smile with one corner higher — asymmetric left and right sides',
      M: 'Jaw and lips closed or tense — crooked teeth, straight bottom lip',
      R: 'Well-defined lips, aligned and proportional teeth — seductive appearance',
    },
  },
  {
    id: 'trunk', name: 'Trunk & Torso',
    descriptions: {
      E: 'Thin, with protruding shoulders and visible edges',
      O: 'Rounded and soft, with a sunken chest. Fuller or thin with a drained-energy sensation',
      P: 'Triangular — upper part always larger than the lower',
      M: 'Square, with weight in the shoulders and denser musculature',
      R: 'Well-articulated with defined muscles and curves — hourglass shape',
    },
  },
  {
    id: 'hips', name: 'Hips & Buttocks',
    descriptions: {
      E: 'Straight buttocks with little volume — hip bones very apparent',
      O: 'Round, soft and saggy — voluminous or without volume',
      P: 'Buttocks with little volume — hips wider at top than bottom',
      M: 'Closing buttocks with tensed muscles',
      R: 'Firm, perky, tight and proportional',
    },
  },
  {
    id: 'legs', name: 'Legs',
    descriptions: {
      E: 'Very thin, with knees locked backward',
      O: 'Shorter, chubby and soft — thighs much thicker than calves',
      P: 'Smaller in relation to trunk — triangular shape',
      M: 'Very thick with very hard musculature',
      R: 'Shapely and harmonious — proportional with visible muscle definition',
    },
  },
];

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrBAFXjXDeG30ZpBhnmve03HG_N0e2LChiuiD7B__KXLSvIBy_VhTIJTTB9MVc3jrr/exec';

// ─── Sub-components ───────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label style={{
    display: 'block', marginBottom: 6,
    fontSize: 13, fontWeight: 500,
    color: T.color.textSecondary, fontFamily: T.font.body,
    textTransform: 'uppercase', letterSpacing: '0.05em',
  }}>
    {children}{required && <span style={{ color: T.color.primary, marginLeft: 2 }}>*</span>}
  </label>
);

const Input = ({ type = 'text', value, onChange, placeholder, min }) => (
  <input
    type={type} value={value} onChange={onChange}
    placeholder={placeholder} min={min}
    style={{
      width: '100%', padding: '12px 14px',
      border: `1.5px solid ${T.color.primaryBorder}`,
      borderRadius: T.radius.md, outline: 'none',
      fontSize: 15, fontFamily: T.font.body,
      color: T.color.textPrimary, background: T.color.bgSurface,
      boxSizing: 'border-box', transition: 'border-color 0.15s',
    }}
    onFocus={e => e.target.style.borderColor = T.color.primary}
    onBlur={e => e.target.style.borderColor = T.color.primaryBorder}
  />
);

const Button = ({ onClick, disabled, children, variant = 'primary', fullWidth }) => {
  const [hovered, setHovered] = useState(false);
  const styles = {
    primary: {
      background: disabled ? T.color.primaryBorder : hovered ? T.color.primaryHover : T.color.primary,
      color: '#fff', border: 'none',
    },
    outline: {
      background: 'transparent',
      color: T.color.primary,
      border: `1.5px solid ${T.color.primaryBorder}`,
    },
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles[variant],
        padding: '13px 28px', borderRadius: T.radius.md,
        fontSize: 14, fontWeight: 600, fontFamily: T.font.body,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'all 0.15s',
        width: fullWidth ? '100%' : 'auto',
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </button>
  );
};

const TraitPill = ({ trait }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: T.trait[trait].bg, color: T.trait[trait].color,
    padding: '3px 10px', borderRadius: 99,
    fontSize: 12, fontWeight: 500, fontFamily: T.font.body,
  }}>
    <span style={{
      width: 7, height: 7, borderRadius: '50%',
      background: T.trait[trait].color, flexShrink: 0,
    }} />
    {T.trait[trait].name}
  </span>
);

// ─── Sections ─────────────────────────────────────────────────────
const PersonalInfoSection = ({ formData, onChange }) => (
  <div>
    <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.color.textTertiary, margin: '0 0 6px', fontFamily: T.font.body }}>Step 1 of 8</p>
    <h2 style={{ fontSize: 22, fontWeight: 600, color: T.color.textPrimary, margin: '0 0 8px', fontFamily: T.font.body }}>Let's start with you</h2>
    <p style={{ fontSize: 15, color: T.color.textSecondary, margin: '0 0 28px', lineHeight: 1.6, fontFamily: T.font.body }}>
      Your analysis will be personally crafted based on your responses. All information is kept private.
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Label required>Full Name</Label>
        <Input value={formData.name} onChange={e => onChange('name', e.target.value)} placeholder="Enter your full name" />
      </div>
      <div>
        <Label required>Email Address</Label>
        <Input type="email" value={formData.email} onChange={e => onChange('email', e.target.value)} placeholder="your@email.com" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <Label required>Age</Label>
          <Input type="number" value={formData.age} onChange={e => onChange('age', e.target.value)} placeholder="Your age" min="18" />
        </div>
        <div>
          <Label>Occupation</Label>
          <Input value={formData.occupation} onChange={e => onChange('occupation', e.target.value)} placeholder="Your profession" />
        </div>
      </div>
    </div>
  </div>
);

const BodyPartSection = ({ bodyPart, scores, onScoreChange }) => {
  const total = Object.values(scores[bodyPart.id]).reduce((s, v) => s + v, 0);
  const remaining = Math.max(0, 10 - total);
  const isComplete = total === 10;
  const isOver = total > 10;

  const statusStyle = isComplete
    ? { bg: T.color.successBg, border: T.color.successBorder, text: T.color.successText, icon: '✓' }
    : isOver
    ? { bg: T.color.errorBg, border: T.color.errorBorder, text: T.color.errorText, icon: '!' }
    : { bg: T.color.infoBg, border: T.color.primary, text: T.color.infoText, icon: '·' };

  return (
    <div>
      <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.color.textTertiary, margin: '0 0 6px', fontFamily: T.font.body }}>
        Body Analysis
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: T.color.textPrimary, margin: '0 0 8px', fontFamily: T.font.body }}>{bodyPart.name}</h2>
      <p style={{ fontSize: 14, color: T.color.textSecondary, margin: '0 0 16px', lineHeight: 1.5, fontFamily: T.font.body }}>
        Distribute <strong>exactly 10 points</strong> across the descriptions below based on how closely each matches your physical characteristics.
      </p>

      {/* Status badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: statusStyle.bg, border: `1.5px solid ${statusStyle.border}`,
        borderRadius: T.radius.md, padding: '10px 14px', marginBottom: 20,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: statusStyle.border, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, flexShrink: 0,
        }}>{statusStyle.icon}</div>
        <span style={{ fontSize: 13, fontWeight: 500, color: statusStyle.text, fontFamily: T.font.body }}>
          {isComplete
            ? 'Complete! All 10 points distributed.'
            : isOver
            ? `Too many points! Remove ${total - 10} point${total - 10 > 1 ? 's' : ''}.`
            : `${remaining} point${remaining !== 1 ? 's' : ''} remaining to distribute`}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: T.font.data, fontSize: 14, fontWeight: 600, color: statusStyle.text }}>
          {total}/10
        </span>
      </div>

      {/* Trait inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(bodyPart.descriptions).map(([trait, desc]) => {
          const val = scores[bodyPart.id][trait];
          const pct = (val / 10) * 100;
          return (
            <div key={trait} style={{
              background: val > 0 ? T.trait[trait].bg : T.color.bgSurface,
              border: `1.5px solid ${val > 0 ? T.trait[trait].color + '44' : T.color.primaryBorder}`,
              borderRadius: T.radius.md, padding: '12px 14px',
              transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <TraitPill trait={trait} />
                  <p style={{ fontSize: 14, color: T.color.textPrimary, margin: '6px 0 0', lineHeight: 1.5, fontFamily: T.font.body }}>{desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <input
                    type="number" min="0" max="10" value={val}
                    onChange={e => {
                      const n = Math.max(0, Math.min(10, parseInt(e.target.value) || 0));
                      const others = Object.entries(scores[bodyPart.id])
                        .filter(([k]) => k !== trait)
                        .reduce((s, [, v]) => s + v, 0);
                      if (others + n <= 10) onScoreChange(bodyPart.id, trait, n);
                    }}
                    style={{
                      width: 56, padding: '8px 6px', textAlign: 'center',
                      border: `1.5px solid ${val > 0 ? T.trait[trait].color : T.color.primaryBorder}`,
                      borderRadius: T.radius.sm, fontSize: 16,
                      fontFamily: T.font.data, fontWeight: 600,
                      color: T.trait[trait].color, background: T.color.bgSurface, outline: 'none',
                    }}
                  />
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 4, background: T.color.primaryBorder, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: T.trait[trait].color,
                  borderRadius: 2, transition: 'width 0.2s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResultsSection = ({ formData, scores }) => {
  const totals = { E: 0, O: 0, P: 0, M: 0, R: 0 };
  Object.values(scores).forEach(bp => Object.entries(bp).forEach(([t, v]) => { totals[t] += v; }));
  const percentages = {};
  Object.entries(totals).forEach(([t, v]) => { percentages[t] = Math.round((v / 60) * 100); });
  const sorted = Object.entries(percentages).sort(([, a], [, b]) => b - a);
  const [dominantTrait] = sorted[0];

  return (
    <div>
      {/* Header */}
      <div style={{
        background: T.color.primary, borderRadius: T.radius.lg,
        padding: '24px 28px', marginBottom: 20, textAlign: 'center',
      }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)', margin: '0 0 6px', fontFamily: T.font.body }}>
          Human Trait Lab · Lab Report
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: '0 0 4px', fontFamily: T.font.body }}>
          {formData.name}'s Character Blueprint
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0, fontFamily: T.font.body }}>
          Free Sample Analysis
        </p>
      </div>

      {/* Profile bars */}
      <div style={{
        background: T.color.primaryLight, border: `1.5px solid ${T.color.primaryBorder}`,
        borderRadius: T.radius.lg, padding: '20px 22px', marginBottom: 16,
      }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.color.primary, fontWeight: 600, margin: '0 0 16px', fontFamily: T.font.body }}>
          Your Character Profile
        </p>
        {sorted.map(([trait, pct]) => (
          <div key={trait} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <TraitPill trait={trait} />
              <span style={{ fontFamily: T.font.data, fontSize: 16, fontWeight: 600, color: T.trait[trait].color }}>
                {pct}%
              </span>
            </div>
            <div style={{ height: 8, background: '#fff', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: T.trait[trait].color, borderRadius: 4,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Dominant trait teaser */}
      <div style={{
        background: T.trait[dominantTrait].bg,
        border: `1.5px solid ${T.trait[dominantTrait].color}44`,
        borderRadius: T.radius.lg, padding: '18px 22px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: T.trait[dominantTrait].color,
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: T.trait[dominantTrait].color, fontFamily: T.font.body }}>
            Dominant Trait
          </span>
        </div>
        <p style={{ fontSize: 18, fontWeight: 600, color: T.color.textPrimary, margin: '0 0 8px', fontFamily: T.font.body }}>
          {T.trait[dominantTrait].name} — <span style={{ fontFamily: T.font.data }}>{percentages[dominantTrait]}%</span>
        </p>
        <p style={{ fontSize: 14, color: T.color.textSecondary, margin: 0, lineHeight: 1.6, fontFamily: T.font.body }}>
          This is just a glimpse. Your complete analysis reveals how all five traits interact, your core fears and superpowers, relationship patterns, and a personalized development plan.
        </p>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <a href="https://humantraitlab.gumroad.com/l/standard" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '16px', borderRadius: T.radius.md,
            background: T.color.primary, color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 600, fontFamily: T.font.body, cursor: 'pointer',
            letterSpacing: '0.01em',
          }}>
            Get Complete Analysis (15–20 pages) — $27
          </button>
        </a>
        <a href="https://humantraitlab.gumroad.com/l/premium" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '16px', borderRadius: T.radius.md,
            background: T.color.bgSurface, color: T.color.primary,
            border: `1.5px solid ${T.color.primaryBorder}`,
            fontSize: 15, fontWeight: 600, fontFamily: T.font.body, cursor: 'pointer',
          }}>
            Get Premium Edition (25–30 pages + Bonuses) — $47
          </button>
        </a>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: T.color.textTertiary, lineHeight: 1.5, fontFamily: T.font.body }}>
        📧 A confirmation will be sent to <strong>{formData.email}</strong><br />
        <em>For self-discovery purposes only. Not a substitute for professional psychological advice.</em>
      </p>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────
function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', age: '', occupation: '' });
  const [scores, setScores] = useState({
    head:  { E: 0, O: 0, P: 0, M: 0, R: 0 },
    eyes:  { E: 0, O: 0, P: 0, M: 0, R: 0 },
    mouth: { E: 0, O: 0, P: 0, M: 0, R: 0 },
    trunk: { E: 0, O: 0, P: 0, M: 0, R: 0 },
    hips:  { E: 0, O: 0, P: 0, M: 0, R: 0 },
    legs:  { E: 0, O: 0, P: 0, M: 0, R: 0 },
  });

  const getTotal = id => Object.values(scores[id]).reduce((s, v) => s + v, 0);
  const isFormComplete = formData.name && formData.email && formData.age;
  const isSectionComplete = idx => {
    if (idx === 0) return isFormComplete;
    if (idx === BODY_PARTS.length + 1) return true;
    return getTotal(BODY_PARTS[idx - 1].id) === 10;
  };

  const totalSections = BODY_PARTS.length + 2;
  const progress = Math.round(((currentSection + 1) / totalSections) * 100);

  const handleSubmit = async () => {
    const totals = { E: 0, O: 0, P: 0, M: 0, R: 0 };
    Object.values(scores).forEach(bp => Object.entries(bp).forEach(([t, v]) => { totals[t] += v; }));
    const percentages = {};
    Object.entries(totals).forEach(([t, v]) => { percentages[t] = Math.round((v / 60) * 100); });

    const payload = { name: formData.name, email: formData.email, age: formData.age, occupation: formData.occupation, scores: totals, percentages };

    console.log('Enviando dados:', payload);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setCurrentSection(totalSections - 1);
    } catch (err) {
      console.error('Erro:', err);
      alert('There was an error submitting your assessment. Please try again.');
    }
  };

  const renderContent = () => {
    if (currentSection === 0)
      return <PersonalInfoSection formData={formData} onChange={(f, v) => setFormData(p => ({ ...p, [f]: v }))} />;
    if (currentSection >= 1 && currentSection <= BODY_PARTS.length)
      return <BodyPartSection bodyPart={BODY_PARTS[currentSection - 1]} scores={scores} onScoreChange={(id, t, v) => setScores(p => ({ ...p, [id]: { ...p[id], [t]: v } }))} />;
    return <ResultsSection formData={formData} scores={scores} />;
  };

  const isResults = currentSection === totalSections - 1;
  const isLastBeforeResults = currentSection === BODY_PARTS.length;

  return (
    <div style={{ minHeight: '100vh', background: T.color.bgPage, padding: '24px 16px 48px', fontFamily: T.font.body }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: T.color.primary, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0, fontFamily: T.font.body }}>
            Human Trait Lab
          </p>
        </div>

        {/* Card */}
        <div style={{ background: T.color.bgSurface, borderRadius: T.radius.xl, boxShadow: T.shadow, overflow: 'hidden' }}>

          {/* Progress bar */}
          {!isResults && (
            <div style={{ padding: '20px 28px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: T.color.textTertiary }}>
                  Step {currentSection + 1} of {totalSections - 1}
                </span>
                <span style={{ fontSize: 12, fontFamily: T.font.data, color: T.color.primary, fontWeight: 600 }}>
                  {progress}%
                </span>
              </div>
              <div style={{ height: 4, background: T.color.primaryBorder, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: T.color.primary, borderRadius: 2, transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          {/* Content */}
          <div style={{ padding: isResults ? '28px' : '24px 28px 28px' }}>
            {renderContent()}
          </div>

          {/* Navigation */}
          {!isResults && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 28px', borderTop: `1px solid ${T.color.primaryBorder}`,
            }}>
              <Button
                variant="outline"
                onClick={() => setCurrentSection(p => Math.max(0, p - 1))}
                disabled={currentSection === 0}
              >
                ← Back
              </Button>
              {isLastBeforeResults ? (
                <Button onClick={handleSubmit} disabled={!isSectionComplete(currentSection)}>
                  See My Results →
                </Button>
              ) : (
                <Button onClick={() => setCurrentSection(p => p + 1)} disabled={!isSectionComplete(currentSection)}>
                  Continue →
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: T.color.textTertiary, marginTop: 20, lineHeight: 1.6 }}>
          Based on Character Structure Theory · Wilhelm Reich & Alexander Lowen<br />
          humantraitlab.com
        </p>
      </div>
    </div>
  );
}

export default App;
export default App;
