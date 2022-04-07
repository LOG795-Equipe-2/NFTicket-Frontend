import testData from '../assets/testData.json';
import Event, { EventModel } from '../interfaces/Event';
import AuthService from './AuthService';
import { Styling, TicketCategoryModel } from "../interfaces/TicketCategory";
import { AppwriteException, Models, Query } from "appwrite";

import appwrite from "../utils/AppwriteInstance"
import { id } from 'date-fns/locale';

type TicketCategoryStyleModel = Styling & Models.Document;

class EventService {

    private readonly EVENTS_COLLECTION_ID: string = "62210e0672c9be723f8b";
    private readonly TICKET_CATEGORY_STYLE_COLLECTION_ID: string = "622112b4efbb25929545";
    private readonly TICKET_CATEGORIES_COLLECTION_ID: string = "622111bde1ca95a94544";
    private readonly TICKET_COLLECTION_ID: string = "6221134c389c90325a38";

    constructor(private urlApi: string) { }

    async getCurrentFeaturedEvents(separator: number, maxEvents: number, city: string): Promise<Event[][]> {


        const fetchedEventModels = await (await fetch(this.urlApi + '/appwrite/events/featured?city=' + city)).json() as EventModel[];
        const formattedEvents: Event[] = await Promise.all(fetchedEventModels.map(async (e) => {
            const img = await appwrite.storage.getFileView(e.imageId);
            return {
                id: e.$id,
                locationName: e.locationName,
                locationAddress: e.locationAddress,
                locationCity: e.locationCity,
                name: e.name,
                description: e.description,
                image: img.href,
                ticketCategories: [],
                dateTime: new Date(e.eventTime),
                collName: e.atomicCollName
            } as Event;
        }))
        


        // TODO:  Add call to back-end to fetch events based on criteria
        // This criteria could be the number of tickets sold in the past week, for example
        let events: Event[][] = [];
        let separatorCtr = 0;
        let accumulator = [];
        for (let i = 0; i < formattedEvents.length; i++) {
            accumulator.push(formattedEvents[i] as any);
            separatorCtr++;
            if (separatorCtr % separator === 0) {
                events.push(accumulator);
                accumulator = [];
                separatorCtr = 0;
            }
        }
        console.log(events)
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

    async getMyEvents(){
        let events = await appwrite.database.listDocuments('62210e0672c9be723f8b');
        events.documents.forEach(async (document: any) => {
            const image = await appwrite.storage.getFileView(document.imageId);
            document.image = image.href;
        })
        return events;
    }

    async getTicketCategoriesForEvent(eventId: string) {
        let ticketCategories = await appwrite.database.listDocuments(this.TICKET_CATEGORIES_COLLECTION_ID, [
            Query.equal('eventId', eventId)
        ], 100);
        const documents = await Promise.all(ticketCategories.documents.map(async (category) => {
            let style = await appwrite.database.getDocument(this.TICKET_CATEGORY_STYLE_COLLECTION_ID,
                (category as any).stylingId
            );
            (category as any).styling = style;
            return category;

        }));
        return documents
    }

    /**
     * Creates a new event in Appwrite //TODO check if we need to do blockchain operations (and call backend endpoints) 
     * @param event event Data
     * @returns true if the operation succedded, false otherwise
     */
    async createNewEvent(event: Event): Promise<boolean> {
        if(!AuthService.account) //TODO check that other fields are not missing (after demo)
            return false;

        try {

            // upload the event's image
            let f = new File([event.image], event.name);
            let imageFile = await appwrite.storage.createFile('unique()', f);

            // Create the Event document
            const eventData = {
                locationName: event.locationName,
                locationAddress: event.locationAddress,
                locationCity: "testCity", // event.locationCity //TODO change when we have a better implementation
                name: event.name,
                description: event.description,
                imageId: imageFile.$id,
                userCreatorId: AuthService.account.$id as string,
                eventTime: "0", //TODO ask for event time when creating new events
                atomicCollName: event.collName
            };

            const eventDoc = await appwrite.database.createDocument<EventModel>(this.EVENTS_COLLECTION_ID, 'unique()', eventData);

            // For each ticket category, create a new document
            event.ticketCategories.forEach(async c => {
                // create the document for the ticket's style
                const styleDoc = await appwrite.database.createDocument<TicketCategoryStyleModel>(this.TICKET_CATEGORY_STYLE_COLLECTION_ID, 'unique()', c.styling);
                
                const ticketCategory = {
                    name: c.type,
                    price: c.price,
                    stylingId: styleDoc.$id,
                    eventId: eventDoc.$id,
                    initialQuantity: c.initialAmount,
                    remainingQuantity: c.initialAmount,
                    atomicTemplateId: c.atomicTemplateId
                };

                let response = await appwrite.database.createDocument<TicketCategoryModel>(this.TICKET_CATEGORIES_COLLECTION_ID, 'unique()', ticketCategory);
                let categoryId = response.$id

                // Create each tickets depending on the initial amount
                for(let i = 1; i <= c.initialAmount; i++) {
                    const ticket = {
                        ticketNumber: i,
                        categoryId: categoryId,
                        eventId: eventDoc.$id
                    }
                    await appwrite.database.createDocument(this.TICKET_COLLECTION_ID, 'unique()', ticket);
                }
            })
        } catch (e) {
            console.log("Error while creating new event. - " + (e as AppwriteException).message);
            return false;
        }

        return true;
    }
}

export default new EventService(process.env.REACT_APP_BACKEND_URL || "http://localhost:3000");