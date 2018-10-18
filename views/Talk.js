import React from 'react';
import { Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/fr';

import BackButton from '../components/buttons/BackButton';
import NavBar from '../components/ui/NavBar';
import style from '../Style';

moment.locale('fr');

class Talk extends React.PureComponent {
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

        this._name = this.props.navigation.state.params.name;
        this._data = this.props.navigation.state.params.data;
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
                    <Text>{description}</Text>
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
