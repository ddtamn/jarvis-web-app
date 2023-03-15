<script>
  /**
   * @type {{ is_ready: any; title: any; description: any; public_id: any; created_at: any; }}
   */
  export let event;
</script>

<div class="shadow-lg w-full md:w-[calc(25%-1rem)] rounded-lg overflow-hidden">
  <!-- card image -->
  <div class="relative">
    <div
      class="absolute top-2 left-2  {event.is_ready
        ? 'text-green-500'
        : 'text-red-600'} p-2 bg-black bg-opacity-70 rounded-md text-xs"
    >
      {event.is_ready ? "Ready" : "Not Ready"}
    </div>
    <img src="/image.jpg" alt="" class="w-full object-cover" />
  </div>
  <!-- card body -->
  <div class="flex justify-between items-center px-4 py-2">
    <div>
      <h1 class="text-sm font-bold">{event.title}</h1>
      <p class="text-xs">
        {`${new Date(event.created_at).getDate()} - ${
          new Date(event.created_at).getMonth() + 1
        } - ${new Date(event.created_at).getFullYear()} `}
      </p>
    </div>
    {#if event.is_ready}
      <div>
        <a href={`event/${event.public_id}`}>
          <button
            type="button"
            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >Open</button
          >
        </a>
      </div>
    {/if}
  </div>
</div>
