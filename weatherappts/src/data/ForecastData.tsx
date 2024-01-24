export interface ForecastData {
    properties:
    {
        updated: string,
        units: string,
        forecasegenerator: string,
        generatedat: string,
        updatetime: string,
        validtimes: string,
        periods: Period[]
    }
}

export interface Period {
    number: number,
    name: string,
    startTime: string,
    endTime: string,
    temperature: number,
    temperatureUnit: string,
    probabilityOfPercipitation: {
        unitcode: string,
        value: number,
    },
    relativeHumidity: {
        unitcode: string,
        value: number,
    },
    windSpeed: string,
    windDirection: string,
    icon: string,
    shortForecast: string,
    detailedForecast: string,

}