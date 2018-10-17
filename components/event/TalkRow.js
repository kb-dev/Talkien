import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

export default class TalkRow extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        location: PropTypes.string,
        category: PropTypes.string,
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

    render() {
        const { name, location, startDate, endDate, category } = this.props;

        return (
            <TouchableOpacity onPress={this._onPress} style={{ marginHorizontal: 4, marginTop: 8 }}>
                <View
                    style={{
                        backgroundColor: '#FFF',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#696969',
                        flexDirection: 'row',
                        margin: 0,
                        paddingVertical: 8,
                    }}>
                    <View
                        style={{
                            flex: 1,
                            padding: 8,
                        }}>
                        <Text style={{ fontSize: 18, fontWeight: '100' }}>{name}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            marginLeft: 8,
                            padding: 8,
                            borderColor: '#696969',
                            borderLeftWidth: 2,
                            justifyContent: 'flex-start',
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
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
