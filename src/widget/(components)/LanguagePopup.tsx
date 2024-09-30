import { AnimatePresence, motion } from "framer-motion";
import { BiSolidUpArrow } from "react-icons/bi";
import { LANGUAGES } from "../utils/constants/lang";
import styled from "styled-components";

export default function LanguagePopup({ open }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <Popup
          initial={{ scale: 0, y: 10, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: 10,
            scale: 0,
          }}
          style={{ transformOrigin: "top right" }}
        >
          <div className="arrow_up">
            <BiSolidUpArrow />
          </div>

          <div className="language_container">
            <div className="language_inner_wrapper">
              {LANGUAGES.map((i) => {
                return (
                  <div className="language_item" key={i.code}>
                    {i.name}
                  </div>
                );
              })}
            </div>
          </div>
        </Popup>
      )}
    </AnimatePresence>
  );
}

const Popup = styled(motion.div)`
  /* ygpt-absolute ygpt-top-[104%] ygpt-w-[200px] ygpt-z-[4] ygpt-right-0 ygpt-flex ygpt-flex-col */
  position: absolute;
  top: 104%;
  width: 200px;
  z-index: 4;
  right: 0;
  display: flex;
  flex-direction: column;

  .arrow_up {
    /* ygpt-text-white ygpt-mb-[-4px] ygpt-self-end ygpt-scale-x-[1.4] */
    color: white;
    margin-bottom: -4px;
    align-self: flex-end;
    transform: scaleX(1.4);
  }

  .language_container {
    /* ygpt-max-h-[400px] ygpt-overflow-auto ygpt-rounded-lg ygpt-bg-white ygpt-shadow-md ygpt-text-gray-800 */
    max-height: 400px;
    overflow: auto;
    border-radius: 8px;
    background-color: white;
    color: rgb(31 41 55);

    .language_inner_wrapper {
      /* ygpt-flex ygpt-flex-col ygpt-items-start ygpt-divide-y-1 ygpt-divide-gray-200 */
      display: flex;
      flex-direction: column;
      align-items: start;
      border-top: 1px solid rgb(229 231 235);

      .language_item {
        /* ygpt-bg-white ygpt-text-sm hover:ygpt-bg-gray-100 ygpt-py-2 ygpt-px-2 ygpt-self-stretch ygpt-text-left */
        background-color: white;
        font-size: 14px;
        padding: 8px;
        align-self: flex-start;
        text-align: left;
        background-color: rgb(243 244 246);
      }
    }
  }
`;
