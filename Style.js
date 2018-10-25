import { Platform } from 'react-native';

const Theme = {
    light: {
        primary: '#ff602c',
        secondary: '#ff754c',
        background: '#ededed',
        border: '#5b5b5b',
        icon: '#ff3c3c',
        font: '#FFF',
        greyBackground: '#919191',
        listBackground: '#ffb996',
        iconColor: '#ff3c3c',
        link: '#103c81',
    },
    dark: {},
    gradient: {
        start: '#FF852E',
        middle: '#E54646',
        end: '#E049A6',
    },
};

const Gradient = {
    default: {
        colors: [],
        locations: undefined,
    },
    Home: {
        colors: ['#FF852E', '#E54646', '#E049A6'],
        locations: [0, 0.67, 1],
    },
};

// Views
const About = {
    title: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    view: {
        flex: 1,
        padding: 10,
    },
    content: {
        marginTop: 5,
        marginBottom: 15,
    },
};

const Home = {
    containerView: {
        margin: 20,
        marginTop: 30,
    },
    view: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    titleView: {
        marginTop: 60,
        marginBottom: 60,
        paddingHorizontal: 20,
        alignSelf: 'stretch',
    },
    titleText: {
        fontWeight: '100',
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
        fontSize: 32,
        textAlign: 'center',
        color: 'white',
    },
    search: {
        view: {
            alignSelf: 'stretch',
        },
        input: {
            backgroundColor: 'rgba(0,0,0,0.25)',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            color: '#FFF',
        },
    },
    nextEvents: {
        titleView: {
            marginTop: 24,
            marginBottom: 4,
        },
        titleText: {
            fontWeight: 'bold',
            fontSize: 18,
            color: 'white',
        },
    },
};

const EventRow = {
    view: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowColor: 'rgba(0,0,0,0.5)',
        borderRadius: 2,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    gradient: {
        marginLeft: 8,
        flex: 1,
        height: 4,
    },
    nameView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topics: {
        height: 36,
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '200',
        color: '#FFF',
    },
    date: {
        fontSize: 14,
        fontWeight: '200',
        color: '#FFF',
        paddingTop: 8,
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    },
};

const BackButton = {
    paddingLeft: 16,
    paddingRight: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
};

const StatusBar = {
    backgroundColor: Theme.light.primary,
};

const Offline = {
    text: {
        textAlign: 'center',
        fontSize: 12,
        fontStyle: 'italic',
    },
};

const Talk = {
    container: {
        flex: 1,
        padding: 8,
    },
    title: {
        fontSize: 24,
        color: '#FFF',
    },
    titleView: {
        marginBottom: 4,
    },
};

const Event = {
    view: {
        flex: 1,
    },
};

const ActivityIndicator = {
    color: '#FFF',
    style: {
        margin: 30,
    },
};

export default { Theme, About, Home, BackButton, StatusBar, Offline, Talk, Event, EventRow, Gradient, ActivityIndicator };
