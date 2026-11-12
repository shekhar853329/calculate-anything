import React, { useState, useCallback } from 'react';

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function getFactors(n: number): number[] {
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  return factors;
}

function getPrimeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors.push(d); n = n / d; }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function sieveOfEratosthenes(limit: number): number[] {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) for (let j = i * i; j <= limit; j += i) sieve[j] = false;
  }
  return sieve.map((v, i) => v ? i : -1).filter(v => v > 0);
}

export default function PrimeNumberChecker() {
  const [checkNum, setCheckNum] = useState('');
  const [genLimit, setGenLimit] = useState('');
  const [checkResult, setCheckResult] = useState<{ prime: boolean; factors: number[]; primeFactors: number[] } | null>(null);
  const [genResult, setGenResult] = useState<number[] | null>(null);
  const [checkError, setCheckError] = useState('');
  const [genError, setGenError] = useState('');
  const [copied, setCopied] = useState(false);

  const checkPrime = useCallback(() => {
    setCheckError('');
    setCheckResult(null);
    const n = parseInt(checkNum, 10);
    if (isNaN(n) || !Number.isInteger(n)) {
      setCheckError('Please enter a valid integer.');
      return;
    }
    if (n > 10_000_000) {
      setCheckError('Please enter a number ≤ 10,000,000 for performance.');
      return;
    }
    setCheckResult({ prime: isPrime(n), factors: getFactors(n), primeFactors: getPrimeFactors(n) });
  }, [checkNum]);

  const generatePrimes = useCallback(() => {
    setGenError('');
    setGenResult(null);
    const limit = parseInt(genLimit, 10);
    if (isNaN(limit) || limit < 2) {
      setGenError('Please enter a number ≥ 2.');
      return;
    }
    if (limit > 100_000) {
      setGenError('Limit must be ≤ 100,000.');
      return;
    }
    setGenResult(sieveOfEratosthenes(limit));
  }, [genLimit]);

  const copyPrimes = useCallback(() => {
    if (!genResult) return;
    navigator.clipboard.writeText(genResult.join(', ')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [genResult]);

  return (
    <div className="space-y-6">
      {/* Check a number */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Check a Number</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={checkNum}
            onChange={e => setCheckNum(e.target.value)}
            placeholder="e.g. 97"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => e.key === 'Enter' && checkPrime()}
          />
          <button onClick={checkPrime} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Check
          </button>
          <button onClick={() => { setCheckNum(''); setCheckResult(null); setCheckError(''); }}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>
        {checkError && <p className="text-sm text-red-600 dark:text-red-400">{checkError}</p>}
        {checkResult && (
          <div className="space-y-3">
            <div className={`rounded-lg p-4 text-center border-2 ${checkResult.prime ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-400 dark:border-orange-600'}`}>
              <div className="text-2xl font-bold mb-1">
                <span className={checkResult.prime ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}>
                  {checkNum} is {checkResult.prime ? '' : 'NOT '}prime
                </span>
              </div>
            </div>
            {!checkResult.prime && parseInt(checkNum) > 1 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">All factors: </span>
                  <span className="font-mono text-gray-900 dark:text-gray-100">{checkResult.factors.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Prime factorization: </span>
                  <span className="font-mono text-gray-900 dark:text-gray-100">{checkResult.primeFactors.join(' × ')}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate primes */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Generate Primes up to N</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={genLimit}
            onChange={e => setGenLimit(e.target.value)}
            placeholder="e.g. 100"
            min="2"
            max="100000"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => e.key === 'Enter' && generatePrimes()}
          />
          <button onClick={generatePrimes} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Generate
          </button>
        </div>
        {genError && <p className="text-sm text-red-600 dark:text-red-400">{genError}</p>}
        {genResult && (
          <div className="space-y-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Found <strong className="text-gray-900 dark:text-gray-100">{genResult.length}</strong> prime numbers up to {genLimit}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-h-40 overflow-y-auto">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-words">
                {genResult.join(', ')}
              </p>
            </div>
            <button onClick={copyPrimes} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              {copied ? '✓ Copied!' : 'Copy All'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
