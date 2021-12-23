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
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiMoreHorizontal } from "react-icons/fi";
import { useTable, useSortBy, Column } from "react-table";

type IndexedSong = Song & { idx: number };

export const SongTable = ({ songs }: { songs: Song[] }) => {
  const { t, i18n } = useTranslation();
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
          console.log(cellInfo);
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
        accessor: (row: IndexedSong) => row.channel.english_name,
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
          t("shortDateTime", { date: new Date(row?.available_at) }),
      },
      {
        id: "...",
        Header: "",
        disableSortBy: true,
        accessor: "idx",
        Cell: (cellInfo: any) => {
          console.log(cellInfo);
          return (
            <IconButton
              aria-label="more"
              icon={<FiMoreHorizontal />}
            ></IconButton>
          );
        },
      },
    ],
    []
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
    },
    useSortBy
  );

  const isXL = useBreakpointValue({ base: false, xl: true });

  useEffect(() => {
    toggleHideColumn("original_artist", !isXL);
    toggleHideColumn("idx", !isXL);
  }, [isXL]);

  return (
    <Table {...getTableProps()} size={isXL ? "md" : "sm"}>
      <Thead>
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
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td
                  {...cell.getCellProps()}
                  isNumeric={(cell.column as any).isNumeric}
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
  );
};
