import {
  Box,
  Button,
  Checkbox,
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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Suspense, useMemo } from "react";
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
import { useForm } from "react-hook-form";
import { FiFilter, FiSearch } from "react-icons/fi";
import { BiMovie } from "react-icons/bi";

export default function Search() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const qObj: Partial<SearchParams<Song>> = Object.fromEntries(
    search.entries()
  );
  const { data: searchResult, ...rest } = useSongSearch<Song>({
    q: "",
    query_by:
      "name, channel_name, channel_english_name, original_artist, channel_org, title",
    ...qObj,
    facet_by: "channel_org, is_mv",
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
      <AdvancedSearchFilters></AdvancedSearchFilters>
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
function AdvancedSearchFilters() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const qObj: Partial<SearchParams<Song>> = Object.fromEntries(
    search.entries()
  );
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values: any) {
    return new Promise((resolve: (x: any) => void) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve(1);
      }, 3000);
    });
  }

  console.log(errors);

  return (
    <Box
      w={"full"}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"2xl"}
      rounded={"lg"}
      p={6}
      textAlign={"start"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.q} mt={2} mb={3}>
          <FormLabel htmlFor="q">
            <Icon as={FiSearch}></Icon> Search by Name, Original Artist, or
            Channel
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
        <SimpleGrid spacing={5} minChildWidth="300px" mt={2} mb={3}>
          <FormControl isInvalid={errors.original_artist}>
            <FormLabel htmlFor="original_artist">
              <Icon as={FiFilter}></Icon> Filter by Original Artist
            </FormLabel>
            <Input
              id="original_artist"
              placeholder="Original Artist"
              {...register("original_artist")}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="org">
              <Icon as={FiFilter}></Icon> Filter by status
            </FormLabel>

            <RadioGroup defaultValue="0">
              <Stack direction="row">
                <Radio value="0" id="ismv" {...register("facets.is_mv")}>
                  All Song Types
                </Radio>
                <Radio value="1" id="ismv" {...register("facets.is_mv")}>
                  <Icon as={BiMovie}></Icon> MV Only
                </Radio>
                <Radio value="2" id="ismv" {...register("facets.is_mv")}>
                  Non MV Only (Karaokes, etc)
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </SimpleGrid>
        <FormControl mt={2} mb={3}>
          <FormLabel htmlFor="org">
            <Icon as={FiFilter}></Icon> Filter by Org
          </FormLabel>
          <Stack spacing={5} direction="row">
            <Checkbox defaultIsChecked {...register("facets.org.hololive")}>
              Hololive (32)
            </Checkbox>
            <Checkbox defaultIsChecked {...register("facets.org.hololive")}>
              Nijisanji (12)
            </Checkbox>
          </Stack>
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
