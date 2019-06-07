import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';

import style from '../../Style';
import { LinearGradient } from 'expo-linear-gradient';

moment.locale('fr');

export default class EventRow extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        name: PropTypes.string,
        data: PropTypes.object,
        topics: PropTypes.array,
        colors: PropTypes.array,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        openEvent: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    _onPress() {
        const { data } = this.props;
        requestAnimationFrame(() => {
            this.props.openEvent(data);
        });
    }

    render() {
        const { topics, name, colors, id } = this.props;
        let { startDate, endDate } = this.props;

        if (id === null) {
            return <View style={{ height: 60 }}/>;
        }

        startDate = moment(startDate);
        endDate = moment(endDate);

        let date = `Du ${startDate.format('DD MMM YYYY')} au ${endDate.format('DD MMM YYYY')}`;

        if (startDate.isSame(endDate, 'day')) {
            date = `${endDate.format('DD MMMM YYYY')}`;
        }

        return (
            <TouchableHighlight onPress={this._onPress} style={{ marginVertical: 8 }} underlayColor={style.Theme.overlayColor}>
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
            </TouchableHighlight>
        );
    }
}
