const dns = require('dns').promises;
const whois = require('whois-json');

async function getDnsRecords(domain) {
    const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];

    const records = {};
    for (const type of recordTypes) {
        try {
            records[type] = await dns.resolve(domain, type);
        } catch (e) {
            records[type] = [];
        }
    }
    return records;
}

async function getWhois(domain) {
    try {
        return await whois(domain);
    } catch (e) {
        return { error: e.message };
    }
}

async function main() {
    const domain = process.argv[2];
    if (!domain) {
        console.error('Usage: node domain-info.js <domain>');
        process.exit(1);
    }

    console.log(`\n⏳ Getting WHOIS for: ${domain}`);
    const whoisData = await getWhois(domain);

    if (whoisData.error) {
        console.error('⚠️ WHOIS error:', whoisData.error);
    } else {
        console.log('🔍 WHOIS info:');
        // چند فیلد مهم رو نشون میدیم
        console.log({
            registrar: whoisData.registrar || whoisData['Registrar'] || 'N/A',
            creationDate: whoisData.creationDate || whoisData['Creation Date'] || 'N/A',
            expirationDate: whoisData.expirationDate || whoisData['Registry Expiry Date'] || 'N/A',
            updatedDate: whoisData.updatedDate || whoisData['Updated Date'] || 'N/A',
            nameServers: whoisData.nameServers || whoisData['Name Server'] || [],
            status: whoisData.status || 'N/A',
            domainName: whoisData.domainName || domain,
            registrantCountry: whoisData.country || whoisData['Registrant Country'] || 'N/A',
        });
    }

    console.log(`\n⏳ Getting DNS records for: ${domain}`);
    const dnsRecords = await getDnsRecords(domain);
    console.log('📜 DNS records:');
    console.log(dnsRecords);
}

main();
