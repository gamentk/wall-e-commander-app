import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

const ConnectCar = ({ topic, setTopicInput, onConnect, onDisconnect, isSubscribe }) => {
    function whenUnsubscribe() {
        return (
            <>
                <TextInput
                    placeholder="CAR TOPIC"
                    textAlign="center"
                    style={{
                        fontSize: 16,
                        height: 40,
                        borderRadius: 50,
                        padding: 10,
                        backgroundColor: '#FFF',
                        marginHorizontal: 100
                    }}
                    onChangeText={setTopicInput}
                />
                <TouchableOpacity
                    onPress={() => onConnect()}
                    style={{
                        alignSelf: 'center',
                        marginVertical: 15
                    }}
                >
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 20
                        }}
                    >
                        CONNECT
                    </Text>
                </TouchableOpacity>
            </>
        );
    }

    function whenSubScribe() {
        return (
            <View
                style={{
                    alignItems: 'center',
                    alignSelf: 'center'
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        color: '#FFF'
                    }}
                >
                    {topic}
                </Text>
                <TouchableOpacity
                    onPress={() => onDisconnect()}
                    style={{
                        marginVertical: 15
                    }}
                >
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 20
                        }}
                    >
                        Disconnect
                    </Text>
                </TouchableOpacity>
            </View >
        );
    }

    return (
        <>
            {(isSubscribe)
                ? whenSubScribe()
                : whenUnsubscribe()}
        </>
    );
}

export default ConnectCar;