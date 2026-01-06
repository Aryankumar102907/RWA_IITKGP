'use strict';

const fs = require('fs');
const path = require('path');

const contracts = ['MockUSDC', 'BondVault'];
const outDir = path.join(__dirname, '..', 'out');
const frontendDir = path.join(__dirname, '..', 'frontend', 'src', 'constants');

if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
}

contracts.forEach(contract => {
    const filePath = path.join(outDir, `${contract}.sol`, `${contract}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const abi = data.abi;
        const content = `export const ${contract}ABI = ${JSON.stringify(abi, null, 2)} as const;`;
        fs.writeFileSync(path.join(frontendDir, `${contract}ABI.ts`), content);
        console.log(`Exported ABI for ${contract}`);
    } else {
        console.warn(`File not found: ${filePath}. Run 'forge build' first.`);
    }
});
