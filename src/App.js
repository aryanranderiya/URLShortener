import "./App.css";
import React, { useState } from "react";
import { nanoid } from "nanoid";

function Form() {
  const [numberCharacters, setNumberCharacters] = useState(5);
  const [finalURL, setFinalURL] = useState(null);
  const [formData, setFormData] = useState({
    shortURL: nanoid(5),
    longURL: "",
    expireAfterSeconds: null,
  });

  const handleReload = () => window.location.reload();

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

  const SelectInput = () => {
    // useEffect(() => {
    //   console.log(formData.expireAfterSeconds);
    // }, []);

    return (
      <>
        <select
          name="expireAfterSeconds"
          onChange={onChangeData}
          value={formData.expireAfterSeconds || ""}
        >
          <option value="null" default>
            Never Expire
          </option>
          <option value="5">Expire After 5 Seconds</option>
          <option value="60">Expire After 1 Minute</option>
          <option value="600">Expire After 10 Minutes</option>
          <option value="3600">Expire After 1 Hour</option>
          <option value="86400">Expire After 1 Day</option>
          <option value="604800">Expire After 1 Week</option>
          <option value="2629800">Expire After 1 Month</option>
        </select>
      </>
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      } else {
        setFinalURL("http://localhost:3000/l/" + formData.shortURL);
        document.querySelector(".final_url").style.visibility = "visible";
      }
    } catch (error) {
      console.error("Error: ", error);
      alert(error.message || "Server Error Occured!");
    }
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

        <SelectInput />

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
