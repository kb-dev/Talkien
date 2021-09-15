import React from 'react';
import { Image, Linking, Text, TouchableHighlight, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import { Polygon, Svg } from 'react-native-svg';

import style from '../Style';
import moment from 'moment';
import BackButton from '../components/buttons/BackButton';
import URLButton from '../components/buttons/URLButton';
import { Ionicons } from '@expo/vector-icons';

const mapStyle = [
    {
        featureType: 'landscape.man_made',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#ff0000',
            },
        ],
    },
    {
        featureType: 'landscape.man_made',
        elementType: 'labels',
        stylers: [
            {
                color: '#ff0000',
            },
        ],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#000000',
            },
        ],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.stroke',
        stylers: [
            {
                color: '#ffffff',
            },
        ],
    },
];

export default class Event extends React.PureComponent {
    static propTypes = {
        route: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.openProgram = this.openProgram.bind(this);
        this.onPressGoogleMaps = this.onPressGoogleMaps.bind(this);
    }

    onPressGoogleMaps() {
        const { latitude, longitude } = this.props.route.data.location;
        const link = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        Linking.canOpenURL(link)
            .then((supported) => {
                if (!supported) {
                    console.warn(`Can't handle url: ${link}`);
                } else {
                    return Linking.openURL(link);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }

    openProgram() {
        const { navigate } = this.props.navigation;
        const { name, id, startDate, endDate } = this.props.route.params.data;

        navigate('Program', {
            name,
            id,
            startDate,
            endDate,
        });
    }

    render() {
        const {
            name,
            address,
            fullAddress,
            description,
            longDescription,
            url,
            bookingUrl,
            location,
            endDate,
            startDate,
            online,
        } = this.props.route.params.data;

        const start = moment(startDate);
        const end = moment(endDate);

        let date = `Du ${start.format('DD MMM YYYY')} au ${end.format('DD MMM YYYY')}`;

        if (start.isSame(end, 'day')) {
            date = `${end.format('DD MMMM YYYY')}`;
        }

        return (
            <View style={style.Event.containerView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                    <BackButton backAction={this.props.navigation.goBack} title={'Recherche'} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={style.Event.titleView}>
                        <Text style={style.Event.title}>{name}</Text>
                    </View>
                    {online === true ? (
                        <View style={style.Event.tagView}>
                            <LinearGradient colors={['#E54646', '#7669C0']} start={[0, 0]} end={[1, 0]}>
                                <Text style={style.Event.tag}>{'Online'}</Text>
                            </LinearGradient>
                        </View>
                    ) : (
                        <Text>{''}</Text>
                    )}
                </View>
                <View style={style.Event.view}>
                    <View style={style.Event.descriptionView}>
                        <View style={style.Event.dateView}>
                            <Text style={[style.Event.defaultText, style.Event.date]}>{date}</Text>
                        </View>
                        <Text style={[style.Event.defaultText]}>{description}</Text>
                        <Text style={[style.Event.defaultText]} numberOfLines={4} ellipsizeMode={'tail'}>
                            {longDescription}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            {url ? <URLButton url={url} title="Site web" navigation={this.props.navigation} /> : null}
                            {bookingUrl ? <URLButton url={bookingUrl} title="Réserver sa place" navigation={this.props.navigation} /> : null}
                        </View>
                    </View>
                    {location ? (
                        <View style={style.Event.locationView}>
                            <View style={style.Event.locationText}>
                                <Text style={[style.Event.defaultText]}>{address}</Text>
                                <Text style={[style.Event.defaultText, style.Event.fullAddress]}>{fullAddress}</Text>
                            </View>
                            <View style={{ flexGrow: 1, position: 'relative' }}>
                                <MapView
                                    style={{ height: 10, flexGrow: 1 }}
                                    provider={MapView.PROVIDER_GOOGLE}
                                    initialRegion={{
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                        latitudeDelta: 0.0025,
                                        longitudeDelta: 0.0025,
                                    }}
                                    customMapStyle={mapStyle}
                                    showsMyLocationButton={false}
                                    loadingEnabled={true}
                                    showsCompass={true}>
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: location.latitude,
                                            longitude: location.longitude,
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                            }}>
                                            <View
                                                style={{
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    backgroundColor: style.Theme.colors.primary,
                                                    padding: 10,
                                                    borderRadius: 30,
                                                }}>
                                                <View style={{ height: 12, width: 12, backgroundColor: '#FFF', borderRadius: 20 }} />
                                            </View>
                                            <Svg height={12} width={8} style={{ marginTop: -1 }}>
                                                <Polygon points="0,0 4,12 8,0" fill={style.Theme.colors.primary} />
                                            </Svg>
                                        </View>
                                    </MapView.Marker>
                                </MapView>
                                <View style={{ position: 'absolute', top: 0, right: 0 }}>
                                    <TouchableHighlight
                                        underlayColor={style.Theme.overlayColor}
                                        onPress={this.onPressGoogleMaps}
                                        style={{ alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.5)', margin: 4, padding: 4 }}>
                                        <Image style={{ width: 32, height: 32 }} source={require('../assets/gmaps.png')} />
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <WebView source={{ uri: url }} style={style.Event.locationView} />
                    )}
                    <TouchableHighlight onPress={this.openProgram} underlayColor={style.Theme.overlayColor}>
                        <View style={style.Event.button}>
                            <Text style={style.Event.defaultText}>Voir le programme</Text>
                            <Ionicons
                                name={'ios-arrow-forward'}
                                size={22}
                                style={{
                                    color: style.Theme.colors.font,
                                    height: 22,
                                    width: 22,
                                }}
                            />
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
