const Theme = {
    light: {
        primary: '#ff602c',
        secondary: '#ff754c',
        background: '#ededed',
        border: '#5b5b5b',
        icon: '#ff3c3c',
        font: '#000',
        greyBackground: '#919191',
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

export default { Theme, About, Home, BackButton };
