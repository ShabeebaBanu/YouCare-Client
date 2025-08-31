import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // expo vector icons
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CardSmallProps {
  title: string;
  updatedAt: string;
  status: string;
  imageUrl: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CardSmall: React.FC<CardSmallProps> = ({
  title,
  updatedAt,
  status,
  imageUrl,
  onView,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.8}
        onPress={() => setShowActions((prev) => !prev)} // toggle actions
      >
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

        <View style={styles.rightSection}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.rowSpace}>
            <Text style={styles.date}>{updatedAt}</Text>
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons - only show when clicked */}
      {showActions && (
        <View style={styles.actions}>
            {/* View Post as Text */}
            <TouchableOpacity style={styles.textBox} onPress={onView}>
            <Text style={styles.textButton}>View Post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBox} onPress={onEdit}>
            <MaterialIcons name="edit" size={22} color={COLORS.buttonOther} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBox} onPress={onDelete}>
            <MaterialIcons name="delete" size={22} color={COLORS.buttonReject} />
            </TouchableOpacity>
        </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZE.buttonRadiusSmall,
    backgroundColor: COLORS.bgLight,
    marginVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: SIZE.buttonRadiusSmall,
    marginRight: 10,
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 5,
  },
  date: {
    fontSize: SIZE.mini,
    color: COLORS.textHighlight,
  },
  statusBox: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: SIZE.buttonRadiusSmall,
    backgroundColor: COLORS.buttonOther,
  },
  statusText: {
    fontSize: SIZE.mini,
    color: COLORS.white,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 12,
  },
  iconBox: {
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    borderRadius: 8,
    padding: 8,
    backgroundColor: COLORS.white,
    elevation: 2, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  textBox: {
  borderWidth: 1,
  borderColor: COLORS.bgGray,
  borderRadius: 8,
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: COLORS.white,
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},
textButton: {
  fontSize: SIZE.small,
  fontWeight: "bold",
  color: COLORS.textDark,
},

});

export default CardSmall;
