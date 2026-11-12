import React, { useState, useCallback } from 'react';

type UnitSystem = 'metric' | 'imperial';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  position: number; // 0-100% on bar
}

function getBMICategory(bmi: number): { category: string; categoryColor: string } {
  if (bmi < 18.5) return { category: 'Underweight', categoryColor: 'text-blue-600 dark:text-blue-400' };
  if (bmi < 25) return { category: 'Normal weight', categoryColor: 'text-green-600 dark:text-green-400' };
  if (bmi < 30) return { category: 'Overweight', categoryColor: 'text-yellow-600 dark:text-yellow-400' };
  return { category: 'Obese', categoryColor: 'text-red-600 dark:text-red-400' };
}

// Map BMI to 0–100% bar position (clamped 10–45 range)
function bmiToPosition(bmi: number): number {
  const min = 10, max = 45;
  return Math.max(0, Math.min(100, ((bmi - min) / (max - min)) * 100));
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setError('Please enter a valid positive weight.');
      return;
    }

    let weightKg = w;
    let heightM: number;

    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      if (isNaN(h) || h <= 0) { setError('Please enter a valid height in cm.'); return; }
      heightM = h / 100;
    } else {
      // imperial: weight in lbs, height in ft + in
      weightKg = w * 0.453592;
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inches;
      if (totalInches <= 0) { setError('Please enter a valid height.'); return; }
      heightM = totalInches * 0.0254;
    }

    if (heightM <= 0 || heightM > 3) {
      setError('Height seems out of range. Please check your input.');
      return;
    }

    const bmi = weightKg / (heightM * heightM);
    const { category, categoryColor } = getBMICategory(bmi);
    const position = bmiToPosition(bmi);

    setResult({ bmi, category, categoryColor, position });
  }, [unit, weight, heightCm, heightFt, heightIn]);

  const reset = useCallback(() => {
    setWeight(''); setHeightCm(''); setHeightFt(''); setHeightIn('');
    setResult(null); setError(''); setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(`BMI: ${result.bmi.toFixed(1)} (${result.category})`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const barSegments = [
    { label: 'Under-weight', range: '< 18.5', width: 'w-[22%]', bg: 'bg-blue-400' },
    { label: 'Normal', range: '18.5–24.9', width: 'w-[22%]', bg: 'bg-green-400' },
    { label: 'Over-weight', range: '25–29.9', width: 'w-[22%]', bg: 'bg-yellow-400' },
    { label: 'Obese', range: '≥ 30', width: 'w-[34%]', bg: 'bg-red-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Unit toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
          {(['metric', 'imperial'] as UnitSystem[]).map(u => (
            <button
              key={u}
              onClick={() => { setUnit(u); setResult(null); setError(''); }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                unit === u ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
              min="0"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {unit === 'metric' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={e => setHeightCm(e.target.value)}
                placeholder="e.g. 175"
                min="0"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={heightFt}
                  onChange={e => setHeightFt(e.target.value)}
                  placeholder="ft"
                  min="0"
                  className="w-1/2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={heightIn}
                  onChange={e => setHeightIn(e.target.value)}
                  placeholder="in"
                  min="0"
                  max="11"
                  className="w-1/2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button onClick={calculate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            Calculate BMI
          </button>
          <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 text-center">
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100">{result.bmi.toFixed(1)}</div>
            <div className={`text-xl font-semibold mt-1 ${result.categoryColor}`}>{result.category}</div>
          </div>

          {/* BMI Bar */}
          <div className="space-y-1">
            <div className="flex rounded-full overflow-hidden h-5">
              {barSegments.map(seg => (
                <div key={seg.label} className={`${seg.width} ${seg.bg} opacity-80`} />
              ))}
            </div>
            <div className="relative">
              <div
                className="absolute -top-5 transform -translate-x-1/2 text-blue-600 dark:text-blue-400 font-bold text-sm"
                style={{ left: `${result.position}%` }}
              >
                ▼
              </div>
            </div>
            <div className="flex text-xs mt-1 justify-between text-gray-500 dark:text-gray-400">
              {barSegments.map(seg => (
                <div key={seg.label} className="text-center" style={{ width: seg.width.replace('w-[', '').replace(']', '') }}>
                  <div>{seg.label}</div>
                  <div>{seg.range}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
