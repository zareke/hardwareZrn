import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface ContactItem {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumbers: Contacts.PhoneNumber[] | undefined;
}

const ContactosScreen: React.FC = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [emergencyNumber, setEmergencyNumber] = useState<string>('');

  const loadContactsAndEmergencyNumber = useCallback(async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });

      if (data.length > 0) {
        setContacts(data as ContactItem[]);
      }
    }

    const storedEmergencyNumber = await AsyncStorage.getItem('numeroEmergencia');
    if (storedEmergencyNumber) {
      setEmergencyNumber(storedEmergencyNumber);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContactsAndEmergencyNumber();
    }, [loadContactsAndEmergencyNumber])
  );

  const containsEmoji = (str: string): boolean => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(str);
  };

  const formatName = (firstName: string | null, lastName: string | null): string => {
    const formattedFirstName = firstName || '';
    const formattedLastName = lastName || '';
    const fullName = `${formattedFirstName} ${formattedLastName}`.trim();
    return fullName || 'Nombre no disponible';
  };

  const formatPhoneNumber = (phoneNumber: string | undefined): string => {
    if (!phoneNumber) return '';
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.slice(-10); // Tomar los últimos 10 dígitos
  };

  const renderContactItem: ListRenderItem<ContactItem> = ({ item }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0
      ? item.phoneNumbers[0].number
      : undefined;
    
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const isEmergencyContact = formattedPhoneNumber === emergencyNumber;
    
    const name = formatName(item.firstName, item.lastName);
    const hasEmoji = containsEmoji(name);

    return (
      <View style={styles.contactItem}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>
            {name} {hasEmoji && <Text style={styles.emojiIndicator}>✗</Text>}
          </Text>
          <Text style={styles.contactNumber}>
            {phoneNumber || 'No disponible'}
          </Text>
        </View>
        {isEmergencyContact && (
          <Ionicons name="alert-circle" size={24} color="red" />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  emojiIndicator: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ContactosScreen;