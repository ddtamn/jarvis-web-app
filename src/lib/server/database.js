import supabase from "$lib/supabaseClient";

// const getEvents = async () => {
//   try {
//     const { data: Events, error } = await supabase.from("Events").select("*");
//     if (error) {
//       throw new Error(error.message);
//     }
//     return Events;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

const getEvent = async (/** @type {any} */ public_id) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("public_id", public_id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export { getEvent };
