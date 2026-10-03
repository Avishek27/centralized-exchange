import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";


const LoginPage = () => {
    return (
        <main
            className="
                min-h-screen
                w-full

                bg-[#0d0e12]

                flex
                items-center
                justify-center

                px-4
                py-10
            "
        >
            <div className="w-full max-w-[440px]">
                <Suspense fallback={null}>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
};


export default LoginPage;