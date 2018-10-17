import { Constants } from 'expo';

const Theme = {
    light: {
        primary: '#ff602c',
        secondary: '#ff754c',
        background: '#ededed',
        // background: '#ededed',
        border: '#5b5b5b',
        icon: '#ff3c3c',
        font: '#000',
        greyBackground: '#919191',
        listBackground: '#ffb996',
        iconColor: '#ff3c3c',
    },
    dark: {},
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
};

const BackButton = {
    paddingLeft: 16,
    paddingRight: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
};

const StatusBar = {
    paddingTop: Constants.statusBarHeight,
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
    },
    titleView: {
        marginBottom: 4,
    },
};

const Event = {
    view: {
        paddingBottom: 4,
    },
};

export default { Theme, About, Home, BackButton, StatusBar, Offline, Talk, Event };
