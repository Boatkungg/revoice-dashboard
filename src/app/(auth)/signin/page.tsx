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
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
})

export default function SignInPage() {
    const [passvisibility, setPassVisibility] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        await authClient.signIn.email({
            email: values.email,
            password: values.password
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            },
            onError: (error) => {
                form.setError("password", {
                    message: error.error.message,
                });
            }
        })
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>
                    <div className=" text-2xl font-semibold">Sign in</div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                        <Button type="submit" className=" w-full mt-4">Sign in</Button>
                        <div className="text-sm">
                            Don&apos;t have an account? <Link href="/signup" className="underline">Sign up</Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter/>
        </Card>
    );
}