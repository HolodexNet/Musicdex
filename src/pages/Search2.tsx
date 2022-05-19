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
  Button,
  Flex,
  Input,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SongTable, SongTableCol } from "../components/data/SongTable";
import "./Search2.css";

const SearchResultSongTable = ({ data }: { data: any }) => {
  // console.log(data);
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
    data && (
      <SongTable
        songs={data}
        rowProps={{ hideCol: detailLevel }}
        width="100%"
        flexGrow={1}
      />
    )
  );
};

export default function SearchV2() {
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
  const [isExact, setExact] = useState(searchParams.get("mode") === "exact");
  const [channelSelected, setChannelSelected] = useState(
    searchParams.has("ch")
  );

  useEffect(() => {
    const newSP = new URLSearchParams(searchParams);
    newSP.delete("mode");
    newSP.set("mode", isExact ? "exact" : "fuzzy");
    setSearchParams(newSP, { replace: true });
  }, [isExact]); // isExact -> searchParams

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (isExact !== (mode === "exact")) setExact(mode === "exact");
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
        console.log(newurl);
        navigate({ search: new URL(newurl).search });
      }}
      enableAppbase={false}
    >
      <Flex alignItems="stretch" wrap={flexWrap} mt={4}>
        <VStack
          minW="200px"
          alignItems="stretch"
          px={2}
          flexGrow={1}
          spacing={2}
          mr={3}
        >
          <div style={{ marginBottom: "-0.5rem" }}>
            <Button
              colorScheme={!isExact ? "gray" : "brand"}
              size="xs"
              variant={!isExact ? "outline" : "solid"}
              rounded="0.2rem 0.2rem 0 0"
              onClick={() => setExact(true)}
            >
              Exact
            </Button>
            <Button
              colorScheme={isExact ? "gray" : "brand"}
              size="xs"
              variant={isExact ? "outline" : "solid"}
              rounded="0.2rem 0.2rem 0 0"
              onClick={() => setExact(false)}
            >
              Fuzzy
            </Button>
          </div>
          {!isExact && (
            <DataSearch
              className="datasearch"
              componentId="q"
              URLParams
              debounce={200}
              customQuery={(q) => {
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
              queryFormat="and"
              placeholder="Search for Music / Artist"
              autosuggest={false}
              enableDefaultSuggestions={false}
              iconPosition="left"
              onError={(e) => console.log(e)}
              filterLabel="Fuzzy Search"
            />
          )}
          {isExact && (
            <DataSearch
              className="datasearch"
              componentId="q"
              URLParams
              debounce={200}
              customQuery={(q) => {
                return {
                  query: {
                    bool: {
                      must: [
                        {
                          multi_match: {
                            query: q,
                            fields: ["general.ngram", "original_artist.ngram"],
                            type: "phrase",
                          },
                        },
                      ],
                      should: [
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
              queryFormat="and"
              placeholder="Search for Music / Artist"
              autosuggest={false}
              enableDefaultSuggestions={false}
              iconPosition="left"
              onError={(e) => console.log(e)}
              filterLabel="Exact Search"
            />
          )}
          <small style={{ opacity: 0.5, float: "right" }}>
            {isExact
              ? "Exact search is better for Japanese and Kanji"
              : "Fuzzy search supports Romaji lookup"}
          </small>

          <ToggleButton
            componentId="isMv"
            dataField="is_mv"
            data={[
              { label: "MV", value: "true" },
              { label: "Stream", value: "false" },
            ]}
            title="Presentation"
            defaultValue={[]}
            URLParams={true}
          />
          <MultiList
            className="input-fix"
            componentId="ch"
            dataField="channel.name"
            title="Filter by Channel"
            react={{ and: ["q", "isMv", ...(channelSelected ? [] : ["org"])] }}
            showSearch={true}
            onValueChange={(e) => {
              if (e && e.length > 0) setChannelSelected(true);
              else setChannelSelected(false);
            }}
            URLParams={true}
            size={6}
            showCheckbox={true}
          />
          {!channelSelected && (
            <SingleList
              componentId="org"
              dataField="org"
              title="Filter by Org"
              react={{ and: ["q", "isMv"] }}
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
              title="Filter by Suborg"
              showCheckbox={true}
              showSearch={false}
              queryFormat="and"
              react={{ and: ["q", "org", "isMv"] }}
              URLParams={true}
            />
          )}
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
