/* eslint-disable @next/next/no-img-element */
'use client'

import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { Collection } from '../../typings';
import { useContext } from 'react';
import { GlobalContext } from '@/context/globalContext';
import { urlFor } from '../../sanity';
import { useRouter } from 'next/navigation';



export default function Home() {
  
  const globalContext = useContext(GlobalContext);
  const { collectionState: collections } = globalContext;

  const router = useRouter();
  console.log(collections);
  

  return (
    <div className='flex flex-col max-w-7xl mx-auto border-t-2 border-rose-700 py-20 px-10 2xl:px-0'>
      <header className="flex justify-between w-100 items-center pb-1">
          <h1 className="font-LVWeb cursor-pointer text-2xl 
            font-extralight w-screen mb-10">
            The •{" "}
            <span className="font-bold font-mono">
              {"MGF'00"}
            </span>
            {" "}• NFT Market Place
          </h1>
        </header>
        <main className='shadow-xl shadow-rose-400/30 bg-[#fbfbfb]'>
          <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-4">
            {
              collections.map((collection: any) => (
                <div 
                  key={collection._id} 
                  className='flex flex-col items-center transition-all 
                  duration-200 cursor-pointer hover:scale-105 pt-5 pb-3 px-2'
                  onClick={()=> router.push(`/nft/${collection.slug.current}`)}
                >
                  <img 
                    className='h-96 w-60 object-cover rounded-2xl' 
                    src={urlFor(collection.mainImage).url()} 
                    alt="mainImage" 
                  />
                  <div className="p-5">
                    <h2 className='text-2xl px-6 mt-3 font-bold font-mono'>{collection.title}</h2>
                    <p className='text-sm px-6 mt-4 font-LVWeb tracking-wide'>{collection.description}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </main>
    </div>
  )
}

