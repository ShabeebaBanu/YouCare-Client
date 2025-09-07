import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
} from "react-native";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CardSmallProps {
  title: string;
  updatedAt: string;
  status: "PENDING" | "COMPLETED" | "AVAILABLE";
  imageUrl: string;
  onView: () => void;
}

const CardPublic: React.FC<CardSmallProps> = ({
  title,
  updatedAt,
  status,
  imageUrl,
  onView,
}) => {
  // pick style based on status
  const getStatusStyle = () => {
    switch (status) {
      case "PENDING":
        return { backgroundColor: COLORS.textHighlight }; // orange/yellow
      case "AVAILABLE":
        return { backgroundColor: COLORS.bgDark }; // dark color
      case "COMPLETED":
        return { backgroundColor: COLORS.textgray }; // gray for completed
      default:
        return { backgroundColor: COLORS.textgray }; // fallback
    }
  };

  const isCompleted = status === "COMPLETED";

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.disabledCard]}
      activeOpacity={isCompleted ? 1 : 0.9}
      onPress={!isCompleted ? onView : undefined}
      disabled={isCompleted}
    >
      <View style={styles.row}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

        <View style={styles.rightSection}>
          <Text style={[styles.title, isCompleted && styles.disabledText]} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.rowSpace}>
            <Text style={[styles.date, isCompleted && styles.disabledText]}>
              {updatedAt}
            </Text>

            {/* Always show pill with respective style */}
            <View style={[styles.statusBox, getStatusStyle()]}>
              <Text
                style={[
                  styles.statusText,
                  isCompleted && styles.disabledStatusText,
                ]}
              >
                {status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    backgroundColor: COLORS.white,
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 8,

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 3,
  },
  disabledCard: {
    opacity: 0.7, // slightly faded look
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
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
  disabledText: {
    color: COLORS.textPlaceHolder,
  },
  statusBox: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontSize: SIZE.mini,
    color: COLORS.white,
    fontWeight: "500",
  },
  disabledStatusText: {
    color: COLORS.white, // keep text white on gray background
  },
});

export default CardPublic;
