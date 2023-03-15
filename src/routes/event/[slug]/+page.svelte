<script>
  import supabase from "$lib/supabaseClient";
  import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
  import { onMount } from "svelte";
  export let data;

  onMount(async () => {
    // await ffmpeg.load().then(() => {
    //   proccess("051B3DD0-F41C-400C-810D-371DABF41239.mov");
    // });
  });

  async function proccess(/** @type {any} */ file) {
    console.log("start");
    const ffmpeg = createFFmpeg({
      progress: (e) => {
        console.log(e.ratio);
      },
      log: true,
      corePath: "http://localhost:5173/ffmpeg-core.js",
    });
    let storageURL =
      "https://yzxsiqwrmigznhixkeyy.supabase.co/storage/v1/object/public/videos";

    await ffmpeg.load().then(async () => {
      console.log('load');
      ffmpeg.FS(
        "writeFile",
        "video.mp4",
        await fetchFile(`${storageURL}/${file}`)
      );

      console.log("res 1");
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
      console.log("res 2");
      await ffmpeg.run("-i", "result1.mp4", "-c", "copy", "intermediate1.ts");

      await ffmpeg.run(
        "-i",
        "video.mp4",
        "-ss",
        "00:03",
        "-to",
        "00:06",
        "-c:v",
        "libx264",
        "-crf",
        "30",
        "result2.mp4"
      );

      console.log("res 3");
      await ffmpeg.run(
        "-i",
        "result2.mp4",
        "-filter:v",
        "setpts=2.0*PTS",
        "result2slow.mp4"
      );


      console.log("res 4");
      await ffmpeg.run(
        "-i",
        "result2slow.mp4",
        "-c",
        "copy",
        "intermediate2.ts"
      );

      console.log("res 5");

      await ffmpeg.run(
        "-i",
        "concat:intermediate1.ts|intermediate2.ts",
        "-c",
        "copy",
        "output.mp4"
      );

      const result = await ffmpeg.FS("readFile", "output.mp4");
      const url = URL.createObjectURL(
        new Blob([result.buffer], { type: "video/mp4" })
      );
      console.log(url);
    });
  }

  supabase
    .channel("uploaded")
    .on("broadcast", { event: "supa" }, (data) => {
      proccess(data.payload.file_path);
    })
    .subscribe();

  function record() {
    const channel = supabase.channel("record").subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({
          type: "broadcast",
          event: "supa",
          payload: { org: "supabase" },
        });
      }
    });
  }
</script>

<div class="p-4 py-8">
  <div class="text-center">
    <h1 class="font-bold text-lg">{data.event.title}</h1>
  </div>
  <div class="text-center mt-5">
    <button
      on:click={() => record()}
      type="button"
      class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
      >Record</button
    >
  </div>
</div>
