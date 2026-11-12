import { useState } from 'react';

interface Item { id: number; text: string; done: boolean }
let nextId = 1;

export default function ChecklistGenerator() {
  const [items, setItems] = useState<Item[]>([
    { id: nextId++, text: 'First task', done: false },
    { id: nextId++, text: 'Second task', done: false },
  ]);
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('My Checklist');
  const [copied, setCopied] = useState(false);

  function add() {
    const text = input.trim();
    if (!text) return;
    setItems(prev => [...prev, { id: nextId++, text, done: false }]);
    setInput('');
  }

  function toggle(id: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }

  function remove(id: number) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function clearAll() { setItems([]); }
  function clearDone() { setItems(prev => prev.filter(i => !i.done)); }

  function copyAsText() {
    const text = `${title}\n${'='.repeat(title.length)}\n\n` +
      items.map(i => `[${i.done ? 'x' : ' '}] ${i.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const done = items.filter(i => i.done).length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Checklist Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
      </div>

      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a new item…"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        <button onClick={add}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
          Add
        </button>
      </div>

      {items.length > 0 && (
        <>
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{done} / {items.length} done</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <ul className="space-y-2">
            {items.map(item => (
              <li key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)}
                  className="w-4 h-4 accent-blue-500 cursor-pointer" />
                <span className={`flex-1 text-sm ${item.done ? 'line-through text-gray-400' : ''}`}>
                  {item.text}
                </span>
                <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            <button onClick={copyAsText}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
              {copied ? 'Copied!' : 'Copy as Text'}
            </button>
            <button onClick={clearDone}
              className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
              Clear Done
            </button>
            <button onClick={clearAll}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
}
