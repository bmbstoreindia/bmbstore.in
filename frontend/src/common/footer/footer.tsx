import type { JSX } from "@emotion/react/jsx-runtime";
import { useState } from "react";
import "./footer.css";

import logo from "../../assets/bmbLogo.svg";
import insta from "../../assets/instagram.svg";
import fb from "../../assets/facebook.svg";
import whatsapp from "../../assets/icons8-whatsapp-logo.svg";
import mail from "../../assets/mail.svg";
import locationIcon from "../../assets/location.svg";
import Marquee from "../marquee/marquee";
import star from "../../assets/Star 4.svg";
import youtube from "../../assets/icons8-youtube.svg";
import threads from "../../assets/icons8-threads.svg";

import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app.context";
import { apiService } from "../../sevice/api.service";

interface Props {
  isMobile: boolean;
}

const Footer = (props: Props): JSX.Element => {
  const { isMobile } = props;
  const navigate = useNavigate();
  const { userID, productData } = useAppContext();

  // ✅ instantiate api service
  const { addLead } = apiService();

  // ✅ local state for inputs
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // ✅ separate loading states
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);

  // ✅ same API, but send ONLY the clicked-field + sessionId
  const submitLead = async (payload: { email?: string; phoneNumber?: string }) => {
    const sessionId = userID;
    if (!sessionId) return;

    await addLead({
      sessionId,
      ...(payload.email ? { email: payload.email } : {}),
      ...(payload.phoneNumber ? { phoneNumber: payload.phoneNumber } : {}),
    });
  };

  const handleJoinEmailCommunity = async () => {
    if (!email) return;
    try {
      setLoadingEmail(true);
      await submitLead({ email });
      setEmail(""); // ✅ clear only email
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleJoinWhatsappCommunity = async () => {
    if (!phoneNumber) return;
    try {
      setLoadingPhone(true);
      await submitLead({ phoneNumber });
      setPhoneNumber(""); // ✅ clear only phone
    } finally {
      setLoadingPhone(false);
    }
  };

  const handleClick = (
    path: "Refund" | "product" | "Shipping" | "tnc" | "privacy",
    productPage?: { name: string; id: string }
  ) => {
    console.log(productPage);

    if (path === "tnc") {
      return navigate(`/${path}`, { state: { tnc: true } });
    }
    if (path === "privacy") {
      return navigate(`/${path}`, { state: { privacy: true } });
    }
    if (path === "product") {
      return navigate(`/${path}/${encodeURIComponent(productPage?.id!)}`, {
        state: { productDetals: { id: productPage?.id } },
      });
    }
    if (path === "Shipping") {
      return navigate(`/${path}`, { state: { shipping: true } });
    }
    if (path === "Refund") {
      return navigate(`/${path}`, { state: { refund: true } });
    }
    navigate(`/${path}`);
  };

  const marqueeText = [
    { id: 1, text: "We’re here to fix India’s protein gap with clean, plant-based, honest nutrition" },
    { id: 2, imageUrl: star },
    { id: 3, text: "We’re here to fix India’s protein gap with clean, plant-based, honest nutrition" },
    { id: 4, imageUrl: star },
    { id: 1, text: "We’re here to fix India’s protein gap with clean, plant-based, honest nutrition" },
    { id: 2, imageUrl: star },
    { id: 3, text: "We’re here to fix India’s protein gap with clean, plant-based, honest nutrition" },
    { id: 4, imageUrl: star },
    { id: 1, text: "We’re here to fix India’s protein gap with clean, plant-based, honest nutrition" },
    { id: 2, imageUrl: star },
    { id: 3, text: "We’re here to fix India’s protein gap with clean, plant-based, honest nutrition" },
    { id: 4, imageUrl: star },
  ];

  const contacts = [
    {
      name: "phone",
      path: whatsapp,
      data: "+91 6284048739",
      link: "https://api.whatsapp.com/send?phone=916284048739",
    },
    {
      name: "mail",
      path: mail,
      data: "info@bmbstore.in",
      link: "mailto:info@bmbstore.in",
    },
    {
      name: "location",
      path: locationIcon,
      data: "India",
      link: "https://www.google.com/maps/search/?api=1&query=India",
    },
  ];

  // ✅ take first 4 products for ids (labels remain hardcoded below)
  const footerProducts = Array.isArray(productData) ? productData.slice(0, 4) : [];

  return (
    <section className="footer">
      <Marquee
        direction="left"
        duration={35}
        items={marqueeText}
        stop={false}
        options={{ backgroundColor: "#E0181E", height: "50px" }}
        useMargin={false}
      />

      <div className="contentContainer">
        <div className="leftContainer">
          <img
            src={logo}
            style={{ height: isMobile ? "60px" : "150px" }}
            alt="logo"
          />

          <span>
            Build My Body is a Modern Food & Nutrition Brand creating High-Protein products that fit seamlessly into everyday Indian eating, so people can meet their daily protein needs without changing their lifestyle.
          </span>

          <div className="socailIcons">
            <a
              href="https://www.facebook.com/bmbstore.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={fb} alt="facebook" />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
              <img src={youtube} alt="youtube" />
            </a>
            <a
              href="https://www.instagram.com/bmbstore.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={insta} alt="instagram" />
            </a>
            <a
              href="https://www.threads.com/@bmbstore.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={threads} alt="threads" />
            </a>
          </div>
        </div>

        <div className="rightContainer">
          {/* ✅ LEAD FORM */}
          <div className="searchBoxContainer">
            <span>Join our community</span>

            <div className="countInBtn">
              <div className="inputsRow">
                {/* ✅ EMAIL BLOCK */}
                <div className="inputWithBtn">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    onClick={handleJoinEmailCommunity}
                    disabled={loadingEmail || !email}
                  >
                    {loadingEmail ? "Please wait..." : "Join Email Community"}
                  </button>
                </div>

                {/* ✅ WHATSAPP BLOCK */}
                <div className="inputWithBtn">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <button
                    onClick={handleJoinWhatsappCommunity}
                    disabled={loadingPhone || !phoneNumber}
                  >
                    {loadingPhone ? "Please wait..." : "Join WhatsApp Community"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="links">
            <div className="shop">
              <span>SHOP</span>

              <span
                style={{ cursor: footerProducts[0]?.id ? "pointer" : "default", opacity: footerProducts[0]?.id ? 1 : 0.6 }}
                onClick={() => {
                  if (!footerProducts[0]?.id) return;
                  handleClick("product", {
                    name: footerProducts[0]?.header,
                    id: footerProducts[0].id,
                  });
                }}
              >
                Family Pack
              </span>

              <span
                style={{ cursor: footerProducts[1]?.id ? "pointer" : "default", opacity: footerProducts[1]?.id ? 1 : 0.6 }}
                onClick={() => {
                  if (!footerProducts[1]?.id) return;
                  handleClick("product", {
                    name: footerProducts[1]?.header,
                    id: footerProducts[1].id,
                  });
                }}
              >
                Original
              </span>

              <span
                style={{ cursor: footerProducts[2]?.id ? "pointer" : "default", opacity: footerProducts[2]?.id ? 1 : 0.6 }}
                onClick={() => {
                  if (!footerProducts[2]?.id) return;
                  handleClick("product", {
                    name: footerProducts[2]?.header,
                    id: footerProducts[2].id,
                  });
                }}
              >
                Chocolate
              </span>

              <span
                style={{ cursor: footerProducts[3]?.id ? "pointer" : "default", opacity: footerProducts[3]?.id ? 1 : 0.6 }}
                onClick={() => {
                  if (!footerProducts[3]?.id) return;
                  handleClick("product", {
                    name: footerProducts[3]?.header,
                    id: footerProducts[3].id,
                  });
                }}
              >
                Pure
              </span>
            </div>

            <div className="QuickLink">
              <span>QUICK LINKS</span>
              <span onClick={() => handleClick("Shipping")}>Shipping & Delivery</span>
              <span onClick={() => handleClick("tnc")}>T&amp;C</span>
              <span onClick={() => handleClick("privacy")}>Privacy Policy</span>
              <span onClick={() => handleClick("Refund")}>Refund Policy</span>
            </div>

            <div className="contacts">
              <span>CONTACT US</span>
              {contacts.map((c) => (
                <a key={c.name} href={c.link} className="contact">
                  <img src={c.path} alt={c.name} />
                  <span>{c.data}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="redBox lowerBox">
        Copyright © 2025 & All Rights Reserved By Build My Body (BMB) Store
      </div>
    </section>
  );
};

export { Footer };
