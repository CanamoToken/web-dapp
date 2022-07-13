import {
  Button,
  Flex,
  Image,
  Link,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import SidebarHelpImage from "assets/img/SidebarHelpImage.png";
import React from "react";
import Swal from 'sweetalert2'


export function SidebarHelp(props) {
  // Pass the computed styles into the `__css` prop
  const { children, sidebarVariant, ...rest } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const { colorMode } = useColorMode();
  return (
    <Stack
      justify='center'
      direction='column'
      align='center'
      spacing='10px'
      mb="22px"
      mt="auto"
      mx='20px'>
      <Image src={SidebarHelpImage} w='250px' h="auto" />
      <Flex direction='column' textAlign='center'>
        <Text fontSize='14px' color={textColor} fontWeight='bold'>
          Canamo Wallet
        </Text>
        <Text fontSize='12px' color='gray.500'>
          Please check our app.
        </Text>
      </Flex>
      <Link href='https://play.google.com/' target={"_blank"} minW='100%'>
        <Button variant='primary' minW='100%'>
          Download Android
        </Button>
      </Link>
      <Link onClick={() => {
        Swal.fire({
          text: 'Stay tune, currently only supports iOS',
          title: 'Coming soon!',
          icon: 'success'
        })
      }}
        minW='100%'>

        <Button
          variant={colorMode === "light" ? 'dark' : "navy"}
          minW='100%'
          mb={window.innerWidth <= 1024 && "12px"}>
          Download iOS
        </Button>

      </Link>
    </Stack>
  );
}
