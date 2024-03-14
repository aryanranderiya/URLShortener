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
import ModalComponent from "./Modal";

export default function Form() {
  const [numberCharacters, setNumberCharacters] = useState(5); // No. of Characters of the Short text
  const [longURL, setLongURL] = useState("");
  const [shortURL, setShortURL] = useState(nanoid(numberCharacters));
  const [finalURL, setFinalURL] = useState(null); // Final generated URL
  const [expireAfterSeconds, setExpireAfterSeconds] = useState("null");
  const [isValidURL, setValidURL] = useState(true);
  const [openModel, setOpenModel] = useState(false);

  // Form Data that is to be passed to insert into database
  const [formData, setFormData] = useState({
    shortURL: shortURL,
    longURL: longURL,
    expireAfterSeconds: expireAfterSeconds,
  });

  // Set the Short URL based on the users input
  const onChangeData_ShortURL = (e) => {
    changeShortURL(e.target.value);
  };

  // onChange of Scrubber (input type=range)
  const onScrub = (e) => {
    if (e !== numberCharacters) changeShortURL(nanoid(e));
  };

  function changeShortURL(value) {
    setShortURL(value);
    setNumberCharacters(value.length);
    setFormData({
      ...formData,
      shortURL: value,
    });
  }

  const onChangeData_LongURL = (e) => {
    setLongURL(e.target.value);

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    setValidURL(urlRegex.test(e.target.value));

    if (isValidURL) {
      // Set the values for the form data
      setFormData({
        ...formData,
        longURL: e.target.value,
      });
    }
  };

  const handleSelectionChange = (e) => {
    setExpireAfterSeconds(e.target.value);
    setFormData({
      ...formData,
      expireAfterSeconds: e.target.value,
    });
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

    setOpenModel(false);

    if (shortURL === "") changeShortURL(nanoid(5));

    if (formData.longURL !== "")
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
          setOpenModel(true);
          // If response = ok then set the final url state
          setFinalURL(
            "https://links.aryanranderiya.com/l/" + formData.shortURL
          );
          // Set the final url text visible for the user to copy
        }
      } catch (error) {
        console.error("Error: ", error);
        alert(error.message || "Server Error Occured!");
      }
    else {
      setValidURL(false);
    }
  };

  React.useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Main Return of the "Form"
  return (
    <>
      <form
        className="form flex flex-col gap-4"
        onSubmit={onSubmit}
        style={{ width: "30vw" }}
      >
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
            className="w-full"
            size="md"
            color={!isValidURL ? "danger" : ""}
            errorMessage={!isValidURL && "Please enter a valid URL"}
            isClearable
            onClear={() => {
              setLongURL("");
              setValidURL(false);
            }}
          />
        </Tooltip>

        <Tooltip
          content={
            <>
              Shortened would be:
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
            size="md"
          />
        </Tooltip>

        <Tooltip
          content="Set the Number of Characters in the Short Link by dragging the slider"
          offset={20}
          placement="right-end"
          showArrow
          color="default"
        >
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
        </Tooltip>

        <SelectInput />

        <input
          type="submit"
          value={"Shorten URL"}
          className="p-3"
          style={{
            backgroundColor: "#00bbff",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        ></input>
      </form>

      <ModalComponent
        flag={openModel}
        finalURL={finalURL}
        expireAfterSeconds={expireAfterSeconds}
      />
    </>
  );
}
