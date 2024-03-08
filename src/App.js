import "./App.css";
import React, { useState } from "react";

function Form() {
  const [formData, setFormData] = useState({
    shortURL: "",
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

        <input type="submit" className="submit_btn"></input>
      </form>
    </>
  );
}

function App() {
  return <Form />;
}

export default App;
