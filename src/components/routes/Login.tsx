import styled from "@emotion/styled";
import OAuth2Login from "react-simple-oauth2-login";
import { getToken, OAuth2SuccessResponse } from "../../modules/api/auth";
import { useStoreActions, useStoreState } from "../../store";

export function Login() {
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);

  async function onSuccess(res: OAuth2SuccessResponse) {
    const token = await getToken({
      authToken: res.access_token,
      service: "discord",
      jwt: undefined,
    });
    const { jwt, user } = token;
    setToken(jwt);
    setUser(user);
  }

  function onFailure(err: any) {
    console.log("Error", err);
  }

  return (
    <div>
      <h1>Login with Discord</h1>
      <LoginButton
        authorizationUrl="https://discord.com/api/oauth2/authorize"
        responseType="token"
        clientId="793619250115379262"
        redirectUri={`${window.location.protocol}//${window.location.host}/discord`}
        scope="identify"
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
}

const LoginButton = styled(OAuth2Login)`
  background: lightblue;
  padding: 5px 15px;
  border-radius: 4px;
`;
