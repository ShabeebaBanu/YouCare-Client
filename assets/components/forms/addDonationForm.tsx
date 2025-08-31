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
} from "react-native";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

import { getAllCategory } from "../../../services/categorService";
import { getAllDistrict } from "../../../services/districtService";
import { createDonation, 
         getDonationByDonationId,
         updateDonation
} from "../../../services/donationService";

import { getUserId } from "@/constants/config";
import { useLocalSearchParams } from "expo-router";
import { navigate } from "../../../navigation/globalNavigation"

type Category = {
  _id: string;
  name: string;
};

type District = {
  _id: string;
  name: string;
};

interface AddDonationFormProps {
  donationId?: string; 
  onSuccess?: () => void; 
}


const allowedImageExtension = ['jpg', 'jpeg', 'png'];

const AddDonationForm: React.FC<AddDonationFormProps> = ({ donationId, onSuccess }) => {
  const { donationId: queryDonationId } = useLocalSearchParams<{ donationId?: string }>();
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
  const [images, setImages] = useState<string[]>([]);

  const isCustomCategory = selectedCategory === "__custom__";

  useEffect(() => {
  const fetchAllCategoriesAndDistricts = async () => {
    try {
      const categories = await getAllCategory();
      const districts = await getAllDistrict();
      const userId = await getUserId();

      setCategoryList(categories);
      setDistrictList(districts);
      setCreatedBy(userId);
      console.log("donation id", finalDonationId);
      if (finalDonationId) {
        console.log("inside fetch donation")
        const res = await getDonationByDonationId(finalDonationId); 
        const d = res;

        setTitle(d.title);
        setItem(d.item);
        setQuantity(d.quantity.toString());
        setDescription(d.description);
        setName(d.donerName);
        setPhone(d.donerPhone);
        setCategory(d.category?.name || "");
        setSelectedCategory(d.category?.name || "");
        setMode(d.delivary);
        setAddress(d.pickupAddress);
        setDistrict(d.district?._id || "");
        setImages(d.images || []);
      }
    } catch (error) {
      alert("Failed to fetch categories or donation: " + error);
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

  const handleOnAddDonation = async () => {
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
    formData.append('createdBy', createdBy);

    images.forEach((uri, index) => {
      const fileName = uri.split("/").pop() || `image_${index}.jpg`;
      const fileExtension = fileName.split(".").pop()?.toLowerCase();
      if (!allowedImageExtension.includes(fileExtension || '')) return;
      formData.append("images", {
        uri,
        name: fileName,
        type: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`,
      } as any);
    });

    let response;
    if (finalDonationId) {
      response = await updateDonation(finalDonationId, formData);
    } else {
      response = await createDonation(formData);
    }

    if (response.success) {
      alert(finalDonationId ? "Donation Updated Successfully!" : "Donation Created Successfully!");
      onSuccess && onSuccess();
      navigate("/profile/userProfile");
    } else {
      alert("Failed: " + response.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error: " + error);
  }
};

  const handleOnCancel = () => {
    // Reset form or navigate
  };

  const pickImage = async () => {
    if (images.length >= 2) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: false,
      exif: false
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log("Picked image URI:", uri);
      setImages((prev) => [...prev, uri]);
    }
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((img) => img !== uri));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>ADD DONATION</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Title Your Donation"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.itemContainer}>
            <View style={styles.halfItem}>
              <TextInput
                style={styles.input}
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
                style={styles.input}
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
              style={styles.input}
              placeholder="Enter Custom Category"
              placeholderTextColor={COLORS.textPlaceHolder}
              value={category}
              onChangeText={handleCustomCategoryInput}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={styles.input}
            placeholder="Quantity"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={quantity}
            onChangeText={setQuantity}
          />

          <TextInput
            style={styles.input}
            placeholder="Provider Name"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Provider Phone"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={phone}
            onChangeText={setPhone}
          />

          <Picker
            selectedValue={district}
            onValueChange={setDistrict}
            style={styles.input}
          >
            <Picker.Item label="Select District" value="" />
            {districtList.map((dist) => (
              <Picker.Item label={dist.name} value={dist._id} key={dist.name} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Pickup Address"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.radioLabel}>Delivery Provided</Text>
          <View style={styles.radioGroup}>
            {["Yes", "No", " Request Volunteer"].map((option) => (
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
            Upload up to 2 images
          </Text>
          <View style={styles.imageContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  onPress={() => removeImage(uri)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 2 && (
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: SIZE.medium,
    color: COLORS.textHighlight,
    marginBottom: 30,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfItem: {
    width: "48%",
  },
  input: {
    borderColor: COLORS.borderSub,
    borderWidth: 1,
    borderRadius: SIZE.buttonRadiusSmall,
    marginBottom: 10,
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
    backgroundColor: COLORS.white,
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: SIZE.buttonRadiusSmall,
  },
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
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
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

  radioLabel: {
  marginTop: 10,
  marginBottom: 5,
  color: COLORS.textPlaceHolder,
  },

  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    gap: 10,
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },

  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.textHighlight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  radioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textHighlight,
  },

  radioText: {
    fontSize: 14,
    color: COLORS.textDark,
  },

});

export default AddDonationForm;
