import React, { useState, useCallback, useMemo } from 'react';

type ColorStop = { color: string; position: number };

export default function CssGradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const stopList = stops
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(s => `${s.color} ${s.position}%`)
      .join(', ');
    if (type === 'linear') return `linear-gradient(${angle}deg, ${stopList})`;
    return `radial-gradient(circle, ${stopList})`;
  }, [type, angle, stops]);

  const addStop = useCallback(() => {
    setStops(prev => [...prev, { color: '#10b981', position: 50 }]);
  }, []);

  const removeStop = useCallback((idx: number) => {
    setStops(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateStop = useCallback((idx: number, key: keyof ColorStop, value: string | number) => {
    setStops(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s));
  }, []);

  const copy = useCallback(() => {
    const full = `background: ${css};`;
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [css]);

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div
        className="w-full h-32 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        style={{ background: css }}
      />

      {/* Type & Angle */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <div className="flex gap-2">
            {(['linear', 'radial'] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  type === t ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {type === 'linear' && (
          <div className="flex-1 min-w-32">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Angle: {angle}°</label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={e => setAngle(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        )}
      </div>

      {/* Color Stops */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Stops</label>
          <button onClick={addStop} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">+ Add Stop</button>
        </div>
        <div className="space-y-2">
          {stops.map((stop, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              <input
                type="color"
                value={stop.color}
                onChange={e => updateStop(idx, 'color', e.target.value)}
                className="h-8 w-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer p-0.5"
              />
              <code className="text-sm font-mono text-gray-700 dark:text-gray-300 w-20">{stop.color}</code>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={e => updateStop(idx, 'position', Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-10 text-right">{stop.position}%</span>
              </div>
              {stops.length > 2 && (
                <button onClick={() => removeStop(idx)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-lg leading-none">×</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</label>
        <code className="block text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
          background: {css};
        </code>
        <button onClick={copy} className="mt-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm">
          {copied ? '✓ Copied!' : 'Copy CSS'}
        </button>
      </div>
    </div>
  );
}
