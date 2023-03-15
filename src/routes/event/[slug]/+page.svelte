<script>
  import supabase from "$lib/supabaseClient";
  import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
  import { onMount } from "svelte";
  export let data;

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "http://localhost:5173/ffmpeg-core.js",
  });

  onMount(async () => {
    await ffmpeg.load().then(() => {
      proccess("051B3DD0-F41C-400C-810D-371DABF41239.mov");
    });
  });

  async function proccess(/** @type {any} */ file) {
    console.log(file);

    let storageURL =
      "https://yzxsiqwrmigznhixkeyy.supabase.co/storage/v1/object/public/videos";
    ffmpeg.FS(
      "writeFile",
      "video.mp4",
      await fetchFile(`${storageURL}/${file}`)
    );

    await ffmpeg.run(
      "-i",
      "video.mp4",
      "-ss",
      "00:00",
      "-to",
      "00:03",
      "-c:v",
      "libx264",
      "-crf",
      "30",
      "result1.mp4"
    );

    await ffmpeg.run(
      "-i",
      "video.mp4",
      "-ss",
      "00:05",
      "-to",
      "00:08",
      "-c:v",
      "libx264",
      "-crf",
      "30",
      "slow2.mp4"
    );

    // await ffmpeg.run("-i", "slow2.mp4", "-vf", "setpts=2*PTS", "result2.mp4");

    await ffmpeg.run(
      "-i",
      "result1.mp4",
      "-i",
      "slow2.mp4",
      "-filter_complex",
      "[0:0][0:1][1:0][1:1]concat=n=2:v=1:a=1[outv][outa]",
      "-map",
      "[outv]",
      "-map",
      "[outa]",
      "result.mp4"
    );

    // await ffmpeg.run(
    //   "-i",
    //   "result1.mp4",
    //   "-i",
    //   "result2slow.mp4",
    //   "-i",
    //   "result3.mp4",
    //   "-i",
    //   "result3revese.mp4",
    //   "-i",
    //   "result2slowrevervse.mp4",
    //   "-i",
    //   "result1reverse.mp4",
    //   "-filter_complex",
    //   "[0:v][0:a][1:v][1:a][2:v][2:a][3:v][3:a][4:v][4:a][5:v][5:a]concat=n=6:v=1:a=1",
    //   "-vsync",
    //   "vfr",
    //   "result.mp4"
    // );
    const result = await ffmpeg.FS("readFile", "result.mp4");
    const url = URL.createObjectURL(
      new Blob([result.buffer], { type: "video/mp4" })
    );
    console.log(url);
  }

  supabase
    .channel("uploaded")
    .on("broadcast", { event: "supa" }, (data) => {
      proccess(data.payload.file_path);
    })
    .subscribe();
</script>

<div class="p-4 py-8">
  <div class="text-center">
    <h1 class="font-bold text-lg">{data.event.title}</h1>
  </div>
</div>
