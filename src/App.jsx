import { useEffect } from "react";
import { fetchDataFromApi } from "./utils/api";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
// import Foter from "./components/footer/Foter";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import Footer from "./components/footer/Footer";

function App() {
  const dispatch = useDispatch();
  // const { url } = useSelector((state) => state.home);
  // console.log(url);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  // const fetchApiConfig = () => {
  //   fetchDataFromApi("/configuration").then((res) => {
  //     // console.log(res);

  //     const url = {
  //       backdrop: res.images.base_url + "original",
  //       poster: res.images.secure_base_url + "original",
  //       profile: res.images.secure_base_url + "original",
  //     };
  //     dispatch(getApiConfiguration(url));
  //   });
  // };

  const fetchApiConfig = async () => {
    const data = await fetchDataFromApi("/configuration");

    const url = {
      backdrop: data.images.base_url + "original",
      poster: data.images.secure_base_url + "original",
      profile: data.images.secure_base_url + "original",
    };
    dispatch(getApiConfiguration(url));
  };

  const genresCall = async () => {
    let promises = [];
    let endPoint = ["tv", "movie"];
    let allGenres = {};

    endPoint.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);

    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:meadiaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
