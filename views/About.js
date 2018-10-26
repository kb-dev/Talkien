import React from 'react';
import { Text, View } from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';

import style from '../Style';
import URLButton from '../components/buttons/URLButton';

export class About extends React.Component {
    render() {
        const color = style.Theme.colors.font;

        return (
            <View style={style.About.view}>
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
        );
    }
}

const mapStateToProps = (state) => ({
    themeName: state.darkMode.themeName,
});

export default connect(mapStateToProps)(About);
