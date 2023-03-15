<script>
  import EventCard from "$lib/components/EventCard.svelte";
  import Icon from "svelte-icons-pack/Icon.svelte";
  import FaSolidPlus from "svelte-icons-pack/fa/FaSolidPlus";
  import { fly, fade } from "svelte/transition";

  import supabase from "$lib/supabaseClient";
  import { onMount } from "svelte";

  /**
   * @type {any[]}
   */
  let events = [];

  let showModal = false;

  /**
   * @type {any}
   */
  let title;
  /**
   * @type {any}
   */
  let description;
  /**
   * @type {any}
   */
  let image_overlay;
  /**
   * @type {any}
   */
  let audio_file;

  /**
   * @type {any}
   */
  let showError;

  /**
   * @param {string} error
   */
  function createError(error) {
    if (error) {
      showError = error;
    }
  }

  /**
   * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} event
   */
  async function createEvent(event) {
    if (title == undefined) {
      createError("title");
      return;
    }

    // @ts-ignore
    event.target.disabled = true;
    showError = undefined;

    let public_id = new Date().getTime();

    try {
      const { data, error } = await supabase
        .from("Events")
        .insert([{ public_id, title, description, image_overlay, audio_file }]);
      if (error) {
        throw new Error(error.message);
      }
      getEvents();
      showModal = false;
      // @ts-ignore
      event.target.removeAttribute("disabled");
      const channel = supabase.channel("insert").subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.send({
            type: "broadcast",
            event: "supa",
            payload: { org: "supabase" },
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getEvents() {
    try {
      const { data: Events, error } = await supabase
        .from("Events")
        .select("*")
        .order("id", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      events = Events;
    } catch (error) {
      console.log(error);
    }
  }

  supabase
    .channel("ready")
    .on("broadcast", { event: "supa" }, (payload) => {
      getEvents();
    })
    .subscribe();
  onMount(() => {
    getEvents();
  });
</script>

<!-- content -->
<div class="px-8 mt-12">
  <h1 class="font-bold">Events Dashboard</h1>
  <!-- Event Card Container -->
  <div class="flex justify-start items-center mt-8 gap-4 flex-wrap">
    <!-- Card -->
    {#each events as event}
      <EventCard {event} />
    {/each}
  </div>
</div>

<!-- add event button -->
<div class="fixed bottom-6 right-6 ">
  <button
    on:click={() => (showModal = true)}
    class="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 p-4 rounded-full cursor-pointer shadow-lg"
    ><Icon src={FaSolidPlus} color="white" /></button
  >
</div>
<!-- form -->

{#if showModal}
  <div
    transition:fade
    class="fixed bg-black w-full h-full top-0 left-0 bg-opacity-70 flex justify-center items-center px-4 md:px-96"
  >
    <div
      transition:fly={{ y: 50 }}
      on:introstart
      on:outroend
      class="bg-[whitesmoke] p-6 rounded-lg shadow-lg w-full"
    >
      <div class="mb-3 text-center font-bold text-lg">
        <h1>Create Event</h1>
      </div>
      <div class="mb-3">
        <label for="title" class="text-sm font-medium text-gray-900"
          >Title</label
        >
        <input
          bind:value={title}
          name="title"
          id="title"
          type="text"
          class="px-2 bg-transparent mt-2 py-1 relative rounded border outline-none focus:shadow-outline w-full border-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-blborder-blue-400 focus:ring-1"
        />
        {#if showError == "title"}
          <i class="text-xs text-red-600">Title Required!</i>
        {/if}
      </div>
      <div class="mb-3">
        <label for="description" class="text-sm font-medium text-gray-900"
          >Description (Opsional)</label
        >
        <input
          name="description"
          id="description"
          type="text"
          class="px-2 bg-transparent mt-2 py-1 relative rounded border outline-none focus:shadow-outline w-full border-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-blborder-blue-400 focus:ring-1"
        />
      </div>
      <div class="mb-3">
        <label for="image" class="text-sm font-medium text-gray-900"
          >Image Overlay</label
        >
        <input
          name="image"
          id="image"
          type="file"
          accept="image/png"
          class="px-2 bg-transparent mt-2 py-1 relative rounded border outline-none focus:shadow-outline w-full border-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-blborder-blue-400 focus:ring-1"
        />
        <i class="text-xs">Dimension : 1080 x 1920 ( Portrait )</i>
      </div>
      <div class="mb-3">
        <label for="audio" class="text-sm font-medium text-gray-900"
          >Audio File</label
        >
        <input
          name="audio"
          id="audio"
          type="file"
          accept="audio/mp3"
          class="px-2 bg-transparent mt-2 py-1 relative rounded border outline-none focus:shadow-outline w-full border-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-blborder-blue-400 focus:ring-1"
        />
        <i class="text-xs">Max 2MB</i>
      </div>
      <div class="mt-5 flex justify-end gap-4">
        <button
          on:click={() => (showModal = false)}
          type="button"
          class="focus:outline-none text-white bg-slate-400 hover:bg-slate-500 focus:ring-4 focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >Cancel</button
        >
        <button
          on:click={(event) => createEvent(event)}
          type="button"
          class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >Submit</button
        >
      </div>
    </div>
  </div>
{/if}
