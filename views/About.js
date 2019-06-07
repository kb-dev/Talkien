import React from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo-constants';

import style from '../Style';
import URLButton from '../components/buttons/URLButton';
import BackButton from '../components/buttons/BackButton';

export default class About extends React.Component {
    render() {
        const color = style.Theme.colors.font;

        return (
            <View style={style.About.view}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                    <BackButton backAction={this.props.navigation.goBack} title={'Recherche'}/>
                </View>
                <View style={style.About.container}>
                    <Text style={[style.About.title, { color: style.Theme.colors.font }]}>
                        {Constants.manifest.name} v{Constants.manifest.version}
                    </Text>
                    <View style={style.About.content}>
                        <Text style={{ color }}>Cette application a été développée par KBDev SARL.</Text>
                    </View>

                    <Text style={[style.About.title, { color }]}>Nous contacter</Text>
                    <View style={style.About.content}>
                        <URLButton url="https://kbdev.io" title="Site de l'entreprise" navigation={this.props.navigation}/>
                    </View>

                    <Text style={[style.About.title, { color }]}>Mentions légales</Text>
                    <View style={style.About.content}>
                        <URLButton
                            url="https://github.com/kb-dev/Talkien/blob/master/PRIVACY.md"
                            title="Politique de confidentialité"
                            navigation={this.props.navigation}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
