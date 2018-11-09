import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import style from '../../Style';

export default class URLButton extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.openURL = this.openURL.bind(this);
    }

    openURL() {
        this.props.navigation.navigate('WebBrowser', { href: this.props.url });
    }

    render() {
        return (
            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={this.openURL}>
                <Text style={{ color: style.Theme.colors.link, fontSize: 16 }}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}
