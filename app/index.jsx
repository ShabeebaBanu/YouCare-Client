import { View, Image } from "react-native";
import styles from "../assets/styles/welcome.style"
import CustomButton from "@/assets/components/customButtonBig";
import { useRouter } from "expo-router";


export default function Index() {
  const navigation = useRouter();
  const handleOnStart = () => {
    navigation.navigate("/auth");
  }

  return (
    <View style={ styles.container }>
      <View style={ styles.topRow }>
        <Image 
          style={ styles.image }
          source= {require('../assets/images/LogoLight.png')}
        />
      </View>
      <View style={ styles.buttomRow }>
        <CustomButton title="START" onPress={handleOnStart}></CustomButton>
      </View>
    </View>
  );
}
