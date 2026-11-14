import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import JSZip from 'jszip';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Trash2,
  Terminal,
  Settings,
  Folder,
  Search,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Cpu,
  Code2,
  X,
  Share2,
  Download,
  Sun,
  Moon,
  Plus,
  MoreVertical,
  ExternalLink,
  RefreshCw,
  Globe,
  Sliders,
  Eye,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Columns,
  Pencil,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export interface LanguageDef {
  id: string;
  name: string;
  version: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  monacoLang: string;
  judge0Id?: number;
  isWeb?: boolean;
  files: {
    name: string;
    lang: string;
    defaultContent: string;
  }[];
}

export const LANGUAGES: LanguageDef[] = [
  {
    id: 'c',
    name: 'C',
    version: 'GCC 14.1.0',
    badge: 'C',
    badgeBg: 'bg-blue-600',
    badgeColor: 'text-white',
    monacoLang: 'c',
    judge0Id: 103,
    files: [
      {
        name: 'Main.c',
        lang: 'c',
        defaultContent: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
      },
    ],
  },
  {
    id: 'cpp',
    name: 'C++',
    version: 'GCC 14.1.0',
    badge: 'C++',
    badgeBg: 'bg-blue-700',
    badgeColor: 'text-white',
    monacoLang: 'cpp',
    judge0Id: 105,
    files: [
      {
        name: 'Main.cpp',
        lang: 'cpp',
        defaultContent: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
      },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    version: '3.12.5',
    badge: 'Py',
    badgeBg: 'bg-amber-500',
    badgeColor: 'text-white',
    monacoLang: 'python',
    judge0Id: 100,
    files: [
      {
        name: 'main.py',
        lang: 'python',
        defaultContent: `import sys

def main():
    print("Hello, World!")
    
    # Example calculation
    numbers = [1, 2, 3, 4, 5]
    print(f"Numbers: {numbers}")
    print(f"Sum: {sum(numbers)}")

if __name__ == "__main__":
    main()
`,
      },
    ],
  },
  {
    id: 'java',
    name: 'Java',
    version: 'JDK 17.0.6',
    badge: 'Java',
    badgeBg: 'bg-red-600',
    badgeColor: 'text-white',
    monacoLang: 'java',
    judge0Id: 91,
    files: [
      {
        name: 'Main.java',
        lang: 'java',
        defaultContent: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
      },
    ],
  },
  {
    id: 'html',
    name: 'HTML/CSS/JS',
    version: 'HTML5 Web',
    badge: 'HTML',
    badgeBg: 'bg-orange-600',
    badgeColor: 'text-white',
    monacoLang: 'html',
    isWeb: true,
    files: [
      {
        name: 'index.html',
        lang: 'html',
        defaultContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Online Compiler HTML Preview</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="card">
    <div class="badge">Live Web Studio</div>
    <h1>🎉 Hello, World!</h1>
    <p>Build dynamic web pages with real-time HTML, CSS, and JavaScript preview.</p>
    <button id="counterBtn" class="btn">Click Me: 0</button>
    <div id="output" class="msg"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>
`,
      },
      {
        name: 'styles.css',
        lang: 'css',
        defaultContent: `body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  min-height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.card {
  background: #ffffff;
  padding: 36px 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 440px;
  width: 100%;
}

.badge {
  display: inline-block;
  background: #e0e7ff;
  color: #4338ca;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

h1 {
  color: #0f172a;
  margin: 0 0 10px 0;
  font-size: 26px;
}

p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.btn {
  background: #e11d48;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.35);
}

.btn:hover {
  background: #be123c;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(1px);
}

.msg {
  margin-top: 18px;
  font-size: 14px;
  font-weight: 500;
  color: #059669;
}
`,
      },
      {
        name: 'script.js',
        lang: 'javascript',
        defaultContent: `let count = 0;
const btn = document.getElementById('counterBtn');
const output = document.getElementById('output');

btn.addEventListener('click', () => {
  count++;
  btn.textContent = \`Click Me: \${count}\`;
  output.textContent = \`🚀 Button pressed \${count} time\${count === 1 ? '' : 's'}!\`;
  console.log(\`[Online Compiler Console] Button clicked! Count is now: \${count}\`);
});
`,
      },
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    version: 'Node.js 22',
    badge: 'JS',
    badgeBg: 'bg-yellow-500',
    badgeColor: 'text-slate-900',
    monacoLang: 'javascript',
    judge0Id: 102,
    files: [
      {
        name: 'index.js',
        lang: 'javascript',
        defaultContent: `console.log("Hello, World!");

const user = { name: "Developer", tool: "Calculate Anything" };
console.log("User details:", user);
`,
      },
    ],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    version: 'TS 5.6.2',
    badge: 'TS',
    badgeBg: 'bg-blue-500',
    badgeColor: 'text-white',
    monacoLang: 'typescript',
    judge0Id: 101,
    files: [
      {
        name: 'main.ts',
        lang: 'typescript',
        defaultContent: `interface Greeting {
  message: string;
  recipient: string;
}

const greet: Greeting = {
  message: "Hello",
  recipient: "World"
};

console.log(\`\${greet.message}, \${greet.recipient}!\`);
`,
      },
    ],
  },
  {
    id: 'rust',
    name: 'Rust',
    version: 'Rust 1.85',
    badge: 'Rs',
    badgeBg: 'bg-orange-700',
    badgeColor: 'text-white',
    monacoLang: 'rust',
    judge0Id: 108,
    files: [
      {
        name: 'main.rs',
        lang: 'rust',
        defaultContent: `fn main() {
    println!("Hello, World!");
}
`,
      },
    ],
  },
  {
    id: 'go',
    name: 'Go',
    version: 'Go 1.23.5',
    badge: 'Go',
    badgeBg: 'bg-cyan-600',
    badgeColor: 'text-white',
    monacoLang: 'go',
    judge0Id: 107,
    files: [
      {
        name: 'main.go',
        lang: 'go',
        defaultContent: `package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
`,
      },
    ],
  },
  {
    id: 'csharp',
    name: 'C#',
    version: 'Mono 6.6',
    badge: 'C#',
    badgeBg: 'bg-purple-700',
    badgeColor: 'text-white',
    monacoLang: 'csharp',
    judge0Id: 51,
    files: [
      {
        name: 'Program.cs',
        lang: 'csharp',
        defaultContent: `using System;

public class Program {
    public static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`,
      },
    ],
  },
  {
    id: 'php',
    name: 'PHP',
    version: 'PHP 8.3',
    badge: 'PHP',
    badgeBg: 'bg-indigo-600',
    badgeColor: 'text-white',
    monacoLang: 'php',
    judge0Id: 98,
    files: [
      {
        name: 'index.php',
        lang: 'php',
        defaultContent: `<?php
echo "Hello, World!\\n";
?>
`,
      },
    ],
  },
  {
    id: 'ruby',
    name: 'Ruby',
    version: 'Ruby 2.7',
    badge: 'Rb',
    badgeBg: 'bg-rose-700',
    badgeColor: 'text-white',
    monacoLang: 'ruby',
    judge0Id: 72,
    files: [
      {
        name: 'main.rb',
        lang: 'ruby',
        defaultContent: `puts "Hello, World!"
`,
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL (SQLite)',
    version: 'SQLite 3.27',
    badge: 'SQL',
    badgeBg: 'bg-teal-700',
    badgeColor: 'text-white',
    monacoLang: 'sql',
    judge0Id: 82,
    files: [
      {
        name: 'query.sql',
        lang: 'sql',
        defaultContent: `CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL
);

INSERT INTO users (name, role) VALUES 
    ('Alice', 'Frontend Dev'),
    ('Bob', 'Backend Dev'),
    ('Charlie', 'Architect');

SELECT * FROM users;
`,
      },
    ],
  },
  {
    id: 'bash',
    name: 'Bash',
    version: 'Bash 5.0',
    badge: 'Sh',
    badgeBg: 'bg-emerald-700',
    badgeColor: 'text-white',
    monacoLang: 'shell',
    judge0Id: 46,
    files: [
      {
        name: 'script.sh',
        lang: 'shell',
        defaultContent: `#!/bin/bash
echo "Hello, World!"
echo "Current Date: $(date)"
`,
      },
    ],
  },
];

interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
  status: { id: number; description: string } | null;
}

function getMonacoLangFromFileName(fileName: string, fallback: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'jsx':
      return 'javascript';
    case 'css':
      return 'css';
    case 'html':
    case 'htm':
      return 'html';
    case 'py':
      return 'python';
    case 'c':
    case 'h':
      return 'c';
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'hpp':
      return 'cpp';
    case 'java':
      return 'java';
    case 'rs':
      return 'rust';
    case 'go':
      return 'go';
    case 'cs':
      return 'csharp';
    case 'php':
      return 'php';
    case 'rb':
      return 'ruby';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
      return 'shell';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return fallback;
  }
}

interface ExtractedSymbol {
  name: string;
  signature: string;
  kind: 'function' | 'class' | 'variable' | 'constant';
  file: string;
  line: number;
}

function extractSymbols(code: string, fileName: string): ExtractedSymbol[] {
  const symbols: ExtractedSymbol[] = [];
  const lines = code.split('\n');

  // Regex patterns
  const pyFunc = /^\s*(?:async\s+)?def\s+([a-zA-Z_]\w*)\s*\((.*?)\):/;
  const pyClass = /^\s*class\s+([a-zA-Z_]\w*)/;

  const jsFunc = /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_]\w*)\s*\((.*?)\)/;
  const jsArrow = /(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_]\w*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>/;
  const jsClass = /(?:export\s+)?class\s+([a-zA-Z_]\w*)/;

  // C / C++ / Java / C#
  const cFunc = /(?:(?:public|private|protected|static|inline|virtual|extern|const|async)\s+)*(?:[a-zA-Z_]\w*(?:<[^>]*>)?[\s*&]+)+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*(?:const)?\s*(?:throws\s+[\w,\s]+)?\s*[{;]/;
  const cStruct = /(?:struct|class|interface|enum|record)\s+([a-zA-Z_]\w*)/;
  const cDefine = /#define\s+([a-zA-Z_]\w*)/;

  // Rust
  const rustFunc = /(?:pub\s+)?(?:async\s+)?fn\s+([a-zA-Z_]\w*)\s*(?:<[^>]*>)?\s*\((.*?)\)/;
  const rustStruct = /(?:pub\s+)?(?:struct|enum|trait)\s+([a-zA-Z_]\w*)/;

  // Go
  const goFunc = /func\s+(?:\([^)]*\)\s*)?([a-zA-Z_]\w*)\s*\((.*?)\)/;
  const goType = /type\s+([a-zA-Z_]\w*)\s+(?:struct|interface)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#include')) {
      if (!trimmed.startsWith('#define')) continue;
    }

    // Python
    let m = line.match(pyFunc);
    if (m) {
      symbols.push({ name: m[1], signature: `def ${m[1]}(${m[2]})`, kind: 'function', file: fileName, line: i + 1 });
      continue;
    }
    m = line.match(pyClass);
    if (m) {
      symbols.push({ name: m[1], signature: `class ${m[1]}`, kind: 'class', file: fileName, line: i + 1 });
      continue;
    }

    // JS / TS
    m = line.match(jsFunc);
    if (m) {
      symbols.push({ name: m[1], signature: `function ${m[1]}(${m[2]})`, kind: 'function', file: fileName, line: i + 1 });
      continue;
    }
    m = line.match(jsArrow);
    if (m) {
      symbols.push({ name: m[1], signature: `const ${m[1]} = (...) => ...`, kind: 'function', file: fileName, line: i + 1 });
      continue;
    }
    m = line.match(jsClass);
    if (m) {
      symbols.push({ name: m[1], signature: `class ${m[1]}`, kind: 'class', file: fileName, line: i + 1 });
      continue;
    }

    // Rust
    m = line.match(rustFunc);
    if (m) {
      symbols.push({ name: m[1], signature: `fn ${m[1]}(${m[2]})`, kind: 'function', file: fileName, line: i + 1 });
      continue;
    }
    m = line.match(rustStruct);
    if (m) {
      symbols.push({ name: m[1], signature: `struct ${m[1]}`, kind: 'class', file: fileName, line: i + 1 });
      continue;
    }

    // Go
    m = line.match(goFunc);
    if (m) {
      symbols.push({ name: m[1], signature: `func ${m[1]}(${m[2]})`, kind: 'function', file: fileName, line: i + 1 });
      continue;
    }
    m = line.match(goType);
    if (m) {
      symbols.push({ name: m[1], signature: `type ${m[1]}`, kind: 'class', file: fileName, line: i + 1 });
      continue;
    }

    // C / C++ / Java / C#
    m = line.match(cFunc);
    if (m && !['if', 'for', 'while', 'switch', 'catch', 'return', 'sizeof'].includes(m[1])) {
      symbols.push({ name: m[1], signature: m[0].replace(/[{;]/, '').trim(), kind: 'function', file: fileName, line: i + 1 });
      continue;
    }
    m = line.match(cStruct);
    if (m) {
      symbols.push({ name: m[1], signature: `${m[0].trim()}`, kind: 'class', file: fileName, line: i + 1 });
      continue;
    }
    m = line.match(cDefine);
    if (m) {
      symbols.push({ name: m[1], signature: `#define ${m[1]}`, kind: 'constant', file: fileName, line: i + 1 });
      continue;
    }
  }

  return symbols;
}

function buildMultiFilePayload(
  langId: string,
  activeFileName: string,
  files: Array<{ name: string; lang: string }>,
  fileContents: Record<string, string>
): string {
  if (files.length <= 1) {
    const file = files[0];
    return file ? (fileContents[`${langId}:${file.name}`] || '') : '';
  }

  // Determine main entrypoint file
  let mainFile = files.find(f => f.name === activeFileName) || files[0];
  if (
    (mainFile.name.endsWith('.h') || mainFile.name.endsWith('.hpp') || !mainFile.name.toLowerCase().includes('main')) &&
    files.some(f => f.name.toLowerCase().includes('main'))
  ) {
    const foundMain = files.find(f => f.name.toLowerCase().includes('main'));
    if (foundMain) mainFile = foundMain;
  }

  const mainContent = fileContents[`${langId}:${mainFile.name}`] || '';
  const auxFiles = files.filter(f => f.name !== mainFile.name).map(f => ({
    name: f.name,
    content: fileContents[`${langId}:${f.name}`] || '',
  }));

  switch (langId) {
    case 'python': {
      let code = `# --- Multi-file Project Sandbox Setup ---\n`;
      code += `import sys as _sys, os as _os\n`;
      code += `_files = {\n`;
      auxFiles.forEach(f => {
        code += `  ${JSON.stringify(f.name)}: ${JSON.stringify(f.content)},\n`;
      });
      code += `}\n`;
      code += `for _name, _data in _files.items():\n`;
      code += `    if _os.path.dirname(_name):\n`;
      code += `        _os.makedirs(_os.path.dirname(_name), exist_ok=True)\n`;
      code += `    with open(_name, 'w', encoding='utf-8') as _f:\n`;
      code += `        _f.write(_data)\n`;
      code += `if '.' not in _sys.path: _sys.path.insert(0, '.')\n`;
      code += `# --- End Setup ---\n\n`;
      code += mainContent;
      return code;
    }

    case 'c':
    case 'cpp': {
      let bundled = `// --- Antigravity Multi-file Compilation Unit ---\n`;
      const allHeaders = auxFiles.filter(f => f.name.endsWith('.h') || f.name.endsWith('.hpp'));
      const allImpls = auxFiles.filter(f => !f.name.endsWith('.h') && !f.name.endsWith('.hpp'));

      // 1. Headers placed at top of compilation unit
      allHeaders.forEach(h => {
        bundled += `\n// Header: ${h.name}\n${h.content}\n`;
      });

      // 2. Auxiliary Implementations
      allImpls.forEach(impl => {
        let content = impl.content.replace(/\bint\s+main\s*\([^)]*\)\s*\{[\s\S]*?\}/g, '/* secondary main omitted */');
        // Comment out local #include for project headers so gcc doesn't fail looking on disk
        allHeaders.forEach(h => {
          const escaped = h.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const incRegex = new RegExp(`#include\\s*["<]${escaped}[">]`, 'g');
          content = content.replace(incRegex, `/* #include "${h.name}" */`);
        });
        bundled += `\n// Implementation: ${impl.name}\n${content}\n`;
      });

      // 3. Main File
      let mainCode = mainContent;
      allHeaders.forEach(h => {
        const escaped = h.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const incRegex = new RegExp(`#include\\s*["<]${escaped}[">]`, 'g');
        mainCode = mainCode.replace(incRegex, `/* #include "${h.name}" */`);
      });

      return bundled + '\n// --- Main Application ---\n' + mainCode;
    }

    case 'java': {
      let aux = `// --- Auxiliary Classes ---\n`;
      auxFiles.forEach(f => {
        const pkgPrivate = f.content
          .replace(/\bpublic\s+(class|interface|enum|record)\b/g, '$1 ')
          .replace(/^\s*package\s+[^;]+;/gm, '// package removed');
        aux += `\n// File: ${f.name}\n${pkgPrivate}\n`;
      });
      return aux + '\n// --- Main Application ---\n' + mainContent;
    }

    case 'javascript':
    case 'typescript': {
      let code = `// --- Multi-file Node.js Setup ---\n`;
      code += `const _fs = require('fs');\n`;
      code += `const _path = require('path');\n`;
      auxFiles.forEach(f => {
        code += `try { _fs.mkdirSync(_path.dirname(${JSON.stringify(f.name)}), { recursive: true }); } catch(e){}\n`;
        code += `_fs.writeFileSync(${JSON.stringify(f.name)}, ${JSON.stringify(f.content)});\n`;
      });
      code += `// --- Main Execution ---\n`;
      code += mainContent;
      return code;
    }

    case 'go': {
      let combined = `package main\n\n`;
      auxFiles.forEach(f => {
        const stripped = f.content.replace(/^\s*package\s+main\s*/m, '');
        combined += `// File: ${f.name}\n${stripped}\n`;
      });
      const mainStripped = mainContent.replace(/^\s*package\s+main\s*/m, '');
      combined += `// File: ${mainFile.name}\n${mainStripped}\n`;
      return combined;
    }

    case 'rust': {
      let code = `// --- Multi-file Rust Modules ---\n`;
      auxFiles.forEach(f => {
        const modName = f.name.replace(/\.rs$/, '');
        code += `mod ${modName} {\n${f.content}\n}\n`;
      });
      code += `// --- Main Program ---\n`;
      code += mainContent;
      return code;
    }

    case 'csharp': {
      const combinedUsings = new Set<string>();
      let classBodies = '';

      const extractUsings = (code: string) => {
        const lines = code.split('\n');
        const nonUsings: string[] = [];
        for (const line of lines) {
          if (/^\s*using\s+[a-zA-Z0-9_.]+;/.test(line)) {
            combinedUsings.add(line.trim());
          } else {
            nonUsings.push(line);
          }
        }
        return nonUsings.join('\n');
      };

      auxFiles.forEach(f => {
        const body = extractUsings(f.content);
        classBodies += `\n// File: ${f.name}\n${body}\n`;
      });

      const mainBody = extractUsings(mainContent);
      classBodies += `\n// File: ${mainFile.name}\n${mainBody}\n`;

      return Array.from(combinedUsings).join('\n') + '\n\n' + classBodies;
    }

    case 'php': {
      let code = `<?php\n// --- Multi-file PHP Setup ---\n`;
      auxFiles.forEach(f => {
        code += `file_put_contents(${JSON.stringify(f.name)}, ${JSON.stringify(f.content)});\n`;
      });
      const strippedMain = mainContent.replace(/^\s*<\?php\s*/i, '');
      code += strippedMain;
      return code;
    }

    case 'ruby': {
      let code = `# --- Multi-file Ruby Setup ---\n`;
      auxFiles.forEach(f => {
        code += `File.write(${JSON.stringify(f.name)}, ${JSON.stringify(f.content)})\n`;
      });
      code += mainContent;
      return code;
    }

    case 'bash': {
      let code = `#!/bin/bash\n# --- Multi-file Bash Setup ---\n`;
      auxFiles.forEach(f => {
        code += `cat << 'EOF_AUX_${f.name.replace(/\W/g, '_')}' > "${f.name}"\n${f.content}\nEOF_AUX_${f.name.replace(/\W/g, '_')}\nchmod +x "${f.name}"\n`;
      });
      code += mainContent;
      return code;
    }

    case 'sql': {
      let code = `-- --- Multi-file SQL Execution ---\n`;
      auxFiles.forEach(f => {
        code += `\n-- File: ${f.name}\n${f.content}\n`;
      });
      code += `\n-- Main File: ${mainFile.name}\n${mainContent}\n`;
      return code;
    }

    default:
      return mainContent;
  }
}

async function prepareJudge0Submission(
  langId: string,
  defaultJudge0Id: number,
  activeFileName: string,
  files: Array<{ name: string; lang: string }>,
  fileContents: Record<string, string>
): Promise<{ language_id: number; source_code?: string; additional_files?: string }> {
  // If only 1 file in project, run standard single-file execution directly
  if (files.length <= 1) {
    const file = files[0];
    const code = file ? (fileContents[`${langId}:${file.name}`] || '') : '';
    return {
      language_id: defaultJudge0Id,
      source_code: code,
    };
  }

  // Multi-file supported natively via Judge0 Language ID 89
  const supportedNativeMultiFile = [
    'c',
    'cpp',
    'csharp',
    'java',
    'python',
    'javascript',
    'typescript',
    'go',
    'rust',
    'php',
    'ruby',
    'bash',
    'sql',
  ];

  if (supportedNativeMultiFile.includes(langId)) {
    const zip = new JSZip();

    // 1. Add all project files into the root of the ZIP
    files.forEach(f => {
      const content = fileContents[`${langId}:${f.name}`] || '';
      zip.file(f.name, content);
    });

    // 2. Identify the main entrypoint file
    let mainFile = files.find(f => {
      const content = fileContents[`${langId}:${f.name}`] || '';
      return (
        /\b(int|void)\s+main\s*\(/.test(content) ||
        /\bpublic\s+static\s+void\s+main\s*\(/.test(content) ||
        /\bstatic\s+void\s+Main\s*\(/.test(content) ||
        /\bstatic\s+int\s+Main\s*\(/.test(content) ||
        /\bfunc\s+main\s*\(/.test(content) ||
        /\bfn\s+main\s*\(/.test(content)
      );
    });

    if (!mainFile) {
      mainFile =
        files.find(f => f.name.toLowerCase().includes('main')) ||
        files.find(f => f.name === activeFileName) ||
        files[0];
    }

    const mainName = mainFile ? mainFile.name : (activeFileName || files[0].name);

    // 3. Generate compile & run scripts according to language
    if (langId === 'c') {
      const compileScript = `#!/bin/bash
if grep -qE '#include\\s*["<].*\\.c[">]' *.c 2>/dev/null; then
  gcc -O3 -w "${mainName}" -o main 2>/dev/null || gcc -O3 -w Main.c -o main 2>/dev/null || gcc -O3 -w *.c -o main
else
  gcc -O3 -w *.c -o main
fi
`;
      zip.file('compile', compileScript);
      zip.file('run', `#!/bin/bash\n./main\n`);
    } else if (langId === 'cpp') {
      const compileScript = `#!/bin/bash
if grep -qE '#include\\s*["<].*\\.(cpp|cc|c)[">]' *.(cpp|cc|c) 2>/dev/null; then
  g++ -O3 -w "${mainName}" -o main 2>/dev/null || g++ -O3 -w *.cpp *.cc -o main
else
  g++ -O3 -w *.cpp *.cc *.c -o main
fi
`;
      zip.file('compile', compileScript);
      zip.file('run', `#!/bin/bash\n./main\n`);
    } else if (langId === 'csharp') {
      const compileScript = `#!/bin/bash
export PATH="/usr/local/mono-6.6.0.161/bin:$PATH"
mcs -out:main.exe *.cs
`;
      const runScript = `#!/bin/bash
export PATH="/usr/local/mono-6.6.0.161/bin:$PATH"
mono main.exe
`;
      zip.file('compile', compileScript);
      zip.file('run', runScript);
    } else if (langId === 'java') {
      zip.file('compile', `#!/bin/bash\njavac *.java\n`);
      const javaClass = mainName.replace(/\.java$/, '');
      zip.file('run', `#!/bin/bash\njava ${javaClass}\n`);
    } else if (langId === 'python') {
      zip.file('run', `#!/bin/bash\npython3 "${mainName}"\n`);
    } else if (langId === 'javascript' || langId === 'typescript') {
      zip.file('run', `#!/bin/bash\nnode "${mainName}"\n`);
    } else if (langId === 'go') {
      const compileScript = `#!/bin/bash
export PATH="/usr/local/go-1.13.5/bin:$PATH"
go build -o main .
`;
      zip.file('compile', compileScript);
      zip.file('run', `#!/bin/bash\n./main\n`);
    } else if (langId === 'rust') {
      const compileScript = `#!/bin/bash
export PATH="/usr/local/rust-1.40.0/bin:$PATH"
rustc "${mainName}" -o main
`;
      zip.file('compile', compileScript);
      zip.file('run', `#!/bin/bash\n./main\n`);
    } else if (langId === 'php') {
      const runScript = `#!/bin/bash
export PATH="/usr/local/php-7.4.1/bin:$PATH"
php "${mainName}"
`;
      zip.file('run', runScript);
    } else if (langId === 'ruby') {
      const runScript = `#!/bin/bash
export PATH="/usr/local/ruby-2.7.0/bin:$PATH"
ruby "${mainName}"
`;
      zip.file('run', runScript);
    } else if (langId === 'bash') {
      zip.file('run', `#!/bin/bash\nchmod +x "${mainName}"\n./"${mainName}"\n`);
    } else if (langId === 'sql') {
      const sqlFiles = files.filter(f => f.name.endsWith('.sql'));
      const script = `#!/bin/bash\ncat ${sqlFiles.map(f => `"${f.name}"`).join(' ')} | sqlite3 :memory:\n`;
      zip.file('run', script);
    }

    const zipBase64 = await zip.generateAsync({ type: 'base64' });
    return {
      language_id: 89,
      additional_files: zipBase64,
    };
  }

  // Fallback for other languages:
  const bundledCode = buildMultiFilePayload(langId, activeFileName, files, fileContents);
  return {
    language_id: defaultJudge0Id,
    source_code: bundledCode,
  };
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const q = query.trim().toLowerCase();
  const lower = text.toLowerCase();
  const index = lower.indexOf(q);
  if (index === -1) return text;
  const matchLen = q.length;
  const before = text.substring(0, index);
  const match = text.substring(index, index + matchLen);
  const after = text.substring(index + matchLen);
  return (
    <>
      {before}
      <span className="bg-yellow-200 dark:bg-yellow-800/80 text-yellow-900 dark:text-yellow-100 font-bold px-0.5 rounded">
        {match}
      </span>
      {after}
    </>
  );
}

export default function OnlineCompilerIDE() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Active language & files
  const [selectedLangId, setSelectedLangId] = useState<string>('c');
  const [activeFileName, setActiveFileName] = useState<string>('Main.c');

  // Multi-file state per language
  const [projectFiles, setProjectFiles] = useState<Record<string, Array<{ name: string; lang: string }>>>(() => {
    const init: Record<string, Array<{ name: string; lang: string }>> = {};
    LANGUAGES.forEach(lang => {
      init[lang.id] = lang.files.map(f => ({ name: f.name, lang: f.lang }));
    });
    return init;
  });

  const [fileContents, setFileContents] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    LANGUAGES.forEach(lang => {
      lang.files.forEach(f => {
        init[`${lang.id}:${f.name}`] = f.defaultContent;
      });
    });
    return init;
  });

  // Open editor tabs per language (filenames)
  const [openTabs, setOpenTabs] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    LANGUAGES.forEach(lang => {
      init[lang.id] = lang.files.map(f => f.name);
    });
    return init;
  });

  // Context Menu state (Right Click on Explorer File or Tab)
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    fileName: string;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Inline Renaming state (VS Code behavior)
  const [renamingFileName, setRenamingFileName] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState<string>('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Inline New File state (VS Code behavior)
  const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false);
  const [newFileInputValue, setNewFileInputValue] = useState<string>('');
  const [newFileError, setNewFileError] = useState<string | null>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  // Custom VS Code modal for Delete confirmation
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    fileName: string;
  } | null>(null);

  // Monaco & Multi-file IntelliSense refs
  const monacoRef = useRef<any>(null);
  const completionDisposableRef = useRef<any>(null);
  const hoverDisposableRef = useRef<any>(null);

  const projectFilesRef = useRef(projectFiles);
  const fileContentsRef = useRef(fileContents);
  const activeFileRef = useRef(activeFileName);
  const selectedLangRef = useRef(selectedLangId);

  useEffect(() => {
    projectFilesRef.current = projectFiles;
    fileContentsRef.current = fileContents;
    activeFileRef.current = activeFileName;
    selectedLangRef.current = selectedLangId;
  });

  // Stdin
  const [stdin, setStdin] = useState<string>('');

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [sidebarTab, setSidebarTab] = useState<'files' | 'search'>('files');
  const [activeTab, setActiveTab] = useState<'console' | 'io' | 'ai' | 'preview'>('console');
  const [languageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Explorer file filter state
  const [fileFilterQuery, setFileFilterQuery] = useState<string>('');
  const [isExplorerSearchOpen, setIsExplorerSearchOpen] = useState<boolean>(false);
  const fileSearchInputRef = useRef<HTMLInputElement>(null);

  // Global project content search state
  const [codeSearchQuery, setCodeSearchQuery] = useState<string>('');
  const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(false);
  const [isWholeWord, setIsWholeWord] = useState<boolean>(false);
  const [collapsedSearchFiles, setCollapsedSearchFiles] = useState<Record<string, boolean>>({});
  const codeSearchInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [fontSize, setFontSize] = useState<number>(14);
  const [showMinimap, setShowMinimap] = useState<boolean>(false);

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [webLogs, setWebLogs] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // AI Explainer State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Split pane resizing state
  const [editorWidthPercent, setEditorWidthPercent] = useState<number>(55);
  const [isOutputCollapsed, setIsOutputCollapsed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState<number>(180);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const editorRef = useRef<any>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.id === selectedLangId) || LANGUAGES[0];
  const isWebMode = Boolean(currentLang.isWeb);

  // Dark mode detector
  useEffect(() => {
    setMounted(true);
    const checkDark = () => {
      return (
        document.documentElement.classList.contains('dark') ||
        theme === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    };
    setIsDark(checkDark());

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [theme]);

  const currentFiles = projectFiles[selectedLangId] || [];
  const currentOpenTabs = (openTabs[selectedLangId] || []).filter(name =>
    currentFiles.some(f => f.name === name)
  );

  // Filtered files in Explorer based on fileFilterQuery
  const filteredFiles = useMemo(() => {
    if (!fileFilterQuery.trim()) return currentFiles;
    const q = fileFilterQuery.trim().toLowerCase();
    return currentFiles.filter(f => f.name.toLowerCase().includes(q));
  }, [currentFiles, fileFilterQuery]);

  // Global Search across all files in current language
  interface SearchResultMatch {
    file: string;
    line: number;
    col: number;
    lineText: string;
    matchIndex: number;
    matchLength: number;
  }

  interface FileSearchGroup {
    file: string;
    matches: SearchResultMatch[];
  }

  const globalSearchResults = useMemo((): { groups: FileSearchGroup[]; totalMatches: number } => {
    const query = codeSearchQuery.trim();
    if (!query) return { groups: [], totalMatches: 0 };

    const groups: FileSearchGroup[] = [];
    let totalMatches = 0;

    let regex: RegExp | null = null;
    try {
      const flags = isCaseSensitive ? 'g' : 'gi';
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = isWholeWord ? `\\b${escaped}\\b` : escaped;
      regex = new RegExp(pattern, flags);
    } catch {
      regex = null;
    }

    const currentActiveVal = editorRef.current?.getValue();

    for (const f of currentFiles) {
      const key = `${selectedLangId}:${f.name}`;
      const content =
        f.name === activeFileName && typeof currentActiveVal === 'string'
          ? currentActiveVal
          : fileContents[key] ?? '';
      const lines = content.split('\n');
      const fileMatches: SearchResultMatch[] = [];

      lines.forEach((lineText, idx) => {
        const lineNum = idx + 1;
        if (regex) {
          regex.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = regex.exec(lineText)) !== null) {
            fileMatches.push({
              file: f.name,
              line: lineNum,
              col: m.index + 1,
              lineText,
              matchIndex: m.index,
              matchLength: m[0].length,
            });
            totalMatches++;
            if (!regex.global) break;
            if (m.index === regex.lastIndex) regex.lastIndex++;
          }
        } else {
          const targetText = isCaseSensitive ? lineText : lineText.toLowerCase();
          const searchTarget = isCaseSensitive ? query : query.toLowerCase();
          let startIdx = 0;
          while (startIdx < targetText.length) {
            const found = targetText.indexOf(searchTarget, startIdx);
            if (found === -1) break;
            fileMatches.push({
              file: f.name,
              line: lineNum,
              col: found + 1,
              lineText,
              matchIndex: found,
              matchLength: query.length,
            });
            totalMatches++;
            startIdx = found + query.length;
          }
        }
      });

      if (fileMatches.length > 0) {
        groups.push({
          file: f.name,
          matches: fileMatches,
        });
      }
    }

    return { groups, totalMatches };
  }, [codeSearchQuery, isCaseSensitive, isWholeWord, currentFiles, fileContents, selectedLangId, activeFileName]);

  // Handle selecting a search result (open file + reveal line in Monaco)
  const handleSelectSearchResult = (fileName: string, line: number, col: number) => {
    handleOpenFile(fileName);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(line);
        editorRef.current.setPosition({ lineNumber: line, column: col });
        editorRef.current.focus();
      }
    }, 60);
  };

  // Open file in an editor tab
  const handleOpenFile = (fileName: string) => {
    setActiveFileName(fileName);
    setOpenTabs(prev => {
      const existing = prev[selectedLangId] || [];
      if (existing.includes(fileName)) return prev;
      return {
        ...prev,
        [selectedLangId]: [...existing, fileName],
      };
    });
  };

  // Close an editor tab (does NOT delete file from Explorer)
  const handleCloseTab = (fileName: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setOpenTabs(prev => {
      const existing = prev[selectedLangId] || [];
      const updated = existing.filter(name => name !== fileName);

      // If active tab was closed, switch active file to another open tab
      if (activeFileName === fileName) {
        const closedIndex = existing.indexOf(fileName);
        if (updated.length > 0) {
          const nextIndex = Math.max(0, closedIndex - 1);
          setActiveFileName(updated[nextIndex] || updated[0]);
        } else {
          setActiveFileName('');
        }
      }

      return {
        ...prev,
        [selectedLangId]: updated,
      };
    });
  };

  // Auto-focus and select base filename without extension when renaming starts (VS Code behavior)
  useEffect(() => {
    if (renamingFileName && renameInputRef.current) {
      const input = renameInputRef.current;
      input.focus();
      const dotIndex = renamingFileName.lastIndexOf('.');
      if (dotIndex > 0) {
        input.setSelectionRange(0, dotIndex);
      } else {
        input.select();
      }
    }
  }, [renamingFileName]);

  // Auto-focus input when inline new file creation starts
  useEffect(() => {
    if (isCreatingFile && newFileInputRef.current) {
      newFileInputRef.current.focus();
    }
  }, [isCreatingFile]);

  // Focus explorer search filter input when opened
  useEffect(() => {
    if (isExplorerSearchOpen && fileSearchInputRef.current) {
      fileSearchInputRef.current.focus();
      fileSearchInputRef.current.select();
    }
  }, [isExplorerSearchOpen]);

  // Close context menu, dialogs & handle global shortcuts
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setLanguageMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setMoreMenuOpen(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(target)) {
        setContextMenu(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+F or Cmd+Shift+F for Global Project Search (VS Code style)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        setSidebarOpen(true);
        setSidebarTab('search');
        setTimeout(() => {
          codeSearchInputRef.current?.focus();
          codeSearchInputRef.current?.select();
        }, 50);
        return;
      }

      if (e.key === 'Escape') {
        if (deleteModal) {
          setDeleteModal(null);
          return;
        }
        setContextMenu(null);
        setRenamingFileName(null);
        setRenameError(null);
        setIsCreatingFile(false);
        setNewFileError(null);
      }

      if (e.key === 'Enter' && deleteModal && deleteModal.open) {
        confirmDelete(deleteModal.fileName);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteModal]);

  // Set default tab when language changes
  const handleSelectLanguage = (langId: string) => {
    const targetLang = LANGUAGES.find(l => l.id === langId) || LANGUAGES[0];
    const targetFiles = projectFiles[langId] || targetLang.files;
    setSelectedLangId(langId);
    setActiveFileName(targetFiles[0]?.name || 'main');
    setExecResult(null);
    setAiAnalysis(null);
    setFileFilterQuery('');
    setCodeSearchQuery('');
    setLanguageMenuOpen(false);
    setContextMenu(null);
    setRenamingFileName(null);
    setRenameError(null);
    setIsCreatingFile(false);
    setNewFileError(null);
    setDeleteModal(null);

    if (targetLang.isWeb) {
      setActiveTab('preview');
    } else {
      setActiveTab('console');
    }
  };

  // Get active file content
  const activeKey = `${selectedLangId}:${activeFileName}`;
  const currentContent = fileContents[activeKey] ?? '';

  // Get active file definition
  const activeFileDef =
    currentFiles.find(f => f.name === activeFileName) ||
    currentFiles[0] || { name: 'Main', lang: currentLang.monacoLang };

  // File Context Menu (Right Click)
  const handleFileContextMenu = (e: React.MouseEvent, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();

    const menuWidth = 180;
    const menuHeight = 100;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setContextMenu({
      visible: true,
      x,
      y,
      fileName,
    });
  };

  // Validation function matching VS Code rules
  const validateFileName = (name: string, originalName?: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) {
      return 'A file or folder name must be provided.';
    }
    if (/[\\/:*?"<>|]/.test(trimmed)) {
      return 'A file name cannot contain any of the following characters: \\ / : * ? " < > |';
    }
    const isDuplicate = currentFiles.some(
      f =>
        f.name.toLowerCase() === trimmed.toLowerCase() &&
        (!originalName || f.name.toLowerCase() !== originalName.toLowerCase())
    );
    if (isDuplicate) {
      return `A file or folder '${trimmed}' already exists at this location. Please choose a different name.`;
    }
    return null;
  };

  // 1. Rename handlers (VS Code style)
  const handleStartRename = (fileName: string) => {
    setContextMenu(null);
    setRenamingFileName(fileName);
    setRenameInputValue(fileName);
    setRenameError(null);
  };

  const handleRenameChange = (val: string) => {
    setRenameInputValue(val);
    if (val.trim() === renamingFileName) {
      setRenameError(null);
    } else {
      setRenameError(validateFileName(val, renamingFileName || undefined));
    }
  };

  const handleSubmitRename = () => {
    if (!renamingFileName) return;
    const trimmed = renameInputValue.trim();

    if (!trimmed || trimmed === renamingFileName) {
      setRenamingFileName(null);
      setRenameError(null);
      return;
    }

    const error = validateFileName(trimmed, renamingFileName);
    if (error) {
      setRenameError(error);
      renameInputRef.current?.focus();
      return;
    }

    const lang = getMonacoLangFromFileName(trimmed, currentLang.monacoLang);

    setProjectFiles(prev => ({
      ...prev,
      [selectedLangId]: (prev[selectedLangId] || []).map(f =>
        f.name === renamingFileName ? { ...f, name: trimmed, lang } : f
      ),
    }));

    setFileContents(prev => {
      const oldKey = `${selectedLangId}:${renamingFileName}`;
      const newKey = `${selectedLangId}:${trimmed}`;
      const content = prev[oldKey] ?? '';
      const updated = { ...prev, [newKey]: content };
      delete updated[oldKey];
      return updated;
    });

    setOpenTabs(prev => ({
      ...prev,
      [selectedLangId]: (prev[selectedLangId] || []).map(name =>
        name === renamingFileName ? trimmed : name
      ),
    }));

    if (activeFileName === renamingFileName) {
      setActiveFileName(trimmed);
    }

    setRenamingFileName(null);
    setRenameError(null);
  };

  const handleCancelRename = () => {
    setRenamingFileName(null);
    setRenameError(null);
  };

  const handleBlurRename = () => {
    if (!renamingFileName) return;
    const trimmed = renameInputValue.trim();
    if (!trimmed || trimmed === renamingFileName || validateFileName(trimmed, renamingFileName)) {
      setRenamingFileName(null);
      setRenameError(null);
      return;
    }
    handleSubmitRename();
  };

  // 2. Delete handlers (VS Code modal style)
  const requestDeleteFile = (fileName: string) => {
    setContextMenu(null);
    setDeleteModal({
      open: true,
      fileName,
    });
  };

  const confirmDelete = (fileName: string) => {
    const updated = currentFiles.filter(f => f.name !== fileName);
    setProjectFiles(prev => ({
      ...prev,
      [selectedLangId]: updated,
    }));

    setFileContents(prev => {
      const key = `${selectedLangId}:${fileName}`;
      const updatedMap = { ...prev };
      delete updatedMap[key];
      return updatedMap;
    });

    // Remove from open tabs
    setOpenTabs(prev => {
      const existing = prev[selectedLangId] || [];
      const updatedTabs = existing.filter(name => name !== fileName);

      if (activeFileName === fileName) {
        setActiveFileName(updatedTabs.length > 0 ? updatedTabs[0] : (updated.length > 0 ? updated[0].name : ''));
      }

      return {
        ...prev,
        [selectedLangId]: updatedTabs,
      };
    });

    setDeleteModal(null);
  };

  // 3. New file handlers (VS Code inline style)
  const handleStartNewFile = () => {
    setIsCreatingFile(true);
    setNewFileInputValue('');
    setNewFileError(null);
  };

  const handleNewFileChange = (val: string) => {
    setNewFileInputValue(val);
    setNewFileError(validateFileName(val));
  };

  const handleSubmitNewFile = () => {
    if (!isCreatingFile) return;
    const trimmed = newFileInputValue.trim();

    if (!trimmed) {
      setIsCreatingFile(false);
      setNewFileError(null);
      return;
    }

    const error = validateFileName(trimmed);
    if (error) {
      setNewFileError(error);
      newFileInputRef.current?.focus();
      return;
    }

    const lang = getMonacoLangFromFileName(trimmed, currentLang.monacoLang);

    setProjectFiles(prev => ({
      ...prev,
      [selectedLangId]: [...(prev[selectedLangId] || []), { name: trimmed, lang }],
    }));

    setFileContents(prev => ({
      ...prev,
      [`${selectedLangId}:${trimmed}`]: `// ${trimmed}\n`,
    }));

    setOpenTabs(prev => ({
      ...prev,
      [selectedLangId]: [...(prev[selectedLangId] || []), trimmed],
    }));

    setActiveFileName(trimmed);
    setIsCreatingFile(false);
    setNewFileError(null);
  };

  const handleCancelNewFile = () => {
    setIsCreatingFile(false);
    setNewFileError(null);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileContents(prev => ({
        ...prev,
        [activeKey]: value,
      }));
    }
  };

  // Multi-file IntelliSense registration across all supported languages
  const registerMultiFileIntelliSense = useCallback((monaco: any) => {
    if (!monaco) return;

    if (completionDisposableRef.current) {
      completionDisposableRef.current.forEach((d: any) => d?.dispose());
      completionDisposableRef.current = [];
    } else {
      completionDisposableRef.current = [];
    }

    if (hoverDisposableRef.current) {
      hoverDisposableRef.current.forEach((d: any) => d?.dispose());
      hoverDisposableRef.current = [];
    } else {
      hoverDisposableRef.current = [];
    }

    const languages = [
      'c', 'cpp', 'python', 'java', 'javascript', 'typescript',
      'csharp', 'rust', 'go', 'php', 'ruby', 'sql', 'shell', 'html', 'css'
    ];

    const getProjectSymbols = () => {
      const langId = selectedLangRef.current;
      const files = projectFilesRef.current[langId] || [];
      const contents: Record<string, string> = { ...fileContentsRef.current };
      if (editorRef.current && activeFileRef.current) {
        contents[`${langId}:${activeFileRef.current}`] = editorRef.current.getValue();
      }
      const allSymbols: ExtractedSymbol[] = [];

      for (const f of files) {
        const code = contents[`${langId}:${f.name}`] || '';
        const fileSymbols = extractSymbols(code, f.name);
        allSymbols.push(...fileSymbols);
      }
      return allSymbols;
    };

    languages.forEach(lang => {
      // 1. Autocompletion Provider
      try {
        const compDisp = monaco.languages.registerCompletionItemProvider(lang, {
          triggerCharacters: ['.', ':', '>', '#', ' '],
          provideCompletionItems: (model: any, position: any) => {
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            };

            const symbols = getProjectSymbols();
            const suggestions: any[] = symbols.map(sym => {
              let kind = monaco.languages.CompletionItemKind.Function;
              if (sym.kind === 'class') kind = monaco.languages.CompletionItemKind.Class;
              else if (sym.kind === 'constant') kind = monaco.languages.CompletionItemKind.Constant;
              else if (sym.kind === 'variable') kind = monaco.languages.CompletionItemKind.Variable;

              const isCurrentFile = sym.file === activeFileRef.current;

              return {
                label: sym.name,
                kind,
                detail: `${sym.signature}  •  ${isCurrentFile ? 'current file' : sym.file}`,
                documentation: {
                  value: `**${sym.name}**\n\n\`\`\`${lang}\n${sym.signature}\n\`\`\`\n\n*Defined in: \`${sym.file}\` (line ${sym.line})*`,
                },
                insertText: sym.name,
                range,
                sortText: isCurrentFile ? `1_${sym.name}` : `0_${sym.name}`,
              };
            });

            // Suggest other project filenames for #include / import / require
            const files = projectFilesRef.current[selectedLangRef.current] || [];
            files.forEach(f => {
              if (f.name !== activeFileRef.current) {
                suggestions.push({
                  label: f.name,
                  kind: monaco.languages.CompletionItemKind.File,
                  detail: `Project file: ${f.name}`,
                  documentation: {
                    value: `Project file \`${f.name}\` available for include / import / require.`,
                  },
                  insertText: f.name,
                  range,
                  sortText: `0_${f.name}`,
                });
              }
            });

            return { suggestions };
          },
        });
        completionDisposableRef.current.push(compDisp);
      } catch (err) {
        // Ignore if language not in monaco
      }

      // 2. Hover Tooltip Provider
      try {
        const hovDisp = monaco.languages.registerHoverProvider(lang, {
          provideHover: (model: any, position: any) => {
            const word = model.getWordAtPosition(position);
            if (!word) return null;

            const symbols = getProjectSymbols();
            const matched = symbols.find(s => s.name === word.word);
            if (!matched) return null;

            return {
              range: new monaco.Range(
                position.lineNumber,
                word.startColumn,
                position.lineNumber,
                word.endColumn
              ),
              contents: [
                { value: `**${matched.name}**  *(from \`${matched.file}\`:L${matched.line})*` },
                { value: `\`\`\`${lang}\n${matched.signature}\n\`\`\`` },
              ],
            };
          },
        });
        hoverDisposableRef.current.push(hovDisp);
      } catch (err) {
        // Ignore
      }
    });
  }, []);

  // Cleanup Monaco IntelliSense listeners on unmount
  useEffect(() => {
    return () => {
      if (completionDisposableRef.current) {
        completionDisposableRef.current.forEach((d: any) => d?.dispose());
      }
      if (hoverDisposableRef.current) {
        hoverDisposableRef.current.forEach((d: any) => d?.dispose());
      }
    };
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPos({
        line: e.position.lineNumber,
        col: e.position.column,
      });
    });

    // Ctrl+Enter or Cmd+Enter to Run
    editor.addCommand(2048 | 3, () => {
      executeCode();
    });

    if (monaco) {
      registerMultiFileIntelliSense(monaco);
    }
  };

  // Drag resizing for the split container
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Drag resizing for the sidebar explorer
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSidebar(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Sidebar dragging
      if (isDraggingSidebar && sidebarRef.current) {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const newWidth = e.clientX - sidebarRect.left;
        if (newWidth >= 120 && newWidth <= 480) {
          setSidebarWidth(Math.round(newWidth));
        }
        return;
      }

      // 2. Editor / Output split dragging
      if (isDragging && splitContainerRef.current) {
        const rect = splitContainerRef.current.getBoundingClientRect();
        const offset = e.clientX - rect.left;
        const totalWidth = rect.width;
        if (totalWidth <= 0) return;
        let newPercent = (offset / totalWidth) * 100;
        // Clamp between 20% and 85%
        if (newPercent < 20) newPercent = 20;
        if (newPercent > 85) newPercent = 85;
        setEditorWidthPercent(Math.round(newPercent));
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
      if (isDraggingSidebar) setIsDraggingSidebar(false);
    };

    if (isDragging || isDraggingSidebar) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isDraggingSidebar]);

  // Run Code
  const executeCode = useCallback(async () => {
    if (currentFiles.length === 0) {
      setIsOutputCollapsed(false);
      setActiveTab('console');
      setExecResult({
        stdout: null,
        stderr: 'No files in project. Please click + in the Explorer to create a file first.',
        compile_output: null,
        time: null,
        memory: null,
        status: { id: 6, description: 'No Files' },
      });
      return;
    }

    setIsRunning(true);
    setIsOutputCollapsed(false);

    // Live contents including any current in-progress typing in the editor
    const liveContents: Record<string, string> = { ...fileContents };
    if (editorRef.current && activeFileName) {
      liveContents[`${selectedLangId}:${activeFileName}`] = editorRef.current.getValue();
    }

    if (isWebMode) {
      // HTML/CSS/JS Live execution
      setActiveTab('preview');
      setWebLogs([]);

      const htmlFiles = currentFiles.filter(f => f.name.endsWith('.html'));
      const activeHtml = htmlFiles.find(f => f.name === activeFileName) || htmlFiles.find(f => f.name === 'index.html') || htmlFiles[0];
      const html = activeHtml ? (liveContents[`${selectedLangId}:${activeHtml.name}`] || '') : '';

      // Combine all CSS files in project
      const cssFiles = currentFiles.filter(f => f.name.endsWith('.css'));
      const combinedCss = cssFiles
        .map(f => `/* File: ${f.name} */\n${liveContents[`${selectedLangId}:${f.name}`] || ''}`)
        .join('\n\n');

      // Combine all JS files: helper files first, main/script.js last
      const jsFiles = currentFiles.filter(f => f.name.endsWith('.js'));
      const mainJs = jsFiles.find(f => f.name === 'script.js' || f.name === 'main.js') || jsFiles[jsFiles.length - 1];
      const otherJs = jsFiles.filter(f => f.name !== mainJs?.name);
      const combinedJs = [
        ...otherJs.map(f => `// File: ${f.name}\n${liveContents[`${selectedLangId}:${f.name}`] || ''}`),
        mainJs ? `// File: ${mainJs.name}\n${liveContents[`${selectedLangId}:${mainJs.name}`] || ''}` : ''
      ].filter(Boolean).join('\n\n');

      const combined = `
<!DOCTYPE html>
<html>
<head>
  <style>
    ${combinedCss}
  </style>
</head>
<body>
  ${html.replace(/<!DOCTYPE.*?>/i, '').replace(/<html.*?>/i, '').replace(/<\/html>/i, '').replace(/<head>[\s\S]*?<\/head>/i, '')}
  <script>
    // Intercept console.log
    (function(){
      const oldLog = console.log;
      const oldErr = console.error;
      console.log = function(...args) {
        window.parent.postMessage({ type: 'ONLINE_COMPILER_LOG', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
        oldLog.apply(console, args);
      };
      console.error = function(...args) {
        window.parent.postMessage({ type: 'ONLINE_COMPILER_ERR', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
        oldErr.apply(console, args);
      };
    })();
    try {
      ${combinedJs}
    } catch(err) {
      console.error(err.message);
    }
  </script>
</body>
</html>`;

      if (previewIframeRef.current) {
        previewIframeRef.current.srcdoc = combined;
      }

      setTimeout(() => {
        setIsRunning(false);
      }, 300);
      return;
    }

    // Standard backend execution via Judge0
    setActiveTab('console');
    setExecResult({
      stdout: null,
      stderr: null,
      compile_output: null,
      time: null,
      memory: null,
      status: { id: 1, description: 'Compiling & Running...' },
    });

    try {
      const submission = await prepareJudge0Submission(
        selectedLangId,
        currentLang.judge0Id || 50,
        activeFileName,
        currentFiles,
        liveContents
      );

      const payload: Record<string, any> = {
        language_id: submission.language_id,
        stdin: stdin || undefined,
      };
      if (submission.source_code) {
        payload.source_code = submission.source_code;
      }
      if (submission.additional_files) {
        payload.additional_files = submission.additional_files;
      }

      const res = await fetch('https://ce.judge0.com/submissions?wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Compiler server returned ${res.status}`);
      }

      const data = await res.json();
      setExecResult(data);
    } catch (err: any) {
      setExecResult({
        stdout: null,
        stderr: err?.message || 'Connection to execution sandbox failed.',
        compile_output: null,
        time: '0',
        memory: 0,
        status: { id: 13, description: 'Internal Error' },
      });
    } finally {
      setIsRunning(false);
    }
  }, [activeFileName, currentFiles, currentLang, fileContents, isWebMode, selectedLangId, stdin]);

  // Listen to iframe postMessages for Web console logs
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'ONLINE_COMPILER_LOG') {
        setWebLogs(prev => [...prev, e.data.text]);
      } else if (e.data && e.data.type === 'ONLINE_COMPILER_ERR') {
        setWebLogs(prev => [...prev, `[ERROR] ${e.data.text}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keyboard shortcut for Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeCode]);

  // AI Code Explainer simulation
  const handleRunAiAnalysis = () => {
    setActiveTab('ai');
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setAiAnalysis(
        `### 🤖 Code Analysis for ${currentLang.name} (${activeFileName})\n\n` +
          `* **Syntax & Correctness:** The active file compiles cleanly and follows standard conventions.\n` +
          `* **Complexity:** Time Complexity is **O(1)** for the basic entry point.\n` +
          `* **Best Practice Tip:** Keep functions modular and ensure user inputs are sanitized if reading from STDIN.\n` +
          `* **Suggested Next Step:** Add interactive loops or data structures to test computational benchmarks!`
      );
    }, 600);
  };

  // Reset to default
  const handleReset = () => {
    if (confirm(`Reset ${activeFileName} to default template?`)) {
      setFileContents(prev => ({
        ...prev,
        [activeKey]: activeFileDef.defaultContent,
      }));
    }
  };

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentContent).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  // Download code
  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl transition-all font-sans ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen bg-white dark:bg-[#1e1e1e]'
          : 'h-[760px] bg-white dark:bg-[#1e1e1e]'
      }`}
    >
      {/* ── 1. Top Online Compiler Header Bar ── */}
      <header className="h-14 px-4 bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between select-none z-30">
        {/* Left: Online Compiler Logo */}
        <div className="flex items-center gap-3">
          <a
            href="/tools/code-compiler/"
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <span className="font-mono text-xl font-extrabold">&lt;/&gt;</span>
            <span className="text-gray-900 dark:text-white font-semibold">Online Compiler</span>
          </a>
        </div>

        {/* Center: AI Pill + Language Selector Pill + Run Button + Options */}
        <div className="flex items-center gap-2.5">
          {/* AI Button */}
          <button
            onClick={handleRunAiAnalysis}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#10b981] hover:bg-[#059669] text-white shadow-sm transition-all active:scale-95"
            title="AI Code Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>AI</span>
          </button>

          {/* Language Selector Dropdown Pill */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <span>{currentLang.badge}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown Menu */}
            {languageMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white dark:bg-[#252526] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Language
                </div>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => handleSelectLanguage(lang.id)}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                      selectedLangId === lang.id
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2f2f30]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${lang.badgeBg} ${lang.badgeColor}`}>
                        {lang.badge}
                      </span>
                      <span>{lang.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{lang.version}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Run Button */}
          <button
            onClick={executeCode}
            disabled={isRunning}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md transition-all active:scale-95 ${
              isRunning
                ? 'bg-[#e11d48]/70 cursor-not-allowed animate-pulse'
                : 'bg-[#e11d48] hover:bg-[#be123c] shadow-rose-500/20'
            }`}
            title="Run Code (Ctrl + Enter)"
          >
            <span>Run</span>
            <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
          </button>

          {/* Options More Menu */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="More Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#252526] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    handleReset();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2f2f30] flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Template</span>
                </button>
                <button
                  onClick={() => {
                    handleCopyCode();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2f2f30] flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2f2f30] flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Editor Settings</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Theme Toggle, Save, Share, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Theme switch */}
          <button
            onClick={() => {
              if (toggleTheme) toggleTheme();
              else setIsDark(!isDark);
            }}
            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Save Button */}
          <button
            onClick={handleDownload}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Save / Download Code"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyCode}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Share / Copy Link"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Share'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── 2. Editor Settings Sub-bar (if open) ── */}
      {showSettings && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-[#252526] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-blue-500" />
              Settings:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Font:</span>
              <select
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="bg-white dark:bg-[#18181b] border border-gray-300 dark:border-gray-700 rounded px-2 py-0.5 text-xs text-gray-800 dark:text-gray-200"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
            </div>
            <label className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showMinimap}
                onChange={e => setShowMinimap(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span>Minimap</span>
            </label>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 3. Main Split View: Activity Bar + Explorer + [Editor | Result Pane] ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar (Far Left Slim Strip) */}
        <div className="w-11 flex-shrink-0 bg-[#fafafa] dark:bg-[#18181b] border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-2.5 select-none">
          {/* File Explorer Tab */}
          <button
            onClick={() => {
              if (sidebarOpen && sidebarTab === 'files') {
                setSidebarOpen(false);
              } else {
                setSidebarOpen(true);
                setSidebarTab('files');
              }
            }}
            className={`p-2 rounded-lg mb-2 transition-all relative ${
              sidebarOpen && sidebarTab === 'files'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-bold'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Explorer (Files)"
          >
            <Folder className="w-4 h-4" />
            {sidebarOpen && sidebarTab === 'files' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />
            )}
          </button>

          {/* Project Search Tab */}
          <button
            onClick={() => {
              if (sidebarOpen && sidebarTab === 'search') {
                setSidebarOpen(false);
              } else {
                setSidebarOpen(true);
                setSidebarTab('search');
                setTimeout(() => {
                  codeSearchInputRef.current?.focus();
                  codeSearchInputRef.current?.select();
                }, 50);
              }
            }}
            className={`p-2 rounded-lg mb-2 transition-all relative ${
              sidebarOpen && sidebarTab === 'search'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-bold'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Search in Files (Ctrl+Shift+F)"
          >
            <Search className="w-4 h-4" />
            {globalSearchResults.totalMatches > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1 py-0.2 rounded-full min-w-[14px] text-center">
                {globalSearchResults.totalMatches > 99 ? '99+' : globalSearchResults.totalMatches}
              </span>
            )}
            {sidebarOpen && sidebarTab === 'search' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r" />
            )}
          </button>

          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Sidebar: File Explorer OR Global Search */}
        {sidebarOpen && (
          <div
            ref={sidebarRef}
            style={{ width: `${sidebarWidth}px` }}
            className="flex-shrink-0 bg-[#f8fafc] dark:bg-[#202023] border-r border-gray-200 dark:border-gray-800 flex flex-col select-none text-xs overflow-hidden"
          >
            {sidebarTab === 'files' ? (
              <>
                {/* Explorer Header */}
                <div className="px-3 py-2.5 font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase text-[10px] flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                  <span className="truncate">EXPLORER</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExplorerSearchOpen(!isExplorerSearchOpen);
                        if (!isExplorerSearchOpen) {
                          setTimeout(() => fileSearchInputRef.current?.focus(), 50);
                        } else {
                          setFileFilterQuery('');
                        }
                      }}
                      className={`p-1 transition-colors rounded ${
                        isExplorerSearchOpen || fileFilterQuery
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40'
                          : 'text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      title="Filter files by name"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleStartNewFile}
                      className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="New File"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline File Filter Bar */}
                {isExplorerSearchOpen && (
                  <div className="p-1.5 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#18181b]/70">
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 pointer-events-none" />
                      <input
                        ref={fileSearchInputRef}
                        type="text"
                        placeholder="Filter files..."
                        value={fileFilterQuery}
                        onChange={e => setFileFilterQuery(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Escape') {
                            if (fileFilterQuery) setFileFilterQuery('');
                            else setIsExplorerSearchOpen(false);
                          }
                        }}
                        className="w-full pl-7 pr-6 py-1 bg-gray-50 dark:bg-[#252526] border border-gray-300 dark:border-gray-700 rounded text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                      />
                      {fileFilterQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setFileFilterQuery('');
                            fileSearchInputRef.current?.focus();
                          }}
                          className="absolute right-1.5 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          title="Clear filter"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {fileFilterQuery && (
                      <div className="text-[10px] text-gray-400 px-1 pt-1 flex justify-between">
                        <span>
                          {filteredFiles.length} of {currentFiles.length} file{currentFiles.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Project Files */}
                <div className="p-1 space-y-0.5 overflow-y-auto flex-1">
                  {filteredFiles.map(f => {
                    const isActive = activeFileName === f.name;
                    const isRenaming = renamingFileName === f.name;

                    if (isRenaming) {
                      return (
                        <div
                          key={f.name}
                          className="relative px-2 py-1 flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-950/40 rounded-md border border-blue-500 shadow-sm my-0.5"
                        >
                          <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-bold ${currentLang.badgeBg} ${currentLang.badgeColor}`}>
                            {currentLang.badge[0]}
                          </span>
                          <input
                            ref={renameInputRef}
                            type="text"
                            value={renameInputValue}
                            onChange={e => handleRenameChange(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSubmitRename();
                              if (e.key === 'Escape') handleCancelRename();
                            }}
                            onBlur={handleBlurRename}
                            className={`flex-1 min-w-0 bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 text-xs px-1.5 py-0.5 rounded border focus:outline-none font-mono ${
                              renameError ? 'border-red-500 ring-1 ring-red-500' : 'border-blue-400'
                            }`}
                          />
                          {renameError && (
                            <div className="absolute left-0 top-full mt-1.5 z-50 px-2.5 py-1.5 rounded bg-[#ffebe8] dark:bg-[#5a1d1d] text-[#c72e2e] dark:text-[#f48771] border border-[#f1a89b] dark:border-[#be1100] text-[11px] shadow-lg max-w-xs flex items-start gap-1.5 animate-in fade-in duration-100">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              <span>{renameError}</span>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={f.name}
                        tabIndex={0}
                        onClick={() => handleOpenFile(f.name)}
                        onContextMenu={e => handleFileContextMenu(e, f.name)}
                        onKeyDown={e => {
                          if (e.key === 'F2') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleStartRename(f.name);
                          } else if (e.key === 'Delete') {
                            e.preventDefault();
                            e.stopPropagation();
                            requestDeleteFile(f.name);
                          } else if (e.key === 'Enter') {
                            handleOpenFile(f.name);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-mono text-xs group outline-none cursor-pointer focus:ring-1 focus:ring-blue-500/50 select-none ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800'
                        }`}
                        title="Click to open, F2 to rename, Delete to remove, or right-click"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${currentLang.badgeBg} ${currentLang.badgeColor}`}>
                            {currentLang.badge[0]}
                          </span>
                          <span className="truncate">{highlightMatch(f.name, fileFilterQuery)}</span>
                        </div>

                        {/* Quick Action Icons on Hover (VS Code style) */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity flex-shrink-0">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleStartRename(f.name);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-300/60 dark:hover:bg-gray-700 transition-colors"
                            title="Rename (F2)"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              requestDeleteFile(f.name);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-300/60 dark:hover:bg-gray-700 transition-colors"
                            title="Delete (Delete)"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredFiles.length === 0 && fileFilterQuery && (
                    <div className="p-4 text-center text-xs text-gray-400 font-sans">
                      <p>No files matching "{fileFilterQuery}"</p>
                      <button
                        type="button"
                        onClick={() => setFileFilterQuery('')}
                        className="mt-2 text-blue-500 hover:underline"
                      >
                        Clear filter
                      </button>
                    </div>
                  )}

                  {currentFiles.length === 0 && !isCreatingFile && (
                    <div className="p-4 text-center text-xs text-gray-400 font-sans">
                      <p>No files in project</p>
                      <button
                        type="button"
                        onClick={handleStartNewFile}
                        className="mt-2 text-blue-500 hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add file</span>
                      </button>
                    </div>
                  )}

                  {/* Inline New File row */}
                  {isCreatingFile && (
                    <div className="relative px-2 py-1 flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-950/40 rounded-md border border-blue-500 shadow-sm my-0.5">
                      <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-bold ${currentLang.badgeBg} ${currentLang.badgeColor}`}>
                        +
                      </span>
                      <input
                        ref={newFileInputRef}
                        type="text"
                        placeholder="filename.ext"
                        value={newFileInputValue}
                        onChange={e => handleNewFileChange(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSubmitNewFile();
                          if (e.key === 'Escape') handleCancelNewFile();
                        }}
                        onBlur={handleSubmitNewFile}
                        className={`flex-1 min-w-0 bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 text-xs px-1.5 py-0.5 rounded border focus:outline-none font-mono ${
                          newFileError ? 'border-red-500 ring-1 ring-red-500' : 'border-blue-400'
                        }`}
                      />
                      {newFileError && (
                        <div className="absolute left-0 top-full mt-1.5 z-50 px-2.5 py-1.5 rounded bg-[#ffebe8] dark:bg-[#5a1d1d] text-[#c72e2e] dark:text-[#f48771] border border-[#f1a89b] dark:border-[#be1100] text-[11px] shadow-lg max-w-xs flex items-start gap-1.5 animate-in fade-in duration-100">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>{newFileError}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Global Search Panel (VS Code style) */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Header */}
                <div className="px-3 py-2.5 font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase text-[10px] flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                  <span className="truncate">SEARCH</span>
                  {codeSearchQuery && (
                    <span className="text-[10px] lowercase font-normal text-gray-400 truncate">
                      {globalSearchResults.totalMatches} match{globalSearchResults.totalMatches === 1 ? '' : 'es'}
                    </span>
                  )}
                </div>

                {/* Search Input Box with Match Case & Whole Word modifiers */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-800 space-y-1.5 bg-white/40 dark:bg-[#18181b]/40">
                  <div className="relative flex items-center">
                    <input
                      ref={codeSearchInputRef}
                      type="text"
                      placeholder="Search in files..."
                      value={codeSearchQuery}
                      onChange={e => setCodeSearchQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Escape') {
                          setCodeSearchQuery('');
                        }
                      }}
                      className="w-full pl-2 pr-16 py-1 bg-white dark:bg-[#252526] border border-gray-300 dark:border-gray-700 rounded text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 font-mono placeholder-gray-400"
                    />
                    <div className="absolute right-1 flex items-center gap-0.5">
                      {/* Match Case Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsCaseSensitive(!isCaseSensitive)}
                        className={`px-1 py-0.5 text-[10px] rounded font-bold transition-colors ${
                          isCaseSensitive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        title="Match Case (Aa)"
                      >
                        Aa
                      </button>
                      {/* Match Whole Word Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsWholeWord(!isWholeWord)}
                        className={`px-1 py-0.5 text-[10px] rounded font-mono font-bold transition-colors ${
                          isWholeWord
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        title="Match Whole Word (\b)"
                      >
                        \b
                      </button>
                      {codeSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCodeSearchQuery('')}
                          className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          title="Clear search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Search Results Area */}
                <div className="flex-1 overflow-y-auto p-1 font-mono text-xs">
                  {!codeSearchQuery.trim() ? (
                    <div className="p-4 text-center text-xs text-gray-400 font-sans">
                      <Search className="w-6 h-6 mx-auto mb-2 opacity-40" />
                      <p>Type to search across all files</p>
                      <p className="text-[10px] mt-1 text-gray-500">Shortcut: Ctrl+Shift+F</p>
                    </div>
                  ) : globalSearchResults.groups.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400 font-sans">
                      <p>No results found for "{codeSearchQuery}"</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {globalSearchResults.groups.map(group => {
                        const isCollapsed = Boolean(collapsedSearchFiles[group.file]);
                        return (
                          <div
                            key={group.file}
                            className="rounded border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
                          >
                            {/* File Group Header */}
                            <div
                              onClick={() =>
                                setCollapsedSearchFiles(prev => ({
                                  ...prev,
                                  [group.file]: !prev[group.file],
                                }))
                              }
                              className="flex items-center justify-between px-2 py-1.5 rounded cursor-pointer hover:bg-gray-200/60 dark:hover:bg-gray-800 select-none group"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <ChevronRight
                                  className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                                    isCollapsed ? '' : 'rotate-90'
                                  }`}
                                />
                                <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${currentLang.badgeBg} ${currentLang.badgeColor}`}>
                                  {currentLang.badge[0]}
                                </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate text-[11px]">
                                  {group.file}
                                </span>
                              </div>
                              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                                {group.matches.length}
                              </span>
                            </div>

                            {/* Matching lines inside this file */}
                            {!isCollapsed && (
                              <div className="pl-4 pr-1 py-0.5 space-y-0.5 border-l border-gray-200 dark:border-gray-800 ml-3 my-0.5">
                                {group.matches.map((m, mIdx) => {
                                  const before = m.lineText.substring(0, m.matchIndex);
                                  const matchStr = m.lineText.substring(m.matchIndex, m.matchIndex + m.matchLength);
                                  const after = m.lineText.substring(m.matchIndex + m.matchLength);

                                  return (
                                    <div
                                      key={mIdx}
                                      onClick={() => handleSelectSearchResult(group.file, m.line, m.col)}
                                      className="px-2 py-1 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/40 text-gray-700 dark:text-gray-300 flex items-baseline gap-2 text-[11px] truncate transition-colors"
                                      title={`Line ${m.line}: ${m.lineText.trim()}`}
                                    >
                                      <span className="text-[10px] text-gray-400 select-none font-semibold flex-shrink-0 min-w-[20px] text-right">
                                        {m.line}:
                                      </span>
                                      <span className="truncate flex-1">
                                        {before}
                                        <span className="bg-yellow-200 dark:bg-yellow-700/80 text-yellow-900 dark:text-yellow-100 font-bold px-0.5 rounded">
                                          {matchStr}
                                        </span>
                                        {after}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── DRAGGABLE SIDEBAR DIVIDER ── */}
        {sidebarOpen && (
          <div
            onMouseDown={handleSidebarMouseDown}
            onDoubleClick={() => setSidebarWidth(180)}
            title="Drag horizontally to resize Explorer / Double-click to reset (180px)"
            className={`w-2 relative z-30 cursor-col-resize select-none flex items-center justify-center transition-colors group flex-shrink-0 ${
              isDraggingSidebar
                ? 'bg-blue-600'
                : 'bg-gray-200 hover:bg-blue-500/50 dark:bg-gray-800 dark:hover:bg-blue-600/50'
            }`}
          >
            <div
              className={`w-0.5 h-8 rounded-full transition-colors ${
                isDraggingSidebar
                  ? 'bg-white'
                  : 'bg-gray-400 group-hover:bg-blue-600 dark:bg-gray-600 dark:group-hover:bg-white'
              }`}
            />
          </div>
        )}

        {/* ── Editor & Result Split Container ── */}
        <div ref={splitContainerRef} className="flex-1 flex flex-col md:flex-row min-w-0 relative">
          {/* ── LEFT PANE: CODE EDITOR ── */}
          <div
            style={{ width: isOutputCollapsed ? '100%' : `${editorWidthPercent}%` }}
            className={`flex flex-col min-w-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] ${
              isOutputCollapsed ? 'w-full' : 'w-full md:w-auto'
            }`}
          >
            {/* Editor File Tabs */}
            <div className="flex items-center bg-gray-50 dark:bg-[#252526] border-b border-gray-200 dark:border-gray-800 select-none overflow-x-auto no-scrollbar">
              {currentOpenTabs.map(tabFileName => {
                const f = currentFiles.find(file => file.name === tabFileName);
                if (!f) return null;
                const isActive = activeFileName === f.name;
                return (
                  <div
                    key={f.name}
                    onClick={() => setActiveFileName(f.name)}
                    onContextMenu={e => handleFileContextMenu(e, f.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono cursor-pointer border-r border-gray-200 dark:border-gray-800 transition-colors group ${
                      isActive
                        ? 'bg-white dark:bg-[#1e1e1e] text-blue-600 dark:text-blue-400 font-semibold border-t-2 border-t-blue-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]'
                    }`}
                    title={f.name}
                  >
                    <span className={`w-3 h-3 rounded-sm flex items-center justify-center text-[8px] font-bold ${currentLang.badgeBg} ${currentLang.badgeColor}`}>
                      {currentLang.badge[0]}
                    </span>
                    <span>{f.name}</span>
                    <button
                      type="button"
                      onClick={e => handleCloseTab(f.name, e)}
                      className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-[11px] ml-1 p-0.5 rounded transition-colors"
                      title="Close tab"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              <button
                onClick={handleStartNewFile}
                className="px-2.5 py-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                title="Add File"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Quick Width Presets / Collapse Buttons in Tab Bar */}
              <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 select-none">
                <button
                  onClick={() => {
                    setIsOutputCollapsed(false);
                    setEditorWidthPercent(50);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    !isOutputCollapsed && editorWidthPercent === 50
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                  title="50% Code / 50% Output"
                >
                  50:50
                </button>
                <button
                  onClick={() => {
                    setIsOutputCollapsed(false);
                    setEditorWidthPercent(70);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    !isOutputCollapsed && editorWidthPercent === 70
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                  title="70% Code (Wide Editor)"
                >
                  70:30
                </button>
                <button
                  onClick={() => setIsOutputCollapsed(!isOutputCollapsed)}
                  className={`p-1 rounded text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${
                    isOutputCollapsed ? 'bg-blue-600 text-white' : ''
                  }`}
                  title={isOutputCollapsed ? 'Show Output Pane' : 'Maximize Code Area (100% Width)'}
                >
                  {isOutputCollapsed ? <PanelRightOpen className="w-3.5 h-3.5" /> : <PanelRightClose className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 relative overflow-hidden">
              {currentFiles.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 select-none">
                  <Code2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No open files</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4 text-center">
                    All files were deleted. Create a new file to start coding.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartNewFile}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New File</span>
                  </button>
                </div>
              ) : mounted ? (
                <Editor
                  height="100%"
                  language={activeFileDef?.lang || currentLang.monacoLang}
                  theme={isDark ? 'vs-dark' : 'light'}
                  value={currentContent}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize,
                    minimap: { enabled: showMinimap },
                    lineNumbers: 'on',
                    bracketPairColorization: { enabled: true },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    fontFamily: 'Consolas, "Fira Code", "Courier New", monospace',
                    wordWrap: 'on',
                    quickSuggestions: {
                      other: true,
                      comments: false,
                      strings: true,
                    },
                    suggestOnTriggerCharacters: true,
                    parameterHints: { enabled: true },
                    suggest: {
                      showFunctions: true,
                      showClasses: true,
                      showVariables: true,
                      showConstants: true,
                      showModules: true,
                      preview: true,
                      filterGraceful: true,
                    },
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono text-xs">
                  Loading Online Compiler Editor...
                </div>
              )}
            </div>
          </div>

          {/* ── DRAGGABLE DIVIDER (Resizer Handle) ── */}
          {!isOutputCollapsed && (
            <div
              onMouseDown={handleMouseDown}
              onDoubleClick={() => setEditorWidthPercent(55)}
              title="Drag horizontally to resize code area / Double-click to reset (55%)"
              className={`hidden md:flex w-2 relative z-30 cursor-col-resize select-none items-center justify-center transition-colors group ${
                isDragging
                  ? 'bg-blue-600'
                  : 'bg-gray-100 hover:bg-blue-500/40 dark:bg-[#252526] dark:hover:bg-blue-600/50'
              }`}
            >
              <div
                className={`w-0.5 h-8 rounded-full transition-colors ${
                  isDragging
                    ? 'bg-white'
                    : 'bg-gray-400 group-hover:bg-blue-600 dark:bg-gray-600 dark:group-hover:bg-white'
                }`}
              />
            </div>
          )}

          {/* ── RIGHT PANE: RESULT / CONSOLE / PREVIEW (Side by Side) ── */}
          {!isOutputCollapsed && (
            <div
              style={{ width: `${100 - editorWidthPercent}%` }}
              className="w-full md:w-auto flex flex-col bg-white dark:bg-[#18181b] min-w-0"
            >
            {/* Header Tabs: Console / I/O / AI Agent (or Preview in HTML mode) */}
            <div className="flex items-center justify-between px-3 bg-gray-50 dark:bg-[#252526] border-b border-gray-200 dark:border-gray-800 select-none h-10 text-xs">
              <div className="flex items-center gap-1">
                {isWebMode && (
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Result</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('console')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTab === 'console'
                      ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Console</span>
                </button>

                {!isWebMode && (
                  <button
                    onClick={() => setActiveTab('io')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'io'
                        ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>I/O</span>
                    {stdin.trim() && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTab === 'ai'
                      ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>AI Agent</span>
                </button>
              </div>

              {/* Panel Actions */}
              <div className="flex items-center gap-1 text-gray-500">
                {activeTab === 'preview' && (
                  <button
                    onClick={executeCode}
                    className="p-1 hover:text-gray-800 dark:hover:text-white"
                    title="Refresh Preview"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                {activeTab === 'console' && (
                  <>
                    <button
                      onClick={() => {
                        const out = execResult?.stdout || execResult?.stderr || 'No output';
                        navigator.clipboard.writeText(out);
                        setCopiedOutput(true);
                        setTimeout(() => setCopiedOutput(false), 2000);
                      }}
                      className="p-1 hover:text-gray-800 dark:hover:text-white"
                      title="Copy Output"
                    >
                      {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        setExecResult(null);
                        setWebLogs([]);
                      }}
                      className="p-1 hover:text-gray-800 dark:hover:text-white"
                      title="Clear Console"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {/* Collapse Output Pane button */}
                <button
                  onClick={() => setIsOutputCollapsed(true)}
                  className="p-1 hover:text-gray-800 dark:hover:text-white rounded ml-1"
                  title="Collapse Output (Maximize Code Area)"
                >
                  <PanelRightClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Pane Body */}
            <div className="flex-1 overflow-auto relative">
              {/* ── 1. PREVIEW TAB (For HTML mode) ── */}
              {isWebMode && (
                <div className={`w-full h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
                  <iframe
                    ref={previewIframeRef}
                    title="Live Web Preview"
                    sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                    className={`w-full h-full border-0 bg-white ${isDragging ? 'pointer-events-none' : ''}`}
                  />
                </div>
              )}

              {/* ── 2. CONSOLE TAB ── */}
              {activeTab === 'console' && (
                <div className="p-4 h-full flex flex-col font-mono text-xs">
                  {isRunning ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                      <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Compiling & executing...</span>
                    </div>
                  ) : !execResult && webLogs.length === 0 ? (
                    /* Live Console idle placeholder */
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none">
                      <div className="text-3xl font-mono text-gray-300 dark:text-gray-600 mb-2">&gt;_</div>
                      <div className="font-semibold text-gray-600 dark:text-gray-300 text-sm">Live Console</div>
                      <div className="text-xs text-gray-400 mt-1">Click Run to start</div>
                    </div>
                  ) : (
                    <div className="flex-1 whitespace-pre-wrap leading-relaxed">
                      {/* Web logs if in HTML mode */}
                      {isWebMode && webLogs.length > 0 && (
                        <div className="space-y-1">
                          {webLogs.map((log, idx) => (
                            <div
                              key={idx}
                              className={log.startsWith('[ERROR]') ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}
                            >
                              {log}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Execution stats banner */}
                      {execResult && (
                        <div className="mb-3 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                          <span className="text-emerald-500 font-bold">$ exit code: {execResult.status?.id === 3 ? 0 : execResult.status?.description}</span>
                          {execResult.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-400" />
                              {execResult.time}s
                            </span>
                          )}
                        </div>
                      )}

                      {/* Standard Output */}
                      {execResult?.stdout && (
                        <div className="text-gray-900 dark:text-gray-100">{execResult.stdout}</div>
                      )}

                      {/* Compiler / Stderr errors */}
                      {execResult?.compile_output && (
                        <div className="text-amber-500 mt-2">{execResult.compile_output}</div>
                      )}
                      {execResult?.stderr && (
                        <div className="text-red-500 mt-2">{execResult.stderr}</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── 3. I/O (STDIN) TAB ── */}
              {activeTab === 'io' && (
                <div className="p-4 h-full flex flex-col text-xs font-mono">
                  <div className="text-gray-500 dark:text-gray-400 text-xs mb-2 flex items-center justify-between">
                    <span>Standard Input (passed to program):</span>
                    <button onClick={() => setStdin('')} className="text-red-500 hover:underline text-[11px]">
                      Clear
                    </button>
                  </div>
                  <textarea
                    value={stdin}
                    onChange={e => setStdin(e.target.value)}
                    placeholder="Enter standard input here before clicking Run..."
                    className="flex-1 w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#18181b] text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none font-mono text-xs"
                  />
                </div>
              )}

              {/* ── 4. AI AGENT TAB ── */}
              {activeTab === 'ai' && (
                <div className="p-4 h-full flex flex-col text-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      AI Code Explainer & Review
                    </span>
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={isAiLoading}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                    >
                      {isAiLoading ? 'Analyzing...' : 'Re-analyze'}
                    </button>
                  </div>

                  {isAiLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Inspecting code and logic...</span>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {aiAnalysis}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center px-4">
                      <Sparkles className="w-8 h-8 text-emerald-500/40 mb-2" />
                      <p className="font-medium">Need help debugging or explaining your code?</p>
                      <p className="text-gray-400 text-[11px] mt-1">Click "AI" or "Re-analyze" to inspect your current program.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating "Show Output" button when output is collapsed */}
        {isOutputCollapsed && (
          <button
            onClick={() => setIsOutputCollapsed(false)}
            className="absolute right-3 bottom-10 z-40 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-xl flex items-center gap-1.5 transition-all"
            title="Show Console / Output"
          >
            <PanelRightOpen className="w-4 h-4" />
            <span>Show Output</span>
          </button>
        )}
      </div>
    </div>

      {/* ── VS Code Context Menu (Right Click on File in Explorer or Tab) ── */}
      {contextMenu && contextMenu.visible && (
        <div
          ref={contextMenuRef}
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          className="fixed z-[999] w-48 bg-white dark:bg-[#252526] rounded-md shadow-2xl border border-gray-200 dark:border-[#454545] py-1 text-xs font-sans select-none animate-in fade-in duration-75"
        >
          <div className="px-3 py-1 text-[10px] font-mono text-gray-400 dark:text-gray-400 truncate border-b border-gray-100 dark:border-[#333333] mb-1">
            {contextMenu.fileName}
          </div>

          {/* Close Tab (if file is currently open in tabs) */}
          {currentOpenTabs.includes(contextMenu.fileName) && (
            <>
              <button
                type="button"
                onMouseDown={e => e.stopPropagation()}
                onClick={e => {
                  e.stopPropagation();
                  handleCloseTab(contextMenu.fileName);
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 flex items-center justify-between text-gray-700 dark:text-[#cccccc] hover:bg-blue-600 dark:hover:bg-[#04395e] hover:text-white dark:hover:text-white transition-colors group cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2">
                  <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                  <span>Close Tab</span>
                </div>
                <span className="text-[10px] text-gray-400 group-hover:text-gray-200 font-mono">✕</span>
              </button>
              <div className="my-1 border-t border-gray-100 dark:border-[#333333]" />
            </>
          )}

          {/* 1. Rename */}
          <button
            type="button"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation();
              handleStartRename(contextMenu.fileName);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center justify-between text-gray-700 dark:text-[#cccccc] hover:bg-blue-600 dark:hover:bg-[#04395e] hover:text-white dark:hover:text-white transition-colors group cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2">
              <Pencil className="w-3.5 h-3.5 text-blue-500 group-hover:text-white" />
              <span>Rename</span>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-gray-200 font-mono">F2</span>
          </button>

          <div className="my-1 border-t border-gray-100 dark:border-[#333333]" />

          {/* 2. Delete */}
          <button
            type="button"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation();
              requestDeleteFile(contextMenu.fileName);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center justify-between text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 dark:hover:text-white transition-colors group cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:text-white" />
              <span>Delete</span>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-gray-200 font-mono">Delete</span>
          </button>
        </div>
      )}

      {/* ── VS Code Styled Delete Confirmation Dialog ── */}
      {deleteModal && deleteModal.open && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
          onClick={() => setDeleteModal(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-[#252526] rounded-xl shadow-2xl border border-gray-200 dark:border-[#454545] p-5 text-gray-800 dark:text-gray-200 animate-in zoom-in-95 duration-100"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-3.5 mb-4">
              <div className="p-2 rounded-full flex-shrink-0 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  Delete File
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Are you sure you want to delete{' '}
                  <span className="font-mono font-bold text-gray-900 dark:text-white">
                    &apos;{deleteModal.fileName}&apos;
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                autoFocus
                type="button"
                onClick={() => confirmDelete(deleteModal.fileName)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Bottom Status Bar ── */}
      <footer className="h-6 px-3 bg-gray-50 dark:bg-[#18181b] border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 select-none font-mono">
        {/* Left indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Ready</span>
          </div>
          <div className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">
            <span>&gt;_ Terminal</span>
          </div>
        </div>

        {/* Right indicators */}
        <div className="flex items-center gap-4 text-[10px]">
          <span className="hidden sm:inline">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="capitalize">{isDark ? 'Dark' : 'Light'}</span>
          <span className="hidden sm:inline hover:underline cursor-pointer">Wiki</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Internet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
