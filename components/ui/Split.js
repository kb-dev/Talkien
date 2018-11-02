import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

Split.propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    lineColor: PropTypes.string,
    noMargin: PropTypes.bool,
    onlyBottomMargin: PropTypes.bool,
};

export default function Split(props) {
    return (
        <View
            style={{
                marginVertical: props.noMargin || props.onlyBottomMargin ? 0 : 8,
            }}>
            <View
                style={{
                    borderBottomWidth: 1,
                    borderColor: props.lineColor,
                    marginBottom: props.noMargin ? 0 : 8,
                }}
            />
            {props.title && (
                <Text
                    style={{
                        color: props.color,
                        paddingLeft: 16,
                        fontWeight: 'bold',
                    }}>
                    {props.title}
                </Text>
            )}
        </View>
    );
}
