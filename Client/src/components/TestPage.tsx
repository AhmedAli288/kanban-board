import {
  Box,
  Flex,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import SidebarContent from './sidebar/SidebarContent';
import MobileNav from './header/MobNav';
import { useEffect, useState } from 'react';
import Dnds from './dragNdrop/Dnds';

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


export default function TestPage() {
  const [items, setItems] = useState<Array<items>>([{company: "", id: 0, priority: "", status: "", title: "", _id:""}])
  const [columnOrder, setColumnOrder] = useState<Array<string>>([""])
  const [columns, setColumns] = useState<columns>({0: { id:0, name:"", statuses:[""], items:items } })

  const {onClose } = useDisclosure();
  
  useEffect(()=>{
    axios
    .get('http://localhost:4000/getlists')
    // .get('https://faas-tor1-70ca848e.doserverless.co/api/v1/web/fn-02deb0f8-29e6-4cbc-a43c-f79bb77f116c/default/dummy-data')
    .then((res)=>{
      
      const obj = res.data.reduce((p:any,c:any)=>({...p, [c.id]:{...c}}),{})

      const keys:Array<string> = Object.keys(obj)
  
      setColumnOrder(keys)
  
      setColumns(obj)

    })
    .catch((err)=>{
      console.log("error", err);
    })  

    axios
    .get("http://localhost:4000/gettasks")
    .then((res)=>{
      setItems(res.data)
      // console.log("items", res.data);
    })
    .catch((err)=>{
      console.log("error", err);
    }) 
  },[])


  return (
    <Box 
      bg={useColorModeValue('gray.100', 'gray.900')}
    >
      <Flex display="flex">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />        
      <Box>
        <MobileNav />
        <Dnds 
          items = {items} 
          setItems = {setItems} 
          columnOrder = {columnOrder} 
          setColumnOrder = {setColumnOrder} 
          columns = {columns} 
          setColumns = {setColumns} 
        />
      </Box>
    </Flex>
    </Box>
  );
}

