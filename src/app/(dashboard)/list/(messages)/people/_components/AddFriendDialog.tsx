'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMutationState } from '@/hooks/useMutationState'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../../../../../../../convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { useAuth } from '@clerk/nextjs'

const addFriendFormSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
})

const AddFriendDialog = () => {
    const { mutate: createRequest, pending } = useMutationState(api.request.create)
    const { userId } = useAuth();


    console.log("Logged in userId:", userId);  // Debugging userId

    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            username: "",
        }
    });

    const handleSubmit = async (data: z.infer<typeof addFriendFormSchema>) => {
        console.log("Form data before submitting:", data);  // Log form data before submission
        
        try {
            const response = await createRequest({
                username: data.username,
                clerkId: userId
            });
            console.log("Response from createRequest:", response);  // Log response from the mutation
            form.reset();
            toast.success("Request sent");
        } catch (err) {
            console.error("Error in request:", err);  // Log error to the console
            toast.error(err instanceof ConvexError ? err.data : "Unexpected error occurred");
            form.reset();
        }
    }

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button asChild size="icon" variant="outline">
                        <DialogTrigger>
                            <UserPlus />
                        </DialogTrigger>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add People</DialogTitle>
                    <DialogDescription>Send request to chat</DialogDescription>
                </DialogHeader>

                <FormProvider {...form}>
                    <form className='space-y-8' onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField 
                            control={form.control} 
                            name='username' 
                            render={({ field }) => 
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Username' {...field} />
                                    </FormControl>
                                </FormItem>
                            } 
                        />
                        <Button type='submit' disabled={pending}>Send Request</Button>
                    </form> 
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}

export default AddFriendDialog
