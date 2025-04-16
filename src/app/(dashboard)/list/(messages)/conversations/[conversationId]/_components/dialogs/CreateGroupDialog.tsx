import { useMutation, useQuery } from 'convex/react';
import React, { useMemo } from 'react'
import { z } from 'zod'
import { api } from '../../../../../../../../../convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createGroup } from '../../../../../../../../../convex/friends';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { useMutationState } from '@/hooks/useMutationState';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { CirclePlus, X } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Card } from '@/components/ui/card';

type Props = {}

const createGroupFormSchema = z.object({
    name: z.string().min(1, { message: "This field can't be empty" }),
    members: z.string().array().min(1, { message: "You must select at least one person" })
});

const CreateGroupDialog = (props: Props) => {
    const { userId } = useAuth();

    const friends = useQuery(api.friends.get, userId ? { clerkId: userId } : "skip");


    const { mutate: createGroup, pending } = useMutationState(api.friends.createGroup)

    const form = useForm<z.infer<typeof createGroupFormSchema>>({
        resolver: zodResolver(createGroupFormSchema),
        defaultValues: {
            name: "",
            members: []
        }
    })

    const members = form.watch("members", []);

    const unselectedFriends = useMemo(() => {
        return friends ? friends.filter((friend) => !members.includes(friend._id)) : [];
    }, [members, friends]);


    const handleSubmit = async (
        values: z.infer<typeof createGroupFormSchema>
    ) => {
        await createGroup({ name: values.name, members: values.members, clerkId: userId }).then(() => {
            form.reset();
            toast.success("Group created!")
        }).catch((error: any) => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred")
        })
    }

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger>
                    <Button asChild size="icon" variant="ghost">
                        <DialogTrigger asChild><CirclePlus className='h-6 w-6' /></DialogTrigger>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Create Group</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent className='block'>
                <DialogHeader>
                    <DialogTitle>Create group</DialogTitle>
                    <DialogDescription>Add people to get started!</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                        <FormField control={form.control} name='name' render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Group name...' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />
                        <FormField control={form.control} name='members' render={() => {
                            return (
                                <FormItem>
                                    <FormLabel>People</FormLabel>
                                    <FormControl>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild disabled={unselectedFriends.length === 0}>
                                                <Button className='w-full' variant="outline">Select</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className='w-full'>
                                                {unselectedFriends.map(friends => {
                                                    return <DropdownMenuCheckboxItem key={friends._id} className='flex items-center gap-2 w-full p-2' onCheckedChange={checked => {
                                                        if (checked) {
                                                            form.setValue("members", [...members, friends._id])
                                                        }
                                                    }}><Avatar className='w-8 h-8'>
                                                        <AvatarImage src={friends.username} />
                                                            <AvatarFallback className='flex items-center justify-center w-full'>{friends.username.substring(0, 1)}</AvatarFallback></Avatar>
                                                        <h4 className='truncate'>{friends.username}</h4>
                                                    </DropdownMenuCheckboxItem>
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />
                        {members && members.length ? <Card className='flex items-start justify-center gap-3 oveflow-x-auto w-full h-24 p-2 no-scrollbar'>
                            {friends?.filter(friend => members.includes(friend._id)).map(friend => {
                                return <div key={friend._id} className='flex flex-col items-center gap-1'>
                                    <div className='relative'>
                                        <Avatar><AvatarFallback className='flex items-center justify-center w-full'>{friend.username.substring(0, 1)}</AvatarFallback></Avatar>
                                        <X className='text-destructive w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer' onClick={() => form.setValue("members", members.filter(id => id !== friend._id))} />
                                    </div>
                                    <p className='truncate text-sm'>{friend.username.split(" ")[0]}</p>
                                </div>
                            })}
                        </Card> : null}
                        <DialogFooter>
                            <Button disabled={pending} type='submit'>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateGroupDialog