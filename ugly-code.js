const fs = require('fs');
const obfuscator = require('javascript-obfuscator');

const directory = './dist/roxanne';

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.js')) {
        const filePath = `${directory}/${file}`;
        const code = fs.readFileSync(filePath, 'utf8');
        const obfuscatedCode = obfuscator.obfuscate(code).getObfuscatedCode();
        fs.writeFileSync(filePath, obfuscatedCode, 'utf8');
        console.log(`Obfuscated ${file}`);
    }
});