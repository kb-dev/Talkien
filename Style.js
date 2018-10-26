import { Platform } from 'react-native';

const Theme = {
    colors: {
        primary: '#ff602c',
        secondary: '#ff754c',
        background: '#ededed',
        border: '#5b5b5b',
        disabledIcon: '#808080',
        icon: '#ff3c3c',
        font: '#FFF',
        greyBackground: 'transparent',
        listBackground: '#ffb996',
        iconColor: '#ff3c3c',
        link: '#0dadb0',
    },
    gradient: {
        start: '#FF852E',
        middle: '#E54646',
        end: '#E049A6',
    },
    font: {
        light: {
            fontWeight: '200',
            fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
        },
    },
};

const Gradient = {
    default: {
        colors: ['#0590D5', '#DF1A80'],
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
            color: Theme.colors.font,
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
            height: 1,
        },
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.3)',
        borderRadius: 2,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.font,
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
        color: Theme.colors.font,
    },
    date: {
        fontSize: 14,
        fontWeight: '200',
        color: Theme.colors.font,
        paddingTop: 8,
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    },
};

const BackButton = {
    view: {
        paddingLeft: 16,
        paddingRight: 32,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: Theme.colors.font,
    },
};

const StatusBar = {
    backgroundColor: Theme.colors.primary,
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
        color: Theme.colors.font,
    },
    titleView: {
        marginBottom: 4,
    },
};

const Program = {
    containerView: {
        flex: 1,
    },
    view: {
        flex: 1,
        paddingHorizontal: 40,
    },
};

const Event = {
    containerView: {
        flex: 1,
    },
    view: {
        flex: 1,
        paddingHorizontal: 40,
    },
    titleView: {
        paddingTop: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: '200',
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
        color: Theme.colors.font,
    },
    descriptionView: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.3)',
        borderRadius: 2,
        padding: 12,
    },
    button: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.3)',
        borderRadius: 2,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationView: {
        marginVertical: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.3)',
        borderRadius: 2,
    },
    locationText: {
        padding: 12,
    },
    dateView: {
        marginBottom: 8,
    },
    defaultText: {
        color: Theme.colors.font,
    },
    date: {
        fontWeight: '200',
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    },
    fullAddress: {
        fontWeight: '200',
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    },
};

const ActivityIndicator = {
    color: Theme.colors.font,
    style: {
        margin: 30,
    },
};

const NavBar = {
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: '#FFF',
    },
};

export default { Theme, About, Home, BackButton, StatusBar, Offline, Talk, Event, Program, EventRow, Gradient, ActivityIndicator, NavBar };
