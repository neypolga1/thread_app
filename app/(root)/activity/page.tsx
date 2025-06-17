import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


const Page = async () => {
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id)
  if(!userInfo.onboarded) redirect('/oboarding');

  const activity = await getActivity(userInfo._id)

  return (
      <section>
          <h4 className="mb-10 head-text">Activity</h4>
          <section className="mt-10 flex flex-col gap-5">
            {activity.length > 0 ? (
              <>
                {activity.map((activity) => (
                  <Link key={activity._id} href={`/thread/${activity._id}`}>
                    <article className="activity-card">
                      <Image 
                        src={activity.author.image}
                        alt="author image"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className="!text-small-regular text-light-1">
                        <span className="mr-1 text-primary-500">{activity.author.name}</span>{" "}
                        replies to your thread
                      </p>
                    </article>
                  </Link>
                ))}
              </>
            ):
              <p className="!text-base-regular text-gray-1">No activities yet</p>
            }
          </section>
      </section>
  )
}

export default Page