import { get_image_ids_for_user_ids } from "./get_data.js";

function getRandomElements(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count);
}

export async function selectImages(max_rounds, players) {
  // Get all images belonging to the current users
  const response = await get_image_ids_for_user_ids(
    Object.values(players).map((item) => item["name"])
  );

  const image_ids = response.map((element) => element.filename);

  // Randomly select images according to max_rounds
  const selected_image_ids = getRandomElements(image_ids, max_rounds);

  return selected_image_ids;
}
