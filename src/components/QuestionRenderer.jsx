import React, { useState, useCallback } from 'react';

// Visual aids for comparing and ordering
function Visual({ question }) {
  if (question.type === 'binary_compare') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', gap: '20px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>
          {question.numA}
        </div>
        <div style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>?</div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>
          {question.numB}
        </div>
      </div>
    );
  }

  // order_set or word_problem: no extra visual for now, handled by text
  return null;
}

// Main Question Renderer
export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = useCallback((option) => {
    if (disabled) return;
    setSelectedOption(option);
    const isCorrect = String(option) === String(question.answer);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
    }, 600);
  }, [disabled, question.answer, onAnswer]);

  return (
    <div>
      <div style={{ display: 'inline-block', background: 'var(--gold)', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, letterSpacing: '0.5px' }}>
        🚀 {question.type === 'binary_compare' ? 'COMPARE' : question.type === 'order_set' ? 'ORDER' : 'PROBLEM SOLVING'}
      </div>
      <p className="question-text" style={{ whiteSpace: 'pre-line' }}>{question.question}</p>

      <Visual question={question} />

      {question.options && (
        <div className="options-grid" style={{ gridTemplateColumns: question.type === 'order_set' ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.answer) ? ' correct' : ' wrong';
            } else if (disabled && String(opt) === String(question.answer)) {
              cls += ' correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)} style={{ fontSize: question.type === 'order_set' ? '1.2rem' : '1.5rem', padding: '16px' }}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
