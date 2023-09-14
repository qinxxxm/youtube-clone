import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()}); // default credentials are the credentials that we used when we 

const firestore = new Firestore(); // Since there can only be one Firestore instance per GCP project, we don't have to specify which Firestore instance to use.


// Note: This requires setting an env variable in Cloud Run
// If we wanna test code out locally, need to use the firestore emulator
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */

const videoCollectionId = "videos";

export interface Video {
  id?: string,
  uid?: string,
  photoURL?: string,
  displayName?: string,
  videoFileName?: string,
  thumbnailFileName?: string,
  status?: "before processing" | "processing" | "processed",
  title?: string,
}
/**
* @param videoId - The ID of the video to retrieve.
* @returns The video object with the given ID.
*/
async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get(); // need await here, as we need to return snapshot.data() as a video object
  return (snapshot.data() as Video) ?? {};
}

/**
* @param videoId - The ID of the video to update.
* @param video - A video object to be updated.
* @returns A promise that resolved when the fields have been updated.
*/
export function setVideo(videoId: string, video: Video) {
  return firestore // dont need await here, can await when we call this setVideo function
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true }) // merge true allows us to update the fields that we want, without this, if we are updating the fields, it will delete the current doc and crate a new one
}

/**
* @param videoId - The ID of the video to check.
* @returns A Boolean that indicates whether the video is new or not.
*/
export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === "before processing"; // if its not before processing it will be either processing or processed, thus we dont want to do anything, ignore the pub sub call
}


