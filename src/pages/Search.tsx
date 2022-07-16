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
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Progress,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SongTable, SongTableCol } from "../components/data/SongTable";
import "./Search.css";

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
    "xl"
  );
  return (
    <>
      {loading && <Progress size="xs" isIndeterminate />}
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
    searchParams.has("ch")
  );

  useEffect(() => {
    if (searchParams.has("ch")) setChannelSelected(true);
  }, [searchParams]); // searchParams --> isExact

  return (
    <ReactiveBase
      className="m-search"
      app="songs_db"
      url={window.location.origin + "/api/v2/musicdex/elasticsearch"}
      transformRequest={({ url, ...req }) => {
        req.url = "/api/v2/musicdex/elasticsearch/search";
        // console.log(req);
        return req;
      }}
      themePreset="dark"
      setSearchParams={(newurl) => {
        // console.log(newurl);
        navigate({ search: new URL(newurl).search });
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
          spacing={2}
          mr={3}
        >
          <DataSearch
            className="datasearch"
            componentId="q"
            URLParams
            debounce={1000}
            customQuery={(q) => {
              if (!q) return {};

              return {
                query: {
                  bool: {
                    must: [
                      {
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
                    ],
                  },
                },
              };
            }}
            dataField=""
            queryFormat="and"
            placeholder="Search for Music / Artist"
            autosuggest={false}
            enableDefaultSuggestions={false}
            iconPosition="left"
            onError={(e) => console.log(e)}
            filterLabel="Search"
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
                    URLParams={true}
                    style={{ marginLeft: 0 }}
                  />
                  <Button
                    colorScheme="brand"
                    size="xs"
                    variant={"solid"}
                    rounded="0.2rem 0.2rem 0 0"
                    style={{ marginBottom: "-0.5rem" }}
                    alignSelf="start"
                    cursor="default"
                  >
                    Song
                  </Button>
                  <DataSearch
                    className="datasearch"
                    componentId="song"
                    URLParams
                    debounce={1000}
                    dataField=""
                    customQuery={(q) => {
                      if (!q) return {};
                      return {
                        query: {
                          bool: {
                            should: [
                              {
                                multi_match: {
                                  query: q,
                                  fields: ["name.ngram", "name"],
                                  type: "phrase",
                                },
                              },
                            ],
                          },
                        },
                      };
                    }}
                    queryFormat="and"
                    placeholder="Song Name"
                    autosuggest={false}
                    enableDefaultSuggestions={false}
                    iconPosition="left"
                    onError={(e) => console.log(e)}
                    filterLabel="Song Name"
                  />
                  <Button
                    colorScheme="brand"
                    size="xs"
                    variant={"solid"}
                    rounded="0.2rem 0.2rem 0 0"
                    style={{ marginBottom: "-0.5rem" }}
                    alignSelf="start"
                    cursor="default"
                  >
                    Artist
                  </Button>

                  <DataSearch
                    className="datasearch"
                    componentId="artist"
                    URLParams
                    debounce={1000}
                    dataField=""
                    customQuery={(q) => {
                      if (!q) return {};
                      return {
                        query: {
                          bool: {
                            should: [
                              {
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
                            ],
                          },
                        },
                      };
                    }}
                    queryFormat="and"
                    placeholder="Original Artist Name"
                    autosuggest={false}
                    enableDefaultSuggestions={false}
                    iconPosition="left"
                    onError={(e) => console.log(e)}
                    filterLabel="Original Artist"
                  />
                  <MultiList
                    className="input-fix"
                    componentId="ch"
                    dataField="channel.name"
                    filterLabel="Channel"
                    title="Filter by Channel"
                    react={{ and: ["q", "song", "artist", "isMv", "org"] }}
                    showSearch={true}
                    onValueChange={(e) => {
                      if (e && e.length > 0) setChannelSelected(true);
                      else setChannelSelected(false);
                    }}
                    URLParams={true}
                    size={12}
                    showCheckbox={true}
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
                        if (e) setSuborgVisible(true);
                        else setSuborgVisible(false);
                      }}
                      URLParams={true}
                    />
                  )}
                  {suborgVisible && !channelSelected && (
                    <MultiList
                      componentId="suborg"
                      dataField="suborg"
                      filterLabel="Suborg"
                      title="Filter by Suborg"
                      showCheckbox={true}
                      showSearch={false}
                      queryFormat="and"
                      react={{ and: ["q", "org", "song", "artist", "isMv"] }}
                      URLParams={true}
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
            URLParams={true}
            pagination={true}
            showLoader={true}
            size={12}
            sortOptions={[
              { dataField: "_score", sortBy: "desc", label: "Relevance" },
              { dataField: "available_at", sortBy: "desc", label: "Latest" },
              { dataField: "available_at", sortBy: "asc", label: "Earliest" },
            ]}
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
        showFilter={true}
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
