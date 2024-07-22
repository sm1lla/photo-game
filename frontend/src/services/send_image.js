import axios from 'axios'; 

const data_url = "http://localhost:3005"

export const send_image = async (image_file) => {
    const formData = new FormData();
    formData.append('file', image_file);
    try {
        const response = await axios.post(data_url + "/api/images/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        });
        console.log('File uploaded successfully:', response.data);
    } catch(error) {
        console.error('Error uploading file:', error);
    }
};
