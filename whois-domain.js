const dns = require('dns').promises;
const whois = require('whois-json');

async function getDnsRecords(domain) {
    const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];
    const records = {};

    for (const type of recordTypes) {
        try {
            records[type] = await dns.resolve(domain, type);
        } catch {
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

module.exports = async function runWhois(domain) {
    if (!domain) {
        return { error: 'domain is required' };
    }

    const whoisData = await getWhois(domain);
    const dnsRecords = await getDnsRecords(domain);

    return {
        domain,
        whois: whoisData.error ? { error: whoisData.error } : {
            registrar: whoisData.registrar || whoisData['Registrar'] || 'N/A',
            creationDate: whoisData.creationDate || whoisData['Creation Date'] || 'N/A',
            expirationDate: whoisData.expirationDate || whoisData['Registry Expiry Date'] || 'N/A',
            updatedDate: whoisData.updatedDate || whoisData['Updated Date'] || 'N/A',
            nameServers: whoisData.nameServers || whoisData['Name Server'] || [],
            status: whoisData.status || 'N/A',
            registrantCountry:
                whoisData.country ||
                whoisData['Registrant Country'] ||
                'N/A'
        },
        dns: dnsRecords
    };
};
