import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import COLORS from '../../constants/colors'
import Header  from '../../assets/components/header'
import Footer from '../../assets/components/footer'
import CardMedium from '../../assets/components/cardMedium'
import FilterTab from '../../assets/components/filterTab'

export default function NeedList() {

  return (
    <View style={styles.container}>
      <Header/>
      <FilterTab
        title='Needies'
      />
      <View style={styles.body}>
         <CardMedium
            imageUrl={require("../../assets/images/need1.jpeg")}
            title="I need clothes"
            name="Mr. Perera"
            userType="Individual"
            district="Colombo"
            date="2025-05-23"
         ></CardMedium>
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
