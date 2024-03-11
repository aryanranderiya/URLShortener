import "./App.css";
import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Analytics } from "@vercel/analytics/react";

function Form() {
  const [numberCharacters, setNumberCharacters] = useState(5); // No. of Characters of the Short text
  const [finalURL, setFinalURL] = useState(null); // Final generated URL

  const [formData, setFormData] = useState({
    // Form Data that is to be passed to insert into database
    shortURL: nanoid(5),
    longURL: "",
    expireAfterSeconds: null,
  });

  //
  const onChangeData = (e) => {
    // If the short URL is being changed then set state of no. of characters
    if (e.target.name === "shortURL")
      setNumberCharacters(e.target.value.length);

    // Set the values for the form data
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // If there is any updation of any inputs then hide the final url text
    document.querySelector(".final_url").style.visibility = "hidden";
  };

  // onChange of Scrubber (input type=range)
  const onScrub = (e) => {
    // Update state of number of characters
    setNumberCharacters(e.target.value);

    // Update the form's data with a generated shortURL based on the number of characters
    setFormData({
      ...formData,
      shortURL: nanoid(numberCharacters),
    });

    // If there is any updation of any inputs then hide the final url text
    document.querySelector(".final_url").style.visibility = "hidden";
  };

  // Copy the generated URL to the user's clipboard
  const copyUrl = () => {
    alert("URL Copied! ", finalURL);
    navigator.clipboard.writeText(finalURL);
  };

  // Drop Down Menu for Expiration Time
  const SelectInput = () => {
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

          {/* Values are in seconds */}
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

  // When Form is Submitted
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent the default behaviour of page reload

    try {
      // Perform POST to "/insert" for the API to capture it
      const response = await fetch("/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convert the formData to json strings
      });

      if (!response.ok) {
        // If the response is not Okay then throw a new error to propagate to the catch
        const errorData = await response.json();
        throw new Error(errorData.error);
      } else {
        // If response = ok then set the final url state
        setFinalURL("https://links.aryanranderiya.com/l/" + formData.shortURL);
        // Set the final url text visible for the user to copy
        document.querySelector(".final_url").style.visibility = "visible";
      }
    } catch (error) {
      console.error("Error: ", error);
      alert(error.message || "Server Error Occured!");
    }
  };

  // Calculate the Expiration Time based on user's expiry drop down selection
  // This is to display expiration time to the user in "final_url" class
  function calculateTime() {
    if (formData.expireAfterSeconds !== null)
      // Only calculate if expiry is not null
      return (
        "Expires at " +
        new Date(
          new Date().getTime() + formData.expireAfterSeconds * 1000 // 1000 to convert from milliseconds to seconds
        ).toString() // toString converts the date from milliseconds to a readable format
      );
    else return "Never Expires";
  }

  // Main Return of the "Form"
  return (
    <>
      <form className="form" onSubmit={onSubmit}>
        <input
          key="longURL"
          type="url"
          placeholder="Enter long URL to shorten:"
          value={formData.longURL}
          name="longURL"
          onChange={onChangeData}
          required
          size="30"
        ></input>

        <input
          key="shortURL"
          type="text"
          placeholder="Enter short URL:"
          value={formData.shortURL}
          name="shortURL"
          onChange={onChangeData}
          required
          size="20"
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
        {calculateTime()}
      </h3>
    </>
  );
}

function App() {
  // Subtext of "Made By" & "View on Github"
  const BottomText = () => {
    return (
      <>
        <h4 className="subtitle">
          Made with 💙 by&nbsp;
          <a href="https://aryanranderiya.com" className="subtitle_color">
            Aryan Randeriya
          </a>
          <br></br>
          <br></br>
          <a
            href="https://github.com/aryanranderiya/URLShortener"
            target="_blank"
            rel="noreferrer"
          >
            <i class="devicon-github-original"></i> View on Github
          </a>
        </h4>
      </>
    );
  };

  // Main Image of Website. Onclick will re-navigate to the website
  const TitleImage = () => {
    return (
      <a href="https://links.aryanranderiya.com" className="bannerimage">
        <img src="banner.png" alt="Project Banner" width="35%"></img>
      </a>
    );
  };

  return (
    <>
      <Analytics /> {/* Vercel Analytics */}
      <TitleImage />
      <Form />
      <BottomText />
    </>
  );
}

export default App;
