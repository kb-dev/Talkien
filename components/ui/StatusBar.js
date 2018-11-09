import React from 'react';
import { StatusBar } from 'react-native';

import style from '../../Style';

export default class CustomStatusBar extends React.PureComponent {
    render() {
        return <StatusBar barStyle="light-content" backgroundColor={style.Theme.colors.secondary} style={style.StatusBar}/>;
    }
}

c;
