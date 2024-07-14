import React, { useState } from 'react';

const PhotosButton = () => {
  const [photos, setPhotos] = useState(null);

  const handleFetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:8082/protected2', {
        method: 'GET',
        credentials: 'include',
      });
      ;
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPhotos(data.photos); // Assuming the response is { photos: [...] }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFetchPhotos}>Fetch Photos</button>
      {photos && (
        <ul>
          {photos}
        </ul>
      )}
    </div>
  );
};

export default PhotosButton;
