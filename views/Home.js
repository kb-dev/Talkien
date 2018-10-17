import React from 'react';
import { ActivityIndicator, AsyncStorage, FlatList, NetInfo, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import 'moment/locale/fr';
// UI
import NavBar from '../components/ui/NavBar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Split from '../components/ui/Split';
import EventRow from '../components/home/EventRow';
// Misc
import { compareDate } from '../Utils';
import style from '../Style';

moment.locale('fr');

class Home extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let title = 'Conférences';
        let leftButton = (
            <TouchableOpacity
                onPress={() => {
                    navigation.openDrawer();
                }}
                style={{
                    justifyContent: 'space-around',
                    paddingLeft: 16,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <MaterialCommunityIcons
                        name="menu"
                        size={32}
                        style={{
                            color: 'white',
                            height: 32,
                            width: 32,
                        }}
                    />
                </View>
            </TouchableOpacity>
        );

        return {
            title,
            header: <NavBar title={title} leftButton={leftButton}/>,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            cacheDate: null,
            list: null,
            refreshing: false,
        };

        this.refreshList = this.refreshList.bind(this);
        this.openEvent = this.openEvent.bind(this);
    }

    async componentDidMount() {
        await this.fetchList();
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
            list.sort((eventA, eventB) => compareDate(eventA.startDate, eventB.startDate));
            this.setState({ list, refreshing: false });
        }
    }

    openEvent(name, id) {
        const { navigate } = this.props.navigation;
        navigate('Event', { name, id });
    }

    async refreshList() {
        this.setState({ refreshing: true });
        await this.fetchList();
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
                        <Text style={style.offline.groups.text}>
                            Affichage hors-ligne datant du {moment(this.state.cacheDate).format('DD/MM/YYYY HH:mm')}
                        </Text>
                    </View>
                );
            }
            content = (
                <FlatList
                    renderItem={({ item, j, index }) => {
                        return (
                            <EventRow
                                id={item.id}
                                name={item.name}
                                address={item.address}
                                startDate={item.startDate}
                                endDate={item.endDate}
                                openEvent={this.openEvent}
                            />
                        );
                    }}
                    data={this.state.list}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={20}
                    onEndReachedThreshold={0.1}
                    style={[{ backgroundColor: theme.listBackground }]}
                    onRefresh={this.refreshList}
                    refreshing={this.state.refreshing}
                />
            );
        }
        return (
            <View style={style.Home.view}>
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

export default connect(mapStateToProps)(Home);
