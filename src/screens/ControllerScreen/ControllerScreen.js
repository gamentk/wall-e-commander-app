import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import ConnectCar from './ConnectCar';

import MQTT from 'sp-react-native-mqtt';
import uuid from 'react-native-uuid';

import Icon from 'react-native-vector-icons/AntDesign';
import { image } from '../../constants';

const MQTT_SERVER = 'broker.emqx.io';
const MQTT_PORT = 1883;
const MQTT_CLIENT_ID = uuid.v4();
const MQTT_TOPIC = '/NGAME_ESP32/control';

const ControllerScreen = () => {
    const [client, setClient] = useState(null);
    const [topicInput, setTopicInput] = useState('');
    const [isSubscribe, setIsSubscribe] = useState(false);
    const [wallDistance, setWallDistance] = useState("Safe");
    const [smokeValue, setSmokeValue] = useState("25");

    // Use Effect
    useEffect(() => {
        if (client === null) {
            initialMqtt(MQTT_SERVER, MQTT_PORT, MQTT_CLIENT_ID);
        }

        return () => {
            if (client !== null) {
                client.disconnect();
                setClient(null);
            } else {
                return;
            }
        }
    }, [client]);

    function initialMqtt(uri, port, clientId) {
        MQTT.createClient({
            uri: `mqtt://${uri}:${port}`,
            clientId
        }).then((client) => {
            client.on('closed', () => {
                console.log('mqtt.event.closed');
            });

            client.on('error', (msg) => {
                console.log('mqtt.event.error', msg);
            });

            client.on('message', (msg) => {
                console.log('mqtt.event.message', msg);

                if (msg.topic === '/SPY/distance') {
                    setWallDistance(msg.data);
                }

                if (msg.topic === '/SPY/smoke') {
                    setSmokeValue(msg.data);
                }
            });

            client.on('connect', () => {
                console.log('connected');

                client.subscribe('/SPY/distance', 0);
                client.subscribe('/SPY/smoke', 0);
                setClient(client);
            });

            client.connect();
        }).catch((error) => {
            console.log(error);
        });
    }

    function onConnect() {
        if (topicInput === '') {
            return;
        }
        client.subscribe(topicInput, 0);
        console.log(`Subscribe to ${topicInput}`);
        setIsSubscribe(true);
    }

    function onDisconnect() {
        client.disconnect();
        console.log(`Unsubscribe to ${topicInput}`);
        setIsSubscribe(false);
        setClient(null);
        setTopicInput('');
    }

    // Handle Press
    function onPressHandler(command) {
        client.publish(topicInput, command, 0, false);
    }

    // Render Left Side
    function renderLeft() {
        return (
            <View style={[styles.leftSide, { opacity: (isSubscribe) ? 1.0 : 0.1 }]}>
                {
                    (smokeValue === "Safe")
                        ? null
                        :
                        <View
                            style={{
                                position: 'absolute',
                                top: 30,
                                alignSelf: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: 'red',
                                    fontSize: 16
                                }}
                            >
                                SMOKE DETECT
                            </Text>
                            <Text
                                style={{
                                    color: 'red',
                                    fontSize: 26
                                }}
                            >
                                {smokeValue} ppm
                            </Text>
                        </View>
                }
                <TouchableOpacity
                    disabled={!isSubscribe}
                    onPressIn={() => onPressHandler('Left')}
                    onPressOut={() => onPressHandler('Stop')}
                >
                    <Icon
                        name="caretleft"
                        size={65}
                        color="#FFF"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={!isSubscribe}
                    onPressIn={() => onPressHandler('Right')}
                    onPressOut={() => onPressHandler('Stop')}
                >
                    <Icon
                        name="caretright"
                        size={65}
                        color="#FFF"
                    />
                </TouchableOpacity>
            </View>
        );
    }

    function renderCenter() {
        return (
            <View style={styles.center}>
                {
                    (wallDistance === "Safe")
                        ? null
                        :
                        <View
                            style={{
                                position: 'absolute',
                                top: 25,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Icon
                                name="up"
                                size={30}
                                color="red"
                            />
                            <Text
                                style={{
                                    color: 'red',
                                    fontSize: 26,
                                    textAlign: 'center'
                                }}
                            >
                                {wallDistance} cm
                            </Text>
                        </View>
                }
                <View
                    style={{
                        width: '50%',
                        height: '50%',
                        alignSelf: 'center',
                    }}
                >
                    <Image
                        source={image.F1Logo}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        resizeMode="contain"
                    />
                </View>
                <ConnectCar
                    topic={topicInput}
                    setTopicInput={setTopicInput}
                    onConnect={onConnect}
                    onDisconnect={onDisconnect}
                    isSubscribe={isSubscribe}
                />
            </View>
        );
    }

    function renderRight() {
        return (
            <View style={[styles.rightSide, { opacity: (isSubscribe) ? 1.0 : 0.1 }]}>
                <TouchableOpacity
                    disabled={!isSubscribe}
                    onPressIn={() => onPressHandler('Throttle')}
                    onPressOut={() => onPressHandler('Stop')}
                >
                    <Icon
                        name="caretup"
                        size={65}
                        color="#FFF"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={!isSubscribe}
                    onPressIn={() => onPressHandler('Reverse')}
                    onPressOut={() => onPressHandler('Stop')}
                >
                    <Icon
                        name="caretdown"
                        size={65}
                        color="#FFF"
                    />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderLeft()}
            {renderCenter()}
            {renderRight()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0A0908',
    },
    leftSide: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingVertical: 30
    },
    center: {
        flex: 3,
        justifyContent: 'center'
    },
    rightSide: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 30
    }
});

export default ControllerScreen;