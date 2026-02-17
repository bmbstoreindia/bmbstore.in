import type { JSX } from "@emotion/react/jsx-runtime";
import { useLoginController } from "./login.controller";
import logo from "../../assets/bmbLogo.svg";
import edit from "../../assets/edit-2.svg";
import "./login.css";

export function LoginPage(): JSX.Element {
  const {
    closeLogin,
    setIsOtpStep,
    isOtpStep,
    email,
    setEmail,
    timer,
    otp,
    otpRefs,
    startOtpFlow,
    isOtpComplete,
    handleOtpPaste,
    handleOtpKeyDown,
    handleOtpChange,
    resendOtp,
    handleProceed,

    // ✅ new
    isValidEmail,
    sendingOtp,
  } = useLoginController();

  const canSendOtp = email.trim().length > 0 && isValidEmail(email) && !sendingOtp;

  // ✅ allow only digits (for mobile keyboard + paste safety)
  const onlyDigit = (v: string) => (v || "").replace(/\D/g, "").slice(0, 1);

  return (
    <div className="backdrop" onClick={closeLogin}>
      <div className="loginBox" onClick={(e) => e.stopPropagation()}>
        <img loading="eager" src={logo} alt="Build My Body" className="logo" />

        {/* ================= EMAIL STEP ================= */}
        {!isOtpStep && (
          <>
            <h2 className="loginTitle">Please Enter Email to Continue</h2>

            <div className="inputWrapper">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <button className="otpButton" onClick={startOtpFlow} disabled={!canSendOtp}>
              {sendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* ================= OTP STEP ================= */}
        {isOtpStep && (
          <>
            <h2 className="loginTitle">Enter OTP Sent On</h2>

            <div className="otpSubTitle">
              {email}
              <img
                src={edit}
                alt="edit"
                className="editIcon"
                onClick={() => setIsOtpStep(false)}
              />
            </div>

            <div className="otpInputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  // ✅ IMPORTANT: numeric keypad on mobile
                  type="tel"
                  inputMode="numeric"
                  pattern="\d*"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  // ✅ OTP box behavior
                  maxLength={1}
                  value={digit}
                  aria-label={`OTP digit ${i + 1}`}
                  onChange={(e) => handleOtpChange(onlyDigit(e.target.value), i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  onPaste={handleOtpPaste}
                />
              ))}
            </div>

            {/* ================= RESEND SECTION ================= */}
            {timer > 0 ? (
              <span>
                Resend OTP in <strong>00:{String(timer).padStart(2, "0")}</strong>
              </span>
            ) : (
              <span
                onClick={() => resendOtp("email")}
                style={{
                  color: "red",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginTop: "10px",
                  display: "inline-block",
                }}
              >
                Resend OTP
              </span>
            )}

            <button className="otpButton" disabled={!isOtpComplete} onClick={handleProceed}>
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
