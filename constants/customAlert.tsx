import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "./colors";
import SIZE from "./size";

type AlertProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void; 
  confirmText?: string;
  cancelText?: string;
};

const CustomAlert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          <View style={styles.modalButtons}>
            {onConfirm ? (
              <>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={{ color: COLORS.textDark }}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                  <Text style={{ color: COLORS.white }}>{confirmText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
                <Text style={{ color: COLORS.white }}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: COLORS.bgLight,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.textgray,
  },
  modalMessage: {
    fontSize: SIZE.small,
    marginBottom: 20,
    color: COLORS.textDark,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: COLORS.buttonReject,
    borderRadius: 5,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: COLORS.bgDark,
    borderRadius: 5,
  },
});

export default CustomAlert;
