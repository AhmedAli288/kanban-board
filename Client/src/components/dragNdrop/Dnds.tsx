import {
    Box,
    Text,
    HStack,
    Spacer,
    Badge,
    Input,
    Button,
    Flex,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, } from "react-beautiful-dnd";
import DroppableColumn from './DroppableColumn';
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import axios from 'axios';


interface items {
  company: string; 
  id: number; 
  priority: string; 
  status: string; 
  title: string;
  _id: string;
}

interface column {
  id:number; 
  name:string; 
  statuses:Array<string>; 
  items:Array<items>; 
}

interface columns {
  [key:number]: column
}

const onDragEnd = (result:any, columnOrder:Array<string>, setColumnOrder:Function, columns:columns, setColumns:Function) => {

  const {source, destination, draggableId, type} = result;  

  if(destination.droppableId === source.droppableId && destination.index === source.index) return;

  if (type === 'column') {
    const newColumnOrder = Array.from(columnOrder);
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, draggableId);
    console.log("drag col", source.index);
    
    setColumnOrder(newColumnOrder)
    return;
  }

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn:any = columns[source.droppableId];
    const destColumn:any = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    
    destItems.splice(destination.index, 0, removed);

    const sItmArr:any = []
    sourceItems.map((key:any)=>{
      sItmArr.push(key._id)
    })

    const dItmArr:any = []
    destItems.map((key:any)=>{
      dItmArr.push(key._id)
    })

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });

    axios
    .patch(`http://localhost:4000/updatelists/${sourceColumn._id}/${destColumn._id}`,{ 
      colOne:sItmArr,
      colTwo:dItmArr
    }).then((res)=>{
      console.log("itmArr res", res);
    }).catch((e)=>{
      console.log("itmArr err", e);
    })

  } else {
    const column:any = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    
    const itmArr:any = []
    copiedItems.map((key:any)=>{
      itmArr.push(key._id)
    })

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });

    axios
    .patch(`http://localhost:4000/updatelist/${column._id}`,{
      items: itmArr
    }).then((res)=>{
      console.log("itmArr res", res);
    }).catch((e)=>{
      console.log("itmArr err", e);
    })
  }
}

const Dnds = (
  { items, setItems, columnOrder, setColumnOrder, columns, setColumns } :
  {items:any, setItems:Function, columnOrder:Array<string>, setColumnOrder:Function, columns:columns, setColumns:Function}
) => {

  const [itmInput, setItmInput] = useState<any>(columnOrder.reduce((a, v) => ({ ...a, [v]: ""}), {}))
  const [itmToggle, setItmToggle] = useState<any>(columnOrder.reduce((a, v) => ({ ...a, [v]: false}), {}))
  const [colInput, setColInput] = useState<string>("")
  const [colToggle, setColToggle] = useState<Boolean>(false)

  const [inputEle, setInputEle] = useState<any>(columnOrder.reduce((a, v) => ({ ...a, [v]: ""}), {}))
  const [showInputEle, setShowInputEle] = useState<any>(columnOrder.reduce((a, v) => ({ ...a, [v]: false}), {}))
  

  const handleBlur = async (columnId:any) => {

    const changedCol:any = columns[columnId]

    const body = {
      name: inputEle[columnId]
    }

    await axios
    .patch(`http://localhost:4000/editlist/${changedCol?._id}`, body)
    .then((res)=>{
      setColumns({
        ...columns,
        [columnId]:{
          ...changedCol,
          name:inputEle[columnId],
          statuses:[inputEle[columnId]]
        }
      })

      setShowInputEle((prev:any) => {
        const newState = {
          ...prev,
          [columnId]: false
        }
        return newState
      })

      setInputEle((prev:any) => {
        const newState = {
          ...prev,
          [columnId]: ''
        }
        return newState
      })

    }).catch((e)=>{
      console.log("changedCol err", e);
    })

    
  }

  const deleteColumn = (column:any, ind:number) => {

    axios
    .delete(`http://localhost:4000/deletelist/${column._id}`)
    .then((res)=>{

        const newColumnOrder = Array.from(columnOrder);
        newColumnOrder.splice(ind, 1);
        setColumnOrder(newColumnOrder)

        delete columns[column.id]
        setColumns({...columns})

    }).catch((e)=>{
      console.log("colAdd err", e);
    })
    
  }

  const handleInput = (e:any, columnId:any) => {
    setItmInput((prev:any) => {
      const newState = {
        ...prev,
        [columnId]: e.target.value
      }
      return newState
    });
  }

  const addItem = (columnId:any) => {

    if(itmInput[columnId] === "") {
      alert("Please Enter Ticket Name")
      return
    }

    const Column = columns[columnId];
    let newItem

    if(items.length === 0 ){
      newItem = {
        company: itmInput[columnId],
        id: 1111,
        priority: "Priority 1",
        status: Column.name,
        title: itmInput[columnId]
      }
    }else{
      newItem = {
        company: itmInput[columnId],
        id: items[items.length-1].id+1,
        priority: "Priority 1",
        status: Column.name,
        title: itmInput[columnId]
      }
    }

    axios
    .post(`http://localhost:4000/createtask`,newItem
    ).then((res)=>{

      const newItems = [...Column?.items, res.data];
  
      setItems([...items, res.data])
  
      setColumns({
        ...columns,
        [columnId]: {
          ...Column,
          items: newItems
        }
      });
      setItmInput({
        ...itmInput,
        [columnId]: ""
      });
      setItmToggle((prev:any) => {
        const newState = {
          ...prev,
          [columnId]: false
        }
        return newState
      });
      // console.log("itmAdd res", res);
    }).catch((e)=>{
      console.log("itmAdd err", e);
    })

  }

  const handleColInput = () => {

    if(colInput === "") {
      alert("Please Enter Column Name")
      return
    }

    var addedCol:any
    let colAdd
    if(columnOrder.length === 0){
      addedCol = 0
    }else{
      addedCol = parseInt(columnOrder[columnOrder.length-1])+1
    }

    colAdd = { 
      id: addedCol+1, 
      name: colInput, 
      statuses: [colInput],
      items: []
    }
    

    axios
    .post(`http://localhost:4000/createlist`, colAdd
    ).then((res)=>{

      const newCol = { ...columns, [addedCol]: res.data}
      setColumns(newCol);

      setColumnOrder([...columnOrder, addedCol.toString()])
      setColInput("")
      setColToggle(false)

    }).catch((e)=>{
      console.log("colAdd err", e);
    })
  }

  return(
    <Box 
      display="flex"
      width="85vw" 
      overflow="auto"
    >
      <DragDropContext 
        onDragEnd={(result)=> onDragEnd(result, columnOrder, setColumnOrder, columns, setColumns)} 
        onDragStart={(res)=>{console.log("onDragStart",res);
        }}
      >
        <Flex
          mr="5"
        >

        { columnOrder.length?
          <Droppable 
            droppableId="mainColumn"
            direction='horizontal'
            type='column'
          >
            {(provided)=>{
              return (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                display="flex"
              >
                {columnOrder.map((columnId:any, ind:any) => {

                  const column = columns[columnId]
                  
                  return(
                    <Draggable
                      key={columnId}
                      draggableId={columnId}
                      index = {ind}
                    >
                      {
                        ((provided)=>{
                          return(
                            <Box 
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              key={columnId} 
                              alignItems="center" 
                              width="18vw"
                              ml="10" 
                              mt="5" 
                              gap={2}
                            >
                              <Box 
                                bg="#ECECEC"
                                borderTopLeftRadius="20" 
                                borderTopRightRadius="20" 
                              >
                                <HStack 
                                {...provided.dragHandleProps}
                                mx="10"
                                >
                                  {
                                    showInputEle[columnId] ? (
                                      <Input
                                        variant="outline"
                                        type='text'
                                        size="md"
                                        height="25"
                                        width="97%"
                                        border="2px solid"
                                        pt="5"
                                        borderRadius="5"
                                        borderColor="#ECECEC"
                                        autoFocus
                                        _focusVisible={{
                                          borderColor:"#ECECEC"
                                        }}
                                        value={inputEle[columnId]}
                                        onChange={(e)=>{setInputEle((prev:any) => {
                                          const newState = {
                                            ...prev,
                                            [columnId]: e.target.value
                                          }
                                          return newState
                                          })
                                        }}
                                        onBlur={()=>{
                                          handleBlur(columnId)
                                        }}
                                      />
                                    ) : (
                                      <Text onDoubleClick={()=>{setShowInputEle((prev:any) => {
                                          const newState = {
                                            ...prev,
                                            [columnId]: true
                                          }
                                          return newState
                                          })
                                        }}
                                      >
                                        {column?.name}
                                      </Text>
                                    )
                                  }
                                  <Spacer/>
                                  <Badge 
                                    bg="#9CA3AF" 
                                    px={10} 
                                    py={3} 
                                    borderRadius="5" 
                                    color="#E5E7EB" 
                                    fontSize="12px" 
                                    fontWeight="500" 
                                    mb="10"
                                  >
                                    {column?.items?.length? column?.items.length : 0}
                                  </Badge>
                                  <DeleteIcon 
                                    w="18" 
                                    h="18" 
                                    pb="3" 
                                    pl="5" 
                                    color="red" 
                                    _hover={{
                                      cursor:"Pointer"
                                    }}
                                    onClick={()=>{deleteColumn(column, ind)}}
                                  />
                                </HStack>
                              </Box>
                              <DroppableColumn 
                                droppableId={columnId}
                                key={columnId}
                                index={ind}
                                column={column} 
                                inputToggle={itmToggle}
                                columns={columns}
                                setColumns={setColumns}
                              />
                              <Box
                                bg="#ECECEC"
                                borderBottomLeftRadius={itmToggle[columnId]? "5" : "20"}
                                borderBottomRightRadius={itmToggle[columnId]? "5" : "20"}
                              >
                                {itmToggle[columnId] ? (
                                  <VStack
                                    alignItems="start"
                                  >
                                    <Input
                                      variant="outline"
                                      type='text'
                                      size="md"
                                      height="25"
                                      width="97%"
                                      border="2px solid"
                                      pt="5"
                                      borderRadius="5"
                                      borderColor="#ECECEC"
                                      value={itmInput[columnId]}
                                      onChange={(e)=>{handleInput(e, columnId)}}
                                      _focusVisible={{
                                        borderColor:"#ECECEC",
                                      }}
                                    />
                                    <HStack>
                                      <Button 
                                        px="12"
                                        py="4"
                                        ml="4"
                                        mb="4"
                                        borderRadius="5"
                                        border="0px"
                                        fontSize="16"
                                        bg="#002F5A"
                                        color="#fff"
                                        _hover={{
                                          cursor:"Pointer"
                                        }}
                                        onClick={()=>{addItem(columnId)} }
                                      >
                                        Add Item
                                      </Button>
                                      <CloseIcon 
                                        w="18" 
                                        h="18" 
                                        pb="3" 
                                        pl="5" 
                                        color="#9CA3AF" 
                                        _hover={{
                                          cursor:"Pointer"
                                        }}
                                        onClick={()=>{
                                          setItmToggle((prev:any) => {
                                            const newState = {
                                              ...prev,
                                              [columnId]: false
                                            }
                                            return newState
                                          }); 
                                          setItmInput((prev:any) => {
                                            const newState = {
                                              ...prev,
                                              [columnId]: ""
                                            }
                                            return newState
                                          });
                                        }} 
                                      />
                                    </HStack>
                                  </VStack>
                                ):(
                                  <Button 
                                    leftIcon={<AddIcon w="16" h="16" mr="5" color="#9CA3AF" />} 
                                    my="15"
                                    alignContent="start"
                                    border="0px"
                                    colorScheme='teal' 
                                    variant='outline'
                                    fontSize="16"
                                    width="97%"
                                    height="8"
                                    borderRadius="5"
                                    _hover={{
                                      cursor:"Pointer"
                                    }}
                                    onClick={()=>{setItmToggle((prev:any) => {
                                      const newState = {
                                        ...prev,
                                        [columnId]: true
                                      }
                                      return newState
                                      })
                                    }}
                                  >
                                    Add Ticket
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          )
                        })
                      }
                    </Draggable>
                  )
                })}

                {provided.placeholder}
              </Box>
              )
            }}
          
          </Droppable>
          : null
        }
        <Box 
          alignItems="center" 
          width="18vw"
          ml="10" 
          mt="5" 
          // gap={2}
        >
          <Box 
            bg="#ECECEC"
            borderRadius={colToggle? "5" : "20"}
          >
            {colToggle ? (
              <VStack
                alignItems="start"
              >
                <Input
                  variant="outline"
                  type='text'
                  size="md"
                  height="25"
                  width="97%"
                  border="2px solid"
                  pt="5"
                  borderRadius="5"
                  borderColor="#ECECEC"
                  value={colInput}
                  onChange={(e)=>{setColInput(e.target.value)}}
                  _focusVisible={{
                    borderColor:"#ECECEC"
                  }}
                />
                <HStack>
                  <Button 
                    px="12"
                    py="4"
                    ml="4"
                    mb="4"
                    borderRadius="5"
                    border="0px"
                    fontSize="16"
                    bg="#002F5A"
                    color="#fff"
                    _hover={{
                      cursor:"Pointer"
                    }}
                    onClick={handleColInput} 
                  >
                    Add Column
                  </Button>
                  <CloseIcon 
                    w="18" 
                    h="18" 
                    pb="3" 
                    pl="5" 
                    color="#9CA3AF" 
                    _hover={{
                      cursor:"Pointer"
                    }}
                    onClick={()=>{setColToggle(false); setColInput("");}} 
                  />
                </HStack>
              </VStack>
            ):(
              <Button 
                leftIcon={<AddIcon w="16" h="16" mr="5" color="#9CA3AF" />} 
                my="15"
                alignContent="start"
                border="0px"
                colorScheme='teal' 
                variant='outline'
                fontSize="16"
                width="97%"
                height="8"
                borderRadius="5"
                _hover={{
                  cursor:"Pointer"
                }}
                onClick={()=>{setColToggle(true)}}
              >
                { columnOrder.length? "Add another column" : "Add column" }
              </Button>
            )}
          </Box>
          
        </Box>
        </Flex>
      </DragDropContext>
    </Box>
    
  )
}

export default Dnds;