import React, { useState } from "react"
import { KeyboardAvoidingView, TextInput, Image } from "react-native";
import { Text, StyleSheet , View} from "react-native";
import SubmitButton from "./submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";

const Header = () => {
    return(
      <View style={styles.container}>
            <View style={styles.greeting}>
                <Text style={styles.name}>Hi Banu</Text>
                <Text style={styles.subGreeting}>Nice To Meet You</Text>
            </View>
            <View style={styles.logoContainer}>
                <Image 
                    style={ styles.logo}
                    source= {require('../../assets/images/LogoLight.png')}
                 />
            </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SIZE.HorizontalPaddingMedium,
    paddingVertical: SIZE.VerticlePaddingMedium,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgLight,
    //borderBottomWidth: 1,
    //borderBottomColor: COLORS.borderSub,
    shadowColor: COLORS.bgDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    //elevation: 2,
  },
  greeting: {
    flexDirection: 'column',
  },
  name: {
    fontSize: SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  subGreeting: {
    fontSize: SIZE.small,
    color: COLORS.textPlaceHolder,
  },
  logoContainer: {
    alignItems: 'flex-end',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

})


export default Header;