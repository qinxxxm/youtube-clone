import styles from "./page.module.css";
import { getVideos } from "./utils/firebase/functions";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      {videos.map((video) => (
        <Link href={`/watch?v=${video.fileName}`} key={video.id}>
          <Image
            src={"/thumbnail.png"}
            alt="video"
            width={120}
            height={80}
            className={styles.thumbnail}
          />
        </Link>
      ))}
    </main>
  );
}

// if we didnt revalidate, the page would just cache the videos (cache the getVideo() function call), and not update the page if new videos is uploaded
export const revalidate = 30; // https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#segment-level-caching
