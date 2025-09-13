import { View, StyleSheet} from 'react-native'
import STYLES from '@/constants/common.style'
import Header  from '../../assets/components/header'
import Footer from '../../assets/components/footer'
import AddDonationForm from '../../assets/components/forms/addDonationForm'

export default function AddDonation() {

  return (
    <View style={STYLES.container}>
      <View style={styles.body}>
         <AddDonationForm></AddDonationForm>
      </View>
      <Footer/>
    </View>
  )
}

const styles = StyleSheet.create({
    body: {
      flex: 1,
      padding: 10,
    },

});
