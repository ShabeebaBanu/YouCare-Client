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
  onViewDonationDetails: () => void; 
  onViewNeedDetails: () => void;
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
  onViewDonationDetails,
  onViewNeedDetails
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

  const handleViewDetails = () => {
    if (activeTab === "Donation") {
      onViewDonationDetails(); 
    } else {
      onViewNeedDetails(); 
    }
  };

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

          <View style={styles.metaRow}>
            <Text style={[styles.date, isCompleted && styles.completedText]}>
              {updatedAt}
            </Text>

            <View style={styles.rightMetaRow}>

              {isCompleted && (
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={handleViewDetails}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              )}
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
        </View>
      </TouchableOpacity>

      {!isCompleted && showActions && (
        <View style={styles.actions}>
          {activeTab === "Donation" && (
            <TouchableOpacity style={styles.textBox} onPress={onRequests}>
              <Text style={styles.textButton}>Requests</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.textBox} onPress={onView}>
            <Text style={styles.textButton}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBox} onPress={onEdit}>
            <MaterialIcons name="edit" size={18} color={COLORS.buttonOther} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBox} onPress={onDelete}>
            <MaterialIcons name="delete" size={18} color={COLORS.buttonReject} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 6,
    marginHorizontal: 8,
    padding: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,

    borderWidth: 1,
    borderColor: COLORS.bgGray,
  },
  completedCard: {
    borderWidth: 0,
    backgroundColor: "#f7f7f7",
    shadowOpacity: 0.01,
    elevation: 0,
  },
  completedText: {
    color: COLORS.textgray,
  },
  completedImage: {
    opacity: 0.6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 10,
  },
  rightSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: SIZE.small,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  date: {
    fontSize: SIZE.mini,
    color: COLORS.textHighlight,
  },
  statusBox: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusText: {
    fontSize: SIZE.mini,
    color: COLORS.white,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 10,
  },
  iconBox: {
    borderWidth: 1,
    borderColor: COLORS.bgblue,
    borderRadius: 8,
    padding: 6,
    backgroundColor: COLORS.white,
    elevation: 1,
  },
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.bgblue,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
  textButton: {
    fontSize: SIZE.mini,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  viewButton: {
    borderWidth: 1,
    borderColor: COLORS.bgblue,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
  },
  viewButtonText: {
    fontSize: SIZE.mini,
    fontWeight: "600",
    color: COLORS.textDark,
  },
});

export default CardSmall;
