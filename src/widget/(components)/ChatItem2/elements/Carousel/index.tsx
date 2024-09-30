import styled from "styled-components";
import useEmblaCarousel from "embla-carousel-react";
import Card from "../Card";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

// export const PRODUCTS = [
//   {
//     id: 1,
//     title: "Iphone 12",
//     desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit",
//     imageUrl: "https://pbs.twimg.com/media/F_cm-hZW8AAPujI?format=jpg&name=4096x4096",
//     buttons: [
//       {
//         id: 1,
//         label: "Buy Now",
//         url: "https://www.apple.com/in/iphone-12/",
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "Samsung Galaxy S21",
//     desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.",
//     imageUrl: "https://pbs.twimg.com/media/GAGxuGma0AENkFR?format=jpg&name=4096x4096",

//     buttons: [
//       {
//         id: 2,
//         label: "Buy Now",
//         url: "https://www.samsung.com/in/smartphones/galaxy-s21-5g/buy/",
//       },
//     ],
//   },
// ];

export default function Carousel({ actionType, cards, onAction }: { actionType: any; cards: any[]; onAction: (str: string) => any }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("reInit", onSelect);
      emblaApi.on("select", onSelect);
    }
  }, [emblaApi, onSelect]);

  // const onSelect = useCallback((emblaApi: UseEmblaCarouselType) => {
  //   setPrevBtnDisabled(!emblaApi.canScrollPrev())
  //   setNextBtnDisabled(!emblaApi.canScrollNext())
  // }, [])

  // useEffect(() => {
  //   if (!emblaApi) return

  //   emblaApi.on('reInit', onSelect)
  //   emblaApi.on('select', onSelect)
  // }, [emblaApi, onSelect])

  return (
    <Root>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {cards.map((i, ind) => {
            return (
              <div className="embla__slide" key={ind}>
                <Card buttons={i.button ? [i.button] : []} imageUrl={i.imageUrl} title={i.title} desc={i.description} onAction={onAction} actionType={actionType} />
              </div>
            );
          })}
        </div>

        <div className="embla__buttons">
          <button onClick={scrollPrev} disabled={prevBtnDisabled}>
            <ChevronLeftIcon height={20} />
          </button>
          <button onClick={scrollNext} disabled={nextBtnDisabled}>
            <ChevronRightIcon height={20} />
          </button>
        </div>
      </div>
    </Root>
  );
}

const Root = styled.div`
  width: 100%;

  .embla {
    width: 100%;
    --slide-spacing: 1rem;
    --slide-size: 280px;
    padding: 0rem 1.6rem 0rem 1rem;
    position: relative;

    overflow: hidden;
    .embla__container {
      display: flex;
      touch-action: pan-y;
      margin-left: calc(var(--slide-spacing) * -1);
    }
    .embla__slide {
      flex: 0 0 var(--slide-size);
      min-width: 0;
      padding-left: var(--slide-spacing);
      position: relative;
    }
  }

  .embla__buttons {
    all: unset;
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    left: 0;
    z-index: 12;
    padding: 0px 4px;
    button {
      border: none;
      background: hsl(var(--yourgptChatbotSurfaceColorHsl));
      color: hsl(var(--yourgptChatbotTextColorHsl) / 0.8);
      border-radius: 120px;
      padding: 0.4rem;
      box-shadow: 1px 2px 8px hsla(var(--yourgptChatbotTextColorHsl) / 0.08);
      margin-right: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;

      &:disabled {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
`;
