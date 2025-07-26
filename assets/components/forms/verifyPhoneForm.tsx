import React, { useState } from "react"
import { KeyboardAvoidingView, TextInput } from "react-native";
import { Text, StyleSheet , View} from "react-native";
import { useRouter } from "expo-router";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { navigate } from "../../../navigation/globalNavigation";

const VerifyPhoneForm = () => {
    const router = useRouter();
    const [phone, setPhone] = useState('');

    const handleOnSendOtp = () => {
       navigate("/verifyPhone/verifyOTP");
    };

    return(
      <KeyboardAvoidingView style={styles.container}>
          <Text style={styles.title}>
              VERIFY YOUR PHONE NUMBER
          </Text>
          <View>
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor={COLORS.textPlaceHolder}
                    value={phone}
                    onChangeText={setPhone}
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


export default VerifyPhoneForm;