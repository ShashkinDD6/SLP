// Базові типи
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Основні структури
type Professor = { id: number, name: string, department: string };
type Classroom = { number: string, capacity: number, hasProjector: boolean };
type Course = { id: number, name: string, type: CourseType };
type NewLesson = { courseId: number, professorId: number, classroomNumber: string, dayOfWeek: DayOfWeek, timeSlot: TimeSlot };
type Lesson = NewLesson & { id: number };

// Тип для конфліктів
type ScheduleConflict = { type: "ProfessorConflict" | "ClassroomConflict", lessonDetails: NewLesson };

// Масиви даних
let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];
let nextLessonId: number = 1;

// Функція для додавання професора
function addProfessor(professor: Professor): void {
  professors.push(professor);
}

// Функція для валідації уроку на конфлікти
// Перевіряє, чи професор або аудиторія зайняті в вказаний день і час, ігноруючи existingId якщо надано (для модифікацій)
function validateLesson(lesson: NewLesson, existingId?: number): ScheduleConflict | null {
  // Фільтруємо уроки в той самий день і слот, ігноруючи existingId якщо вказано
  const sameTimeLessons = schedule.filter(l =>
    l.dayOfWeek === lesson.dayOfWeek &&
    l.timeSlot === lesson.timeSlot &&
    (existingId === undefined || l.id !== existingId)
  );

  for (const existing of sameTimeLessons) {
    if (existing.professorId === lesson.professorId) {
      return { type: "ProfessorConflict", lessonDetails: lesson };
    }
    if (existing.classroomNumber === lesson.classroomNumber) {
      return { type: "ClassroomConflict", lessonDetails: lesson };
    }
  }
  return null;
}

// Функція для додавання уроку, якщо немає конфліктів
function addLesson(newLesson: NewLesson): boolean {
  const conflict = validateLesson(newLesson);
  if (conflict !== null) {
    return false;
  }
  const lesson: Lesson = { ...newLesson, id: nextLessonId };
  nextLessonId++;
  schedule.push(lesson);
  return true;
}

// Функція для пошуку вільних аудиторій у вказаний час
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  const occupiedClassrooms = schedule
    .filter(l => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
    .map(l => l.classroomNumber);
  
  return classrooms
    .map(c => c.number)
    .filter(number => !occupiedClassrooms.includes(number));
}

// Функція для отримання розкладу професора
function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter(l => l.professorId === professorId);
}

// Функція для розрахунку відсотка використання аудиторії
// Вважаємо, що є 5 днів і 5 слотів на день, всього 25 можливих слотів
function getClassroomUtilization(classroomNumber: string): number {
  const usedSlots = schedule.filter(l => l.classroomNumber === classroomNumber).length;
  const totalSlots = 5 * 5; // 5 днів * 5 слотів
  return (usedSlots / totalSlots) * 100;
}

// Функція для визначення найпопулярнішого типу занять
// Пораховує кількість уроків для кожного типу курсу і повертає тип з максимумом
function getMostPopularCourseType(): CourseType {
  const counts: { [key: string]: number } = {};
  for (const lesson of schedule) {
    const course = courses.find(c => c.id === lesson.courseId);
    if (course) {
      const type = course.type;
      counts[type] = (counts[type] || 0) + 1;
    }
  }
  
  let maxCount = 0;
  let popularType: CourseType = "Lecture"; // За замовчуванням, якщо розклад порожній
  for (const type in counts) {
    if (counts[type] > maxCount) {
      maxCount = counts[type];
      popularType = type as CourseType;
    }
  }
  return popularType;
}

// Функція для зміни аудиторії уроку, якщо можливо
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const index = schedule.findIndex(l => l.id === lessonId);
  if (index === -1) {
    return false;
  }
  const lesson = schedule[index];
  const tempLesson: NewLesson = {
    courseId: lesson.courseId,
    professorId: lesson.professorId,
    classroomNumber: newClassroomNumber,
    dayOfWeek: lesson.dayOfWeek,
    timeSlot: lesson.timeSlot
  };
  const conflict = validateLesson(tempLesson, lessonId);
  if (conflict !== null) {
    return false;
  }
  schedule[index].classroomNumber = newClassroomNumber;
  return true;
}

// Функція для видалення уроку з розкладу
function cancelLesson(lessonId: number): void {
  const index = schedule.findIndex(l => l.id === lessonId);
  if (index !== -1) {
    schedule.splice(index, 1);
  }
}