import React from 'react';
import { ActivityIndicator, AsyncStorage, FlatList, NetInfo, Text, TextInput, View } from 'react-native';
import { Calendar, LinearGradient, Permissions } from 'expo';
import { connect } from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import 'moment/locale/fr';
// UI
import EventRow from '../components/home/EventRow';
// Misc
import { compareDate } from '../Utils';
import style from '../Style';

moment.locale('fr');

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cacheDate: null,
            list: null,
            originalList: null,
            calendars: null,
            refreshing: false,
            searching: false,
        };

        this.refreshList = this.refreshList.bind(this);
        this.openEvent = this.openEvent.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    async componentDidMount() {
        await this.fetchList();
        await this.checkCalendars();
    }

    async checkCalendars() {
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
                const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
                // console.log({ calendars });
                // calendars.forEach((calendar) => {
                //     if (calendar.source && calendar.source.name === 'Talkien') {
                //         console.log({ calendar });
                //         Calendar.deleteCalendarAsync(calendar.id);
                //     }
                // });
                this.setState({ calendars });
            } catch (e) {
                Toast.show(`Erreur de lecture des calendriers`, {
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
        let cache = await AsyncStorage.getItem('list');
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
                const response = await axios.get('https://raw.githubusercontent.com/kb-dev/talkien-events/master/events.json', {
                    responseType: 'json',
                });
                this.setState({ cacheDate: null });
                list = response.data;
                AsyncStorage.setItem('list', JSON.stringify({ list, date: moment() }));
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
            const rawList = list;
            rawList.sort((eventA, eventB) => compareDate(eventA.startDate, eventB.startDate));
            list = rawList.filter((event) => moment(event.endDate).isAfter(moment()));
            this.setState({ list, originalList: list, rawList, refreshing: false });
        }
    }

    openEvent(name, id, startDate, endDate, calendarTitle, calendarId) {
        const { navigate } = this.props.navigation;
        navigate('Event', { name, id, startDate, endDate, calendarTitle, calendarId });
    }

    onSearch(input) {
        if (input === '') {
            this.setState({ list: this.state.originalList, searching: false });
        } else {
            let regex = new RegExp(input, 'gi');
            const list = this.state.rawList.filter((event) => {
                return event.name.match(regex);
            });
            this.setState({ list, searching: true });
        }
    }

    async refreshList() {
        this.setState({ refreshing: true });
        await this.fetchList();
    }

    render() {
        const { list, cacheDate, searching, refreshing, calendars } = this.state;

        let content = null,
            cache = null;

        if (list === null) {
            content = <ActivityIndicator style={[style.Home.containerView]} size="large" animating={true}/>;
        } else {
            if (cacheDate !== null) {
                cache = (
                    <View>
                        <Text style={style.offline.groups.text}>
                            Affichage hors-ligne datant du {moment(cacheDate).format('DD/MM/YYYY HH:mm')}
                        </Text>
                    </View>
                );
            }
            content = (
                <FlatList
                    renderItem={({ item }) => {
                        const calendarTitle = `${item.name} | Talkien`;
                        let calendarId = null;
                        if (calendars !== null) {
                            let foundCalendar = calendars.find(
                                (calendar) => calendar.name === calendarTitle || calendar.title === calendarTitle,
                            );
                            if (foundCalendar) {
                                calendarId = foundCalendar.id;
                            }
                            console.log({ calendarId, calendarTitle });
                        }

                        return (
                            <EventRow
                                id={item.id}
                                name={item.name}
                                address={item.address}
                                topics={item.topics}
                                startDate={item.startDate}
                                endDate={item.endDate}
                                colors={item.colors}
                                calendarTitle={calendarTitle}
                                calendarId={calendarId}
                                openEvent={this.openEvent}
                            />
                        );
                    }}
                    data={list.slice(0, 3)}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={20}
                    onEndReachedThreshold={0.1}
                    style={[{ backgroundColor: 'transparent' }]}
                    onRefresh={this.refreshList}
                    refreshing={refreshing}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            );
        }
        return (
            <View style={style.Home.view}>
                <LinearGradient colors={[style.Theme.gradient.start, style.Theme.gradient.end]} style={style.Home.gradient}>
                    <View style={style.Home.titleView}>
                        <Text style={style.Home.titleText}>Quel évènement cherchez-vous ?</Text>
                    </View>
                    <View style={style.Home.search.view}>
                        <TextInput
                            style={style.Home.search.input}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            multiline={false}
                            spellCheck={false}
                            underlineColorAndroid={'transparent'}
                            clearButtonMode={'always'}
                            placeholder={'Exemple : DevFest Lille'}
                            placeholderTextColor={'#d8d8d8'}
                            onChangeText={this.onSearch}
                        />
                    </View>
                    <View style={style.Home.nextEvents.titleView}>
                        {!searching && <Text style={style.Home.nextEvents.titleText}>Prochains évènements</Text>}
                        {searching && <Text style={style.Home.nextEvents.titleText}>Évènements trouvés</Text>}
                    </View>
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

export default connect(mapStateToProps)(Home);
