import testData from '../assets/testData.json';
import Event from '../interfaces/Event';

class EventService {
    getCurrentFeaturedEvents(separator: number, maxEvents: number): Array<Array<Event>> {
        // TODO:  Add call to back-end to fetch events based on criteria
        // This criteria could be the number of tickets sold in the past week, for example
        const fetchedData = testData;
        let events = [];
        let separatorCtr = 0;
        let accumulator = [];
        for (let i = 0; i < maxEvents; i++) {
            accumulator.push(fetchedData[i] as any);
            separatorCtr++;
            if (separatorCtr % separator === 0) {
                events.push(accumulator);
                accumulator = [];
                separatorCtr = 0;
            }
        }
        return events;
    }
    getNearbyEvents(separator: number, maxEvents: number, zipcode: string): Array<Array<Event>> {
        // TODO:  Add call to back-end to fetch events based on location
        const fetchedData = testData;
        let events = [];
        let separatorCtr = 0;
        let accumulator = [];
        for (let i = 0; i < maxEvents; i++) {
            accumulator.push(fetchedData[i] as any);
            separatorCtr++;
            if (separatorCtr % separator === 0) {
                events.push(accumulator);
                accumulator = [];
                separatorCtr = 0;
            }
        }
        return events;
    }
}

export default new EventService();