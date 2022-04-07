import testData from '../assets/testData.json';
import Event, { EventModel } from '../interfaces/Event';
import AuthService from './AuthService';
import { Styling, TicketCategoryModel } from "../interfaces/TicketCategory";
import { AppwriteException, Models, Query } from "appwrite";

import appwrite from "../utils/AppwriteInstance"

type TicketCategoryStyleModel = Styling & Models.Document;

class BouncerService {

    constructor(private urlApi: string) {}

    async getBouncers(eventId: string): Promise<any> {
        const res = await fetch(this.urlApi + `/bouncer/${eventId}/listBouncers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...await AuthService.createJwtHeader()
            }
        });
        
        return res.json();
    }

    async createBouncers(eventId: string, amount: number) {
        const res = await fetch(this.urlApi + `/bouncer/${eventId}/createBouncers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...await AuthService.createJwtHeader()
            },
            body: JSON.stringify({ amount })
        });
        
        return res.json();
    }

    async deleteBouncer(eventId: string, bouncer: string) {
        const res = await fetch(this.urlApi + `/bouncer/${eventId}/deleteBouncer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...await AuthService.createJwtHeader()
            },
            body: JSON.stringify({ bouncer })
        });
        
        return res.json();
    }

    async validateBouncerUrl(eventId: string, bouncer: string) {
        const res = await fetch(this.urlApi + `/bouncer/${eventId}/validate/${bouncer}`, {
            method: 'POST',
        });
        
        return res.json();
    }
}

export default new BouncerService(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');