import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import React, { useState, useRef, useCallback } from "react";

import theme from "../constants/theme.js";
import globalStyles from "../constants/globalStyles.js";
import images from "../constants/images.js";

const FormField = ({
  type,
  title,
  placeholder,
  onChangeText,
  value,
  optional = false,
  iconShow = true,
  borderColor = "primary",
  titleColor = "primary",
  exampleColor = "secondary",
  design,
  multiline = false,
  example,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputs = useRef([]);

  const handleInputChange = useCallback(
    (text, index) => {
      let formattedText = text;

      if (type === "id") {
        formattedText = text.replace(/[^0-9]/g, "");
      } else if (type === "password") {
        formattedText = text.replace(/\s/g, "");
      }

      if (type === "code") {
        if (text.length > 1) return;

        const newCode = [...value];
        newCode[index] = text;
        if (newCode.join("") !== value.join("")) {
          onChangeText(newCode);
        }

        if (text && index < value.length - 1) {
          inputs.current[index + 1]?.focus();
        }
      } else {
        if (formattedText !== value) {
          onChangeText(formattedText);
        }
      }
    },
    [type, value, onChangeText]
  );

  const handleKeyPress = useCallback(
    ({ nativeEvent }, index) => {
      if (nativeEvent.key === "Backspace" && !value[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    },
    [value]
  );

  const getIcon = () => {
    switch (type) {
      case "id":
        return images.idBadge;
      case "email":
        return images.email2;
      case "password":
        return images.lock;
      default:
        return null;
    }
  };

  const getAutoCapitalize = () => {
    if (type === "password" || type === "email") {
      return "none";
    }
    return "sentences";
  };

  const resolvedBorderColor =
    borderColor === "secondary" ? theme.colors.secondary : theme.colors.primary;

  const resolvedTitleColor =
    titleColor === "secondary" ? theme.colors.secondary : theme.colors.primary;

  const resolvedExampleColor =
    exampleColor === "primary" ? theme.colors.primary : theme.colors.secondary;

  const borderRadius = design === "sharp" ? 0 : theme.borderRadius.medium;

  return type === "code" ? (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: resolvedTitleColor }]}>
            {title}
          </Text>
          {optional && <Text style={styles.optionalText}> (optional)</Text>}
          {example && (
            <Text style={[styles.example, { color: resolvedExampleColor }]}>
              {" "}
              (Ex: {example})
            </Text>
          )}
        </View>
      )}
      <View style={styles.codeContainer}>
        {value.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[
              styles.codeInput,
              {
                borderColor: resolvedBorderColor,
                borderRadius,
                color: theme.colors.primary,
              },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            autoFocus={index === 0}
          />
        ))}
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: resolvedTitleColor }]}>
            {title}
          </Text>
          {optional && <Text style={styles.optionalText}> (optional)</Text>}
          {example && (
            <Text style={[styles.example, { color: resolvedExampleColor }]}>
              {" "}
              (Ex: {example})
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.inputWrapper,
          { borderColor: resolvedBorderColor, borderRadius },
          multiline && styles.multilineInputWrapper,
        ]}
      >
        {iconShow && getIcon() && (
          <Image source={getIcon()} style={globalStyles.icons} />
        )}
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.multilineInput,
            { color: theme.colors.primary },
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={handleInputChange}
          secureTextEntry={type === "password" && !showPassword}
          keyboardType={
            type === "id"
              ? "numeric"
              : type === "email"
              ? "email-address"
              : "default"
          }
          autoCapitalize={getAutoCapitalize()}
          autoCorrect={false}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
        {type === "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? images.view : images.hide}
              style={globalStyles.icons}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.small,
  },
  title: {
    fontSize: theme.fontSizes.medium,
    fontFamily: "Arial",
  },
  optionalText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.secondary,
    fontFamily: "Arial",
  },
  inputWrapper: {
    width: "100%",
    height: 46,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
  },
  multilineInputWrapper: {
    height: 92,
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  textInput: {
    fontFamily: "Arial",
    fontSize: theme.fontSizes.medium,
    flex: 1,
  },
  multilineInput: {
    height: 92,
    textAlignVertical: "top",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.small,
  },
  codeInput: {
    width: 50,
    height: 60,
    textAlign: "center",
    fontSize: theme.fontSizes.huge,
    fontFamily: "SquadaOne",
    backgroundColor: theme.colors.secondary,
    borderWidth: 2,
  },
  example: {
    fontSize: theme.fontSizes.medium,
    fontFamily: "Arial",
    fontStyle: "italic",
  },
});

export default FormField;
