import { ADD_EVENT, ADD_EVENTS, DELETE_EVENT } from '../constants/action-types';

export const addEvent = (event) => ({ type: ADD_EVENT, payload: event });
export const addEvents = (events) => ({ type: ADD_EVENTS, payload: events });
export const deleteEvent = (event) => ({ type: DELETE_EVENT, payload: event });
