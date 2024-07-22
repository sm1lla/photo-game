import React, { useState } from 'react';
import { send_image } from './services/send_image';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleUpload = () => {
    // Handle the file upload logic here
    console.log('Files to upload:', selectedFiles[0]);
    send_image(selectedFiles[0])
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      <div>
        {selectedFiles.length > 0 && (
          <div>
            <h4>Selected files:</h4>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
