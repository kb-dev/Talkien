import React from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

import NavigationBar from 'react-native-navbar';
import PropTypes from 'prop-types';

import NavigationBackground from './NavigationBackground';

NavBar.propTypes = {
    leftButton: PropTypes.element,
    rightButton: PropTypes.element,
    title: PropTypes.string.isRequired,
};

export default function NavBar(props) {
    const { leftButton, rightButton, title } = props;

    const style = { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        titleStyle = {},
        containerStyle = {};
    if (Platform.OS === 'android') {
        containerStyle.marginTop = Constants.statusBarHeight;
        style.borderWidth = 0;
        style.borderColor = 'black';
        titleStyle.fontSize = 22;
        titleStyle.fontWeight = 'bold';
        titleStyle.textAlignVertical = 'top';
    }

    return (
        <NavigationBackground>
            <NavigationBar
                style={style}
                containerStyle={containerStyle}
                title={{ title, tintColor: 'white', style: titleStyle }}
                tintColor={'transparent'}
                leftButton={leftButton}
                rightButton={rightButton}
            />
        </NavigationBackground>
    );
}
