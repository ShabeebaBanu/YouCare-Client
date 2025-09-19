import { StyleSheet } from "react-native";
import COLORS from "./colors";
import SIZE from "./size";

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 2
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
        backgroundColor: COLORS.white,
        borderRadius: SIZE.buttonRadiusSmall,
        paddingVertical: SIZE.VerticlePaddingSmall,
        paddingHorizontal: SIZE.HorizontalPaddingSmall,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.borderSub,
        fontSize: SIZE.small,
        color: COLORS.textDark,
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