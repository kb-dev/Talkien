import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'moment/locale/fr';

import style from '../Style';
import BackButton from '../components/buttons/BackButton';

moment.locale('fr');

class Calendar extends React.Component {
    static propTypes = {
        savedEvents: PropTypes.array,
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
    }

    render() {
        return (
            <View style={[style.Program.containerView]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                    <BackButton backAction={this.props.navigation.goBack} title={'Recherche'}/>
                </View>
                <View style={[style.Program.view]}>{JSON.stringify(this.props.savedEvents)}</View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        savedEvents: state.events,
    };
};

export default connect(mapStateToProps)(Calendar);
