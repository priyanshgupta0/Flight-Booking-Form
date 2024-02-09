import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Field, FieldArray, Formik} from 'formik';
import * as Yup from 'yup';

interface FormValues {
  passengers: string;
  departureDate: string;
  departureLocation: string;
  arrivalLocation: string;
}

const validationSchema = Yup.object().shape({
  legs: Yup.array().of(
    Yup.object().shape({
      departureLocation: Yup.string().required(
        'Departure location is required',
      ),
      arrivalLocation: Yup.string().required('Arrival location is required'),
      departureDate: Yup.date().required('Departure date is required'),
      passengers: Yup.string()
        .required('Number of passengers is required')
        .min(1, 'Must be at least 1 digit')
        .matches(/^[0-9]+$/, 'Must be a valid number'),
    }),
  ),
});
interface HomeControllerState {
  modalVisible: boolean;
  formData: FormValues[]; // Replace 'any' with the actual type of the items in the array if known
  states: string[];
}

interface FormErrors {
  legs: {
    departureLocation: string;
    arrivalLocation: string;
    departureDate: string;
    passengers: string;
    key: string;
  }[];
}

class HomeController extends Component<any> {
  state = {
    modalVisible: false,
    formData: [], // Add 'formData' property to the state
    states: [
      'USA',
      'Canada',
      'Mexico',
      'Brazil',
      'UK',
      'Germany',
      'France',
      'Italy',
      'China',
      'Japan',
    ],
  };

  handleSubmit = (value: any) => {
    console.log(value, 'value');
  };
}

export default class HomePage extends HomeController {
  render() {
    const {modalVisible, formData} = this.state;

    return (
      <View>
        <Formik
          initialValues={{
            legs: [
              {
                departureLocation: '',
                arrivalLocation: '',
                departureDate: '',
                passengers: '',
                key: '1',
              },
              {
                departureLocation: '',
                arrivalLocation: '',
                departureDate: '',
                passengers: '',
                key: '2',
              },
            ],
          }}
          validationSchema={validationSchema}
          onSubmit={this.handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <FieldArray name="legs">
              {arrayHelpers => (
                <ScrollView>
                  {values.legs.map((leg, index) => (
                    <View key={leg.key}>
                      <Picker
                        selectedValue={leg.departureLocation}
                        onValueChange={(itemValue, itemIndex) =>
                          setFieldValue(
                            `legs[${index}].departureLocation`,
                            itemValue,
                          )
                        }>
                        <Picker.Item
                          label="Select Departure Location"
                          value=""
                        />
                        {this.state.states.map((state, stateIndex) => (
                          <Picker.Item
                            label={state}
                            value={state}
                            key={stateIndex}
                          />
                        ))}
                      </Picker>
                      {errors.legs &&
                        errors.legs[index] &&
                        (errors as FormErrors).legs[index].departureLocation &&
                        touched.legs &&
                        touched.legs[index] &&
                        touched.legs[index].departureLocation && (
                          <Text style={{color: 'red'}}>
                            {
                              (errors as FormErrors).legs[index]
                                .departureLocation
                            }
                          </Text>
                        )}
                      <Picker
                        selectedValue={leg.arrivalLocation}
                        onValueChange={(itemValue, itemIndex) =>
                          setFieldValue(
                            `legs[${index}].arrivalLocation`,
                            itemValue,
                          )
                        }>
                        <Picker.Item label="Select Arrival Location" value="" />
                        {this.state.states.map((state, stateIndex) => (
                          <Picker.Item
                            label={state}
                            value={state}
                            key={stateIndex}
                          />
                        ))}
                      </Picker>
                      {errors.legs &&
                        errors.legs[index] &&
                        (errors as FormErrors).legs[index].arrivalLocation &&
                        touched.legs &&
                        touched.legs[index] &&
                        touched.legs[index].arrivalLocation && (
                          <Text style={{color: 'red'}}>
                            {(errors as FormErrors).legs[index].arrivalLocation}
                          </Text>
                        )}

                      <TextInput
                        onChangeText={value =>
                          setFieldValue(`legs[${index}].departureDate`, value)
                        }
                        // onBlur={handleBlur(item.departureLocation)}
                        value={leg.departureDate}
                        placeholder="Departure Date"
                      />
                      {errors.legs &&
                        errors.legs[index] &&
                        (errors as FormErrors).legs[index].departureDate &&
                        touched.legs &&
                        touched.legs[index] &&
                        touched.legs[index].departureDate && (
                          <Text style={{color: 'red'}}>
                            {(errors as FormErrors).legs[index].departureDate}
                          </Text>
                        )}

                      <TextInput
                        onChangeText={value =>
                          setFieldValue(`legs[${index}].passengers`, value)
                        }
                        // onBlur={handleBlur(item.departureLocation)}
                        value={leg.passengers}
                        placeholder="Number of Passengers"
                        keyboardType="numeric"
                      />
                      {errors.legs &&
                        errors.legs[index] &&
                        (errors as FormErrors).legs[index].passengers &&
                        touched.legs &&
                        touched.legs[index] &&
                        touched.legs[index].passengers && (
                          <Text style={{color: 'red'}}>
                            {(errors as FormErrors).legs[index].passengers}
                          </Text>
                        )}
                    </View>
                  ))}
                  {values.legs.length < 5 && (
                    <Button
                      onPress={() => {
                        arrayHelpers.push({
                          departureLocation: '',
                          arrivalLocation: '',
                          departureDate: '',
                          passengers: '',
                          key: `${values.legs.length + 1}`,
                        });
                      }}
                      title="Add Leg"
                    />
                  )}

                  <Button onPress={() => handleSubmit()} title="Submit" />
                </ScrollView>
              )}
            </FieldArray>
          )}
        </Formik>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View style={{backgroundColor: 'white', padding: 20}}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
                Submitted Data:
              </Text>
              {formData.map((data: FormValues, index) => (
                <View key={index} style={{marginBottom: 10}}>
                  <Text>Leg {index + 1}:</Text>
                  <Text>Departure Location: {data.departureLocation}</Text>
                  <Text>Arrival Location: {data.arrivalLocation}</Text>
                  <Text>Departure Date: {data.departureDate}</Text>
                  <Text>Passengers: {data.passengers}</Text>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: false})}
                style={{marginTop: 10}}>
                <Text style={{color: 'blue', textAlign: 'center'}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
