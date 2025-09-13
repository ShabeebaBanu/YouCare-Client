import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import SubmitButton from "../submitButton";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";
import { useRouter } from "expo-router";
import { USER_TYPES } from "../../../constants/data";
import { getAllDistrict, District } from "@/services/districtService";
import { getAllCategory, Category } from "@/services/categorService";
import { filterNeed } from "../../../services/needService";
import { filterDonation } from "@/services/donationService";
import CustomAlert from "@/constants/customAlert";

interface FilterFormProp {
  section: string;
}

const FilterForm: React.FC<FilterFormProp> = ({ section }) => {
  const router = useRouter();

  const [districtList, setDistrictList] = useState<District[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchDistrictsAndCategory = async () => {
      try {
        const districts = await getAllDistrict();
        const categories = await getAllCategory();
        setDistrictList(districts.data);
        setCategoryList(categories.data);
      } catch (error: any) {
        setAlertTitle("Error");
        setAlertMessage(error?.message || "Failed to fetch Districts or Categories");
        setAlertVisible(true);
      }
    };
    fetchDistrictsAndCategory();
  }, []);

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    const dist = districtList.find((d) => d._id === districtId);
    setProvince(dist?.province || "");
  };

  const handleOnAddFilter = async () => {
    const filterData = {
      district: selectedDistrict,
      userType: userType,
      category: selectedCategory,
    };

    try {
      if (section === "Needies") {
        const response = await filterNeed(filterData);
        router.push({
          pathname: "/need/needList",
          params: { needs: JSON.stringify(response) },
        });
      } else if (section === "Doners") {
        const response = await filterDonation(filterData);
        router.push({
          pathname: "/donation/donationList",
          params: { donations: JSON.stringify(response) },
        });
      }
    } catch (error: any) {
      setAlertTitle("Error");
      setAlertMessage(error?.message || "Filter API failed ");
      setAlertVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Add Filter</Text>

        {/* Location Section */}
        <View style={styles.card}>

          <Text style={styles.label}>District</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={districtList.map((d) => ({ label: d.name, value: d._id }))}
            labelField="label"
            valueField="value"
            placeholder="Select District"
            value={selectedDistrict}
            onChange={(item) => handleDistrictChange(item.value)}
          />

          <Text style={styles.label}>Province</Text>
          <TextInput
            value={province}
            editable={false}
            style={styles.disabledInput}
          />
        </View>

        {/* Details Section */}
        <View style={styles.card}>

          <Text style={styles.label}>User Type</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={USER_TYPES.map((type) => ({ label: type, value: type }))}
            labelField="label"
            valueField="value"
            placeholder="Select User Type"
            value={userType}
            onChange={(item) => setUserType(item.value)}
          />

          <Text style={styles.label}>Category</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={categoryList.map((c) => ({ label: c.name, value: c._id }))}
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            value={selectedCategory}
            onChange={(item) => setSelectedCategory(item.value)}
          />
        </View>

        <View style={styles.submitContainer}>
          <SubmitButton
            title="Apply Filter"
            onPress={handleOnAddFilter}
            buttonColor={COLORS.buttonOther}
          />
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZE.HorizontalPaddingSmall,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: SIZE.medium,
    color: COLORS.textHighlight,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZE.buttonRadiusSmall,
    padding: SIZE.HorizontalPaddingSmall
  },
  sectionTitle: {
    fontSize: SIZE.small,
    fontWeight: "700",
    color: COLORS.textHighlight,
    marginBottom: 10,
  },
  label: {
    fontSize: SIZE.small,
    fontWeight: "400",
    marginBottom: 5,
    color: COLORS.textPlaceHolder,
  },
  dropdown: {
    height: 30,
    borderColor: COLORS.borderSub,
    borderWidth: 1,
    borderRadius: SIZE.buttonRadiusSmall,
    paddingHorizontal: 10,
    marginBottom: 3,
  },
  placeholderStyle: {
    fontSize: SIZE.small,
    color: COLORS.textLight,
  },
  selectedTextStyle: {
    fontSize: SIZE.small,
    color: COLORS.textDark,
  },
  disabledInput: {
    backgroundColor: COLORS.bgGray,
    borderRadius: SIZE.buttonRadiusSmall,
    color: COLORS.textDark,
    padding: 10,
    marginBottom: 15,
  },
  submitContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
});

export default FilterForm;
