import React from 'react';
import { Animated, Easing, Platform, SafeAreaView, StatusBar, TouchableOpacity, View } from 'react-native';
import { Constants, LinearGradient } from 'expo';
import { createStackNavigator, NavigationActions } from 'react-navigation';
// Views
import Home from '../views/Home';
import About from '../views/About';
import Event from '../views/Event';
import Talk from '../views/Talk';
import Program from '../views/Program';
import WebBrowser from '../views/WebBrowser';
import Calendar from '../views/Calendar';
// Icons
import SearchIcon from '../components/icons/Search';
// Misc
import style from '../Style';
import CalendarIcon from '../components/icons/Calendar';
import SettingsIcon from '../components/icons/Settings';

const RootStack = createStackNavigator(
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
        Event: {
            screen: Event,
        },
        Program: {
            screen: Program,
        },
        Talk: {
            screen: Talk,
        },
        Calendar: {
            screen: Calendar,
        },
    },
    {
        initialRouteName: 'Home',
        navigationOptions: () => {
            return {
                header: null,
                gesturesEnabled: true,
            };
        },
        headerMode: 'none',
        transparentCard: true,
        transitionConfig: () => ({
            containerStyle: {},
            transitionSpec: {
                duration: 750,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
                useNativeDriver: true,
            },
            screenInterpolator: (sceneProps) => {
                const { layout, position, scene } = sceneProps;

                const thisSceneIndex = scene.index;
                const width = layout.initWidth;

                const translateX = position.interpolate({
                    inputRange: [thisSceneIndex - 1, thisSceneIndex],
                    outputRange: [width, 0],
                });

                return { transform: [{ translateX }] };
            },
        }),
    }
);

function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
}

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'Home',
        };

        this._onPressHome = this._onPressHome.bind(this);
        this._onPressCalendar = this._onPressCalendar.bind(this);
        this._onPressSettings = this._onPressSettings.bind(this);
    }

    _onPressHome() {
        requestAnimationFrame(() => {
            this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Home' }));
        });
    }

    _onPressCalendar() {
        requestAnimationFrame(() => {
            // this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Calendar' }));
        });
    }

    _onPressSettings() {
        requestAnimationFrame(() => {
            this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName: 'About' }));
        });
    }

    render() {
        let specificStyle = {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        };

        if (Platform.OS === 'ios') {
            if (Constants.deviceName === 'iPhone X' || Constants.deviceName === 'iPhone XS' || Constants.deviceName === 'iPhone XR') {
                specificStyle = {
                    borderRadius: 16,
                    paddingHorizontal: 16,
                };
            }
        }

        const selected = {
            borderBottomWidth: 4,
            borderBottomColor: '#FFF',
        };

        let navBar = (
            <SafeAreaView style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}>
                <View style={[style.NavBar.bar, specificStyle]}>
                    <TouchableOpacity onPress={this._onPressHome} style={[style.NavBar.button, this.state.screen === 'Home' ? selected : {}]}>
                        <SearchIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={true}
                        onPress={this._onPressCalendar}
                        style={[style.NavBar.button, { opacity: 0.5 }, this.state.screen === 'Calendar' ? selected : {}]}>
                        <CalendarIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._onPressSettings}
                        style={[style.NavBar.button, this.state.screen === 'About' ? selected : {}]}>
                        <SettingsIcon/>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );

        let gradientColors = style.Gradient.default.colors;
        let gradientLocation = style.Gradient.default.location;

        if (this.state.screen === 'Home' || this.state.screen === 'About') {
            gradientColors = style.Gradient.Home.colors;
            gradientLocation = style.Gradient.Home.location;
        } else if (this.state.screen === 'WebBrowser') {
            navBar = null;
        }

        return (
            <LinearGradient colors={gradientColors} locations={gradientLocation} style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
                <SafeAreaView style={{ flex: 1, position: 'relative' }}>
                    <RootStack
                        ref={(navigator) => (this.navigator = navigator)}
                        style={{ flex: 1 }}
                        onNavigationStateChange={(prevState, currentState) => {
                            const currentScreen = getActiveRouteName(currentState);
                            const prevScreen = getActiveRouteName(prevState);

                            if (prevScreen !== currentScreen) {
                                this.setState({ screen: currentScreen });
                            }
                        }}
                    />
                    {navBar}
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
