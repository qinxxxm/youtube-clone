/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {Firestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin/app"; // https://firebase.google.com/docs/admin/setup //for us to interact with firebase from privileged environments
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();
const firestore = new Firestore();
const storage = new Storage();
const rawVideoBucketName = "raw-videos-qx-test";
const videoCollectionId = "videos";

export interface Video {
  id?: string,
  uid?: string,
  fileName?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string,
}

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// https://firebase.google.com/docs/functions/auth-events

// in index.ts, every function exported here will be deployed by firebase
export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo); // https://firebase.google.com/docs/firestore/manage-data/add-data
  logger.info("User Created: ${JSON.stringify(userInfo)}");
  return;
});


export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // check if user is authenticated
  // usually we will pass in credentials
  // but since we are using firebaseit will be in the request
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);

  // Generate unique file name
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtention}`;

  // get a v4 signed URL for uploading file
  // https://cloud.google.com/storage/docs/samples/storage-generate-upload-signed-url-v4#storage_generate_upload_signed_url_v4-nodejs
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return {fileName, url};
});

export const getVideos = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});
