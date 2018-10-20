import React from 'react';
import { ActivityIndicator, AsyncStorage, NetInfo, Platform, SectionList, Text, View } from 'react-native';
import { Calendar, LinearGradient, Permissions } from 'expo';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import { connect } from 'react-redux';

import TalkRow from '../components/event/TalkRow';
import style from '../Style';

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventName: this.props.navigation.state.params.name,
            eventId: this.props.navigation.state.params.id,
            startDate: this.props.navigation.state.params.startDate,
            endDate: this.props.navigation.state.params.endDate,
            calendarId: this.props.navigation.state.params.calendarId,
            calendarTitle: this.props.navigation.state.params.calendarTitle,
            cacheDate: null,
            list: null,
            refreshing: false,
        };

        this.openTalk = this.openTalk.bind(this);
        this.refreshList = this.refreshList.bind(this);
    }

    async componentDidMount() {
        await this.fetchList();
        await this.checkCalendar();
    }

    async checkCalendar() {
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
            return;
        }

        if (this.state.calendarId) {
            try {
                const calendar = await Calendar.getEventsAsync(
                    [this.state.calendarId],
                    moment(this.state.startDate).toDate(),
                    moment(this.state.endDate).toDate(),
                );
                console.log('calendarId', { calendar });
            } catch (e) {
                console.warn(e);
                Toast.show(`Erreur de lecture du calendrier`, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
            }
        } else {
            try {
                let calendar = {
                    title: `${this.state.eventName} | Talkien`,
                    name: `${this.state.eventName} | Talkien`,
                    color: '#66b1e6',
                    entityType: Calendar.EntityTypes.EVENT,
                    allowsModifications: true,
                    id: this.state.eventId,
                    source: {
                        isLocalAccount: true,
                        name: 'Talkien',
                        type: Calendar.SourceType.LOCAL,
                    },
                    ownerAccount: 'talkien',
                    timeZone: 'Europe/Paris',
                    isVisible: true,
                    isPrimary: false,
                    isSynced: false,
                    allowedAvailabilities: ['busy', 'free'],
                    allowedReminders: ['default', 'alert', 'email'],
                    accessLevel: 'owner',
                    allowedAttendeeTypes: ['none', 'required', 'optional'],
                };

                if (Platform.OS === 'ios') {
                    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
                    const local = calendars.filter((calendar) => calendar.source && calendar.source.type === Calendar.CalendarType.LOCAL);
                    if (local.length < 1) {
                        throw new Error('No local calendar found');
                    }

                    calendar = {
                        title: `${this.state.eventName} | Talkien`,
                        color: '#66b1e6',
                        entityType: Calendar.EntityTypes.EVENT,
                        allowsModifications: true,
                        allowedAvailabilities: [],
                        id: this.state.eventId,
                        sourceId: local[0].source.id,
                    };
                }

                const calendarId = await Calendar.createCalendarAsync(calendar);
                console.log({ calendarId });
                this.setState({ calendarId });
            } catch (e) {
                console.warn(e);
                Toast.show(`Erreur de création du calendrier`, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
            }
        }
    }

    async getCache() {
        let cache = await AsyncStorage.getItem(this.state.eventId);
        if (cache !== null) {
            cache = JSON.parse(cache);
            this.setState({ cacheDate: cache.date });
            return cache.list;
        }
        return null;
    }

    async fetchList() {
        let list = null;

        const isConnected = (await NetInfo.getConnectionInfo()) !== 'none';
        if (isConnected) {
            try {
                const response = await axios.get(
                    `https://raw.githubusercontent.com/kb-dev/talkien-events/master/${this.state.eventId}/events.json`,
                    {
                        responseType: 'json',
                    }
                );
                this.setState({ cacheDate: null });
                list = response.data;
                AsyncStorage.setItem(this.state.eventId, JSON.stringify({ list, date: moment() }));
            } catch (error) {
                if (error.response) {
                    Toast.show(`Le serveur a répondu par une erreur ${error.response.status}`, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                } else if (error.request) {
                    Toast.show(`Pas de connexion`, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                } else {
                    Toast.show(`Erreur : ${error.message}`, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                    });
                }
                list = await this.getCache();
            }
        } else {
            Toast.show(`Pas de connexion`, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
            list = await this.getCache();
        }

        if (list !== null) {
            let sectionsIndex = {};
            let sections = [];
            let index = 0;
            list.forEach((talk) => {
                let sectionId = `${talk.startDate}-${talk.endDate}`;
                if (sectionsIndex[sectionId]) {
                    sections[sectionsIndex[sectionId]].data.push(talk);
                } else {
                    sectionsIndex[sectionId] = index;
                    sections[index] = {
                        title: `${moment(talk.startDate).format('HH:mm')} - ${moment(talk.endDate).format('HH:mm')}`,
                        data: [talk],
                        timestamp: moment(talk.startDate).valueOf(),
                    };
                    index++;
                }
            });

            sections.sort((a, b) => a.timestamp - b.timestamp);

            this.setState({ list: sections, refreshing: false });
        }
    }

    async refreshList() {
        this.setState({ refreshing: true });
        await this.fetchList();
    }

    openTalk(name, data) {
        const { navigate } = this.props.navigation;
        navigate('Talk', { name, data, calendarTitle: this.state.calendarTitle, calendarId: this.state.calendarId });
    }

    render() {
        const theme = style.Theme[this.props.themeName];

        let content = null,
            cache = null;

        if (this.state.list === null) {
            content = <ActivityIndicator style={[style.Home.containerView]} size="large" animating={true}/>;
        } else {
            if (this.state.cacheDate !== null) {
                cache = (
                    <View>
                        <Text style={style.Offline.text}>
                            Affichage hors-ligne datant du {moment(this.state.cacheDate).format('DD/MM/YYYY HH:mm')}
                        </Text>
                    </View>
                );
            }
            content = (
                <SectionList
                    renderItem={({ item }) => {
                        return (
                            <TalkRow
                                name={item.name}
                                location={item.location}
                                startDate={item.startDate}
                                endDate={item.endDate}
                                category={item.category}
                                lang={item.lang}
                                data={item}
                                openTalk={this.openTalk}
                            />
                        );
                    }}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ paddingTop: 10, paddingLeft: 4 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
                        </View>
                    )}
                    sections={this.state.list}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={20}
                    onEndReachedThreshold={0.1}
                    onRefresh={this.refreshList}
                    refreshing={this.state.refreshing}
                />
            );
        }
        return (
            <View style={[style.Event.view]}>
                <LinearGradient colors={[style.Theme.gradient.start, style.Theme.gradient.end]} style={style.Home.gradient}>
                    {cache}
                    {content}
                </LinearGradient>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeName: state.darkMode.themeName,
    };
};

export default connect(mapStateToProps)(Group);
