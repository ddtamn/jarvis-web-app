<script>
  import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "http://localhost:5173/ffmpeg-core.js",
  });

  /**
   * @param {any} url
   */
  async function initFfmpeg(url) {
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "video.mp4", await fetchFile(url));

    // result 1 normal
    await ffmpeg.run(
      "-i",
      "video.mp4",
      "-ss",
      "00:00",
      "-to",
      "00:05",
      "-c:v",
      "libx264",
      "-crf",
      "30",
      "result1.mp4"
    );

    // result 2 normal
    await ffmpeg.run(
      "-i",
      "video.mp4",
      "-ss",
      "00:05",
      "-to",
      "00:10",
      "-c:v",
      "libx264",
      "-crf",
      "30",
      "result2.mp4"
    );

    // result 2 slow
    await ffmpeg.run(
      "-i",
      "result2.mp4",
      "-vf",
      "setpts=2*PTS",
      "result2slow.mp4"
    );

    // result 3 normal
    await ffmpeg.run(
      "-i",
      "video.mp4",
      "-ss",
      "00:10",
      "-to",
      "00:15",
      "-c:v",
      "libx264",
      "-crf",
      "30",
      "result3.mp4"
    );

    // result 3 reverse
    await ffmpeg.run(
      "-i",
      "result3.mp4",
      "-vf",
      "reverse",
      "result3revese.mp4"
    );

    // result 2 slow reverse
    await ffmpeg.run(
      "-i",
      "result2slow.mp4",
      "-vf",
      "reverse",
      "result2slowrevervse.mp4"
    );

    // result 1 normal reverse
    await ffmpeg.run(
      "-i",
      "result1.mp4",
      "-vf",
      "reverse",
      "result1reverse.mp4"
    );

    await ffmpeg.run(
      "-i",
      "result1.mp4",
      "-i",
      "result2slow.mp4",
      "-i",
      "result3.mp4",
      "-i",
      "result3revese.mp4",
      "-i",
      "result2slowrevervse.mp4",
      "-i",
      "result1reverse.mp4",
      "-filter_complex",
      "[0:v][0:a][1:v][1:a][2:v][2:a][3:v][3:a][4:v][4:a][5:v][5:a]concat=n=6:v=1:a=1",
      "-vsync",
      "vfr",
      "result.mp4"
    );

    const file = await ffmpeg.FS("readFile", "result.mp4");
    // url = URL.createObjectURL(new Blob([file.buffer], { type: "video/mp4" }));
  }
</script>
