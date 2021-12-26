import {
  VStack,
  useBreakpointValue,
  CSSObject,
  useColorModeValue,
  Table,
  Thead,
  Tr,
  Th,
  Icon,
  Tbody,
  Td,
  Tfoot,
  Box,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDelete, FiTrash } from "react-icons/fi";
import { Column, useTable, useSortBy, Row } from "react-table";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";

interface SongEditableTableProps {
  songs: Song[];
  songsEdited: (songIds: number[]) => void;
}

type IndexedSong = Song & { idx: number };

export const SongEditableTable = ({
  songs,
  songsEdited,
}: SongEditableTableProps) => {
  const { t } = useTranslation();
  // const t = (str: string, ..._: { date: Date; }[]) => str;
  const [newSongIds, setNewSongIds] = useState(() => songs.map((x) => x.id));
  const s: IndexedSong[] = useMemo(() => {
    return newSongIds.map((id, idx) => {
      return {
        ...songs.find((x) => x.id === id)!,
        idx,
      };
    });
  }, [newSongIds, songs]);
  const columns: Column<IndexedSong>[] = useMemo<Column<IndexedSong>[]>(
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
          return (
            <IconButton
              variant="outline"
              aria-label="delete"
              colorScheme="red"
              icon={<FiTrash />}
            />
          );
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
      disableSortBy: true,
      //   getRowId: (or, idx) => idx.toString(),
    },
    useSortBy
  );

  const isXL = useBreakpointValue({ base: false, xl: true });

  useEffect(() => {
    toggleHideColumn("original_artist", !isXL);
    toggleHideColumn("idx", !isXL);
  }, [isXL, toggleHideColumn]);

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    console.log(dragIndex, hoverIndex);
    const arrayAroundDragged = [
      ...newSongIds.slice(0, dragIndex),
      ...newSongIds.slice(dragIndex + 1),
    ];
    arrayAroundDragged.splice(hoverIndex, 0, newSongIds[dragIndex]);
    setNewSongIds(arrayAroundDragged);
    // songsEdited(arrayAroundDragged);
    // console.log(arrayAroundDragged);
    // const dragRecord = records[dragIndex]
    // setRecords(
    //   update(records, {
    //     $splice: [
    //       [dragIndex, 1],
    //       [hoverIndex, 0, dragRecord],
    //     ],
    //   })
    // )
  };
  // console.log(newSongIds);

  return (
    <DndProvider debugMode={true} backend={HTML5Backend as any}>
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
                  {column.render("Header")} {newSongIds.join(" ")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            return (
              <SRow
                index={row.original.idx}
                row={row}
                moveRow={moveRow}
                {...row.getRowProps()}
                key={"rc" + row.original.id + "idx" + idx}
              />
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
    </DndProvider>
  );
};

const DND_ITEM_TYPE = "row";

const SRow = ({
  row,
  index,
  moveRow,
}: {
  row: Row<IndexedSong>;
  index: number;
  moveRow: (dragIndex: any, hoverIndex: any) => void;
}) => {
  const dropRef: any = React.useRef(null);
  const dragRef: any = React.useRef(null);

  const HOVER_ROW_STYLE: CSSObject = {
    backgroundColor: useColorModeValue("bgAlpha.200", "bgAlpha.800"),
  };

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item: any, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset: any = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: DND_ITEM_TYPE,
    item: { type: DND_ITEM_TYPE, index },
    collect: ((monitor: { isDragging: () => any }) => {
      if (monitor.isDragging()) console.log(index);
      return {
        isDragging: monitor.isDragging(),
      };
    }) as any,
  }));

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  //   drag(dragRef);

  return (
    <Tr
      {...row.getRowProps()}
      _hover={HOVER_ROW_STYLE}
      // style={{opacity}}
      ref={dropRef}
      opacity={opacity}
    >
      {row.cells.map((cell: any) => {
        if (cell.column.id === "idx") {
          return <Td ref={drag}>Move {index}</Td>;
        }
        return (
          <Td
            {...cell.getCellProps()}
            isNumeric={(cell.column as any).isNumeric}
          >
            {cell.render("Cell")}
          </Td>
        );
      })}
    </Tr>

    //   <tr ref={dropRef} style={{ opacity }}>
    //     <td ref={dragRef}>move</td>
    //     {row.cells.map(cell => {
    //       return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
    //     })}
    //   </tr>
  );
};
