import React from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PropTypes from 'prop-types';

import * as RootNavigation from './RootNavigation.js';
// Icons
import SearchIcon from '../components/icons/Search';
// Misc
import style from '../Style';
import CalendarIcon from '../components/icons/Calendar';
import SettingsIcon from '../components/icons/Settings';

export default class BottomTab extends React.Component {
    static propTypes = {
        screen: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    _onPressHome() {
        requestAnimationFrame(() => {
            RootNavigation.navigate('Home', {});
        });
    }

    _onPressCalendar() {
        requestAnimationFrame(() => {
            /*RootNavigation.navigate('Calendar', {});*/
        });
    }

    _onPressSettings() {
        requestAnimationFrame(() => {
            RootNavigation.navigate('About', {});
        });
    }

    render() {
        const selected = {
            borderBottomWidth: 4,
            borderBottomColor: '#FFF',
        };

        let specificStyle = {
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
        };

        if (Platform.isPad) {
            specificStyle = {
                paddingHorizontal: 12,
                maxHeight: 90,
                bottom: 5,
            };
        }

        return (
            <SafeAreaView style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}>
                {this.props.screen === 'WebBrowser' ? null : (
                    <>
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                opacity: 0.1,
                            }}
                        />
                        <View
                            style={{
                                ...style.NavBar.container,
                                ...specificStyle,
                            }}>
                            <TouchableOpacity
                                onPress={this._onPressHome}
                                style={[
                                    style.NavBar.button,
                                    specificStyle,
                                    this.props.screen === 'Home' ||
                                    this.props.screen === 'Event' ||
                                    this.props.screen === 'Program' ||
                                    this.props.screen === 'Talk'
                                        ? selected
                                        : {},
                                ]}>
                                <SearchIcon />
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={true}
                                onPress={this._onPressCalendar}
                                style={[style.NavBar.button, specificStyle, { opacity: 0.5 }, this.props.screen === 'Calendar' ? selected : {}]}>
                                <CalendarIcon />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this._onPressSettings}
                                style={[style.NavBar.button, specificStyle, this.props.screen === 'About' ? selected : {}]}>
                                <SettingsIcon />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </SafeAreaView>
        );
    }
}
