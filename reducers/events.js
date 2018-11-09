import { ADD_EVENT, ADD_EVENTS, DELETE_EVENT } from '../constants/action-types';
import { generateChecksum } from '../Utils';

const initialState = {
    events: [],
};

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_EVENT: {
            const event = { ...action.payload };
            event.checksum = generateChecksum(event.eventId, event.startDate, event.endDate, event.location, event.name);
            return { ...state, events: [...state.events, event] };
        }
        case DELETE_EVENT: {
            const event = { ...action.payload };
            const checksum = generateChecksum(event.eventId, event.startDate, event.endDate, event.location, event.name);
            const index = state.events.findIndex((savedEvent) => savedEvent.checksum === checksum);
            return { ...state, events: [...state.events.slice(0, index), ...state.events.slice(index + 1)] };
        }
        case ADD_EVENTS: {
            const events = [...action.payload];
            const checksums = state.events.map((event) => event.checksum);
            const newEvents = events.filter((event) => !checksums.includes(event.checksum));

            return { ...state, events: state.events.concat(newEvents) };
        }
        default:
            return state;
    }
}
