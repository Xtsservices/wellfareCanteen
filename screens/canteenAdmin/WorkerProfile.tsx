import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes';
import { useNavigation } from '@react-navigation/native';

type WorkerProfileScreenProps = StackScreenProps<RootStackParamList, 'WorkerProfile'>;

type CustomInputProps = {
  label: string;
  value: string;
  secureTextEntry?: boolean;
  editable?: boolean;
  containerStyle?: object;
  onChangeText?: (text: string) => void;
};

const WorkerProfile: React.FC<WorkerProfileScreenProps> = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || '',
    dob: user.dob ? user.dob.toString() : '',
    gender: user.gender || '',
    mobile: user.mobile || '',
    email: user.email || '',
    aadhaar: user.aadhar ? user.aadhar.toString() : '',
    adminName: user.adminName || '',
    adminId: user.adminId ? user.adminId.toString() : '',
    address: user.address || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePicContainer}>
          <Image source={{ uri: 'https://placekitten.com/200/200' }} style={styles.profilePic} />
        </View>
      </View>

      <View style={styles.formContainer}>
        <CustomInput label="Name" value={formData.name} editable={editMode} onChangeText={text => handleInputChange('name', text)} />
        <View style={styles.row}>
          <CustomInput
            label="Date of Birth"
            value={formData.dob}
            editable={editMode}
            containerStyle={{ flex: 1, marginRight: 8 }}
            onChangeText={text => handleInputChange('dob', text)}
          />
          <CustomInput
            label="Gender"
            value={formData.gender}
            editable={editMode}
            containerStyle={{ flex: 1 }}
            onChangeText={text => handleInputChange('gender', text)}
          />
        </View>
        <CustomInput label="Mobile Number" value={formData.mobile} editable={editMode} onChangeText={text => handleInputChange('mobile', text)} />
        <CustomInput label="Email" value={formData.email} editable={editMode} onChangeText={text => handleInputChange('email', text)} />
        <CustomInput label="Aadhaar Card" value={formData.aadhaar} editable={editMode} onChangeText={text => handleInputChange('aadhaar', text)} />
        <CustomInput label="Address" value={formData.address} editable={editMode} onChangeText={text => handleInputChange('address', text)} />
        <CustomInput label="Admin Name" value={formData.adminName} editable={editMode} onChangeText={text => handleInputChange('adminName', text)} />
        <CustomInput label="Admin ID" value={formData.adminId} editable={editMode} onChangeText={text => handleInputChange('adminId', text)} />

        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
          <Text style={styles.editButtonText}>{editMode ? 'SAVE' : 'EDIT'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        proposed by <Text style={{ color: 'orange' }}>workist</Text>
      </Text>
    </ScrollView>
  );
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  secureTextEntry = false,
  editable = false,
  containerStyle = {},
  onChangeText,
}) => (
  <View style={[styles.inputContainer, containerStyle]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, { backgroundColor: editable ? '#fff' : '#f9f9f9' }]}
      value={value}
      secureTextEntry={secureTextEntry}
      editable={editable}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0a0a91',
    height: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profilePicContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#aaa',
  },
});

export default WorkerProfile;
