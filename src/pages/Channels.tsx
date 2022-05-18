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
import { Link as NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Channels() {
  //   let params = useParams();
  const org = useStoreState((store) => store.org.currentOrg);
  const {
    data: channelPages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    ...rest
  } = useChannelListForOrg(org.name);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [status, isFetchingNextPage, fetchNextPage, hasNextPage]);
  // continuously fetch until drained.

  const { t, i18n } = useTranslation();

  //   const { data: song, ...rest } = useSong(songId);

  const channels = useMemo(() => {
    return new Array<Channel>().concat(...(channelPages?.pages || [[]]));
  }, [channelPages]);

  const channelsGrouped = useMemo(() => {
    return groupBy(channels, (c) => (c as any).group || "");
  }, [channels]);

  const groups = useMemo(() => {
    function onlyUnique(value: any, index: any, self: string | any[]) {
      return self.indexOf(value) === index;
    }
    return channels.map((x) => (x as any).group || "").filter(onlyUnique);
  }, [channels]);

  return (
    <PageContainer>
      <Helmet>
        <title>{t("{{org}} Channels", { org: org.name })} - Musicdex</title>
      </Helmet>
      <ContainerInlay>
        <HStack mb={3}>
          <Link as={NavLink} to={"/"}>
            <IconButton
              as={FiArrowLeft}
              aria-label="Home"
              variant="ghost"
              size="sm"
            />
          </Link>
          <Heading size="lg">
            {t("{{org}} Channels", { org: org.name })}
          </Heading>
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
