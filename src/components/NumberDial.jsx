import React from 'react';

export default function NumberDial({ value, onChange, label }) {
  const digits = String(value).padStart(4, '0').split('').map(Number);
  
  const updateDigit = (index, delta) => {
    const newDigits = [...digits];
    newDigits[index] = (newDigits[index] + delta + 10) % 10;
    onChange(parseInt(newDigits.join(''), 10));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 'bold' }}>{label}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {digits.map((digit, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => updateDigit(i, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>▲</button>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{digit}</div>
            <button onClick={() => updateDigit(i, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>▼</button>
          </div>
        ))}
      </div>
    </div>
  );
}
