import React from 'react';
import { G, Path, Svg, Text } from 'react-native-svg';
import moment from 'moment';

export default function CalendarIcon() {
    return (
        <Svg
            height={36}
            width={36}
            viewBox="0 0 52 52"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            stroke-miterlimit={1.5}>
            <G stroke="#fff">
                <Path
                    d="M2 6.014a4.014 4.014 0 0 1 4.013-4.015H45.93c1.063 0 2.083.42 2.835 1.175a4.019 4.019 0 0 1 1.174 2.84v39.945a3.981 3.981 0 0 1-3.977 3.98H6.042A4.041 4.041 0 0 1 2 45.898V6.014z"
                    fill="none"
                    strokeWidth="4.0029232"
                />
                <Path
                    d="M2 11.587h47.94V6.002a3.978 3.978 0 0 0-1.173-2.828 3.979 3.979 0 0 0-2.828-1.175H6c-1.062 0-2.08.42-2.829 1.175A3.978 3.978 0 0 0 2 6.002v5.585z"
                    fill="#fff"
                    strokeWidth=".9947383999999999"
                />
            </G>
            <Text textAnchor="middle" x="26" y="42" fontSize="32" fill="#FFF">
                {moment().format('DD')}
            </Text>
        </Svg>
    );
}
