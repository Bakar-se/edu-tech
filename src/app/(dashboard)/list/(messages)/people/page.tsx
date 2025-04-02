"use client"
import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'
import AddFriendDialog from './_components/AddFriendDialog'
import { useQuery } from 'convex/react'
import { api } from '../../../../../../convex/_generated/api'
import { useAuth } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

type Props = {}

const People = (props: Props) => {
  const { userId } = useAuth()
  const requests = useQuery(api.requests.get, { clerkId: userId as string } );
  console.log(requests)
  return (
    <>
        <ItemList title='People' action={<AddFriendDialog />}>
        {requests ? requests.length === 0 ? <p className='text-center'>No requests</p> : requests.map((request: any) => <p key={request.sender.username}>{request.sender.username}</p>) : <Loader2 className='h-8 w-8 animate-spin' />}
        </ItemList>
        <ConversationFallback />
    </>
  )
}

export default People