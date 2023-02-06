import {
    Flex,
    Text,
    InputGroup,
    InputLeftAddon,
    Input,
    Avatar,
} from '@chakra-ui/react'

import {ReactComponent as SVGSearch } from '../../assets/images/search.svg'


const MobileNav = () => {
    return (
        <Flex
        bg="#E5E7EB"
        height="50"
        width="85vw"
        alignItems= "center"
        justifyContent='space-between'
        >
            <Text
                fontSize="22"
                fontWeight="500"
                ml="15"
                alignItems="center"
            >
                Board Name
            </Text>
            <Flex
            height="30"
            >
                <InputGroup>
                    <InputLeftAddon
                        px="4"
                        border="1px solid"
                        borderColor="#9CA3AF"
                        borderRightColor="transparent"
                        borderTopLeftRadius= "5"
                        borderBottomLeftRadius= "5"
                        bg= 'white'
                        pointerEvents='none'
                        fontSize='22px'
                        children={<SVGSearch />}
                    />
                    <Input 
                        borderRadius="5" 
                        width="15vw" 
                        placeholder='' 
                        bg="#fff"
                        border="1px solid"
                        borderColor="#9CA3AF"
                        borderLeftColor="transparent"
                    />
                </InputGroup>
                <Avatar
                    size={'xs'}
                    mx="4"
                    borderRadius="15"
                    src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                />
            </Flex>
        </Flex>
    );
};

export default MobileNav;