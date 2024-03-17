import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link,
} from "@nextui-org/react";

export default function ModalComponent({ flag, finalURL, expireAfterSeconds }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Calculate the Expiration Time based on user's expiry drop down selection
  // This is to display expiration time to the user in the Modal
  function calculateTime() {
    if (expireAfterSeconds !== "null")
      // Only calculate if expiry is not null
      return (
        "Expires at " +
        new Date(
          new Date().getTime() + expireAfterSeconds * 1000 // 1000 to convert from milliseconds to seconds
        ).toString() // toString converts the date from milliseconds to a readable format
      );
    else return "Never Expires";
  }

  React.useEffect(() => {
    // Open the modal when the component mounts
    if (flag) onOpen();
  }, [flag, onOpen]);

  // Copy the generated URL to the user's clipboard
  const copyUrl = () => {
    navigator.clipboard.writeText(finalURL);
    alert("Copied to Clipboard!");
  };

  return (
    <>
      <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Successfully Shortened Link!
              </ModalHeader>
              <ModalBody>
                <b>{finalURL}</b>
                <br></br>
                {calculateTime()}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="ghost" onPress={onClose}>
                  Close
                </Button>

                <Button
                  href={finalURL}
                  as={Link}
                  showAnchorIcon
                  variant="solid"
                  isExternal
                />

                <Button color="primary" variant="solid" onClick={copyUrl}>
                  Copy to Clipboard
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
