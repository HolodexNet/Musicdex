import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";
import { QueryStatus } from "../components/common/QueryStatus";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { useStoreState } from "../store";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAllPlaylistDiscovery } from "../modules/services/discovery.service";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { LazyLoad } from "../components/common/LazyLoad";

export default function Channels({ type }: { type: "ugp" | "sgp" | "radio" }) {
  const { t, i18n } = useTranslation();
  const storeOrg = useStoreState((store) => store.org.currentOrg);
  const { org: paramOrg } = useParams();
  const org = paramOrg || storeOrg.name;

  const {
    data: playlistPages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    ...rest
  } = useAllPlaylistDiscovery(org, type);

  const pageTitle = useMemo(() => {
    switch (type) {
      case "ugp":
        return t("{{org}} Community Playlists", { org });
      case "radio":
        return t("{{org}} Radios", { org });
      default:
        return t("{{org}} Playlists", { org });
    }
  }, [org, t, type]);

  const playlists = useMemo(
    () =>
      playlistPages?.pages.reduce<PlaylistStub[]>(
        (prev, curr) => prev.concat(curr || []),
        []
      ),
    [playlistPages]
  );
  const navigate = useNavigate();
  return (
    <PageContainer>
      <Helmet>
        <title>{pageTitle} - Musicdex</title>
      </Helmet>
      <ContainerInlay>
        <HStack
          pb={3}
          pt={1}
          position="sticky"
          top={0}
          bgColor="bg.900"
          zIndex={5}
        >
          <IconButton
            as={FiArrowLeft}
            aria-label="Home"
            variant="ghost"
            size="sm"
            mx={1}
            onClick={() => navigate(-1)}
          />
          <Heading size="lg">{pageTitle}</Heading>
        </HStack>
        <Box>
          <QueryStatus queryStatus={rest} />
          <Grid
            templateColumns="repeat(auto-fit, 180px)"
            columnGap={2}
            rowGap={2}
          >
            {playlists?.map((p: Partial<PlaylistFull>) => (
              <PlaylistCard playlist={p} key={"rec" + p.id} />
            ))}
          </Grid>
          {hasNextPage && !isFetchingNextPage && (
            <Flex justifyContent={"center"} my={2}>
              <Button colorScheme="n2" onClick={() => fetchNextPage()}>
                Load More
              </Button>
            </Flex>
          )}
        </Box>
      </ContainerInlay>
    </PageContainer>
  );
}
