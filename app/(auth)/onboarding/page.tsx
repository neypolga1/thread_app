import AccountProfile from "@/components/form/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if (userInfo?.onboarded) redirect("/");

    const userData = {
        id:user?.id,
        objectId:userInfo?.id,
        username:userInfo?.username || user?.username,
        name:userInfo?.name ||user?.firstName ||'',
        bio:userInfo?.bio || '',
        image:userInfo?.image || user?.imageUrl,
    }
    return (
        <main className="mx-auto flex flex-col max-w-3xl justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">Complete your profile now, to use Threds.</p>


            <section className="mt-9 p-10 bg-dark-2 rounded-xl">
                <AccountProfile user={userData} btnTitle="Continue"/>
            </section>
        </main>
    )
}
export default Page;