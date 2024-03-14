import * as React from "react";
import { Analytics } from "@vercel/analytics/react";
import Form from "./components/Form";
import { Button, Link } from "@nextui-org/react";

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
            <i className="devicon-github-original"></i> View on Github
          </a>
        </h4>
      </>
    );
  };

  // Main Image of Website. Onclick will re-navigate to the website
  const TitleImage = () => {
    return (
      <a
        href="https://links.aryanranderiya.com"
        className="w-screen flex justify-center"
      >
        <img src="banner.png" alt="Project Banner" width="35%"></img>
      </a>
    );
  };

  return (
    <>
      <Analytics /> {/* Vercel Analytics */}
      <div className="h-screen w-screen flex flex-col justify-center items-center text-white">
        <TitleImage />
        <Form />
        <BottomText />
      </div>
    </>
  );
}

export default App;
