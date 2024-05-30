"use client"
import Link from "next/link"
import Image from "next/image"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navLinks } from "@/constants"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

const MobileNav = () => {
    const pathname = usePathname()
  return (
    <header className="header">
        <Link href='/' className="flex items-center gap-2 md:py-2">
            <Image src="/logo.png" alt="logo" width={180} height={33}/>
        </Link>
        <nav className="flex gap-2">
            <SignedIn>
                <UserButton afterSignOutUrl="/"/>
            
            <Sheet>
                <SheetTrigger>
                    <Image 
                        src="/assets/icons/menu.svg"
                        alt="menu"
                        width={32}
                        height={32}
                        className="cursor-pointer"
                    />
                </SheetTrigger>
                <SheetContent className="sheet-content sm:w-64">
                    <>
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={152}
                            height={23}
                        />

                        <ul className="header-nav_elements">
                            {navLinks.map((link)=> {
                                const isActive = link.route === pathname
                                return (
                                    <li key={link.route} className={`${isActive && 'gradient-text'} p-8 whitespace-nowrap text-dark-700 `}>
                                        <Link className="sidebar-link cursor-pointer" href={link.route}>
                                            <Image src={link.icon} width={24} height={24} alt={link.label}/>
                                            {link.label}
                                        </Link>
                                        

                                    </li>
                                )
                            })}
                        </ul>
                    </>
                </SheetContent>
            </Sheet>
            </SignedIn>

            <SignedOut>
                <Button className="button bg-purple-gradient bg-cover">
                    <Link href="/sign-in">Sign In</Link>
                </Button>
            </SignedOut>


        </nav>
    </header>

  )
}

export default MobileNav