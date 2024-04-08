import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux";
import "./style.scss";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

function HeroBanner() {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const { url } = useSelector((state) => state.home);

  const { data, loading } = useFetch("/movie/upcoming");
  // console.log(data);
  const navigate = useNavigate();

  useEffect(() => {
    const bg =
      url?.backdrop +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;

    setBackground(bg);
  }, [data]);

  const inputFocus = useRef(null);
  useEffect(() => {
    inputFocus.current.focus();
  }, []);

  // console.log({ data: data?.results[8] });

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const OnclickSearchQueryHandler = () => {
    if (query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img src={background} className="bgImg" />
        </div>
      )}

      <div className="opacity_layer"></div>
      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome.</span>
          <span className="subTitle">
            Millions of movies, TV shows and people to discover. Explore now.
          </span>
          <div className="searchInput">
            <input
              ref={inputFocus}
              type="text"
              placeholder="Search for a movie or tv show..."
              onKeyUp={searchQueryHandler}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={() => OnclickSearchQueryHandler()}>Search</button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}

export default HeroBanner;

// axios.get("https://api.themoviedb.org/3/movie/movie_id?language=en-US", {
//   Headers: {},
// });
