import React, { useState, useEffect } from "react";
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
import { createNeed, updateNeed, getNeedByNeedId } from "../../../services/needService";
import { getUserId } from "@/constants/config";
import { useLocalSearchParams } from "expo-router";
import { navigate } from "../../../navigation/globalNavigation"

const deliveryOptions = ["Yes", "No", "Request Volunteer"];

type Category = { _id: string; name: string };
type District = { _id: string; name: string };

const allowedImageExtension = ["jpg", "jpeg", "png"];

type AddNeedFormProps = {
  needId?: string; 
  onSuccess?: () => void;
};

const AddNeedForm: React.FC<AddNeedFormProps> = ({ needId, onSuccess }) => {
  const { needId: queryNeedId } = useLocalSearchParams<{ needId?: string }>();
  const finalNeedId = needId || queryNeedId;

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  // form fields
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
  const [images, setImages] = useState<string[]>([]);
  const [district, setDistrict] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const isCustomCategory = selectedCategory === "__custom__";

  // fetch categories, districts, and existing need (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getAllCategory();
        const districts = await getAllDistrict();
        const userId = await getUserId();

        setCategoryList(categories);
        setDistrictList(districts);
        setCreatedBy(userId);
        console.log("need id", finalNeedId);
        if (finalNeedId) {
          setIsEdit(true);
          const existingNeed = await getNeedByNeedId(finalNeedId);

          // Prefill form fields
          setTitle(existingNeed.title || "");
          setItem(existingNeed.item || "");
          setQuantity(existingNeed.quantity?.toString() || "");
          setDescription(existingNeed.description || "");
          setName(existingNeed.needyName || "");
          setPhone(existingNeed.needyPhone || "");
          setCategory(existingNeed.category || "");
          setSelectedCategory(existingNeed.category || "");
          setMode(existingNeed.delivary || "");
          setAddress(existingNeed.delivaryAddress || "");
          setDistrict(existingNeed.district || "");
          setImages(existingNeed.images || []);
        }
      } catch (error) {
        alert("Failed to fetch categories or need data: " + error);
      }
    };

    fetchData();
  }, [finalNeedId]);

  // handle category change
  const handlePickerChange = (value: string) => {
    setSelectedCategory(value);
    setCategory(value !== "__custom__" ? value : "");
  };

  const handleCustomCategoryInput = (text: string) => {
    setCategory(text.toUpperCase());
  };

  // submit handler
  const handleOnSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("item", item);
      formData.append("quantity", quantity);
      formData.append("description", description);
      formData.append("needyName", name);
      formData.append("needyPhone", phone);
      formData.append("category", category);
      formData.append("delivary", mode);
      formData.append("delivaryAddress", address);
      formData.append("district", district);
      formData.append("createdBy", createdBy);

      // images
      images.forEach((uri, index) => {
        if (uri.startsWith("http")) {
          formData.append("existingImages", uri);
        } else {
          const fileName = uri.split("/").pop() || `image_${index}.jpg`;
          const fileExtension = fileName.split(".").pop()?.toLowerCase();
          if (!allowedImageExtension.includes(fileExtension || "")) {
            alert(`Invalid file type: ${fileExtension}`);
            return;
          }
          formData.append("images", {
            uri,
            name: fileName,
            type: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`,
          } as any);
        }
      });

      let response;
      if (isEdit && finalNeedId) {
        response = await updateNeed(finalNeedId, formData);
      } else {
        response = await createNeed(formData);
      }

      if (response.success) {
        alert(isEdit ? "Need Updated Successfully!" : "Need Created Successfully!");
        onSuccess?.(); 
        navigate("/profile/userProfile");
      } else {
        alert("Failed to submit Need: " + response.message);
      }
    } catch (error) {
      console.error("Error submitting Need:", error);
      alert("Error submitting Need: " + error);
    }
  };

  // pick new image
  const pickImage = async () => {
    if (images.length >= 2) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((img) => img !== uri));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{isEdit ? "EDIT NEED" : "ADD NEED"}</Text>

        <TextInput
          style={styles.input}
          placeholder="Title Your Need"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={COLORS.textPlaceHolder}
        />

        {/* Item + Category */}
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

        {/* Other inputs */}
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholderTextColor={COLORS.textPlaceHolder}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          placeholderTextColor={COLORS.textPlaceHolder}
        />

        <TextInput
          style={styles.input}
          placeholder="Requester Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.textPlaceHolder}
        />

        <TextInput
          style={styles.input}
          placeholder="Requester Phone"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor={COLORS.textPlaceHolder}
        />

        <Picker selectedValue={district} onValueChange={setDistrict} style={styles.input}>
          <Picker.Item label="Select District" value="" />
          {districtList.map((dist) => (
            <Picker.Item key={dist._id} label={dist.name} value={dist._id} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Delivery Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor={COLORS.textPlaceHolder}
        />

        {/* Delivery Options */}
        <Text style={{ marginBottom: 5, color: COLORS.textPlaceHolder }}>
          Delivery Needed
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          {deliveryOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setMode(option)}
              style={{ marginRight: 10, flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.textHighlight,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5,
                }}
              >
                {mode === option && (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: COLORS.textHighlight,
                    }}
                  />
                )}
              </View>
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Images */}
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

        {/* Buttons */}
        <View style={styles.button}>
          <View style={styles.halfItem}>
            <SubmitButton
              title={isEdit ? "UPDATE NEED" : "ADD NEED"}
              onPress={handleOnSubmit}
              buttonColor={COLORS.buttonOther}
            />
          </View>
          <View style={styles.halfItem}>
            <SubmitButton
              title="CANCEL"
              onPress={() => {}}
              buttonColor={COLORS.textHighlight}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: {
    fontSize: SIZE.medium,
    color: COLORS.textHighlight,
    marginBottom: 30,
    textAlign: "center",
  },
  itemContainer: { flexDirection: "row", justifyContent: "space-between" },
  halfItem: { width: "48%" },
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
  removeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
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
});

export default AddNeedForm;
