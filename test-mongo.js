const { MongoClient } = require('mongodb');

// Try localhost first, then 127.0.0.1
const uris = [
    'mongodb://127.0.0.1:27017',
    'mongodb://localhost:27017'
];

async function testConnection(uri) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
    try {
        await client.connect();
        console.log(`SUCCESS: Connected to ${uri}`);
        await client.close();
        return true;
    } catch (e) {
        console.log(`FAILED: Could not connect to ${uri} - ${e.message}`);
        return false;
    }
}

async function run() {
    console.log('Testing MongoDB Connections...');
    for (const uri of uris) {
        if (await testConnection(uri)) {
            console.log('Connection test complete.');
            process.exit(0);
        }
    }
    console.log('All connection attempts failed.');
    process.exit(1);
}

run();
