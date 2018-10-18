import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

export default class EventRow extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        openEvent: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    _onPress(e) {
        requestAnimationFrame(() => {
            this.props.openEvent(this.props.name, this.props.id);
        });
    }

    render() {
        const { address, name } = this.props;
        let { startDate, endDate } = this.props;

        startDate = moment(startDate);
        endDate = moment(endDate);

        let date = `Du ${startDate.format('DD MMM YYYY')} au ${endDate.format('DD MMM YYYY')}`;

        if (startDate.isSame(endDate, 'day')) {
            date = `${endDate.format('DD MMMM YYYY')}`;
        }

        return (
            <TouchableOpacity onPress={this._onPress} style={{ marginHorizontal: 4, marginTop: 8 }}>
                <View
                    style={{
                        backgroundColor: '#FFF',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#696969',
                        padding: 4,
                        flexDirection: 'column',
                    }}>
                    <Text style={{ fontSize: 18, fontWeight: '100' }}>{name}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <Entypo name="location" size={14} style={{ width: 14, height: 14, marginRight: 4 }}/>
                        <Text style={{ fontSize: 14, fontWeight: '200' }}>{address}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
                        <Entypo name="calendar" size={14} style={{ width: 14, height: 14, marginRight: 4 }}/>
                        <Text style={{ fontSize: 14, fontWeight: '200' }}>{date}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
