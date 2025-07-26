import React, { useState } from "react";
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
import { CATEGORIES, MODE_OF_DELIVERY_NEED } from "@/constants/data";

const AddNeedForm = () => {
  const [title, setTitle] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleOnAddNeed = async () => {
    console.log("Submitted form with data:", {
      title,
      item,
      quantity,
      description,
      name,
      phone,
      category,
      mode,
      address,
      images,
    });
  };

  const handleOnCancel = () => {
    
  };

  const pickImage = async () => {
    if (images.length >= 3) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImages((prev) => [...prev, uri]);
    }
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((img) => img !== uri));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>ADD NEED</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Title Your Need"
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
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.input}
              >
                {CATEGORIES.map((cat) => (
                  <Picker.Item label={cat} value={cat} key={cat} />
                ))}
              </Picker>
            </View>
          </View>

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
            placeholder="Requester Name"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Requester Phone"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            style={styles.input}
            placeholder="Delivary Address"
            placeholderTextColor={COLORS.textPlaceHolder}
            value={address}
            onChangeText={setAddress}
          />

          <Picker
            selectedValue={mode}
            onValueChange={setMode}
            style={styles.input}
          >
            {MODE_OF_DELIVERY_NEED.map((del) => (
              <Picker.Item label={del} value={del} key={del} />
            ))}
          </Picker>

          <Text style={{ marginBottom: 5, color: COLORS.textPlaceHolder }}>
            Upload up to 3 images
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
            {images.length < 3 && (
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
              title="ADD NEED"
              onPress={handleOnAddNeed}
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
});

export default AddNeedForm;
