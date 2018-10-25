import React from 'react';
import { Animated, Easing, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo';
import { SimpleLineIcons } from '@expo/vector-icons';
import { createStackNavigator, NavigationActions } from 'react-navigation';
// Views
import Home from '../views/Home';
import About from '../views/About';
import Event from '../views/Event';
import Talk from '../views/Talk';
import WebBrowser from '../views/WebBrowser';
// Misc
import { setStatusBar } from '../Utils';
import style from '../Style';

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
        Talk: {
            screen: Talk,
        },
    },
    {
        initialRouteName: 'Home',
        navigationOptions: ({ navigation }) => {
            setStatusBar(navigation);
            return {
                header: null,
                gesturesEnabled: true,
                gestureResponseDistance: { horizontal: 200, vertical: 150 },
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
            console.log('calendar');
        });
    }

    _onPressSettings() {
        requestAnimationFrame(() => {
            this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName: 'About' }));
        });
    }

    render() {
        let navBar = (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    alignSelf: 'center',
                    elevation: 1,
                }}>
                <View
                    style={{
                        backgroundColor: '#FD63B0',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,

                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                    }}>
                    <TouchableOpacity
                        onPress={this._onPressHome}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderColor: '#FFF',
                            borderBottomWidth: this.state.screen === 'Home' ? 4 : 0,
                        }}>
                        <SimpleLineIcons name="magnifier" size={24} style={{ color: '#FFF' }}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._onPressCalendar}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderColor: '#FFF',
                            borderBottomWidth: this.state.screen === 'Event' ? 4 : 0,
                        }}>
                        <SimpleLineIcons name="calendar" size={24} style={{ color: '#FFF' }}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._onPressSettings}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderColor: '#FFF',
                            borderBottomWidth: this.state.screen === 'About' ? 4 : 0,
                        }}>
                        <SimpleLineIcons name="settings" size={24} style={{ color: '#FFF' }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );

        if (this.state.screen === 'WebBrowser') {
            navBar = null;
        }

        return (
            <LinearGradient colors={style.Gradient.Home.colors} locations={style.Gradient.Home.locations} style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
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
