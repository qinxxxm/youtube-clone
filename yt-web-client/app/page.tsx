import styles from "./page.module.css";
import { getVideos } from "./utils/firebase/functions";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const videos = await getVideos();

  return (
    <main className={styles.videos}>
      <section className={styles.video_section}>
        {videos
          .filter((video) => video.status === "processed")
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
                    u: video.uid,
                  },
                }}
                //this works too href={`/watch?v=${video.videoFileName}&t=${video.title}&n=${video.displayName}&p=${video.photoURL}`}
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
                <Link href={`/channel?u=${video.uid}&n=${video.displayName}`}>
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
                    href={`/watch?v=${video.videoFileName}&t=${video.title}&n=${video.displayName}&p=${video.photoURL}&u=${video.uid}`}
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
                  {/* <div className={styles.video_metadata}>
                  <span>1 week ago</span>
                </div> */}
                </div>
              </div>
            </div>
          ))}
      </section>
    </main>
    // <main>
    //   {videos.map((video) => (
    //     <Link href={`/watch?v=${video.fileName}`} key={video.id}>
    //       <Image
    //         src={"/thumbnail.png"}
    //         alt="video"
    //         width={120}
    //         height={80}
    //         className={styles.thumbnail}
    //       />
    //     </Link>
    //   ))}
    // </main>
  );
}

// if we didnt revalidate, the page would just cache the videos (cache the getVideo() function call), and not update the page if new videos is uploaded
export const revalidate = 10; // https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#segment-level-caching
