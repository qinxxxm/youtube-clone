// import {getFunctions, httpsCallable} from 'firebase/functions'; // instead of calling getFunctions here, we call it in firebase.ts, to ensure that the firebase is initialised as well
import {httpsCallable} from 'firebase/functions';
import {functions} from './firebase';

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
    id?: string,
    uid?: string,
    fileName?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string,
}

export async function uploadVideo(file: File) {

    const response: any = await generateUploadUrl({
        fileExtention: file.name.split('.').pop(),
    });

    // Upload the file via the signed URL
    await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        }
    });

    return;
}

export async function getVideos() {
    const response: any = await getVideosFunction();
    return response.data as Video[];
}