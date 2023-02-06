import React from 'react'
import {
    Avatar
} from '@chakra-ui/react';
import profile from "../../assets/images/segun_adebayo.jpg"


  
const MyAvatar: React.FC<any> = ({ src }) => {
    return (
        <Avatar src={profile} width="40px" height="40px" borderRadius="40" my="0" px="10" pt="5" />
    );
}
  
  export default React.memo(MyAvatar);