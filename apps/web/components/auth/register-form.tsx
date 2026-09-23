"use client"

import { useForm, Controller } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@workspace/ui/components/input";
import { useState, useTransition } from "react";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { Button } from "@workspace/ui/components/button";
import Register from "@/actions/register";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";

const RegisterForm = () => {
    
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    });


    const onSubmitHandler = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            Register(values).then((data) => {
                setSuccess(data?.success);
                setError(data?.error);
            });
        });
    };


    return (
        <div>
            <CardWrapper 
                backButtonHref="/auth/login"
                backButtonLabel="Already have an account?"
                headerLabel="Welcome"
                showSocial
            >
                <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmitHandler)}
                >
                    <FieldGroup>

                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-name">
                                        Name
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="register-name"
                                        type="text"
                                        placeholder="Avishek Saha"
                                        autoComplete="name"
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
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-email">
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
                                    <FieldLabel htmlFor="register-password">
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
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />


                        <FormError label={error} />

                        <FormSuccess label={success} />


                        <Button
                            variant="default"
                            className="w-full cursor-pointer"
                            type="submit"
                            size="lg"
                            disabled={isPending}
                        >
                            {isPending ? "Creating account..." : "Create an account"}
                        </Button>

                    </FieldGroup>
                </form>
            </CardWrapper>
        </div>
    );
};


export default RegisterForm;