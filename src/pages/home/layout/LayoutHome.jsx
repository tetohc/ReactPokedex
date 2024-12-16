import { useEffect, useState } from "react";
import { URL_POKEMON } from "../../../api/ApiRest";
import Header from "../header/Header";
import Card from "../card/Card";
import LayoutStyles from "./Layout.module.scss";
import Axios from "axios";
import * as FaIcons from 'react-icons/fa';

export default function Layout() {
  const [pokemonArray, setPokemonArray] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonSearch, setPokemonSearch] = useState();

  const totalPokemons = 1000; //1302
  const itemsPerPage = 20;
  const totalPages = Math.round(totalPokemons / 20);


  useEffect(() => {
    const pokemonNamesFromApi = async () => {
      const limit = itemsPerPage;
      const pageStartIndex = (currentPage - 1) * limit;
      const response = await Axios.get(`${URL_POKEMON}/?offset=${pageStartIndex}&limit=${limit}`);
      setPokemonArray(response.data.results);
    };
    pokemonNamesFromApi();
    getGlobalPokemons();
  }, [currentPage]);

  const getGlobalPokemons = async () => {
    const response = await Axios.get(`${URL_POKEMON}/?limit=${totalPokemons}`);
    const promises = response.data.results.map((pokemon) => pokemon);
    const results = await Promise.all(promises);
    setGlobalPokemons(results);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (e) => {
    const searchQuery = e.toLowerCase();
    setPokemonSearch(searchQuery);
    setCurrentPage(1);
  };

  const pokemonResults = pokemonSearch
    ? globalPokemons.filter(pokemon => pokemon?.name?.includes(pokemonSearch))
    : pokemonArray;

  return (
    <div className={LayoutStyles.layout}>
      <Header handleSearch={handleSearch} />

      <section className={LayoutStyles.section_pagination}>
        <div className={LayoutStyles.div_pagination}>
          <span className={LayoutStyles.left_item} onClick={handlePreviousPage}>
            <FaIcons.FaAngleLeft />
          </span>
          <span className={LayoutStyles.item}>{currentPage}</span>
          <span className={LayoutStyles.item}>of</span>
          <span className={LayoutStyles.item}>{Math.round(globalPokemons?.length / 20)}</span>
          <span className={LayoutStyles.right_item} onClick={handleNextPage}>
            <FaIcons.FaAngleRight />
          </span>
        </div>
      </section>

      <div className={LayoutStyles.card_container}>
        {pokemonResults.map((data, index) => {
          return <Card key={index} pokemon={data} />;
        })}
      </div>
    </div>
  );
}