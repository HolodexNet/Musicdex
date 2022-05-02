/**
 * Song table editable is a React-Tables supported table. It's only used when editing the songs...
 *
 */
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
  useBreakpoint,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { Column, useSortBy, useTable } from "react-table";
import useNamePicker from "../../modules/common/useNamePicker";
import { SangOnGrid } from "./SongTable/SangOnCell";

type IndexedSong = Song & { idx: number };
interface SongEditableTableProps {
  songs: Song[];
  songsEdited: (songIds: string[]) => void;
}

const SongEditableTable = ({ songs, songsEdited }: SongEditableTableProps) => {
  const { t } = useTranslation();
  const tn = useNamePicker();
  const [newSongIds, setNewSongIds] = useState(() => songs.map((x) => x.id));
  const s: IndexedSong[] = useMemo(() => {
    return newSongIds.map((id, idx) => {
      return {
        ...songs.find((x) => x.id === id)!,
        idx: idx,
      };
    });
  }, [newSongIds, songs]);

  const moveOrDeleteItem = useCallback(
    (idx: number, toIdx: number | undefined) => {
      // console.log(newSongIds);
      // console.log(idx, toIdx);

      const arrayAroundDragged = [
        ...newSongIds.slice(0, idx),
        ...newSongIds.slice(idx + 1),
      ];
      if (toIdx !== undefined)
        arrayAroundDragged.splice(toIdx, 0, newSongIds[idx]);
      setNewSongIds(arrayAroundDragged);
      songsEdited(arrayAroundDragged);
      // console.log(arrayAroundDragged);
    },
    [newSongIds, songsEdited]
  );

  const columns: Column<IndexedSong>[] = useMemo<Column<IndexedSong>[]>(
    () => [
      {
        Header: "#",
        accessor: "idx",
        maxWidth: 40,
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
          tn(row.channel?.english_name, row.channel?.name),
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
        accessor: "available_at",
        Cell: (cellInfo: any) => (
          <SangOnGrid value={new Date(cellInfo.row.original.available_at)} />
        ),
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
              onClick={() => {
                moveOrDeleteItem(cellInfo.row.original.idx, undefined);
              }}
              variant="outline"
              aria-label="delete"
              colorScheme="red"
              icon={<FiTrash />}
            />
          );
        },
      },
    ],
    [tn, moveOrDeleteItem]
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

  const breakpointValue =
    useBreakpointValue({ base: 0, xs: 0, sm: 1, md: 2, lg: 2, xl: 3 }, "xl") ||
    0;

  useEffect(() => {
    toggleHideColumn("original_artist", breakpointValue < 2);
    toggleHideColumn("dur", breakpointValue < 2);
    // toggleHideColumn("idx", !isXL);
  }, [breakpointValue, toggleHideColumn]);

  const HOVER_ROW_STYLE: CSSObject = {
    backgroundColor: useColorModeValue("bgAlpha.200", "bgAlpha.800"),
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    // no movement
    if (result.destination.index === result.source.index) {
      return;
    }

    moveOrDeleteItem(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table {...getTableProps()} size={breakpointValue > 2 ? "md" : "sm"}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={(column as any).isNumeric}
                  px={breakpointValue}
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
        <Droppable droppableId="table">
          {(droppableProvided: DroppableProvided) => (
            <Tbody
              {...getTableBodyProps()}
              {...droppableProvided.droppableProps}
              ref={(ref: HTMLElement | null) => {
                droppableProvided.innerRef(ref);
              }}
            >
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <Draggable
                    draggableId={"d" + row.original.idx}
                    index={index}
                    key={"dk" + row.original.idx}
                  >
                    {(
                      provided: DraggableProvided,
                      snapshot: DraggableStateSnapshot
                    ) => (
                      <Tr
                        {...row.getRowProps()}
                        _hover={HOVER_ROW_STYLE}
                        ref={provided.innerRef}
                        // isDragging={snapshot.isDragging}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {row.cells.map(
                          (cell) =>
                            !(
                              snapshot.isDragging &&
                              cell.column.id !== "name" &&
                              cell.column.id !== "idx"
                            ) && (
                              <Td
                                {...cell.getCellProps()}
                                isNumeric={(cell.column as any).isNumeric}
                                {...{
                                  width:
                                    cell.column.id === "idx" ? "40px" : "auto",
                                }}
                                {...(snapshot.isDragging && {
                                  width:
                                    cell.column.id === "idx" ? "40px" : "100vw",
                                })}
                                px={breakpointValue}
                              >
                                {cell.render("Cell")}
                              </Td>
                            )
                        )}
                      </Tr>
                    )}
                  </Draggable>
                );
              })}
              {droppableProvided.placeholder}
            </Tbody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
};

export default SongEditableTable;
