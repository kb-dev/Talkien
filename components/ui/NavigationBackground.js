import React from 'react';
import { View } from 'react-native';

export default (props) => {
    return <View style={{ backgroundColor: 'transparent' }}>{props.children}</View>;
};
