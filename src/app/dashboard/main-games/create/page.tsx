"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { $fetch } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateCustomGameSchema = z.object({
    type: z.enum(["facial_detection", "functional_speech", "phoneme_practice"]),
    subtype: z.string(),
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    stage: z.array(
        z.object({
            target: z.string().min(1, "Target is required"),
            description: z.string(),
            image: z.string(),
        })
    ),
});

export default function CreateCustomGamePage() {
    const [api, setApi] = useState<CarouselApi>();
    const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false);
    const [isSumitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof CreateCustomGameSchema>>({
        resolver: zodResolver(CreateCustomGameSchema),
        defaultValues: {
            type: "facial_detection",
            subtype: "",
            name: "",
            description: "",
            stage: [
                {
                    target: "",
                    description: "",
                    image: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "stage",
    });

    useEffect(() => {
        if (shouldScrollToEnd && api && fields.length > 0) {
            setTimeout(() => {
                if (fields.length === 2) {
                    api.scrollPrev(true);
                    api.scrollNext(true);
                }
                api.scrollTo(fields.length - 1, true);
            }, 100);
            setShouldScrollToEnd(false);
        }
    }, [fields.length, shouldScrollToEnd, api]);

    const addStage = () => {
        append({
            target: "",
            description: "",
            image: "",
        });

        setShouldScrollToEnd(true);
    };

    const removeStage = (index: number) => {
        if (fields.length > 1) {
            remove(index);
            setTimeout(() => {
                if (api) {
                    api.scrollTo(index - 1, true);
                }
            }, 100);
        }
    };

    async function onSubmit(data: z.infer<typeof CreateCustomGameSchema>) {
        setIsSubmitting(true);
        if (isSumitting) return;

        console.log("Creating main game with data:", data);

        // auto add stage number based on the length of the stage array
        const stagesWithNumbers = data.stage.map((stage, index) => ({
            ...stage,
            number: index,
        }));
        const customGameData = {
            ...data,
            stage: stagesWithNumbers,
        };
        console.log("Main Game Data to be submitted:", customGameData);

        const { error } = await $fetch("@post/dashboard/main-level/create", {
            body: customGameData,
            credentials: "include",
        });

        if (error) {
            console.error("Error creating main game:", error);
            toast.error("Failed to create main game");
            setIsSubmitting(false);
            return;
        }

        toast.success("Main game created successfully");
        router.push("/dashboard/main-games");
    }

    return (
        <div className="w-full h-full flex flex-col mt-6 px-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full h-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4"
                >
                    <div className="w-full lg:w-1/2 flex flex-col space-y-4 ">
                        <h1 className="text-2xl font-semibold mb-4">
                            Create Main Game
                        </h1>

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select game type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="facial_detection">
                                                Facial Detection
                                            </SelectItem>
                                            <SelectItem value="functional_speech">
                                                Functional Speech
                                            </SelectItem>
                                            <SelectItem value="phoneme_practice">
                                                Phoneme Practice
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subtype"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subtype (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="optional subtype"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. My Custom Game"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="A brief description of the game"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex content-center space-x-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addStage}
                            >
                                Add Stage
                            </Button>
                            <Button type="submit">Create Game</Button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:space-x-4">
                        <Carousel className="w-full max-w-md" setApi={setApi}>
                            <CarouselContent className="basis-1 ">
                                {fields.map((field, index) => (
                                    <CarouselItem key={index}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    <span>
                                                        Stage {index + 1}
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-col space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`stage.${index}.target`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Stage Target
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="e.g. สวัสดี / closed_smile"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`stage.${index}.description`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Stage
                                                                    Description
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Description of the stage"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`stage.${index}.image`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Stage Image
                                                                    URL
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="https://example.com/image.jpg"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                {fields.length > 1 ? (
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() =>
                                                            removeStage(index)
                                                        }
                                                    >
                                                        Delete stage
                                                    </Button>
                                                ) : null}
                                            </CardFooter>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <div className="flex space-x-4 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => api?.scrollPrev()}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => api?.scrollNext()}
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
