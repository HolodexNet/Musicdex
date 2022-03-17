import { Box, BoxProps } from "@chakra-ui/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Helmet, HelmetProvider, HelmetTags } from "react-helmet-async";

const googleUrl = "https://accounts.google.com/gsi/client";
const CLIENT_ID =
  "275540829388-87s7f9v2ht3ih51ah0tjkqng8pd8bqo2.apps.googleusercontent.com";
export interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleButtonParams extends BoxProps {
  onCredentialResponse: (response: GoogleCredentialResponse) => void;
}

const GoogleButton: FunctionComponent<GoogleButtonParams> = ({
  onCredentialResponse,
  ...rest
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
        size: "medium",
        width: divRef.current.clientWidth,
      });
      // (window as any).google.accounts.id.prompt();
    }
  }, [scriptLoaded, divRef, onCredentialResponse]);

  return (
    <>
      <HelmetProvider>
        <Helmet onChangeClientState={handleChangeClientState}>
          <script src={googleUrl} async defer />
        </Helmet>
      </HelmetProvider>
      <Box ref={divRef} {...rest} />
    </>
  );
};

export default GoogleButton;
