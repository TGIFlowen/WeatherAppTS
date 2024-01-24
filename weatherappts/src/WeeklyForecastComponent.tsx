import React, { useState, useEffect } from 'react';
import { Period } from './data/ForecastData'

import styles from './styles/styles.module.css';

interface ChildProps {
    periods: Period[];
}

const WeeklyForecastComponent: React.FC<ChildProps> = ({ periods }) => {
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
                <p>Enter a location to get forecast data!</p>
            ) : (
                    <div>
                    <h3>Weekly Forecast</h3>
                    <div className={styles.weeklyForecastOuterStyle}>
                        {periods.map((period, index) => (
                            <div className={styles.weeklyForecastInnerStyle} key={index}>
                                {`${period.name}`}
                                <br />
                                <img key={`icon${index}`} src={period.icon} title={period.detailedForecast} alt={period.shortForecast} onError={() => handleImageError(index)} />
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
export default WeeklyForecastComponent;


//const [retryCount, setRetryCount] = useState(0);

//const handleImageError = () => {
//    const maxRetries = 3;

//    if (retryCount < maxRetries) {
//        setRetryCount(retryCount + 1);

//        // Reload the image
//        const imgElement = document.getElementById(`weatherIcon${index}`) as HTMLImageElement;
//        if (imgElement) {
//            imgElement.src = period.icon;
//        }
//    } else {
//        // If max retries reached, you can handle it accordingly (e.g., show a placeholder)
//        console.error(`Failed to load image after ${maxRetries} retries.`);
//    }
//};