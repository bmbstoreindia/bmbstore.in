import { useMediaQuery, useTheme } from "@mui/material";
import { useAppContext } from "../../context/app.context";

const AddedToCartPopup = () => {
  const { setShowCart } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? "12px" : "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: isMobile ? "0 12px" : "0",
      }}
    >
      <div
        style={{
          background: "#3b6a3f",
          color: "#ffffff",
          borderRadius: isMobile ? "20px" : "999px",
          padding: isMobile ? "16px" : "18px 22px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: isMobile ? "12px" : "20px",
          maxWidth: "720px",
          width: "100%",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          pointerEvents: "all",
        }}
      >
        {/* Text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: isMobile ? "15px" : "18px",
            fontWeight: 600,
            flex: 1,
            whiteSpace: isMobile ? "normal" : "nowrap",
            textAlign: isMobile ? "center" : "left",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <span style={{ fontSize: isMobile ? "20px" : "22px" }}>😍</span>
          <span>Product Added to Cart Successfully !</span>
        </div>

        {/* Button */}
        <button
          onClick={() => setShowCart(true)}
          style={{
            background: "#ffffff",
            color: "#c90000",
            border: "none",
            padding: isMobile ? "12px 16px" : "12px 26px",
            borderRadius: "999px",
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            width: isMobile ? "100%" : "auto",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          Go to Cart
        </button>
      </div>
    </div>
  );
};

export default AddedToCartPopup;
