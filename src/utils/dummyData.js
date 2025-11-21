// Dummy data for papers
export const dummyPapers = [
  {
    id: 1,
    title: "Computer Architecture",
    subject: "CSE2004",
    year: 2023,
    semester: "Fall",
    examType: "CAT-1",
    tags: ["microprocessors", "memory", "cache"],
    hasSolution: true,
    downloadCount: 245,
    uploadDate: "2023-10-15"
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    subject: "CSE2011",
    year: 2023,
    semester: "Fall",
    examType: "CAT-2",
    tags: ["trees", "graphs", "dynamic programming"],
    hasSolution: true,
    downloadCount: 389,
    uploadDate: "2023-11-20"
  },
  {
    id: 3,
    title: "Operating Systems",
    subject: "CSE2032",
    year: 2023,
    semester: "Spring",
    examType: "FAT",
    tags: ["processes", "scheduling", "memory management"],
    hasSolution: false,
    downloadCount: 156,
    uploadDate: "2023-05-10"
  },
  {
    id: 4,
    title: "Database Management Systems",
    subject: "CSE2021",
    year: 2022,
    semester: "Fall",
    examType: "CAT-1",
    tags: ["sql", "normalization", "transactions"],
    hasSolution: true,
    downloadCount: 423,
    uploadDate: "2022-10-05"
  },
  {
    id: 5,
    title: "Machine Learning",
    subject: "CSE4020",
    year: 2023,
    semester: "Spring",
    examType: "CAT-2",
    tags: ["neural networks", "regression", "classification"],
    hasSolution: true,
    downloadCount: 298,
    uploadDate: "2023-04-18"
  },
  {
    id: 6,
    title: "Web Technologies",
    subject: "CSE3020",
    year: 2023,
    semester: "Fall",
    examType: "CAT-1",
    tags: ["html", "css", "javascript", "react"],
    hasSolution: false,
    downloadCount: 167,
    uploadDate: "2023-09-25"
  },
  {
    id: 7,
    title: "Software Engineering",
    subject: "CSE3006",
    year: 2022,
    semester: "Spring",
    examType: "FAT",
    tags: ["sdlc", "testing", "design patterns"],
    hasSolution: true,
    downloadCount: 201,
    uploadDate: "2022-05-12"
  },
  {
    id: 8,
    title: "Artificial Intelligence",
    subject: "CSE4019",
    year: 2023,
    semester: "Fall",
    examType: "CAT-2",
    tags: ["search algorithms", "knowledge representation"],
    hasSolution: false,
    downloadCount: 134,
    uploadDate: "2023-11-08"
  }
];

export const subjects = [
  "All Subjects",
  "CSE2004", "CSE2011", "CSE2021", "CSE2032", 
  "CSE3006", "CSE3020", "CSE4019", "CSE4020"
];

export const years = ["All Years", "2023", "2022", "2021", "2020"];
export const semesters = ["All Semesters", "Fall", "Spring"];
export const examTypes = ["All Types", "CAT-1", "CAT-2", "FAT"];
// export const difficulties = ["All Levels", "Easy", "Medium", "Hard"];