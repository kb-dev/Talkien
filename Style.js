import { Platform, StyleSheet } from 'react-native';

const Palette = {
    white: '#FFF',
    black: '#000',
    blue: '#0dadb0',
    orange: '#FF852E',
    pink: '#E049A6',
};

const Theme = {
    colors: {
        primary: '#ff602c',
        secondary: '#ff754c',
        background: '#ededed',
        border: '#5b5b5b',
        disabledIcon: '#808080',
        icon: '#ff3c3c',
        font: Palette.white,
        greyBackground: 'transparent',
        listBackground: '#ffb996',
        iconColor: '#ff3c3c',
        link: Palette.blue,
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
    overlayColor: 'rgba(0,0,0,0.4)',
};

const Block = {
    style: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.3)',
        borderRadius: 2,
    },
    overlayColor: 'rgba(0,0,0,0.4)',
};

const StatusBar = {
    backgroundColor: Theme.colors.primary,
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
const About = StyleSheet.create({
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
});

const Home = StyleSheet.create({
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
        ...Theme.font.light,
        fontSize: 32,
        textAlign: 'center',
        color: Theme.colors.font,
    },
    searchView: {
        alignSelf: 'stretch',
    },
    searchInput: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: Theme.colors.font,
    },
    eventsTitleView: {
        marginTop: 24,
        marginBottom: 4,
    },
    eventsTitleText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Theme.colors.font,
    },
});

const EventRow = StyleSheet.create({
    view: {
        ...Block.style,
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
        ...Theme.font.light,
        height: 36,
        fontSize: 12,
        lineHeight: 16,
        color: Theme.colors.font,
    },
    date: {
        ...Theme.font.light,
        fontSize: 14,
        color: Theme.colors.font,
        paddingTop: 8,
    },
});

const BackButton = StyleSheet.create({
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
});

const Offline = StyleSheet.create({
    text: {
        textAlign: 'center',
        fontSize: 12,
        fontStyle: 'italic',
    },
});

const Talk = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
    view: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: Theme.colors.font,
    },
    titleView: {
        marginBottom: 4,
    },
});

const Program = StyleSheet.create({
    containerView: {
        flex: 1,
    },
    view: {
        flex: 1,
        paddingHorizontal: 20,
    },
});

const Event = StyleSheet.create({
    containerView: {
        flex: 1,
    },
    view: {
        flex: 1,
        paddingHorizontal: 20,
    },
    titleView: {
        paddingTop: 24,
        paddingBottom: 16,
    },
    title: {
        ...Theme.font.light,
        fontSize: 36,
        color: Theme.colors.font,
    },
    descriptionView: {
        ...Block.style,
        padding: 12,
    },
    button: {
        ...Block.style,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationView: {
        ...Block.style,
        marginVertical: 12,
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
        ...Theme.font.light,
    },
    fullAddress: {
        ...Theme.font.light,
    },
});

const ActivityIndicator = {
    color: Theme.colors.font,
    style: {
        margin: 30,
    },
};

const NavBar = StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: Palette.white,
    },
    view: {
        padding: 4,
    },
});

export default { Theme, About, Home, BackButton, StatusBar, Offline, Talk, Event, Program, EventRow, Gradient, ActivityIndicator, NavBar };
