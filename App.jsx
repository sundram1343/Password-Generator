import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Formik } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Should be min of 4 characters')
    .max(16, 'Should be max of 16 characters')
    .required('Length is required'),
});

const App = () => {
  const [password, setPassword] = useState('');
  const [isPassGenerated, setIsPassGenerated] = useState(false);
  const [lowercase, setLowercase] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const generatePasswordString = (passwordLength) => {
    let characterList = '';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*()_+';

    if (uppercase) characterList += uppercaseChars;
    if (lowercase) characterList += lowercaseChars;
    if (numbers) characterList += digitChars;
    if (symbols) characterList += specialChars;

    const passwordResult = createPassword(characterList, passwordLength);
    setPassword(passwordResult);
    setIsPassGenerated(true);
  };

  const createPassword = (characters, passwordLength) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  };

  const resetPasswordState = () => {
    setPassword('');
    setIsPassGenerated(false);
    setLowercase(true);
    setUppercase(false);
    setNumbers(false);
    setSymbols(false);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Password Generator</Text>
          
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={PasswordSchema}
            onSubmit={values => {
              generatePasswordString(+values.passwordLength); 
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit, handleReset }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>{errors.passwordLength}</Text>
                    )}
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="Ex. 8"
                    keyboardType="numeric"
                  />
                </View>

                {/* Checkboxes */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Lowercase</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={lowercase}
                    onPress={() => setLowercase(!lowercase)}
                    fillColor="#29AB87"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Uppercase</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={uppercase}
                    onPress={() => setUppercase(!uppercase)}
                    fillColor="#FED85D"
                  />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.heading}>Include Symbols</Text>
                    <BouncyCheckbox
                      disableBuiltInState
                      isChecked={symbols}
                      onPress={()=>setSymbols(!symbols)}
                      fillColor='#ADD8E6'
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.heading}>Include Numbers</Text>
                    <BouncyCheckbox
                      disableBuiltInState
                      isChecked={numbers}
                      onPress={()=>setNumbers(!numbers)}
                      fillColor='#ADD989'
                    />
                    </View>
                {/* Buttons */}
                <View style={styles.formActions}>
                  <TouchableOpacity 
                    style={styles.primaryBtn} 
                    onPress={handleSubmit}
                  >
                    <Text style={styles.primaryBtnText}>Generate Password</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.secondaryBtn} 
                    onPress={() => {
                      handleReset();
                      resetPasswordState();
                    }}
                  >
                    <Text style={styles.secondaryBtnText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>

          {/* Result Area */}
          {isPassGenerated && (
            <View style={styles.card}>
              <Text style={styles.subTitle}>Result:</Text>
              <Text selectable style={styles.generatedPassword}>{password}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  appContainer: { padding: 16 },
  formContainer: { margin: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  heading: { fontSize: 16 },
  inputWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  inputStyle: { borderWidth: 1, borderColor: '#ccc', padding: 8, width: 60, borderRadius: 4 },
  errorText: { fontSize: 12, color: 'red' },
  formActions: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  primaryBtn: { backgroundColor: '#29AB87', padding: 12, borderRadius: 8, marginHorizontal: 8 },
  primaryBtnText: { color: '#fff', fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#CAD5E2', padding: 12, borderRadius: 8, marginHorizontal: 8 },
  secondaryBtnText: { color: '#000' },
  card: { marginTop: 30, padding: 20, backgroundColor: '#f0f0f0', borderRadius: 8, alignItems: 'center' },
  subTitle: { fontSize: 18, fontWeight: 'bold' },
  generatedPassword: { fontSize: 22, marginTop: 10, color: '#333' },
});
