import React from 'react'
import Image from 'next/image'

const HomePoweredByCompanies = () => {
  return (
    <div className="avatar-group -space-x-5 rtl:space-x-reverse">
        <div className="avatar">
            <div className="w-8">
              <Image src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-round-color-icon.png" alt="Discord" width={1000} height={1000}/>
            </div>
        </div>
        <div className="avatar ">
            <div className="w-8">
              {/* Can't use Image as it doesn't allow svg's by default */}
              <img src="https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg?q=80&w=1082" alt="Stripe"/>
            </div>
        </div>
    </div>
  )
}

export default HomePoweredByCompanies