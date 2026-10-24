import assert from 'node:assert/strict';
import test from 'node:test';

async function resolveAppUrl(explicit, deploymentHost) {
    const saved = {
        explicit: process.env.NEXT_PUBLIC_APP_URL,
        host: process.env.VERCEL_URL,
    };
    try {
        if (explicit === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
        else process.env.NEXT_PUBLIC_APP_URL = explicit;
        if (deploymentHost === undefined) delete process.env.VERCEL_URL;
        else process.env.VERCEL_URL = deploymentHost;
        const { default: config } = await import(
            `../next.config.mjs?case=${encodeURIComponent(JSON.stringify([explicit, deploymentHost]))}`
        );
        return config.env.NEXT_PUBLIC_APP_URL;
    } finally {
        if (saved.explicit === undefined)
            delete process.env.NEXT_PUBLIC_APP_URL;
        else process.env.NEXT_PUBLIC_APP_URL = saved.explicit;
        if (saved.host === undefined) delete process.env.VERCEL_URL;
        else process.env.VERCEL_URL = saved.host;
    }
}

test('an explicit public URL takes priority over the deployment hostname', async () => {
    assert.equal(
        await resolveAppUrl('https://quiz.example.test', 'preview.vercel.app'),
        'https://quiz.example.test',
    );
});

test('a Vercel preview supplies its own public URL', async () => {
    assert.equal(
        await resolveAppUrl(undefined, 'preview.vercel.app'),
        'https://preview.vercel.app',
    );
});

test('missing deployment configuration stays missing for environment validation', async () => {
    assert.equal(await resolveAppUrl(undefined, undefined), undefined);
});
