import React, { useState } from "react";
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, Switch, 
  Alert, StyleSheet, KeyboardAvoidingView, Platform 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; 
import { Button, Card, Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message"; 
import { SafeAreaView } from "react-native-safe-area-context"; 

export default function App() {
  const [tasks, setTasks] = useState([]); 
  const [title, setTitle] = useState(""); 
  const [buttonActive, setButtonActive] = useState(false); 

  // Function to Add Task
  const addTask = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task title cannot be empty");
      return;
    }
    setTasks([...tasks, { id: Date.now().toString(), title, status: "due" }]);
    setTitle("");
    setButtonActive(false); 
    Toast.show({ type: "success", text1: "Task Added", text2: "Your task has been successfully added." });
  };

  // Function to Toggle Task Status
  const toggleStatus = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "due" ? "done" : "due" } : task
      )
    );
  };

  // Function to Delete/remove Task with Confirmation
  const deleteTask = (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            setTasks(tasks.filter((task) => task.id !== taskId));
            Toast.show({ type: "error", text1: "Task Deleted", text2: "The task has been removed." });
          }
        }
      ]
    );
  };

  // Update button active state when user types
  const handleTextChange = (text) => {
    setTitle(text);
    setButtonActive(text.trim().length > 0); 
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.innerContainer}
        >
          <Text style={styles.heading}>📌 ToDo App</Text>
          <Text style={styles.body}> This app allows you to manage your tasks with ease, including adding, updating, and deleting tasks.</Text>
          {/* Task Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Task Title"
            value={title}
            onChangeText={handleTextChange}
            placeholderTextColor="#aaa"
          />

          {/* Add Task Button */}
          <Button 
            mode="contained" 
            onPress={addTask} 
            disabled={!buttonActive} 
            style={[styles.addButton, !buttonActive && styles.buttonInactive]}
          >
            ➕ Add Task
          </Button>

          {/* Task List */}
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={[styles.taskCard, item.status === "done" && styles.taskDone]}>
                <View style={styles.taskRow}>
                  <Text style={[styles.taskText, item.status === "done" && styles.taskCompleted]}>
                    {item.title}
                  </Text>
                  <Switch
                    value={item.status === "done"}
                    onValueChange={() => toggleStatus(item.id)}
                    trackColor={{ false: "#767577", true: "#4CAF50" }}
                    thumbColor={item.status === "done" ? "#fff" : "#f4f4f4"}
                  />
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <MaterialIcons name="delete" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </Card>
            )}
          />

          {/* Toast Messages */}
          <Toast />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, 
    backgroundColor: "#f4f4f4",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  body: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "left",
    marginBottom: 20,
    color: "#f26fee",
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    fontSize: 16,
    width: "100%",
  },
  addButton: {
    marginBottom: 20,
    backgroundColor: "#099ee3",
    width: "100%",  
    paddingVertical: 12,
  },
  buttonInactive: {
    backgroundColor: "#B0BEC5",  
  },
  taskCard: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  taskDone: {
    backgroundColor: "#D4EDDA", 
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    flex: 1,  
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#666",
  },
});
