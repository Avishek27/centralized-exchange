import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

const LoginPage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center">
                    Loading...
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
};

export default LoginPage;