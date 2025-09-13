import { View, StyleSheet, Image } from 'react-native';
import STYLES from '@/constants/common.style';
import VerifyOtpFormComponent from '../../assets/components/forms/verifyOtpForm';
import { useLocalSearchParams } from "expo-router";

export default function VerifyOTP() {
  const { email } = useLocalSearchParams();

  const emailStr = Array.isArray(email) ? email[0] : email ?? "";

  return (
    <View style={STYLES.container}>
      <View style={styles.logoContainer}>
        <Image 
          style={STYLES.logo}
          source={require('../../assets/images/LogoLight.png')}
        />
      </View>
      <View style={styles.formContainer}>
        <VerifyOtpFormComponent email={emailStr} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 2,
    paddingHorizontal: 20,
    justifyContent: 'center',
  }
});
