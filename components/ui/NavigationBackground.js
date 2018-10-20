import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({ themeName: state.darkMode.themeName });

export default connect(mapStateToProps)((props) => {
    return <View style={{ backgroundColor: 'transparent' }}>{props.children}</View>;
});
