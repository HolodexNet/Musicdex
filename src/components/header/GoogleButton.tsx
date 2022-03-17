import { Box, Button, Center, Text } from "@chakra-ui/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Helmet, HelmetProvider, HelmetTags } from "react-helmet-async";
import { FaGoogle } from "react-icons/fa";

const googleUrl = "https://accounts.google.com/gsi/client";
const CLIENT_ID =
  "275540829388-87s7f9v2ht3ih51ah0tjkqng8pd8bqo2.apps.googleusercontent.com";
export interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleButtonParams {
  onCredentialResponse: (response: GoogleCredentialResponse) => void;
}

const GoogleButton: FunctionComponent<GoogleButtonParams> = ({
  onCredentialResponse,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(
    typeof window !== "undefined" &&
      typeof (window as any).google !== "undefined"
  );
  const divRef = React.createRef<HTMLDivElement>();

  // Helmet does not support the onLoad property of the script tag, so we have to manually add it like so
  const handleChangeClientState = (newState: any, addedTags: HelmetTags) => {
    if (addedTags && addedTags.scriptTags) {
      const foundScript = addedTags.scriptTags.find(
        ({ src }) => src === googleUrl
      );
      if (foundScript) {
        foundScript.addEventListener("load", () => setScriptLoaded(true), {
          once: true,
        });
      }
    }
  };

  useEffect(() => {
    if (scriptLoaded && divRef.current) {
      (window as any).google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: onCredentialResponse,
      });
      (window as any).google.accounts.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
        width: divRef.current.clientWidth,
      });
      // (window as any).google.accounts.id.prompt();
    }
  }, [scriptLoaded, divRef, onCredentialResponse]);

  const triggerGoogleLogin = () => {
    if (divRef.current) {
      const button = divRef.current.querySelector(
        "div[role=button]"
      ) as HTMLDivElement;
      if (button) {
        button.click();
      }
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet onChangeClientState={handleChangeClientState}>
          <script src={googleUrl} async defer />
        </Helmet>
      </HelmetProvider>
      {/* Hidden google button, and use our proxy click through our button instead */}
      <Box ref={divRef} display="none" />
      <Button
        w={"full"}
        colorScheme={"red"}
        leftIcon={<FaGoogle />}
        onClick={triggerGoogleLogin}
      >
        <Center>
          <Text>Login with Google</Text>
        </Center>
      </Button>
    </>
  );
};

export default GoogleButton;
