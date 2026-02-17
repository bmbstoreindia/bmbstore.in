import React, { useMemo, useState } from "react";
import { useAppContext } from "../../context/app.context";
import { apiService } from "../../sevice/api.service";
import "./nutritionModal.css";

type SendMailBody = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  fromName?: string;
  fromEmail?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content?: string; // base64 or raw string
    path?: string;
    contentType?: string;
  }>;
};

function NutritionAdviceModal() {
  const { setSetGetLeads, setToast } = useAppContext();
  const { sendLead } = apiService();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    goalOrProblem: "",
  });

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const onClose = () => setSetGetLeads((prev) => !prev);

  const onChange =
    (key: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
      };
  const showSuccessToast = (message: string) => {
    setToast({ show: true, message });
    window.setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000); // ✅ 2 seconds
  };
  // ✅ Build request body exactly as sendMail(params) expects
  const mailBody: SendMailBody = useMemo(() => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const mobile = form.mobile.trim();
    const goalOrProblem = form.goalOrProblem.trim();

    return {
      to: "bmbstoreindia@gmail.com", // ✅ change this
      subject: "🧾 New Nutrition Advice Lead",
      replyTo: email || undefined,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="margin: 0 0 12px;">New Nutrition Lead</h2>
          <table cellspacing="0" cellpadding="6" border="0" style="border-collapse: collapse;">
            <tr><td><b>First Name</b></td><td>${firstName || "-"}</td></tr>
            <tr><td><b>Last Name</b></td><td>${lastName || "-"}</td></tr>
            <tr><td><b>Email</b></td><td>${email || "-"}</td></tr>
            <tr><td><b>Mobile</b></td><td>${mobile || "-"}</td></tr>
            <tr><td><b>Goal / Problem</b></td><td>${goalOrProblem || "-"}</td></tr>
          </table>
        </div>
      `,
    };
  }, [form]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // optional validation
    if (!form.firstName.trim()) return alert("First Name is required");
    if (!form.mobile.trim()) return alert("Mobile Number is required");

    try {
      // ✅ sendLead should POST this body to your backend route that calls sendMail(req.body)
      await sendLead(mailBody);
      showSuccessToast("Lead submitted successfully!");

      // reset + close
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        goalOrProblem: "",
      });
      onClose();
    } catch (err) {
      console.error("sendLead failed:", err);
      alert("Failed to send lead. Please try again.");
    }
  };

  return (
    <div className="na-overlay" role="presentation" onClick={onClose}>
      <div
        className="na-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="na-title"
        onClick={stop}
      >
        <button className="na-close" aria-label="Close modal" onClick={onClose}>
          ✕
        </button>

        <h2 className="na-title" id="na-title">
          Get Free Nutrition Advice
        </h2>

        <form className="na-form" onSubmit={onSubmit}>
          <div className="na-field">
            <label className="na-label">First Name</label>
            <input
              className="na-input"
              placeholder="Enter your Name"
              value={form.firstName}
              onChange={onChange("firstName")}
            />
          </div>

          <div className="na-field">
            <label className="na-label">Last Name</label>
            <input
              className="na-input"
              placeholder="Enter your Last Name"
              value={form.lastName}
              onChange={onChange("lastName")}
            />
          </div>

          <div className="na-field">
            <label className="na-label">Email Address</label>
            <input
              className="na-input"
              placeholder="Enter your Email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
            />
          </div>

          <div className="na-field">
            <label className="na-label">Mobile Number</label>
            <input
              className="na-input"
              placeholder="Enter your Phone Number"
              inputMode="numeric"
              value={form.mobile}
              onChange={onChange("mobile")}
            />
          </div>

          <div className="na-field">
            <label className="na-label">Your fitness goal or problems?</label>
            <input
              className="na-input"
              placeholder="e.g. weight loss / muscle gain"
              value={form.goalOrProblem}
              onChange={onChange("goalOrProblem")}
            />
          </div>

          <button className="na-btn" type="submit">
            Get Free Advice
          </button>
        </form>
      </div>
    </div>
  );
}

export { NutritionAdviceModal };
