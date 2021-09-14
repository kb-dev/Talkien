import 'react-native-gesture-handler';

import React from 'react';
import { BackHandler, Image, StatusBar, Animated, Platform } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// UI elements
// Views and navigation
import { navigationRef } from './navigation/RootNavigation';
import StackNavigator from './navigation/StackNavigator';
// Misc
import configureStore from './stores';

import style from './Style';

const { store, pStore } = configureStore();

function cacheFonts(fonts) {
    return fonts.map((font) => Font.loadAsync(font));
}

function cacheImages(images) {
    return images.map((image) => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}

function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.name;
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

    if (route.params && route.params.data && route.params.data.colors) {
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
    constructor(props) {
        super(props);
        this.state = {
            isSplashReady: false,
            colors: style.Gradient.Home.colors,
            colorsLocation: style.Gradient.Home.locations,
            prevColors: style.Gradient.Home.colors,
            prevColorsLocation: style.Gradient.Home.locations,
            screen: 'Home',
            tweener: new Animated.Value(0),
            mustChangeColors: true,
        };
        this._loadAssetsAsync = this._loadAssetsAsync.bind(this);
        this.previousState = null;
    }

    componentDidUpdate() {
        const { tweener } = this.state;

        if (this.state.mustChangeColors) {
            Animated.timing(tweener, { toValue: 0, useNativeDriver: true }).start();
        } else {
            Animated.timing(tweener, { toValue: 1, useNativeDriver: true }).start();
        }
    }

    render() {
        if (!this.state.isSplashReady) {
            return (
                <AppLoading
                    startAsync={this._loadAssetsAsync}
                    onFinish={() => this.setState({ isSplashReady: true })}
                    onError={console.warn}
                    autoHideSplash={false}
                />
            );
        }

        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.screen !== 'Home') {
                navigationRef.dispatch(CommonActions.goBack());
                return true;
            }
            return false;
        });

        const colorsOpacity = this.state.tweener.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 1],
        });
        const prevColorsOpacity = this.state.tweener.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1, 0],
        });

        return (
            <SafeAreaProvider>
                <NavigationContainer
                    onStateChange={(currentState) => {
                        const currentScreen = getActiveRouteName(currentState);
                        const prevScreen = getActiveRouteName(this.previousState);

                        if (prevScreen !== currentScreen || prevScreen === 'Talk') {
                            if (currentScreen === 'Home' || currentScreen === 'About' || !currentScreen) {
                                return this.setState(
                                    {
                                        screen: currentScreen,
                                        colors: this.state.mustChangeColors ? style.Gradient.Home.colors : this.state.colors,
                                        colorsLocation: this.state.mustChangeColors ? style.Gradient.Home.locations : this.state.colorsLocation,
                                        prevColors: this.state.mustChangeColors ? this.state.prevColors : style.Gradient.Home.colors,
                                        prevColorsLocation: this.state.mustChangeColors
                                            ? this.prevColorsLocation
                                            : style.Gradient.Home.locations,
                                        mustChangeColors: !this.state.mustChangeColors,
                                        tweener: this.state.mustChangeColors ? new Animated.Value(0) : new Animated.Value(1),
                                    },
                                    () => {
                                        this.previousState = currentState;
                                    }
                                );
                            }

                            return this.setState(
                                {
                                    screen: currentScreen,
                                    colors: this.state.mustChangeColors ? getActiveColors(currentState) : this.state.colors,
                                    colorsLocation: this.state.mustChangeColors ? [0, 1] : this.state.colorsLocation,
                                    prevColors: this.state.mustChangeColors ? this.state.prevColors : getActiveColors(currentState),
                                    prevColorsLocation: this.state.mustChangeColors ? this.prevColorsLocation : [0, 1],
                                    mustChangeColors: !this.state.mustChangeColors,
                                    tweener: this.state.mustChangeColors ? new Animated.Value(0) : new Animated.Value(1),
                                },
                                () => {
                                    this.previousState = currentState;
                                }
                            );
                        }

                        this.previousState = currentState;
                    }}
                    theme={{ colors: { backgroundColor: 'transparent' } }}
                    ref={navigationRef}>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={pStore}>
                            <StatusBar barStyle={'light-content'} translucent={true} backgroundColor={'transparent'} />
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
                                    backgroundColor: this.state.colors,
                                    paddingTop: StatusBar.currentHeight,
                                    flex: 1,
                                    position: 'relative',
                                    ...zIndexWorkaround(2),
                                }}>
                                {this.onNavigationStateChange}
                                <StackNavigator screen={this.state.screen} />
                            </SafeAreaView>
                        </PersistGate>
                    </Provider>
                </NavigationContainer>
            </SafeAreaProvider>
        );
    }

    _loadAssetsAsync() {
        const imageAssets = cacheImages([require('./assets/gmaps.png')]);

        const fontAssets = cacheFonts([
            FontAwesome.font,
            Feather.font,
            Ionicons.font,
            MaterialCommunityIcons.font,
            MaterialIcons.font,
            SimpleLineIcons.font,
            Entypo.font,
        ]);

        Promise.all([...imageAssets, ...fontAssets]).then(() => {
            SplashScreen.hideAsync();
        });
    }
}
