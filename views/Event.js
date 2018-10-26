import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MapView, Svg } from 'expo';

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
    constructor(props) {
        super(props);

        this.openProgram = this.openProgram.bind(this);
    }

    openProgram() {
        const { navigate } = this.props.navigation;
        const { name, id, startDate, endDate } = this.props.navigation.state.params.data;

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
        } = this.props.navigation.state.params.data;

        let start = moment(startDate);
        let end = moment(endDate);

        let date = `Du ${start.format('DD MMM YYYY')} au ${end.format('DD MMM YYYY')}`;

        if (start.isSame(end, 'day')) {
            date = `${end.format('DD MMMM YYYY')}`;
        }

        return (
            <View style={style.Event.containerView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
                    <BackButton backAction={this.props.navigation.goBack} title={'Recherche'}/>
                </View>
                <View style={style.Event.view}>
                    <View style={style.Event.titleView}>
                        <Text style={style.Event.title}>{name}</Text>
                    </View>
                    <View style={style.Event.descriptionView}>
                        <View style={style.Event.dateView}>
                            <Text style={[style.Event.defaultText, style.Event.date]}>{date}</Text>
                        </View>
                        <Text style={[style.Event.defaultText]}>{description}</Text>
                        <Text style={[style.Event.defaultText]}>{longDescription}</Text>
                        {url && <URLButton url="url" title="Site web" navigation={this.props.navigation}/>}
                        {bookingUrl && <URLButton url="bookingUrl" title="Réserver sa place" navigation={this.props.navigation}/>}
                    </View>
                    <View style={style.Event.locationView}>
                        <View style={style.Event.locationText}>
                            <Text style={[style.Event.defaultText]}>{address}</Text>
                            <Text style={[style.Event.defaultText, style.Event.fullAddress]}>{fullAddress}</Text>
                        </View>
                        <MapView
                            style={{ height: 206 }}
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
                                    <Svg height={24} width={18}>
                                        <Svg.Polygon points="0,0 9,24 18,0" fill="#E57373"/>
                                    </Svg>
                                </View>
                            </MapView.Marker>
                        </MapView>
                    </View>
                    <TouchableOpacity onPress={this.openProgram} style={{}}>
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
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
