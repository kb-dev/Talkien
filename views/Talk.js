import React from 'react';
import { ScrollView, Text, TouchableHighlight, View } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Permissions from 'expo-permissions';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import 'moment/locale/fr';

import style from '../Style';
import BackButton from '../components/buttons/BackButton';
import { addEvent, deleteEvent } from '../actions';
import { generateChecksum } from '../Utils';

moment.locale('fr');

class Talk extends React.Component {
    static propTypes = {
        dispatchAddEvent: PropTypes.func,
        dispatchDeleteEvent: PropTypes.func,
        savedEvents: PropTypes.array,
    };

    constructor(props) {
        super(props);
        this.state = { calendarEventId: null, disabled: false, saved: false };

        this._name = this.props.navigation.state.params.name;
        this._calendarId = this.props.navigation.state.params.calendarId;
        this._eventId = this.props.navigation.state.params.eventId;
        this._data = this.props.navigation.state.params.data;
        this.addEventToCalendar = this.addEventToCalendar.bind(this);
        this.deleteEventFromCalendar = this.deleteEventFromCalendar.bind(this);
    }

    addEventToCalendar() {
        requestAnimationFrame(async () => {
            await this.setState({ disabled: true });

            const { status } = await Permissions.getAsync(Permissions.CALENDAR);
            let calendarEventId = null;

            if (status === 'granted') {
                try {
                    const event = {
                        title: this._name,
                        color: '#386b91',
                        entityType: Calendar.EntityTypes.EVENT,
                        startDate: moment(this._data.startDate).toDate(),
                        endDate: moment(this._data.endDate).toDate(),
                        timeZone: 'Europe/Paris',
                        location: this._data.location,
                        notes: this._data.description,
                    };

                    calendarEventId = await Calendar.createEventAsync(this._calendarId, event);
                } catch (e) {
                    Toast.show('Erreur d\'ajout au calendrier', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                }
            }

            this.props.dispatchAddEvent({ ...this._data, eventId: this._eventId });
            await this.setState({ disabled: false, saved: true, calendarEventId });
        });
    }

    deleteEventFromCalendar() {
        requestAnimationFrame(async () => {
            await this.setState({ disabled: true });

            const { status } = await Permissions.getAsync(Permissions.CALENDAR);

            if (status === 'granted') {
                try {
                    await Calendar.deleteEventAsync(String(this.state.calendarEventId));
                } catch (e) {
                    Toast.show('Erreur de suppression de l\'évènement du calendrier', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                }
            }

            this.props.dispatchDeleteEvent({ ...this._data, eventId: this._eventId });
            await this.setState({ disabled: false, saved: false, calendarEventId: null });
        });
    }

    async checkEvent() {
        await this.setState({ disabled: true });

        const { status } = await Permissions.getAsync(Permissions.CALENDAR);
        let { calendarEventId, saved } = this.state;

        if (status === 'granted') {
            try {
                const searchedEvent = {
                    title: this._name,
                    startDate: moment(this._data.startDate).toDate(),
                    endDate: moment(this._data.endDate).toDate(),
                };

                const events = await Calendar.getEventsAsync([this._calendarId], searchedEvent.startDate, searchedEvent.endDate);
                const matchEvents = events.filter((event) => event.title === searchedEvent.title);
                if (matchEvents && matchEvents.length > 0) {
                    calendarEventId = matchEvents[0].id;
                    saved = true;
                }
            } catch (e) {
                Toast.show('Erreur de lecture du calendrier', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
            }
        }
        if (calendarEventId === null) {
            const { location, startDate, endDate } = this._data;
            const foundEvent = this.props.savedEvents.find(
                (event) => event.checksum === generateChecksum(this._eventId, startDate, endDate, location, this._name),
            );
            if (foundEvent) {
                saved = true;
            }
        }

        await this.setState({ disabled: false, calendarEventId, saved });
    }

    async componentDidMount() {
        await this.checkEvent();
    }

    render() {
        const { location, description, category, startDate, endDate, speakers } = this._data;
        const color = style.Theme.colors.font;

        let action = (
            <TouchableHighlight
                underlayColor={style.Theme.overlayColor}
                onPress={this.addEventToCalendar}
                style={style.Talk.button}
                disabled={this.state.disabled}>
                <MaterialCommunityIcons name="calendar-plus" size={32} style={{ width: 32, height: 32, color }}/>
            </TouchableHighlight>
        );

        if (this.state.saved) {
            action = (
                <TouchableHighlight
                    underlayColor={style.Theme.overlayColor}
                    onPress={this.deleteEventFromCalendar}
                    disabled={this.state.disabled}
                    style={style.Talk.button}>
                    <MaterialCommunityIcons name="calendar-remove" size={32} style={{ width: 32, height: 32, color }}/>
                </TouchableHighlight>
            );
        }

        return (
            <View style={style.Talk.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                    <BackButton backAction={this.props.navigation.goBack} title={'Programme'}/>
                </View>
                <View style={style.Talk.view}>
                    <View style={style.Talk.header}>
                        <View style={style.Talk.titleView}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'stretch',
                                    marginRight: 16,
                                }}>
                                <Entypo name="blackboard" size={24} style={{ width: 24, height: 24, color }}/>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={style.Talk.title}>{this._name}</Text>
                            </View>
                        </View>
                        <View style={style.Talk.details}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <Entypo name="clock" size={20} style={{ width: 20, height: 24, marginRight: 16, color }}/>
                                <Text style={style.Talk.hours}>
                                    {moment(startDate).format('HH:mm')} - {moment(endDate).format('HH:mm')}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: 'stretch',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                {location && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Entypo name="location" size={20} style={{ width: 20, height: 20, marginRight: 16, color }}/>
                                        <Text style={{ fontSize: 18, fontWeight: '200', color }}>{location}</Text>
                                    </View>
                                )}
                                {category && (
                                    <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                                        <Entypo name="tag" size={20} style={{ width: 20, height: 20, marginRight: 16, color }}/>
                                        <Text style={{ fontSize: 18, fontWeight: '200', color }}>{category}</Text>
                                    </View>
                                )}
                            </View>
                            {action}
                        </View>
                    </View>
                    <ScrollView style={style.Talk.scrollView}>
                        {description && (
                            <View style={style.Talk.description}>
                                <Text style={{ color, fontSize: 16 }}>{description}</Text>
                            </View>
                        )}
                        <View style={style.Talk.description}>
                            {speakers && <Text style={{ color, fontSize: 16 }}>Présenté par : </Text>}
                            {speakers &&
                            speakers.map((speaker) => (
                                <Text key={speaker.name} style={{ color, fontSize: 16 }}>
                                    - {speaker.name} {speaker.company ? `(${speaker.company})` : ''}
                                </Text>
                            ))}
                        </View>

                        <View style={{ height: 60 }}/>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        savedEvents: state.events.events,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchAddEvent: (event) => dispatch(addEvent(event)),
        dispatchDeleteEvent: (event) => dispatch(deleteEvent(event)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Talk);
