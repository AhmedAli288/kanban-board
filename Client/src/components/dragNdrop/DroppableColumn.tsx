import { Box, } from "@chakra-ui/react";
import React from "react";
import { Droppable } from "react-beautiful-dnd"
import DraggableCard from "./DraggableCard"

interface column {
    id:number; 
    name:string; 
    statuses:Array<string>; 
    items:Array<items>; 
}
interface items {
    company: string; 
    id: number; 
    priority: string; 
    status: string; 
    title: string;
    _id: string;
}


const DroppableColumn = ({
        droppableId, column, inputToggle, columns, setColumns
    }:{
        droppableId:string, index:any, column:column, inputToggle:any, columns:any, setColumns:any 
    }) => {
    
    return(
        <Droppable 
            droppableId={droppableId}
            key={droppableId}
            type="task"
        >
            {(provided, snapshot)=>(
                <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    bg= {snapshot.isDraggingOver ? "#E5E7EB" : "#E5E7EF"}
                    py="5"
                    height={inputToggle[droppableId]?"72vh":"77vh"}
                    overflowY="auto"
                    overflowX="hidden"
                    transition="0.5s ease"
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: "#e0e0e0",
                            borderRadius: '24px',
                        },
                    }}
                >
                    {column?.items?.map((item: items, index: number) => {

                        return (    
                            <DraggableCard 
                                key={item?.id} 
                                item={item} 
                                index={index} 
                                columnId={droppableId}
                                columns={columns}
                                setColumns={setColumns}
                            />
                        );
                    })}
                    {provided.placeholder}
                </Box>

            )}
            </Droppable> 
    )
}

export default React.memo(DroppableColumn);