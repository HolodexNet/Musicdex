import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiMovie } from "react-icons/bi";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  SearchParams,
  SearchResponseFacetCountSchema,
} from "../../modules/services/search.service";
import { SearchableSong } from "../../pages/Search";

export interface AdvancedSearchProps {
  facets?: SearchResponseFacetCountSchema<SearchableSong>[];
  fullreset?: () => void;
}
const FILTER_BY_EXTRACT_ORIGINAL_ARTIST_REGEX =
  /original_artist:(?<original_artist>.*?)(?:&&|$)/;
const FILTER_BY_EXTRACT_IS_MV_REGEX = /is_mv:=(?<is_mv>.*?)(?:&&|$)/;
const FILTER_BY_EXTRACT_CHANNEL_ORG_REGEX =
  /channel_org:=\[?(?<orgs>.*?)\]?(?:&&|$)/;
const FILTER_BY_EXTRACT_CHANNEL_SUBORG_REGEX =
  /channel_suborg:=\[?(?<suborgs>.*?)\]?(?:&&|$)/;
// const FILTER_BY_EXTRACT_CHANNEL_SUBORG_REGEX=/channel_suborg:=\[?(?<suborgs>.*?)\]?(?:&&|$)/
export function AdvancedSearchFiltersForm({
  facets,
  fullreset = () => {},
}: AdvancedSearchProps) {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const qObj: Partial<SearchParams<SearchableSong>> = useMemo(
    () => Object.fromEntries(search.entries()),
    [search]
  );
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
    const orgs = match3?.groups?.orgs?.replaceAll("`", "")?.split(",");
    const match4 = FILTER_BY_EXTRACT_CHANNEL_SUBORG_REGEX.exec(filter);
    const suborgs = match4?.groups?.suborgs?.replaceAll("`", "")?.split(",");

    return [oa, is_mv, orgs, suborgs];
  }, [qObj]);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      q: qObj.q,
      original_artist: original_artist,
      orgs: orgs,
      suborgs: suborgs,
      is_mv: is_mv,
    },
  });

  const [counter, incr] = useState(1000);
  function onSubmit(values: any) {
    // console.log(values);
    const {
      q,
      original_artist,
      is_mv,
      orgs,
      suborgs,
    }: {
      q: string;
      original_artist: string;
      is_mv: "0" | "1" | "2";
      orgs?: [string];
      suborgs?: [string];
    } = values;

    const part1 =
      original_artist &&
      original_artist.trim().length > 0 &&
      "original_artist:" + original_artist.trim();
    const part2 =
      is_mv &&
      is_mv !== "0" &&
      (is_mv === "1" ? "is_mv:=true" : "is_mv:=false");
    const part3 =
      orgs &&
      orgs.length > 0 &&
      `channel_org:=[${orgs
        .filter((x) => x)
        .map((x) => "`" + x + "`")
        .join(",")}]`;
    const part4 =
      suborgs &&
      suborgs.length > 0 &&
      `channel_suborg:=[${suborgs
        .filter((x) => x)
        .map((x) => "`" + x + "`")
        .join(",")}]`;

    const filter_by = [part1, part2, part3, part4].filter((x) => x).join("&&");
    // console.log(filter_by);
    // fullreset();

    navigate({
      pathname: "/search",
      search: `?${createSearchParams({
        q,
        ...(filter_by && { filter_by }),
      } as any)}`,
    });
    // fullreset();
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

  const isMobile = useBreakpointValue({ base: true, md: false });

  // console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.q} mb={4}>
        <FormLabel htmlFor="q">
          <Tag size="md" variant="subtle" colorScheme="cyan">
            <TagLeftIcon boxSize="12px" as={FiSearch} />
            <TagLabel noOfLines={2} whiteSpace="normal">
              Search by Everything (Name, Original Artist, Channel,
              Organization)
            </TagLabel>
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
      <SimpleGrid spacing={4} minChildWidth="200px" my={4}>
        <FormControl isInvalid={!!errors.original_artist}>
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

          <RadioGroup defaultValue={String(is_mv)}>
            <Stack direction="row">
              <Radio value="0" id="ismv" {...register("is_mv")}>
                All Song Types
              </Radio>
              <Radio value="1" id="ismv" {...register("is_mv")}>
                <Icon as={BiMovie}></Icon> MV Only ({is_mv_facets["true"]})
              </Radio>
              <Radio value="2" id="ismv" {...register("is_mv")}>
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
          <Controller
            control={control}
            name="orgs"
            render={({ field }) => (
              <>
                {coordinatedOrgs.map((org, i) => {
                  return (
                    <Checkbox
                      isChecked={field.value?.includes(org[0])}
                      key={counter + "facet-org-" + org[0] + i}
                      value={org[0]}
                      onChange={(e) => {
                        e.target.checked
                          ? field.onChange([
                              ...(field.value || []),
                              e.target.value,
                            ])
                          : field.onChange(
                              (field.value as [string]).filter(
                                (value: string) => value !== e.target.value
                              )
                            );
                      }}
                    >
                      {org[0]} ({org[1]})
                    </Checkbox>
                  );
                })}
              </>
            )}
          />
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
          <Controller
            control={control}
            name="suborgs"
            render={({ field }) => (
              <>
                {coordinatedSubOrgs.map((suborg, i) => {
                  return (
                    <Checkbox
                      isChecked={field.value?.includes(suborg[0])}
                      key={counter + "facet-suborg-" + suborg[0] + i}
                      value={suborg[0]}
                      onChange={(e) => {
                        e.target.checked
                          ? field.onChange([
                              ...(field.value || []),
                              e.target.value,
                            ])
                          : field.onChange(
                              (field.value as [string]).filter(
                                (value: string) => value !== e.target.value
                              )
                            );
                      }}
                    >
                      {suborg[0]} ({suborg[1]})
                    </Checkbox>
                  );
                })}
              </>
            )}
          />
        </SimpleGrid>
      </FormControl>
      <ButtonGroup mt={4} spacing={4}>
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
          Search
        </Button>
        <Button
          variant="outline"
          colorScheme="teal"
          onClick={() => {
            reset();
            navigate({
              pathname: "/search",
              search: `?${createSearchParams({
                q: qObj.q,
              } as any)}`,
            });
            incr((x) => x + 1000);
          }}
        >
          Reset
        </Button>
      </ButtonGroup>
    </form>
  );
}
