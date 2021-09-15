import React from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableHighlight, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Calendar from 'expo-calendar';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import 'moment/locale/fr';
// UI
import EventRow from '../components/home/EventRow';
// Misc
import { compareDate, displayError } from '../Utils';
import style from '../Style';

moment.locale('fr');

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cacheDate: null,
            list: null,
            originalList: null,
            calendars: null,
            refreshing: false,
            searching: false,
            colorId: { color: 0 },
            clear: false,
        };

        this.refreshList = this.refreshList.bind(this);
        this.openEvent = this.openEvent.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    async componentDidMount() {
        await Calendar.getCalendarPermissionsAsync();
        await this.fetchList();
        await this.setState({ colorId: 1 });
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

        const isConnected = (await NetInfo.fetch()) !== 'none';
        if (isConnected) {
            try {
                const response = await axios.get('https://kb-dev.github.io/talkien-events/events.json', {
                    responseType: 'json',
                });
                this.setState({ cacheDate: null });
                list = response.data;
                AsyncStorage.setItem('list', JSON.stringify({ list, date: moment() }));
            } catch (error) {
                displayError(error);
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

    openEvent(data) {
        const { navigate } = this.props.navigation;
        navigate('Event', { data });
    }

    changeColor() {
        if (!this.state.selected) {
            this.setState({ selected: true, backgroundColor: 'red', backgroundColor2: 'black' });
        } else {
            this.setState({ slected: false, backgroundColor: 'black', backgroundColor2: 'red' });
        }
    }

    onSearch(input) {
        const dateNow = moment();
        if (input === '') {
            this.setState({ list: this.state.originalList, searching: false });
        } else if (this.state.colorId === 1) {
            this.setState({ list: this.state.originalList, searching: false });
            const regex = new RegExp(input, 'gi');
            const list = this.state.rawList
                .filter((event) => {
                    return moment(event.startDate).isAfter(dateNow) ? event.name.match(regex) : '';
                })
                .sort((eventA, eventB) => compareDate(eventA.startDate, eventB.startDate, -1));
            this.setState({ list, searching: true });
        } else {
            const regex = new RegExp(input, 'gi');
            const list = this.state.rawList
                .filter((event) => {
                    return moment(event.startDate).isBefore(dateNow) ? event.name.match(regex) : '';
                })
                .sort((eventA, eventB) => compareDate(eventA.startDate, eventB.startDate, -1));
            this.setState({ list, searching: true });
        }
    }

    async refreshList() {
        this.setState({ refreshing: true });
        await this.fetchList();
    }

    _upcomingEvents = () => {
        this.setState({ colorId: 1, clear: true }, () => {
            this.onSearch();
        });
    };

    _previousEvents = () => {
        this.setState({ colorId: 2, clear: true }, () => {
            this.onSearch();
        });
    };

    render() {
        const { list, cacheDate, searching, refreshing } = this.state;

        let content = null,
            cache = null;

        let title = <Text style={style.Home.eventsTitleText}>Prochains évènements</Text>;

        if (list === null) {
            content = (
                <ActivityIndicator style={style.ActivityIndicator.style} size="large" animating={true} color={style.ActivityIndicator.color} />
            );
        } else {
            if (list.length === 0) {
                title = <Text style={style.Home.eventsTitleText}>Aucun évènement</Text>;
            } else if (searching) {
                title = <Text style={style.Home.eventsTitleText}>Évènements trouvés</Text>;
            }
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
                    renderItem={({ item }) => (
                        <EventRow
                            id={item.id}
                            name={item.name}
                            topics={item.topics}
                            startDate={item.startDate}
                            endDate={item.endDate}
                            colors={item.colors}
                            online={item.online}
                            data={item}
                            openEvent={this.openEvent}
                        />
                    )}
                    data={list.slice(0, 3).concat([{ id: null }])}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={20}
                    onEndReachedThreshold={0.1}
                    style={{ backgroundColor: 'transparent' }}
                    onRefresh={this.refreshList}
                    refreshing={refreshing}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            );
        }
        return (
            <View style={style.Home.view}>
                <View style={style.Home.titleView}>
                    <Text style={style.Home.titleText}>Quel évènement cherchez-vous ?</Text>
                </View>
                <View style={style.SearchSelector.view}>
                    <TouchableHighlight
                        underlayColor={'none'}
                        onPress={this._upcomingEvents}
                        style={this.state.colorId === 1 ? style.SearchSelector.activedLeftButton : style.SearchSelector.leftButton}>
                        <View>
                            <Text style={style.SearchSelector.text}>{'À venir'}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'none'}
                        onPress={this._previousEvents}
                        style={this.state.colorId === 2 ? style.SearchSelector.activedRightButton : style.SearchSelector.rightButton}>
                        <View>
                            <Text style={style.SearchSelector.text}>{'Archivé'}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={style.Home.searchView}>
                    <TextInput
                        style={style.Home.searchInput}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        multiline={false}
                        spellCheck={false}
                        underlineColorAndroid={'transparent'}
                        clearButtonMode={'always'}
                        placeholder={'Exemple : DevFest Lille'}
                        placeholderTextColor={'#d8d8d8'}
                        onChangeText={this.onSearch}
                        clearTextOnFocus={this.state.clear}
                    />
                </View>
                <View style={style.Home.eventsTitleView}>{title}</View>
                {cache}
                {content}
            </View>
        );
    }
}
