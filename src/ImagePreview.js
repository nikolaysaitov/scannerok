import React from "react";

function ImagePreview({ file, rotation }) {
  if (!file) {
    return null;
  }

  const imageUrl = URL.createObjectURL(file);

  return (
    <div className="image__preview" style={{ transform: `rotate(${rotation}deg)` }}>
      <img className="img_size" src={imageUrl} alt="preview" />
    </div>
  );
}

export default ImagePreview;
