'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

interface Props {
    id:string,
    username:string,
    name:string,
    image:string,
    userType:string,
}

const UserCard = ({id,username,name,image,userType}:Props) => {
    const route = useRouter()
  return (
    <article className="user-card">
        <div className="user-card_avatar">
            <Image 
                src={image}
                alt="avatar"
                width={48}
                height={48}
                className="rounded-full"
            />
            <div className="flex-1 text-ellipsis">
                <h4 className="text-base-semibold text-light-1">{name}</h4>
                <p className="text-gray-1 text-small-medium">@{username}</p>
            </div>
        </div>
        <Button className="user-card_btn" onClick={() => route.push(`/profile/${id}`)}>
            View
        </Button>
        
    </article>
  )
}

export default UserCard