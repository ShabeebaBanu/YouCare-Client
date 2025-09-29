import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';

interface SendRequestProps {
  title: string;
  name: string;
  date: string;
  onPress?: () => void;        
  onCancel?: () => void;  
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED";   
  requestType?: "Donation" | "Need"; 
}

const SendRequestCard: React.FC<SendRequestProps> = ({
  title,
  name,
  date,
  onPress,
  onCancel,
  status = "PENDING",
  requestType = "Donation",
}) => {

  const handleOnPress = () => {
    if (onPress) onPress();
  };

  const handleOnCancel = () => {
    if (onCancel) onCancel();
  };

  let heading = "Donation Request Sent";
  let icon = <Ionicons name="time-outline" size={20} color={COLORS.bgblue} />;
  let cardStyle = [styles.card, { backgroundColor: COLORS.bgLight }];
  let showCancel = true;
  let statusLabel: string | null = null;
  let statusBg: string | null = null;

  if (requestType === "Donation") {
    if (status === "ACCEPTED") {
      heading = "Donation Request Accepted";
      icon = <Ionicons name="checkmark-circle" size={22} color={COLORS.buttonAccept} />;
      cardStyle = [styles.card, { backgroundColor: COLORS.bgGreen }];
      showCancel = false;
    } else if (status === "REJECTED") {
      heading = "Donation Request Rejected";
      icon = <Ionicons name="close-circle" size={22} color={COLORS.buttonReject} />;
      cardStyle = [styles.card, { backgroundColor: COLORS.bgRed }];
      showCancel = false;
    }
  } else if (requestType === "Need") {
    heading = "Need Approval Request Send";
    showCancel = false;

    if (status === "ACCEPTED") {
      statusLabel = "Accepted";
      statusBg = null; 
    } else if (status === "DELIVERED") {
      statusLabel = "Delivered";
      statusBg = "green";
    }
  }

  return (
    <TouchableOpacity style={cardStyle} activeOpacity={0.9} onPress={handleOnPress}>

      <View style={styles.headerRow}>
        <Text style={styles.heading}>{heading}</Text>
        {icon}
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.name}>{name}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.date}>{date}</Text>

        {requestType === "Need" && statusLabel && (
          <View style={[styles.badge, statusBg ? { backgroundColor: statusBg } : {}]}>
            <Text style={styles.badgeText}>{statusLabel}</Text>
          </View>
        )}

        {requestType === "Donation" && showCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleOnCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SendRequestCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    color: COLORS.textHighlight,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    color: COLORS.textOption,
  },
  cancelButton: {
    backgroundColor: COLORS.textgray,  
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cancelText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: "600",
  },
});
