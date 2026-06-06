const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const colorMap = [
    { from: /LokalMart/g, to: 'Belio' },
    { from: /#E31837/gi, to: '#1A3C6E' },
    { from: /#c4132e/gi, to: '#2A5FA0' },
    { from: /#fff1ee/gi, to: '#EBF2FA' },
    { from: /#ffcfc4/gi, to: '#BFDBFE' },
    { from: /#f5f5f5/gi, to: '#F7F8FA' },
    { from: /#333333/gi, to: '#1F2937' },
    { from: /#666666/gi, to: '#6B7280' },
    { from: /#999999/gi, to: '#9CA3AF' },
    { from: /#e0e0e0/gi, to: '#E5E7EB' },
    { from: /#cccccc/gi, to: '#D1D5DB' }
];

let changedFiles = 0;

walkDir('./src', function(filePath) {
    if (filePath.match(/\.(tsx|ts|css)$/)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        colorMap.forEach(mapping => {
            content = content.replace(mapping.from, mapping.to);
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            changedFiles++;
            console.log(`Updated: ${filePath}`);
        }
    }
});

console.log(`Rebranding complete! ${changedFiles} files updated.`);
