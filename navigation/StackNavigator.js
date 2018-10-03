import React from 'react';
import { createStackNavigator } from 'react-navigation';
// Views
import Home from '../views/Home';
import About from '../views/About';
import WebBrowser from '../views/WebBrowser';
// Misc
import { setStatusBar } from '../Utils';

export default createStackNavigator(
    {
        Home: {
            screen: Home,
        },
        About: {
            screen: About,
        },
        WebBrowser: {
            screen: WebBrowser,
        },
    },
    {
        navigationOptions: ({ navigation }) => setStatusBar(navigation),
    },
);
