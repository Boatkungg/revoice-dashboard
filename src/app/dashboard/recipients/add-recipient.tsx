import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { $fetch } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addRecipientSchema = z.object({
    gameUserId: z.string().min(1, "Game User ID is required"),
});

export default function AddRecipient({ onRefetch }: { onRefetch: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof addRecipientSchema>>({
        resolver: zodResolver(addRecipientSchema),
        defaultValues: {
            gameUserId: "",
        },
    });

    async function onSubmit(data: z.infer<typeof addRecipientSchema>) {
        console.log("Adding recipient with data:", data);

        const { error } = await $fetch("@post/dashboard/recipient/add", {
            body: {
                gameUserId: data.gameUserId,
            },
            credentials: "include",
        })

        if (error || !data) {
            console.error("Error adding recipient:", error);
            toast.error("Failed to add recipient");
            return;
        }

        toast.success("Recipient added successfully");
        form.reset();
        setIsOpen(false);
        onRefetch();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="default">
                    <span className="flex items-center space-x-1">
                        <span>Add Recipient</span>
                        <Plus className="h-4 w-4" />
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add your recipient</DialogTitle>
                    <DialogDescription>
                        Enter your recipient details below to add them to the
                        list.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="gameUserId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Game User ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter >
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Add</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
