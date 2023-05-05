import React from "react";

function ImagePreviewGet({ image }) {
    return (
      <div className="preview__get">
        {image && <img src={image} alt="preview"/>}
      </div>
    );
  }

export default ImagePreviewGet;

