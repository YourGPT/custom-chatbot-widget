import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import styled from "styled-components";

export default function LearnMoreLinks({ links = [] }: { links: any[] }) {
  const [show, setShow] = useState(false);

  return (
    <Root className={`${show ? "show" : ""}`}>
      <div className="learn-more" onClick={() => setShow(!show)}>
        <IoIosArrowForward className="arrow" />
        <div style={{ fontSize: "12px" }}>Learn More</div>
      </div>
      <div className="learn-more-links">
        <ul>
          {links.map((i: any) => {
            return (
              <li key={i}>
                <a href={i} target="_blank" rel="noreferrer" className="learnMoreLink">
                  {/*eslint-disable-next-line */}
                  {i}
                  {/* {!i.url.replace(/^.*\/\/[^\/]+/, "") ? "/" : i.url.replace(/^.*\/\/[^\/]+/, "").slice(0, 25)} */}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Root>
  );
}

const Root = styled.div`
  &.show .learn-more {
    .arrow {
      transform: rotate(90deg);
      transition: all 0.3s;
    }
  }
  &.show .learn-more-links ul {
    display: flex;
  }
  .learn-more {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    width: fit-content;
    user-select: none;
    font-weight: 600;
    .title {
      font-size: 13px;
      opacity: 80%;
    }
    .arrow {
      transform: rotate(0deg);
      transition: all 0.3s;
      font-size: 14px;
    }
  }
  .learn-more-links {
    overflow: hidden;
    ul {
      list-style: none;
      display: none;
      flex-direction: column;
      gap: 5px;
      margin-top: 5px;
      /* padding-inline-start: 20px; */
      li {
        opacity: 0.5;
        /* border: 1px solid rgba(102, 112, 133, 0.3); */
        width: fit-content;

        text-decoration: underline;
        min-width: 150px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;

        transition: all 0.3s;

        .learnMoreLink {
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s;
          color: blue;
          width: 100%;
          /* max-width: 130px;
          white-space: nowrap;
          overflow: hidden; */
          /* text-overflow: ellipsis; */
        }
        &:hover .learnMoreLink {
          /* padding-left: 5px; */
          transition: all 0.3s;
        }

        &:hover {
          opacity: 0.9;

          transition: all 0.3s;
          /* border: 1px solid rgba(102, 112, 133, 0.8);
          background-color: rgba(255, 255, 255, 0.3); */
        }
      }
    }
  }
`;
