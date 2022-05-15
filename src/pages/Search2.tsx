import React, { Component, useState } from "react";
import {
  ReactiveBase,
  DataSearch,
  MultiList,
  RangeSlider,
  SingleRange,
  SelectedFilters,
  ResultCard,
  ReactiveList,
  SingleList,
} from "@appbaseio/reactivesearch";

export default function SearchV2() {
  const [visible, setVisible] = useState(true);
  return (
    <ReactiveBase
      app="songs_db"
      url={window.location.origin + "/api/v2/musicdex/elasticsearch"}
      transformRequest={({ url, ...req }) => {
        req.url = "/api/v2/musicdex/elasticsearch/search";
        // const newbody = body.replace(/^{"preference":".*"}\n/g, "");
        // req.body = JSON.stringify({ query: JSON.parse(newbody) });
        // req.headers["Content-Type"] = "application/json";
        // console.log(req);
        return req;
      }}
    >
      <DataSearch
        className="datasearch"
        componentId="mainSearch"
        debounce={200}
        //   dataField={[
        //     "general",
        //     "general.ngram",
        //     "original_artist",
        //     "original_artist.ngram",
        //   ]}

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
                    },
                  },
                ],
              },
            },
          };
        }}
        queryFormat="and"
        placeholder="Search for Music / Artist"
        //   innerClass={{
        //     input: "searchbox",
        //     list: "suggestionlist",
        //   }}
        autosuggest={false}
        enableDefaultSuggestions={false}
        iconPosition="left"
        onError={(e) => console.log(e)}
        filterLabel="search"
      />
      <MultiList
        componentId="orgFilter"
        dataField="org"
        title="Filter by Authors"
        aggregationSize={5}
        showCheckbox={true}
        react={{ and: ["mainSearch"] }}
      />
      <SelectedFilters showClearAll="default" />
      <ReactiveList
        componentId="results"
        dataField="name"
        react={{
          and: ["mainSearch", "orgFilter"],
        }}
        // pagination
        size={12}
        sortOptions={[
          { dataField: "_score", sortBy: "desc", label: "Relevance" },
          { dataField: "available_at", sortBy: "desc", label: "Latest" },
          { dataField: "available_at", sortBy: "asc", label: "Earliest" },
          //   {
          //     dataField: "average_rating",
          //     sortBy: "desc",
          //     label: "Ratings (High to low)",
          //   },
          //   {
          //     dataField: "original_title.keyword",
          //     sortBy: "asc",
          //     label: "Title A->Z",
          //   },
          //   {
          //     dataField: "original_title.keyword",
          //     sortBy: "desc",
          //     label: "Title Z->A",
          //   },
        ]}
        render={({ data }) => (
          <ReactiveList.ResultCardsWrapper>
            {data.map((item: any) => (
              <ResultCard href={item.name} key={item._id}>
                <ResultCard.Image src={item.image} />
                <ResultCard.Title>{item.name || " "}</ResultCard.Title>
                <ResultCard.Description
                  dangerouslySetInnerHTML={{
                    __html:
                      `<div class='result-author' title='${item.name}'>by ${item.authors}</div>` +
                      `<span class="star">${"★".repeat(
                        item.average_rating_rounded
                      )}</span>`,
                  }}
                />
              </ResultCard>
            ))}
          </ReactiveList.ResultCardsWrapper>
        )}
        className="result-data"
        innerClass={{
          title: "result-title",
          image: "result-image",
          resultStats: "result-stats",
          listItem: "result-item",
        }}
      />
    </ReactiveBase>
  );
}
