import { useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStoreActions, useStoreState } from "../../store";
import { useServerOrgList } from "../../modules/services/statics.service";
import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";

export default function OrgManager() {
  const orglist = useStoreState((s) => s.org.orgsList);
  const setOrglist = useStoreActions((s) => s.org.setOrgsList);

  const { data: orgs, isLoading } = useServerOrgList();

  const sortedOrgList = useMemo(() => {
    return orgs?.sort((a, b) => {
      const av = orglist[a.name];
      const bv = orglist[b.name];
      if (av !== undefined && bv !== undefined) {
        return av - bv;
      } else if (av !== undefined) return -1;
      else if (bv !== undefined) return 1;
      else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [orglist, orgs]);

  const handleOnDragEnd = (result: any) => {
    if (!sortedOrgList) return;
    const items = Array.from(sortedOrgList);
    if (!result.destination) {
      items.splice(result.source.index, 1);
      return setOrglist(items.map((x) => x.name));
    }
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrglist(items.map((x) => x.name));
  };

  if (!sortedOrgList) return <div></div>;

  return (
    <SimpleGrid minChildWidth="120px" spacing="40px">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sortedOrgList.map((org, index) => (
                <Draggable
                  key={"orm-" + org.name}
                  draggableId={org.name}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Box>
                        {index + 1}. {org.name}
                      </Box>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </SimpleGrid>
  );
}
