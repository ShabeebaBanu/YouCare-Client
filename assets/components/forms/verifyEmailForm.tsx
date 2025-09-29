import React, { useState } from "react";
import { KeyboardAvoidingView, TextInput, StyleSheet, View, Text } from "react-native";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import { sendOtp } from '../../../services/userService';
import { useRouter } from "expo-router";
import CustomAlert from "@/constants/customAlert"; 
import { isValidEmail } from "@/util/validation";

const VerifyEmailForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleOnSendOtp = async () => {
    const emailValidation = isValidEmail(email);
    if (!emailValidation) {
      showAlert("Error", "Invalid Email Format");
      return;
    }

    try {
      const response = await sendOtp(email);

      if (!response.success) {
        showAlert("Error", response.message || "Failed to send OTP ");
        return;
      }

      showAlert("Success", response.message || "OTP Sent");
      router.push(`/verifyEmail/verifyOTP?email=${email}`);

    } catch (error: any) {
      showAlert("Error", error?.message || "Error Sending OTP");
    }   
  };

  return(
    <KeyboardAvoidingView style={styles.container}>
      <Text style={STYLES.formTitle}>
        VERIFY YOUR Email
      </Text>
      <View>
        <TextInput
          style={STYLES.input}
          placeholder="Email"
          placeholderTextColor={COLORS.textPlaceHolder}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.sendOtpButton}>
        <SubmitButton
          title="SEND OTP"
          onPress={handleOnSendOtp}
          buttonColor={COLORS.buttonOther}
        />
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  sendOtpButton: {
    marginTop: 30,
    marginBottom: 20
  }
});

export default VerifyEmailForm;
