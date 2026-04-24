import { useState } from "react"
import type { JSX } from "react"
import { useNavigate } from "react-router-dom"
import Auth from "../apis/auth.api"
import { useDispatch } from "react-redux"
import { updateToken, updateUser } from "../redux/redux-slice/user.slice"
import toast from "react-hot-toast"

const authService = new Auth();

function Login(): JSX.Element {
  const [step, setStep] = useState<number>(1)
  const [phone, setPhone] = useState<string>("")
  const [otp, setOtp] = useState<string>("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (phone.length != 10) {
      toast.error("Enter valid phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.sendOtp({
        countryCode: "+91",
        phone,
      });

      console.log(res.status);

      if (res?.status === 201) {
        setStep(2);
        toast.success("OTP sent successfully!");
      } else {
        toast.error(res?.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length < 6) {
      toast.error("Enter valid OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.verifyOtp({
        countryCode: "+91",
        phone,
        otp,
      });

      if (res?.status === 201) {
        const { token, user } = res.data.data;

        // 🔥 Save in Redux + Cookies
        dispatch(updateToken(token));
        dispatch(updateUser(user));

        navigate("/admin");
        toast.success("Login successful!");
      } else {
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center p-4">
      <div className="brutal-card w-full max-w-md p-8">
        <div className="mb-8 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            GAMEHUB
          </h1>
          <p className="font-mono text-sm font-bold">
            Admin Portal // v2.0
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="flex flex-col gap-1 w-full">
              <label className="font-bold text-sm uppercase">
                Phone Number
              </label>

              <input
                type="number"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="brutal-input"
              />
            </div>

            <button
              type="submit"
              className="brutal-btn brutal-btn-primary brutal-hover w-full"
              disabled={loading}>
              {loading ? "Please wait..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex flex-col gap-1 w-full">
              <label className="font-bold text-sm uppercase">
                Enter OTP
              </label>

              <input
                type="text"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="brutal-input"
              />

            </div>

            <button
              type="submit"
              className="brutal-btn brutal-btn-success brutal-hover w-full"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm font-bold uppercase underline w-full text-center mt-4"
            >
              Change Phone
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login