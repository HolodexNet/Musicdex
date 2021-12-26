import {
  FlexProps,
  Flex,
  Icon,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactText } from "react";
import { IconType } from "react-icons";
import { NavLink, useLocation } from "react-router-dom";

interface NavItemProps extends FlexProps {
  icon: IconType;
  path?: string;
  children: ReactText;
}

export function NavItem({ icon, children, path, ...rest }: NavItemProps) {
  const bgc = useColorModeValue("n2.600", "n2.400");
  const bgcBrand = useColorModeValue("brand.200", "brand.700");

  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <Link to={path || "#"} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={pathname === path ? bgc : "auto"}
        _hover={{
          bg: bgcBrand,
          // color: "white",
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
    </Link>
  );
}
