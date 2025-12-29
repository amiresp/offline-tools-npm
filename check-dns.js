const dns = require('dns');
const { performance } = require('perf_hooks');

let chalk;
const testDomains = [
    'google.com',
    'youtube.com',
    'github.com',
    'npmjs.com',
    'microsoft.com',
];


const dnsServers = [
    { name: 'Cloudflare', ip: '1.1.1.1' },
    { name: 'Cloudflare IPv6', ip: '2606:4700:4700::1111' },
    { name: 'Google', ip: '8.8.8.8' },
    { name: 'Google IPv6', ip: '2001:4860:4860::8888' },
    { name: 'Quad9', ip: '9.9.9.9' },
    { name: 'OpenDNS', ip: '208.67.222.222' },
    { name: 'AdGuard DNS', ip: '94.140.14.14' },
    { name: 'Shecan (IR)', ip: '178.22.122.100' },
    { name: 'Shecan 2 (IR)', ip: '185.51.200.2' },
    { name: 'Electro 1', ip: '78.157.42.100' },
    { name: 'Electro 2', ip: '78.157.42.101' },

    { name: 'Radar Game (IR)', ip: '10.202.10.10' },
    { name: 'Radar Game (IR)', ip: '10.202.10.11' },

    { name: 'Shatel 1', ip: '85.15.1.14' },
    { name: 'Shatel 2', ip: '85.15.1.15' },

    { name: 'Host Iran 1', ip: '172.29.0.100' },
    { name: 'Host Iran 2', ip: '172.29.2.100' },

    { name: 'Pish Gaman', ip: '5.202.100.101' },
    { name: 'Tehran Mediacal Univercity', ip: '194.225.62.80' },
];

function testDnsServer({ name, ip }) {
    return new Promise((resolve) => {
        const resolver = new dns.Resolver();
        resolver.setServers([ip]);

        const start = performance.now();
        resolver.resolve4('google.com', (err) => {
            resolve({
                name,
                ip,
                success: !err,
                time: +(performance.now() - start).toFixed(2),
                error: err?.message,
            });
        });
    });
}

module.exports = async function runDnsCheck() {
    console.log('DNS STARTED CHECK');
    const results = await Promise.all(dnsServers.map(testDnsServer));
    console.log('DNS END CHECK');
    return results.sort((a, b) => a.time - b.time);
};

// (async () => {
//     chalk = await import('chalk');

//     const testDomains = [
//         'google.com',
//         'youtube.com',
//         'github.com',
//         'npmjs.com',
//         'microsoft.com',
//     ];


//     const dnsServers = [
//         { name: 'Cloudflare', ip: '1.1.1.1' },
//         { name: 'Cloudflare IPv6', ip: '2606:4700:4700::1111' },
//         { name: 'Google', ip: '8.8.8.8' },
//         { name: 'Google IPv6', ip: '2001:4860:4860::8888' },
//         { name: 'Quad9', ip: '9.9.9.9' },
//         { name: 'OpenDNS', ip: '208.67.222.222' },
//         { name: 'AdGuard DNS', ip: '94.140.14.14' },
//         { name: 'Shecan (IR)', ip: '178.22.122.100' },
//         { name: 'Shecan 2 (IR)', ip: '185.51.200.2' },
//         { name: 'Electro 1', ip: '78.157.42.100' },
//         { name: 'Electro 2', ip: '78.157.42.101' },

//         { name: 'Radar Game (IR)', ip: '10.202.10.10' },
//         { name: 'Radar Game (IR)', ip: '10.202.10.11' },

//         { name: 'Shatel 1', ip: '85.15.1.14' },
//         { name: 'Shatel 2', ip: '85.15.1.15' },

//         { name: 'Host Iran 1', ip: '172.29.0.100' },
//         { name: 'Host Iran 2', ip: '172.29.2.100' },

//         { name: 'Pish Gaman', ip: '5.202.100.101' },
//         { name: 'Tehran Mediacal Univercity', ip: '194.225.62.80' },
//     ];
//     function testDnsServer({ name, ip }) {
//         return new Promise((resolve) => {
//             const resolver = new dns.Resolver();
//             resolver.setServers([ip]);

//             const start = performance.now();

//             resolver.resolve4('google.com', (err) => {
//                 const duration = (performance.now() - start).toFixed(2);
//                 if (err) {
//                     resolve({ name, ip, success: false, time: duration, error: err.message });
//                 } else {
//                     resolve({ name, ip, success: true, time: duration });
//                 }
//             });
//         });
//     }

//     async function runTests() {
//         console.log(chalk.default.blue.bold('\n🔍 Testing DNS Servers...\n'));

//         const results = await Promise.all(dnsServers.map(testDnsServer));
//         const sorted = results.sort((a, b) => a.time - b.time);

//         for (const r of sorted) {
//             const status = r.success ? chalk.default.green('✔ ') : chalk.default.red('✖ ');
//             const msg = r.success
//                 ? `${status} ${chalk.default.bold(r.name)} (${r.ip}) → ${chalk.default.yellow(`${r.time}ms`)}`
//                 : `${status} ${chalk.default.bold(r.name)} (${r.ip}) → ${chalk.default.red('Failed')}: ${r.error}`;
//             console.log(msg);
//         }

//         console.log('\n🏁', chalk.default.green('Done.\n'));
//     }

//     runTests();
// })();