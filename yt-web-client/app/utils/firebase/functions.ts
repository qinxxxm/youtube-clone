// import {getFunctions, httpsCallable} from 'firebase/functions'; // instead of calling getFunctions here, we call it in firebase.ts, to ensure that the firebase is initialised as well
import {httpsCallable} from 'firebase/functions';
import {functions} from './firebase';
import { User } from 'firebase/auth';

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const uploadThumbnail = httpsCallable(functions, 'uploadThumbnail');
const getVideosFunction = httpsCallable(functions, 'getVideos');
const deleteVideoFunction = httpsCallable(functions, 'deleteVideo');

export interface Video {
    id?: string,
    uid?: string,
    photoURL?: string,
    displayName?: string,
    videoFileName?: string,
    thumbnailFileName?: string,
    status?: "processing" | "processed",
    title?: string,
}

export async function uploadVideo(title: String, videoFile: File, thumbnail: File, user: User) {


    // const response: any = await generateUploadUrl({
    //     fileExtention: file.name.split('.').pop(),
    // });

    // // Upload the file via the signed URL
    // await fetch(response?.data?.url, {
    //     method: 'PUT',
    //     body: file,
    //     headers: {
    //         'Content-Type': file.type,
    //     }
    // });

    // Generate unique video file name ( this will be the object name in the processed video bucket)
    const rawVideoFileName = `${user.uid}-${Date.now()}.${videoFile.name.split('.').pop()}`; //<UID>-<DATE>.<EXTENTION>
    const processedVideoFileName = `processed-${rawVideoFileName}`;
    const videoId = rawVideoFileName.split('.')[0]; 

    //Generate unique thumbnail file name ( this will be the object name in the thumbnail bucket)
    const thumbnailFileName = `${user.uid}-${Date.now()}.${thumbnail.name.split('.').pop()}`; //<UID>-<DATE>
    const displayName = user.displayName;
    const photoURL = user.photoURL; 

    // upload thumbnail to thumbnail bucket, and also upload title, uid, displayname, photourl, thumbnailurl to firestore (videoId will be the doc id)
   try {
    // get the signed url for uploading video and uploading thumbnail
    const responseUrl: any = await generateUploadUrl({
        videoFileName: rawVideoFileName,
        thumbnailFileName: thumbnailFileName,
    });

    const thumbnailUrl = responseUrl?.data?.thumbnailUrl;
    const videoUrl = responseUrl?.data?.videoUrl;

    await fetch(thumbnailUrl, {
        method: "PUT",
        body: thumbnail,
        headers: {
          "Content-Type": thumbnail.type,
        },
      });
  
    const responseThumbnail: any = await uploadThumbnail({
        file: thumbnail,
        thumbnailFileName: thumbnailFileName,
        videoId: videoId,
        displayName: displayName,
        photoURL: photoURL,
        title: title,
    });

    // Upload the file via the signed URL (this will upload the video to the raw video bucket, and the raw bucket will send a notification through pub sub, and will push to the video processing api service)
    await fetch(videoUrl, {
        method: 'PUT',
        body: videoFile,
        headers: {
            'Content-Type': videoFile.type,
        }
    });

   } catch(error: any) {
    return {error: error.message};
   }
    
    
    return;
}

export async function getVideos() {
    const response: any = await getVideosFunction();
    return response.data as Video[];
}

export async function deleteVideo(videoId: string) {
try {
    const response: any = await deleteVideoFunction({
        videoId: videoId,
    });
    return response.data;
} catch {
    return {error: "error"};
}
}
