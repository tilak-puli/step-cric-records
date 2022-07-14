import { Box, Wrap } from "@chakra-ui/react";
import IMAGES from "../../data/images/images";
import Image from "next/image";

export function ImagesList(props: { images: any }) {
  return (
    <Wrap w={"99%"} spacing={10}>
      {props.images.map((img, i) => (
        <Box>
          <Image src={img.value} key={i} />
        </Box>
      ))}
    </Wrap>
  );
}

const Images = () => {
  return (
    <Box p={["1em", "2em"]}>
      <ImagesList images={IMAGES} />
    </Box>
  );
};

export default Images;
