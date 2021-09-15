import { Platform, StyleSheet } from 'react-native';

const Palette = {
    white: '#FFF',
    black: '#000',
    blue: '#0dadb0',
    darkBlue: '#304FFE',
    orange: '#FF852E',
    pink: '#E049A6',
    yellow: '#F49E4C',
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
        link: Palette.darkBlue,
        savedBackground: Palette.yellow,
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
        backgroundColor: 'rgba(0,0,0,0.45)',
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
    },
    container: {
        padding: 20,
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
        marginBottom: 76,
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
    button: {},
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
        marginBottom: 8,
    },
    tagView: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        width: 57,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    tag: {
        color: Theme.colors.font,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
    },
});

const BackButton = StyleSheet.create({
    view: {
        paddingLeft: 16,
        paddingRight: 32,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text: {
        paddingLeft: 12,
        fontSize: 22,
        color: Theme.colors.font,
    },
});

const SearchSelector = StyleSheet.create({
    view: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 15,
    },
    leftButton: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 30,
        paddingRight: 30,
    },
    activedLeftButton: {
        backgroundColor: '#E049A6',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 30,
        paddingRight: 30,
    },
    rightButton: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        paddingRight: 30,
        paddingLeft: 30,
    },
    activedRightButton: {
        backgroundColor: '#E049A6',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        paddingRight: 30,
        paddingLeft: 30,
    },
    text: {
        padding: 8,
        fontSize: 18,
        color: Theme.colors.font,
    },
    selectedButtonText: {
        padding: 8,
        fontSize: 18,
        color: Palette.darkBlue,
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
        marginBottom: 70,
    },
    title: {
        fontSize: 24,
        color: Theme.colors.font,
    },
    header: {
        paddingHorizontal: 20,
    },
    titleView: {
        marginBottom: 4,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    scrollView: {
        paddingHorizontal: 20,
    },
    description: {
        // ...Block.style,
        padding: 8,
        marginVertical: 8,
    },
    details: {
        paddingVertical: 8,
        paddingBottom: 72,
    },
    button: {
        backgroundColor: Palette.pink,
        position: 'absolute',
        bottom: 10,
        right: 8,
        padding: 8,
        borderRadius: 40,
        elevation: 2,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.3)',
    },
    hours: {
        fontSize: 18,
        color: Theme.colors.font,
    },
});

const Program = StyleSheet.create({
    containerView: {
        flex: 1,
    },
    view: {
        flex: 1,
        marginBottom: 70,
    },
});

const Event = StyleSheet.create({
    containerView: {
        flex: 1,
    },
    view: {
        flex: 1,
        paddingHorizontal: 20,
        marginBottom: 76,
    },
    titleView: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 20,
        paddingRight: 10,
    },
    title: {
        ...Theme.font.light,
        fontSize: 36,
        color: Theme.colors.font,
    },
    descriptionView: {
        ...Block.style,
        padding: 12,
        // flex: 1,
    },
    button: {
        ...Block.style,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // flex: 1,
    },
    locationView: {
        ...Block.style,
        marginVertical: 12,
        flex: 1,
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
    tagView: {
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 10,
        marginTop: 28,
        overflow: 'hidden',
        height: 26,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    tag: {
        color: Theme.colors.font,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18,
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
        bottom: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 8,
    },
    view: {
        padding: 4,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 23,
    },
});

const TalkRow = StyleSheet.create({
    view: {
        ...Block.style,
        padding: 12,
    },
});

export default {
    Theme,
    About,
    Home,
    BackButton,
    StatusBar,
    Offline,
    Talk,
    Event,
    Program,
    EventRow,
    Gradient,
    ActivityIndicator,
    NavBar,
    SearchSelector,
    TalkRow,
};
