import { useState, useEffect } from 'react'
import axios from 'axios'
import Weather from './components/Weather'

const CountryDetails = ({ country }) => {
  const capital = country.capital?.[0]

  return(
  <div>
    <h1>{country.name.common}</h1>
    <div>Capital {country.capital?.[0]}</div>
    <div>Area {country.area}</div>

    <h2>Languages</h2>
    <ul>
      {Object.values(country.languages ?? {}).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>

    <img
      src={country.flags.png}
      alt={`Flag of ${country.name.common}`}
      width="200"
    />

    {capital && <Weather capital={capital}/>}
  </div>
)
}

const CountryList = ({ countries, onShow }) => (
  <div>
    {countries.map(c => (
      <div key={c.cca3}>
        {c.name.common}{' '}
        <button onClick={() => onShow(c.name.common)}>Show</button>
      </div>
    ))}
  </div>
)

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setCountries(res.data))
  }, [])

  const handleChange = (event) => setValue(event.target.value)

  const handleShow = (countryName) => {
    setValue(countryName)
  }

  const query = value.trim().toLowerCase()
  const matches =
    query === ''
      ? []
      : countries.filter(c =>
          c.name.common.toLowerCase().includes(query)
        )

  return (
    <div>
      find countries <input value={value} onChange={handleChange} />

      {query !== '' && matches.length > 10 && (
        <div>Too many matches, specify another filter</div>
      )}

      {matches.length >= 2 && matches.length <= 10 && (
        <CountryList countries={matches} onShow={handleShow} />
      )}

      {matches.length === 1 && <CountryDetails country={matches[0]} />}

      {query !== '' && matches.length === 0 && <div>No matches</div>}
    </div>
  )
}

export default App
