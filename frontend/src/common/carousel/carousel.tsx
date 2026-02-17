import type { JSX } from "@emotion/react/jsx-runtime";
import type React from "react";
import Carousel from "react-bootstrap/Carousel";

type DashImage = {
  path: string;
  name: string;
};

interface Props {
  interval: number;
  images: DashImage[];
  autoPlay: boolean;
  wrap: boolean;
  showArrows: boolean;
  swipeable: boolean;

  activeIndex?: number;
  onIndexChange?: (index: number) => void;
}

const DashCarousel = (props: Props): JSX.Element => {
  const {
    interval,
    images,
    autoPlay,
    wrap,
    showArrows,
    swipeable,
    activeIndex,
    onIndexChange,
  } = props;


  const isControlled = typeof activeIndex === "number";

  const handleSelect = (selectedIndex: number) => {
    onIndexChange?.(selectedIndex);
  };

  // ✅ Set the "frame" height here (container), NOT on image
  const bannerHeight =  '100%'

  // ✅ Image fills container without stretching
  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectPosition: "center",
    display: "block",
  };

  return (
    <Carousel
      className="dashCarousel"
      interval={autoPlay ? interval : null}
      wrap={wrap}
      slide={swipeable}
      indicators={showArrows}
      controls={showArrows}
      pause={false}
      touch={swipeable}
      {...(isControlled
        ? { activeIndex, onSelect: handleSelect }
        : onIndexChange
          ? { onSelect: handleSelect }
          : {})}
    >
      {images.map((img, i) => (
        <Carousel.Item
          key={i}
          interval={autoPlay ? interval : undefined}
          className="dashCarouselItem"
          style={{ height: bannerHeight }}
        >
          <img loading="eager" className="dashCarouselImg" style={imageStyle} src={img.path} alt={img.name} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export { DashCarousel };
