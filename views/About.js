import React from 'react';
import { Text, View } from 'react-native';
import NavigationBar from 'react-native-navbar';
import { connect } from 'react-redux';

import style from '../Style';
import URLButton from '../components/buttons/URLButton';
import BackButton from '../components/buttons/BackButton';
import NavigationBackground from '../components/ui/NavigationBackground';

export class About extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let title = 'À propos';
        let leftButton = <BackButton backAction={navigation.goBack}/>;
        return {
            title,
            header: (
                <NavigationBackground>
                    <NavigationBar title={{ title, tintColor: 'white' }} tintColor={'transparent'} leftButton={leftButton}/>
                </NavigationBackground>
            ),
        };
    };

    render() {
        const theme = style.Theme[this.props.themeName];

        return (
            <View style={{ flex: 1, backgroundColor: theme.background }}>
                <View style={style.about.view}>
                    <Text style={[style.about.title, { color: theme.font }]}>
                        {Expo.Constants.manifest.name} v{Expo.Constants.manifest.version}
                    </Text>
                    <View style={style.about.content}>
                        <Text style={{ color: theme.font }}>Cette application a été développée par KBDev SARL.</Text>
                    </View>

                    <Text style={[style.about.title, { color: theme.font }]}>Nous contacter</Text>
                    <View style={style.about.content}>
                        <URLButton url="https://kbdev.io" title="Site de l'entreprise" theme={theme}/>
                    </View>

                    <Text style={[style.about.title, { color: theme.font }]}>Mentions légales</Text>
                    <View style={style.about.content}>
                        <URLButton url="https://ukit-bordeaux.fr/policies/privacy" title="Politique de confidentialité" theme={theme}/>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    themeName: state.darkMode.themeName,
});

export default connect(mapStateToProps)(About);
