import { Spacer } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { useClient } from "../modules/client";

export function Header() {
  const { isLoggedIn, logout, user, LoginButton } = useClient();

  return (
    <HeaderContainer>
      <Link to="/home">Home</Link>
      <Spacer />
      <Link to="/home">Musicdex</Link>
      <Spacer />
      {isLoggedIn ? (
        <div>
          <button onClick={logout}>Logout</button>
          {user && <h3>{user.username}</h3>}
        </div>
      ) : (
        <div>
          <LoginButton />
        </div>
      )}
    </HeaderContainer>
  );
}

export const HeaderContainer = styled.div`
  background: black;
  color: white;
  display: flex;
  padding: 15px;
  justify-content: center;
`;
