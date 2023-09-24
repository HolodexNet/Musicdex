import {
  ReactiveBase,
  ReactiveComponent,
  ReactiveList,
  SelectedFilters,
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
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiMovie, BiMoviePlay } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SongTable, SongTableCol } from "../components/data/SongTable";
import "./Search.css";
import { GeneralSearchInput } from "../components/search/GeneralSearchInput";
import { CheckboxSearchList } from "../components/search/CheckboxSearchList";
import { RadioButtonSearchList } from "../components/search/RadioButtonSearchList";
import { ToggleButtonSearchInput } from "../components/search/ToggleButtonSearchInput";
import { useLocalStorage } from "../store/adhoc";

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
        mt={1}
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
  const { t } = useTranslation();
  const sortOptions = useMemo(
    () => [
      { dataField: "_score", sortBy: "desc", label: t("Relevance") },
      { dataField: "available_at", sortBy: "desc", label: t("Latest") },
      { dataField: "available_at", sortBy: "asc", label: t("Oldest") },
    ],
    [t],
  );
  const [defaultSort, setDefaultSort] = useLocalStorage(
    "defaultSort",
    t("Relevance"),
  );
  const defaultSortField = useMemo(() => {
    return (
      sortOptions.find((x) => x.label === defaultSort)?.label ||
      sortOptions[0].label
    );
  }, [sortOptions, defaultSort]);
  const [suborgVisible, setSuborgVisible] = useState(false);
  const navigate = useNavigate();
  const [channelSelected, setChannelSelected] = useState(false);
  const flexWrap: "nowrap" | "wrap" | undefined = useBreakpointValue({
    base: "wrap",
    sm: "wrap",
    xs: "wrap",
    md: "nowrap",
    lg: "nowrap",
    xl: "nowrap",
  });

  // this system sets up some loose reactivity regarding org and suborg block visibility.
  const [params] = useSearchParams();
  useEffect(() => {
    const ch = params.get("ch");
    const org = params.get("org");

    setChannelSelected(!!ch);
    setSuborgVisible(!!org);
  }, [params]);

  const getGeneralQuery = useCallback((value: string) => {
    if (!value) return {};

    return {
      query: {
        multi_match: {
          query: value,
          fields: ["general^2", "general.ngram", "general.romaji"],
          type: "most_fields",
          // type: "phrase",
        },
      },
    };
  }, []);

  const getSongQuery = useCallback((value: string) => {
    if (!value) return {};

    return {
      query: {
        multi_match: {
          query: value,
          fields: ["name.ngram^2", "name^2", "name.romaji"],
          type: "phrase",
        },
      },
    };
  }, []);

  const getArtistQuery = useCallback((value: string) => {
    if (!value) return {};

    return {
      query: {
        multi_match: {
          query: value,
          fields: [
            "original_artist.ngram^2",
            "original_artist^2",
            "original_artist.romaji",
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
                debounceValue={debounceValue}
                placeholder={t("Search for Music / Artist")}
                getQuery={getGeneralQuery}
                autoFocus
                {...props}
              />
            )}
            onError={(e) => console.error(e)}
          />
          <Accordion allowToggle defaultIndex={0}>
            <AccordionItem>
              <AccordionButton>
                <Heading flex="1" textAlign="center" size="sm">
                  {t("Advanced Filters")}
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p={0}>
                <VStack alignItems="stretch" flexGrow={1} spacing={2}>
                  <ReactiveComponent
                    componentId="isMv"
                    filterLabel={t("Is MV")}
                    URLParams
                    render={(props) => (
                      <ToggleButtonSearchInput
                        dataField="is_mv"
                        tagLabel={t("Type")}
                        buttons={[
                          { label: t("MV"), value: "true", icon: <BiMovie /> },
                          {
                            label: t("Stream"),
                            value: "false",
                            icon: <BiMoviePlay />,
                          },
                        ]}
                        {...props}
                      />
                    )}
                    onError={(e) => console.error(e)}
                  />

                  <ReactiveComponent
                    componentId="song"
                    URLParams
                    filterLabel={t("Song Name")}
                    customQuery={getSongQuery}
                    render={(props) => (
                      <GeneralSearchInput
                        placeholder={t("Song Name")}
                        debounceValue={debounceValue}
                        getQuery={getSongQuery}
                        tagLabel={t("Song")}
                        {...props}
                      />
                    )}
                    onError={(e) => console.error(e)}
                  />
                  <ReactiveComponent
                    componentId="artist"
                    URLParams
                    filterLabel={t("Original Artist")}
                    customQuery={getArtistQuery}
                    render={(props) => (
                      <GeneralSearchInput
                        placeholder={t("Original Artist Name")}
                        debounceValue={debounceValue}
                        getQuery={getArtistQuery}
                        tagLabel={t("Artist")}
                        {...props}
                      />
                    )}
                    onError={(e) => console.error(e)}
                  />

                  <ReactiveComponent
                    componentId="ch"
                    filterLabel={t("Channel")}
                    URLParams
                    react={{ and: ["q", "song", "artist", "isMv", "org"] }}
                    defaultQuery={() => ({
                      aggs: {
                        "channel.name": {
                          terms: {
                            field: "channel.name",
                            size: 12,
                            order: { _count: "desc" },
                          },
                        },
                      },
                    })}
                    render={(props) => {
                      // setChannelSelected(props.value?.length > 0);
                      return (
                        <CheckboxSearchList
                          dataField="channel.name"
                          placeholder={t("Channel name")}
                          tagLabel={t("Channel")}
                          showSearch
                          {...props}
                        />
                      );
                    }}
                    onError={(e) => console.error(e)}
                  />
                  {!channelSelected && (
                    <ReactiveComponent
                      componentId="org"
                      filterLabel={t("Org")}
                      URLParams
                      react={{ and: ["q", "song", "artist", "isMv"] }}
                      defaultQuery={() => ({
                        aggs: {
                          org: {
                            terms: {
                              field: "org",
                              order: { _count: "desc" },
                            },
                          },
                        },
                      })}
                      render={(props) => {
                        // setSuborgVisible(!!props.value);
                        return (
                          <RadioButtonSearchList
                            dataField="org"
                            placeholder={t("Organization")}
                            tagLabel={t("Organization")}
                            {...props}
                          />
                        );
                      }}
                      onError={(e) => console.error(e)}
                    />
                  )}
                  {suborgVisible && !channelSelected && (
                    <ReactiveComponent
                      componentId="suborg"
                      filterLabel={t("Suborg")}
                      URLParams
                      react={{ and: ["q", "song", "artist", "isMv", "org"] }}
                      defaultQuery={() => ({
                        aggs: {
                          suborg: {
                            terms: {
                              field: "suborg",
                              order: { _count: "desc" },
                            },
                          },
                        },
                      })}
                      render={(props) => (
                        <CheckboxSearchList
                          dataField="suborg"
                          placeholder={t("Suborg name")}
                          tagLabel={t("Suborg")}
                          {...props}
                        />
                      )}
                      onError={(e) => console.error(e)}
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
          <SelectedFilters
            clearAllLabel={t("Clear filters")}
            style={{ minHeight: 35 }}
          />
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
            URLParams
            pagination
            showLoader
            size={12}
            sortOptions={sortOptions}
            defaultSortOption={defaultSortField}
            innerClass={{
              sortOptions: "sort-select",
              pagination: "custom-chakra-button",
            }}
            render={SearchResultSongTable}
            onQueryChange={(thisQ, next) => {
              const datafield = Object.keys(next.sort[0])[0];
              const sort = next.sort[0][datafield].order;
              setDefaultSort(
                sortOptions.find(
                  (x) => x.dataField === datafield && x.sortBy === sort,
                )?.label || "unset",
              );
            }}
          />
        </VStack>
      </Flex>
    </ReactiveBase>
  );
}
