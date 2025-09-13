import { View, StyleSheet, Image} from 'react-native'
import STYLES from '@/constants/common.style'
import VerifyEmailForm from "../../assets/components/forms/verifyEmailForm"

export default function VerifyEmail() {
  return (
    <View style={STYLES.container}>
      <View style={styles.logoContainer}>
         <Image 
          style={ STYLES.logo}
          source= {require('../../assets/images/LogoLight.png')}
        />
      </View>
      <View style={styles.formContainer}>
         <VerifyEmailForm></VerifyEmailForm>
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
