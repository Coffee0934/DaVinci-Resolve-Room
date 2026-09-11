// 공개할 파일만 dist 폴더에 모읍니다. 원본 HTML/CSS는 기존 위치에서 수정하세요.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const project = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(project, 'dist');
const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'resolve-room-public-'));

try {
  // 파일이나 페이지를 추가했다면 이 목록에 넣으세요.
  for (const entry of ['index.html', 'styles.css', 'script.js', 'tips', 'images']) {
    fs.cpSync(path.join(project, entry), path.join(staging, entry), {
      recursive: true,
      filter: (source) => {
        if (fs.lstatSync(source).isSymbolicLink()) throw new Error('Symbolic links are not published.');
        return !path.basename(source).startsWith('.');
      },
    });
  }

  // 다운로드용 ZIP을 만듭니다. 제작자 안내 파일도 함께 포함됩니다.
  fs.mkdirSync(path.join(staging, 'plugins'));
  execFileSync('zip', [
    '-q', '-r', path.join(staging, 'plugins/ek100-plus.zip'), 'ek100+',
    '-x', '*/.DS_Store', '*/__MACOSX/*', '*/._*',
  ], { cwd: path.join(project, 'plugins') });

  // dist는 이 스크립트가 만드는 공개용 복사본이며, 원본은 변경하지 않습니다.
  if (fs.existsSync(output)) {
    if (!fs.lstatSync(output).isDirectory() || fs.lstatSync(output).isSymbolicLink()) {
      throw new Error('dist must be a regular directory.');
    }
    fs.rmSync(output, { recursive: true });
  }
  fs.cpSync(staging, output, { recursive: true });
  console.log('Public files prepared in dist.');
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
