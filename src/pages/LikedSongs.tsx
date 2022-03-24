import { Button, HStack } from "@chakra-ui/react";
import { Suspense, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useLikedSongs } from "../modules/services/like.service";
import { useSongQueuer } from "../utils/SongQueuerHook";

export default function LikedSongs() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const {
    data: paginatedSongs,
    isPreviousData,
    ...status
  } = useLikedSongs(page, { keepPreviousData: true });
  const hasMore = useMemo(
    () => page < (paginatedSongs?.page_count || 1),
    [page, paginatedSongs]
  );
  const queueSongs = useSongQueuer();

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Liked Songs")} - Musicdex</title>
      </Helmet>
      <ContainerInlay mt={12}>
        {/* <Stack spacing={4} my={4}> */}
        <PlaylistHeading
          title={t("Liked Songs")}
          description={""}
          canEdit={false}
          count={0}
          editMode={false}
        ></PlaylistHeading>
        {status.isLoading ? (
          <QueryStatus queryStatus={status} />
        ) : (
          <>
            <HStack spacing={4} flexShrink={1} flexWrap="wrap" my={2}>
              <Button
                variant="solid"
                aria-label={t("Add to Queue")}
                size="md"
                colorScheme="n2"
                onClick={() =>
                  queueSongs({
                    songs: paginatedSongs?.content || [],
                    immediatelyPlay: false,
                  })
                }
              >
                {t("Queue ({{amount}})", {
                  amount: paginatedSongs?.content.length || 0,
                })}
              </Button>
            </HStack>
            {paginatedSongs?.content?.length && (
              <>
                <Suspense fallback={<div>Loading...</div>}>
                  <SongTable songs={paginatedSongs.content}></SongTable>
                </Suspense>
                <HStack justifyContent="center">
                  <Button
                    isDisabled={page === 1}
                    onClick={() => setPage((prev) => Math.min(1, prev - 1))}
                  >
                    {/* Change to chevron? no tl needed */}
                    {t("Prev")}
                  </Button>
                  <Button
                    isDisabled={!hasMore}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    {t("Next")}
                  </Button>
                </HStack>
              </>
            )}
          </>
        )}
      </ContainerInlay>
    </PageContainer>
  );
}
