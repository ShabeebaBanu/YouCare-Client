import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CardMiniProps {
  name: string; 
  userType: string;
  district: string;
  date: string;
  onView: () => void;
}

const CardMini: React.FC<CardMiniProps> = ({
  name,
  userType,
  district,
  date,
  onView,
}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onView}>
  
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name?.charAt(0).toUpperCase() || "U"}
        </Text>
      </View>


      <View style={styles.rightSection}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.userType}>{userType}</Text>

        <View style={styles.rowSpace}>
          <Text style={styles.district}>{district}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,

    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.textHighlight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: SIZE.medium,
    fontWeight: "bold",
  },
  rightSection: {
    flex: 1,
  },
  title: {
    fontSize: SIZE.medium,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  userType: {
    fontSize: SIZE.small,
    color: COLORS.textPlaceHolder,
    marginBottom: 4,
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  district: {
    fontSize: SIZE.small,
    color: COLORS.textHighlight,
  },
  date: {
    fontSize: SIZE.small,
    color: COLORS.textPlaceHolder,
  },
});

export default CardMini;
