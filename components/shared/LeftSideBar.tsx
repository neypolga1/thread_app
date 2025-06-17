"use client";

import { sidebarLinks } from "@/constants";
import { SignedIn, SignOutButton,useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import path from "path";

const LeftSideBar = () => {
	const route = useRouter();
	const pathname = usePathname();
	const { userId } = useAuth()

	return (
		<section className="custom-scrollbar leftsidebar">
			<div className="flex flex-1 flex-col gap-6 px-6 w-full">
				{sidebarLinks.map((link) => {
					const isActive =
						(pathname.includes(link.route) && link.route.length > 1) ||
						pathname === link.route;
						if(link.route === '/profile' && userId) link.route = `${link.route}/${userId}`
					return (
						<Link
							key={link.label}
							href={link.route}
							className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
						>
							<Image
								src={link.imgURL}
								alt={link.label}
								width={24}
								height={24}
							/>
							<p className="text-light-2 max-lg:hidden">{link.label}</p>
						</Link>
					);
				})}
			</div>
      <div className="mt-20 px-6">
            <SignedIn>
              <SignOutButton>
                <div className='flex cursor-pointer gap-4 px-4'>
                  <Image src="/assets/logout.svg" alt="logout-icon" width={24} height={24}/>
                  <p className="text-light-2 max-lg:hidden">Log out</p>
                </div>
              </SignOutButton>
            </SignedIn>
      </div>
		</section>
	);
};

export default LeftSideBar;
