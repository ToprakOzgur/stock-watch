import React from "react";
import { createContext, useState, useEffect } from "react";

export const WatchListContext = createContext();

export const WatchListContextProvider = (props) => {
  const [watchList, setWatchList] = useState(localStorage.getItem("watchList")?.split(",") || ["GOOGL", "MSFT", "AMZN"]);

  useEffect(() => {
    localStorage.setItem("watchList", watchList);
  }, [watchList]);

  const addStock = (stock) => {
    if (watchList.includes(stock)) return;
    setWatchList([...watchList, stock]);
  };

  const deleteStock = (stock) => {
    setWatchList(
      watchList.filter((el) => {
        return el !== stock;
      })
    );
  };
  return <WatchListContext.Provider value={{ watchList, addStock, deleteStock }}>{props.children}</WatchListContext.Provider>;
};
