import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SubmitButton from "../submitButton";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";
import { useRouter } from "expo-router";
import { USER_TYPES } from "../../../constants/data";
import { getAllDistrict } from "@/services/districtService";
import { getAllCategory } from "@/services/categorService";
import { filterNeed } from "../../../services/needService";
import { filterDonation } from "@/services/donationService";

type District = {
  _id: string;
  name: string;
  province: string;
};

type Category = {
  _id: string;
  name: string;
};

interface FilterFormProp {
  section: string;
}

const FilterForm: React.FC<FilterFormProp> = ({section}) => {
  const router = useRouter();

  const [districtList, setDistrictList] = useState<District[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchDistrictsAndCategory = async () => {
      try {
        const districts = await getAllDistrict();
        const categories = await getAllCategory();
        setDistrictList(districts);
        setCategoryList(categories);
      } catch (error) {
        alert("Failed to fetch Districts or Categories: " + error);
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
    console.log("section", section);
    try {
      if (section == "Needies") {
        
        const response = await filterNeed(filterData);
        console.log("Filter API Response:", response);
        router.push({
          pathname: "/need/needList",
          params: {needs: JSON.stringify(response)}
        });
      } else if (section == "Doners") {
        const response = await filterDonation(filterData);
        console.log("Filter API Response:", response);
        router.push({
          pathname: "/donation/donationList",
          params: {donations: JSON.stringify(response)}
        });
      }
    } catch (err) {
      console.error("Filter API failed:", err);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>ADD FILTER</Text>

        {/* District Picker */}
        <Text style={styles.label}>District</Text>
        <Picker
          style={styles.pickerContainer}
          selectedValue={selectedDistrict}
          onValueChange={(itemValue) => handleDistrictChange(itemValue)}
        >
          <Picker.Item label="Select District" value="" />
          {districtList.map((dist) => (
            <Picker.Item key={dist._id} label={dist.name} value={dist._id} />
          ))}
        </Picker>

        {/* Province (auto filled) */}
        <Text style={styles.label}>Province</Text>
        <TextInput
          value={province}
          editable={false}
          style={styles.disabledInput}
        />

        {/* User Type Picker */}
        <Text style={styles.label}>User Type</Text>
        <Picker
          style={styles.pickerContainer}
          selectedValue={userType}
          onValueChange={(itemValue) => setUserType(itemValue)}
        >
          <Picker.Item label="Select User Type" value="" />
          {USER_TYPES.map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>

        {/* Category Picker (dropdown) */}
        <Text style={styles.label}>Category</Text>
        <Picker
          style={styles.pickerContainer}
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="Select Category" value="" />
          {categoryList.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
          ))}
        </Picker>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <SubmitButton
            title="ADD FILTER"
            onPress={handleOnAddFilter}
            buttonColor={COLORS.buttonOther}
          />
        </View>
      </ScrollView>
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
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: SIZE.small,
    fontWeight: "600",
    marginBottom: 5,
    color: COLORS.textDark,
  },
  pickerContainer: {
    borderColor: COLORS.borderSub,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: SIZE.buttonRadiusSmall,
    marginBottom: 15,
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
  },
  disabledInput: {
    backgroundColor: COLORS.bgGray,
    borderRadius: SIZE.buttonRadiusSmall,
    color: COLORS.textDark,
    padding: 10,
    marginBottom: 15,
  },
  submitContainer: {
    marginTop: 30,
  },
});

export default FilterForm;
