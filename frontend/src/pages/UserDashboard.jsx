import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  LinearProgress,
  Chip
} from "@mui/material";
import {
  PlayCircle,
  Book,
  Clock,
  Award,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import Layout from "../components/Layout";

const UserDashboard = () => {
  const dispatch = useDispatch();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const userData = {
    enrolledCourses: 4,
    completedCourses: 2,
    totalLessonsCompleted: 24,
    totalStudyHours: 45,
    averageScore: 85,
    learningStreak: 7
  };

  const enrolledCourses = [
    {
      id: 1,
      name: "Web Development Fundamentals",
      progress: 75,
      lastAccessed: "2024-12-29",
      totalLessons: 20,
      completedLessons: 15
    },
    {
      id: 2,
      name: "React Advanced Concepts",
      progress: 45,
      lastAccessed: "2024-12-28",
      totalLessons: 15,
      completedLessons: 7
    }
  ];

  const progressData = [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 60 },
    { day: "Wed", minutes: 30 },
    { day: "Thu", minutes: 75 },
    { day: "Fri", minutes: 45 },
    { day: "Sat", minutes: 90 },
    { day: "Sun", minutes: 60 }
  ];

  const statsCards = [
    {
      title: "Enrolled Courses",
      value: userData.enrolledCourses,
      icon: <Book size={40} />,
      color: "bg-blue-500 dark:bg-blue-600"
    },
    {
      title: "Completed Courses",
      value: userData.completedCourses,
      icon: <Trophy size={40} />,
      color: "bg-green-500 dark:bg-green-600"
    },
    {
      title: "Study Hours",
      value: userData.totalStudyHours,
      icon: <Clock size={40} />,
      color: "bg-purple-500 dark:bg-purple-600"
    },
    {
      title: "Learning Streak",
      value: `${userData.learningStreak} days`,
      icon: <Award size={40} />,
      color: "bg-orange-500 dark:bg-orange-600"
    }
  ];

  return (
    <Layout>
      <Box className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-gray-800 dark:text-white"
        >
          <Typography variant="h4" className="mb-6 font-bold">
            My Learning Dashboard
          </Typography>

          <Grid container spacing={4} className="mb-6">
            {statsCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <Card className={`${stat.color} text-white rounded-xl shadow-lg`}>
                    <CardContent className="flex justify-between items-center">
                      <div>
                        <Typography variant="h6" className="font-bold opacity-90">
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" className="font-bold">
                          {stat.value}
                        </Typography>
                      </div>
                      {stat.icon}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4} className="mb-6">
            <Grid item xs={12} md={6}>
              <Paper className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
                <Typography variant="h6" className="mb-4 font-bold">
                  Weekly Learning Progress
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <XAxis dataKey="day" stroke="currentColor" />
                    <YAxis stroke="currentColor" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgb(31 41 55)',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: 'white'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="minutes" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
                <Typography variant="h6" className="mb-4 font-bold">
                  Course Progress
                </Typography>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Typography variant="subtitle1" className="font-bold">
                          {course.name}
                        </Typography>
                        <Chip 
                          label={`${course.progress}%`}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                        />
                      </div>
                      <LinearProgress 
                        variant="determinate" 
                        value={course.progress} 
                        className="mb-2"
                      />
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                        {course.completedLessons} of {course.totalLessons} lessons completed
                      </Typography>
                    </div>
                  ))}
                </div>
              </Paper>
            </Grid>
          </Grid>

          <Paper className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <Typography variant="h6" className="mb-4 font-bold">
              Recent Activity
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="dark:text-gray-300">Course</TableCell>
                    <TableCell className="dark:text-gray-300">Last Accessed</TableCell>
                    <TableCell className="dark:text-gray-300">Progress</TableCell>
                    <TableCell className="dark:text-gray-300">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enrolledCourses.map((course) => (
                    <TableRow key={course.id} className="dark:border-gray-700">
                      <TableCell className="dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="text-blue-500 dark:text-blue-400" />
                          <Typography>{course.name}</Typography>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{course.lastAccessed}</TableCell>
                      <TableCell className="dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <LinearProgress 
                            variant="determinate" 
                            value={course.progress} 
                            className="w-24"
                          />
                          <Typography>{course.progress}%</Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                          Continue
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>
      </Box>
    </Layout>
  );
};

export default UserDashboard;