import { useAppContext } from "../../context/app.context";

export function Toast() {
    const { toast,
        setToast
    } = useAppContext();

    return <div
        role="status"
        aria-live="polite"
        style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            top: 65,
            width: 'min(475px, 100% - 75px)',
            zIndex: 9999,
            borderRadius: 999,
            background: "#1f4d2c", // dark green
            padding: "14px 16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            animation: "toastIn 200ms ease-out",
        }}
    >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>😍</span>
            <span
                style={{
                    color: "#dfe7df",
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: 0.2,
                }}
            >
                {toast.message}
            </span>
        </div>

        {/* Optional button like your screenshot */}
        <button
            type="button"
            onClick={() => setToast({ show: false, message: "" })}
            style={{
                border: "none",
                cursor: "pointer",
                background: "#d9d9d9",
                color: "#b20000",
                fontWeight: 800,
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 16,
            }}
        >
            Close
        </button>

        {/* inline keyframes */}
        <style>
            {`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0px); }
        }
      `}
        </style>
    </div>
}