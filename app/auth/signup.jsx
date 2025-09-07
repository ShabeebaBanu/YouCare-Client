import { View, StyleSheet, Image} from 'react-native'
import React from 'react'
import STYLES from '@/constants/common.style';
import SignUpForm from '../../assets/components/forms/signUpForm'

export default function Signup() {

  return (
    <View style={STYLES.container}>
      <View style={styles.logoContainer}>
         <Image 
          style={ STYLES.logo}
          source= {require('../../assets/images/LogoLight.png')}
        />
      </View>
      <View style={styles.formContainer}>
         <SignUpForm></SignUpForm>
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
    }, 
});
