import { useState } from 'react';

export default function MeetingTimeCalculator() {
  const [attendees, setAttendees] = useState('5');
  const [rate, setRate] = useState('50');
  const [hours, setHours] = useState('1');
  const [minutes, setMinutes] = useState('0');

  const n = parseInt(attendees) || 0;
  const r = parseFloat(rate) || 0;
  const h = parseFloat(hours) || 0;
  const m = parseInt(minutes) || 0;
  const durationHours = h + m / 60;
  const totalCost = n * r * durationHours;
  const perMinuteCost = totalCost / (durationHours * 60);

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Number of Attendees</label>
          <input type="number" value={attendees} onChange={e => setAttendees(e.target.value)} min={1}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Average Hourly Rate ($/hr)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} min={0}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration – Hours</label>
          <input type="number" value={hours} onChange={e => setHours(e.target.value)} min={0}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration – Minutes</label>
          <input type="number" value={minutes} onChange={e => setMinutes(e.target.value)} min={0} max={59}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
      </div>

      {n > 0 && r > 0 && durationHours > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Total Meeting Cost</p>
            <p className="text-2xl font-bold text-blue-600">${fmt(totalCost)}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Cost Per Minute</p>
            <p className="text-2xl font-bold text-orange-500">${fmt(perMinuteCost)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Cost Per Person</p>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">${fmt(r * durationHours)}</p>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-200">
        💡 Tip: Consider async updates (email/Slack) for status meetings to reduce cost.
      </div>
    </div>
  );
}
