import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { getAllDistrict } from "@/services/districtService";
import { updateUserById, resetPassword } from "@/services/userService";
import { getUserId } from "@/constants/config";

interface District {
  _id: string;
  name: string;
  province: string;
}

interface ProfileFormProps {
  initialData: {
    username: string;
    email: string;
    userType: "individual" | "organization";
    district?: string;
    province?: string;
    organizationName?: string;
    organizationAddress?: string;
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
  const [isEditable, setIsEditable] = useState(false);
  const [districtList, setDistrictList] = useState<District[]>([]);
  
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await getAllDistrict();
        setDistrictList(response || []);
      } catch (err) {
        console.error("Failed to fetch districts:", err);
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
    try {
      const userId = await getUserId();
      const payload = {
        email,
        district,
        province,
        userType,
        ...(userType === "organization" && {
          organizationName,
          organizationAddress,
        }),
      };

      const response = await updateUserById(userId, payload);

      if (response.success) {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditable(false);
      } else {
        Alert.alert("Error", response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Error updating profile. Please try again.");
    }
  };

  const handleOnResetPasswordClick = () => {
    setIsResettingPassword(true);
    setNewPassword("");
  };

  const handleOnResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const response = await resetPassword(email, { newPassword: newPassword });

      if (response.success) {
        alert("Success: Password updated successfully");
        setIsResettingPassword(false);
        setNewPassword("");
      } else {
        alert("Error" + response.message || "Failed to update password");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
       alert("Error: Failed to update password");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        {!isResettingPassword ? (
          <>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={username}
              editable={false}
              placeholder="Name"
            />
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholder="Email"
            />

            {isEditable ? (
              <Picker
                selectedValue={userType}
                onValueChange={(value) => setUserType(value)}
                style={styles.input}
              >
                <Picker.Item label="individual" value="individual" />
                <Picker.Item label="organization" value="organization" />
              </Picker>
            ) : (
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userType}
                editable={false}
                placeholder="User Type"
              />
            )}

            {userType === "organization" && (
              <>
                <TextInput
                  style={[styles.input, !isEditable && styles.disabledInput]}
                  value={organizationName}
                  onChangeText={setOrganizationName}
                  editable={isEditable}
                  placeholder="Organization Name"
                />
                <TextInput
                  style={[styles.input, !isEditable && styles.disabledInput]}
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
                style={styles.input}
              >
                {districtList.map((dist) => (
                  <Picker.Item key={dist._id} label={dist.name} value={dist.name} />
                ))}
              </Picker>
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
          </>
        ) : (
          <>
            <TextInput
              style={[styles.input, styles.disabledInput]}
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
      </View>

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
    flexDirection: "row",
    gap: 5,
    width: "100%",
    marginTop: "auto",
  },
});

export default ProfileForm;
