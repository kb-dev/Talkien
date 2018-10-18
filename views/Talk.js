import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar, Permissions } from 'expo';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/fr';

import BackButton from '../components/buttons/BackButton';
import NavBar from '../components/ui/NavBar';
import style from '../Style';
import Toast from 'react-native-root-toast';

moment.locale('fr');

class Talk extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let talkName = 'Talk';

        let leftButton = <BackButton backAction={navigation.goBack}/>;

        return {
            title: talkName,
            header: <NavBar title={talkName} leftButton={leftButton}/>,
        };
    };

    constructor(props) {
        super(props);
        this.state = { disabled: false };

        this._name = this.props.navigation.state.params.name;
        this._data = this.props.navigation.state.params.data;
        this._onPress = this._onPress.bind(this);
    }

    _onPress(e) {
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

                    await Calendar.createEventAsync(Calendar.DEFAULT, event);
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

    render() {
        const theme = style.Theme[this.props.themeName];
        const { location, description, tags, category, speakers, lang, startDate, endDate } = this._data;

        return (
            <View style={style.Talk.container}>
                <View style={style.Talk.titleView}>
                    <Text style={style.Talk.title}>{this._name}</Text>
                </View>
                <View style={{ margin: 4 }}>
                    <Text style={{ textAlign: 'justify' }}>{description}</Text>
                </View>
                {location && (
                    <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <Entypo name="location" size={14} style={{ width: 14, height: 14, marginRight: 4 }}/>
                        <Text>{location}</Text>
                    </View>
                )}
                {category && (
                    <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <Entypo name="tag" size={14} style={{ width: 14, height: 14, marginRight: 4 }}/>
                        <Text style={{ fontSize: 14, fontWeight: '200' }}>{category}</Text>
                    </View>
                )}
                <View>
                    <Text>Début : {moment(startDate).format('HH:mm')}</Text>
                </View>
                <View>
                    <Text>Fin : {moment(endDate).format('HH:mm')}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={this._onPress} style={{ marginHorizontal: 8, marginTop: 8 }} disabled={this.state.disabled}>
                        <View style={{ alignSelf: 'stretch', borderColor: '#000', borderWidth: 1 }}>
                            <Text style={{ textAlign: 'center' }}>Ajouter au calendrier</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
