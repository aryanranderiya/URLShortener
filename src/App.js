import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function Form() {
  const [appData, setAppData] = useState({
    shortURL: "",
    longURL: "",
  });

  const onSubmit = (e) => {
    axios
      .post("/connect", appData)
      .then((data) => console.log(data.data))
      .catch((error) => console.log(error));
  };

  const onChangeData = (e) => {
    setAppData({
      ...appData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <h1>URL Shortener</h1>
      <form className="form" onSubmit={() => onSubmit}>
        <input
          type="url"
          placeholder="Enter long URL to shorten:"
          value={appData.longURL}
          name="longURL"
          onChange={onChangeData}
          required
        ></input>

        <input
          type="url"
          placeholder="Enter short URL:"
          value={appData.shortURL}
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
