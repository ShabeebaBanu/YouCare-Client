import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SubmitButton from "../submitButton";
import { navigate } from "../../../navigation/globalNavigation";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import { USER_TYPES } from "../../../constants/data";
import { createUser } from "@/services/userService";
import { getAllDistrict, District } from "@/services/districtService";
import { useLocalSearchParams } from "expo-router";
import CustomAlert from "@/constants/customAlert";

const SignUpForm = () => {
  const { email } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");

  const [userType, setUserType] = useState(USER_TYPES[0]);
  const [districtList, setDistrictList] = useState<District[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [onAlertConfirm, setOnAlertConfirm] = useState<() => void>(() => () => {});

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setOnAlertConfirm(() => onConfirm || (() => setAlertVisible(false)));
    setAlertVisible(true);
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districts = await getAllDistrict();
        setDistrictList(districts.data);
      } catch (error: any) {
        showAlert("Error", error.message || "Failed to fetch districts");
      }
    };
    fetchDistricts();
  }, []);

  const handleOnSignUp = async () => {
    try {
      const payload: any = {
        username: name,
        email: email,
        password: password,
        district: district,
        province: province,
        role: userType,
      };

      if (userType === "organization") {
        payload.organizationName = organizationName;
        payload.organizationAddress = organizationAddress;
      }

      const response = await createUser(payload);

      if (response.success) {
        showAlert("Success", response.message || "Account created successfully", () =>
          navigate("/home/home")
        );
      } else {
        showAlert("Error", response.message || "Failed to create user");
      }
    } catch (error: any) {
        showAlert("Error", error.message || "Unexpected error");
    }
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);

    const selectedDistrictObj = districtList.find(
      (dist) => dist.name === selectedDistrict
    );

    setProvince(selectedDistrictObj?.province || "");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={STYLES.formTitle}>CREATE ACCOUNT</Text>

        <View>
          <TextInput
            style={STYLES.input}
            placeholder="Name"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={name}
            onChangeText={setName}
          />

          <View style={STYLES.input}>
            <Text style={styles.fixedText}>{email ? email : "Email"}</Text>
          </View>

          <TextInput
            style={STYLES.input}
            placeholder="Password"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Picker
            selectedValue={userType}
            onValueChange={setUserType}
            style={STYLES.input}
          >
            {USER_TYPES.map((type) => (
              <Picker.Item label={type} value={type} key={type} />
            ))}
          </Picker>

          {userType === "organization" && (
            <>
              <TextInput
                style={STYLES.input}
                placeholder="Organization Name"
                placeholderTextColor={COLORS.textPlaceHolder}
                value={organizationName}
                onChangeText={setOrganizationName}
              />
              <TextInput
                style={STYLES.input}
                placeholder="Organization Address"
                placeholderTextColor={COLORS.textPlaceHolder}
                value={organizationAddress}
                onChangeText={setOrganizationAddress}
              />
            </>
          )}

          <Picker
            selectedValue={district}
            onValueChange={handleDistrictChange}
            style={STYLES.input}
          >
            <Picker.Item label="Select District" value="" />
            {districtList.map((dist) => (
              <Picker.Item key={dist.name} label={dist.name} value={dist.name} />
            ))}
          </Picker>

          <View style={STYLES.input}>
            <Text style={styles.fixedText}>
              {province ? province : "Province"}
            </Text>
          </View>
        </View>

        <View style={styles.signupButton}>
          <SubmitButton
            title="SIGN UP"
            onPress={handleOnSignUp}
            buttonColor={COLORS.buttonOther}
          />
        </View>
      </ScrollView>

     
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={onAlertConfirm}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  scrollContent: {
    flexGrow: 1,
  },
  fixedText: {
    color: COLORS.textPlaceHolder,
    fontSize: SIZE.small,
  },
  signupButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default SignUpForm;
