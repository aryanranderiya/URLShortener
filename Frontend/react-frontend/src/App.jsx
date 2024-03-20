import * as React from "react";
import { Analytics } from "@vercel/analytics/react";
import Form from "./components/Form";
import { Chip } from "@nextui-org/react";

function App() {
  // Subtext of "Made By" & "View on Github"
  const BottomText = () => {
    return (
      <>
        <div className="subtitle flex flex-col gap-4">
          <a
            href="https://github.com/aryanranderiya/URLShortener"
            target="_blank"
            rel="noreferrer"
          >
            <Chip
              color="default"
              variant="faded"
              radius="full"
              endContent={<i className="devicon-github-original"></i>}
            >
              View Github Repository
            </Chip>
          </a>

          <a href="https://aryanranderiya.com" className="subtitle_color">
            <Chip
              color="primary"
              variant="bordered"
              radius="full"
              style={{ borderColor: "#00bbff", color: "#00bbff" }}
            >
              Made with 🤍 by Aryan Randeriya
            </Chip>
          </a>
        </div>
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
        <img
          src="banner.png"
          alt="Project Banner"
          className="h-auto max-w-md px-6"
        ></img>
      </a>
    );
  };

  return (
    <>
      <Analytics /> {/* Vercel Analytics */}
      <div className="h-screen w-screen flex flex-col justify-center items-center text-center dark text-foreground bg-background">
        <TitleImage />
        <Form />
        <br></br>
        <BottomText />
      </div>
    </>
  );
}

export default App;
