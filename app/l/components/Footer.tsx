'use client'

import React from 'react';
import Link from 'next/link'


const Footer = () => {
    return(
        <div role="tablist" className="tabs">
            <Link href="" className="tab">Tab 1</Link>
            <Link href="" className="tab tab-active">Tab 2</Link>
            <Link href="" className="tab">Tab 3</Link>
        </div>
    );
}

export default Footer;