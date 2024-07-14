import axios from "axios";

const URL = "http://localhost:3005";

export const get_image_ids_for_user_ids = async (user_ids) => {
  try {
    const dataReceived = await axios.get(URL + "/api/image_ids/" + user_ids);
    return dataReceived.data;
  } catch (err) {
    console.log("error in the get request", err);
  }
};
