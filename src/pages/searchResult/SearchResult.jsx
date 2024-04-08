import React from "react";
import "./style.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import noResult from "../../assets/no-results.png";
import Spinner from "../../components/spinner/Spinner";
import MovieCard from "../../components/movieCards/MovieCard";

function SearchResult() {
  const [data, setData] = useState(null);
  // console.log(data);

  const [pageNum, setPageNum] = useState(1);

  const [loading, setLoading] = useState(false);
  const { query } = useParams();
  // console.log(data);

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query]);

  const fetchInitialData = async () => {
    setLoading(true);
    const res = await fetchDataFromApi(
      `/search/multi?query=${query}&${pageNum}`
    );
    setData(res);
    setPageNum((Prev) => Prev + 1);
    setLoading(false);
  };

  const fetchNextPageData = async () => {
    setPageNum((prev) => prev + 1);
    const res = await fetchDataFromApi(
      `/search/multi?query=${query}&${pageNum}`
    );

    if (data?.results) {
      setData({
        ...data,
        results: [...data.results, ...res.results],
      });
    } else {
      setData(res);
    }
  };

  // console.log(data?.total_pages);
  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${
                  data?.total_results > 1 ? "results" : "result"
                } of '${query}'`}
              </div>

              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results.map((item, index) => {
                  if (item?.media_Type === "person") return;
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">Sorry, Result Not Found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
}

export default SearchResult;
