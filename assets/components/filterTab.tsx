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
import { navigate } from "../../navigation/globalNavigation"
import { useRouter } from "expo-router";
import { getNearByDonations } from "@/services/donationService";
import { getNearByNeeeds } from "@/services/needService";
import { getUserId } from "@/constants/config";

interface FilterTabProps {
  title: string;
}

const FilterTab: React.FC<FilterTabProps> = ({ title }) => {
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] = useState<"all" | "nearby">("all");
  const [modalVisible, setModalVisible] = useState(false);

  const handleOnAllSelect = () => {
    setSelectedFilter("all");
    if (title == "Needies") {
      navigate("/need/needList");
    } else if (title == "Doners") {
      navigate("/donation/donationList");
    } else {
      navigate("/");
    }
  }
   
  const handleOnNearbyFilter = async () => {
    setSelectedFilter("nearby");
    const userId = await getUserId();
    if (title == "Needies") {
      try {
        const response = await getNearByNeeeds(userId);
        console.log("nearby needs: ", response);
        router.push({
          pathname: "/need/needList",
          params: {needs: JSON.stringify(response)}
        });
      } catch (err: any) {
        console.error("Failed to fetch nearby Needa:", err);
        alert(err?.message || "Failed to load Needs");
      }       
    } else if (title == "Doners") {
      try {
        const response = await getNearByDonations(userId);
        console.log("nearby donations: ", response);
        router.push({
          pathname: "/donation/donationList",
          params: {donations: JSON.stringify(response)}
        });
      } catch (err: any) {
        console.error("Failed to fetch nearby Donations:", err);
        alert(err?.message || "Failed to load Donations");
      } 
    } else {
      navigate("/");
    }
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor={COLORS.textLight}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterIcon}>
          <Ionicons name="filter" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedFilter === "all" && styles.selectedFilter,
          ]}
          onPress={handleOnAllSelect}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "all" && styles.selectedFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedFilter === "nearby" && styles.selectedFilter,
          ]}
          onPress={handleOnNearbyFilter}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "nearby" && styles.selectedFilterText,
            ]}
          >
            See who is near you
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
            <FilterForm section={title}/>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZE.HorizontalPaddingMedium,
    paddingVertical: SIZE.VerticlePaddingSmall,
    backgroundColor: COLORS.bgGray,
  },
  title: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    color: COLORS.textHighlight,
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZE.buttonRadiusSmall,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: SIZE.VerticlePaddingSmall,
    fontSize: SIZE.small,
    color: COLORS.textDark,
  },
  filterIcon: {
    padding: 6,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  filterOption: {
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
    paddingVertical: SIZE.VerticlePaddingSmall,
    borderRadius: SIZE.buttonRadiusSmall,
    backgroundColor: COLORS.white,
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: COLORS.bgDark,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  selectedFilterText: {
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZE.buttonRadiusSmall,
    padding: 20,
    maxHeight: "90%",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});

export default FilterTab;
