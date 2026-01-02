import './App.css';
import axios from 'axios';
import {useState} from "react";


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
            console.log(response.data[0]);
            console.log(response.data);
            setCountriesInfo(response.data);
        } catch (error) {
            console.error(error);
            toggleError(true);
        } finally {
            toggleLoading(false);
        }
    }

    return (
        <>
            Opdracht week 13!

            {countriesInfo.length === 0 && <button type="button" onClick={fetchCountriesInfo} disabled={loading}>
                    Haal informatie op
            </button>}

            {error && <p className="error-message">Er is iets misgegaan met de data ophalen. Probeer het opnieuw.</p>}

            {countriesInfo.length > 0 ?
            (<ul>
                {countriesInfo.map((country) => {
                return <li key={country.name.common}>
                        <img src={country.flags.png} alt={`Flag of ${country.name.official}`}/>
                        <p>Has a population of {country.population} people</p>
                        <p>{country.region}</p>
                    </li>})}
            </ul>) : (<p>Druk op de knop om de informatie op te halen</p>) }

        </>
    )
}

export default App
