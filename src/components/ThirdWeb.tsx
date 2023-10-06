'use client'
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { OptimismGoerli } from "@thirdweb-dev/chains";
import { ReactNode, useContext } from 'react';
import { Collection } from '../../typings';
import { GlobalContext } from '@/context/globalContext';

type Props = {
  children: ReactNode,
  collections: Collection[]
}

// NOTE: Rinkeby is Ethereum test money

const ThirdWeb = ({children, collections}: Props) => {

  const globalContext = useContext(GlobalContext);
  const { setCollectionState, collectionState } = globalContext;

  if(collections){
    setCollectionState(collections);    
  }

  if(collectionState.length){
    return (
      <ThirdwebProvider activeChain={OptimismGoerli} clientId={process.env.THIRD_WEB_CLIENT_ID}>
          {children}  
      </ThirdwebProvider>
    )
  }
}
 
export default ThirdWeb;