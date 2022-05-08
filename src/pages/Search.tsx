import {
  Box,
  Button,
  CloseButton,
  Heading,
  HStack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import {
  SearchParams,
  useSongSearch,
} from "../modules/services/search.service";
import { useSongQueuer } from "../utils/SongQueuerHook";
import { FiFilter } from "react-icons/fi";
import {
  AdvancedSearchProps,
  AdvancedSearchFiltersForm,
} from "../components/nav/AdvancedSearchComponent";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

export interface SearchableSong extends Song {
  channel_org?: string;
  channel_suborg?: string;
}

export default function Search() {
  const { t } = useTranslation();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const queueSongs = useSongQueuer();
  const qObj: Partial<SearchParams<SearchableSong>> = Object.fromEntries(
    search.entries()
  );
  if (qObj?.q?.length === 0 || qObj?.q?.trim()?.length === 0) {
    delete qObj.q;
  }
  const { data: searchResult, ...rest } = useSongSearch<SearchableSong>({
    q: " ",
    query_by:
      "name, channel_name, channel_english_name, original_artist, channel_org, channel_suborg, title",
    sort_by: "_text_match:desc,available_at:desc",
    ...qObj,
    facet_by: "channel_org, is_mv, channel_suborg",
    // filter_by: "original_artist: doriko",
  });

  function doSearch(queryNew: Partial<SearchParams<Song>> = {}) {
    navigate({
      pathname: "/search",
      search: `?${createSearchParams({
        q: qObj.q || "*",
        ...qObj,
        ...queryNew,
      } as any)}`,
    });
  }

  const songs = useMemo(() => {
    return searchResult?.hits?.map((doc) => {
      return doc.document;
    });
  }, [searchResult]);

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Search")} - Musicdex</title>
      </Helmet>
      <AdvancedSearchFilters
        facets={searchResult?.facet_counts}
      ></AdvancedSearchFilters>
      <QueryStatus queryStatus={rest} />
      <Suspense fallback={<div></div>}>
        <HStack align="end" my={2}>
          <Heading size="lg">
            {t("Search")}: "{qObj.q || ""}"
          </Heading>
          <Button
            variant="ghost"
            size="sm"
            py={0}
            colorScheme="n2"
            float="right"
            onClick={() => {
              queueSongs({ songs: songs || [], immediatelyPlay: false });
            }}
          >
            {t("Queue ({{amount}})", { amount: (songs && songs.length) || 0 })}
          </Button>
        </HStack>
        <Suspense fallback={<div>{t("Loading...")}</div>}>
          {songs && <SongTable songs={songs} />}
        </Suspense>

        {searchResult && (
          <HStack spacing={3} my={3}>
            <Button
              disabled={searchResult?.page <= 1}
              onClick={() =>
                searchResult?.page > 1 &&
                doSearch({ page: searchResult?.page - 1 })
              }
            >
              {t("Prev")}
            </Button>
            <Text>
              {t("({{ from }} - {{ to }} of {{ total }})", {
                from: (searchResult?.page || 0) * 10 - 9,
                to: (searchResult?.page || 0) * 10 - 10 + (songs?.length || 0),
                total: searchResult?.found || 0,
              })}
            </Text>

            <Button
              disabled={
                searchResult?.page * 10 + (songs?.length || 0) - 10 >=
                searchResult?.found
              }
              onClick={() =>
                searchResult?.page >= 1 &&
                doSearch({ page: searchResult?.page + 1 })
              }
            >
              {t("Next")}
            </Button>
          </HStack>
        )}
      </Suspense>
    </PageContainer>
  );
}

function AdvancedSearchFilters({ ...props }: AdvancedSearchProps) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [search] = useSearchParams();

  useEffect(() => {
    const qObj: Partial<SearchParams<SearchableSong>> = Object.fromEntries(
      search.entries()
    );
    if ((qObj as any)?.advanced) {
      onOpen();
    }
  }, [onOpen, search]);

  const [id, incr] = useState(200);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      style={{
        width: isOpen ? "100%" : "120px",
        backgroundColor: isOpen ? "#222" : "transparent",
        padding: isOpen ? (isMobile ? "0.5rem" : "1.5rem") : "0px",
        borderRadius: isOpen ? (isMobile ? "0.5rem" : "1.5rem") : "auto",
        // marginLeft: "auto",
        // marginRight: "0px",
      }}
      my={4}
      // layout
      transition="all 0.4s"
    >
      {isOpen ? (
        <Box>
          <CloseButton
            onClick={onClose}
            mt="-3"
            mr="-3"
            mb="-3"
            ml="auto"
            position="relative"
          />

          <AdvancedSearchFiltersForm
            {...props}
            key={id + "search"}
            fullreset={() => incr((x) => x + 100)}
          />
        </Box>
      ) : (
        <Button w="120px" onClick={onOpen} leftIcon={<FiFilter />}>
          {t("Filter")}
        </Button>
      )}
    </Box>
  );
}
