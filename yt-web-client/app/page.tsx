import styles from "./page.module.css";
import { getVideos } from "./utils/firebase/functions";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const videos = await getVideos();
  // test
  let test = [];
  for (let i = 0; i < 10; i++) {
    test.push(i);
  }
  console.log(test);

  return (
    <main className={styles.videos}>
      <section className={styles.video_section}>
        {test.map(() => (
          <div className={styles.video_container}>
            <Link href="/" className={styles.thumbnail}>
              <Image
                src={"/thumbnail.png"}
                alt="video"
                width={0}
                height={0}
                sizes="100vw"
                className={styles.thumbnail_img}
              />
            </Link>
            <div className={styles.video_bottom_section}>
              <Link href="/">
                <Image
                  src="/thumbnail.png"
                  alt="profilepic"
                  className={styles.channel_icon}
                  width={40}
                  height={40}
                />
              </Link>
              <div className={styles.video_details}>
                <Link href="/" className={styles.video_title}>
                  Video Title
                </Link>
                <Link href="/" className={styles.video_channel_name}>
                  Channel Name
                </Link>
                <div className={styles.video_metadata}>
                  <span>1 week ago</span>
                </div>
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
export const revalidate = 30; // https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#segment-level-caching
