"use client"

import Link from "next/link";


const Navbar = () => {
    const linkList = ["Balance","Markets","Home","Login"];
    return (
     <nav className="w-full border-b-2 border-gray-400 h-14 md:h-16 lg:h-20 flex items-center justify-between px-4 md:px-8">
       <div>
        Appname
       </div>
       <div className="flex items-center gap-x-4 text-white">
          {
            linkList.map((link) => (
               <Link
               key={link}
               href={`/${link.toLowerCase()}`}
               >{link}</Link>
            ))
          }
       </div>
     </nav>
    )
}


export default Navbar;