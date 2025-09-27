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
  Platform,
} from "react-native";
import SubmitButton from "../submitButton";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

import { getAllCategory, Category } from "../../../services/categorService";
import { getAllDistrict, District } from "../../../services/districtService";
import { createNeed, updateNeed, getNeedByNeedId } from "../../../services/needService";
import { getUserId } from "@/constants/config";
import { useLocalSearchParams } from "expo-router";
import { navigate } from "../../../navigation/globalNavigation";
import CustomAlert from "@/constants/customAlert";

const deliveryOptions = ["Yes", "No"];
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
  const [image, setImage] = useState<string | null>(null);
  const [district, setDistrict] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const isCustomCategory = selectedCategory === "__custom__";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getAllCategory();
        const districts = await getAllDistrict();
        const userId = await getUserId();

        setCategoryList(categories.data);
        setDistrictList(districts.data);
        setCreatedBy(userId);

        if (finalNeedId) {
          setIsEdit(true);
          const existingData = await getNeedByNeedId(finalNeedId);
          const existingNeed = existingData.data;

          setTitle(existingNeed.title || "");
          setItem(existingNeed.item || "");
          setQuantity(existingNeed.quantity?.toString() || "");
          setDescription(existingNeed.description || "");
          setName(existingNeed.needyName || "");
          setPhone(existingNeed.needyPhone || "");
          setCategory(existingNeed.category || "");
          setSelectedCategory(existingNeed.category?.name || "");
          setMode(existingNeed.delivary || "");
          setAddress(existingNeed.delivaryAddress || "");
          setDistrict(existingNeed.district?._id || "");
          setImage(existingNeed.image || null); 
        }
      } catch (error: any) {
        showAlert("Error", error?.message || "Failed to fetch categories or need data");
      }
    };

    fetchData();
  }, [finalNeedId]);

  const handlePickerChange = (value: string) => {
    setSelectedCategory(value);
    setCategory(value !== "__custom__" ? value : "");
  };

  const handleCustomCategoryInput = (text: string) => {
    setCategory(text.toUpperCase());
  };

  const pickImage = async () => {
    if (image) return; 
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

      if (image) {
        const fileName = image.split("/").pop() || "image.jpg";
        const ext = fileName.split(".").pop()?.toLowerCase();
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

      let response;
      if (isEdit && finalNeedId) {
        response = await updateNeed(finalNeedId, formData);
      } else {
        response = await createNeed(formData);
      }

      if (response.success) {
        showAlert("Success", isEdit ? response.message || "Need Updated Successfully!" : response.message || "Need Created Successfully!");
        onSuccess?.();
        navigate("/profile/userProfile");
      } else {
        showAlert("Failed", response.message || "Failed to submit Need");
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "Error submitting Need");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={STYLES.formTitle}>{isEdit ? "EDIT NEED" : "ADD NEED"}</Text>

        <TextInput style={STYLES.input} placeholder="Title Your Need" value={title} onChangeText={setTitle} placeholderTextColor={COLORS.textPlaceHolder} />

        <View style={styles.itemContainer}>
          <View style={styles.halfItem}>
            <TextInput style={STYLES.input} placeholder="Item Name" value={item} onChangeText={setItem} placeholderTextColor={COLORS.textPlaceHolder} />
          </View>
          <View style={styles.halfItem}>
            <Picker selectedValue={selectedCategory} onValueChange={handlePickerChange} style={STYLES.input}>
              <Picker.Item label="Select Category" value="" />
              {categoryList.map((cat) => (<Picker.Item label={cat.name} value={cat.name} key={cat._id} />))}
              <Picker.Item label="Other (Type your own)" value="__custom__" />
            </Picker>
          </View>
        </View>

        {isCustomCategory && <TextInput style={STYLES.input} placeholder="Enter Custom Category" value={category} onChangeText={handleCustomCategoryInput} placeholderTextColor={COLORS.textPlaceHolder} />}

        <TextInput style={STYLES.input} placeholder="Description" value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholderTextColor={COLORS.textPlaceHolder} />

        <TextInput style={STYLES.input} placeholder="Quantity" value={quantity} onChangeText={setQuantity} placeholderTextColor={COLORS.textPlaceHolder} />

        <TextInput style={STYLES.input} placeholder="Requester Name" value={name} onChangeText={setName} placeholderTextColor={COLORS.textPlaceHolder} />

        <TextInput style={STYLES.input} placeholder="Requester Phone" value={phone} onChangeText={setPhone} placeholderTextColor={COLORS.textPlaceHolder} />

        <Picker selectedValue={district} onValueChange={setDistrict} style={STYLES.input}>
          <Picker.Item label="Select District" value="" />
          {districtList.map((dist) => (<Picker.Item key={dist._id} label={dist.name} value={dist._id} />))}
        </Picker>

        <TextInput style={STYLES.input} placeholder="Delivery Address" value={address} onChangeText={setAddress} placeholderTextColor={COLORS.textPlaceHolder} />

        <Text style={{ marginBottom: 5, color: COLORS.textPlaceHolder }}>Delivery Needed</Text>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          {deliveryOptions.map((option) => (
            <TouchableOpacity key={option} onPress={() => setMode(option)} style={{ marginRight: 10, flexDirection: "row", alignItems: "center" }}>
              <View style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 1, borderColor: COLORS.textHighlight, alignItems: "center", justifyContent: "center", marginRight: 5 }}>
                {mode === option && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: COLORS.textHighlight }} />}
              </View>
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ marginBottom: 5, color: COLORS.textPlaceHolder }}>Upload 1 image</Text>
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

        <View style={styles.button}>
          <View style={styles.halfItem}>
            <SubmitButton title={isEdit ? "UPDATE NEED" : "ADD NEED"} onPress={handleOnSubmit} buttonColor={COLORS.buttonOther} />
          </View>
          <View style={styles.halfItem}>
            <SubmitButton title="CANCEL" onPress={() => {}} buttonColor={COLORS.textHighlight} />
          </View>
        </View>
      </ScrollView>
      <CustomAlert visible={alertVisible} title={alertTitle} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  itemContainer: { flexDirection: "row", justifyContent: "space-between" },
  halfItem: { width: "48%" },
  button: { marginTop: 20, marginBottom: 10, flexDirection: "row", justifyContent: "space-between" },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10, gap: 10 },
  imageWrapper: { position: "relative" },
  image: { width: 70, height: 70, borderRadius: SIZE.buttonRadiusSmall },
  removeButton: { position: "absolute", top: -6, right: -6, backgroundColor: "red", borderRadius: 10, width: 20, height: 20, justifyContent: "center", alignItems: "center" },
  removeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  imageUploadBox: { width: 70, height: 70, borderRadius: SIZE.buttonRadiusSmall, borderWidth: 1, borderColor: COLORS.borderSub, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white },
});

export default AddNeedForm;
