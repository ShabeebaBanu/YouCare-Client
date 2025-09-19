import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';

interface SendRequestProps {
  title: string;
  name: string;
  date: string;
  onPress?: () => void;        // for card press
  onCancel?: () => void;       // for cancel button
}

const SendRequestCard: React.FC<SendRequestProps> = ({
  title,
  name,
  date,
  onPress,
  onCancel
}) => {

  const handleOnPress = () => {
    if (onPress) onPress();
  };

  const handleOnCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handleOnPress}>
      {/* Top Row: Heading + Tick Icon */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Donation Request Sent</Text>
        <Ionicons name="checkmark-circle" size={20} color={COLORS.bgblue} />
      </View>

      {/* Second Row: Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Third Row: Name */}
      <Text style={styles.name}>{name}</Text>

      {/* Bottom Row: Date + Cancel Button */}
      <View style={styles.bottomRow}>
        <Text style={styles.date}>{date}</Text>
        <TouchableOpacity style={styles.cancelButton} onPress={handleOnCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default SendRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgLight,
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.bgGray,
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
    color: COLORS.textLight,
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
});
