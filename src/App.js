import "./App.css";
import React, { useState } from "react";
import { nanoid } from "nanoid";

function Form() {
  const [numberCharacters, setNumberCharacters] = useState(5);
  const [finalURL, setFinalURL] = useState(null);
  const [formData, setFormData] = useState({
    shortURL: nanoid(5),
    longURL: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setFinalURL("http://localhost:3000/l/" + formData.shortURL);
      document.querySelector(".final_url").style.visibility = "visible";
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onScrub = (e) => {
    setNumberCharacters(e.target.value);
    setFormData({
      ...formData,
      shortURL: nanoid(numberCharacters),
    });
    document.querySelector(".final_url").style.visibility = "hidden";
  };

  const copyUrl = () => {
    alert("URL Copied! ", finalURL);
    navigator.clipboard.writeText(finalURL);
  };
  const handleReload = () => {
    window.location.reload();
  };
  return (
    <>
      <h1 className="title" onClick={handleReload}>
        URL Shortener
      </h1>
      <form className="form" onSubmit={onSubmit}>
        <input
          key="longURL"
          type="url"
          placeholder="Enter long URL to shorten:"
          value={formData.longURL}
          name="longURL"
          onChange={onChangeData}
          required
        ></input>

        <input
          key="shortURL"
          type="text"
          placeholder="Enter short URL:"
          value={formData.shortURL}
          name="shortURL"
          onChange={onChangeData}
          required
        ></input>

        <br />
        <label htmlFor="scrubber">
          Number of Characters: {numberCharacters}
        </label>
        <input
          type="range"
          min="5"
          max="20"
          step="1"
          id="scrubber"
          list="markers"
          value={numberCharacters}
          onChange={onScrub}
        ></input>

        <datalist id="markers">
          <option value="1"></option>
          <option value="5"></option>
          <option value="9"></option>
          <option value="13"></option>
          <option value="17"></option>
          <option value="20"></option>
        </datalist>

        <input type="submit" className="submit_btn" value="Shorten URL"></input>
      </form>
      <h3 className="final_url" onClick={copyUrl}>
        Your URL is: &nbsp; {finalURL}
        <img src="clipboard.svg" width="30px" alt="copy text"></img>
      </h3>
    </>
  );
}

function App() {
  return <Form />;
}

export default App;
