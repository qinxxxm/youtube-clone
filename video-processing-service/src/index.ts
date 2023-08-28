import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { isVideoNew, setVideo } from './firestore';

setupDirectories();
const app = express();
app.use(express.json()); //middlewear to handle requests in json

app.get('/', (req, res) => {
    res.send("hello world");
});

app.post('/process-video', async (req, res) => { //this endpoint not going to be invoked by any user but by the cloud pub/sub message, everytime a file is uploaded to raw video bucket

    // Get the bucket and filename from the Cloud Pub/Sub message
    let data;
    try { // all the console logs i put just to see what notification is being sent from the cloud bucket to the pub/sub message queue
        console.log("TEST: this is the req.body.message:", req.body.message);
        console.log("TEST: THis is the req.body.message.data", req.body.message.data);
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        console.log("TEST: This is the message after getting from buffer", message);
        data = JSON.parse(message);
        console.log("TEST: This is the data after getting from buffer", data);
        if (!data.name) { //this is the file name
            throw new Error('Invalid message payload received.');
        }
        console.log("TEST: This is the data.name", data.name);
    } catch (error) {
        console.error(error);
        return res.status(400).send('Bad Request: missing filename.');
    }

    

    

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0]; // data.name format is <UID>-<DATE>.<EXTENTION>
    
    if (!isVideoNew(videoId)) {
        return res.status(400).send("Bad Request: Video already processing or processed");
    } else {
       await setVideo(videoId, {
        id: videoId,
        uid: videoId.split('-')[0],
        status: 'processing'
       }); 
    }

    // Download the raw video from cloud storage
    await downloadRawVideo(inputFileName);

    // Convert video to 360p
    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (err) {
        await Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFileName)]); //Promise.all(): All promises in the array are initiated concurrently, allowing for potential parallel execution. Doing this instead of await multiple lines is better cos we can do delete concurrently
        console.log(err);
        return res.status(500).send("Internal Server Error: video processing failed.");
    }

    // Upload processed video to cloud storage
    await uploadProcessedVideo(outputFileName);

    await setVideo(videoId, {
        status: 'processed',
        fileName: outputFileName,
    });
    
    await Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFileName)]);

    return res.status(200).send('Prcoessing finished successfully');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});
