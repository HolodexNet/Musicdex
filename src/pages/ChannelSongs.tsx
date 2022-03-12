import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { Suspense, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { DEFAULT_FETCH_CONFIG } from "../modules/services/defaults";
import { useSongAPI } from "../modules/services/songs.service";
import { useStoreActions } from "../store";
const PERPAGE = 10;
export default function ChannelSongs() {
  // const history = useStoreState((store) => store.playback.history);
  let params = useParams();
  let channelId = params.id!;

  const { data: channel, ...channelStatus } = useQuery(
    ["channel", channelId],
    async (q) => {
      return (await axios.get("/api/v2/channels/" + q.queryKey[1])).data;
    },
    { ...DEFAULT_FETCH_CONFIG, cacheTime: 600000 /* 10 mins */ }
  );

  const [offset, setOffset] = useState(0);
  const { data, ...songStatus } = useSongAPI({
    channel_id: channelId,
    paginated: true,
    limit: PERPAGE,
    offset: offset,
  });

  const { items: latest, total } = useMemo(
    () => (data as any) || { items: undefined, total: 0 },
    [data]
  );
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const navigate = useNavigate();

  if (!channelStatus.isSuccess)
    return <QueryStatus queryStatus={channelStatus} />;
  if (songStatus.isLoading) return <QueryStatus queryStatus={songStatus} />;

  return (
    <>
      <HStack alignItems="center" py={1}>
        <Button
          variant="solid"
          width="22px"
          height="22px"
          size="30px"
          borderRadius="full"
          position="relative"
          as="a"
          href={"/channel/" + channel.id}
          onClick={(e) => {
            e.preventDefault();
            navigate("/channel/" + channel.id);
          }}
        >
          <FiArrowLeft />
        </Button>
        <Heading size="md">
          All Songs ({offset + 1} - {offset + latest.length} of {total}){" "}
        </Heading>
        <Button
          variant="ghost"
          size="sm"
          py={0}
          colorScheme="n2"
          onClick={() => {
            queueSongs({ songs: latest, immediatelyPlay: false });
          }}
        >
          Queue ({latest.length})
        </Button>
      </HStack>
      <Suspense fallback={<div>Loading...</div>}>
        <SongTable songs={latest} rowProps={{ indexShift: offset }}></SongTable>
      </Suspense>
      <ButtonGroup colorScheme="brand" mt="3" spacing="5">
        <Button
          onClick={() =>
            setOffset((e) =>
              Math.max(
                Math.min(Math.floor(total / PERPAGE) * PERPAGE, e - PERPAGE),
                0
              )
            )
          }
          disabled={offset === 0}
        >
          <FiArrowLeft />
        </Button>
        <Editable
          key={offset}
          defaultValue={String(Math.floor(offset / PERPAGE) + 1)}
          fontSize="xl"
          onSubmit={(e) => {
            const n = Number.parseInt(e);
            setOffset(
              Math.max(
                Math.min(
                  Math.floor(total / PERPAGE) * PERPAGE,
                  (n - 1) * PERPAGE
                ),
                0
              )
            );
          }}
        >
          <EditablePreview />
          <EditableInput
            width="30px"
            type="number"
            min="1"
            max={Math.ceil(total / PERPAGE)}
          />
        </Editable>
        <Button
          onClick={() =>
            setOffset((e) =>
              Math.max(
                Math.min(Math.floor(total / PERPAGE) * PERPAGE, e + PERPAGE),
                0
              )
            )
          }
          disabled={offset + PERPAGE > total}
        >
          <FiArrowRight />
        </Button>
      </ButtonGroup>
    </>
  );
}
