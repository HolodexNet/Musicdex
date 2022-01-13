import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Suspense, useEffect, useMemo } from "react";
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
  SearchResponseFacetCountSchema,
  useSongSearch,
} from "../modules/services/search.service";
import { useForm } from "react-hook-form";
import { FiFilter, FiSearch } from "react-icons/fi";
import { BiMovie } from "react-icons/bi";
import { motion } from "framer-motion";

interface SearchableSong extends Song {
  channel_org?: string;
  channel_suborg?: string;
}

export default function Search() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const qObj: Partial<SearchParams<SearchableSong>> = Object.fromEntries(
    search.entries()
  );
  const { data: searchResult, ...rest } = useSongSearch<SearchableSong>({
    q: "",
    query_by:
      "name, channel_name, channel_english_name, original_artist, channel_org, channel_suborg, title",
    ...qObj,
    facet_by: "channel_org, is_mv, channel_suborg",
    // filter_by: "original_artist: doriko",
  });

  function doSearch(queryNew: Partial<SearchParams<Song>> = {}) {
    navigate({
      pathname: "/search",
      search: `?${createSearchParams({
        q: qObj.q,
        ...qObj,
        ...queryNew,
      } as any)}`,
    });
  }

  const songs = useMemo(() => {
    console.log(searchResult);

    return searchResult?.hits?.map((doc) => {
      return doc.document;
    });
  }, [searchResult]);

  return (
    <PageContainer>
      <AdvancedSearchFilters
        facets={searchResult?.facet_counts}
      ></AdvancedSearchFilters>
      <QueryStatus queryStatus={rest} />
      <Suspense fallback={<div></div>}>
        <HStack align="end">
          <Heading size="lg">Search: "{qObj.q || ""}"</Heading>
          <Spacer></Spacer>
          <Text>
            {(searchResult?.page || 0) * 10 - 10 + (songs?.length || 0)} out of{" "}
            {searchResult?.found}
          </Text>
        </HStack>
        <Suspense fallback={<div>Loading...</div>}>
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
              Prev
            </Button>
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
              Next
            </Button>
          </HStack>
        )}
      </Suspense>
    </PageContainer>
  );
}

function AdvancedSearchFilters({ ...props }: AdvancedSearchProps) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [search] = useSearchParams();

  useEffect(() => {
    const qObj: Partial<SearchParams<SearchableSong>> = Object.fromEntries(
      search.entries()
    );
    if ((qObj as any)?.advanced) {
      onOpen();
    }
  }, [search]);

  return (
    <Box
      style={{
        width: isOpen ? "100%" : "120px",
        backgroundColor: isOpen ? "#222" : "transparent",
        padding: isOpen ? "1.5rem" : "0px",
        borderRadius: isOpen ? "1.5rem" : "auto",
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

          <AdvancedSearchFiltersForm {...props} />
        </Box>
      ) : (
        <Button w="120px" onClick={onOpen} leftIcon={<FiFilter />}>
          Filter
        </Button>
      )}
    </Box>
  );
}

interface AdvancedSearchProps {
  facets?: SearchResponseFacetCountSchema<SearchableSong>[];
}

const FILTER_BY_EXTRACT_ORIGINAL_ARTIST_REGEX =
  /original_artist:(?<original_artist>.*?)(?:&&|$)/;
const FILTER_BY_EXTRACT_IS_MV_REGEX = /is_mv:(?<is_mv>.*?)(?:&&|$)/;
const FILTER_BY_EXTRACT_CHANNEL_ORG_REGEX =
  /channel_org:=\[?(?<orgs>.*?)\]?(?:&&|$)/;
const FILTER_BY_EXTRACT_CHANNEL_SUBORG_REGEX =
  /channel_suborg:=\[?(?<suborgs>.*?)\]?(?:&&|$)/;
// const FILTER_BY_EXTRACT_CHANNEL_SUBORG_REGEX=/channel_suborg:=\[?(?<suborgs>.*?)\]?(?:&&|$)/

function AdvancedSearchFiltersForm({ facets }: AdvancedSearchProps) {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const qObj: Partial<SearchParams<SearchableSong>> = Object.fromEntries(
    search.entries()
  );
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  function onSubmit(values: any) {
    return new Promise((resolve: (x: any) => void) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve(1);
      }, 3000);
    });
  }

  const is_mv_facets = useMemo(() => {
    return Object.fromEntries(
      facets
        ?.find((x) => x.field_name === "is_mv")
        ?.counts?.map((cv) => [cv.value, cv.count]) || []
    );
  }, [facets]);
  const orgsFacets: [string, number][] = useMemo(() => {
    return (
      facets
        ?.find((x) => x.field_name === "channel_org")
        ?.counts?.map((cv) => [cv.value, cv.count]) || []
    );
  }, [facets]);
  const suborgsFacets: [string, number][] = useMemo(() => {
    return (
      facets
        ?.find((x) => x.field_name === "channel_suborg")
        ?.counts?.map((cv) => [cv.value, cv.count]) || []
    );
  }, [facets]);

  const [original_artist, is_mv, orgs, suborgs] = useMemo(() => {
    const filter = qObj.filter_by || "";
    const match1 = FILTER_BY_EXTRACT_ORIGINAL_ARTIST_REGEX.exec(filter);
    const oa = match1?.groups?.original_artist;
    const match2 = FILTER_BY_EXTRACT_IS_MV_REGEX.exec(filter);
    let is_mv = 0;
    switch (match2?.groups?.is_mv) {
      case "true":
        is_mv = 1;
        break;
      case "false":
        is_mv = 2;
        break;
      default:
        is_mv = 0;
    }
    const match3 = FILTER_BY_EXTRACT_CHANNEL_ORG_REGEX.exec(filter);
    const orgs = match3?.groups?.orgs?.split(",");
    const match4 = FILTER_BY_EXTRACT_CHANNEL_SUBORG_REGEX.exec(filter);
    const suborgs = match4?.groups?.suborgs?.split(",");

    return [oa, is_mv, orgs, suborgs];
  }, [qObj.filter_by]);

  const coordinatedOrgs = useMemo(() => {
    return [
      ...orgsFacets,
      ...(orgs || [])
        ?.filter((x) => !orgsFacets.find((o) => o[0] === x))
        .map((x) => [x, "0"]),
    ];
  }, [orgs, orgsFacets]);
  const coordinatedSubOrgs = useMemo(() => {
    return [
      ...suborgsFacets,
      ...(suborgs || [])
        ?.filter((x) => !suborgsFacets.find((o) => o[0] === x))
        .map((x) => [x, "0"]),
    ];
  }, [suborgs, suborgsFacets]);

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* {JSON.stringify(facets)} */}
      <FormControl isInvalid={errors.q} mb={4}>
        <FormLabel htmlFor="q">
          <Tag size="md" variant="subtle" colorScheme="cyan">
            <TagLeftIcon boxSize="12px" as={FiSearch} />
            <TagLabel>Search by Name, Original Artist, or Channel</TagLabel>
          </Tag>
        </FormLabel>
        <Input
          id="q"
          placeholder="Song Query"
          defaultValue={qObj.q}
          {...register("q", {
            required: "Required",
            minLength: { value: 1, message: "Minimum length should be 1" },
          })}
        />
        <FormErrorMessage>{errors.q && errors.q.message}</FormErrorMessage>
      </FormControl>
      <SimpleGrid spacing={4} minChildWidth="500px" my={4}>
        <FormControl isInvalid={errors.original_artist}>
          <FormLabel htmlFor="original_artist">
            <Tag size="md" variant="subtle" colorScheme="cyan">
              <TagLeftIcon boxSize="12px" as={FiFilter} />
              <TagLabel>Filter by Original Artist</TagLabel>
            </Tag>
          </FormLabel>
          <Input
            id="original_artist"
            defaultValue={original_artist}
            placeholder="Original Artist"
            {...register("original_artist")}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="org">
            <Tag size="md" variant="subtle" colorScheme="cyan">
              <TagLeftIcon boxSize="12px" as={FiFilter} />
              <TagLabel>Filter by status</TagLabel>
            </Tag>
          </FormLabel>

          <RadioGroup defaultValue={is_mv}>
            <Stack direction="row">
              <Radio value="0" id="ismv" {...register("facets.is_mv")}>
                All Song Types
              </Radio>
              <Radio value="1" id="ismv" {...register("facets.is_mv")}>
                <Icon as={BiMovie}></Icon> MV Only ({is_mv_facets["true"]})
              </Radio>
              <Radio value="2" id="ismv" {...register("facets.is_mv")}>
                Non MV Only (Karaokes, etc) ({is_mv_facets["false"]})
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      </SimpleGrid>
      <FormControl my={4}>
        <FormLabel htmlFor="org">
          <Tag size="md" variant="subtle" colorScheme="cyan">
            <TagLeftIcon boxSize="12px" as={FiFilter} />
            <TagLabel>Filter by Organization</TagLabel>
          </Tag>
        </FormLabel>
        <SimpleGrid spacing={2} direction="row" minChildWidth="220px">
          {coordinatedOrgs.map((org, i) => {
            return (
              <Checkbox
                defaultIsChecked={orgs?.includes(org[0])}
                {...register("facets.org." + i)}
                key={"facet-org-" + org[0]}
                value={org[0]}
              >
                {org[0]} ({org[1]})
              </Checkbox>
            );
          })}
        </SimpleGrid>
      </FormControl>
      <FormControl mt={2} mb={2}>
        <FormLabel htmlFor="org">
          <Tag size="md" variant="subtle" colorScheme="cyan">
            <TagLeftIcon boxSize="12px" as={FiFilter} />
            <TagLabel>Filter by Sub Organization</TagLabel>
          </Tag>
        </FormLabel>
        <SimpleGrid spacing={2} direction="row" minChildWidth="220px">
          {coordinatedSubOrgs.map((suborg, i) => {
            return (
              <Checkbox
                defaultIsChecked={suborgs?.includes(suborg[0])}
                {...register("facets.suborg." + i)}
                key={"facet-org-" + suborg[0]}
                value={suborg[0]}
              >
                {suborg[0]} ({suborg[1]})
              </Checkbox>
            );
          })}
        </SimpleGrid>
      </FormControl>
      <ButtonGroup mt={4} spacing={4}>
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
          Search
        </Button>
        <Button variant="outline" colorScheme="teal">
          Reset
        </Button>
      </ButtonGroup>
    </form>
  );
}
