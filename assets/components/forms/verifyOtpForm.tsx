import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { navigate } from "../../../navigation/globalNavigation";

const VerifyOtpForm = () => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOnVerifyOtp = () => {
    const enteredOtp = otp.join('');
    console.log("Entered OTP:", enteredOtp);
    navigate('/auth/signup')
  };

  const handleOnResentOtp = () => {
    const enteredOtp = otp.join('');
    console.log("Entered OTP:", enteredOtp);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>ENTER 4 DIGIT OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(index, value)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(index, nativeEvent.key)
            }
          />
        ))}
      </View>
      <View>
        <SubmitButton 
           title="VERIFY OTP" 
           onPress={handleOnVerifyOtp}
           buttonColor= {COLORS.buttonOther}
        />
      </View>
      <View style={styles.sendOtpButton}>
        <SubmitButton 
           title="Resend OTP"
           onPress={handleOnResentOtp}
           buttonColor={COLORS.white}
        />
      </View>
      <View>
        <Text style={styles.timer}>
            Timer
        </Text>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: SIZE.buttonRadiusSmall,
    textAlign: 'center',
    fontSize: SIZE.medium,
    borderColor: COLORS.borderSub,
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
  },
  sendOtpButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: COLORS.white
  },
  timer: {
     textAlign: 'center',
     fontSize: SIZE.small,
     color: COLORS.textHighlight,
     fontWeight: 'bold'
  }
});

export default VerifyOtpForm;
