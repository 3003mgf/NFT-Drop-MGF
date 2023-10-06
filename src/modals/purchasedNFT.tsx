import { GlobalContext } from "@/context/globalContext";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { url } from "inspector";
import { useContext, useEffect, useState } from "react";
import { urlFor } from "../../sanity";
import Image from "next/image";


const PurchasedNFT = () => {

  const globalContext = useContext(GlobalContext);
  const { nftModal, setNftModal, collectionState } = globalContext;
  const [collectionFound, setCollectionFound] = useState<any>(null);

  useEffect(() => {
    if(collectionState.length){
      
      if(nftModal.metadata.description.includes("Alien")){
        setCollectionFound(collectionState[1]);
      }else if(nftModal.metadata.description.includes("3D")){
        setCollectionFound(collectionState[2]);
      }else{
        setCollectionFound(collectionState[0]);
      }
    }
  }, [collectionState]);

  if(collectionFound){
    return ( 
      <article 
      onClick={()=> setNftModal(false)}
      className="fixed left-0 top-0 bg-black/40 h-screen w-screen
      flex items-center justify-center"
      >
        <div onClick={(e)=> e.stopPropagation()} 
        className="lg:items-start lg:justify-items-center
        lg:flex">
          {/* LEFT DIV */}
          <div>
            <div 
            className="bg-gradient-to-br from-pink-700 to-orange-300 p-2 relative"
            >
              <div className="bg-[url('https://nerdy-my-ecommerce.s3.us-east-2.amazonaws.com/FrontAssets/oval+(1).svg')] bg-no-repeat bg-center flex items-center justify-center">
                <img 
                src={nftModal.metadata.image} 
                alt="purchased-nft" 
                className="object-cover h-80 w-60 lg:h-96 lg:w-72"
                />  
              </div>
              <div className="absolute top-2 left-2">
                <CheckBadgeIcon className="h-6 w-6 text-green-600"/>
              </div>
            </div>
            <div className="bg-black/50 p-1">
              <div className="bg-black/50 p-2 px-4 space-y-2 text-white">
                <p className="font-LVRegular">{nftModal.metadata.name}</p>
                <h1 className="font-mono text-xl pb-2">{nftModal.metadata.description}</h1>
                <p className="font-LVRegular text-sm tracking-wide bg-black/50 w-fit px-3 py-1">{(collectionFound?.nftCollectionName + " " + "Collection")}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-900 to-pink-700 text-white">
              <p className="font-LVRegular px-3 py-2 text-sm tracking-wide text-center">Minted by {nftModal.nftPrice} OPGoerli</p>
            </div>
          </div>
  
          {/* MIDDLE DIV */}
          <div className="hidden lg:flex flex-col items-center h-[564px] justify-center space-y-14 border-2 border-[#F2EDDF] px-4 py-12 text-white font-Futura bg-black/60">
            <span>F</span>
            <span>R</span>
            <span>O</span>
            <span>M</span>
          </div>
            
          {/* RIGHT DIV */}
          <div className="h-[564px] max-h-[564px] hidden lg:flex flex-col max-w-xs">
            <div className="bg-black/50 max-w-xs flex-col backdrop-blur">
              {/* Collection Image */}
              <div className="p-2">
                <img 
                src={urlFor(collectionFound?.mainImage).url()} 
                alt="mainImage" 
                className="w-80 object-cover"
                />
              </div>
  
              {/* Creator Info */}
              <div className="px-3 py-2 flex items-center space-x-3 bg-black/40 backdrop-blur">
                <img 
                src={urlFor(collectionFound?.creator.image).url()} 
                alt="creator-image" 
                className="h-9 w-9 bg-white rounded-full p-1"
                />
                <span className="font-LVRegular text-white tracking-wide text-sm">By {collectionFound?.creator.name}</span>
              </div>
  
              {/* Collection Info */}
              <div className="bg-black/60 pt-1 pb-3 backdrop-blur">
                <h1 className="font-mono text-2xl text-white tracking-wider px-7 mt-5">{collectionFound?.nftCollectionName}</h1>
                <p className="font-LVRegular text-white text-sm tracking-wide p-4 px-7">{collectionFound?.description}</p>
              </div>
  
            </div>
            
          </div>
          
        </div>
      </article>
     );
  }
}
 
export default PurchasedNFT;