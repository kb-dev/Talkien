import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default class URLButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.openURL = this.openURL.bind(this);
    }

    openURL() {
        this.props.navigation.navigate('WebBrowser', { href: this.props.url });
    }

    render() {
        const { theme } = this.props;

        return (
            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={this.openURL}>
                <Text style={{ color: theme.link }}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}
