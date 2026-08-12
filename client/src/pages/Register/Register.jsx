import { Link } from "react-router-dom";
import AuthLayout from "../../utils/AuthLayout";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start profiling your CSV datasets in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
