import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: COLORS.bgLight
    },
    topRow : {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    buttomRow : {
       flex: 1,
       justifyContent: "center",
       alignItems: "center",
    },
    image :{
        width: 250,
        height: 250 
    }
})

export default styles;