import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

interface FormValues {
  passengers: string;
  departureDate: string;
  departureLocation: string;
  arrivalLocation: string;
}

const LegSchema = Yup.object().shape({
  departureLocation: Yup.string().required('Departure location is required'),
  arrivalLocation: Yup.string()
    .required('Arrival location is required')
    .notOneOf(
      [Yup.ref('departureLocation')],
      'Arrival location must be different from departure location',
    ),
  departureDate: Yup.date()
    .min(new Date(), 'Departure date must be in the future')
    .required('Departure date is required'),
  passengers: Yup.number()
    .min(1, 'At least one passenger is required')
    .required('Number of passengers is required'),
});

interface HomeControllerState {
  modalVisible: boolean;
  formData: FormValues[]; // Replace 'any' with the actual type of the items in the array if known
  legArray: any[];
}

class HomeController extends Component<any> {
  state = {
    modalVisible: false,
    formData: [], // Add 'formData' property to the state
    legArray: [
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
  };

  handleSubmit = () => {
    console.log(this.state.legArray, 'legArray');
  };
}

export default class HomePage extends HomeController {
  render() {
    const {modalVisible, formData, legArray} = this.state;

    return (
      <View>
        <FlatList
          data={legArray}
          keyExtractor={item => item.key}
          renderItem={({item, index}) => (
            <Formik
              initialValues={item}
              validationSchema={LegSchema}
              onSubmit={this.handleSubmit}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <TextInput
                    onChangeText={handleChange('departureLocation')}
                    onBlur={handleBlur('departureLocation')}
                    value={values.departureLocation}
                    placeholder="Departure Location"
                  />
                  {errors.departureLocation && touched.departureLocation && (
                    <Text style={{color: 'red'}}>
                      {errors.departureLocation}
                    </Text>
                  )}

                  <TextInput
                    onChangeText={handleChange('arrivalLocation')}
                    onBlur={handleBlur('arrivalLocation')}
                    value={values.arrivalLocation}
                    placeholder="Arrival Location"
                  />
                  {errors.arrivalLocation && touched.arrivalLocation && (
                    <Text style={{color: 'red'}}>{errors.arrivalLocation}</Text>
                  )}

                  <TextInput
                    onChangeText={handleChange('departureDate')}
                    onBlur={handleBlur('departureDate')}
                    value={values.departureDate}
                    placeholder="Departure Date"
                  />
                  {errors.departureDate && touched.departureDate && (
                    <Text style={{color: 'red'}}>{errors.departureDate}</Text>
                  )}

                  <TextInput
                    onChangeText={handleChange('passengers')}
                    onBlur={handleBlur('passengers')}
                    value={values.passengers}
                    placeholder="Number of Passengers"
                    keyboardType="numeric"
                  />
                  {errors.passengers && touched.passengers && (
                    <Text style={{color: 'red'}}>{errors.passengers}</Text>
                  )}
                  {index < 5
                    ? index == legArray.length - 1 && (
                        <Button
                          onPress={() => {
                            this.setState((prevState: HomeControllerState) => ({
                              legArray: [
                                ...prevState.legArray,
                                {
                                  departureLocation: '',
                                  arrivalLocation: '',
                                  departureDate: '',
                                  passengers: '',
                                  key: (
                                    prevState.legArray.length + 1
                                  ).toString(),
                                },
                              ],
                            }));
                          }}
                          title="Add Leg"
                        />
                      )
                    : null}
                  {index == legArray.length - 1 && (
                    <Button onPress={() => handleSubmit()} title="Submit" />
                  )}
                </View>
              )}
            </Formik>
          )}
        />
      </View>
    );
  }
}
