<script>
  // @ts-nocheck

  import { page } from "$app/stores";
</script>

<div
  class="h-[calc(100vh-6rem)] w-full flex justify-center items-center flex-col"
>
  <h1>Eror 404 {$page.error.message}</h1>
  <a href="/" class="text-blue-600">Back to Dashboard</a>
</div>
