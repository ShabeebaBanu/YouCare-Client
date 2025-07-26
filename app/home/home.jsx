import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import COLORS from '@/constants/colors'
import Header  from '../../assets/components/header'
import Footer from '../../assets/components/footer'
import CardMain from '../../assets/components/cardMain'
import { navigate } from "../../navigation/globalNavigation";

export default function Home() {
    const handleOnNeed = () => {
        navigate('/need/needList')
    };


  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.body}>
         <CardMain
           imageUrl= {require('../../assets/images/need1.jpeg')}
           title='See Who is in Need'
           onPress={handleOnNeed}
         />
         <CardMain
           imageUrl= {require('../../assets/images/donate1.jpeg')}
           title='See Who is Ready to Donate'
         />
      </View>
      <Footer/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.bgLight
    },
    body: {
      flex: 1,
      padding: 16,
    },

});
