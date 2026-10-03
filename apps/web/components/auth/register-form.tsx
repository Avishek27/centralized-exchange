"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import CardWrapper from "./card-wrapper";
import FormError from "./form-error";
import FormSuccess from "./form-success";

import { RegisterSchema } from "@/schemas";
import Register from "@/actions/register";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";


const RegisterForm = () => {
    const [isPending, startTransition] = useTransition();

    const [success, setSuccess] =
        useState<string | undefined>();

    const [error, setError] =
        useState<string | undefined>();


    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),

        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });


    const onSubmitHandler = (
        values: z.infer<typeof RegisterSchema>
    ) => {
        setError(undefined);
        setSuccess(undefined);

        startTransition(async () => {
            const data = await Register(values);

            setSuccess(data?.success);
            setError(data?.error);
        });
    };


    const inputStyles = `
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
    `;


    return (
        <CardWrapper
            backButtonHref="/auth/login"
            backButtonLabel="Already have an account? Log in"
            headerLabel="Create account"
            showSocial
        >
            <form
                onSubmit={form.handleSubmit(onSubmitHandler)}
                className="w-full"
            >
                <FieldGroup className="space-y-3">

                    {/* NAME */}
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-2">

                                <FieldLabel
                                    htmlFor="register-name"
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#9296a5]
                                    "
                                >
                                    Name
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id="register-name"
                                    type="text"
                                    placeholder="Your name"
                                    autoComplete="name"
                                    disabled={isPending}
                                    aria-invalid={fieldState.invalid}
                                    className={inputStyles}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}

                            </Field>
                        )}
                    />


                    {/* EMAIL */}
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-2">

                                <FieldLabel
                                    htmlFor="register-email"
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
                                    id="register-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={isPending}
                                    aria-invalid={fieldState.invalid}
                                    className={inputStyles}
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
                                    htmlFor="register-password"
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
                                    id="register-password"
                                    type="password"
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    disabled={isPending}
                                    aria-invalid={fieldState.invalid}
                                    className={inputStyles}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}

                            </Field>
                        )}
                    />


                    {/* STATUS MESSAGES */}
                    {(error || success) && (
                        <div className="space-y-2">

                            <FormError
                                label={error}
                            />

                            <FormSuccess
                                label={success}
                            />

                        </div>
                    )}


                    {/* SUBMIT BUTTON */}
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isPending}
                        className="
                            mt-2
                            h-12
                            w-full

                            rounded-xl

                            bg-white
                            text-black

                            text-sm
                            font-semibold

                            cursor-pointer
                            transition-all

                            hover:bg-neutral-200

                            disabled:cursor-not-allowed
                            disabled:bg-[#222329]
                            disabled:text-[#777b89]
                        "
                    >
                        {isPending
                            ? "Creating account..."
                            : "Create account"}
                    </Button>

                </FieldGroup>
            </form>
        </CardWrapper>
    );
};


export default RegisterForm;