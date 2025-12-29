const https = require('https');

const registries = [
    { name: 'npmjs', url: 'https://registry.npmjs.org' },
    { name: 'npmmirror (taobao)', url: 'https://registry.npmmirror.com' },
    { name: 'nodex.ir', url: 'https://npm.nodex.ir' },
    { name: 'China Alibaba Registry', url: 'https://registry.npmmirror.com' }
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
                    resolve({
                        success: true,
                        latest: json['dist-tags']?.latest ?? null,
                        time: Date.now() - start
                    });
                } catch {
                    resolve({ success: false, time: Date.now() - start });
                }
            });
        });

        req.on('error', () =>
            resolve({ success: false, time: Date.now() - start })
        );

        req.setTimeout(3000, () => {
            req.destroy();
            resolve({ success: false, time: 3000 });
        });
    });
}

module.exports = async function runNpmCheck() {
    const results = [];

    for (const reg of registries) {
        const r = await fetchVersion(reg.url);
        results.push({
            name: reg.name,
            url: reg.url,
            ...r
        });
    }

    return results;
};
