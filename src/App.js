import "./App.css";
import React, { useState } from "react";
import { nanoid } from "nanoid";

function Form() {
  const [numberCharacters, setNumberCharacters] = useState(5);

  const final_url = document.querySelector(".final_url");

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
      final_url.style.opacity = "1";
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
    final_url.style.opacity = "0";
  };

  return (
    <>
      <h1>URL Shortener</h1>
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
        <label for="scrubber">Number of Characters: {numberCharacters}</label>
        <input
          type="range"
          min="5"
          max="20"
          step="1"
          defaultValue="5"
          id="scrubber"
          list="markers"
          value={numberCharacters}
          onChange={onScrub}
        ></input>

        <datalist id="markers">
          <option value="0"></option>
          <option value="25"></option>
          <option value="50"></option>
          <option value="75"></option>
          <option value="100"></option>
        </datalist>

        <input type="submit" className="submit_btn"></input>
      </form>
      <h5 className="final_url">
        Your URL is: http://localhost:5000/l/{formData.shortURL}
      </h5>
    </>
  );
}

function App() {
  return <Form />;
}

export default App;
