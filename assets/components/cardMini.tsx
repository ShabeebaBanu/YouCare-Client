import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CardMiniProps {
  name: string; 
  userType: string;
  district: string;
  date: string;
  onView: () => void;
}

const CardMini: React.FC<CardMiniProps> = ({ name, userType, district, date, onView }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onView}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name?.charAt(0).toUpperCase() || "U"}
        </Text>
      </View>

      {/* Info */}
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderBottomWidth: 0.8,
    borderBottomColor: COLORS.bgGray,
    backgroundColor: COLORS.bgLight,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D9D9D9", 
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.textDark,
    fontSize: SIZE.small,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: SIZE.small,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  userType: {
    fontSize: SIZE.mini,
    color: COLORS.textPlaceHolder,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  district: {
    fontSize: SIZE.mini,
    color: COLORS.textHighlight,
    letterSpacing: 0.1,
  },
  date: {
    fontSize: SIZE.mini,
    color: COLORS.textPlaceHolder,
    letterSpacing: 0.1,
  },
});

export default CardMini;
