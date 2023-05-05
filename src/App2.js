// import React, { useState } from "react";
// import axios from "axios";
// import ImagePreview from "./ImagePreview"; // импортируем компонент ImagePreview
// import "./App.css";
// import open from "./images/open.svg";
// import add from "./images/add.svg";
// import deletes from "./images/delete.svg";

// function App() {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [previewSources, setPreviewSources] = useState([]);

//   const handleFileInputChange = (event) => {
//     const files = event.target.files;
//     const previewUrls = [];

//     Array.from(files).forEach((file) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         previewUrls.push(reader.result);
//         setPreviewSources([...previewUrls]);
//       };
//     });

//     // Добавляем новые файлы к уже выбранным
//     setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
//   };

//   const handleDeleteFile = (file) => {
//     setSelectedFiles((prevSelectedFiles) => prevSelectedFiles.filter((selectedFile) => selectedFile !== file));
//     setPreviewSources((prevPreviewSources) => prevPreviewSources.filter((previewSource) => previewSource.name !== file.name));
//   };

//   const handleFileUpload = () => {
//     const formData = new FormData();
//     console.log("Выбранные файлы:", selectedFiles);
//     for (let i = 0; i < selectedFiles.length; i++) {
//       formData.append("files", selectedFiles[i]);
//     }
//     console.log("formData:", formData);
//     axios
//       .post("/api/upload", formData)
//       .then((response) => {
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   console.log("previewSources:", previewSources);
//   console.log("selectedFiles:", selectedFiles);

//   return (
//     <div className="scan_main">
//      <h1>Сканерок 1.0</h1>
//       <input className="input_s" type="file" onChange={handleFileInputChange} multiple />
//       <button className="button_s" onClick={handleFileUpload}>
//         Загрузить
//       </button>
//       <div className="preview_zone">
//         {selectedFiles.map((file, index) => (
//           <ImagePreview
//             key={file.name}
//             imageSource={URL.createObjectURL(file)}
//             onDelete={() => handleDeleteFile(file)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;
