"use client";
import React, { useEffect, useState } from "react";
import styles from "./my-videos.module.css";
import { User } from "firebase/auth";
import { onAuthStateChangedHelper } from "../utils/firebase/firebase";
import {
  getVideos,
  uploadVideo,
  deleteVideo,
} from "../utils/firebase/functions";
import Link from "next/link";
import Image from "next/image";
import { CustomModal } from "./modal";

export interface Video {
  id?: string;
  uid?: string;
  photoURL?: string;
  displayName?: string;
  videoFileName?: string;
  thumbnailFileName?: string;
  status?: "processing" | "processed";
  title?: string;
}

export default function MyVideos() {
  const [title, setTitle] = useState<String | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [waiting, setWaiting] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      //doing this is better than just using await in our useffect, to allow our cleanup function to still run
      const videoss = await getVideos();
      setVideos(videoss!);
    };

    fetchVideos();
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
      // console.log(user);
    }); //so this (user) => setUser(user) is called when the auth state changes

    //cleanup subscription to onAuthStateChange on unmount
    return () => unsubscribe();
  }, []); // need this array to prevent infinite loop

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setWaiting("");

    // checks for if form is filled
    if (!title) {
      console.log("no title");
      setError("Please key in a title!");
      return;
    }
    if (!videoFile) {
      setError("Please choose a video!");
      return;
    }
    if (!thumbnailImage) {
      setError("Please choose a thumbnail image!");
      return;
    }
    setWaiting("Uploading video");
    setDisabled(true);
    try {
      const response = await uploadVideo(
        title,
        videoFile,
        thumbnailImage,
        user!
      );
      setWaiting("");
      setSuccess(
        "Video is now uploaded and is being processed to 360p in the server!"
      );
      setDisabled(false);
      setTimeout(() => {
        setSuccess("");
      }, 3000); // 3000 milliseconds = 3 seconds
    } catch (error) {
      setWaiting("");
      setError(`Failed to upload video: ${error}`);
      setDisabled(false);
      setTimeout(() => {
        setError("");
      }, 3000); // 5000 milliseconds = 5 seconds
      return;
    }
  };

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.item(0)) {
      return;
    }
    setVideoFile(e.target.files?.item(0));
  };

  const handleThumbnailImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.item(0)) {
      return;
    }
    setThumbnailImage(e.target.files?.item(0));
  };

  const openModal = () => {
    setModal(true);
    document.body.style.overflow = "hidden";
  };

  const exitModalNo = () => {
    setModal(false);
    document.body.style.overflow = "unset";
  };

  const exitModalYes = async (videoId: string) => {
    try {
      // Call the deleteVideo function
      await deleteVideo(videoId);
      setVideos(videos.filter((video) => video.id !== videoId));
      setModal(false);
      document.body.style.overflow = "unset";
    } catch (error) {
      console.error("Error deleting video:", error);
      alert(`Error deleting video: ${error}`);
    }
  };

  return user ? (
    <div className={styles.my_videos}>
      <form className={styles.upload_form} onSubmit={handleSubmit}>
        <h2>Upload Video</h2>
        <label>Title:</label>
        <input type="text" onChange={(e) => setTitle(e.target.value)} />
        <div className={styles.file}>
          <label>Choose a video:</label>
          <input
            type="file"
            onChange={handleVideoInput}
            accept="video/mp4,video/x-m4v,video/*"
          />
        </div>
        <div className={styles.file}>
          <label>Choose a Thumbnail Image:</label>
          <input
            type="file"
            onChange={handleThumbnailImage}
            accept="image/png, image/jpeg"
          />
        </div>
        <button disabled={disabled}>Upload Video</button>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        {waiting && (
          <div className={styles.waiting}>
            {waiting}
            <Image
              src="/loading-dot.gif"
              alt=""
              width={30}
              height={20}
              className={styles.loading}
            />
          </div>
        )}{" "}
      </form>
      <h2>My Videos</h2>
      <div className={styles.videos}>
        <section className={styles.video_section}>
          {videos
            .filter((video) => video.status === "processed")
            .filter((video) => video.uid === user?.uid)
            .map((video) => (
              <div className={styles.video_container} key={video.id}>
                <Link
                  href={{
                    pathname: "/watch",
                    query: {
                      v: video.videoFileName,
                      t: video.title,
                      n: video.displayName,
                      p: video.photoURL,
                    },
                  }}
                  key={video.id}
                  className={styles.thumbnail}
                >
                  <Image
                    src={video.thumbnailFileName!}
                    alt="/thumbnail.png"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={styles.thumbnail_img}
                  />
                </Link>
                <div className={styles.video_bottom_section}>
                  <div className={styles.left_section}>
                    <Link
                      href={`/channel?u=${video.uid}&n=${video.displayName}`}
                    >
                      <Image
                        src={video.photoURL!}
                        alt="/thumbnail.png"
                        className={styles.channel_icon}
                        width={40}
                        height={40}
                      />
                    </Link>
                    <div className={styles.video_details}>
                      <Link
                        href={{
                          pathname: "/watch",
                          query: {
                            v: video.videoFileName,
                            t: video.title,
                            n: video.displayName,
                            p: video.photoURL,
                          },
                        }}
                        className={styles.video_title}
                      >
                        {video.title}
                      </Link>
                      <Link
                        href={`/channel?u=${video.uid}&n=${video.displayName}`}
                        className={styles.video_channel_name}
                      >
                        {video.displayName}
                      </Link>
                    </div>
                  </div>

                  <button className={styles.delete} onClick={openModal}>
                    <Image
                      className={styles.delete_icon}
                      src="/delete-icon.png"
                      alt="delete"
                      width={22}
                      height={25}
                      sizes="100vw"
                    />
                  </button>
                  {modal && (
                    <CustomModal
                      videoId={video.id || ""}
                      exitModalNo={exitModalNo}
                      exitModalYes={exitModalYes}
                    ></CustomModal>
                  )}
                </div>
              </div>
            ))}
        </section>
      </div>
    </div>
  ) : null;
}

export const revalidate = 30;
