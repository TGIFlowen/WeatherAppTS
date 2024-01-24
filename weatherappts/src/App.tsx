import { useState, useEffect } from 'react'
import './App.css'

import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { defaultLocations, locations, LocationData } from './data/locationData';
import styles from './styles/styles.module.css';
import TrieSearch from 'trie-search';
import { ForecastData, Period } from './data/ForecastData'
import HourlyForecastComponent from './HourlyForecastComponent';
import WeeklyForecastComponent from './WeeklyForecastComponent';



const trie: TrieSearch<LocationData> = new TrieSearch<LocationData>('value');
locations.forEach((location) => {
    trie.add(location);
});


const App: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [hourlyPeriodsData, setHourlyPeriodsData] = useState<Period[]>([]);
    const [weeklyPeriodsData, setWeeklyPeriodsData] = useState<Period[]>([]);

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);
    };
    
    const handleChange = async (newValue: SingleValue<LocationData>) => {
        try {
            const response = await fetch(`https://api.weather.gov/points/${newValue?.coord}`);
            const data = await response.json();

            // hourly forecast
            const hourlyResponse = await fetch(data.properties.forecastHourly);
            handleHourlyData(hourlyResponse)

            // 7 day forecast
            const weeklyResponse = await fetch(data.properties.forecast);
            handleWeeklyData(weeklyResponse)


        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const handleHourlyData = async (hourlyResponse: Response) => {
        const hourlyData: ForecastData = await hourlyResponse.json();
        const hourlyPeriods: Period[] = [];

        const loopLimit = 24;

        for (const period of hourlyData.properties.periods) {
            if (hourlyPeriods.length >= loopLimit) {
                break;
            }
            hourlyPeriods.push(period);
        }
        setHourlyPeriodsData(hourlyPeriods);
    };

    const handleWeeklyData = async (weeklyResponse: Response) => {
        const hourlyData: ForecastData = await weeklyResponse.json();
        const weeklyPeriods: Period[] = [];

        for (const period of hourlyData.properties.periods) {
            weeklyPeriods.push(period);
        }
        setWeeklyPeriodsData(weeklyPeriods);
    };

    


    useEffect(() => {
        if (inputValue.trim() !== '') {
            fetchOptions(inputValue);
        }
    }, [inputValue]);


    const fetchOptions = async (searchTerm: string) => {
        return trie.search(searchTerm);
    };

    const loadOptions = (
        inputValue: string,
        callback: (options: LocationData[]) => void
    ) => {
        setTimeout(() => {
            callback(filterLocations(inputValue));
        }, 1000);
    };


    const filterLocations = (inputValue: string) => {
        return trie.search(inputValue);
    };



    return (
        <div>
            <WeeklyForecastComponent key={`w${weeklyPeriodsData.length}`} periods={weeklyPeriodsData} />
            <HourlyForecastComponent key={hourlyPeriodsData.length} periods={hourlyPeriodsData} />
            <AsyncSelect
                className={`basic-single ${styles.searchStyle}`}
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions={defaultLocations}
                onInputChange={handleInputChange}
                onChange={handleChange}
                />
        </div>
    );
};
export default App;