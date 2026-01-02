import './App.css';
import axios from 'axios';
import {useState} from "react";
import {getRegion} from "./helpers/region.js";
import worldMap from './assets/world_map.png';


function App() {

    const [countriesInfo, setCountriesInfo] = useState([]);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    // get request example:
    async function fetchCountriesInfo() {
        try {
            toggleLoading(true);
            toggleError(false);
            const response = await axios.get('https://restcountries.com/v3.1/all', {
                params: {
                    fields: 'name,flags,population,region',
                },
            });

            // spread operator gebruiken ...response.data omdat sort() de originele array anders aanpast!
            // Alles wat muteert, altijd eerst kopiëren met spread operator!
            const sortedCountries = [...response.data].sort((a, b) => a.population - b.population);
            console.log(response.data[0]);
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
            <h1>COUNTRIES</h1>

            <img src={worldMap} alt="Wereldkaart"/>

            {countriesInfo.length === 0 && <button type="button" onClick={fetchCountriesInfo} disabled={loading}>
                    Haal informatie op
            </button>}

            {error && <p className="error-message">Er is iets misgegaan met de data ophalen. Probeer het opnieuw.</p>}

            {/* mappen over countriesInfo, vergeet niet om een key te gebruiken in het element! ivm DOM */}
            {/* Gebruik className van element voor het veranderen van de CSS!  */}
            {countriesInfo.length > 0 ?
            (<ul>
                {countriesInfo.map((country) => {
                return <li key={country.name.common} className="countries">
                        <p className={getRegion(country.region)}>{country.name.official}</p>
                        <img src={country.flags.png} alt={country.flags.alt}/>
                        <p className="country-population">Has a population of {country.population} people</p>
                        <p>{country.region}</p>
                    </li>})}
            </ul>) : (<p>Druk op de knop om de informatie op te halen</p>) }

        </>
    )
}

export default App
