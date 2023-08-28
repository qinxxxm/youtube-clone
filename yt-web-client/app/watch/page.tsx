"use client";

import { useSearchParams } from "next/navigation";

export default function Watch() {
  const videoPrefix =
    "https://storage.googleapis.com/processed-videos-qx-test/";
  const videoSrc = useSearchParams().get("v");
  console.log(videoSrc);
  return (
    <div>
      <video controls src={videoPrefix + videoSrc} />
    </div>
  );
}
