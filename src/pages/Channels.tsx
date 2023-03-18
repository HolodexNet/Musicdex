import {
  Box,
  Heading,
  HStack,
  IconButton,
  Link,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import groupBy from "lodash-es/groupBy";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";
import { ChannelCard } from "../components/channel/ChannelCard";
import { QueryStatus } from "../components/common/QueryStatus";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { useChannelListForOrg } from "../modules/services/channels.service";
import { useStoreState } from "../store";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useFavorites } from "../modules/services/favorite.service";

export default function Channels({ type }: { type: "org" | "favorites" }) {
  const storeOrg = useStoreState((store) => store.org.currentOrg);
  const { org: paramOrg } = useParams();
  const org = paramOrg || storeOrg.name;
  const {
    data: channelPages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    ...rest
  } = useChannelListForOrg(org, { enabled: type === "org" });

  const { data: favoriteChannels, isLoading } = useFavorites({
    enabled: type === "favorites",
  });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [status, isFetchingNextPage, fetchNextPage, hasNextPage]);
  // continuously fetch until drained.

  const { t, i18n } = useTranslation();

  //   const { data: song, ...rest } = useSong(songId);

  const pageTitle = useMemo(
    () =>
      type === "org" ? t("{{org}} Channels", { org }) : t("Favorite Channels"),
    [type, org, t],
  );

  const channels = useMemo(() => {
    // return new Array<Channel>().concat(...(channelPages?.pages || [[]]));
    return type === "org"
      ? [...(channelPages?.pages.flat() || [])]
      : [...(favoriteChannels ?? [])];
  }, [type, channelPages, favoriteChannels]);

  const channelsGrouped = useMemo(() => {
    return groupBy(channels, (c) => (c as any).group || "");
  }, [channels]);

  const groups = useMemo(() => {
    function onlyUnique(value: any, index: any, self: string | any[]) {
      return self.indexOf(value) === index;
    }
    return channels.map((x) => (x as any).group || "").filter(onlyUnique);
  }, [channels]);

  const navigate = useNavigate();
  return (
    <PageContainer>
      <Helmet>
        <title>{pageTitle} - Musicdex</title>
      </Helmet>
      <ContainerInlay>
        <HStack mb={3}>
          <IconButton
            as={FiArrowLeft}
            aria-label="Home"
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            _hover={{ cursor: "pointer" }}
          />
          <Heading size="lg">{pageTitle}</Heading>
        </HStack>
        <Box>
          <QueryStatus queryStatus={rest} />
          {channelsGrouped &&
            groups &&
            groups.map((g) => {
              return (
                <Box key={"g-" + g}>
                  <Heading size="md" my={3} key={"he-" + g}>
                    {g}
                  </Heading>
                  <Wrap>
                    {channelsGrouped[g]?.map((x) => {
                      return (
                        <WrapItem>
                          <ChannelCard
                            channel={x}
                            key={"c-card" + x.id}
                            margin={1}
                          />
                        </WrapItem>
                      );
                    })}
                  </Wrap>
                </Box>
              );
            })}
        </Box>
      </ContainerInlay>
    </PageContainer>
  );
}
