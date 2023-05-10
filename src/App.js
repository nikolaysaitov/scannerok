import React, { useState, useEffect } from "react";
import axios from "axios";
import ImagePreview from "./ImagePreview";
import ImagePreviewGet from "./ImagePreviewGet";
import "./App.css";
import open from "./images/open.svg";
import add from "./images/add.svg";
import deletes from "./images/delete.svg";
import ok from "./images/ok.svg";
import MyLoader from "./MyLoader";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [previewImage, setPreviewImage] = useState(null); // добавляем новое состояние
  const [previewImageUrl, setPreviewImageUrl] = useState(null); // добавляем новое состояние
  const [fileNameDefault, setFileNameDefault] = useState("scannerok");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [error, setError] = useState(false);

  const handleFileChange = (event) => {
    setError(false);
    setSelectedFile(event.target.files[0]);
  };

  const handleDeleteClick = () => {
    setSelectedFile(null);
    setPreviewImageUrl(null);
    setRotation(0); // сбрасываем угол поворота при удалении файла
    setError(false);
    setFileNameDefault("");
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
        url: "http://192.168.104.198:9000/api/image/crop",
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
          setError(true);
        });
    }
  }, [selectedFile]);

  console.log("previewImageUrl:", previewImageUrl);

  const handleSendClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(previewImageUrl);
      const blob = await response.blob();
      const date = new Date();
      const dateString = date.toLocaleString("ru-RU", { timeZone: "Europe/Moscow", hour12: false }).replace(/[:]/g, "-");
      const fileName = `${fileNameDefault}_${dateString}.jpg`;
      const formData = new FormData();
      formData.append("file", blob, fileName);

      const config = {
        method: "post",
        url: "http://192.168.104.198:9000/api/storage/save",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      const result = await axios(config);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
    setTimeout(() => {
      handleDeleteClick(); 
    }, 3000);
  };

  return (
    <div className="scan_main">
      <div>
        <h3>scannerok 0.1</h3>
      </div>
      <div className="button__block">
        {/* <button className="button__open">
          Open
          <img className="button__open__icon" src={open} alt="open" />
        </button> */}
        <label className="button__add">
          <img className="button__add__icon" src={add} alt="add" />
          Scan document
          <input className="button__add__input" type="file" onChange={handleFileChange} />
        </label>
        <div className="button__block__lr">
          <button className="button__left" onClick={handleLeftRotateClick}></button>
          <button className="button__right" onClick={handleRightRotateClick}></button>
        </div>
        <button className="button__delete" onClick={handleDeleteClick} disabled={!selectedFile}>
          <img className="button__delete__icon" src={deletes} alt="delete" />
          Delete
        </button>
      </div>

      {!error ? (
        <div className="preview__block">{previewImageUrl ? <ImagePreview file={selectedFile} rotation={rotation} /> : <MyLoader />}</div>
      ) : (
        <div className="error__block">
          <h2 className="error__message">Упсс...Попробуйте что-нибудь другое!</h2>
        </div>
      )}

      {previewImageUrl ? (
        <div className="button__block radio-buttons">
          <input type="radio" id="contactChoice1" name="contact" value="scan" defaultChecked />
          <label htmlFor="contactChoice1">Scan</label>

          <input type="radio" id="contactChoice2" name="contact" value="scan_color" />
          <label htmlFor="contactChoice2">Scan color</label>

          <input type="radio" id="contactChoice3" name="contact" value="jpeg" />
          <label htmlFor="contactChoice3">JPEG</label>
        </div>
      ) : null}

      <div className="preview__block">{previewImageUrl ? <ImagePreviewGet src={previewImageUrl} rotation={rotation} /> : null}</div>

      {previewImageUrl ? (
        <div className="submit__block">
          <div className="submit__block__input">
            <label className="submit__block__save" htmlFor="file-name-input">Сохранить как:</label>
            <input
            className="submit__block__input__in"
              type="text"
              placeholder="Имя файла(необязательно)"
              defaultValue={fileNameDefault}
              onChange={(e) => setFileNameDefault(e.target.value)}
            />
          </div>

          <button className={`button__submit ${isSent ? 'sent' : ''}`}  disabled={!selectedFile} onClick={handleSendClick}>
            <img className="button__ok__icon" src={ok} alt="ok" />
            {isSent ? "Отправлено" : isLoading ? "Загрузка" : "Отправить"}
          </button>
         

        </div>
      ) : null}
    </div>
  );
}

export default App;
