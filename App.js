import React from 'react';
import { Image } from 'react-native';
import { AppLoading, Asset, Font, SplashScreen } from 'expo';
import { Entypo, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
// UI elements
import StatusBar from './components/ui/StatusBar';
// Views and navigation
import StackNavigator from './navigation/StackNavigator';
// Misc
import configureStore from './stores';


const { store, pStore } = configureStore();
const RNRedux = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={pStore}>
            <StatusBar/>
            <StackNavigator/>
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
