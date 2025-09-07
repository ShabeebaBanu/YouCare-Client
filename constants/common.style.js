import { StyleSheet } from "react-native";
import COLORS from "./colors";
import SIZE from "./size";

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
    },
    logo :{
        width: 120,
        height: 120,
        marginBottom: 10
    },
    input: {
        borderColor: COLORS.borderSub,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderRadius: SIZE.buttonRadiusSmall,
        marginBottom: 15,
        paddingVertical: SIZE.VerticlePaddingSmall,
        paddingHorizontal: SIZE.HorizontalPaddingSmall,
    },
    formTitle: {
        fontSize: SIZE.medium,
        color: COLORS.textDark,
        marginBottom: 30,
        textAlign: "center",
    },
    emptyMessage: {
        color: COLORS.textPlaceHolder,
        fontSize: SIZE.medium
    }
})

export default styles;