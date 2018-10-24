import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';

import style from '../../Style';
import { LinearGradient } from 'expo';

moment.locale('fr');

export default class EventRow extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        topics: PropTypes.array,
        colors: PropTypes.array.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        calendarTitle: PropTypes.string.isRequired,
        calendarId: PropTypes.string,
        openEvent: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    _onPress() {
        const { name, id, startDate, endDate, calendarTitle, calendarId } = this.props;
        requestAnimationFrame(() => {
            this.props.openEvent(name, id, startDate, endDate, calendarTitle, calendarId);
        });
    }

    render() {
        const { topics, name, colors, calendarTitle } = this.props;
        let { startDate, endDate } = this.props;

        startDate = moment(startDate);
        endDate = moment(endDate);

        let date = `Du ${startDate.format('DD MMM YYYY')} au ${endDate.format('DD MMM YYYY')}`;

        if (startDate.isSame(endDate, 'day')) {
            date = `${endDate.format('DD MMMM YYYY')}`;
        }

        return (
            <TouchableOpacity onPress={this._onPress} style={{ marginVertical: 8 }}>
                <View style={style.EventRow.view}>
                    <View style={style.EventRow.nameView}>
                        <Text style={[style.EventRow.nameText, { color: colors[0] }]}>{name}</Text>
                        <LinearGradient colors={colors} start={[0, 0]} end={[1, 0]} style={style.EventRow.gradient}/>
                    </View>
                    <Text style={style.EventRow.topics} ellipsizeMode={'tail'} numberOfLines={2}>
                        {topics.join(', ')}
                    </Text>
                    <Text style={style.EventRow.date}>{date}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
