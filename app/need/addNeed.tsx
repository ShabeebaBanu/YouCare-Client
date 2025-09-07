import { View, StyleSheet} from 'react-native'
import STYLES from '@/constants/common.style'
import Header  from '../../assets/components/header'
import Footer from '../../assets/components/footer'
import AddNeedForm from '../../assets/components/forms/addNeedForm'

export default function AddNeed() {

  return (
    <View style={STYLES.container}>
      <Header/>
      <View style={styles.body}>
         <AddNeedForm></AddNeedForm>
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
