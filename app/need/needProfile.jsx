import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import COLORS from '../../constants/colors'
import Footer from '../../assets/components/footer'
import NeedDetail from '../../assets/components/needDetail'

export default function NeedProfile() {

  return (
    <View style={styles.container}>
      <NeedDetail></NeedDetail>
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
     
    },

});
