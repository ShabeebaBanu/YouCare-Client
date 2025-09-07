import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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
  onRequests: () => void;
  activeTab: string;
}

const CardSmall: React.FC<CardSmallProps> = ({
  title,
  updatedAt,
  status,
  imageUrl,
  onView,
  onEdit,
  onDelete,
  activeTab,
  onRequests,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "AVAILABLE":
        return COLORS.buttonAccept || "#4CAF50";
      case "PENDING":
        return COLORS.textHighlight || "#FFA500";
      case "COMPLETED":
        return COLORS.buttonReject || "#D32F2F";
      default:
        return COLORS.textgray || "#9E9E9E";
    }
  };

  const isCompleted = status.toUpperCase() === "COMPLETED";

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={isCompleted ? 1 : 0.8}
        onPress={() => !isCompleted && setShowActions((prev) => !prev)}
        disabled={isCompleted}
      >
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, isCompleted && styles.completedImage]}
          resizeMode="cover"
        />

        <View style={styles.rightSection}>
          <Text style={[styles.title, isCompleted && styles.completedText]}>
            {title}
          </Text>
          <View style={styles.rowSpace}>
            <Text style={[styles.date, isCompleted && styles.completedText]}>
              {updatedAt}
            </Text>
            <View
              style={[
                styles.statusBox,
                { backgroundColor: getStatusColor(status) },
              ]}
            >
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {!isCompleted && showActions && (
        <View style={styles.actions}>
          {activeTab === "Donation" && (
            <TouchableOpacity style={styles.textBox} onPress={onRequests}>
              <Text style={styles.textButton}>View Requests</Text>
            </TouchableOpacity>
          )}
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
    borderRadius: 16,
    backgroundColor: COLORS.white,
    marginVertical: 8,
    marginHorizontal: 6,
    padding: 7,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,

    borderWidth: 1,
    borderColor: COLORS.bgGray,
  },
  completedCard: {
    borderWidth: 0, // no border
    backgroundColor: "#f5f5f5", // soft gray background
    shadowOpacity: 0.03, // lighter shadow
    elevation: 1,
  },
  completedText: {
    color: COLORS.textgray,
  },
  completedImage: {
    opacity: 0.6, // desaturate look
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
    width: 65,
    height: 65,
    borderRadius: 14,
    marginRight: 12,
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: SIZE.medium,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  date: {
    fontSize: SIZE.mini,
    color: COLORS.textHighlight,
  },
  statusBox: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontSize: SIZE.mini,
    color: COLORS.white,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 14,
  },
  iconBox: {
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    borderRadius: 10,
    padding: 8,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 2 },
  },
  textButton: {
    fontSize: SIZE.small,
    fontWeight: "600",
    color: COLORS.textDark,
  },
});

export default CardSmall;
