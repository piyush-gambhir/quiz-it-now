import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Verify the deployed file list, not the local node_modules that masks omissions.
for (const route of ['quiz/generate', 'quiz/generate/ai']) {
    const trace = JSON.parse(
        readFileSync(`.next/server/app/api/${route}/route.js.nft.json`, 'utf8'),
    );
    assert(
        trace.files.some((file) => file.includes('/@napi-rs/canvas/index.js')),
        `${route}: missing canvas loader`,
    );
    assert(
        trace.files.some(
            (file) => file.includes('canvas-') && file.endsWith('.node'),
        ),
        `${route}: missing native canvas binary`,
    );
    assert(
        trace.files.some((file) => file.endsWith('/pdf.worker.mjs')),
        `${route}: missing PDF worker`,
    );
}
console.log(
    'Both PDF route traces include the loader, native canvas, and worker.',
);
