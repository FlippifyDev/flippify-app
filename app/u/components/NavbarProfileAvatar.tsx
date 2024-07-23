import { useSession } from 'next-auth/react';
import Image from "next/image";
import React from 'react'

const NavbarProfileAvatar = () => {
    const { data: session } = useSession();

    // Default discord avatar
    let avatar = "https://i.pinimg.com/originals/40/a4/59/40a4592d0e7f4dc067ec0cdc24e038b9.png"

    if (session) {
        if (session.user?.image) {
            avatar = session.user.image
        }
    }

    return (
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
                <Image
                    alt="Avatar"
                    src={avatar}
                    width={50}
                    height={50}
                    loading="lazy"
                />
            </div>
        </div>
    )
}

export default NavbarProfileAvatar
