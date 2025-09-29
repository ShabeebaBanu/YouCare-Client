import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import { getAllDistrict, District } from "@/services/districtService";
import { updateUserById, resetPassword } from "@/services/userService";
import { isPasswordValid, isValidPhone } from "@/util/validation";
import { getUserId } from "@/constants/config";
import CustomAlert from "@/constants/customAlert"; 

interface ProfileFormProps {
  initialData: {
    username: string;
    email: string;
    userType: "individual" | "organization";
    district?: string;
    province?: string;
    organizationName?: string;
    organizationAddress?: string;
    phone?: string;
  };
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData }) => {
  const [username, setUsername] = useState(initialData.username || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [district, setDistrict] = useState(initialData.district || "");
  const [province, setProvince] = useState(initialData.province || "");
  const [userType, setUserType] = useState(initialData.userType || "individual");
  const [organizationName, setOrganizationName] = useState(initialData.organizationName || "");
  const [organizationAddress, setOrganizationAddress] = useState(initialData.organizationAddress || "");
  const [phone, setPhone] = useState(initialData.phone || ""); 
  const [isEditable, setIsEditable] = useState(false);
  const [districtList, setDistrictList] = useState<District[]>([]);

  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await getAllDistrict();
        setDistrictList(response.data || []);
      } catch (error: any) {
        showAlert("Error", error?.message || "Failed to fetch districts ");
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    setUsername(initialData.username || "");
    setEmail(initialData.email || "");
    setDistrict(initialData.district || "");
    setProvince(initialData.province || "");
    setUserType(initialData.userType || "individual");
    setPhone(initialData.phone || ""); 

    if (initialData.userType === "organization") {
      setOrganizationName(initialData.organizationName || "");
      setOrganizationAddress(initialData.organizationAddress || "");
    } else {
      setOrganizationName("");
      setOrganizationAddress("");
    }
  }, [initialData]);

  const handleDistrictChange = (selectedDistrictName: string) => {
    setDistrict(selectedDistrictName);
    const selected = districtList.find((d) => d.name === selectedDistrictName);
    setProvince(selected?.province || "");
  };

  const handleOnEdit = () => setIsEditable(true);

  const handleOnSave = async () => {
    if (!phone.trim()) {
      showAlert("Error", "Requester Phone is required");
      return;
    }
    const phoneValidation = isValidPhone(phone);
    if (!phoneValidation) {
      showAlert("Error", "Invalid Phone Number");
      return;
    }
    if (!district.trim()) {
      showAlert("Error", "District is required");
      return;
    }

    try {
      const userId = await getUserId();
      const payload = {
        email,
        district,
        province,
        userType,
        phone, 
        ...(userType === "organization" && {
          organizationName,
          organizationAddress,
        }),
      };

      const response = await updateUserById(userId, payload);

      if (response.success) {
        showAlert("Success", response.message || "Profile updated successfully");
        setIsEditable(false);
      } else {
        showAlert("Error", response.message || "Failed to update profile");
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "Error updating profile. Please try again.");
    }
  };

  const handleOnResetPasswordClick = () => {
    setIsResettingPassword(true);
    setNewPassword("");
  };

  const handleOnResetPassword = async () => {
    const passwordValidationMessage = isPasswordValid(newPassword);
    if (passwordValidationMessage) {
      showAlert("Error", passwordValidationMessage || "Password must be at least 6 characters");
      return;
    }

    try {
      const response = await resetPassword(email, { newPassword });

      if (response.success) {
        showAlert("Success", response.message || "Password updated successfully");
        setIsResettingPassword(false);
        setNewPassword("");
      } else {
        showAlert("Error", response.message || "Failed to update password");
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "Failed to update password");
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        {!isResettingPassword ? (
          <>
            <TextInput
              style={[STYLES.input, styles.disabledInput]}
              value={username}
              editable={false}
              placeholder="Name"
            />
            <TextInput
              style={[STYLES.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholder="Email"
            />

            <TextInput
              style={[STYLES.input, !isEditable && styles.disabledInput]}
              value={phone}
              onChangeText={setPhone}
              editable={isEditable}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />

            {/* {isEditable ? (
              <Picker
                selectedValue={userType}
                onValueChange={(value) => setUserType(value)}
                style={STYLES.input}
              >
                <Picker.Item label="individual" value="individual" />
                <Picker.Item label="organization" value="organization" />
              </Picker>
            ) : (
              <TextInput
                style={[STYLES.input, styles.disabledInput]}
                value={userType}
                editable={false}
                placeholder="User Type"
              />
            )} */}

            {userType === "organization" && (
              <>
                <TextInput
                  style={[STYLES.input, !isEditable && styles.disabledInput]}
                  value={organizationName}
                  onChangeText={setOrganizationName}
                  editable={isEditable}
                  placeholder="Organization Name"
                />
                <TextInput
                  style={[STYLES.input, !isEditable && styles.disabledInput]}
                  value={organizationAddress}
                  onChangeText={setOrganizationAddress}
                  editable={isEditable}
                  placeholder="Organization Address"
                />
              </>
            )}

            {isEditable ? (
              <Picker
                selectedValue={district}
                onValueChange={handleDistrictChange}
                style={STYLES.input}
              >
                {districtList.map((dist) => (
                  <Picker.Item key={dist._id} label={dist.name} value={dist.name} />
                ))}
              </Picker>
            ) : (
              <TextInput
                style={[STYLES.input, styles.disabledInput]}
                value={district}
                editable={false}
                placeholder="District"
              />
            )}

            <TextInput
              style={[STYLES.input, styles.disabledInput]}
              value={province}
              editable={false}
              placeholder="Province"
            />
          </>
        ) : (
          <>
            <TextInput
              style={[STYLES.input, styles.disabledInput]}
              placeholder="Enter New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <SubmitButton
              title="RESET PASSWORD"
              onPress={handleOnResetPassword}
              buttonColor={COLORS.buttonOdd}
            />
          </>
        )}

        {!isResettingPassword && (
          <View style={styles.button}>
            {!isEditable ? (
              <SubmitButton
                title="EDIT"
                onPress={handleOnEdit}
                buttonColor={COLORS.buttonOther}
              />
            ) : (
              <SubmitButton
                title="SAVE"
                onPress={handleOnSave}
                buttonColor={COLORS.buttonOdd}
              />
            )}

            <SubmitButton
              title="CHANGE PASSWORD"
              onPress={handleOnResetPasswordClick}
              buttonColor={COLORS.buttonOther}
            />
          </View>
        )}
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
    padding: 24,
    justifyContent: "flex-start",
  },
  disabledInput: {
    backgroundColor: COLORS.bgLight,
    color: COLORS.textPlaceHolder,
  },
  button: {
    flexDirection: "row",
    gap: 5,
    width: "100%",
    marginTop: 20,
  },
});

export default ProfileForm;
