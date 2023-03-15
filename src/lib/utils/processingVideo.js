import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "http://localhost:5173/ffmpeg-core.js",
});

// async function load() {
//   await ffmpeg.load();
// }

export { ffmpeg, fetchFile };
