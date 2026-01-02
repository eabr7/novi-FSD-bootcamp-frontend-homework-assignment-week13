import './countryData.css'


function CountryData({
                         imgSource,
                         imgAlt,
                         countryName,
                         countryRegion,
                         countryCapital,
                         countryPopulation,
                         amountCountryNeighbours,
                         countryDomain
                     }) {

    return (

        <>
            <article className="country-data-article">

                <img src={imgSource} alt={imgAlt}/>
                <h2>{countryName}</h2>
                <p>{countryName} is situated in {countryRegion} and the capital is {countryCapital}. It has
                    a population
                    of {countryPopulation}
                    million people and it borders with {amountCountryNeighbours} neighboring countries
                    Websites can be found on {countryDomain} domains</p>

            </article>
        </>

    );
}

export default CountryData;