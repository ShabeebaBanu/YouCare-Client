import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";
import FilterForm from "./forms/filterForm";
import { navigate } from "../../navigation/globalNavigation";
import { useRouter } from "expo-router";
import { getNearByDonations } from "@/services/donationService";
import { getNearByNeeeds } from "@/services/needService";
import { getUserId } from "@/constants/config";
import CustomAlert from "@/constants/customAlert";

interface FilterTabProps {
  title: string;
}

const FilterTab: React.FC<FilterTabProps> = ({ title }) => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "nearby">("all");
  const [modalVisible, setModalVisible] = useState(false);

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleOnAllSelect = () => {
    setSelectedFilter("all");
    if (title === "Needies") navigate("/need/needList");
    else if (title === "Doners") navigate("/donation/donationList");
    else navigate("/");
  };

  const handleOnNearbyFilter = async () => {
    setSelectedFilter("nearby");
    const userId = await getUserId();

    try {
      if (title === "Needies") {
        const response = await getNearByNeeeds(userId);
        router.push({
          pathname: "/need/needList",
          params: { needs: JSON.stringify(response.data) },
        });
      } else if (title === "Doners") {
        const response = await getNearByDonations(userId);
        router.push({
          pathname: "/donation/donationList",
          params: { donations: JSON.stringify(response.data) },
        });
      } else {
        navigate("/");
      }
    } catch (error: any) {
      showAlert("Error", error?.message || `Failed to load ${title}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Search & Filter Icon */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor={COLORS.textLight}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterIcon}>
          <Ionicons name="filter" size={22} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {["all", "nearby"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterOption,
              selectedFilter === filter && styles.selectedFilter,
            ]}
            onPress={filter === "all" ? handleOnAllSelect : handleOnNearbyFilter}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedFilterText,
              ]}
            >
              {filter === "all" ? "All" : "See who is near you"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={26} color={COLORS.textDark} />
            </TouchableOpacity>
            <FilterForm section={title} />
          </View>
        </View>
      </Modal>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZE.HorizontalPaddingMedium,
    paddingVertical: SIZE.VerticlePaddingMedium,
    backgroundColor: COLORS.bgDark,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  title: {
    fontSize: SIZE.medium + 2,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 12,
  },
  searchContainer: {
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    //borderRadius: SIZE.buttonRadiusSmall,
    marginBottom: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 10,
    fontSize: SIZE.small + 1,
    color: COLORS.textDark,
  },
  filterIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.bgLight,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.bgLight,
  },
  selectedFilter: {
    backgroundColor: COLORS.bgLight,
    borderColor: COLORS.bgDark,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
  selectedFilterText: {
    color: COLORS.textDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
});

export default FilterTab;
