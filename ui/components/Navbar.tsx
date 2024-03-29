import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Image from "next/image";
import StepLogo from "../public/stepLogo.png";
import { useEffect } from "react";

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Matches",
    href: "/matches",
  },
  {
    label: "Stats",
    href: "/stats",
  },
  {
    label: "Player Info",
    href: "/playerInfo",
  },
  {
    label: "Images",
    href: "/images",
  },
];

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    if (isOpen) {
      onToggle();
    }
  }, [currentPath]);

  return (
    <Box>
      <Flex
        bg={"brand.900"}
        color={"white"}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "end", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            <Link href="/" passHref>
              <Image alt={"logo"} src={StepLogo} width={75} height={50} />
            </Link>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav currentPath={currentPath} />
          </Flex>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav currentPath={currentPath} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ currentPath }) => {
  const linkColor = "gray.400";
  const linkHoverColor = "white";
  const popoverContentBgColor = "brand.900";

  return (
    <Stack direction={"row"} spacing={4} alignItems="center">
      {NAV_ITEMS.map((navItem) => {
        const isCurrentRoute = currentPath === navItem.href;
        return (
          <Box key={navItem.label}>
            <Popover trigger={"hover"} placement={"bottom-start"}>
              <PopoverTrigger>
                <Link href={navItem.href ?? "#"} passHref>
                  <ChakraLink
                    p={2}
                    fontSize={"sm"}
                    fontWeight={isCurrentRoute ? "bolder" : 500}
                    color={isCurrentRoute ? "white" : linkColor}
                    _hover={{
                      textDecoration: "none",
                      color: isCurrentRoute ? "white" : linkHoverColor,
                    }}
                  >
                    {navItem.label}
                  </ChakraLink>
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={"xl"}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={"xl"}
                  minW={"sm"}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        );
      })}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link href={href} passHref>
      <ChakraLink
        role={"group"}
        display={"block"}
        p={2}
        rounded={"md"}
        _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
      >
        <Stack direction={"row"} align={"center"}>
          <Box>
            <Text
              transition={"all .3s ease"}
              _groupHover={{ color: "pink.400" }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize={"sm"}>{subLabel}</Text>
          </Box>
          <Flex
            transition={"all .3s ease"}
            transform={"translateX(-10px)"}
            opacity={0}
            _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
            justify={"flex-end"}
            align={"center"}
            flex={1}
          >
            <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </ChakraLink>
    </Link>
  );
};

const MobileNav = ({ currentPath }) => {
  return (
    <Stack bg={"brand.900"} p={4} display={{ md: "none" }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          navItem={navItem}
          isCurrentRoute={currentPath === navItem.href}
        />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ navItem, isCurrentRoute }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={navItem.children && onToggle}>
      <Link href={navItem.href ?? "#"} passHref>
        <Flex
          py={2}
          as={ChakraLink}
          justify={"space-between"}
          align={"center"}
          _hover={{
            textDecoration: "none",
          }}
        >
          <Text fontWeight={600} color={isCurrentRoute ? "white" : "gray.400"}>
            {navItem.label}
          </Text>
          {navItem.children && (
            <Icon
              as={ChevronDownIcon}
              transition={"all .25s ease-in-out"}
              transform={isOpen ? "rotate(180deg)" : ""}
              w={6}
              h={6}
            />
          )}
        </Flex>
      </Link>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {navItem.children &&
            navItem.children.map((child) => (
              <Link key={child.label} href={child.href} passHref>
                <ChakraLink py={2}>{child.label}</ChakraLink>
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}
