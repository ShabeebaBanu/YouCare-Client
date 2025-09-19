import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';

interface ReceiveRequestProps {
  title: string;
  name: string;
  date: string;
  imageUrl?: any;
  onPress?: () => void;
}

const ReceiveRequestCard: React.FC<ReceiveRequestProps> = ({
  title,
  name,
  date,
  imageUrl,
  onPress
}) => {

  const handleOnPress = () => {
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handleOnPress}>
      <View style={styles.row}>
        {/* Left Image Box */}
        <View style={styles.imageBox}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" size={24} color={COLORS.textLight} />
          )}
        </View>

        {/* Right Content */}
        <View style={styles.content}>
          {/* Title Line */}
          <Text style={styles.titleText}>
            <Text style={styles.titleBold}>{title} </Text>
            <Text style={styles.titleNormal}>has a new Request</Text>
            <Text style={styles.titleNormal}>{name}</Text>
          </Text>

          {/* Date at bottom-right */}
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReceiveRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.textLight,
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageBox: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.textPlaceHolder,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleText: {
    marginBottom: 8,
    flexShrink: 1,
  },
  titleBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  titleNormal: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 11,
    color: COLORS.textOption,
  },
});
