import React from 'react';
import { Animated, BackHandler, Easing, Platform, SafeAreaView, StatusBar, TouchableOpacity, View } from 'react-native';
import { Constants, LinearGradient } from 'expo';
import { createAppContainer, createStackNavigator, NavigationActions } from 'react-navigation';
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
        defaultNavigationOptions: () => {
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

const AppContainer = createAppContainer(RootStack);

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

function getActiveColors(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveColors(route);
    }

    if (route.params && route.params.data) {
        return route.params.data.colors;
    }

    return style.Gradient.default.colors;
}

function zIndexWorkaround(val) {
    return Platform.select({
        ios: { zIndex: val },
        android: { elevation: val },
    });
}

export default class App extends React.Component {
    static router = RootStack.router;

    constructor(props) {
        super(props);
        this.state = {
            colors: style.Gradient.Home.colors,
            colorsLocation: style.Gradient.Home.locations,
            prevColors: style.Gradient.Home.colors,
            prevColorsLocation: style.Gradient.Home.locations,
            screen: 'Home',
            tweener: new Animated.Value(0),
            mustChangeColors: true,
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

    componentDidUpdate() {
        const { tweener } = this.state;

        if (this.state.mustChangeColors) {
            Animated.timing(tweener, { toValue: 0 }).start();
        } else {
            Animated.timing(tweener, { toValue: 1 }).start();
        }
    }

    render() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.screen !== 'Home') {
                this.navigator && this.navigator.dispatch(NavigationActions.back());
                return true;
            }
            return false;
        });

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
                        <SearchIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={true}
                        onPress={this._onPressCalendar}
                        style={[style.NavBar.button, { opacity: 0.5 }, this.state.screen === 'Calendar' ? selected : {}]}>
                        <CalendarIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._onPressSettings}
                        style={[style.NavBar.button, this.state.screen === 'About' ? selected : {}]}>
                        <SettingsIcon />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );

        if (this.state.screen === 'WebBrowser') {
            navBar = null;
        }

        const colorsOpacity = this.state.tweener.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 1],
        });
        const prevColorsOpacity = this.state.tweener.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1, 0],
        });

        return (
            <>
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        opacity: colorsOpacity,
                        ...zIndexWorkaround(-1),
                    }}>
                    <LinearGradient colors={this.state.colors} locations={this.state.colorsLocation} style={{ flex: 1 }} />
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        opacity: prevColorsOpacity,
                        ...zIndexWorkaround(1),
                    }}>
                    <LinearGradient colors={this.state.prevColors} locations={this.state.prevColorsLocation} style={{ flex: 1 }} />
                </Animated.View>

                <SafeAreaView
                    style={{
                        paddingTop: StatusBar.currentHeight,
                        flex: 1,
                        position: 'relative',
                        ...zIndexWorkaround(2),
                    }}>
                    <AppContainer
                        ref={(navigator) => (this.navigator = navigator)}
                        style={{ flex: 1 }}
                        onNavigationStateChange={(prevState, currentState) => {
                            const currentScreen = getActiveRouteName(currentState);
                            const prevScreen = getActiveRouteName(prevState);

                            if (prevScreen !== currentScreen) {
                                if (currentScreen === 'Home' || currentScreen === 'About') {
                                    return this.setState({
                                        screen: currentScreen,
                                        colors: this.state.mustChangeColors ? style.Gradient.Home.colors : this.state.colors,
                                        colorsLocation: this.state.mustChangeColors ? style.Gradient.Home.locations : this.state.colorsLocation,
                                        prevColors: this.state.mustChangeColors ? this.state.prevColors : style.Gradient.Home.colors,
                                        prevColorsLocation: this.state.mustChangeColors
                                            ? this.prevColorsLocation
                                            : style.Gradient.Home.locations,
                                        mustChangeColors: !this.state.mustChangeColors,
                                        tweener: this.state.mustChangeColors ? new Animated.Value(0) : new Animated.Value(1),
                                    });
                                }

                                this.setState({
                                    screen: currentScreen,
                                    colors: this.state.mustChangeColors ? getActiveColors(currentState) : this.state.colors,
                                    colorsLocation: this.state.mustChangeColors ? [0, 1] : this.state.colorsLocation,
                                    prevColors: this.state.mustChangeColors ? this.state.prevColors : getActiveColors(currentState),
                                    prevColorsLocation: this.state.mustChangeColors ? this.prevColorsLocation : [0, 1],
                                    mustChangeColors: !this.state.mustChangeColors,
                                    tweener: this.state.mustChangeColors ? new Animated.Value(0) : new Animated.Value(1),
                                });
                            }
                        }}
                    />
                    {navBar}
                </SafeAreaView>
            </>
        );
    }
}
