import { View, StyleSheet, Image} from 'react-native'
import COLORS from '@/constants/colors'
import VerifyPhoneForm from '../../assets/components/forms/verifyPhoneForm'

export default function VerifyPhone() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
         <Image 
          style={ styles.logo}
          source= {require('../../assets/images/LogoLight.png')}
        />
      </View>
      <View style={styles.formContainer}>
         <VerifyPhoneForm></VerifyPhoneForm>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.bgLight
    },
    logoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 10
    },
    formContainer: {
      flex: 2,
      paddingHorizontal: 20,
      justifyContent: 'center',
      
    }
});
