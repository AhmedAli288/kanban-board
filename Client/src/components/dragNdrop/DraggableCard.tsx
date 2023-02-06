import React, { useState } from 'react'
import {
    Flex,
    Badge,
    Text,
    VStack,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    Button,
    Input,
} from '@chakra-ui/react';
import profile from "../../assets/images/segun_adebayo.jpg"
import MyAvatar from './Avatar';
import { Draggable } from 'react-beautiful-dnd';
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons'
import axios from 'axios';


interface items {
  company: string; 
  id: number; 
  priority: string; 
  status: string; 
  title: string;
  _id: string;
}

function DraggableCard({item, index, columnId, columns, setColumns}:{item:items, index:number, columnId:any, columns:any, setColumns:any}) {
  const priority:Record<string, Record<string, string>> = {
    "Priority 1": {
      color: "#9B1C1C", 
      bg:"#FDE8E7"
    },
    "Priority 2": {
      color: "#723B13", 
      bg:"#FDF6B2"
    },
    "Priority 3": {
      color: "#3445D9", 
      bg:"#E1EFFE"
    },
    "Priority 4": {
      color: "#18644F", 
      bg:"#DEF7EC"
    }
  }
  const [itmInput, setItmInput] = useState<string>("")
  const [itmToggle, setItmToggle] = useState<Boolean>(false)

  const onEdit = () => {
    const col = columns[columnId]
    const items = col.items

    const itmId = item?._id

    item.company = itmInput
    item.title = itmInput

    const newCol = {
      ...columns,
      [columnId]:{
        ...col,
        items:[...items]
      }
    }

    const body = {
      company: itmInput,
      title: itmInput
    }

    axios
    .patch(`http://localhost:4000/updatetask/${itmId}`,body)
    .then((res)=>{

      setColumns(newCol)

      setItmInput('')
      setItmToggle(false)

    }).catch((e)=>{
      console.log("changeItem err", e);
    })

  }

  const onRemove = () => {

    axios
    .delete(`http://localhost:4000/deletetask/${item._id}`)
    .then((res)=>{
      const column:any = columns[columnId];
      const items = [...column.items];
      items.splice(index, 1);
      setColumns({
        ...columns,
        [columnId]: {
          ...column,
          items: items
        }
      });
    }).catch((e)=>{
      console.log("delItm err", e);
    })
  }
  
  return (
    <Draggable key={item?.id} draggableId={item?.id.toString()} index={index}>
      {(provided, snapshot) => {
        return(
          <VStack
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              margin:"5px",
              borderRadius:"20px",
              userSelect: "none",
              backgroundColor: snapshot.isDragging
                ? "#fefefe"
                : "#fff",
              color: "#000",
              ...provided.draggableProps.style
            }}
          >
          <Flex 
          style={{
            justifyContent:"space-between",
            width:"90%",
            paddingRight:0,
            paddingLeft:0,
            padding: 16,
            minHeight: "18vh",
          }}
          >
            <VStack alignItems="start">
              <Text fontSize="16px" fontWeight='500' lineHeight="19px"  my="0" px="10" pt="5" >
                {item.title}
              </Text>
              <Text fontSize="8px" fontWeight='500' color="#585858" my="0" px="10" pt="5" >
                {item.company}
              </Text>
              <MyAvatar src={profile} />
                {/* <Avatar src={profile} width="40px" height="40px" borderRadius="40" my="0" px="10" pt="5" /> */}
              
            </VStack>
            <VStack alignItems="end">
            <Menu>
              <MenuButton border="4px" as="button" >
                <ChevronDownIcon/>
              </MenuButton>
              <MenuList borderBottomColor="#efefef" bg="#efefef">
                <MenuItem onClick={()=>{setItmToggle(true)}}>Edit</MenuItem>
                <MenuItem onClick={()=>{onRemove()}}>Remove</MenuItem>
              </MenuList>
            </Menu>
              <Text fontSize='12px' color="#585858">
              S{item.id}
              </Text>
              <Spacer />

              <Badge 
                bg={priority[item.priority]?.bg ? priority[item.priority].bg : "#fff"} 
                px={10} 
                py={3} 
                borderRadius="20" 
                color={priority[item.priority]?.color ? priority[item.priority].color : "#fff"} 
                fontSize="12px" 
                fontWeight="500" 
                mb="10"
              >
                {item.priority}
              </Badge>
            </VStack>
          </Flex>
          {itmToggle ? (
              <VStack
                style={{
                  alignItems:"start",
                  width:"90%",
                }}
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
                value={itmInput}
                onChange={(e)=>{setItmInput(e.target.value)}}
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
                  onClick={()=>{onEdit()} }
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
                    setItmToggle(false); 
                    setItmInput('')
                  }} 
                />
              </HStack>
            </VStack>
            ):(
              null
            )}
          </VStack>
        )
      }}
    </Draggable>
  );
}

  
export default React.memo(DraggableCard);