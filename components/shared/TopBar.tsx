import { OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { dark } from '@clerk/themes'

const TopBar = () => {
  return (
    <nav className='topbar'>
        <Link href="/" className='flex items-center gap-4'>
            <Image src="/assets/logo.svg" alt='logo' width={20} height={20} />
            <p className='text-heading3-bold text-light-1 max-sm:hidden'>Threads</p>
        </Link>
        <div className='flex items-center gap-1'>
          <div className='block md:hidden'>
            <SignedIn>
              <SignOutButton>
                <div className='flex cursor-pointer'>
                  <Image src="/assets/logout.svg" alt="logout-icon" width={24} height={24}/>
                </div>
              </SignOutButton>
            </SignedIn>
          </div>
          <OrganizationSwitcher 
            appearance={{
              baseTheme:dark,
              elements: {
                organisationSwitcherTrigger:"py-2 px-4"
              },
            }}
          
          />
        </div>
    </nav>
  )
}

export default TopBar