import {
  FlexProps,
  Flex,
  Icon,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { NavLink, useLocation } from "react-router-dom";

interface NavItemProps extends FlexProps {
  icon: IconType;
  path?: string;
  // name: string;
  disabled?: boolean;

  children: ReactNode;
}

export function NavItem({
  icon,
  children,
  path,
  disabled,
  ...rest
}: NavItemProps) {
  const bgc = useColorModeValue("n2.600", "n2.400");
  const bgcBrand = useColorModeValue("brand.200", "brand.700");

  const { pathname } = useLocation();

  return (
    <Flex
      as={NavLink}
      to={path || "#"}
      style={{ textDecoration: "none" }}
      align="center"
      p="2"
      mx="2"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      color={pathname === path ? bgc : disabled ? "bg.400" : "auto"}
      _hover={{
        bg: bgcBrand,
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={
            {
              // color: "white",
            }
          }
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
}
