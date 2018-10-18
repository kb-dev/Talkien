import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

export default class TalkRow extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        location: PropTypes.string,
        category: PropTypes.string,
        lang: PropTypes.string,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        openTalk: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    _onPress(e) {
        requestAnimationFrame(() => {
            this.props.openTalk(this.props.name, this.props.data);
        });
    }

    static getFlag(lang) {
        switch (lang.toLocaleLowerCase()) {
            case 'fr_fr':
                return 'Français';
            case 'en_en':
                return 'English';
            default:
                return lang;
        }
    }
    render() {
        const { name, location, startDate, endDate, category, lang } = this.props;
        return (
            <TouchableOpacity onPress={this._onPress} style={{ marginHorizontal: 8, marginTop: 8 }}>
                <View
                    style={{
                        backgroundColor: '#FFF',
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: '#696969',
                        flexDirection: 'row',
                        margin: 0,
                        paddingVertical: 8,
                        flex: 1,
                    }}>
                    <View
                        style={{
                            flex: 2,
                            padding: 8,
                        }}>
                        <Text style={{ fontSize: 18, fontWeight: '100' }}>{name}</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 8,
                            padding: 8,
                            borderColor: '#696969',
                            borderLeftWidth: 2,
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap',
                        }}>
                        <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
                            <Entypo name="calendar" size={14} style={{ width: 14, height: 14, marginRight: 4 }}/>
                            <Text style={{ fontSize: 14, fontWeight: '200' }}>
                                {moment(startDate).format('HH:mm')} - {moment(endDate).format('HH:mm')}
                            </Text>
                        </View>
                        {location && (
                            <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                                <Entypo name="location" size={14} style={{ width: 14, height: 14, marginRight: 4 }}/>
                                <Text style={{ fontSize: 14, fontWeight: '200' }}>{location}</Text>
                            </View>
                        )}
                        {category && (
                            <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                                <Entypo name="tag" size={14} style={{ width: 14, height: 14, marginRight: 4 }}/>
                                <Text style={{ fontSize: 14, fontWeight: '200' }}>{category}</Text>
                            </View>
                        )}
                        {lang && (
                            <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                                <MaterialCommunityIcons name="voice" size={14} style={{ width: 14, height: 14, marginRight: 4 }}/>
                                <Text style={{ fontSize: 14, fontWeight: '200' }}>{TalkRow.getFlag(lang)}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
