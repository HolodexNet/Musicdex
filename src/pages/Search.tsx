import {
  DataSearch,
  MultiList,
  ReactiveBase,
  ReactiveComponent,
  ReactiveList,
  SelectedFilters,
  SingleList,
  ToggleButton,
} from "@appbaseio/reactivesearch";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
  Progress,
  Tag,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SongTable, SongTableCol } from "../components/data/SongTable";
import "./Search.css";
import { GeneralSearchInput } from "../components/search/GeneralSearchInput";

const debounceValue = 1000;

const SearchResultSongTable = ({
  data,
  loading,
}: {
  data: any;
  loading: any;
}) => {
  const detailLevel = useBreakpointValue<SongTableCol[] | undefined>(
    {
      sm: ["idx", "og_artist", "sang_on", "duration"],
      md: ["idx", "og_artist", "sang_on"],
      lg: ["idx", "og_artist"],
      xl: [],
    },
    "xl",
  );
  return (
    <>
      <Progress
        size="xs"
        isIndeterminate
        visibility={loading ? "visible" : "hidden"}
      />
      {data && (
        <SongTable
          songs={data}
          rowProps={{ hideCol: detailLevel }}
          width="100%"
          flexGrow={1}
        />
      )}
    </>
  );
};

export default function Search() {
  const [suborgVisible, setSuborgVisible] = useState(false);
  const flexWrap: "nowrap" | "wrap" | undefined = useBreakpointValue({
    base: "wrap",
    sm: "wrap",
    xs: "wrap",
    md: "nowrap",
    lg: "nowrap",
    xl: "nowrap",
  });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [channelSelected, setChannelSelected] = useState(
    searchParams.has("ch"),
  );

  useEffect(() => {
    if (searchParams.has("ch")) setChannelSelected(true);
  }, [searchParams]); // searchParams --> isExact

  const getGeneralQuery = useCallback((q) => {
    if (!q) return {};

    return {
      query: {
        multi_match: {
          query: q,
          fields: [
            "general",
            "general.romaji",
            "original_artist",
            "original_artist.romaji",
          ],
          type: "phrase",
        },
      },
    };
  }, []);

  const getSongQuery = useCallback((q) => {
    if (!q) return {};

    return {
      query: {
        multi_match: {
          query: q,
          fields: ["name.ngram", "name"],
          type: "phrase",
        },
      },
    };
  }, []);

  const getArtistQuery = useCallback((q) => {
    if (!q) return {};

    return {
      query: {
        multi_match: {
          query: q,
          fields: [
            "original_artist.ngram^2",
            "original_artist^2",
            "original_artist.romaji^0.5",
          ],
          type: "phrase",
        },
      },
    };
  }, []);
  return (
    <ReactiveBase
      className="m-search"
      app="songs_db"
      url={window.location.origin + "/api/v2/musicdex/elasticsearch"}
      transformRequest={({ url, ...req }) => {
        req.url = "/api/v2/musicdex/elasticsearch/search";
        return req;
      }}
      themePreset="dark"
      setSearchParams={(newURL) => {
        navigate({ search: new URL(newURL).search });
      }}
      enableAppbase={false}
    >
      <Flex alignItems="stretch" wrap={flexWrap} mt={4}>
        <VStack
          minW="200px"
          className="m-filters"
          alignItems="stretch"
          px={2}
          flexGrow={1}
          flexBasis="300px"
          spacing={2}
          mr={3}
        >
          <ReactiveComponent
            componentId="q"
            URLParams
            filterLabel="Search"
            customQuery={getGeneralQuery}
            render={(props) => (
              <GeneralSearchInput
                initialState={searchParams.get("q")}
                debounceValue={debounceValue}
                placeholder="Search for Music / Artist"
                getQuery={getGeneralQuery}
                {...props}
              />
            )}
            onError={(e) => console.log(e)}
          />
          <Accordion allowToggle defaultIndex={0}>
            <AccordionItem>
              <AccordionButton>
                <Heading flex="1" textAlign="center" size="sm">
                  Advanced Filters
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p={0}>
                <VStack alignItems="stretch" flexGrow={1} spacing={2}>
                  <ToggleButton
                    componentId="isMv"
                    dataField="is_mv"
                    data={[
                      { label: "MV", value: "true" },
                      { label: "Stream", value: "false" },
                    ]}
                    title="Presentation"
                    filterLabel="Presentation"
                    defaultValue={[]}
                    URLParams
                    style={{ marginLeft: 0 }}
                  />

                  <Tag colorScheme="brand" size="md" alignSelf="start">
                    Song
                  </Tag>
                  <ReactiveComponent
                    componentId="song"
                    URLParams
                    filterLabel="Song Name"
                    customQuery={getSongQuery}
                    render={(props) => (
                      <GeneralSearchInput
                        initialState={searchParams.get("song")}
                        placeholder="Song Name"
                        debounceValue={debounceValue}
                        getQuery={getSongQuery}
                        {...props}
                      />
                    )}
                    onError={(e) => console.log(e)}
                  />
                  <Tag colorScheme="brand" size="md" alignSelf="start">
                    Artist
                  </Tag>
                  <ReactiveComponent
                    componentId="artist"
                    URLParams
                    filterLabel="Original Artist"
                    customQuery={getSongQuery}
                    render={(props) => (
                      <GeneralSearchInput
                        initialState={searchParams.get("artist")}
                        placeholder="Original Artist Name"
                        debounceValue={debounceValue}
                        getQuery={getArtistQuery}
                        {...props}
                      />
                    )}
                    onError={(e) => console.log(e)}
                  />

                  <MultiList
                    className="input-fix"
                    componentId="ch"
                    dataField="channel.name"
                    filterLabel="Channel"
                    title="Filter by Channel"
                    react={{ and: ["q", "song", "artist", "isMv", "org"] }}
                    showSearch
                    onValueChange={(e) => {
                      setChannelSelected(e && e.length > 0);
                    }}
                    URLParams
                    size={12}
                    showCheckbox
                  />
                  {!channelSelected && (
                    <SingleList
                      componentId="org"
                      dataField="org"
                      filterLabel="Org"
                      title="Filter by Org"
                      react={{ and: ["q", "song", "artist", "isMv"] }}
                      showSearch={false}
                      onValueChange={(e) => {
                        setSuborgVisible(!!e);
                      }}
                      URLParams
                    />
                  )}
                  {suborgVisible && !channelSelected && (
                    <MultiList
                      componentId="suborg"
                      dataField="suborg"
                      filterLabel="Suborg"
                      title="Filter by Suborg"
                      showCheckbox
                      showSearch={false}
                      queryFormat="and"
                      react={{ and: ["q", "org", "song", "artist", "isMv"] }}
                      URLParams
                    />
                  )}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
        <VStack
          minW="350px"
          w="50vw"
          alignItems="stretch"
          flexGrow={2}
          flexShrink={1}
        >
          <SelectedFilters showClearAll="default" />
          <ReactiveList
            componentId="results"
            dataField="name"
            react={{
              and: [
                "q",
                "song",
                "artist",
                ...(!channelSelected ? ["org"] : []),
                ...(suborgVisible && !channelSelected ? ["suborg"] : []),
                "isMv",
                "ch",
              ],
            }}
            // pagination
            URLParams
            pagination
            showLoader
            size={12}
            sortOptions={[
              { dataField: "_score", sortBy: "desc", label: "Relevance" },
              { dataField: "available_at", sortBy: "desc", label: "Latest" },
              { dataField: "available_at", sortBy: "asc", label: "Earliest" },
            ]}
            innerClass={{
              sortOptions: "sort-select",
            }}
            render={SearchResultSongTable}
          />
        </VStack>
      </Flex>
    </ReactiveBase>
  );
}

// Garbage stuff:
/* <ReactiveComponent
        componentId="q"
        showFilter
        filterLabel="Query"
        // defaultQuery={}
        defaultQuery={(args) => {
          console.log(args);
          return {
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: qFuzzy,
                      fields: [
                        "general",
                        "general.romaji",
                        "original_artist",
                        "original_artist.romaji",
                      ],
                    },
                  },
                ],
              },
            },
            value: qFuzzy,
          }
        }}
        render={({ setQuery, value }) => {
          return (
            <Searchbox
              w={{ base: "100%", lg: "40%" }}
              paddingX={4}
              didChange={({ qFuzzy, qExact }) => {
                if (qFuzzy) {
                  setQuery({
                    query: {
                      bool: {
                        must: [
                          {
                            multi_match: {
                              query: qFuzzy,
                              fields: [
                                "general",
                                "general.romaji",
                                "original_artist",
                                "original_artist.romaji",
                              ],
                            },
                          },
                        ],
                      },
                    },
                    value: qFuzzy,
                  });
                } else if (qExact) {
                  setQuery({
                    query: {
                      bool: {
                        must: [
                          {
                            multi_match: {
                              query: qExact,
                              fields: [
                                "general.ngram",
                                "original_artist.ngram",
                              ],
                            },
                          },
                          ,
                        ],
                        should: [
                          {
                            multi_match: {
                              query: qExact,
                              fields: [
                                "general",
                                "general.romaji",
                                "original_artist",
                                "original_artist.romaji",
                              ],
                            },
                          },
                        ],
                      },
                    },
                    value: qExact,
                  });
                }
              }}
            />
          );
        }}
      ></ReactiveComponent> */
