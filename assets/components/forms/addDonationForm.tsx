import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import CustomAlert from "@/constants/customAlert";
import STYLES from "@/constants/common.style";

import { getAllCategory, Category } from "../../../services/categorService";
import { getAllDistrict, District } from "../../../services/districtService";
import {
  createDonation,
  getDonationByDonationId,
  updateDonation,
} from "../../../services/donationService";

import { getUserId } from "@/constants/config";
import { useLocalSearchParams } from "expo-router";
import { navigate } from "../../../navigation/globalNavigation";
import { isValidPhone } from "@/util/validation";

interface AddDonationFormProps {
  donationId?: string;
  onSuccess?: () => void;
}

const AddDonationForm: React.FC<AddDonationFormProps> = ({
  donationId,
  onSuccess,
}) => {
  const { donationId: queryDonationId } =
    useLocalSearchParams<{ donationId?: string }>();
  const finalDonationId = donationId || queryDonationId;

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);

  const [title, setTitle] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mode, setMode] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const isCustomCategory = selectedCategory === "__custom__";

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    const fetchAllCategoriesAndDistricts = async () => {
      try {
        const categories = await getAllCategory();
        const districts = await getAllDistrict();
        const userId = await getUserId();

        setCategoryList(categories.data);
        setDistrictList(districts.data);
        setCreatedBy(userId);

        if (finalDonationId) {
          const res = await getDonationByDonationId(finalDonationId);
          const d = res.data;

          setTitle(d.title);
          setItem(d.item);
          setQuantity(d.quantity);
          setDescription(d.description);
          setName(d.donerName);
          setPhone(d.donerPhone);
          setCategory(d.category?.name || "");
          setSelectedCategory(d.category?.name || "");
          setMode(d.delivary);
          setAddress(d.pickupAddress);
          setDistrict(d.district?._id || "");
          setImage(d.image || null); 
        }
      } catch (error: any) {
        showAlert(
          "Failed",
          error.message || "Failed to fetch categories or donation"
        );
      }
    };

    fetchAllCategoriesAndDistricts();
  }, [finalDonationId]);

  const handlePickerChange = (value: string) => {
    setSelectedCategory(value);
    if (value !== "__custom__") {
      setCategory(value);
    } else {
      setCategory("");
    }
  };

  const handleCustomCategoryInput = (text: string) => {
    setCategory(text.toUpperCase());
  };

  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
    base64: false,
  });

  if (!result.canceled && result.assets.length > 0) {
    const asset = result.assets[0];
    console.log("image:", asset.uri);
    setImage(asset.uri);
  }
  };


  const removeImage = () => {
    setImage(null);
  };


const handleOnAddDonation = async () => {
  if (!title.trim()) {
    showAlert("Error", "Title is required");
    return;
  }
  if (!name.trim()) {
    showAlert("Error", "Requester Name is required");
    return;
  }
  if (!phone.trim()) {
    showAlert("Error", "Requester Phone is required");
    return;
  }
  const phoneValidation = isValidPhone(phone);
  if (!phoneValidation) {
    showAlert("Error", "Invalid Phone Number");
    return;
  }
  if (!category.trim()) {
    showAlert("Error", "Category is required");
    return;
  }
  if (!address.trim()) {
    showAlert("Error", "Delivery Address is required");
    return;
  }
  if (!district.trim()) {
    showAlert("Error", "District is required");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("item", item);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("donerName", name);
    formData.append("donerPhone", phone);
    formData.append("category", category);
    formData.append("delivary", mode);
    formData.append("pickupAddress", address);
    formData.append("district", district);
    formData.append("createdBy", createdBy);

    if (image) {
      const fileName = image.split("/").pop() || "image.jpg";
      const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
      const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;

      if (Platform.OS === "web") {
        const res = await fetch(image);
        const blob = await res.blob();
        formData.append("image", blob, fileName);
      } else {
        formData.append("image", {
          uri: image,
          name: fileName,
          type: mimeType,
        } as any);
      }
    }

    for (let pair of formData.entries()) {
      if (pair[0] === "image") {
        console.log(pair[0], pair[1]); 
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    let response;
    if (finalDonationId) {
      response = await updateDonation(finalDonationId, formData);
    } else {
      response = await createDonation(formData);
    }

    if (response.success) {
      showAlert("Success", response.message || "Donation Created Successfully!");
      onSuccess && onSuccess();
      navigate("/profile/userProfile");
    } else {
      showAlert("Failed", response.message || "Something went wrong");
    }
  } catch (error: any) {
    showAlert("Error", error.message || "Unexpected error occurred");
  }
};


  const handleOnCancel = () => {
    // Reset form or navigate
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={STYLES.formTitle}>ADD DONATION</Text>
        <View>
          <TextInput
            style={STYLES.input}
            placeholder="Title Your Donation"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.itemContainer}>
            <View style={styles.halfItem}>
              <TextInput
                style={STYLES.input}
                placeholder="Item Name"
                placeholderTextColor={COLORS.textPlaceHolder}
                value={item}
                onChangeText={setItem}
              />
            </View>
            <View style={styles.halfItem}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={handlePickerChange}
                style={STYLES.input}
              >
                <Picker.Item label="Select Category" value="" />
                {categoryList.map((cat) => (
                  <Picker.Item label={cat.name} value={cat.name} key={cat._id} />
                ))}
                <Picker.Item label="Other (Type your own)" value="__custom__" />
              </Picker>
            </View>
          </View>

          {isCustomCategory && (
            <TextInput
              style={STYLES.input}
              placeholder="Enter Custom Category"
              placeholderTextColor={COLORS.textPlaceHolder}
              value={category}
              onChangeText={handleCustomCategoryInput}
            />
          )}

          <TextInput
            style={STYLES.input}
            placeholder="Description"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={STYLES.input}
            placeholder="Quantity"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={quantity}
            onChangeText={setQuantity}
          />

          <TextInput
            style={STYLES.input}
            placeholder="Provider Name"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={STYLES.input}
            placeholder="Provider Phone"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={phone}
            onChangeText={setPhone}
          />

          <Picker
            selectedValue={district}
            onValueChange={setDistrict}
            style={STYLES.input}
          >
            <Picker.Item label="Select District" value="" />
            {districtList.map((dist) => (
              <Picker.Item label={dist.name} value={dist._id} key={dist.name} />
            ))}
          </Picker>

          <TextInput
            style={STYLES.input}
            placeholder="Pickup Address"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.radioLabel}>Delivery Provided</Text>
          <View style={styles.radioGroup}>
            {["Yes", "No"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOption}
                onPress={() => setMode(option)}
              >
                <View style={styles.radioCircle}>
                  {mode === option && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ marginBottom: 5, color: COLORS.textPlaceHolder }}>
            Upload an image
          </Text>
          <View style={styles.imageContainer}>
            {image && (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            {!image && (
              <TouchableOpacity onPress={pickImage} style={styles.imageUploadBox}>
                <Text style={{ color: COLORS.textPlaceHolder, fontSize: 20 }}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.button}>
        <View style={styles.halfItem}>
          <SubmitButton
            title="ADD DONATION"
            onPress={handleOnAddDonation}
            buttonColor={COLORS.buttonOther}
          />
        </View>
        <View style={styles.halfItem}>
          <SubmitButton
            title="CANCEL"
            onPress={handleOnCancel}
            buttonColor={COLORS.textHighlight}
          />
        </View>
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default AddDonationForm;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, justifyContent: "flex-start" },
  itemContainer: { flexDirection: "row", justifyContent: "space-between" },
  halfItem: { width: "48%" },
  button: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10, gap: 10 },
  imageWrapper: { position: "relative" },
  image: { width: 70, height: 70, borderRadius: SIZE.buttonRadiusSmall },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: { color: COLORS.white, fontWeight: "bold", fontSize: 12 },
  imageUploadBox: {
    width: 70,
    height: 70,
    borderRadius: SIZE.buttonRadiusSmall,
    borderWidth: 1,
    borderColor: COLORS.borderSub,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  radioLabel: { marginTop: 10, marginBottom: 5, color: COLORS.textPlaceHolder },
  radioGroup: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10, gap: 10 },
  radioOption: { flexDirection: "row", alignItems: "center", marginRight: 15, }, 
  radioCircle: { height: 18, width: 18, borderRadius: 9, borderWidth: 1, borderColor: COLORS.textHighlight, alignItems: "center", justifyContent: "center", marginRight: 6, }, 
  radioDot: { height: 8, width: 8, borderRadius: 4, backgroundColor: COLORS.textHighlight, }, 
  radioText: { fontSize: 14, color: COLORS.textDark, }, 
});
