"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import CardWrapper from "./card-wrapper";
import FormError from "./form-error";
import FormSuccess from "./form-success";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

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
            ? "Email is already in use with a different provider"
            : "";

    const [isPending, startTransition] = useTransition();

    const [success, setSuccess] =
        useState<string | undefined>();

    const [error, setError] =
        useState<string | undefined>();


    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });


    const onSubmitHandler = (
        values: z.infer<typeof LoginSchema>
    ) => {
        setError(undefined);
        setSuccess(undefined);

        startTransition(async () => {
            const data = await Login(values);

            setSuccess(data?.success);
            setError(data?.error);
        });
    };


    return (
        <CardWrapper
            headerLabel="Log in"
            backButtonHref="/auth/register"
            backButtonLabel="New to Finora? Create account"
            showSocial
        >
            <form
                onSubmit={form.handleSubmit(onSubmitHandler)}
                className="w-full"
            >
                <FieldGroup className="space-y-5">

                    {/* EMAIL */}
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-2">

                                <FieldLabel
                                    htmlFor="login-email"
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#9296a5]
                                    "
                                >
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
                                    className="
                                        h-12
                                        rounded-xl

                                        border
                                        border-[#2b2d34]

                                        bg-[#1c1d23]
                                        px-4

                                        text-[15px]
                                        text-white

                                        placeholder:text-[#777b89]

                                        transition-colors

                                        hover:border-[#383b45]

                                        focus-visible:border-blue-500
                                        focus-visible:bg-[#1c1d23]
                                        focus-visible:text-white
                                        focus-visible:ring-1
                                        focus-visible:ring-blue-500/30

                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}

                            </Field>
                        )}
                    />


                    {/* PASSWORD */}
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-2">

                                <FieldLabel
                                    htmlFor="login-password"
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#9296a5]
                                    "
                                >
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
                                    className="
                                        h-12
                                        rounded-xl

                                        border
                                        border-[#2b2d34]

                                        bg-[#1c1d23]
                                        px-4

                                        text-[15px]
                                        text-white

                                        placeholder:text-[#777b89]

                                        transition-colors

                                        hover:border-[#383b45]

                                        focus-visible:border-blue-500
                                        focus-visible:bg-[#1c1d23]
                                        focus-visible:text-white
                                        focus-visible:ring-1
                                        focus-visible:ring-blue-500/30

                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}

                            </Field>
                        )}
                    />


                    {/* ERRORS / SUCCESS */}
                    {(error || urlError || success) && (
                        <div className="space-y-2">
                            <FormError
                                label={error || urlError}
                            />

                            <FormSuccess
                                label={success}
                            />
                        </div>
                    )}


                    {/* LOGIN BUTTON */}
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isPending}
                        className="
                            mt-2
                            h-12
                            w-full
                            cursor-pointer

                            rounded-xl

                            bg-white
                            text-black

                            text-sm
                            font-semibold

                            transition-all

                            hover:bg-neutral-200

                            disabled:cursor-not-allowed
                            disabled:bg-[#222329]
                            disabled:text-[#777b89]
                        "
                    >
                        {isPending
                            ? "Signing in..."
                            : "Log in"}
                    </Button>

                </FieldGroup>
            </form>
        </CardWrapper>
    );
};


export default LoginForm;