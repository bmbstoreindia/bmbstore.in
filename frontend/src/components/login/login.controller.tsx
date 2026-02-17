import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/app.context";
import { apiService } from "../../sevice/api.service";
import { useNavigate } from "react-router-dom";

declare global {
    interface Window {
        Razorpay: any;
    }
}

function useLoginController() {
    const {
        setShowLogin,
        showLogin,
        isLoginedIn,
        setIsLoginedIn,
        setUserID,
        userID,
        toProfile
    } = useAppContext();

    const [isOtpStep, setIsOtpStep] = useState(false);
    const [email, setEmail] = useState("");
    const [timer, setTimer] = useState(30);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [sendingOtp, setSendingOtp] = useState(false); // ✅ NEW
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    const closeLogin = () => setShowLogin(false);
    const navigate = useNavigate();
    const { loginUser, otpAuth } = apiService();

    const isValidEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    /* ================= TIMER LOGIC ================= */
    useEffect(() => {
        if (!isOtpStep || timer === 0) return;
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [isOtpStep, timer]);

    /* ================= OTP FLOW ================= */
    const startOtpFlow = async () => {
        if(!isLoginedIn){
            localStorage.setItem('email',email)
        }
        const trimmedEmail = email.trim().toLowerCase() || localStorage.getItem('email')!;

        // ✅ Don't silently do nothing
        if (!isValidEmail(trimmedEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        // ✅ avoid double click
        if (sendingOtp) return;

        try {
            setSendingOtp(true);

            const result = await loginUser(userID, trimmedEmail);
            if (result?.errorCode === "NO_ERROR") {
                localStorage.setItem('token', result.token!)
                setIsOtpStep(true);
                setTimer(30);
                setOtp(Array(6).fill(""));
                setTimeout(() => otpRefs.current[0]?.focus(), 100);
            } else {
                alert(result?.message || "Failed to send OTP. Please try again.");
                console.error("Failed to send OTP:", result);
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasted)) return;

        const pastedOtp = pasted.split("");
        setOtp(pastedOtp);

        pastedOtp.forEach((digit, i) => {
            if (otpRefs.current[i]) otpRefs.current[i]!.value = digit;
        });

        otpRefs.current[pastedOtp.length - 1]?.focus();
    };

    const resendOtp = async (_type: "email") => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!isValidEmail(trimmedEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const res = await loginUser(userID, trimmedEmail);
            if (res?.errorCode === "NO_ERROR") {
                setTimer(30);
                setOtp(Array(6).fill(""));
                otpRefs.current[0]?.focus();
            } else {
                alert(res?.message || "Failed to resend OTP. Please try again.");
            }
        } catch (err) {
            console.error("Error resending OTP:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    const isOtpComplete = otp.every((digit) => digit !== "");

    /* ================= VERIFY OTP ================= */
    const handleProceed = async () => {
        try {
            const res = await otpAuth(Number(otp.join("")));

            if (res.errorCode !== "NO_ERROR" || !res.userId) {
                alert("OTP verification failed or userId missing. Please login again.");
                return;
            }
            localStorage.setItem('token', res.token!)
            localStorage.setItem('address', JSON.stringify(res.address))
            localStorage.setItem('userData', JSON.stringify(res.user))
            setIsLoginedIn(true);
            setUserID(res.userId);
            closeLogin();
            setIsLoginedIn(true)

            if (toProfile) {
                navigate("/AccountSetting", { state: { profile: true } });
            }
            else {
                navigate("/checkout", {
                    state: {
                        data: {
                            addrData: res.address,
                            userData: res.user,
                        },
                    },
                });
            }
        } catch (e) {
            console.error("Error in handleProceed:", e);
            alert("Something went wrong. Please try again.");
        }
    };

    /* ================= UI LOCK ================= */
    useEffect(() => {
        if (showLogin) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "";
        }

        // ✅ Cleanup when component unmounts
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [showLogin]);


    return {
        setShowLogin,
        showLogin,
        closeLogin,
        isLoginedIn,
        setIsLoginedIn,
        navigate,
        setIsOtpStep,
        isOtpStep,

        email,
        setEmail,

        timer,
        setTimer,
        otp,
        setOtp,
        loginUser,
        otpRefs,
        startOtpFlow,
        isOtpComplete,
        handleOtpPaste,
        handleOtpKeyDown,
        handleOtpChange,

        resendOtp,
        handleProceed,

        // ✅ NEW exports for UI
        isValidEmail,
        sendingOtp,
    };
}

export { useLoginController };
