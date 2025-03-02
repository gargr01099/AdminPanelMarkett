import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { MarketProps } from "..";
import { AdminMarketCard } from "../../components/AdminMarketCard";
import Navbar from "../../components/Navbar";
import { useData } from "../../contexts/DataContext";

const Markets: React.FC = () => {
  const { polymarket, account, loadWeb3, loading } = useData();
  const [markets, setMarkets] = useState<MarketProps[]>([]);

  const getMarkets = useCallback(async () => {
    var totalQuestions = await polymarket.methods
      .totalQuestions()
      .call({ from: account });
    var dataArray: MarketProps[] = [];
    for (var i = 0; i < totalQuestions; i++) {
      var data = await polymarket.methods.questions(i).call({ from: account });
      dataArray.push({
        id: data.id,
        title: data.question,
        imageHash: data.creatorImageHash,
        totalAmount: data.totalAmount,
        totalYes: data.totalYesAmount,
        totalNo: data.totalNoAmount,
      });
    }
    setMarkets(dataArray);
  }, [account, polymarket]);

  useEffect(() => {
    loadWeb3().then(() => {
      if (!loading) getMarkets();
    });
  }, [loading]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <Head>
          <title>Soren</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <div className="w-full max-w-5xl m-auto">
          <Link href="/admin">
            <a
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              onClick={() => {}}
            >
              Back
            </a>
          </Link>
        </div>

        <main className="w-full flex flex-row flex-wrap py-4 max-w-5xl pb-6">
          {markets &&
            markets.map((market) => (
              <div key={market.id} className="w-1/2 pr-2">
                <AdminMarketCard
                  id={market.id}
                  imageHash={market.imageHash}
                  title={market.title}
                  totalAmount={market.totalAmount}
                  onYes={async () => {
                    await polymarket.methods
                      .distributeWinningAmount(market.id, true)
                      .send({ from: account });
                  }}
                  onNo={async () => {
                    await polymarket.methods
                      .distributeWinningAmount(market.id, false)
                      .send({ from: account });
                  }}
                />
              </div>
            ))}
        </main>
      </div>
    </>
  );
};

export default Markets;
