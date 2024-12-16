import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Axios from "axios";
import { URL_EVOLUTIONS, URL_POKEMON, URL_SPECIES } from "../../../api/ApiRest";
import CardStyles from './Card.module.scss';

export default function Card({ pokemon }) {

    const POKEMON_ID_POSITION_IN_URL = 6;
    const START_LEGENDARY_SPECIAL_NO_EVOLUTION_ID = 1001;

    const [pokemonData, setPokemonData] = useState([]);
    const [pokemonSpecies, setPokemonSpecies] = useState([]);
    const [pokemonEvolutions, setPokemonEvolutions] = useState([]);

    // useEffect to fetch Pokémon data 
    useEffect(() => {
        const pokemonDataFromApi = async () => {
            const response = await Axios.get(`${URL_POKEMON}/${pokemon.name}`);
            setPokemonData(response.data);
        }
        pokemonDataFromApi();
    }, [pokemon.name]);

    // useEffect to fetch Pokémon species data 
    useEffect(() => {
        const pokemonSpeciesFromApi = async () => {
            const pokemonId = pokemon.url.split('/')[POKEMON_ID_POSITION_IN_URL];
            if (pokemonId < START_LEGENDARY_SPECIAL_NO_EVOLUTION_ID) {
                const response = await Axios.get(`${URL_SPECIES}/${pokemonId}`);
                setPokemonSpecies({
                    url_evolution: response?.data?.evolution_chain,
                    data: response?.data
                });
            }
        }
        pokemonSpeciesFromApi();
    }, [pokemon.url]);

    // useEffect to fetch the evolution data of the Pokémon
    useEffect(() => {
        async function getPokemonImageById(id) {
            const response = await Axios.get(`${URL_POKEMON}/${id}`);
            return response.data?.sprites?.other['official-artwork']?.front_default;
        }

        if (pokemonSpecies?.url_evolution) {
            const pokemonEvolutionsFromApi = async () => {
                const basePokemonId = pokemonSpecies?.url_evolution?.url?.split('/')[POKEMON_ID_POSITION_IN_URL];
                const response = await Axios.get(`${URL_EVOLUTIONS}/${basePokemonId}`);
                const evolutionsArray = [];

                const firstEvolutionId = response?.data?.chain?.species?.url?.split("/")[POKEMON_ID_POSITION_IN_URL];
                if (firstEvolutionId) {
                    const firstEvolutionImage = await getPokemonImageById(firstEvolutionId);
                    evolutionsArray.push({
                        img: firstEvolutionImage,
                        name: response?.data?.chain?.species?.name
                    });
                }

                if (response?.data?.chain?.evolves_to?.length !== 0) {
                    const secondEvolutionData = response?.data?.chain?.evolves_to[0]?.species;
                    if (secondEvolutionData) {
                        const secondEvolutionId = secondEvolutionData?.url?.split("/")[POKEMON_ID_POSITION_IN_URL];
                        const secondEvolutionImage = await getPokemonImageById(secondEvolutionId);
                        evolutionsArray.push({
                            img: secondEvolutionImage,
                            name: secondEvolutionData?.name
                        });
                    }
                }

                if (response?.data?.chain?.evolves_to[0]?.evolves_to?.length !== 0) {
                    const thirdEvolutionData = response?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
                    if (thirdEvolutionData) {
                        const thirdEvolutionId = thirdEvolutionData?.url?.split("/")[POKEMON_ID_POSITION_IN_URL];
                        const thirdEvolutionImage = await getPokemonImageById(thirdEvolutionId);
                        evolutionsArray.push({
                            img: thirdEvolutionImage,
                            name: thirdEvolutionData?.name
                        });
                    }
                }
                setPokemonEvolutions(evolutionsArray);
            }
            pokemonEvolutionsFromApi();
        }
    }, [pokemonSpecies]);

    let pokemonId = pokemonData?.id?.toString()?.padStart(3, '0');

    return (
        <div className={CardStyles.card}>
            <img className={CardStyles.img_pokemon} src={pokemonData?.sprites?.other["official-artwork"]?.front_default} alt="" />
            <div className={`${CardStyles.sub_card} bg-${pokemonSpecies?.data?.color?.name}`}>
                <strong className={CardStyles.id_pokemon}>#{pokemonId}</strong>
                <strong className={CardStyles.name_pokemon}>{pokemonData?.name}</strong>
                <h4 className={CardStyles.height_pokemon}>Height: {pokemonData?.height} <span>cm</span></h4>
                <h4 className={CardStyles.weight_pokemon}>Weight: {pokemonData?.weight} <span>kg</span></h4>
                <h4 className={CardStyles.habitat_pokemon}>Habitat: {pokemonSpecies?.data?.habitat?.name}</h4>

                <div className={CardStyles.div_stats}>
                    {pokemonData?.stats?.map((data, index) => {
                        return (
                            <h6 key={index} className={CardStyles.container_stats}>
                                <span className={CardStyles.name_stat}> {data?.stat?.name} </span>
                                <progress value={data?.base_stat} max={110}></progress>
                                <span className={CardStyles.base_stat}> {data?.base_stat} </span>
                            </h6>
                        );
                    })}
                </div>

                <div className={CardStyles.container_types}>
                    {pokemonData?.types?.map((data, index) => {
                        return (
                            <h6 key={index} className={`color-${data.type.name} ${CardStyles.type_name}`}>{data?.type?.name}</h6>
                        );
                    })}
                </div>

                <div className={CardStyles.div_evolutions}>
                    {pokemonEvolutions.map((data, index) => {
                        return (
                            <div key={index} className={CardStyles.container_evolutions}>
                                <img src={data.img} alt="evolutions image" className={CardStyles.img_evolution} />
                                <h6>{data.name}</h6>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

Card.propTypes = {
    pokemon: PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }).isRequired,
};