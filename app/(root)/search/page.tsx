import UserCard from "@/components/card/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";


const Page = async () => {
    const user = await currentUser()
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding')

    const result = await fetchUsers({userId:user.id,pageNumber : 1,pageSize : 25,searchString : ""});
    

  return (
    <section>
        <h4 className="mb-10 head-text">Search</h4>
        <div className="mt-14 flex flex-col gap-9">
            {result.users.length === 0 ? (
                <p className="no-results">No users found.</p>
            ) : (
                <>
                    {result.users.map((user) => (
                        <UserCard 
                            key={user.id}
                            id={user.id}
                            username={user.username}
                            name={user.name}
                            image={user.image}
                            userType = 'User'
                        
                        />
                    ))}
                </>
            )}
        </div>
    </section>
  )
}

export default Page