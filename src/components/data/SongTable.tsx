import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  VStack,
  Text,
  Box,
  useBreakpointValue,
  IconButton,
  CSSObject,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMoreHorizontal } from "react-icons/fi";
import { useTable, useSortBy, Column } from "react-table";
import {
  ContextMenuItem,
  ContextMenuList,
  ContextMenuTrigger,
  useContextTrigger,
} from "../context-menu";
import { useStoreActions } from "../../store";
import { SongTableDropDownMenu } from "./SongTableDropdownButton";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type IndexedSong = Song & { idx: number };

export interface SongTableProps {
  songs: Song[];

  // reactive hooks:
  songClicked?: (e: React.MouseEvent, s: Song) => void;
  songDropdownMenuRenderer?: (cellInfo: any) => JSX.Element;
  songRightClickContextMenuRenderer?: (_: {
    song: Song;
    menuId: string;
    closeContextMenu: () => void;
  }) => JSX.Element;

  // table controls:
  isSortable?: boolean; // default true

  menuId?: string;
}

export const SongTable = ({
  songs,
  songClicked,
  songDropdownMenuRenderer,
  songRightClickContextMenuRenderer,
  isSortable = true,
  menuId,
}: SongTableProps) => {
  const { t, i18n } = useTranslation();
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const s: IndexedSong[] = React.useMemo(() => {
    return songs.map((v, i) => {
      return { ...v, idx: i };
    });
  }, [songs]);
  const columns: Column<IndexedSong>[] = React.useMemo<Column<IndexedSong>[]>(
    () => [
      {
        Header: "#",
        accessor: "idx",
      },
      {
        Header: "Title",
        accessor: "name",
        Cell: (cellInfo: any) => {
          // console.log(cellInfo);
          return (
            <VStack alignItems="start" spacing={1}>
              <span>{cellInfo.row.original?.name}</span>
              <Text color="whiteAlpha.600" fontWeight={300} fontSize="sm">
                {cellInfo.row.original.channel?.name}
              </Text>
            </VStack>
          );
        },
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
          return row.end - row.start;
        },
        isNumeric: true,
      },
      {
        id: "date",
        Header: "Sang On",
        accessor: (row: { available_at: Date }) =>
          t("relativeDate", { date: new Date(row?.available_at) }),
      },
      {
        id: "...",
        Header: "",
        disableSortBy: true,
        accessor: "idx",
        Cell: (cellInfo: any) => {
          // console.log(cellInfo);
          return <SongTableDropDownMenu />;
        },
      },
    ],
    [t]
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
      data: s,
      initialState: { hiddenColumns: ["channel"] },
      disableSortBy: !isSortable,
    },
    useSortBy
  );

  const isXL = useBreakpointValue({ base: false, xl: true });

  useEffect(() => {
    toggleHideColumn("original_artist", !isXL);
    toggleHideColumn("idx", !isXL);
  }, [isXL, toggleHideColumn]);

  const [menuIdStat] = useState(
    () => menuId || Math.floor(Math.random() * 10000).toString()
  );

  const contextMenuTrigger = useContextTrigger({ menuId: menuIdStat });

  const HOVER_ROW_STYLE: CSSObject = {
    backgroundColor: useColorModeValue("bgAlpha.200", "bgAlpha.800"),
  };

  const defaultClickBehavior = (
    e: React.MouseEvent<any, MouseEvent>,
    song: Song
  ) =>
    queueSongs({
      songs: [song],
      immediatelyPlay: false,
    });

  return (
    <>
      <ContextMenuList
        menuId={menuIdStat}
        render={({ menuId, closeContextMenus, passData }) => {
          if (songRightClickContextMenuRenderer)
            return songRightClickContextMenuRenderer({
              menuId,
              closeContextMenu: closeContextMenus,
              song: passData,
            });

          return (
            <ContextMenuItem onClick={({ passData }) => {}}>
              Action {passData?.name}
            </ContextMenuItem>
          );
        }}
      ></ContextMenuList>

      <Table {...getTableProps()} size={isXL ? "md" : "sm"}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={(column as any).isNumeric}
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
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr
                {...row.getRowProps()}
                onContextMenu={(e) => {
                  contextMenuTrigger(e, row.original);
                }}
                _hover={HOVER_ROW_STYLE}
              >
                {row.cells.map((cell) => (
                  <Td
                    {...cell.getCellProps()}
                    isNumeric={(cell.column as any).isNumeric}
                    {...(cell.column.id !== "..."
                      ? {
                          onClick: (e) => {
                            songClicked
                              ? songClicked(e, row.original)
                              : defaultClickBehavior(e as any, row.original);
                          },
                        }
                      : {})}
                  >
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={(column as any).isNumeric}
                >
                  {column.render("Header")}
                  <Box pl="4">
                    {column.isSorted ? (column.isSortedDesc ? "v" : "^") : ""}
                  </Box>
                </Th>
              ))}
            </Tr>
          ))}
        </Tfoot>
      </Table>
    </>
  );
};
