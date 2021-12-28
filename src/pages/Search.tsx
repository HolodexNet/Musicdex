import { Container, Flex, Select } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loading } from "../components/common/Loading";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { SongItem } from "../components/song/SongItem";
import { useSongSearch } from "../modules/services/search.service";
import { useTrendingSongs } from "../modules/services/songs.service";

export function Search() {
  const [search] = useSearchParams();
  const qObj = Object.fromEntries(search.entries());
  const { data: searchResult, isLoading } = useSongSearch<Song>({
    q: "",
    query_by:
      "name, channel_name, channel_english_name, original_artist, channel_org, title",
    ...qObj,
  });

  const songs = useMemo(() => {
    return searchResult?.hits?.map((doc) => {
      return doc.document;
    });
  }, [searchResult]);
  console.log(songs);

  return (
    <PageContainer>
      {isLoading && <Loading />}
      {songs && (
        //   <Flex flexDirection="row" mx="-6px" py="8px">
        //     {songs.slice(0, 4).map((song) => (
        //       <SongItem song={song} mx="6px" key={song.id} />
        //     ))}
        //   </Flex>
        <div>Hi</div>
      )}
      {songs && <SongTable songs={songs} />}
    </PageContainer>
  );
}
