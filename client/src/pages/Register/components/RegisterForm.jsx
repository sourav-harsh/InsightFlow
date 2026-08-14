import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FiAlertCircle, FiEye, FiEyeOff, FiLock, FiMail, FiUser} from "react-icons/fi";
import {useAuth} from "../../../utils/AuthContext";
import Spinner from "../../../utils/Spinner";

export default function RegisterForm() {
    const {register} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({name: "", email: "", password: "", confirm: ""});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const update = (key) => (e) => setForm((prev) => ({...prev, [key]: e.target.value}));

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!/^[A-Za-z ]+$/.test(form.name.trim())) {
            setError("Please enter a valid name.");
            return;
        }

        if (form.name.trim().length < 2) {
            setError("Enter your full name.");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
            setError("Enter a valid email address.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            const firstName = form.name.trim().split(" ")[0];
            const lastName = form.name.trim().split(" ")[1];
            await register(firstName, lastName, form.email.trim(), form.password);
            navigate("/dashboard", {replace: true});
        } catch (err) {
            console.log(err);
            setError(`${err.message}.\n${err.details.subErrors ? err.details?.subErrors?.join("\n") : ""}` || "Unable to create your account. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
            {error && (
                <div
                    className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
                    role="alert">
                    <FiAlertCircle size={16} className="mt-0.5 shrink-0"/>
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="register-name" className="label">Full name</label>
                <div className="relative mt-1.5">
                    <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}/>
                    <input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Aarav Mehta"
                        value={form.name}
                        onChange={update("name")}
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="register-email" className="label">Email</label>
                <div className="relative mt-1.5">
                    <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}/>
                    <input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={update("email")}
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="register-password" className="label">Password</label>
                <div className="relative mt-1.5">
                    <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}/>
                    <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={form.password}
                        onChange={update("password")}
                        className={`${inputClass} pr-11`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="register-confirm" className="label">Confirm password</label>
                <div className="relative mt-1.5">
                    <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}/>
                    <input
                        id="register-confirm"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={form.confirm}
                        onChange={update("confirm")}
                        className={inputClass}
                    />
                </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting && <Spinner className="h-4 w-4"/>}
                {submitting ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-xs text-slate-400">
                By creating an account you agree to the InsightFlow terms of use.
            </p>
        </form>
    );
}
