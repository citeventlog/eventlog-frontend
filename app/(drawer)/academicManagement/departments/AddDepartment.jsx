import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import TabsComponent from "../../../../components/TabsComponent";
import globalStyles from "../../../../constants/globalStyles";
import theme from "../../../../constants/theme";
import FormField from "../../../../components/FormField";
import CustomButton from "../../../../components/CustomButton";
import { addDepartment } from "../../../../services/api";
import CustomModal from "../../../../components/CustomModal";

const AddDepartment = () => {
  const [formData, setFormData] = useState({
    department_name: "",
    department_code: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.department_name.trim() ||
        !formData.department_code.trim()
      ) {
        setModal({
          visible: true,
          title: "Warning",
          message: "Please fill in all required fields.",
          type: "warning",
        });
        return;
      }

      const submitData = {
        department_name: formData.department_name,
        department_code: formData.department_code,
      };

      setIsLoading(true);
      await addDepartment(submitData);

      setModal({
        visible: true,
        title: "Success",
        message: "Department added successfully!",
        type: "success",
      });

      setFormData({
        department_name: "",
        department_code: "",
      });
    } catch (error) {
      setModal({
        visible: true,
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to add department. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={globalStyles.secondaryContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[globalStyles.secondaryContainer, { paddingTop: 0 }]}>
      <CustomModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, visible: false })}
        cancelTitle="CLOSE"
      />

      <Text style={styles.textHeader}>EVENTLOG</Text>
      <View style={styles.titleContainer}>
        <Text style={styles.textTitle}>ADD DEPARTMENT</Text>
      </View>
      <ScrollView
        style={styles.scrollviewContainer}
        contentContainerStyle={styles.scrollview}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <FormField
            title="Department Name"
            placeholder="Enter department name"
            value={formData.department_name}
            onChangeText={(text) => handleChange("department_name", text)}
          />

          <FormField
            title="Department Code"
            placeholder="Enter department code"
            value={formData.department_code}
            onChangeText={(text) => handleChange("department_code", text)}
          />
        </View>
        <View>
          <CustomButton title="ADD" onPress={handleSubmit} />
        </View>
      </ScrollView>

      <TabsComponent />
      <StatusBar style="auto" />
    </View>
  );
};

export default AddDepartment;

const styles = StyleSheet.create({
  textHeader: {
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.SquadaOne,
    fontSize: theme.fontSizes.title,
    textAlign: "center",
    marginBottom: theme.spacing.small,
  },
  scrollviewContainer: {
    width: "100%",
    marginBottom: 90,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderTopWidth: 0,
  },
  scrollview: {
    justifyContent: "space-between",
    flexGrow: 1,
    padding: theme.spacing.medium,
  },
  titleContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textTitle: {
    fontSize: theme.fontSizes.extraLarge,
    fontFamily: theme.fontFamily.SquadaOne,
    color: theme.colors.primary,
  },
});
