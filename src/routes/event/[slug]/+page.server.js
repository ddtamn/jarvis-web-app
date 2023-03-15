import * as db from "$lib/server/database";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const event = await db.getEvent(params.slug);

  if (event?.length === 0) {
    throw error(404, {
      message: "Not found",
    });
  }

  return { event };
}
