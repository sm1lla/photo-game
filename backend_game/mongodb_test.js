const { MongoClient } = require('mongodb');
const fs = require('fs');

const database_url = 'mongodb+srv://admin:CfM9V4fsKUJN@clusterapiproject.v2jf5ss.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPIProject';
const dbName = 'photos';

async function uploadImages(imagePaths) {
    const client = await MongoClient.connect(database_url);
    const db = client.db(dbName);
    const collection = db.collection('test_photos');

    const imageBuffer = fs.readFileSync('./images/cat-2.jpg');
    const base64Image = imageBuffer.toString('base64');

    await collection.insertOne({ filename: 'cat-2.jpg', image: base64Image });

    console.log('Image has been uploaded to MongoDB.');

    client.close();
}


// Example usage
const imagePaths = [
    './images/cat-1.jpg',
    './images/cat-2.jpg',
    './images/cat-3.jpg'
];

uploadImages(imagePaths);