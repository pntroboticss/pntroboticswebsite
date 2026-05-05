const fs = require('fs');
const path = require('path');
const http = require('http');

const API_BASE = 'http://localhost:3000';

// Function to convert a local file to a base64 string
function fileToBase64(filePath) {
    const bitmap = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    if (ext === '.svg') mimeType = 'image/svg+xml';
    if (ext === '.webp') mimeType = 'image/webp';

    const base64Str = Buffer.from(bitmap).toString('base64');
    return `data:${mimeType};base64,${base64Str}`;
}

// Function to post data to the API using native HTTP
function postLogo(endpoint, payload) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(payload);

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(data);
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

async function syncFolder(folderName, apiEndpoint) {
    const folderPath = path.join(__dirname, '..', 'public', folderName);

    if (!fs.existsSync(folderPath)) {
        console.log(`Folder not found: ${folderPath}`);
        return;
    }

    const files = fs.readdirSync(folderPath);
    console.log(`Found ${files.length} files in ${folderName}`);

    for (const file of files) {
        // Skip hidden files or non-images
        if (file.startsWith('.') || !file.match(/\.(png|jpe?g|svg|webp)$/i)) continue;

        const filePath = path.join(folderPath, file);
        const base64Data = fileToBase64(filePath);

        // Create a title from the filename (remove extension and capitalize)
        const title = file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        console.log(`Syncing ${file}...`);

        try {
            await postLogo(apiEndpoint, {
                name: title,
                imageUrl: base64Data
            });
            console.log(`✅ Successfully synced ${file}`);
        } catch (err) {
            console.error(`❌ Failed to sync ${file}:`, err.message);
        }
    }
}

async function run() {
    console.log('--- Starting Sync ---');
    console.log('Syncing Schools...');
    await syncFolder('schools', '/api/admin/schools');

    console.log('\nSyncing Internships...');
    await syncFolder('internships', '/api/admin/internships');

    console.log('\n--- Sync Complete ---');
}

run();
