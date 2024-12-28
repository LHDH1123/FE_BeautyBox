import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Trademark.module.scss";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import th1 from "../../assets/images/th1.webp";
import th2 from "../../assets/images/th2.webp";
import th3 from "../../assets/images/th3.webp";

const cx = classNames.bind(styles);

Trademark.propTypes = {
  data: PropTypes.object,
};

function Trademark(props) {
  const scrollableRef = useRef(null);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const [isLeftVisible, setIsLeftVisible] = useState(false);

  const scrollLeft = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: -scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        left: scrollableRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const container = scrollableRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setIsLeftVisible(container.scrollLeft > 0);
      setIsRightVisible(Math.abs(container.scrollLeft - maxScrollLeft) > 1);
    }
  };

  useEffect(() => {
    const container = scrollableRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial scroll state
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const container = scrollableRef.current;
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={cx("brand")}>
      <div className={cx("list_trademark")}>
        {isLeftVisible && (
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
        )}
        <div className={cx("content_trademark")} ref={scrollableRef}>
          <div className={cx("trademark")}>
            <img src={th1} alt="Trademark 1" />
          </div>
          <div className={cx("trademark")}>
            <img src={th2} alt="Trademark 2" />
          </div>
          <div className={cx("trademark")}>
            <img src={th3} alt="Trademark 3" />
          </div>
          <div className={cx("trademark")}>
            <img src={th1} alt="Trademark 1" />
          </div>
          <div className={cx("trademark")}>
            <img src={th2} alt="Trademark 2" />
          </div>
          <div className={cx("trademark")}>
            <img src={th3} alt="Trademark 3" />
          </div>
          <div className={cx("trademark")}>
            <img src={th1} alt="Trademark 1" />
          </div>
          <div className={cx("trademark")}>
            <img src={th2} alt="Trademark 2" />
          </div>
          <div className={cx("trademark")}>
            <img src={th3} alt="Trademark 3" />
          </div>
        </div>
        {isRightVisible && (
          <button
            className={cx("scroll-button", "right")}
            onClick={scrollRight}
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
}

export default Trademark;
