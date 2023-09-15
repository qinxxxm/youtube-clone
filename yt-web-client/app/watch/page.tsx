"use client";

import { useSearchParams } from "next/navigation";
import styles from "./watch.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Watch() {
  const videoPrefix =
    "https://storage.googleapis.com/processed-videos-qx-test/";
  const videoSrc = useSearchParams().get("v");
  const title = useSearchParams().get("t");
  const displayName = useSearchParams().get("n");
  const photoURL = useSearchParams().get("p");
  const uid = useSearchParams().get("u");
  return (
    <div className={styles.video_container}>
      <video controls src={videoPrefix + videoSrc} />
      <div className={styles.video_bottom_section}>
        <Link href={`/channel?u=${uid}&n=${displayName}`}>
          <Image
            src={photoURL!}
            alt="/thumbnail.png"
            className={styles.channel_icon}
            width={40}
            height={40}
          />
        </Link>
        <div className={styles.video_details}>
          <div className={styles.video_title}>{title}</div>
          <Link
            href={`/channel?u=${uid}&n=${displayName}`}
            className={styles.video_channel_name}
          >
            {displayName}
          </Link>
        </div>
      </div>
    </div>
  );
}
