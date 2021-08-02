import { Box, Container, Image } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "./modules/api/auth";
import { useTop20 } from "./modules/api/music";

const Top20: React.FC<{ org: string; type: "w" | "m" }> = ({ org, type }) => {
  const [top20] = useTop20({ org, type });

  if (!top20) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <h1>Top20</h1>
      {top20.map((music) => (
        <Box
          key={music.video_id + music.start}
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
        >
          <Image src={music.art} alt={music.name} />

          <Box p="6">
            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {music.name}
            </Box>

            <Box>{music.original_artist}</Box>

            <Box d="flex" mt="2" alignItems="center">
              <Box as="span" ml="2" color="gray.600" fontSize="sm">
                {music.frequency} plays
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </div>
  );
};

function Header() {
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <header>
      {isLoggedIn ? (
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <a href="/login">Login</a>
        </div>
      )}
      {user && <h3>{user.username}</h3>}
    </header>
  );
}

function App() {
  return (
    <Container>
      <Header />
      <Top20 org="Hololive" type="w" />
    </Container>
  );
}

export default App;
