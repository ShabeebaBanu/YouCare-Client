import { View, StyleSheet, Image} from 'react-native'
import React from 'react'
import COLORS from '@/constants/colors'
import { useRouter } from "expo-router";
import SignUpForm from '../../assets/components/forms/signUpForm'

export default function Signup() {
  const navigation = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
         <Image 
          style={ styles.logo}
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
    }, 
});
