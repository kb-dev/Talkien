import React from 'react';
import { ActivityIndicator, AsyncStorage, NetInfo, SectionList, Text, View } from 'react-native';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import { connect } from 'react-redux';

import BackButton from '../components/buttons/BackButton';
import TalkRow from '../components/event/TalkRow';
import NavBar from '../components/ui/NavBar';
import style from '../Style';
import Split from '../components/ui/Split';

class Group extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let eventName = navigation.state.params.name;

        let leftButton = <BackButton backAction={navigation.goBack}/>;

        return {
            title: eventName,
            header: <NavBar title={eventName} leftButton={leftButton}/>,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            eventName: this.props.navigation.state.params.name,
            eventId: this.props.navigation.state.params.id,
            cacheDate: null,
            list: null,
            refreshing: false,
        };

        this.openTalk = this.openTalk.bind(this);
        this.refreshList = this.refreshList.bind(this);
    }

    async componentDidMount() {
        await this.fetchList();
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
        navigate('Talk', { name, data });
    }

    render() {
        const theme = style.Theme[this.props.themeName];

        let content = null,
            cache = null;

        if (this.state.list === null) {
            content = (
                <View style={{ flex: 1, backgroundColor: theme.listBackground }}>
                    <ActivityIndicator style={[style.Home.containerView]} size="large" animating={true}/>
                </View>
            );
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
                        <View style={{ marginTop: 10, paddingLeft: 4 }}>
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
            <View style={[style.Event.view, { backgroundColor: theme.listBackground }]}>
                <Split lineColor={theme.border} noMargin={true}/>
                {cache}
                {content}
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
