import React, { useState } from "react"
import { KeyboardAvoidingView, TextInput } from "react-native";
import { Text, StyleSheet , View} from "react-native";

import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { sendOtp } from '../../../services/userService'
import { useRouter } from "expo-router";

const VerifyEmailForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');

    const handleOnSendOtp = async () => {
       try {
        console.log("inside otp method")
        const response = await sendOtp(email);
        console.log("response otp: ", response)
        if (!response.success) {
           alert("Failed to sent OTP: " + response.message);
           return;
        }
        alert("OTP Sent: " + response.message);
        router.push(`/verifyEmail/verifyOTP?email=${email}`);

       } catch (error:any) {
        alert("Error Sending OTP: " + error.response.data.message);
       }   
    };

    return(
      <KeyboardAvoidingView style={styles.container}>
          <Text style={styles.title}>
              VERIFY YOUR Email
          </Text>
          <View>
                <TextInput
                    style={styles.input}
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
      </KeyboardAvoidingView>
    )
}

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
        textAlign: 'center'
    },
    input: {
        borderColor: COLORS.borderSub,
        borderWidth: 1,
        borderRadius: SIZE.buttonRadiusSmall,
        marginBottom: 15,
        paddingVertical: SIZE.VerticlePaddingSmall,
        paddingHorizontal: SIZE.HorizontalPaddingSmall,
    },
    sendOtpButton: {
        marginTop: 30,
        marginBottom: 20
    }

});


export default VerifyEmailForm;