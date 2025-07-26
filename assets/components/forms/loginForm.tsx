import React, { useState } from "react";
import { KeyboardAvoidingView, TextInput, ActivityIndicator, Text, StyleSheet, View } from "react-native";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { loginWithKeycloak } from "../../../services/authService";
import { navigate } from "../../../navigation/globalNavigation";
import { isPasswordValid } from '../../../util/validation'

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOnLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError('Username and password are required.');
            return;
        }

        const passwordValidationMessage = isPasswordValid(password);
        if (passwordValidationMessage) {
            setError(passwordValidationMessage);
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const responseData = await loginWithKeycloak(username, password);
            console.log("Access Token", responseData.access_token);
            navigate('/home/home');
        } catch (err) {
            console.error("Login Error : ", err);
            setError('Invalid Username or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.title}>LOGIN</Text>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={COLORS.textPlaceHolder}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={COLORS.textPlaceHolder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.loginButton}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.buttonOther} />
                ) : (
                    <SubmitButton
                        title="LOGIN"
                        onPress={handleOnLogin}
                        buttonColor={COLORS.buttonOther}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: SIZE.medium,
        color: COLORS.textDark,
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderColor: COLORS.borderSub,
        borderWidth: 1,
        borderRadius: SIZE.buttonRadiusSmall,
        marginBottom: 15,
        paddingVertical: SIZE.VerticlePaddingSmall,
        paddingHorizontal: SIZE.HorizontalPaddingSmall,
    },
    loginButton: {
        marginTop: 20,
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.errorText,
        backgroundColor: COLORS.errorBg,
        textAlign: 'center',
        fontSize: SIZE.small,
        padding: 3,
        borderWidth: 1,
        borderColor: COLORS.errorText,
        marginTop: 10,
        borderRadius: SIZE.buttonRadiusSmall
    },
});

export default LoginForm;
