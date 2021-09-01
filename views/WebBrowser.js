import React from 'react';
import { ActivityIndicator, Linking, Platform, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import NavigationBar from 'react-native-navbar';
import { withNavigation } from '@react-navigation/compat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import style from '../Style';
import BackButton from '../components/buttons/BackButton';

function treatTitle(str) {
    if (str.length > 18) {
        if (str.charAt(18) === ' ') {
            return `${str.substr(0, 18)}…`;
        }

        return `${str.substr(0, 18)} …`;
    }

    return str;
}

class WebBrowser extends React.Component {
    static propTypes = {
        route: PropTypes.object,
    };

    constructor(props) {
        super(props);

        let uri = 'https://kbdev.io';
        if (this.props.route.params) {
            const { href } = this.props.route.params;
            if (href) {
                uri = href;
            }
        }

        this.state = {
            title: null,
            url: '',
            uri,
            canGoBack: false,
            canGoForward: false,
            loading: true,
        };

        this.openURL = this.openURL.bind(this);
        this.onBack = this.onBack.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onForward = this.onForward.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
    }

    onRefresh() {
        this.webBrowser && this.webBrowser.reload();
    }

    onBack() {
        this.webBrowser && this.webBrowser.goBack();
    }

    onForward() {
        this.webBrowser && this.webBrowser.goForward();
    }

    openURL() {
        Linking.canOpenURL(this.state.url)
            .then((supported) => {
                if (!supported) {
                    console.warn(`Can't handle url: ${this.state.url}`);
                } else {
                    return Linking.openURL(this.state.url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }

    renderLoading() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: style.Theme.colors.greyBackground }}>
                <ActivityIndicator size="large" color={style.Theme.colors.iconColor} />
            </View>
        );
    }

    render() {
        if (this.state.uri === null) {
            return this.renderLoading();
        }
        const leftButton = <BackButton backAction={this.props.navigation.goBack} />;

        let javascript = null;
        if (Platform.OS !== 'ios') {
            javascript = 'window.scrollTo(0,0);';
        }

        const barSize = 40;

        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <NavigationBar
                    title={{ title: treatTitle(String(this.state.title)), tintColor: '#FFF' }}
                    tintColor={'transparent'}
                    leftButton={leftButton}
                    statusBar={{ style: 'light-content', hidden: true }}
                />
                <WebView
                    ref={(webBrowser) => (this.webBrowser = webBrowser)}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={this.renderLoading}
                    injectedJavaScript={javascript}
                    onNavigationStateChange={(e) => {
                        if (!e.loading) {
                            this.setState({ url: e.url, title: e.title, canGoBack: e.canGoBack, loading: e.loading });
                        }
                    }}
                    source={{ uri: this.state.uri }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor: style.Theme.colors.background,
                    }}>
                    <TouchableOpacity disabled={!this.state.canGoBack} onPress={this.onBack}>
                        <MaterialIcons
                            name="navigate-before"
                            size={barSize}
                            style={{
                                color: this.state.canGoBack ? style.Theme.colors.icon : style.Theme.colors.disabledIcon,
                                height: barSize,
                                width: barSize,
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.canGoForward} onPress={this.onForward}>
                        <MaterialIcons
                            name="navigate-next"
                            size={barSize}
                            style={{
                                color: this.state.canGoForward ? style.Theme.colors.icon : style.Theme.colors.disabledIcon,
                                height: barSize,
                                width: barSize,
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity disabled={this.state.loading} onPress={this.onRefresh}>
                        <MaterialIcons
                            name="refresh"
                            size={barSize}
                            style={{
                                color: this.state.loading ? style.Theme.colors.disabledIcon : style.Theme.colors.icon,
                                height: barSize,
                                width: barSize,
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this.openURL}
                        style={{
                            paddingRight: 16,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View>
                            {Platform.OS === 'ios' ? (
                                <MaterialCommunityIcons
                                    name="apple-safari"
                                    size={barSize}
                                    style={{ color: style.Theme.colors.icon, height: barSize, width: barSize }}
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="google-chrome"
                                    size={barSize}
                                    style={{ color: style.Theme.colors.icon, height: barSize, width: barSize }}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default withNavigation(WebBrowser);
