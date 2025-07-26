const https = require('https');

const registries = [
    { name: 'npmjs', url: 'https://registry.npmjs.org' },
    { name: 'npmmirror (taobao)', url: 'https://registry.npmmirror.com' },
    { name: 'nodex.ir', url: 'https://npm.nodex.ir' },
    { name: 'China Alibaba Registery', url: 'https://registry.npmmirror.com/' }
];

const testPackage = 'lodash';

function fetchVersion(registryUrl) {
    return new Promise((resolve) => {
        const start = Date.now();
        const req = https.get(`${registryUrl}/${testPackage}`, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    const latest = json['dist-tags']?.latest;
                    const duration = Date.now() - start;
                    resolve({ latest, duration });
                } catch (err) {
                    resolve({ error: true, duration: Date.now() - start });
                }
            });
        });

        req.on('error', () => resolve({ error: true, duration: Date.now() - start }));
        req.setTimeout(3000, () => {
            req.destroy();
            resolve({ error: true, duration: 3000 });
        });
    });
}

(async () => {
    console.log(`\n🔍 Testing NPM Registries for package: ${testPackage}\n`);

    for (const registry of registries) {
        process.stdout.write(`⏱️  ${registry.name.padEnd(20)} -> `);
        const result = await fetchVersion(registry.url);
        if (result.error) {
            console.log(`❌ Failed (timeout or invalid response)`);
        } else {
            console.log(`✅ ${result.latest} (${result.duration} ms)`);
        }
    }

    console.log(`\n✅ Done.\n`);
})();
