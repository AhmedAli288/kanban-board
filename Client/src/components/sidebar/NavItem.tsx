import { SVGProps, FC, ReactText } from 'react'
import {
    Flex,
    Text,
    Icon,
    Link,
    FlexProps,
} from '@chakra-ui/react'


interface NavItemProps extends FlexProps {
    icon: FC<SVGProps<SVGSVGElement>>;
    children: ReactText;
    active: Boolean;
  }

const NavItem = ({ icon, children, active, ...rest }: NavItemProps) => {
    return (
        <Link 
        style={{ textDecoration: 'none' }} 
        _focus={{ boxShadow: 'none' }} 
        width="98%"
        ml="5"
        mb="3"
        bg={ active? "#024F97" : "transparent"}
        borderRadius={ active? "10" : "0"}
        _hover={{
            bg: '#024F97',
            borderRadius:"10",
        }}
        >
            <Flex
                align="center"
                h="40"
                mx="4"
                px="4"
                borderRadius="5"
                role="group"
                cursor="pointer"
                color="white"
                
                {...rest}
            >
                {icon && (
                <Icon
                    fontSize="22"
                    _groupHover={{
                    color: 'white',
                    }}
                    as={icon}
                />
                )}
                <Text
                fontSize="20"
                fontWeight="500"
                ml="10"
                >
                {children}
                </Text>
                
            </Flex>
        </Link>
    );
};

export default NavItem;