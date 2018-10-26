import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';

import style from '../../Style';

moment.locale('fr');

export default class TalkRow extends React.PureComponent {
    static propTypes = {
        data: PropTypes.object.isRequired,
        openTalk: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    _onPress() {
        requestAnimationFrame(() => {
            this.props.openTalk(this.props.data.name, this.props.data);
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
        const { name, location, category, lang, description } = this.props.data;
        return (
            <TouchableOpacity onPress={this._onPress} style={{ marginHorizontal: 8, marginTop: 8 }}>
                <View
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 1,
                        shadowColor: 'rgba(0,0,0,0.3)',
                        borderRadius: 2,
                        padding: 12,
                    }}>
                    <Text style={[style.Theme.font.light, { fontSize: 14, color: style.Theme.colors.font }]}>{name}</Text>
                    <View style={{ paddingVertical: 8 }}>
                        <Text
                            style={[style.Theme.font.light, { fontSize: 14, color: style.Theme.colors.font }]}
                            numberOfLines={3}
                            ellipsizeMode={'tail'}>
                            {description}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {location && (
                            <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                                <Entypo
                                    name="location"
                                    size={14}
                                    style={{ width: 14, height: 14, marginRight: 4, color: style.Theme.colors.font }}
                                />
                                <Text style={[style.Theme.font.light, { fontSize: 14, color: style.Theme.colors.font }]}>{location}</Text>
                            </View>
                        )}
                        {category && (
                            <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                                <Entypo name="tag" size={14} style={{ width: 14, height: 14, marginRight: 4, color: style.Theme.colors.font }}/>
                                <Text style={[style.Theme.font.light, { fontSize: 14, color: style.Theme.colors.font }]}>{category}</Text>
                            </View>
                        )}
                        {lang && (
                            <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                                <MaterialCommunityIcons
                                    name="voice"
                                    size={14}
                                    style={{ width: 14, height: 14, marginRight: 4, color: style.Theme.colors.font }}
                                />
                                <Text style={{ fontSize: 14, fontWeight: '200' }}>{TalkRow.getFlag(lang)}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
