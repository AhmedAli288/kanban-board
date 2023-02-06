import { SVGProps, FC } from 'react'
import {
  Flex,
  Box,
  BoxProps,
  useColorModeValue,
  Image,
  Spacer,
    
} from '@chakra-ui/react'

import logo from "../../assets/images/menu-logo.png"
import {ReactComponent as SVGTicket } from '../../assets/images/ticket.svg'
import {ReactComponent as SVGShare } from '../../assets/images/share.svg'
import {ReactComponent as SVGDeal } from '../../assets/images/deal.svg'
import {ReactComponent as SVGChecklist } from '../../assets/images/checklist.svg'
import {ReactComponent as SVGHelp } from '../../assets/images/help.svg'
import {ReactComponent as SVGSetting } from '../../assets/images/setting.svg'
import NavItem from './NavItem';


interface LinkItemProps {
  name: string;
  icon:  FC<SVGProps<SVGSVGElement>>;
  active: Boolean;
}
const LinkItems: Array<LinkItemProps> = [
  {name:"Tickets", icon: SVGTicket, active: true},
  {name:"Projects", icon: SVGShare, active: false},
  {name:"Sales", icon: SVGDeal, active: false},
  {name:"Activities", icon: SVGChecklist, active: false},
];

const bottomItems: Array<LinkItemProps> = [
  {name:"Help", icon: SVGHelp, active: false},
  {name:"Settings", icon: SVGSetting, active: false},
];

interface SidebarProps extends BoxProps {
    onClose: () => void;
  }
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('#002F5A', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      pr="5"
      width="14.55vw"
      h="100vh"
      {...rest}
    >
        <Flex h="50" alignItems="center" mx="8" justifyContent="space-between">
          <Image height="34" mb="5" src={logo} />
        </Flex>
        <Flex direction="column" h="80%">
        {LinkItems.map((link, ind) => (
          <NavItem key={ind} icon={link.icon} active={link.active}>
            {link.name}
          </NavItem>
        ))}
        </Flex>
        <Spacer />
        <Flex direction="column">
        {bottomItems.map((link, i) => (
          <NavItem key={i} icon={link.icon} active={link.active}>
            {link.name}
          </NavItem>
        ))}
        </Flex>
    </Box>
  );
};

export default SidebarContent;