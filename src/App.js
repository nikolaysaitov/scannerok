import React, { useState, useEffect } from "react";
import axios from "axios";
import ImagePreview from "./ImagePreview";
import "./App.css";
import open from "./images/open.svg";
import add from "./images/add.svg";
import deletes from "./images/delete.svg";
import ok from "./images/ok.svg";
import testImg from "./test.js"


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [previewImage, setPreviewImage] = useState(null); // добавляем новое состояние
  const [previewImageUrl, setPreviewImageUrl] = useState(null); // добавляем новое состояние

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDeleteClick = () => {
    setSelectedFile(null);
    setRotation(0); // сбрасываем угол поворота при удалении файла
  };

  const handleLeftRotateClick = () => {
    setRotation(rotation - 90);
  };

  const handleRightRotateClick = () => {
    setRotation(rotation + 90);
  };

  useEffect(() => {
    if (selectedFile) {
      console.log("Выбранные файлы:", selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const config = {
        method: "post",
        url: "http://192.168.104.198:9000/image/crop",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        responseType: "arraybuffer",

      };

      axios(config)
        .then((response) => {
          console.log("Response.data:", response.data);
          const imageBytes = new Uint8Array(response.data);
          setPreviewImageUrl(URL.createObjectURL(new Blob([imageBytes], { type: "image/jpeg" })));
        })
        .catch((error) => {
          console.log(error);
        });



        // axios(config)
        // .then((response) => {
        //   console.log("Response.data:", response.data);

        //   const canvas = document.createElement('canvas');
        //   canvas.width = 800;
        //   canvas.height = 600;
        //   const ctx = canvas.getContext('2d');
        //   ctx.fillStyle = 'red';
        //   ctx.fillRect(0, 0, canvas.width, canvas.height);
        //   // Получаем данные изображения в формате JPEG
        //   const jpegImageData = canvas.toDataURL('image/jpeg', 0.9);
        //   // Преобразуем строку base64 в бинарные данные
        //   const binaryImageData = atob(jpegImageData.split(',')[1]).split('').map(char => char.charCodeAt(0));
        //   console.log(binaryImageData);
        //   const imageBytes = new Uint8Array(binaryImageData);
        //   setPreviewImageUrl(URL.createObjectURL(new Blob([imageBytes], { type: "image/jpeg" })));
        // })
        // .catch((error) => {
        //   console.log(error);
        // });



    }
  }, [selectedFile]);


  console.log("previewImageUrl:", previewImageUrl);

  const handleSendClick = () => {
    const formData = new FormData();
    formData.append("file", new Blob([previewImage], { type: "image/jpeg" }));

    const config = {
      method: "post",
      url: "http://192.168.104.198:9000/storage/save",
      headers: {
        "Content-Type": "image/jpeg",
      },
      data: formData,
    };

    axios(config)
      .then((response) => {
        console.log(response.data);
        // handle success
      })
      .catch((error) => {
        console.log(error);
        // handle error
      });
  };

  return (
    <div className="scan_main">
      <div>
        <h3>scannerok 0.1</h3>
      </div>
      <div className="button__block">
        <button className="button__open">
          Open
          <img className="button__open__icon" src={open} alt="open" />
        </button>
        {/* <form onSubmit={handleSubmit}> */}
        <label className="button__add">
          <img className="button__add__icon" src={add} alt="add" />
          Add
          <input className="button__add__input" type="file" onChange={handleFileChange} />
        </label>
        {/* </form> */}
        <div className="button__block__lr">
          <button className="button__left" onClick={handleLeftRotateClick}></button>
          <button className="button__right" onClick={handleRightRotateClick}></button>
        </div>
        <button className="button__delete" onClick={handleDeleteClick} disabled={!selectedFile}>
          <img className="button__delete__icon" src={deletes} alt="delete" />
          Delete
        </button>
      </div>

      <div className="preview__block">
        <ImagePreview file={selectedFile} rotation={rotation} />
      </div>
      

      <div className="button__block radio-buttons">
        <input type="radio" id="contactChoice1" name="contact" value="scan" defaultChecked />
        <label htmlFor="contactChoice1">Scan</label>

        <input type="radio" id="contactChoice2" name="contact" value="scan_color" />
        <label htmlFor="contactChoice2">Scan color</label>

        <input type="radio" id="contactChoice3" name="contact" value="jpeg" />
        <label htmlFor="contactChoice3">JPEG</label>
      </div>
      <div className="preview__block">
        <img src={previewImageUrl} alt="preview" />
      
      </div>

      <button className="button__submit" disabled={!selectedFile} onClick={handleSendClick}>
        <img className="button__ok__icon" src={ok} alt="ok" />
        Отправить
      </button>
    </div>
  );
}

export default App;
