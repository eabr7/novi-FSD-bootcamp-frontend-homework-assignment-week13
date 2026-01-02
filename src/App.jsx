import './App.css';
import axios from 'axios';
import {useState} from "react";
import {getRegion} from "./helpers/region.js";
import worldMap from './assets/world_map.png';
import CountryData from "./components/countryData/countryData.jsx";
import {toMillions} from "./helpers/toMillion.js";
import {useForm} from 'react-hook-form';


function App() {

    // opdracht 1 State
    const [countriesInfo, setCountriesInfo] = useState([]);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    // opdracht 2 State
    const [oneCountryInfo, setOneCountryInfo] = useState(null);
    const [errorOneCountry, setErrorOneCountry] = useState('');
    const [loadingOneCountry, toggleLoadingOneCountry] = useState(false);

    // React Hook Form
    const {register, handleSubmit, reset} = useForm({
        defaultValues: {query: ''},
    });


    // get request One country data:
    async function fetchOneCountryData(formData) {
        const query = formData.query.trim();
        if (!query) return;

        try {
            toggleLoadingOneCountry(true);
            setErrorOneCountry('');
            setOneCountryInfo(null);
            const oneCountryResponse = await axios.get(
                `https://restcountries.com/v3.1/name/${query}`,
                {
                    params: {
                        fields: 'name,flags,subregion,capital,population,borders,tld',
                    },
                }
            );
            console.log(oneCountryResponse.data[0]);
            setOneCountryInfo(oneCountryResponse.data[0]);
            reset();
        } catch (error) {
            console.log(error);
            setErrorOneCountry(`${query} bestaat niet. Probeer het opnieuw.`);
        } finally {
            toggleLoadingOneCountry(false);
        }
    }

    // get request all countries data:
    async function fetchCountriesInfo() {
        try {
            toggleLoading(true);
            toggleError(false);
            const allCountriesResponse = await axios.get('https://restcountries.com/v3.1/all', {
                params: {
                    fields: 'name,flags,population,region',
                },
            });

            // spread operator gebruiken ...response.data omdat sort() de originele array anders aanpast!
            // Alles wat muteert, altijd eerst kopiëren met spread operator!
            const sortedCountries = [...allCountriesResponse.data].sort((a, b) => a.population - b.population);
            console.log(allCountriesResponse.data[0]);
            setCountriesInfo(sortedCountries);
        } catch (error) {
            console.error(error);
            toggleError(true);
        } finally {
            toggleLoading(false);
        }
    }

    return (
        <>
            <header>
                <h1>COUNTRIES</h1>

                <img src={worldMap} alt="Wereldkaart"/>
            </header>

            <main>
                <section>
                    <form onSubmit={handleSubmit(fetchOneCountryData)}>
                        <label htmlFor="query-field">
                            Zoek een land:
                            <input
                                id="query-field"
                                type="text"
                                placeholder="Bijv. Netherlands"
                                {...register('query')}
                            />
                        </label>

                        <button type="submit" disabled={loadingOneCountry}>
                            Zoek
                        </button>
                    </form>

                    {errorOneCountry && <p className="error-message">{errorOneCountry}</p>}

                    {oneCountryInfo && (<CountryData

                        imgSource={oneCountryInfo.flags.png}
                        imgAlt={oneCountryInfo.flags.alt}
                        countryName={oneCountryInfo.name.common}
                        countryRegion={oneCountryInfo.subregion}
                        countryCapital={oneCountryInfo.capital?.[0]}
                        countryPopulation={toMillions(oneCountryInfo.population)}
                        amountCountryNeighbours={oneCountryInfo.borders?.length || 0}
                        countryDomain={oneCountryInfo.tld?.[0]}

                    />)}

                </section>


                <section>
                    {countriesInfo.length === 0 &&
                        <button type="button" onClick={fetchCountriesInfo} disabled={loading}>
                            Haal informatie op
                        </button>}

                    {error &&
                        <p className="error-message">Er is iets misgegaan met de data ophalen. Probeer het opnieuw.</p>}

                    {/* mappen over countriesInfo, vergeet niet om een key te gebruiken in het element! ivm DOM */}
                    {/* Gebruik className van element voor het veranderen van de CSS!  */}
                    {countriesInfo.length > 0 ?
                        (<ul>
                            {countriesInfo.map((country) => {
                                return <li key={country.name.common} className="countries">
                                    <p className={getRegion(country.region)}>{country.name.official}</p>
                                    <img src={country.flags.png} alt={country.flags.alt}/>
                                    <p className="country-population">Has a population
                                        of {country.population} people</p>
                                    <p>{country.region}</p>
                                </li>
                            })}
                        </ul>) : (<p>Druk op de knop om de informatie op te halen</p>)}

                </section>
            </main>
        </>
    );


}


export default App
