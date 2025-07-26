import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import COLORS from '../../constants/colors'
import Footer from '../../assets/components/footer'
import HeaderProfile from '../../assets/components/headerProfile'
import ProfileForm from '../../assets/components/forms/profileForm'

export default function UserProfile() {

  return (
    <View style={styles.container}>
      <HeaderProfile
         name='Banu'
         userType='Personal'
      />
      <View style={styles.body}>
         <ProfileForm/>
      </View>
      <Footer/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white
    },
   
    body: {
      flex: 1,
      padding: 10,
    },

});
