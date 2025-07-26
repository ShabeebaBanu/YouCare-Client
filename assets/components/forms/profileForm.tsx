import React, { useState } from "react";
import { KeyboardAvoidingView, TextInput, StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker"; // ✅ Import Picker
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { DISTRICT_PROVINCE_MAP } from "@/constants/data";

const districtList = Object.keys(DISTRICT_PROVINCE_MAP); // ✅ Extract list of districts

const ProfileForm = () => {
  const [name, setName] = useState("Banu");
  const [email] = useState("banu@example.com");
  const [address, setAddress] = useState("123 Main St");
  const [district, setDistrict] = useState("Curepipe");
  const [province, setProvince] = useState(DISTRICT_PROVINCE_MAP[district] || "");
  const [isEditable, setIsEditable] = useState(false);

  const handleOnEdit = () => {
    setIsEditable(true);
  };

  const handleOnChangePassword = () => {
    // Change password logic
  };

  const handleOnDelete = () => {
    // Delete logic
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    setProvince(DISTRICT_PROVINCE_MAP[value] || "");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={isEditable}
          placeholder="Name"
        />
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          editable={isEditable}
          placeholder="Address"
        />

        {isEditable ? (
          <View >
            <Picker
              selectedValue={district}
              onValueChange={handleDistrictChange}
              enabled={isEditable}
              style={styles.input}
            >
              {districtList.map((dist) => (
                <Picker.Item key={dist} label={dist} value={dist} />
              ))}
            </Picker>
          </View>
        ) : (
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={district}
            editable={false}
            placeholder="District"
          />
        )}

        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={province}
          editable={false}
          placeholder="Province"
        />
      </View>

      <View style={styles.button}>
        {!isEditable ? (
          <SubmitButton
            title="EDIT"
            onPress={handleOnEdit}
            buttonColor={COLORS.buttonOther}
          />
        ) : (
          <>
            <SubmitButton
              title="SAVE"
              onPress={() => setIsEditable(false)}
              buttonColor={COLORS.buttonOdd}
            />
          </>
        )}
        <SubmitButton
              title="CHANGE PASSWORD"
              onPress={handleOnChangePassword}
              buttonColor={COLORS.buttonOther}
        />
         <SubmitButton
              title="DELETE ACCOUNT"
              onPress={handleOnDelete}
              buttonColor={COLORS.white}
        />
            
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  input: {
    borderColor: COLORS.borderSub,
    borderWidth: 1,
    borderRadius: SIZE.buttonRadiusSmall,
    marginBottom: 15,
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
  },
  disabledInput: {
    backgroundColor: COLORS.bgLight,
    color: COLORS.textPlaceHolder,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    width: '100%',
    marginTop: 'auto'
  },
});

export default ProfileForm;
