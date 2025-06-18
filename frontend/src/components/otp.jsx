import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export function VerifyOtp () {
  const { state } = useLocation();
  const { email, username, password } = state || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!email || !username || !password || !otp) {
      setError("Missing required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify", {
        email,
        username,
        password,
        otp,
      });
      // Success: redirect to homepage or login
      console.log("Verification successful", res.data);
    } catch (err) {
      setError("OTP verification failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Enter OTP sent to {email}</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
