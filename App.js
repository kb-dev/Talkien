import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import { AppLoading, Asset, Font, SplashScreen } from 'expo';
import { Entypo, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
// UI elements
import DrawerButton from './components/buttons/DrawerButton';
import Split from './components/ui/Split';
import StatusBar from './components/ui/StatusBar';
// Views and navigation
import StackNavigator from './navigation/StackNavigator';
// Misc
import { toggleDarkMode } from './actions/toggleDarkMode';
import configureStore from './stores';
import { setStatusBar } from './Utils';
import style from './Style';

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchToggleDarkMode: () => {
            dispatch(toggleDarkMode());
        },
    };
};

const mapStateToProps = (state) => {
    return {
        themeName: state.darkMode.themeName,
    };
};

const CustomDrawerContentComponent = connect(
    mapStateToProps,
    mapDispatchToProps,
)((props) => {
    const { navigate } = props.navigation;
    const theme = style.Theme[props.themeName];

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        backgroundColor: theme.primary,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        alignContent: 'center',
                        height: 120,
                    }}>
                    <Image style={{ width: 72, height: 72, marginLeft: 8, marginTop: 16 }} source={require('./assets/talkien_android.png')}/>
                </View>
                <ScrollView style={{ backgroundColor: theme.background }}>
                    <View>
                        <Split lineColor={theme.border} onlyBottomMargin={true}/>
                        <DrawerButton
                            title={'Conférences'}
                            size={28}
                            textSize={14}
                            icon={'list'}
                            color={theme.icon}
                            fontColor={theme.font}
                            onPress={() => props.navigation.closeDrawer()}
                        />
                        <Split title="Application" lineColor={theme.border} color={theme.icon}/>
                        <DrawerButton
                            title={'À propos'}
                            size={28}
                            textSize={14}
                            icon={'info'}
                            color={theme.icon}
                            fontColor={theme.font}
                            onPress={() => navigate('About')}
                        />
                    </View>
                </ScrollView>
                <View
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderTopColor: theme.border,
                        borderTopWidth: 1,
                        backgroundColor: theme.background,
                    }}>
                    <TouchableOpacity onPress={props.dispatchToggleDarkMode}>
                        <MaterialCommunityIcons name="theme-light-dark" size={32} style={{ width: 32, height: 32, color: theme.icon }}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});

const Drawer = createDrawerNavigator(
    {
        Home: {
            screen: StackNavigator,
        },
    },
    {
        navigationOptions: ({ navigation }) => setStatusBar(navigation),
        contentComponent: CustomDrawerContentComponent,
    }
);

const { store, pStore } = configureStore();
const RNRedux = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={pStore}>
            <StatusBar/>
            <Drawer/>
        </PersistGate>
    </Provider>
);

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

export default class App extends React.Component {
    state = {
        isSplashReady: false,
    };

    constructor(props) {
        super(props);

        this._loadAssetsAsync = this._loadAssetsAsync.bind(this);
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

        return <RNRedux/>;
    }

    _loadAssetsAsync() {
        const imageAssets = cacheImages([require('./assets/talkien_android.png')]);

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
            SplashScreen.hide();
        });
    }
}
