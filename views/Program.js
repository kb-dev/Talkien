import React from 'react';
import { ActivityIndicator, NetInfo, Platform, SectionList, Text, View } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'moment/locale/fr';

import TalkRow from '../components/event/TalkRow';
import style from '../Style';
import { capitalize, displayError, generateChecksum } from '../Utils';
import BackButton from '../components/buttons/BackButton';
import { addEvents } from '../actions';
import URLButton from '../components/buttons/URLButton';

moment.locale('fr');

class Program extends React.Component {
    static propTypes = {
        savedEvents: PropTypes.array,
        dispatchAddEvents: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            eventName: this.props.navigation.state.params.name,
            eventId: this.props.navigation.state.params.id,
            startDate: this.props.navigation.state.params.startDate,
            endDate: this.props.navigation.state.params.endDate,
            calendarId: null,
            calendarTitle: `${this.props.navigation.state.params.name} | Talkien`,
            list: null,
            refreshing: false,
            error: false,
            sectionTitle: null,
            firstSection: null,
            nextSection: null,
            length: null,
            savedEvents: [],
            checkFinished: false,
            fetchFinished: false,
        };

        this.openTalk = this.openTalk.bind(this);
        this.updateSectionTitle = this.updateSectionTitle.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderSection = this.renderSection.bind(this);
    }

    async componentDidMount() {
        this.checkCalendar();
        this.fetchList();
    }

    componentDidUpdate(prevProps) {
        if (this.props.savedEvents !== prevProps.savedEvents) {
            const savedEvents = this.props.savedEvents.map((event) => event.checksum);
            this.setState({ savedEvents });
        }
    }

    async checkCalendar() {
        let savedEvents = this.props.savedEvents.map((event) => event.checksum);
        const { status } = await Permissions.getAsync(Permissions.CALENDAR);

        if (status !== 'granted') {
            await this.setState({ savedEvents, checkFinished: true });
        } else {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            const { calendarTitle, eventId } = this.state;
            let calendarId = null;
            if (calendars !== null) {
                const foundCalendar = calendars.find((calendar) => calendar.name === calendarTitle || calendar.title === calendarTitle);
                if (foundCalendar) {
                    calendarId = foundCalendar.id;
                }
            }

            if (calendarId) {
                try {
                    const calendarEvents = await Calendar.getEventsAsync(
                        [calendarId],
                        moment(this.state.startDate).toDate(),
                        moment(this.state.endDate).toDate(),
                    );
                    savedEvents = calendarEvents.map((event) => {
                        return {
                            checksum: generateChecksum(eventId, event.startDate, event.endDate, event.location, event.title),
                            eventId,
                        };
                    });
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
                        name: `${this.state.eventName} | Talkien`,
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
                        const local = calendars.filter(
                            (fetchedCalendar) => fetchedCalendar.source && fetchedCalendar.source.type === Calendar.CalendarType.LOCAL,
                        );
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

                    calendarId = await Calendar.createCalendarAsync(calendar);
                } catch (e) {
                    console.warn(e);
                    // Toast.show(`Erreur de création du calendrier`, {
                    //     duration: Toast.durations.LONG,
                    //     position: Toast.positions.BOTTOM,
                    //     shadow: true,
                    //     animation: true,
                    //     hideOnPress: true,
                    //     delay: 0,
                    // });
                }
            }

            const formattedEvents = savedEvents.map(({ checksum }) => checksum);

            this.props.dispatchAddEvents(formattedEvents);
            await this.setState({ calendarId, savedEvents: formattedEvents, checkFinished: true });
        }
    }

    async fetchList() {
        let list = [];

        const isConnected = (await NetInfo.getConnectionInfo()) !== 'none';
        if (isConnected) {
            try {
                const response = await axios.get(`https://kb-dev.github.io/talkien-events/${this.state.eventId}/events.json`, {
                    responseType: 'json',
                });
                await this.setState({ error: false });
                list = response.data;
            } catch (error) {
                if (!(error.response && error.response.status === 404)) {
                    await this.setState({ error: true });
                    displayError(error);
                    return;
                }
            }
        } else {
            await this.setState({ error: true });
            Toast.show(`Pas de connexion`, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }

        const sectionsIndex = {};
        const sections = [];
        let sectionIndex = 0;
        await list.map(async (talk, index) => {
            const sectionId = `${talk.startDate}-${talk.endDate}`;
            talk.index = index;
            talk.checksum = generateChecksum(this.state.eventId, talk.startDate, talk.endDate, talk.location, talk.name);

            if (sectionsIndex[sectionId]) {
                sections[sectionsIndex[sectionId]].data.push(talk);
            } else {
                sectionsIndex[sectionId] = sectionIndex;
                const title = `${moment(talk.startDate).format('HH:mm')} - ${moment(talk.endDate).format('HH:mm')}`;
                if (this.state.firstSection === null) {
                    await this.setState({ firstSection: title, sectionTitle: title });
                }
                sections[sectionIndex] = {
                    title,
                    data: [talk],
                    timestamp: moment(talk.startDate).valueOf(),
                };
                sectionIndex++;
            }
        });

        sections.sort((a, b) => a.timestamp - b.timestamp);

        await this.setState({ list: sections, length: list.length, refreshing: false, fetchFinished: true });
    }

    async refreshList() {
        this.setState({ refreshing: true });
        await this.fetchList();
    }

    openTalk(name, data, isSaved = false) {
        const { navigate } = this.props.navigation;
        let colors = null;
        if (isSaved) {
            colors = [style.Theme.colors.savedBackground, style.Gradient.default.colors[1]];
        }
        navigate('Talk', {
            name,
            data: { ...data, colors },
            eventId: this.state.eventId,
            calendarTitle: this.state.calendarTitle,
            calendarId: this.state.calendarId,
        });
    }

    updateSectionTitle({ viewableItems }) {
        if (viewableItems && viewableItems.length > 0) {
            if (viewableItems[0].section && viewableItems[0].section.title) {
                if (this.state.sectionTitle !== viewableItems[0].section.title) {
                    this.setState({ sectionTitle: viewableItems[0].section.title });
                }
            }
        }
    }

    renderItem = ({ item }) => (
        <TalkRow
            name={item.name}
            location={item.location}
            startDate={item.startDate}
            lang={item.lang}
            data={item}
            openTalk={this.openTalk}
            isSaved={this.state.savedEvents.includes(item.checksum)}
            isLast={item.index === this.state.length - 1}
        />
    );

    renderSection = ({ section: { title } }) => {
        if (title === this.state.firstSection) {
            return null;
        }
        return (
            <View style={{ paddingTop: 14, paddingBottom: 4 }}>
                <Text style={{ color: style.Theme.colors.font, fontSize: 20, textAlign: 'center' }}>{title}</Text>
            </View>
        );
    };

    renderSeparator = () => <View style={{ height: 14 }}/>;

    keyExtract = (item) => item.index;

    render() {
        let content = null;

        if (this.state.fetchFinished && this.state.list.length === 0) {
            content = (
                <View
                    style={{
                        alignSelf: 'stretch',
                        padding: 10,
                        alignItems: 'center',
                        flex: 1,
                        flexDirection: 'column',
                    }}>
                    <Text style={{ color: '#FFF', textAlign: 'center' }}>{'Le programme n\'est pas encore disponible.'}</Text>
                    <Text style={{ color: '#FFF', textAlign: 'center' }}>
                        {'Si le programme est disponible, vous pouvez ajouter les conférences sur le repo Github de Talkien :'}
                    </Text>
                    <View style={{ flex: 1, margin: 2 }}>
                        <URLButton url="https://github.com/kb-dev/talkien-events" title="GitHub" navigation={this.props.navigation}/>
                    </View>
                </View>
            );
        } else if (!this.state.checkFinished || !this.state.fetchFinished) {
            content = (
                <ActivityIndicator style={style.ActivityIndicator.style} size="large" animating={true} color={style.ActivityIndicator.color}/>
            );
        } else if (!this.state.error) {
            content = (
                <SectionList
                    renderItem={this.renderItem}
                    renderSectionHeader={this.renderSection}
                    sections={this.state.list}
                    keyExtractor={this.keyExtract}
                    initialNumToRender={20}
                    onEndReachedThreshold={0.1}
                    onRefresh={this.refreshList}
                    refreshing={this.state.refreshing}
                    stickySectionHeadersEnabled={false}
                    ItemSeparatorComponent={this.renderSeparator}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 1,
                    }}
                    onViewableItemsChanged={this.updateSectionTitle}
                />
            );
        }
        return (
            <View style={[style.Program.containerView]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                    <BackButton backAction={this.props.navigation.goBack} title={this.state.eventName}/>
                </View>
                <View style={[style.Program.view]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <View style={{ height: 2, flexShrink: 1, backgroundColor: '#FFF', width: '100%' }}/>
                        <View style={{ flexGrow: 1, marginHorizontal: 8 }}>
                            <Text style={{ color: style.Theme.colors.font, fontSize: 24, ...style.Theme.font.light }}>
                                {capitalize(moment(this.state.startDate).format('dddd D MMMM'))}
                            </Text>
                        </View>
                        <View style={{ flexShrink: 1, height: 2, backgroundColor: '#FFF', width: '100%' }}/>
                    </View>
                    <View style={{ alignSelf: 'stretch', paddingTop: 10, paddingBottom: 2 }}>
                        <Text style={{ color: style.Theme.colors.font, fontSize: 20, textAlign: 'center' }}>{this.state.sectionTitle}</Text>
                    </View>
                    {content}
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
        dispatchAddEvents: (event) => dispatch(addEvents(event)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Program);
