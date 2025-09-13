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
  const getStatusStyle = () => {
    switch (status) {
      case "PENDING":
        return { backgroundColor: COLORS.textHighlight };
      case "AVAILABLE":
        return { backgroundColor: COLORS.bgDark };
      case "COMPLETED":
        return { backgroundColor: COLORS.textgray };
      default:
        return { backgroundColor: COLORS.textgray };
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
          <Text
            style={[styles.title, isCompleted && styles.disabledText]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={styles.rowSpace}>
            <Text style={[styles.date, isCompleted && styles.disabledText]}>
              {updatedAt}
            </Text>

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
    borderRadius: 15,
    backgroundColor: COLORS.white,
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 8,

    // soft floating effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledCard: {
    opacity: 0.6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: COLORS.bgDark,
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: SIZE.small,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  date: {
    fontSize: SIZE.mini,
    color: COLORS.textHighlight,
    opacity: 0.8,
  },
  disabledText: {
    color: COLORS.textPlaceHolder,
  },
  statusBox: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: SIZE.mini,
    color: COLORS.white,
    fontWeight: "400",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  disabledStatusText: {
    color: COLORS.white,
  },
});

export default CardPublic;
