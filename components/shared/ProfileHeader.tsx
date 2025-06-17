import Image from "next/image"

interface Props {
    accountId:string
    authUserId:string
    name:string
    username:string
    image:string
    bio:string
}

const ProfileHeader = ({accountId,authUserId,name,username,image,bio}:Props) => {
  return (
    <div className="flex w-full flex-col justify-start">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative h-20 w-20 object-cover">
                    <Image src={image} alt="profile" fill className="object-cover rounded-full shadow-2xl"/>
                </div>
                <div className="flex-1">
                    <h2 className="text-left text-heading3-bold text-light-2">{name}</h2>
                    <p className="text-gray-1 text-base-medium">@{username}</p>
                </div>
            </div>
        </div>
        <p className="mt-6 max-w-xl text-base-regular text-light-2">{bio}</p>
        <div className="h-0.5 w-full bg-dark-3 mt-12"/>
    </div>
  )
}

export default ProfileHeader