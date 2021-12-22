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
  chakra,
} from "@chakra-ui/react";
import React from "react";
import { useTable, useSortBy } from "react-table";

export const SongTable = ({ songs }: { songs: Song[] }) => {
  const s = songs.map((v: any, i) => {
    v["idx"] = i;
    return v;
  });
  const columns = [
    {
      Header: "#",
      accessor: "idx",
    },
    {
      Header: "Title",
      accessor: "name",
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
      accessor: (row: { available_at: Date }) => row?.available_at.toString,
    },
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns as any, data: s }, useSortBy);

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={(column as any).isNumeric}
              >
                {column.render("Header")}
                <chakra.span pl="4">
                  {column.isSorted ? (column.isSortedDesc ? "v" : "^") : null}
                </chakra.span>
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
    </Table>
  );
};

// export const NormalSongTable = ({songs, colorScheme}:{
//   songs: Song[],
//   colorScheme?: string | (string & {}) | undefined
// }) => {
//   return (
//     <Table variant="simple" colorScheme={colorScheme}>
//       <Thead>
//         <Tr>
//           <Th isNumeric>#</Th>
//           <Th>Title</Th>
//           {/* <Th>Covered By</Th> */}
//           <Th>Original Artist</Th>
//           <Th isNumeric>Duration</Th>
//           <Th isNumeric>Sang On</Th>
//           <Th> Fn </Th>
//         </Tr>
//       </Thead>
//       <Tbody>{songs.map((s, i) => SongTableItem(s, i))}</Tbody>
//       <Tfoot>
//         <Tr>
//           <Th>#</Th>
//           <Th>Title</Th>
//           {/* <Th>Covered By</Th> */}
//           <Th>Original Artist</Th>
//           <Th isNumeric>Duration</Th>
//           <Th isNumeric>Sang On</Th>
//           <Th> Fn </Th>
//         </Tr>
//       </Tfoot>
//     </Table>
//   );
// };

// export const SongTableItem = (song: Song, idx: number) => {
//   if (!song) return <div> huh</div>;
//   return (
//     <Tr>
//       <Td isNumeric>{idx}</Td>
//       <Td>
//         <VStack alignItems="start">
//           <span>{song?.name}</span>
//           <Text color="whiteAlpha.600" fontWeight={300} fontSize="sm">
//             {song.channel?.name}{" "}
//           </Text>
//         </VStack>
//       </Td>
//       <Td>{song.original_artist}</Td>
//       <Td isNumeric>{song.end - song.start}</Td>
//       <Td isNumeric>{song.available_at}</Td>
//       <Td> X Y Z </Td>
//     </Tr>
//   );
// };
