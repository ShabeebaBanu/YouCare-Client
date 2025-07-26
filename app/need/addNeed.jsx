import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import COLORS from '../../constants/colors'
import Header  from '../../assets/components/header'
import Footer from '../../assets/components/footer'
import AddNeedForm from '../../assets/components/forms/addNeedForm'

export default function AddNeed() {

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.body}>
         <AddNeedForm></AddNeedForm>
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
