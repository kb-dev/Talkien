import React from 'react';
import { Svg } from 'expo';

export default function CursorIcon() {
    return (
        <Svg
            height={14}
            width={36}
            viewBox="0 0 36 6"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            stroke-miterlimit="1.414">
            <Svg.Path
                d="M0 12.575v-2.042a6.752 6.752 0 0 1 4.444-6.345c.142-.047.288-.094.436-.157a31.962 31.962 0 0 1 22.176.173c.238.094.47.188.7.282A6.556 6.556 0 0 1 32 10.628v1.947H0z"
                fill="#fff"
            />
        </Svg>
    );
}
