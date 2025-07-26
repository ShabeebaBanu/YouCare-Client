import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SubmitButton from "../submitButton";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";
import {
  DISTRICT_PROVINCE_MAP,
  USER_TYPES,
  CATEGORIES,
} from "../../../constants/data";
const FilterForm = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setProvince(DISTRICT_PROVINCE_MAP[district] || "");
  };

  const handleOnAddFilter = () => {
    const filterData = {
      district: selectedDistrict,
      province,
      userType,
      selectedCategories,
    };
    console.log("Selected Filter:", filterData);

  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>ADD FILTER</Text>

        <Text style={styles.label}>District</Text>
          <Picker
            style={styles.pickerContainer}
            selectedValue={selectedDistrict}
            onValueChange={(itemValue) => handleDistrictChange(itemValue)}
          >
                <Picker.Item label="Select District" value="" />
                {Object.keys(DISTRICT_PROVINCE_MAP).map((district) => (
                <Picker.Item key={district} label={district} value={district} />
                ))}
          </Picker>

        <Text style={styles.label}>Province</Text>
        <TextInput
          value={province}
          editable={false}
          style={styles.disabledInput}
        />

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

        <Text style={styles.label}>Categories</Text>
        <View style={styles.tagContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.tag,
                selectedCategories.includes(cat) && styles.tagSelected,
              ]}
              onPress={() => handleCategoryToggle(cat)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedCategories.includes(cat) && styles.tagTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
    fontWeight: 'bold',
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
    padding: 10,
    borderRadius: SIZE.buttonRadiusSmall,
    color: COLORS.textDark,
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
    marginBottom: 15,
  },
  tagContainer: {
    backgroundColor: COLORS.bgGray,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 5,
    padding: SIZE.HorizontalPaddingSmall
  },
  tag: {
    backgroundColor: COLORS.bgLight,
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
    paddingVertical: SIZE.VerticlePaddingSmall,
    borderRadius: SIZE.buttonRadiusSmall,
    marginBottom: 5,
  },
  tagSelected: {
    backgroundColor: COLORS.bgDark,
  },
  tagText: {
    color: COLORS.textOption,
    fontSize: SIZE.small,
  },
  tagTextSelected: {
    color: COLORS.white,
  },
  submitContainer: {
    marginTop: 30,
  },
});

export default FilterForm;
