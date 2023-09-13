"use client";
import { useContext, useEffect, useState, useRef } from "react";
import { DataFeed } from "@/utils/Types/PriceFeedTypes";
import { PriceContext } from "@/context/PriceContext";
import { formatPrice } from "@/utils/HelperFunctions/FormatPrice";
import { ScaleLoader, PropagateLoader } from "react-spinners";
import { currentPrice } from "@/utils/HelperFunctions/CurrentPrice";
import Image from "next/image";
import DetailedInfo from "@/components/Coins/DetailedInfo";
import ChartComponent from "@/components/ChartComponent";

export default function PriceTableData() {
  const { coinPriceFeeds, setSelectedRow, selectedRow, isLoading, isPercentageLoading } = useContext(PriceContext);
  const [imgSuffixes, setImgSuffixes] = useState<Record<string, string>>({});

  const handleRowClick = (symbol: string) => {
    setSelectedRow(selectedRow === symbol ? "" : symbol);
  };

  const handleError = (asset: string) => {
    // If the suffix is already '.avif', don't set it again
    if (imgSuffixes[asset] !== ".avif") {
      setImgSuffixes((prevState) => ({ ...prevState, [asset]: ".avif" }));
    }
  };

  const getData = (priceFeed: DataFeed) => {
    let pricesCopy = [...priceFeed.prices];

    // for (let i = 0; i < pricesCopy.length - 1; i++) {
    //   if (pricesCopy[i].blockTimestamp === pricesCopy[i + 1].blockTimestamp) {
    //     if (parseInt(pricesCopy[i].roundId) > parseInt(pricesCopy[i + 1].roundId)) {
    //       pricesCopy[i].blockTimestamp = (parseInt(pricesCopy[i].blockTimestamp) + 1).toString();
    //     } else {
    //       pricesCopy[i + 1].blockTimestamp = (parseInt(pricesCopy[i + 1].blockTimestamp) + 1).toString();
    //     }
    //   }
    // }
    // // Sort the data by the timestamp in ascending order
    // pricesCopy.sort((a, b) => parseInt(a.blockTimestamp) - parseInt(b.blockTimestamp));

    const data = pricesCopy.map((priceData) => {
      return {
        round: parseInt(priceData.roundId),
        value: parseInt(priceData.price),
      };
    });
    return data;
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <PropagateLoader />
        </div>
      ) : (
        Object.entries(coinPriceFeeds).map(([symbol, priceFeed]) => (
          <div key={symbol}>
            <div className="flex items-center justify-center mt-4">
              <div className="flex justify-start w-3/12 md:w-2/12 lg:w-1/12 items-center gap-x-7">
                <div className="lg:hidden rounded-full overflow-hidden">
                  <Image
                    src={`/icons/${priceFeed.asset.toLowerCase()}${imgSuffixes[priceFeed.asset] || ".svg"}`}
                    alt={symbol}
                    width={25}
                    height={25}
                    onError={() => handleError(priceFeed.asset)}
                  />
                </div>
                <div className="hidden lg:block rounded-full overflow-hidden">
                  <Image
                    src={`/icons/${priceFeed.asset.toLowerCase()}${imgSuffixes[priceFeed.asset] || ".svg"}`}
                    alt={symbol}
                    width={30}
                    height={30}
                    onError={() => handleError(priceFeed.asset)}
                  />
                </div>

                <button
                  onClick={handleRowClick.bind(null, symbol)}
                  className="flex justify-start w-3/12 hover:text-sky-500 transition-colors duration-500 md:text-lg lg:text-xl"
                >
                  <div className="flex gap-3 lg:gap-5 items-baseline">
                    <span className="font-semibold text-md md:text-lg lg:text-xl">{symbol.split("/")[0]}</span>
                  </div>
                </button>
              </div>
              <div
                className={`flex justify-end w-3/12 lg:w-3/12 font-semibold text-sm md:text-lg lg:text-xl ${
                  priceFeed && !isPercentageLoading
                    ? priceFeed.percentage24h
                      ? priceFeed.percentage24h < 0
                        ? "text-red-400 transition-colors duration-[5000ms]"
                        : priceFeed.percentage24h > 0
                        ? "text-green-400 transition-colors duration-[5000ms]"
                        : "text-sky-300"
                      : "text-sky-300"
                    : "text-sky-300"
                }`}
              >
                {priceFeed && !isLoading && !isNaN(parseFloat(currentPrice(priceFeed).toString())) ? (
                  parseFloat(currentPrice(priceFeed).toString()) < 1 ? (
                    `$${formatPrice(currentPrice(priceFeed), 5)}`
                  ) : (
                    `$${formatPrice(currentPrice(priceFeed), 2)}`
                  )
                ) : (
                  <ScaleLoader height={25} width={2} loading={true} color={"rgb(125 211 252)"} />
                )}
              </div>
              <div
                className={`flex justify-end w-2/12 lg:w-1/12 font-semibold text-sm md:text-lg lg:text-xl ${
                  priceFeed && !isPercentageLoading
                    ? priceFeed.percentage24h
                      ? priceFeed.percentage24h < 0
                        ? "text-red-400 transition-colors duration-[5000ms]"
                        : priceFeed.percentage24h > 0
                        ? "text-green-400 transition-colors duration-[5000ms]"
                        : "text-sky-300"
                      : "text-sky-300"
                    : "text-sky-300"
                }`}
              >
                {isPercentageLoading ? (
                  <ScaleLoader height={25} width={2} loading={true} color={"rgb(125 211 252)"} />
                ) : priceFeed && priceFeed.percentage24h ? (
                  `${formatPrice(priceFeed.percentage24h, 1)}%`
                ) : (
                  "-"
                )}
              </div>
              <div
                className={`hidden lg:flex justify-end lg:w-1/12 font-semibold text-sm lg:text-xl ${
                  priceFeed && !isPercentageLoading
                    ? priceFeed.percentage7d
                      ? priceFeed.percentage7d < 0
                        ? "text-red-400 transition-colors duration-[5000ms]"
                        : priceFeed.percentage7d > 0
                        ? "text-green-400 transition-colors duration-[5000ms]"
                        : "text-sky-300"
                      : "text-sky-300"
                    : "text-sky-300"
                }`}
              >
                {isPercentageLoading ? (
                  <ScaleLoader height={25} width={2} loading={true} color={"rgb(125 211 252)"} />
                ) : priceFeed && priceFeed.percentage7d ? (
                  `${formatPrice(priceFeed.percentage7d, 1)}%`
                ) : (
                  "-"
                )}
              </div>
              <div className="flex justify-end w-3/12 lg:w-2/12">
                {isPercentageLoading ? (
                  <ScaleLoader height={25} width={2} loading={true} color={"rgb(125 211 252)"} />
                ) : (
                  <ChartComponent data={getData(priceFeed)} />
                )}
              </div>
            </div>
            {selectedRow === symbol && <DetailedInfo />}
          </div>
        ))
      )}
    </div>
  );
}
