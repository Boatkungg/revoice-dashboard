"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function SignUpPage() {
    const [passvisibility, setPassVisibility] = useState(false);
    const [confirmPassvisibility, setConfirmPassVisibility] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        await authClient.signUp.email({
            name: values.username,
            email: values.email,
            password: values.password,
        }, {
            onSuccess: () => {
                router.push("/signin");
            },
            onError: (error) => {
                // throw new Error(error.error.message);
                form.setError("email", {
                    message: error.error.message,
                });
            }
        })
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>
                    <div className=" text-2xl font-semibold">Sign up</div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex. JoneDoe123" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="w-full flex items-center space-x-1">
                                            <Input placeholder="········" type={passvisibility ? "text" : "password"} {...field} />
                                            <Button variant="outline" type="button" size="icon" onClick={() => setPassVisibility(!passvisibility)}>
                                                {
                                                    passvisibility ? (
                                                        <EyeClosed className="h-4 w-4"/>
                                                    ) : (
                                                        <Eye className="h-4 w-4"/>
                                                    )
                                                }
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <div className="w-full flex items-center space-x-1">
                                            <Input placeholder="········" type={confirmPassvisibility ? "text" : "password"} {...field} />
                                            <Button variant="outline" type="button" size="icon" onClick={() => setConfirmPassVisibility(!confirmPassvisibility)}>
                                                {
                                                    confirmPassvisibility ? (
                                                        <EyeClosed className="h-4 w-4"/>
                                                    ) : (
                                                        <Eye className="h-4 w-4"/>
                                                    )
                                                }
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className=" w-full mt-4">Sign up</Button>
                        <div className="text-sm">
                            Already have an account? <Link href="/signin" className="underline">Sign in</Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter/>
        </Card>
    );
}