import {
  CSSObject,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";
import { ContextMenuParams, useContextMenu } from "react-contexify";
import { useTranslation } from "react-i18next";
import { BiMovie } from "react-icons/bi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { Column, Row, useSortBy, useTable } from "react-table";
import { useStoreActions, useStoreState } from "../../store";
import { formatSeconds } from "../../utils/SongHelper";
import { DEFAULT_MENU_ID } from "../common/CommonContext";
import { NowPlayingIcon } from "../common/NowPlayingIcon";
import { SongLikeButton } from "../song/SongLikeButton";
import { useDraggableSong } from "./DraggableSong";

type IndexedSong = Song & { idx: number };

interface SongTableProps {
  songs: Song[];

  // reactive hooks:
  songClicked?: (e: React.MouseEvent, s: Song) => void;
  songDropdownMenuRenderer?: (cellInfo: any) => JSX.Element;

  // table controls:
  isSortable?: boolean; // default true

  menuId?: string;
}

const COLUMN_MIN_WIDTHS: { [key: string]: string } = {
  idx: "40px",
  // 'dur': '20px',
  "...": "100px",
};

const IdxGrid = ({
  row: { original },
  value,
}: {
  row: { original: Song };
  value: any;
}) => {
  const currentId = useStoreState(
    (state) => state.playback.currentlyPlaying?.song?.id
  );

  return original.id === currentId ? (
    <NowPlayingIcon style={{ color: "var(--chakra-colors-n2-400)" }} />
  ) : (
    value
  );
};

const TitleGrid = ({ row: { original } }: { row: { original: Song } }) => {
  return (
    <VStack alignItems="start" spacing={1}>
      <span>{original?.name}</span>
      <Text opacity={0.66} fontWeight={300} fontSize="sm">
        {original.channel?.name}
      </Text>
    </VStack>
  );
};

const DurationGrid = ({
  row: { original },
  value,
}: {
  row: { original: Song };
  value: any;
}) => {
  return (
    <>
      {original.is_mv && (
        <Icon mb="-3px" mr={3} as={BiMovie} title="MV" color="gray.500"></Icon>
      )}{" "}
      {value}
    </>
  );
};

const SangOnGrid = ({
  row: { original },
  value,
}: {
  row: { original: Song };
  value: any;
}) => {
  const { t } = useTranslation();
  return (
    <span title={t("absoluteDate", { date: value as Date })}>
      {t("relativeDate", { date: value })}
    </span>
  );
};
export const SongTable = ({
  songs,
  songClicked,
  songDropdownMenuRenderer,
  isSortable = true,
  menuId = DEFAULT_MENU_ID,
}: SongTableProps) => {
  const { t } = useTranslation();
  // const t = (str: string, ..._: { date: Date; }[]) => str;
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const indexedSongs: IndexedSong[] = React.useMemo(() => {
    return songs.map((v, i) => {
      return { ...v, idx: i + 1 };
    });
  }, [songs]);

  const { show } = useContextMenu({ id: menuId });

  const dropDownUsageFn = React.useMemo(
    () =>
      songDropdownMenuRenderer
        ? songDropdownMenuRenderer
        : (cellInfo: any) => (
            <IconButton
              //   py={2}
              icon={<FiMoreHorizontal />}
              rounded="full"
              size="sm"
              mr={-2}
              variant="ghost"
              colorScheme="n2"
              aria-label="More"
              onClick={(e) => show(e, { props: cellInfo?.row?.original })}
            ></IconButton>
          ),
    [songDropdownMenuRenderer]
  );
  // const [front,front2] = useCOlorMode

  const columns: Column<IndexedSong>[] = React.useMemo<Column<IndexedSong>[]>(
    () => [
      {
        Header: "#",
        accessor: "idx",
        maxWidth: 40,
        minWidth: 40,
        width: 40,
        Cell: IdxGrid,
      },
      {
        Header: "Title",
        accessor: "name",
        Cell: TitleGrid,
      },
      {
        id: "channel",
        Header: "ChannelName",
        accessor: (row: IndexedSong) =>
          row.channel?.english_name || row.channel?.name,
      },
      {
        Header: "Original Artist",
        accessor: "original_artist",
      },
      {
        id: "dur",
        Header: "Duration",
        accessor: (row: { end: number; start: number }) => {
          return formatSeconds(row.end - row.start);
        },
        isNumeric: true,
        Cell: DurationGrid,
      },
      {
        id: "date",
        Header: "Sang On",
        accessor: (row: { available_at: Date }) => new Date(row?.available_at),
        Cell: SangOnGrid,
      },
      {
        id: "...",
        Header: "",
        disableSortBy: true,
        accessor: "idx",
        Cell: dropDownUsageFn,
      },
    ],
    [dropDownUsageFn]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    toggleHideColumn,
  } = useTable(
    {
      columns: columns as any,
      data: indexedSongs,
      initialState: { hiddenColumns: ["channel"] },
      disableSortBy: !isSortable,
    },
    useSortBy
  );

  const isXL = useBreakpointValue({ base: 2, xs: 0, sm: 1, md: 2, xl: 3 });

  useEffect(() => {
    if (isXL === undefined) return;
    toggleHideColumn("original_artist", isXL < 3);
    toggleHideColumn("idx", isXL < 3);
    toggleHideColumn("date", isXL < 2);
    toggleHideColumn("dur", isXL < 1);
  }, [isXL, toggleHideColumn]);

  const defaultClickBehavior = useCallback(
    (e: React.MouseEvent<any, MouseEvent>, song: Song) => {
      queueSongs({
        songs: [song],
        immediatelyPlay: true,
      });
    },
    [queueSongs]
  );

  return (
    <>
      <Table {...getTableProps()} size={isXL! >= 1 ? "md" : "sm"}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()} px={2}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={(column as any).isNumeric}
                  px={{ xl: 3, base: 2 }}
                >
                  {column.isSorted &&
                    (column.isSortedDesc ? (
                      <Icon as={FaChevronDown} display="inline" mr="2" />
                    ) : (
                      <Icon as={FaChevronUp} display="inline" mr="2" />
                    ))}
                  {column.render("Header")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <MemoizedRow
                key={"_" + row.original.id + "_" + index}
                {...{
                  row,
                  show,
                  songClicked,
                  defaultClickBehavior,
                }}
              />
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};
const MemoizedRow = React.memo(
  ({
    row,
    show,
    songClicked,
    defaultClickBehavior,
  }: {
    row: Row<IndexedSong>;
    show?: (
      event: any,
      params?: Pick<ContextMenuParams, "id" | "props" | "position"> | undefined
    ) => void;
    songClicked: ((e: React.MouseEvent, s: Song) => void) | undefined;
    defaultClickBehavior: (
      e: React.MouseEvent<any, MouseEvent>,
      song: Song
    ) => void;
  }): JSX.Element => {
    const HOVER_ROW_STYLE: CSSObject = {
      backgroundColor: useColorModeValue("bgAlpha.200", "bgAlpha.800"),
    };
    const dragSongProps = useDraggableSong(row.original);
    return (
      <Tr
        {...row.getRowProps()}
        onContextMenu={(e) => {
          show?.(e, { props: row.original });
        }}
        _hover={HOVER_ROW_STYLE}
        {...dragSongProps}
      >
        {row.cells.map((cell) => (
          <Td
            {...cell.getCellProps()}
            isNumeric={(cell.column as any).isNumeric}
            {...{
              width: COLUMN_MIN_WIDTHS?.[cell.column.id] || "auto",
            }}
            {...(cell.column.id === "idx" && { cursor: "move" })}
            {...(cell.column.id !== "..."
              ? {
                  onClick: (e) => {
                    if (window.getSelection()?.toString()?.length)
                      return e.preventDefault();
                    songClicked
                      ? songClicked(e, row.original)
                      : defaultClickBehavior(e as any, row.original);
                  },
                }
              : {})}
            px={{ xl: 3, base: 2 }}
          >
            {cell.column.id === "..." && <SongLikeButton song={row.original} />}
            {cell.render("Cell")}
          </Td>
        ))}
      </Tr>
    );
  }
);
