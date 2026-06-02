import { motion } from 'framer-motion';

function extractDigits(num) {
  const str = String(num).padStart(4, '0');
  return str.split('').map(Number);
}

function findFirstDiffColumn(digitsArrays) {
  if (digitsArrays.length < 2) return -1;
  const [a, b] = digitsArrays;
  for (let i = 0; i < 4; i++) {
    if (a[i] !== b[i]) return i;
  }
  return -1;
}

export default function PlaceValueLadder({ numbers, highlightDiff = false }) {
  const digits = numbers.map(n => extractDigits(n));
  const diffCol = highlightDiff ? findFirstDiffColumn(digits) : -1;

  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', gap: '8px', 
      background: 'rgba(30, 30, 80, 0.6)', padding: '24px', borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <header style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {['Th', 'H', 'T', 'O'].map((label, i) => (
          <div key={i} style={{
            textAlign: 'center', fontWeight: 'bold', fontSize: '1.4rem',
            color: i === diffCol ? 'var(--gold)' : 'var(--text-secondary)'
          }}>{label}</div>
        ))}
      </header>
      {digits.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '8px' }}>
          {row.map((digit, ci) => (
            <motion.div
              key={ci}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: ci * 0.15, type: 'spring', stiffness: 300 }}
              style={{
                width: '50px', height: '50px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: ci === diffCol ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.1)',
                border: ci === diffCol ? '2px solid var(--gold)' : '2px solid transparent',
                borderRadius: '8px',
                fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-display)',
                boxShadow: ci === diffCol ? '0 0 15px rgba(255,193,7,0.4)' : 'none'
              }}
            >
              {digit}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
