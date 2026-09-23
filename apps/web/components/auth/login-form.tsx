"use client"

import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import CardWrapper from "./card-wrapper";
import * as z from "zod";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useState, useTransition } from "react";

import FormError from "./form-error";
import FormSuccess from "./form-success";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import { LoginSchema } from "@/schemas";
import Login from "@/actions/login";


const LoginForm = () => {
   
    const searchParams = useSearchParams();

    const urlError =
        searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email is already in use with different provider"
        : "";

    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmitHandler = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            Login(values).then((data) => {
                setSuccess(data?.success);
                setError(data?.error);
            });
        });
    };

    return (
        <div>
            <CardWrapper
                backButtonHref="/auth/register"
                backButtonLabel="Don't have an account?"
                headerLabel="Welcome back"
                showSocial
            >
                <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmitHandler)}
                >
                    <FieldGroup>

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-email">
                                        Email
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="login-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        disabled={isPending}
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-password">
                                        Password
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="login-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={isPending}
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <FormError label={error || urlError} />

                        <FormSuccess label={success} />

                        <Button
                            variant="default"
                            className="w-full cursor-pointer"
                            type="submit"
                            size="lg"
                            disabled={isPending}
                        >
                            {isPending ? "Signing in..." : "Log In"}
                        </Button>

                    </FieldGroup>
                </form>
            </CardWrapper>
        </div>
    );
};

export default LoginForm;