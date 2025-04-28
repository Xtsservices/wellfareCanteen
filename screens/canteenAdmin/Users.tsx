import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigationTypes';

type UsersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Users'>;

const Users: React.FC = () => {
    const navigation = useNavigation<UsersScreenNavigationProp>();

    // Sample dummy users data
    const users = [
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
            adminName: 'hsuifhiush',
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
            adminName: 'dferfer',
            adminId: '222222'
        },
        { 
            id: 3,
            name: 'Worker 3',
            mobile: '345-678-9012',
            position: 'UX Designer',
            email: 'worker3@example.com',
            address: '789 Oak St',
            dob: '03/03/1993',
            gender: 'Male',
            aadhar: '3234-5678-9012',
            adminName: 'refge',
            adminId: '333333'
        },
        { 
            id: 4,
            name: 'Worker 4',
            mobile: '456-789-0123',
            position: 'Data Analyst',
            email: 'worker4@example.com',
            address: '321 Pine St',
            dob: '04/04/1994',
            gender: 'Female',
            aadhar: '4234-5678-9012',
            adminName: 'rgwreg',
            adminId: '444444'
        },
    ];
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>USERS</Text>
                <TouchableOpacity
                    style={styles.addUserButton}
                    onPress={() => navigation.navigate('AddUser')}
                >
                    <Text style={styles.addUserText}>ADD USER +</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                {users.map((user) => (
                    <TouchableOpacity
                    key={user.id}
                    style={styles.userCard}
                    onPress={() => navigation.navigate('WorkerProfile', {user})}
                >
                    <View>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userMobile}>{user.mobile}</Text>
                    </View>
                </TouchableOpacity>
                
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>proposed by</Text>
                <Text style={styles.footerText}>🔸 your logo here 🔸</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#0033A0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    addUserButton: {
        backgroundColor: '#0033A0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addUserText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
    },
    userCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userMobile: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});

export default Users;
