import { mkdir, copyFile } from 'node:fs/promises';

await mkdir('assets/vendor', { recursive: true });
await copyFile('node_modules/@carbon/styles/css/styles.min.css', 'assets/vendor/carbon.min.css');
