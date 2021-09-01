import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';

// Views
import BottomTab from './bottomTab';
import Event from '../views/Event';
import Talk from '../views/Talk';
import Program from '../views/Program';
import Home from '../views/Home';
import About from '../views/About';
import Calendar from '../views/Calendar';
import WebBrowser from '../views/WebBrowser';

const { Navigator, Screen } = createStackNavigator();

const screenTransition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
        open: {
            animation: 'timing',
            config: { duration: 750, easing: Easing.inOut(Easing.poly(4)), useNativeDriver: true },
        },
        close: {
            animation: 'timing',
            config: { duration: 750, easing: Easing.inOut(Easing.poly(4)), useNativeDriver: true },
        },
    },
    cardStyleInterpolator: ({ current, next, layouts }) => {
        const width = layouts.screen.width;

        return {
            cardStyle: {
                transform: [
                    {
                        translateX: next
                            ? next.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -width],
                            })
                            : current.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [width, 0],
                            }),
                    },
                ],
            },
        };
    },
};

const RootStack = () => {
    return (
        <Navigator initialRouteName={Home} headerMode="screen" screenOptions={{ headerShown: false, ...screenTransition }}>
            <Screen name="Home" component={Home} options={{ backgroundColor: 'red' }} />
            <Screen name="Event" component={Event} />
            <Screen name="Talk" component={Talk} />
            <Screen name="Program" component={Program} />
            <Screen name="Calendar" component={Calendar} />
            <Screen name="About" component={About} />
            <Screen name="WebBrowser" component={WebBrowser} />
        </Navigator>
    );
};

export default class StackNavigator extends React.Component {
    static propTypes = {
        screen: PropTypes.string,
    };

    render() {
        return (
            <>
                <RootStack />
                <BottomTab screen={this.props.screen} />
            </>
        );
    }
}
