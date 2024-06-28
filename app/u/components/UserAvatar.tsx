"use client"

import React from 'react'
import { useSession } from 'next-auth/react';

const UserAvatar = () => {
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
                <img
                    alt="Avatar"
                    src={avatar}
                />
            </div>
        </div>
    )
}

export default UserAvatar
