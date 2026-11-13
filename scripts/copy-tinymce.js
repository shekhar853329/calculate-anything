import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.resolve('node_modules/tinymce');
const destDir = path.resolve('public/tinymce');

if (fs.existsSync(srcDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(path.join(srcDir, 'tinymce.min.js'), path.join(destDir, 'tinymce.min.js'));
  for (const folder of ['skins', 'themes', 'icons', 'models', 'plugins']) {
    const srcFolder = path.join(srcDir, folder);
    const destFolder = path.join(destDir, folder);
    if (fs.existsSync(srcFolder)) {
      fs.cpSync(srcFolder, destFolder, { recursive: true, force: true });
    }
  }
  console.log('TinyMCE assets successfully copied to public/tinymce');
}

