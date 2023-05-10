import React from "react";

function ImagePreviewGet({ src, rotation }) {



  return (
    <div className="image__preview" style={{ transform: `rotate(${rotation}deg)` }}>
      <img className="img_size" src={src} alt="preview" />
    </div>
  );
}

export default ImagePreviewGet;
