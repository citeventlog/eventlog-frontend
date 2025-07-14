import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import TabsComponent from "../../../../components/TabsComponent";
import globalStyles from "../../../../constants/globalStyles";
import theme from "../../../../constants/theme";
import FormField from "../../../../components/FormField";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal";
import { useLocalSearchParams } from "expo-router";
import CustomDropdown from "../../../../components/CustomDropdown";
import {
  fetchBlockById,
  editBlock,
  fetchYearLevels,
  fetchDepartments,
} from "../../../../services/api";
import { fetchCoursesByDepartmentId } from "../../../../services/api/courses";

const EditBlock = () => {
  const { id: block_id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    block_name: "",
    course: "",
    year_level: "",
    department: "",
    status: "Active",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Disabled", value: "Disabled" },
    { label: "Archived", value: "Archived" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!block_id) throw new Error("Invalid block ID");

        const blockDetails = await fetchBlockById(block_id);
        if (!blockDetails) throw new Error("Block details not found");

        const initialStatus = blockDetails.status || "Active";

        setFormData({
          block_name: blockDetails.block_name || "",
          course: blockDetails.course_id || "",
          year_level: blockDetails.year_level_id || "",
          department: blockDetails.department_id || "",
          status: initialStatus,
        });

        const departmentsData = await fetchDepartments();
        setDepartments(
          departmentsData.departments.map((department) => ({
            label: department.department_name,
            value: department.department_id,
          }))
        );

        const yearLevelsData = await fetchYearLevels();
        setYearLevels(
          yearLevelsData.map((yearLevel) => ({
            label: yearLevel.year_level_name,
            value: yearLevel.year_level_id,
          }))
        );

        if (blockDetails.department_id) {
          const coursesData = await fetchCoursesByDepartmentId(
            blockDetails.department_id
          );
          setCourses(
            coursesData.map((course) => ({
              label: course.course_code,
              value: course.course_id,
            }))
          );
        }
      } catch (error) {
        setModal({
          visible: true,
          title: "Error",
          message: error.message || "Failed to load block details.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [block_id]);

  const handleChange = (name, value) =>
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

  const handleDepartmentChange = async (item) => {
    handleChange("department", item.value);

    try {
      const coursesData = await fetchCoursesByDepartmentId(item.value);
      setCourses(
        coursesData.map((course) => ({
          label: course.course_code,
          value: course.course_id,
        }))
      );
    } catch (error) {
      setModal({
        visible: true,
        title: "Error",
        message: "Failed to load courses for the selected department.",
        type: "error",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.block_name.trim() ||
        !formData.course ||
        !formData.year_level ||
        !formData.department
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
        name: formData.block_name,
        course_id: formData.course,
        year_level_id: formData.year_level,
        department_id: formData.department,
        status: formData.status,
      };

      await editBlock(block_id, submitData);

      setModal({
        visible: true,
        title: "Success",
        message: "Block updated successfully!",
        type: "success",
      });
    } catch (error) {
      setModal({
        visible: true,
        title: "Error",
        message: error.response?.data?.message || "Failed to update block.",
        type: "error",
      });
    }
  };

  if (isLoading)
    return (
      <View style={globalStyles.secondaryContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );

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
        <Text style={styles.textTitle}>EDIT BLOCK</Text>
      </View>

      <ScrollView
        style={styles.scrollviewContainer}
        contentContainerStyle={styles.scrollview}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <FormField
            title="Block Name"
            placeholder="Enter block name"
            value={formData.block_name}
            onChangeText={(text) => handleChange("block_name", text)}
          />

          <CustomDropdown
            title="Department"
            data={departments}
            placeholder="Select Department"
            value={formData.department}
            onSelect={handleDepartmentChange}
          />

          <CustomDropdown
            title="Course"
            data={courses}
            placeholder="Select Course"
            value={formData.course}
            onSelect={(item) => handleChange("course", item.value)}
          />

          <CustomDropdown
            title="Year Level"
            data={yearLevels}
            placeholder="Select Year Level"
            value={formData.year_level}
            onSelect={(item) => handleChange("year_level", item.value)}
          />

          <CustomDropdown
            title="Status"
            data={statusOptions}
            placeholder="Select Status"
            value={formData.status}
            onSelect={(item) => handleChange("status", item.value)}
          />
        </View>

        <View>
          <CustomButton title="UPDATE" onPress={handleSubmit} />
        </View>
      </ScrollView>

      <TabsComponent />
      <StatusBar style="auto" />
    </View>
  );
};

export default EditBlock;

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
    flexGrow: 1,
    padding: theme.spacing.medium,
    justifyContent: "space-between",
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
