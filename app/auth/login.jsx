import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import React from 'react'
import COLORS from '@/constants/colors'
import SIZE from '@/constants/size'
import LoginForm from '@/assets/components/forms/loginForm'
import { useRouter } from "expo-router";

export default function Login() {
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
         <LoginForm></LoginForm>
      </View>
      <View style={styles.path}>
        <TouchableOpacity onPress={() => navigation.navigate('verifyEmail/verifyEmail')}>
            <Text style={styles.text}>
                Do Not Have An Account
            </Text>
        </TouchableOpacity>
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
    path: {
      flex: 1
    },
    text: {
        fontSize: SIZE.small,
        color: COLORS.textDark,
        textAlign: 'center',
        justifyContent: 'center',
    }
});
