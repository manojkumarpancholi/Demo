

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { API_URL } from '../constants';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setEmployees(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async id => {
    Alert.alert('Delete Employee', 'You want to delete employee', [
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
            Alert.alert('Deleted!', 'Employee record deleted successfully.');
            fetchEmployees();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete employee');
          }
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const renderEmployee = ({item}) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.employeeId}>
          Employee ID: <Text style={{color: 'red'}}>{item.id}</Text>
        </Text>
        <TouchableOpacity onPress={() => deleteEmployee(item.id)}>
          <Image
            source={require('../assets/delete.png')}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <View style={styles.detailText}>
          <Text style={styles.label}>Employee Name: </Text>
          <Text style={styles.empStyle}>{item.name}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.detailText}>
          <Text style={styles.label}>Employee Salary: </Text>
          <Text style={styles.empStyle}>{item.salary}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.detailText}>
          <Text style={styles.label}>Employee Age: </Text>
          <Text style={styles.empStyle}>{item.age}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.empHeading}>Employee Details</Text>
      <FlatList
        data={employees}
        keyExtractor={item => item.id.toString()}
        renderItem={renderEmployee}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'darkgray',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  employeeId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#113C6D',
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  details: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 4,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empStyle: {
    fontSize: 16,
    color: '#113C6D',
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  empHeading: {
    fontSize: 16,
    color: '#113C6D',
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
  },
  line: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'darkgray',
    marginVertical: 5,
  },
});

export default EmployeeList;
