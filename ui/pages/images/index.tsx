import { Box, Heading, Wrap } from "@chakra-ui/react";
import IMAGES from "../../data/images";
import Image from "next/image";
import ReactPlayer from "react-player/lazy";

function ImageBox(props: { img: any }) {
  if (props.img.type === "video") {
    return (
      <ReactPlayer
        url={props.img.value}
        controls
        light={"/images/thumbnail1.png"}
        width={600}
        height={400}
      />
    );
  }

  return (
    <Image
      src={props.img.value}
      alt={props.img.name}
      width={600}
      height={400}
    />
  );
}

export function ImagesList(props: { images: any }) {
  return (
    <Wrap w={"99%"} spacing={10}>
      {props.images.map((img, i) => (
        <Box key={i}>
          <Heading fontSize={"md"} mb={2}>
            {img.name}
          </Heading>
          <ImageBox img={img} />
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
