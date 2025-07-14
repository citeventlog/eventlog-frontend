import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { StatusBar } from "expo-status-bar";
import { fetchRoles } from "../../../../services/api";
import globalStyles from "../../../../constants/globalStyles";
import theme from "../../../../constants/theme";
import TabsComponent from "../../../../components/TabsComponent";

export default function RolesScreen() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const fetchedRoles = await fetchRoles();
        setRoles(fetchedRoles);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    loadRoles();
  }, []);

  return (
    <View style={globalStyles.secondaryContainer}>
      <Text style={styles.headerText}>ROLES</Text>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {roles.length > 0 ? (
          roles.map((role) => (
            <View key={role.role_id} style={styles.roleContainer}>
              <Text style={styles.roleName}>{role.role_name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noResults}>No roles found</Text>
        )}
      </ScrollView>

      <TabsComponent />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.SquadaOne,
    fontSize: theme.fontSizes.display,
    textAlign: "center",
    marginBottom: theme.spacing.medium,
  },
  roleContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.small,
    marginBottom: theme.spacing.small,
  },
  roleName: {
    fontFamily: theme.fontFamily.SquadaOne,
    color: theme.colors.primary,
    fontSize: theme.fontSizes.large,
  },
  noResults: {
    textAlign: "center",
    fontFamily: theme.fontFamily.SquadaOne,
    color: theme.colors.primary,
    fontSize: theme.fontSizes.medium,
    marginTop: theme.spacing.medium,
  },
});
