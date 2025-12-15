// Enums для системи управління університетом

enum StudentStatus {
  Active = "Active",
  Academic_Leave = "Academic_Leave",
  Graduated = "Graduated",
  Expelled = "Expelled"
}

enum CourseType {
  Mandatory = "Mandatory",
  Optional = "Optional",
  Special = "Special"
}

enum Semester {
  First = "First",
  Second = "Second"
}

enum Grade {
  Excellent = 5,
  Good = 4,
  Satisfactory = 3,
  Unsatisfactory = 2
}

enum Faculty {
  Computer_Science = "Computer_Science",
  Economics = "Economics",
  Law = "Law",
  Engineering = "Engineering"
}

// Інтерфейси

interface Student {
  id: number;
  fullName: string;
  faculty: Faculty;
  year: number;
  status: StudentStatus;
  enrollmentDate: Date;
  groupNumber: string;
}

interface Course {
  id: number;
  name: string;
  type: CourseType;
  credits: number;
  semester: Semester;
  faculty: Faculty;
  maxStudents: number;
}

interface GradeRecord {
  studentId: number;
  courseId: number;
  grade: Grade;
  date: Date;
  semester: Semester;
}

// Клас для управління університетом
class UniversityManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [];
  private grades: GradeRecord[] = [];
  private registrations: { studentId: number; courseId: number }[] = [];
  private nextStudentId: number = 1;
  private nextCourseId: number = 1;

  /**
   * Зачислення нового студента
   * @param student Дані студента без id (id генерується автоматично)
   * @returns Повний об'єкт студента з присвоєним id
   */
  enrollStudent(student: Omit<Student, "id">): Student {
    const newStudent: Student = {
      ...student,
      id: this.nextStudentId++,
      status: StudentStatus.Active // Новий студент завжди активний
    };
    this.students.push(newStudent);
    return newStudent;
  }

  /**
   * Реєстрація студента на курс
   * Перевіряє: відповідність факультету, ліміт студентів, статус студента
   * @param studentId ID студента
   * @param courseId ID курсу
   */
  registerForCourse(studentId: number, courseId: number): void {
    const student = this.students.find(s => s.id === studentId);
    const course = this.courses.find(c => c.id === courseId);

    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено`);
    }

    if (!course) {
      throw new Error(`Курсу з ID ${courseId} не знайдено`);
    }

    if (student.status !== StudentStatus.Active) {
      throw new Error(`Студент не активний, реєстрація заборонена (статус: ${student.status})`);
    }

    if (student.faculty !== course.faculty) {
      throw new Error(`Студент з факультету ${student.faculty} не може записатися на курс іншого факультету`);
    }

    // Підрахунок вже зареєстрованих студентів на курс
    const registeredCount = this.registrations.filter(reg => reg.courseId === courseId).length;
    if (registeredCount >= course.maxStudents) {
      throw new Error(`На курс "${course.name}" вже набрано максимальну кількість студентів (${course.maxStudents})`);
    }

    // Перевірка на повторну реєстрацію
    const alreadyRegistered = this.registrations.some(
      reg => reg.studentId === studentId && reg.courseId === courseId
    );
    if (alreadyRegistered) {
      throw new Error(`Студент вже зареєстрований на цей курс`);
    }

    this.registrations.push({ studentId, courseId });
  }

  /**
   * Виставлення оцінки студенту за курс
   * Перевіряє, чи студент зареєстрований на курс
   * @param studentId ID студента
   * @param courseId ID курсу
   * @param grade Оцінка
   */
  setGrade(studentId: number, courseId: number, grade: Grade): void {
    const student = this.students.find(s => s.id === studentId);
    const course = this.courses.find(c => c.id === courseId);

    if (!student) throw new Error(`Студента з ID ${studentId} не знайдено`);
    if (!course) throw new Error(`Курсу з ID ${courseId} не знайдено`);

    const isRegistered = this.registrations.some(
      reg => reg.studentId === studentId && reg.courseId === courseId
    );

    if (!isRegistered) {
      throw new Error(`Студент не зареєстрований на цей курс, оцінку виставити неможливо`);
    }

    // Видаляємо попередню оцінку, якщо була
    this.grades = this.grades.filter(
      g => !(g.studentId === studentId && g.courseId === courseId)
    );

    const gradeRecord: GradeRecord = {
      studentId,
      courseId,
      grade,
      date: new Date(),
      semester: course.semester
    };

    this.grades.push(gradeRecord);
  }

  /**
   * Зміна статусу студента
   * Валідація: не можна переводити в активний статус випускника чи відрахованого без підстав
   * @param studentId ID студента
   * @param newStatus Новий статус
   */
  updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено`);
    }

    // Заборона повертати статус Graduated або Expelled до Active без логіки (можна розширити)
    if (student.status === StudentStatus.Graduated && newStatus === StudentStatus.Active) {
      throw new Error(`Випускника не можна повернути до активного статусу`);
    }

    if (student.status === StudentStatus.Expelled && newStatus === StudentStatus.Active) {
      throw new Error(`Відрахованого студента не можна повернути до активного статусу`);
    }

    student.status = newStatus;
  }

  /**
   * Повертає список студентів певного факультету
   * @param faculty Факультет
   * @returns Масив студентів
   */
  getStudentsByFaculty(faculty: Faculty): Student[] {
    return this.students.filter(s => s.faculty === faculty);
  }

  /**
   * Повертає оцінки студента
   * @param studentId ID студента
   * @returns Масив оцінок
   */
  getStudentGrades(studentId: number): GradeRecord[] {
    return this.grades.filter(g => g.studentId === studentId);
  }

  /**
   * Повертає доступні курси для факультету в певному семестрі
   * Курс доступний, якщо є вільні місця
   * @param faculty Факультет
   * @param semester Семестр
   * @returns Масив курсів
   */
  getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
    return this.courses.filter(course => {
      if (course.faculty !== faculty || course.semester !== semester) {
        return false;
      }
      const registeredCount = this.registrations.filter(reg => reg.courseId === course.id).length;
      return registeredCount < course.maxStudents;
    });
  }

  /**
   * Обчислює середній бал студента (арифметичне середнє всіх оцінок)
   * @param studentId ID студента
   * @returns Середній бал або 0, якщо оцінок немає
   */
  calculateAverageGrade(studentId: number): number {
    const studentGrades = this.grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;

    const sum = studentGrades.reduce((acc, g) => acc + g.grade, 0);
    return Number((sum / studentGrades.length).toFixed(2));
  }

  /**
   * Повертає список відмінників факультету (студенти з середнім балом 5.0)
   * @param faculty Факультет
   * @returns Масив студентів-відмінників
   */
  getHonorsStudentsByFaculty(faculty: Faculty): Student[] {
    const facultyStudents = this.getStudentsByFaculty(faculty);
    return facultyStudents.filter(student => {
      const avg = this.calculateAverageGrade(student.id);
      return avg === 5.0 && student.status === StudentStatus.Active;
    });
  }
}

// ==================== Демонстрація використання ====================

const system = new UniversityManagementSystem();

// Створення курсів (для прикладу)
const csCourse: Course = {
  id: 1,
  name: "TypeScript Programming",
  type: CourseType.Mandatory,
  credits: 6,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 30
};

const econCourse: Course = {
  id: 2,
  name: "Макроекономіка",
  type: CourseType.Mandatory,
  credits: 5,
  semester: Semester.First,
  faculty: Faculty.Economics,
  maxStudents: 50
};

system["courses"] = [csCourse, econCourse]; // Доступ через приватне поле для демо (у реальному коді краще додати метод)

// Зачислення студентів
const student1 = system.enrollStudent({
  fullName: "Іванов Сергій Михайлович",
  faculty: Faculty.Computer_Science,
  year: 2,
  status: StudentStatus.Active, // не використовується, бо перезаписується
  enrollmentDate: new Date("2023-09-01"),
  groupNumber: "КН-21"
});

const student2 = system.enrollStudent({
    fullName: "Петренко Ольга Сергіївна",
    faculty: Faculty.Computer_Science,
    year: 2,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "КН-21",
    status: StudentStatus.Active
});

// Реєстрація на курси
system.registerForCourse(student1.id, csCourse.id);
system.registerForCourse(student2.id, csCourse.id);

// Виставлення оцінок
system.setGrade(student1.id, csCourse.id, Grade.Excellent);
system.setGrade(student2.id, csCourse.id, Grade.Excellent);

// Обчислення середнього балу
console.log("Середній бал студента 1:", system.calculateAverageGrade(student1.id)); // 5

// Відмінники факультету
const honors = system.getHonorsStudentsByFaculty(Faculty.Computer_Science);
console.log("Відмінники Комп'ютерних наук:", honors.map(s => s.fullName));