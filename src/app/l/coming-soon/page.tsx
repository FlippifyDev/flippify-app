'use client'

import { Lato, Inter } from 'next/font/google';
import { Suspense } from 'react';
import Layout from '../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import Loading from '@/app/components/Loading';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const ComingSoon = () => {
  return (
    <>
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <div className="flex flex-col items-center pt-20">
            <div className="w-full animate-fadeInPrimary">
            <p className={`${lato.className} text-6xl text-white text-center`}>
              Coming <span className="bg-gradient-to-tr pb-1 pl-1 from-textGradStart to-textGradEnd bg-clip-text text-transparent">Soon</span>
            </p>
            </div>
            <p className={`w-full mt-3 mb-8 pb-1 pt-2 text-gray-300 text-lg text-center animate-fadeInSecondary font-medium ${inter.className}`}>
              Currently Under Heavy Development - Stay Tuned!
            </p>
          </div>
        </Layout>
      </Suspense>
    </>
  );
};

export default ComingSoon;
