import React from 'react';
import { View, Text, TextInput, Platform } from 'react-native';

import MasterStyles from '../../styles/MasterStyles';

interface InputFieldProps {
  label: string;
  value: any;
  placeholder?: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  containerStyles?: object[] | object;
  keyboardType:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad';
  textContentType:
    | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode';
  autoCapitalize: 'none' | 'characters' | 'sentences' | 'words';
  editable: boolean;
  secureTextEntry: boolean;
}

InputField.defaultProps = {
  autoCapitalize: 'sentences',
  editable: true,
  keyboardType: 'default',
  textContentType: 'none',
  secureTextEntry: false,
};

/**
 * A stylized version of the TextInput component
 * provided by react-native.
 */
export default function InputField({
  label,
  value,
  onChangeText,
  containerStyles,
  placeholder,
  keyboardType,
  errorMessage,
  textContentType,
  autoCapitalize,
  editable,
  secureTextEntry,
}: InputFieldProps) {
  return (
    <View
      style={[
        {
          backgroundColor: 'white',
          height: 55,
          borderRadius: 5,
          opacity: editable ? 0.9 : 0.7,
        },
        containerStyles,
      ]}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            paddingLeft: 10,
            paddingTop: 5,
            fontSize: 12,
            color: MasterStyles.officialColors.density,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            paddingRight: 10,
            paddingTop: 5,
            fontSize: 12,
            color: MasterStyles.officialColors.error,
          }}
        >
          {errorMessage}
        </Text>
      </View>
      <TextInput
        style={{
          paddingLeft: 10,
          // Intentional Platform Difference
          paddingTop: Platform.OS === 'ios' ? 7 : 0,
          fontSize: 16,
          color: MasterStyles.officialColors.graphite,
        }}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}
