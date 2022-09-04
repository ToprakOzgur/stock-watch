import React from "react";
import { useEffect, useState, useContext } from "react";
import finnhub from "../api/finnhub";
import { WatchListContext } from "../context/watchListContext";

export const AutoComplete = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { addStock } = useContext(WatchListContext);
  const renderDropDown = () => {
    const dropDownClass = search ? "show" : null;

    return (
      <ul
        style={{ maxHeight: "500px", width: "100%", overflowY: "scroll", overflowX: "hidden", cursor: "pointer" }}
        className={`dropdown-menu ${dropDownClass}`}
      >
        {results.map((result) => {
          return (
            <li
              onClick={() => {
                addStock(result.symbol);
                setSearch("");
              }}
              className="dropdown-item"
              key={result.symbol}
            >
              {result.description}( {result.symbol})
            </li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        console.log("fetching");
        const response = await finnhub.get("/search", {
          params: {
            q: search,
          },
        });

        if (isMounted) setResults(response.data.result);
      } catch (error) {}
    };

    if (search.length > 0) fetchData();
    else setResults([]);

    return () => (isMounted = false);
  }, [search]);

  return (
    <div className="w-50 p-5 rounded mx-auto">
      <div className="form-floating dropdown">
        <input
          style={{ backgroundColor: "rgba(145,158,171,0.004)" }}
          id="search"
          type="text"
          className="form-control"
          placeholder="Search"
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <label htmlFor="search">Search</label>
        {renderDropDown()}
      </div>
    </div>
  );
};
