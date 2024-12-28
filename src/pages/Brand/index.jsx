import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Brand.module.scss";
import Trademark from "../../components/Trademark";

const cx = classNames.bind(styles);

const Brand = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const halfPageHeight = document.documentElement.scrollHeight / 10;

      if (scrolled > halfPageHeight) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className={cx("brand")} id="A-section">
      <Trademark />
      <div className={cx("all-brand")}>
        <div className={cx("title")}>Tất cả thương hiệu</div>
        <div className={cx("letter-brand")}>
          <a href="#A-section">A</a>
          <a href="#B-section">B</a>
          <a href="#C-section">C</a>
          <a href="#D-section">D</a>
          <a href="#E-section">E</a>
          <a href="#F-section">F</a>
          <a href="#G-section">G</a>
          <a href="#H-section">H</a>
          <a href="#I-section">I</a>
          <a href="#J-section">J</a>
          <a href="#K-section">K</a>
          <a href="#L-section">L</a>
          <a href="#M-section">M</a>
          <a href="#N-section">N</a>
          <a href="#O-section">O</a>
          <a href="#P-sectPon">I</a>
          <a href="#Q-section">Q</a>
          <a href="#R-section">R</a>
          <a href="#S-section">S</a>
          <a href="#T-section">T</a>
          <a href="#U-sectioU">U</a>
          <a href="#V-sectPon">V</a>
          <a href="#W-section">W</a>
          <a href="#X-section">X</a>
          <a href="#Y-section">Y</a>
          <a href="#Z-section">Z</a>
          <a href="#ZZ-sectioU">#</a>
        </div>
        <div className={cx("letterAll-brand")}>
          <div className={cx("ant-row")} id="B-section">
            <div className={cx("ant-col-md-4")}>
              <div className={cx("section-title")}>A</div>
            </div>
            <div className={cx("ant-col-md-20")}>
              <div className={cx("ant-row-brand")}>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/a-pieu">
                    <span class="size-16 link">A'PIEU</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/acnes">
                    <span class="size-16 link">ACNES</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/addict">
                    <span class="size-16 link">A'DDICT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aestura">
                    <span class="size-16 link">AESTURA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/ahc">
                    <span class="size-16 link">AHC</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/altruist">
                    <span class="size-16 link">ALTRUIST</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/amuse">
                    <span class="size-16 link">AMUSE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/anessa">
                    <span class="size-16 link">ANESSA</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aromatica">
                    <span class="size-16 link">AROMATICA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/artdeco">
                    <span class="size-16 link">ARTDECO</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/astalift">
                    <span class="size-16 link">ASTALIFT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/avene">
                    <span class="size-16 link">Avène</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/axe">
                    <span class="size-16 link">AXE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/azzaro">
                    <span class="size-16 link">AZZARO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("ant-row")}>
            <div className={cx("ant-col-md-4")}>
              <div className={cx("section-title")}>A</div>
            </div>
            <div className={cx("ant-col-md-20")}>
              <div className={cx("ant-row-brand")}>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/a-pieu">
                    <span class="size-16 link">A'PIEU</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/acnes">
                    <span class="size-16 link">ACNES</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/addict">
                    <span class="size-16 link">A'DDICT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aestura">
                    <span class="size-16 link">AESTURA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/ahc">
                    <span class="size-16 link">AHC</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/altruist">
                    <span class="size-16 link">ALTRUIST</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/amuse">
                    <span class="size-16 link">AMUSE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/anessa">
                    <span class="size-16 link">ANESSA</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aromatica">
                    <span class="size-16 link">AROMATICA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/artdeco">
                    <span class="size-16 link">ARTDECO</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/astalift">
                    <span class="size-16 link">ASTALIFT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/avene">
                    <span class="size-16 link">Avène</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/axe">
                    <span class="size-16 link">AXE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/azzaro">
                    <span class="size-16 link">AZZARO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("ant-row")} id="B-section">
            <div className={cx("ant-col-md-4")}>
              <div className={cx("section-title")}>A</div>
            </div>
            <div className={cx("ant-col-md-20")}>
              <div className={cx("ant-row-brand")}>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/a-pieu">
                    <span class="size-16 link">A'PIEU</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/acnes">
                    <span class="size-16 link">ACNES</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/addict">
                    <span class="size-16 link">A'DDICT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aestura">
                    <span class="size-16 link">AESTURA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/ahc">
                    <span class="size-16 link">AHC</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/altruist">
                    <span class="size-16 link">ALTRUIST</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/amuse">
                    <span class="size-16 link">AMUSE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/anessa">
                    <span class="size-16 link">ANESSA</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aromatica">
                    <span class="size-16 link">AROMATICA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/artdeco">
                    <span class="size-16 link">ARTDECO</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/astalift">
                    <span class="size-16 link">ASTALIFT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/avene">
                    <span class="size-16 link">Avène</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/axe">
                    <span class="size-16 link">AXE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/azzaro">
                    <span class="size-16 link">AZZARO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("ant-row")}>
            <div className={cx("ant-col-md-4")}>
              <div className={cx("section-title")}>A</div>
            </div>
            <div className={cx("ant-col-md-20")}>
              <div className={cx("ant-row-brand")}>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/a-pieu">
                    <span class="size-16 link">A'PIEU</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/acnes">
                    <span class="size-16 link">ACNES</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/addict">
                    <span class="size-16 link">A'DDICT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aestura">
                    <span class="size-16 link">AESTURA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/ahc">
                    <span class="size-16 link">AHC</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/altruist">
                    <span class="size-16 link">ALTRUIST</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/amuse">
                    <span class="size-16 link">AMUSE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/anessa">
                    <span class="size-16 link">ANESSA</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aromatica">
                    <span class="size-16 link">AROMATICA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/artdeco">
                    <span class="size-16 link">ARTDECO</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/astalift">
                    <span class="size-16 link">ASTALIFT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/avene">
                    <span class="size-16 link">Avène</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/axe">
                    <span class="size-16 link">AXE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/azzaro">
                    <span class="size-16 link">AZZARO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("ant-row")} id="B-section">
            <div className={cx("ant-col-md-4")}>
              <div className={cx("section-title")}>A</div>
            </div>
            <div className={cx("ant-col-md-20")}>
              <div className={cx("ant-row-brand")}>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/a-pieu">
                    <span class="size-16 link">A'PIEU</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/acnes">
                    <span class="size-16 link">ACNES</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/addict">
                    <span class="size-16 link">A'DDICT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aestura">
                    <span class="size-16 link">AESTURA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/ahc">
                    <span class="size-16 link">AHC</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/altruist">
                    <span class="size-16 link">ALTRUIST</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/amuse">
                    <span class="size-16 link">AMUSE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/anessa">
                    <span class="size-16 link">ANESSA</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aromatica">
                    <span class="size-16 link">AROMATICA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/artdeco">
                    <span class="size-16 link">ARTDECO</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/astalift">
                    <span class="size-16 link">ASTALIFT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/avene">
                    <span class="size-16 link">Avène</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/axe">
                    <span class="size-16 link">AXE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/azzaro">
                    <span class="size-16 link">AZZARO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("ant-row")}>
            <div className={cx("ant-col-md-4")}>
              <div className={cx("section-title")}>A</div>
            </div>
            <div className={cx("ant-col-md-20")}>
              <div className={cx("ant-row-brand")}>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/a-pieu">
                    <span class="size-16 link">A'PIEU</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/acnes">
                    <span class="size-16 link">ACNES</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/addict">
                    <span class="size-16 link">A'DDICT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aestura">
                    <span class="size-16 link">AESTURA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/ahc">
                    <span class="size-16 link">AHC</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/altruist">
                    <span class="size-16 link">ALTRUIST</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/amuse">
                    <span class="size-16 link">AMUSE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/anessa">
                    <span class="size-16 link">ANESSA</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aromatica">
                    <span class="size-16 link">AROMATICA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/artdeco">
                    <span class="size-16 link">ARTDECO</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/astalift">
                    <span class="size-16 link">ASTALIFT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/avene">
                    <span class="size-16 link">Avène</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/axe">
                    <span class="size-16 link">AXE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/azzaro">
                    <span class="size-16 link">AZZARO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("ant-row")} id="B-section">
            <div className={cx("ant-col-md-4")}>
              <div className={cx("section-title")}>A</div>
            </div>
            <div className={cx("ant-col-md-20")}>
              <div className={cx("ant-row-brand")}>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/a-pieu">
                    <span class="size-16 link">A'PIEU</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/acnes">
                    <span class="size-16 link">ACNES</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/addict">
                    <span class="size-16 link">A'DDICT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aestura">
                    <span class="size-16 link">AESTURA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/ahc">
                    <span class="size-16 link">AHC</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/altruist">
                    <span class="size-16 link">ALTRUIST</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/amuse">
                    <span class="size-16 link">AMUSE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/anessa">
                    <span class="size-16 link">ANESSA</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aromatica">
                    <span class="size-16 link">AROMATICA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/artdeco">
                    <span class="size-16 link">ARTDECO</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/astalift">
                    <span class="size-16 link">ASTALIFT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/avene">
                    <span class="size-16 link">Avène</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/axe">
                    <span class="size-16 link">AXE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/azzaro">
                    <span class="size-16 link">AZZARO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("ant-row")}>
            <div className={cx("ant-col-md-4")}>
              <div className={cx("section-title")}>A</div>
            </div>
            <div className={cx("ant-col-md-20")}>
              <div className={cx("ant-row-brand")}>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/a-pieu">
                    <span class="size-16 link">A'PIEU</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/acnes">
                    <span class="size-16 link">ACNES</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/addict">
                    <span class="size-16 link">A'DDICT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aestura">
                    <span class="size-16 link">AESTURA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/ahc">
                    <span class="size-16 link">AHC</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/altruist">
                    <span class="size-16 link">ALTRUIST</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/amuse">
                    <span class="size-16 link">AMUSE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/anessa">
                    <span class="size-16 link">ANESSA</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/aromatica">
                    <span class="size-16 link">AROMATICA </span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/artdeco">
                    <span class="size-16 link">ARTDECO</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/astalift">
                    <span class="size-16 link">ASTALIFT</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/avene">
                    <span class="size-16 link">Avène</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/axe">
                    <span class="size-16 link">AXE</span>
                  </a>
                </div>
                <div className={cx("list-brand")}>
                  <a role="presentation" href="/collections/azzaro">
                    <span class="size-16 link">AZZARO</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button className={cx("scroll-to-top")} onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default Brand;
