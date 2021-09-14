import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { cleanMarkdown } from '../../Utils';

import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';

import style from '../../Style';

moment.locale('fr');

function getFlag(lang) {
    switch (lang.toLocaleLowerCase()) {
        case 'fr_fr':
            return 'Français';
        case 'en_en':
            return 'English';
        default:
            return lang;
    }
}

const TalkRow = (props) => {
    const _onPress = () => {
        requestAnimationFrame(() => {
            props.openTalk(props.data.name, props.data, props.isSaved);
        });
    };

    const { name, location, category, lang } = props.data;
    let { description } = props.data;
    if (description) {
        description = cleanMarkdown(description);
    }

    let marginBottom = 0;
    if (props.isLast) {
        marginBottom = 60;
    }

    let savedStyle = { borderColor: 'transparent', borderWidth: 1 };
    if (props.isSaved) {
        savedStyle = { borderColor: '#FFD700', borderWidth: 1 };
    }

    return (
        <TouchableHighlight underlayColor={style.Theme.overlayColor} onPress={_onPress} style={[{ marginHorizontal: 28 }, { marginBottom }]}>
            <View style={[style.TalkRow.view, savedStyle]}>
                <Text style={[{ fontSize: 16, color: style.Theme.colors.font }]}>{name}</Text>
                {description && (
                    <View style={{ paddingVertical: 8 }}>
                        <Text
                            style={[style.Theme.font.light, { fontSize: 14, color: style.Theme.colors.font }]}
                            numberOfLines={3}
                            ellipsizeMode={'tail'}>
                            {description}
                        </Text>
                    </View>
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        alignSelf: 'stretch',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
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
                            <Entypo name="tag" size={14} style={{ width: 14, height: 14, marginRight: 4, color: style.Theme.colors.font }} />
                            <Text style={[style.Theme.font.light, { fontSize: 14, color: style.Theme.colors.font }]}>{category}</Text>
                        </View>
                    )}
                    {lang && (
                        <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name="bullhorn-outline"
                                size={14}
                                style={{ width: 14, height: 14, marginRight: 4, color: style.Theme.colors.font }}
                            />
                            <Text style={{ fontSize: 14, fontWeight: '200', color: '#FFF' }}>{getFlag(lang)}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableHighlight>
    );
};

TalkRow.propTypes = {
    data: PropTypes.object.isRequired,
    openTalk: PropTypes.func.isRequired,
    isSaved: PropTypes.bool.isRequired,
    isLast: PropTypes.bool,
};

export default TalkRow;
