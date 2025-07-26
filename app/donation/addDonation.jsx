import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import COLORS from '../../constants/colors'
import Header  from '../../assets/components/header'
import Footer from '../../assets/components/footer'
import AddDonationForm from '../../assets/components/forms/addDonationForm'

export default function AddDonation() {

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.body}>
         <AddDonationForm></AddDonationForm>
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
