import { Link } from "react-router-dom";
import AuthLayout from "../../utils/AuthLayout";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your InsightFlow account to continue."
      footer={
        <>
          New to InsightFlow?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
