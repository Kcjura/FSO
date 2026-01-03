import { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
    const [weather, setWeather] = useState(null)

    const apiKey = import.meta.env.VITE_OWM_KEY

    useEffect(() => {
        if (!capital || !apiKey) return

        const url = 'https://api.openweathermap.org/data/2.5/weather'

        axios
        .get (url, {
            params: {
                q: capital,
                appid: apiKey,
                units: 'metric',
            },
        })
        .then((res) => {
            setWeather(res.data)
        })
        .catch(() => {
            setWeather(null)
        })
    }, [capital, apiKey])

    if(!apiKey) {
        return <div>Weather API key missing (VITE_OMW_KEY)</div>
    }

    if(!weather) {
        return <div>Loading weather...</div>
    }

    const icon = weather.weather?.[0]?.icon
    const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : null
    
    return(
        <div>
            <h2>Weather in {capital}</h2>
            <div>Temperature {weather.main.temp} °C</div> 
            {iconUrl && <img src={iconUrl} alt="weather icon"/>}
            <div>Wind {weather.wind.speed} m/s</div>
        </div>
    )   
}

export default Weather
