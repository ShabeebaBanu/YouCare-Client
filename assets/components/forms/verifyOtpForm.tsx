import React, { useRef, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  StyleSheet,
  View,
} from "react-native";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { navigate } from "../../../navigation/globalNavigation";
import { sendOtp, verifyOtp } from "@/services/userService";
import { useRouter } from "expo-router";

interface VerifyEmailProp {
  email: string;
}

const VerifyOtpForm: React.FC<VerifyEmailProp> = ({ email }) => {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0); // store seconds remaining
  const inputRefs = useRef<TextInput[]>([]);

  // countdown logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // start timer when screen loads (if OTP is already sent)
  useEffect(() => {
    setTimeLeft(300); // start 5 min countdown immediately
  }, []);


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
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOnVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    try {
      const response = await verifyOtp(email, enteredOtp);
      // if (!response.status) {
      //   alert("Failed to Verify OTP: " + response.message);
      //   return;
      // }
      alert("OTP Verified: " + response.message);
      router.push(`/auth/signup?email=${email}`);
    } catch (error: any) {
      alert("Error Verfying OTP: " + error.response?.data?.message);
    }
  };

  const handleOnResentOtp = async () => {
    try {
      const response = await sendOtp(email);
      // if (!response.status) {
      //   alert("Failed to send OTP: " + response.message);
      // }
      alert("OTP Sent: " + response.message);
      setTimeLeft(300);
      return;
      
    } catch (error: any) {
      alert("Error Sending OTP: " + error.response?.data?.message);
    }
  };

  // format mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>
        ENTER 4 DIGIT OTP SENT TO{" "}
        <Text style={styles.emailText}>{email}</Text>
      </Text>

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
          buttonColor={COLORS.buttonOther}
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
      {timeLeft > 0 ? (
        <Text style={styles.timer}>Resend available in {formatTime(timeLeft)}</Text>
      ) : (
        <Text style={styles.timer}>You can request a new OTP</Text>
      )}
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: SIZE.medium,
    color: COLORS.textDark,
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: SIZE.buttonRadiusSmall,
    textAlign: "center",
    fontSize: SIZE.medium,
    borderColor: COLORS.borderSub,
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
  },
  sendOtpButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  timer: {
    textAlign: "center",
    fontSize: SIZE.small,
    color: COLORS.textHighlight,
    fontWeight: "bold",
  },
  emailText: {
    fontSize: SIZE.small,
    color: COLORS.textOption,
  },
});

export default VerifyOtpForm;
