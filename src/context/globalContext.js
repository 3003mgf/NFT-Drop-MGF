'use client'

import {createContext, useState} from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({children}) =>{
  const [collectionState, setCollectionState] = useState([]);
  const [nftModal, setNftModal] = useState(false);

  const data = {
    collectionState,
    setCollectionState,
    nftModal,
    setNftModal
  };

  return <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
}