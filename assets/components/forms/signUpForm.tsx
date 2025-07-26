import React, { useState } from "react";
import { KeyboardAvoidingView, TextInput, View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import SubmitButton from "../submitButton";
import { navigate } from "../../../navigation/globalNavigation";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { DISTRICTS, USER_TYPES, DISTRICT_PROVINCE_MAP } from "../../../constants/data";

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [userType, setUserType] = useState(USER_TYPES[0]);
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [province, setProvince] = useState(DISTRICT_PROVINCE_MAP[DISTRICTS[0]]);

  const handleOnSignUp = async () => {
      navigate('/home/home')
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    setProvince(DISTRICT_PROVINCE_MAP[selectedDistrict] || '');
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

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.textPlaceHolder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

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
          {DISTRICTS.map((dist) => (
            <Picker.Item label={dist} value={dist} key={dist} />
          ))}
        </Picker>

        <View style={styles.input}>
          <Text style={styles.provinceText}>{province}</Text>
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
  provinceText: {
    color: COLORS.textDark,
    fontSize: SIZE.small,
  },
  signupButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default SignUpForm;
