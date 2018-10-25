import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar, Permissions } from 'expo';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import 'moment/locale/fr';

import style from '../Style';

moment.locale('fr');

class Talk extends React.Component {
    constructor(props) {
        super(props);
        this.state = { eventId: null, disabled: false };

        this._name = this.props.navigation.state.params.name;
        this._calendarId = this.props.navigation.state.params.calendarId;
        this._data = this.props.navigation.state.params.data;
        this.addEventToCalendar = this.addEventToCalendar.bind(this);
        this.deleteEventFromCalendar = this.deleteEventFromCalendar.bind(this);
    }

    addEventToCalendar(e) {
        requestAnimationFrame(async () => {
            await this.setState({ disabled: true });
            const { status } = await Permissions.askAsync(Permissions.CALENDAR);
            if (status !== 'granted') {
                Toast.show(`Vous devez accepter les permissions liées au calendrier pour pouvoir ajouter un événement`, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
            } else {
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

                    const eventId = await Calendar.createEventAsync(this._calendarId, event);
                    this.setState({ eventId });
                } catch (e) {
                    Toast.show(`Erreur d'ajout au calendrier`, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                }
            }
            await this.setState({ disabled: false });
        });
    }

    deleteEventFromCalendar(e) {
        requestAnimationFrame(async () => {
            await this.setState({ disabled: true });
            const { status } = await Permissions.askAsync(Permissions.CALENDAR);
            if (status !== 'granted') {
                Toast.show(`Vous devez accepter les permissions liées au calendrier pour pouvoir supprimer un événement`, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
            } else {
                try {
                    await Calendar.deleteEventAsync(this.state.eventId);
                    await this.setState({ eventId: null, disabled: false });
                } catch (e) {
                    Toast.show(`Erreur de suppression de l'évènement du calendrier`, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                    await this.setState({ disabled: false });
                }
            }
            await this.setState({ disabled: false });
        });
    }

    async checkEvent() {
        await this.setState({ disabled: true });
        const { status } = await Permissions.askAsync(Permissions.CALENDAR);
        if (status !== 'granted') {
            Toast.show(`Vous devez accepter les permissions liées au calendrier pour pouvoir ajouter un événement`, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        } else {
            try {
                const searchedEvent = {
                    title: this._name,
                    startDate: moment(this._data.startDate).toDate(),
                    endDate: moment(this._data.endDate).toDate(),
                };

                const events = await Calendar.getEventsAsync([this._calendarId], searchedEvent.startDate, searchedEvent.endDate);
                const matchEvents = events.filter((event) => event.title === searchedEvent.title);
                if (matchEvents && matchEvents.length > 0) {
                    await this.setState({ eventId: matchEvents[0].id, disabled: false });
                }
                await this.setState({ disabled: false });
            } catch (e) {
                console.log({ e });
                Toast.show(`Erreur de lecture du calendrier`, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
                await this.setState({ disabled: false });
            }
        }
    }

    async componentDidMount() {
        await this.checkEvent();
    }

    render() {
        const theme = style.Theme[this.props.themeName];
        const { location, description, tags, category, speakers, lang, startDate, endDate } = this._data;

        let action = (
            <TouchableOpacity onPress={this.addEventToCalendar} style={{ marginHorizontal: 8, marginTop: 8 }} disabled={this.state.disabled}>
                <View style={{ alignSelf: 'stretch', borderColor: '#FFF', borderWidth: 1, padding: 4 }}>
                    <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 16 }}>Ajouter au calendrier</Text>
                </View>
            </TouchableOpacity>
        );

        if (this.state.eventId) {
            action = (
                <TouchableOpacity
                    onPress={this.deleteEventFromCalendar}
                    style={{ marginHorizontal: 8, marginTop: 8 }}
                    disabled={this.state.disabled}>
                    <View style={{ alignSelf: 'stretch', borderColor: '#FFF', borderWidth: 1, padding: 4 }}>
                        <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 16 }}>Supprimer du calendrier</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <View style={style.Talk.container}>
                <View style={style.Talk.titleView}>
                    <Text style={style.Talk.title}>{this._name}</Text>
                </View>
                <View style={{ margin: 4 }}>
                    <Text style={{ textAlign: 'justify', color: '#FFF' }}>{description}</Text>
                </View>
                {location && (
                    <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <Entypo name="location" size={14} style={{ width: 14, height: 14, marginRight: 4, color: '#FFF' }}/>
                        <Text style={{ color: '#FFF' }}>{location}</Text>
                    </View>
                )}
                {category && (
                    <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <Entypo name="tag" size={14} style={{ width: 14, height: 14, marginRight: 4, color: '#FFF' }}/>
                        <Text style={{ fontSize: 14, fontWeight: '200', color: '#FFF' }}>{category}</Text>
                    </View>
                )}
                <View>
                    <Text style={{ color: '#FFF' }}>Début : {moment(startDate).format('HH:mm')}</Text>
                </View>
                <View>
                    <Text style={{ color: '#FFF' }}>Fin : {moment(endDate).format('HH:mm')}</Text>
                </View>
                <View>{action}</View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeName: state.darkMode.themeName,
    };
};

export default connect(mapStateToProps)(Talk);
