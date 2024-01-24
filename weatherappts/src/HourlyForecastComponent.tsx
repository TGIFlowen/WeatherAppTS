import React, { useState, useEffect } from 'react';
import { Period } from './data/ForecastData'

import styles from './styles/styles.module.css';

interface Childprops {
    periods: Period[];
}

const GetDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        hour12: true,
    });
    return timeString;
}

const HourlyForecastComponent: React.FC<Childprops> = ({ periods }) => {
    const [retryCount, setRetryCount] = useState(0);

    const handleImageError = async (index: number) => {
        const maxRetries = 5;
        await new Promise(resolve => setTimeout(resolve, 200));

        if (retryCount < maxRetries) {
            setRetryCount(retryCount + 1);

            const imgElement = document.getElementById(`icon${index}`) as HTMLImageElement;
            if (imgElement) {
                imgElement.src = periods[index].icon;
            }
        } else {
            console.error(`Image not currently availabe: ${periods[index].icon}`);
        }
    };

    useEffect(() => {
        setRetryCount(0);
    }, [periods]);

    return (
        <div>
            {periods.length === 0 ? (
                <p/>
            ) : (
                    <div>
                        <h3>Hourly Forecast</h3>
                        <div className={styles.hourlyForecastOuterStyle}>
                            {periods.map((period, index) => (
                                <div className={styles.hourlyForecastInnerStyle} key={index}>
                                    {`${GetDate(period.startTime)}`}
                                    <br/>
                                    <img key={`icon${index}`} src={period.icon} title={period.shortForecast} alt={period.shortForecast} onError={() => handleImageError(index)} />
                                    <br/>
                                    {`${period.temperature}`}&#176;{`${period.temperatureUnit}`}
                                </div>
                        ))}
                        </div>
                    </div>
            )}
        </div>
    );
};
export default HourlyForecastComponent;