"use client";

import styles from "./channel.module.css";
import { getVideos } from "../utils/firebase/functions";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function Channel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const uid = useSearchParams().get("u");
  const displayName = useSearchParams().get("n");

  useEffect(() => {
    const fetchVideos = async () => {
      //doing this is better than just using await in our useffect, to allow our cleanup function to still run
      const videoss = await getVideos();
      setVideos(videoss!);
    };

    fetchVideos();
  }, []);

  return (
    <div className={styles.videos}>
      {videos && (
        <h1 style={{ marginBottom: "20px" }}>{displayName}'s Channel</h1>
      )}
      <section className={styles.video_section}>
        {videos
          .filter((video) => video.status === "processed")
          .filter((video) => video.uid === uid)
          .map((video) => (
            <div className={styles.video_container}>
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
                <Link href={`/channel?u=${video.uid}`}>
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
                    href={`/watch?v=${video.videoFileName}`}
                    className={styles.video_title}
                  >
                    {video.title}
                  </Link>
                  <Link href="/" className={styles.video_channel_name}>
                    {video.displayName}
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}
