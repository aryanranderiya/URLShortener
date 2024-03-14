import React, { useState } from "react";
import { nanoid } from "nanoid";
import {
  Input,
  Slider,
  Select,
  SelectItem,
  Spacer,
  Button,
  Tooltip,
} from "@nextui-org/react";

export default function Form() {
  const [numberCharacters, setNumberCharacters] = useState(5); // No. of Characters of the Short text
  const [longURL, setLongURL] = useState("");
  const [shortURL, setShortURL] = useState(nanoid(numberCharacters));
  const [finalURL, setFinalURL] = useState(null); // Final generated URL
  const [expireAfterSeconds, setExpireAfterSeconds] = useState("null");
  const [isValidURL, setValidURL] = useState(true);

  const [formData, setFormData] = useState({
    // Form Data that is to be passed to insert into database
    shortURL: shortURL,
    longURL: longURL,
    expireAfterSeconds: expireAfterSeconds,
  });

  const onChangeData_ShortURL = (e) => {
    // Set the Short URL based on the users input
    setShortURL(e.target.value);

    // If the short URL is being changed then set state of no. of characters
    setNumberCharacters(e.target.value.length);

    // Set the values for the form data
    setFormData({
      shortURL: e.target.value,
      ...formData,
    });

    // If there is any updation of any inputs then hide the final url text
    document.querySelector(".final_url").classList.add("invisible");
  };

  const onChangeData_LongURL = (e) => {
    setLongURL(e.target.value);

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    setValidURL(urlRegex.test(e.target.value));

    console.log(isValidURL);

    if (isValidURL) {
      // Set the values for the form data
      setFormData({
        longURL: e.target.value,
        ...formData,
      });
    } else {
    }

    // If there is any updation of any inputs then hide the final url text
    document.querySelector(".final_url").classList.add("invisible");
  };

  // onChange of Scrubber (input type=range)
  const onScrub = (e) => {
    // // setFormData({
    // //   ...formData,
    // //   shortURL: nanoid(numberCharacters),
    // // });

    if (e !== numberCharacters) {
      // Update state of number of characters
      setNumberCharacters(e);

      // Update the form's data with a generated shortURL based on the number of characters
      setShortURL(nanoid(e));

      // If there is any updation of any inputs then hide the final url text
      document.querySelector(".final_url").classList.add("invisible");
    }
  };

  // Copy the generated URL to the user's clipboard
  const copyUrl = () => {
    alert("URL Copied! ", finalURL);
    navigator.clipboard.writeText(finalURL);
  };

  const handleSelectionChange = (e) => {
    setExpireAfterSeconds(e.target.value);
  };

  // Drop Down Menu for Expiration Time
  const SelectInput = () => {
    // Values are in seconds
    const options = [
      { value: "null", label: "Never Expire" },
      { value: "60", label: "Expire After 1 Minute" },
      { value: "600", label: "Expire After 10 Minutes" },
      { value: "3600", label: "Expire After 1 Hour" },
      { value: "86400", label: "Expire After 1 Day" },
      { value: "604800", label: "Expire After 1 Week" },
      { value: "2629800", label: "Expire After 1 Month" },
    ];
    return (
      <>
        <Select
          label="Expires After"
          placeholder="Select an Expiration Time"
          variant="faded"
          name="expireAfterSeconds"
          onChange={handleSelectionChange}
          selectedKeys={expireAfterSeconds ? [expireAfterSeconds] : ["null"]}
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
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
        document.querySelector(".final_url").classList.remove("invisible");
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
      <form className="form flex flex-col gap-4" onSubmit={onSubmit}>
        <Tooltip
          content="This is the URL you want to shorten"
          offset={20}
          placement="right-end"
          showArrow
          color="primary"
        >
          <Input
            key="longURL"
            type="url"
            label="Long URL"
            value={longURL}
            onChange={onChangeData_LongURL}
            variant="faded"
            required
            className="text-black w-full	"
            size="md"
            color={!isValidURL ? "danger" : ""}
            errorMessage={!isValidURL && "Please enter a valid URL"}
          />
        </Tooltip>

        <Tooltip
          content={
            <>
              Shortened:
              <b>links.aryanranderiya.com/l/{shortURL}</b>
            </>
          }
          offset={20}
          placement="right-end"
          showArrow
          color="default"
        >
          <Input
            key="shortURL"
            type="text"
            label="Short URL"
            value={shortURL}
            onChange={onChangeData_ShortURL}
            variant="faded"
            required
            className="text-black"
            size="md"
          />
        </Tooltip>

        <Slider
          label={"Number of Characters"}
          maxValue={20}
          minValue={5}
          defaultValue={5}
          value={numberCharacters}
          onChange={onScrub}
          size="md"
          showTooltip
        />

        <SelectInput />

        <Input
          key="shortenURL"
          type="submit"
          value="Shorten URL"
          color="primary"
          variant="faded"
          className="text-black"
        />

        <input type="submit" value={"Shorten URL"}></input>
      </form>

      <h3 className="final_url invisible" onClick={copyUrl}>
        Your URL is: &nbsp; {finalURL}
        <img src="clipboard.svg" width="30px" alt="copy text"></img>
        {calculateTime()}
      </h3>
    </>
  );
}
