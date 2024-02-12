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
import DateTimePicker from '@react-native-community/datetimepicker';
import {Field, FieldArray, Formik} from 'formik';
import * as Yup from 'yup';

interface FormValues {
  passengers: string;
  departureDate: string;
  departureLocation: string;
  arrivalLocation: string;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const validationSchema = Yup.object().shape({
  legs: Yup.array()
    .of(
      Yup.object().shape({
        departureLocation: Yup.string().required(
          'Departure location is required',
        ),
        arrivalLocation: Yup.string()
          .required('Arrival location is required')
          .notOneOf(
            [Yup.ref('departureLocation'), null], // Compare against 'departureLocation'
            'Arrival location cannot be the same as departure location',
          ),
        departureDate: Yup.date()
          .required('Departure date is required')
          .min(today, 'Departure date must be today or later'),
        passengers: Yup.number()
          .required('Number of passengers is required')
          .min(1, 'At least 1 passenger is required'),
      }),
    )
    .test(
      'is-ascending',
      'Dates must be in ascending order',
      function (value: any) {
        let isValid = true;
        for (let i = 1; i < value.length; i++) {
          if (
            new Date(value[i].departureDate!) <
            new Date(value[i - 1].departureDate!)
          ) {
            isValid = false;
            break;
          }
        }
        return isValid;
      },
    ),
});
interface HomeControllerState {
  modalVisible: boolean;
  formData: FormValues[]; // Replace 'any' with the actual type of the items in the array if known
  states: string[];
  showDatePicker: any;
}

interface FormErrors {
  legs: {
    departureLocation: string;
    arrivalLocation: string;
    departureDate: string;
    passengers: string;
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
    showDatePicker: null,
  };

  handleSubmit = (value: any) => {
    this.setState({modalVisible: true, formData: value.legs});
    console.log(value, 'value');
  };
}

export default class HomePage extends HomeController {
  regex = /^[1-9][0-9]*$/;
  render() {
    const {modalVisible, formData, showDatePicker} = this.state;

    return (
      <View>
        <Formik
          initialValues={{
            legs: [
              {
                departureLocation: '',
                arrivalLocation: '',
                departureDate: new Date().toISOString(),
                passengers: '',
              },
              {
                departureLocation: '',
                arrivalLocation: '',
                departureDate: new Date().toISOString(),
                passengers: '',
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
                    <View key={index}>
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

                      <TouchableOpacity
                        onPress={() => this.setState({showDatePicker: index})}>
                        <Text>Select Date</Text>
                      </TouchableOpacity>
                      {showDatePicker === index && (
                        <DateTimePicker
                          value={new Date(leg.departureDate)} // Make sure departureDate has a Date object
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            this.setState({showDatePicker: false});
                            const newDate = selectedDate
                              ? selectedDate.toISOString()
                              : '';
                            setFieldValue(
                              `legs[${index}].departureDate`,
                              newDate,
                            );
                          }}
                        />
                      )}
                      <TextInput
                        editable={false} // onBlur={handleBlur(item.departureLocation)}
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
                        onChangeText={value => {
                          if (this.regex.test(value) || value == '') {
                            setFieldValue(`legs[${index}].passengers`, value);
                          }
                        }}
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
                      {values.legs.length > 2 && // Only show if there's more than one leg
                        index > 1 && (
                          <Button
                            onPress={() => arrayHelpers.remove(index)} // Use FieldArray helper to remove
                            title="Remove Leg"
                          />
                        )}
                    </View>
                  ))}

                  {values.legs.length < 5 && (
                    <Button
                      onPress={() => {
                        arrayHelpers.push({
                          departureLocation: '',
                          arrivalLocation: '',
                          departureDate: new Date().toISOString(),
                          passengers: '',
                        });
                      }}
                      title="Add Leg"
                    />
                  )}
                  {errors.legs && typeof errors.legs === 'string' && (
                    <Text style={{color: 'red'}}>{errors.legs}</Text>
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
