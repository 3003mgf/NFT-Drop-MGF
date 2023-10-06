/* eslint-disable @next/next/no-img-element */
'use client'
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css"; 

import { useAddress, useDisconnect, useMetamask, useContract } from "@thirdweb-dev/react";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { sanityClient, urlFor } from "../../../../sanity";
import Link from "next/link";
import { BigNumber } from "ethers";
import PurchasedNFT from "@/modals/purchasedNFT";
import { GlobalContext } from "@/context/globalContext";


const NftPage = () => {

  // CONTEXT API & REFS
  const globalContext = useContext(GlobalContext);
  const { nftModal, setNftModal } = globalContext;
  const refToast = useRef<any>();

  // Auth
  const connectWithMetaMask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  
  const metaMaskAuth = () =>{
    if(address){
      disconnect();
    }else{
      connectWithMetaMask();
    }
  };
  // --

  const params = useParams();
  const [collectionFound, setCollectionFound] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  // Claim Number & Loader
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [loading, setLoading] = useState<boolean>(true);
  const [minting, setMinting] = useState(false);

  const [priceInOPGoerli, setPriceInOPGoerli] = useState<string>();
  const nftDrop = useContract(collectionFound?.address, "nft-drop").contract;


  useEffect(() => {
    // Get collection from Sanity
    const getServerSideProps = async() =>{
      const query = `*[_type == "collection" && slug.current == $slug][0]{
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
        }
      }
      }`;

    const collection = await sanityClient.fetch(query, {
      slug: params?.name
    });

    if(!collection){
      setLoading(false);
      return setNotFound(true);
    }

    setCollectionFound(collection);
    };

    getServerSideProps();
  }, []);  

  // GET DROP SUPPLY
  useEffect(() => {
    if(!nftDrop || !collectionFound) return;

    const fetchNftDropData = async() =>{
      setLoading(true);

      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(total)

      setLoading(false);
    };

    fetchNftDropData();
  }, [nftDrop, collectionFound]);

  // GET NFT's PRICE
  useEffect(() => {
    const fetchPrice = async() =>{
      const claimConditions = await nftDrop?.claimConditions.getAll();
      
      
      setPriceInOPGoerli(claimConditions?.[0].currencyMetadata.displayValue)
    };

    fetchPrice();
  }, [nftDrop, collectionFound]);

  
  // Mint NFT
  const mintNFT = () =>{
    if(!nftDrop || !address) return;

    const quantity = 1;

    setMinting(true);

    nftDrop.claimTo(address, quantity)
    .then(async(tx) => {
      const receipt = tx[0].receipt // the transaction receipt
      const claimedTokenId = tx[0].id // the ID of the NFT Claimed
      const claimedNFT = await tx[0].data() //get the claimed NFT metadata
      
      
      refToast.current.show({life: 5000, severity: "success", summary: `HOORAY...`, detail: `You Succesfully Minted!`});

      setClaimedSupply(claimedSupply + 1);
      setNftModal({...claimedNFT, nftPrice: priceInOPGoerli});
      
    })
    .catch(error => {
      refToast.current.show({life: 5000, severity: "info", summary: `WHOOPS...`, detail: "Something went wrong, remember you can only mint 1 NFT per Wallet"});

    })
    .finally(()=> {
      setMinting(false);
    })
  };





  // ------ RETURNS

  // 404 Not Found
  if(notFound){
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="font-LVRegular text-3xl tracking-wide"><b className="font-mono">404</b> Not Found</h1>
      </div>
    )
  };

  // Collection Found
  if(!notFound && collectionFound){
    return ( 
      <div className="flex relative h-screen flex-col lg:grid lg:grid-cols-10">
        {nftModal && <PurchasedNFT/>}
        <Toast ref={refToast} position='top-left'></Toast>

        
        {/* Left */}
        <div className="bg-gradient-to-br from-orange-200 to-rose-700 lg:col-span-4">
          
          {/* Image & Description container */}
          <div className="flex flex-col items-center justify-center lg:min-h-screen py-2">
            
            {/* Image */}
            <div className="bg-gradient-to-br from-pink-700 to-orange-300 rounded-xl p-2">
              <img
                src={urlFor(collectionFound.previewImage).url()}
                alt="nft-image"
                className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              />
            </div>
  
            {/* Description */}
            <div className="p-6 text-center space-y-4">
              <h1 className="text-4xl text-white font-bold font-mono">
                {collectionFound.nftCollectionName}
              </h1>
              
              <h2 className="text-xl text-gray-100 font-LVRegular">
                {collectionFound.description}
              </h2>
            </div>
            
          </div>
  
        </div>
  
        {/* Right */}
        <div className="flex flex-1 flex-col p-12 lg:col-span-6">
          {/* Header */}
          <header className="flex justify-between w-100 items-center pb-1">
            <Link href={"/"}>
              <h1
              className="font-LVWeb cursor-pointer text-xl font-extralight w-52 sm:w-80">
                The •{" "}
                <span className="font-bold font-mono">
                  {"MGF'00"}
                </span>
                {" "}• NFT Market Place
              </h1>
            </Link>
            <button 
              onClick={metaMaskAuth}
              className="bg-gradient-to-br from-pink-700 to-orange-300 px-4 py-2 font-bold tracking-wide text-xs text-white rounded-full lg:px-5">
              {
                address ? "Sign Out" : "Sign In"
              }
            </button>
          </header>
          <hr className="my-2 border"/>
          {
            address && (
              <p className="font-LVWeb text-center text-xs mb-5 text-gray-500 sm:text-sm">
                {`You're logged in with your MetaMask wallet ${address.substring(0, 5)}...${address.substring(address.length - 5)}`}
              </p>
            )
          }
          {/* Content */}
          <div className="flex flex-1 items-center flex-col space-y-4 mt-10 lg:space-y-0 lg:mt-0 lg:justify-center">
            <img className="w-80 pb-10 object-cover lg:h-40" src={urlFor(collectionFound.mainImage).url()} alt="poster-image" />
            <h1 className="text-center text-3xl font-bold lg:text-4xl lg:font-extrabold">
              {collectionFound.title}
            </h1>
            {loading ? (
                <p className="animate-pulse pt-0 text-sm lg:text-base lg:pt-5 text-green-500 font-LVRegular">
                  Loading Supply Count...
                </p>
              ): minting ? (
                <p className="animate-pulse pt-0 text-sm lg:text-base lg:pt-5 text-black/80 font-LVRegular">
                  Minting...
                </p>
              ):(
                <p className="pt-0 text-sm lg:text-base lg:pt-5 text-green-500 font-LVRegular">
                  {`${claimedSupply} / ${totalSupply?.toString()} NFT's claimed`}
                </p>
            )
          }
            {loading && (
              <img 
                className="object-contain h-60 w-80"
                src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif" alt="loader" />
            )}
          </div>
  
          {/* Mint Button */}
          <button 
          onClick={mintNFT}
          disabled={loading || minting || claimedSupply === totalSupply?.toNumber() || !address}
          className="w-full bg-gradient-to-br from-pink-900 to-pink-700 h-16 
          text-white font-LVRegular tracking-wide text-lg
          mt-12 rounded-full lg:mt-0 lg:text-xl disabled:from-pink-900/50 disabled:to-pink-700/50 disabled:cursor-not-allowed">
            {
              loading ? (
                <>Loading...</>
              ): claimedSupply === totalSupply?.toNumber() ? (
                <>SOLD OUT</>
              ): !address ? (
                <>Sign in to Mint</>
              ): minting ? (
                <>Minting NFT...</>
              ):(
                <span>Mint NFT {priceInOPGoerli} OPGoerli</span>
              )
            }
          </button>
        </div>
  
      </div>
     );
  }
}
 
export default NftPage;