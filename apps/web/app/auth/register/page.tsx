import RegisterForm from "@/components/auth/register-form";


const RegisterPage = () => {
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
                <RegisterForm />
            </div>
        </main>
    );
};


export default RegisterPage;