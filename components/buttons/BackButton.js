import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import style from '../../Style';

export default class BackButton extends React.PureComponent {
    static propTypes = {
        backAction: PropTypes.func.isRequired,
        title: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    _onPress() {
        requestAnimationFrame(() => {
            this.props.backAction();
        });
    }

    render() {
        let title = null;
        if (this.props.title) {
            title = (
                <View>
                    <Text style={style.BackButton.text}>{this.props.title}</Text>
                </View>
            );
        }

        return (
            <TouchableHighlight onPress={this._onPress} underlayColor={'rgba(0,0,0,0.1)'}>
                <View style={style.BackButton.view}>
                    <Ionicons
                        name={'ios-arrow-back'}
                        size={35}
                        style={{
                            color: style.Theme.colors.font,
                            height: 36,
                            width: 32,
                        }}
                    />
                    {title}
                </View>
            </TouchableHighlight>
        );
    }
}
