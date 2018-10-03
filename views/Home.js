import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import NavigationBar from 'react-native-navbar';
// UI
import NavigationBackground from '../components/ui/NavigationBackground';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

class Home extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let title = 'Conférences';
        return {
            drawerLabel: title,
            title,
            header: (
                <NavigationBackground>
                    <NavigationBar
                        title={{ title, tintColor: 'white' }}
                        tintColor={'transparent'}
                        leftButton={
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.openDrawer();
                                }}
                                style={{
                                    justifyContent: 'space-around',
                                    paddingLeft: 16,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                    <MaterialCommunityIcons
                                        name="menu"
                                        size={32}
                                        style={{
                                            color: 'white',
                                            height: 32,
                                            width: 32,
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </NavigationBackground>
            ),
        };
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text>Hello World</Text>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeName: state.darkMode.themeName,
    };
};

export default connect(mapStateToProps)(Home);
