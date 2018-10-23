import { Platform } from 'react-native';

const Theme = {
    light: {
        primary: '#ff602c',
        secondary: '#ff754c',
        background: '#ededed',
        border: '#5b5b5b',
        icon: '#ff3c3c',
        font: '#000',
        greyBackground: '#919191',
        listBackground: '#ffb996',
        iconColor: '#ff3c3c',
    },
    dark: {},
    gradient: {
        start: '#ff852e',
        end: '#e049a6',
    },
};

// Views
const About = {
    title: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    view: {
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
        backgroundColor: 'transparent',
    },
    titleView: {
        marginTop: 80,
        marginBottom: 20,
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
    gradient: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Expo.Constants.statusBarHeight,
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
            marginTop: 12,
            marginBottom: 8,
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 2,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    nameText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
    gradient: {
        marginLeft: 8,
        flex: 1,
        height: 4,
    },
    topics: {
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
        fontSize: 12,
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
    },
    title: {
        fontSize: 24,
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

export default { Theme, About, Home, BackButton, StatusBar, Offline, Talk, Event, EventRow };
