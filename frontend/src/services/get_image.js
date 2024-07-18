import axios from 'axios'; 

const data_url = "http://localhost:3005"

export const get_current_image = async (image_file) => {
    try {
        const response = await axios.get(data_url + "/api/images/" + image_file)
        console.log(response.data.filename);
        const image = response.data.image;
        return image;
    } catch(error) {
        console.error('Error fetching data:', error);
    }
};