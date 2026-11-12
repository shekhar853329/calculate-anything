import React, { useState, useCallback } from 'react';

interface BirthdayResult {
  dayOfWeek: string;
  age: number;
  zodiacSign: string;
  birthstone: string;
  lifePathNumber: number;
  daysLived: number;
  hoursLived: number;
  nextBirthday: string;
  daysUntilNextBirthday: number;
}

function getZodiacSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn ♑';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒';
  return 'Pisces ♓';
}

function getBirthstone(month: number): string {
  const stones = ['', 'Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Pearl', 'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Turquoise'];
  return stones[month] ?? 'Unknown';
}

function getLifePathNumber(dob: string): number {
  const digits = dob.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

export default function BirthdayCalculator() {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<BirthdayResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!dob) {
      setError('Please enter a date of birth.');
      return;
    }

    const birth = new Date(dob);
    const today = new Date();

    if (birth > today) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[birth.getDay()];

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;

    const zodiacSign = getZodiacSign(birth.getMonth() + 1, birth.getDate());
    const birthstone = getBirthstone(birth.getMonth() + 1);
    const lifePathNumber = getLifePathNumber(dob);

    const daysLived = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const hoursLived = daysLived * 24;

    const nextBirthdayDate = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthdayDate <= today) nextBirthdayDate.setFullYear(today.getFullYear() + 1);
    const daysUntilNextBirthday = Math.ceil((nextBirthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const nextBirthday = nextBirthdayDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    setResult({ dayOfWeek, age, zodiacSign, birthstone, lifePathNumber, daysLived, hoursLived, nextBirthday, daysUntilNextBirthday });
  }, [dob]);

  const reset = useCallback(() => {
    setDob('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = [
      `Born on: ${result.dayOfWeek}`,
      `Age: ${result.age} years`,
      `Zodiac Sign: ${result.zodiacSign}`,
      `Birthstone: ${result.birthstone}`,
      `Life Path Number: ${result.lifePathNumber}`,
      `Days Lived: ${result.daysLived.toLocaleString()}`,
      `Hours Lived: ${result.hoursLived.toLocaleString()}`,
      `Next Birthday: ${result.nextBirthday} (in ${result.daysUntilNextBirthday} days)`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setDob(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Calculate
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Day Born', value: result.dayOfWeek },
              { label: 'Age', value: `${result.age} years` },
              { label: 'Zodiac Sign', value: result.zodiacSign },
              { label: 'Birthstone', value: result.birthstone },
            ].map(item => (
              <div key={item.label} className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 text-center">
                <div className="text-sm font-semibold text-pink-700 dark:text-pink-300">{item.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            {[
              { label: 'Life Path Number', value: result.lifePathNumber },
              { label: 'Days Lived', value: result.daysLived.toLocaleString() },
              { label: 'Hours Lived (approx.)', value: result.hoursLived.toLocaleString() },
              { label: 'Next Birthday', value: result.nextBirthday },
              { label: 'Days Until Next Birthday', value: `${result.daysUntilNextBirthday} days` },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{item.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={copyResult}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
