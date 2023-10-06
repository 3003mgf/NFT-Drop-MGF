import ThirdWeb from '@/components/ThirdWeb'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { sanityClient, urlFor } from "../../sanity";
import { GlobalProvider } from "../context/globalContext";



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NFT Drop',
  description: 'Generated by create next app',
};

// Get collections from Sanity
const getServerSideProps = async() =>{
  const query = `*[_type == "collection" && (slug.current == $slug || slug.current  == $slug2 || slug.current == $slug3)]{
   _id,
   title,
   address,
   nftCollectionName,
   description,
   mainImage{
     asset
   },
   previewImage{
     asset
   },
   slug{
     current
   },
   creator->{
     _id,
     name,
     address,
     slug{
       current
     },
     image{
      asset
     }
   }
 }`;


 const collections = await sanityClient.fetch(query, {
  slug: "3003-apes",
  slug2: "3003-aliens",
  slug3: "3003-3d-apes"
});

 
 return collections
 
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // Wait for collections
  const getCollections = await getServerSideProps();
  

  return (
    <html lang="en">
        <body className={inter.className}>
            {
              getCollections && (
                <GlobalProvider>
                  <ThirdWeb collections={getCollections}>
                    {children}
                  </ThirdWeb>
                </GlobalProvider>
              )
            }
        </body>
      </html>
  )
}