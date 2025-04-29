import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes';

type UsersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Users'>;

const Users: React.FC = () => {
    const navigation = useNavigation<UsersScreenNavigationProp>();
    const [users, setUsers] = useState([
        { 
            id: 1,
            name: 'Worker 1',
            mobile: '123-456-7890',
            position: 'Software Engineer',
            email: 'worker1@example.com',
            address: '123 Main St',
            dob: '01/01/1990',
            gender: 'Male',
            aadhar: '1234-5678-9012',
            adminName: 'Admin 1',
            adminId: '111111'
        },
        { 
            id: 2,
            name: 'Worker 2',
            mobile: '234-567-8901',
            position: 'Project Manager',
            email: 'worker2@example.com',
            address: '456 Elm St',
            dob: '02/02/1992',
            gender: 'Female',
            aadhar: '2234-5678-9012',
            adminName: 'Admin 2',
            adminId: '222222'
        }
    ]);

    const handleAddUser = (newUser: any) => {
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        setUsers([...users, {
            ...newUser,
            id: newId,
            position: newUser.position || 'New Position',
            address: newUser.address || 'New Address'
        }]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                          <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>
                <Text style={styles.headerTitle}>USERS</Text>
                <TouchableOpacity
                    style={styles.addUserButton}
                    onPress={() => navigation.navigate('AddUser', { onAddUser: handleAddUser })}
                >
                    <Text style={styles.addUserText}>ADD USER +</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.listContainer}>
                    {users.map((user) => (
                        <TouchableOpacity
                            key={user.id}
                            style={styles.userCard}
                            onPress={() => navigation.navigate('WorkerProfile', { user })}
                        >
                            <View>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.userMobile}>{user.mobile}</Text>
                                <Text style={styles.userPosition}>{user.position}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>proposed by</Text>
                    <Text style={styles.footerText}>🔸 your logo here 🔸</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f6fc',
    },
    backArrow: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    header: {
        paddingTop: 60,
        backgroundColor: '#0056D2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    addUserButton: {
        backgroundColor: '#0033A0',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        elevation: 3,
    },
    addUserText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    listContainer: {
        padding: 16,
        marginTop: 10,
    },
    userCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    userMobile: {
        fontSize: 14,
        color: '#666',
        marginTop: 6,
    },
    userPosition: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 14,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        marginTop: 20,
    },
    footerText: {
        fontSize: 13,
        color: '#888',
    },
});

export default Users;