import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, TextInput, View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import SubmitButton from "../submitButton";
import { navigate } from "../../../navigation/globalNavigation";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { USER_TYPES } from "../../../constants/data";
import { createUser } from "@/services/userService";
import { getAllDistrict } from "@/services/districtService";
import { useLocalSearchParams } from "expo-router";

type District = {
  _id: string;
  name: string;
  province: string;
};

const SignUpForm  = () => {
  const { email } =useLocalSearchParams();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');

  const [userType, setUserType] = useState(USER_TYPES[0]);
  const [districtList, setDistrictList] = useState<District[]>([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districts = await getAllDistrict();
          
        setDistrictList(districts);
      } catch (error) {
        alert("Failed to fetch Districts: " + error);
      }
    };
      fetchDistricts();
  }, []);
  


  const handleOnSignUp = async () => {
      try {
      const payload = {
        username: name,
        email: email,       
        password: password,
        district: district,
        province: province,
        role: userType      
      };

      console.log("Payload:", payload);

      const response = await createUser(payload);

      if (response.success) {
        alert("Success, Account created successfully");
        navigate("/home/home");
      } else {
        alert("Error" + response.message || "Failed to create user");
      }
    } catch (error: any) {
      if (error.response) {
        alert("Error" + error.response.data.message || "Server error");
      } else {
        alert("Error" + error.message || "Unexpected error");
      }
    }
        navigate('/auth/login');
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);

    const selectedDistrictObj = districtList.find(
      (dist) => dist.name === selectedDistrict
    );

    setProvince(selectedDistrictObj?.province || "");
  };


  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>CREATE ACCOUNT</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={COLORS.textPlaceHolder}
          value={name}
          onChangeText={setName}
        />

        <View style={styles.input}>
          <Text style={styles.fixedText}>
            {email ? email: "Email"}
         </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.textPlaceHolder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Picker
          selectedValue={userType}
          onValueChange={setUserType}
          style={styles.input}
        >
          {USER_TYPES.map((type) => (
            <Picker.Item label={type} value={type} key={type} />
          ))}
        </Picker>

        <Picker
          selectedValue={district}
          onValueChange={handleDistrictChange}
          style={styles.input}
        >
          <Picker.Item label="Select District" value="" />
          {districtList.map((dist) => (
            <Picker.Item key={dist.name} label={dist.name} value={dist.name} />
          ))}
        </Picker>

        <View style={styles.input}>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: SIZE.medium,
    color: COLORS.textDark,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderColor: COLORS.borderSub,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: SIZE.buttonRadiusSmall,
    marginBottom: 15,
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
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
