import "expo-router/entry";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { ThemeContext } from "../components/ThemeContext";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "../utils/storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const gradeSystems = {
  PUB: {
    "A+": 4.0,
    A: 3.75,
    "A-": 3.5,
    "B+": 3.25,
    B: 3.0,
    "B-": 2.75,
    "C+": 2.5,
    C: 2.25,
    D: 2.0,
    F: 0.0,
  },
  NSU: {
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
  },
  IUB: {
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
  },
  BRAC: {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
  },
  UIU: {
    A: 4.0,
    "A-": 3.67,
    "B+": 3.33,
    B: 3.0,
    "B-": 2.67,
    "C+": 2.33,
    C: 2.0,
    "C-": 1.67,
    "D+": 1.33,
    D: 1.0,
    F: 0.0,
  },
  ULAB: {
    A: 4.0,
    "A-": 3.2,
    "B+": 3.0,
    B: 2.9,
    "B-": 2.8,
    C: 2.0,
    "C-": 1.5,
    D: 1.0,
    "D-": 1.0,
    F: 0.0,
  },
  EDU: {
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
  },
  AIUB: {
    "A+": 4.0,
    A: 3.75,
    "B+": 3.5,
    B: 3.25,
    "C+": 3.0,
    C: 2.75,
    "D+": 2.5,
    D: 2.25,
    F: 0.0,
  },
  PRI: {
    "A+": 4.0,
    A: 3.75,
    "A-": 3.5,
    "B+": 3.25,
    B: 3.0,
    "B-": 2.75,
    "C+": 2.5,
    C: 2.25,
    D: 2.0,
    F: 0.0,
  },
};

const gradeToPoint = (grade, gradeSystem) => {
  if (!gradeSystems[gradeSystem]) return null;
  return gradeSystems[gradeSystem][grade.toUpperCase()] ?? null;
};

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const windowWidth = Dimensions.get("window").width;

  const [course, setCourse] = useState("");
  const [grade, setGrade] = useState("");
  const [credit, setCredit] = useState("");
  const [gpa, setGPA] = useState(null);
  const [semester, setSemester] = useState("");
  const [cgpa, setCGPA] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);

  const [courseLoading, setCourseLoading] = useState(false);
  const [semesterLoading, setSemesterLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [gradeSystem, setGradeSystem] = useState("");
  const [items, setItems] = useState([
    { label: "Public Universities", value: "PUB" },
    { label: "North South University", value: "NSU" },
    { label: "Independent University, Bangladesh", value: "IUB" },
    { label: "BRAC University", value: "BRAC" },
    { label: "United International University", value: "UIU" },
    { label: "University of Liberal Arts Bangladesh", value: "ULAB" },
    { label: "East Delta University", value: "EDU" },
    { label: "American International University-Bangladesh", value: "AIUB" },
    { label: "Private Universities", value: "PRI" },
  ]);

  const [gradeSystemLoading, setGradeSystemLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const addCourse = async () => {
    const point = gradeToPoint(grade, gradeSystem);
    const creditValue = parseFloat(credit);

    if (!course || !grade || isNaN(creditValue) || point === null) {
      Alert.alert(
        "Invalid input",
        "Please provide valid course, grade, and credit."
      );
      return;
    }

    const newCourse = { course, grade, credit: creditValue, point };
    const updatedCourses = [...courseList, newCourse];
    setCourseList(updatedCourses);
    setCourse("");
    setGrade("");
    setCredit("");

    const totalPoints = updatedCourses.reduce(
      (sum, cur) => sum + cur.point * cur.credit,
      0
    );
    const totalCredits = updatedCourses.reduce(
      (sum, cur) => sum + cur.credit,
      0
    );
    const singleGPA = (totalPoints / totalCredits).toFixed(2);
    setGPA(singleGPA);

    try {
      await storeData(updatedCourses, singleGPA);
    } catch (e) {
      console.error("Error saving course data", e);
    }
  };

  const addSemester = async () => {
    const semesterValue = parseFloat(semester);
    const gpaValue = parseFloat(gpa);

    if (isNaN(semesterValue) || isNaN(gpaValue)) {
      Alert.alert(
        "Invalid input",
        "Please enter valid semester GPA and add courses first."
      );
      return;
    }

    const newSemester = { previousGPA: semesterValue, newGPA: gpaValue };
    const updatedSemesters = [...semesterList, newSemester];
    setSemesterList(updatedSemesters);
    setSemester("");

    const totalGPA = updatedSemesters.reduce(
      (sum, sem) => sum + sem.previousGPA + sem.newGPA,
      0
    );
    const totalCount = updatedSemesters.length * 2;
    const average = totalGPA / totalCount;
    const finalCGPA = average.toFixed(2);
    setCGPA(finalCGPA);

    try {
      await storeData(finalCGPA);
    } catch (e) {
      console.error("Error saving CGPA", e);
    }
  };

  const clearData = async () => {
    setClearLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await AsyncStorage.multiRemove(["courseList", "gpa", "cgpa"]);
      setCourse("");
      setGrade("");
      setCredit("");
      setSemester("");
      setGPA(null);
      setCGPA(null);
      setCourseList([]);
      setSemesterList([]);
      setGradeSystem("");
    } catch (error) {
      console.error("Error clearing data", error);
    }

    setClearLoading(false);
  };

  const handleAddCourse = async () => {
    setCourseLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      await addCourse();
    } catch (error) {
      console.error("Error adding course", error);
    } finally {
      setCourseLoading(false);
    }
  };

  const handleAddSemester = async () => {
    setSemesterLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      await addSemester();
    } catch (error) {
      console.error("Error adding semester", error);
    } finally {
      setSemesterLoading(false);
    }
  };

  const storeData = async (
    courses = courseList,
    gpaValue = gpa,
    cgpaValue = cgpa
  ) => {
    try {
      await AsyncStorage.setItem("courseList", JSON.stringify(courses));
      await AsyncStorage.setItem(
        "gpa",
        gpaValue != null ? gpaValue.toString() : "0"
      );
      await AsyncStorage.setItem(
        "cgpa",
        cgpaValue != null ? cgpaValue.toString() : "0"
      );
    } catch (e) {
      console.error("Error saving data", e);
    }
  };

  const loadData = async () => {
    try {
      const storedCourseList = await AsyncStorage.getItem("courseList");
      const storedGPA = await AsyncStorage.getItem("gpa");
      const storedCGPA = await AsyncStorage.getItem("cgpa");

      if (storedCourseList) {
        const parsedList = JSON.parse(storedCourseList);
        setCourseList(Array.isArray(parsedList) ? parsedList : []);
      } else {
        setCourseList([]);
      }

      setCourse("");
      setGrade("");
      setCredit("");
      setSemester("");

      setGPA(storedGPA ? storedGPA.toString() : null);
      setCGPA(storedCGPA ? storedCGPA.toString() : null);
    } catch (e) {
      console.error("Error loading data", e);
      setCourseList([]);
      setCourse("");
      setGrade("");
      setCredit("");
      setSemester("");
      setGPA(null);
      setCGPA(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Web Version */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 15,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: "100%",
            maxWidth: 600,
            backgroundColor: theme.background,
          }}
        >
          {/* Grading System */}
          <Text style={[styles.text, { color: theme.title }]}>
            Grading System
          </Text>
          <DropDownPicker
            key={theme.title}
            open={open}
            value={gradeSystem}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              setGradeSystemLoading(true);
              const newValue = callback(gradeSystem);
              setGradeSystem(newValue);
              setTimeout(() => setGradeSystemLoading(false), 800);
            }}
            setItems={setItems}
            placeholder="Select University"
            style={{
              borderColor: theme.iconColor,
              backgroundColor: theme.uiBackground,
              height: 45,
              borderWidth: 1,
              borderRadius: 6,
              paddingHorizontal: 12,
              marginVertical: 8,
            }}
            textStyle={{ color: theme.title, fontSize: 16 }}
            dropDownContainerStyle={{
              backgroundColor: theme.uiBackground,
              borderColor: theme.iconColor,
              zIndex: 5000,
            }}
            ArrowDownIconComponent={({ style }) => (
              <Icon
                name="arrow-drop-down"
                size={24}
                color={theme.title}
                style={style}
              />
            )}
            ArrowUpIconComponent={({ style }) => (
              <Icon
                name="arrow-drop-up"
                size={24}
                color={theme.title}
                style={style}
              />
            )}
            TickIconComponent={({ style }) => (
              <Icon name="check" size={20} color={theme.title} style={style} />
            )}
          />

          {/* Course Inputs */}
          <Text style={[styles.text, { color: theme.title }]}>Course</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.uiBackground,
                borderColor: theme.iconColor,
                color: theme.title,
              },
            ]}
            placeholder="e.g., CSE-2201, DBMS-I"
            placeholderTextColor={theme.text}
            value={course}
            onChangeText={setCourse}
            autoFocus={false}
          />
          <Text style={[styles.text, { color: theme.title }]}>Grade</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.uiBackground,
                borderColor: theme.iconColor,
                color: theme.title,
              },
            ]}
            placeholder="e.g., A+, B-"
            placeholderTextColor={theme.text}
            value={grade}
            onChangeText={setGrade}
            autoCapitalize="characters"
          />
          <Text style={[styles.text, { color: theme.title }]}>Credit</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.uiBackground,
                borderColor: theme.iconColor,
                color: theme.title,
              },
            ]}
            placeholder="e.g., 3, 1.5"
            placeholderTextColor={theme.text}
            value={credit}
            onChangeText={setCredit}
            keyboardType="numeric"
          />

          {/* Course List + GPA */}
          {courseList.map((item, index) => (
            <Text
              key={index}
              style={[styles.buttonText, { color: theme.title }]}
            >
              {item.course}: {item.grade} ({item.credit}cr)
            </Text>
          ))}
          {gpa && (
            <View style={{ alignItems: "center", marginVertical: 8 }}>
              <Text style={[styles.text, { color: theme.title }]}>
                GPA: {gpa}
              </Text>
            </View>
          )}
          <TouchableOpacity
            disabled={courseLoading}
            style={[styles.button, { borderColor: theme.title }]}
            onPress={handleAddCourse}
          >
            {courseLoading ? (
              <ActivityIndicator size="small" color={theme.title} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.title }]}>
                Add Course
              </Text>
            )}
          </TouchableOpacity>

          {/* Semester Inputs */}
          <Text style={[styles.text, { color: theme.title }]}>Semester</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.uiBackground,
                borderColor: theme.iconColor,
                color: theme.title,
              },
            ]}
            placeholder="e.g., 3.50, 3.33"
            placeholderTextColor={theme.text}
            value={semester}
            onChangeText={setSemester}
            keyboardType="numeric"
          />
          {semesterList.map((sem, index) => (
            <Text
              key={index}
              style={[styles.buttonText, { color: theme.title }]}
            >
              Semester {index + 1}: GPA = {sem.previousGPA}
            </Text>
          ))}
          {cgpa && (
            <View style={{ alignItems: "center", marginVertical: 8 }}>
              <Text style={[styles.text, { color: theme.title }]}>
                CGPA: {cgpa}
              </Text>
            </View>
          )}
          <TouchableOpacity
            disabled={semesterLoading}
            style={[styles.button, { borderColor: theme.title }]}
            onPress={handleAddSemester}
          >
            {semesterLoading ? (
              <ActivityIndicator size="small" color={theme.title} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.title }]}>
                Add Semester
              </Text>
            )}
          </TouchableOpacity>

          {/* Clear Button */}
          <TouchableOpacity
            style={[styles.button, { borderColor: theme.title }]}
            onPress={clearData}
            disabled={clearLoading}
          >
            {clearLoading ? (
              <ActivityIndicator size="small" color={theme.title} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.title }]}>
                Clear
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  innerContainer: {
    flexGrow: 1,
    padding: 20,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    marginVertical: 8,
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1.5,
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
