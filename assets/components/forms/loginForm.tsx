import React, { useState } from "react";
import { KeyboardAvoidingView, TextInput, ActivityIndicator, Text, StyleSheet, View } from "react-native";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import { loginWithKeycloak, saveToken } from "../../../services/authService";
import { navigate } from "../../../navigation/globalNavigation";
import { isPasswordValid } from "../../../util/validation";
import CustomAlert from "@/constants/customAlert";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleOnLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setAlertTitle("Error");
      setAlertMessage("Username and password are required.");
      setAlertVisible(true);
      return;
    }

    const passwordValidationMessage = isPasswordValid(password);
    if (passwordValidationMessage) {
      setAlertTitle("Error");
      setAlertMessage(passwordValidationMessage);
      setAlertVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const responseData = await loginWithKeycloak(username, password);
      if (!responseData) {
        setAlertTitle("Error");
        setAlertMessage("Login Failed");
        setAlertVisible(true);
        return;
      }
      const token = responseData.data.access_token;
      await saveToken(token);

      setAlertTitle("Success");
      setAlertMessage("Login successful!");
      setAlertVisible(true);
    } catch (error: any) {

      setAlertTitle("Error");
      setAlertMessage(error.message || "Invalid Username or password. Please try again.");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={STYLES.formTitle}>LOGIN</Text>

      <View>
        <TextInput
          style={STYLES.input}
          placeholder="Username"
          placeholderTextColor={COLORS.textPlaceHolder}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={STYLES.input}
          placeholder="Password"
          placeholderTextColor={COLORS.textPlaceHolder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

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

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          if (alertTitle === "Success") {
            navigate("/home/home"); 
          }
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default LoginForm;
