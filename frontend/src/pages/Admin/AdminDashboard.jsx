import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, deleteCourse } from '../../redux/slices/statsSlice';
import { getAllCourses } from '../../redux/slices/course.slice';
import { getPaymentRecord } from '../../redux/slices/razorpay.slice';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Skeleton,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; 
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'; 
import InfoIcon from "@mui/icons-material/Info";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: stats, loading, refreshing } = useSelector((state) => state.stats);
  const { allPayments, monthlySalesRecord } = useSelector((state) => state.razorpay);

  const allUsersCount = stats?.totalUsers || 0;
  const subscribedCount = stats?.subscribedUsersCount || 0;
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchStats()).unwrap(),
          dispatch(getAllCourses()).unwrap(),
          dispatch(getPaymentRecord()).unwrap()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error?.response) {
          toast.error(error.response.data?.message || "API error occurred");
        } else {
          toast.error(error.message || "An error occurred while fetching data");
        }
      }
    };

    fetchData();
  }, [dispatch]);
  
  

  const handleRefresh = async () => {
    try {
      await dispatch(fetchStats()).unwrap();
      await dispatch(getAllCourses()).unwrap();
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error(error || "Failed to refresh data");
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await dispatch(deleteCourse(courseId)).unwrap();
        await dispatch(getAllCourses()).unwrap();
        toast.success("Course deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete course");
      }
    }
  };
const handleEdit = (courseId) => {
    try {
      const courseExists = stats.courses.some(course => course._id === courseId);
      
      if (!courseExists) {
        toast.error("Course not found");
        return;
      }
      
      navigate(`/courses/edit/${courseId}`);
    } catch (error) {
      console.error("Error navigating to edit page:", error);
      toast.error("Failed to navigate to edit page");
    }
  };


  const newcourseadded = () => {
    navigate("/admin/courses/create");
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const getPieChartData = () => [
    { name: "Registered Users", value: allUsersCount },
    { name: "Subscribed Users", value: subscribedCount },
    { name: "Courses", value: stats?.totalCourses || 0 },
    { name: "Videos", value: stats?.totalVideos || 0 },
    { name: "Subscriptions", value: allPayments?.count || 0 },
  ];

  const getBarChartData = () =>
    stats.courses.map((course) => ({
      name: course.courseName || "Untitled Course",
      lessons: course.numberOfLessons || 0,
    }));

    const totalSubscriptions = allPayments?.count || 0;
    const subscriptionPrice = 50; 
    const totalRevenue = totalSubscriptions * subscriptionPrice;
    const statsCards = [
      {
        title: "Registered Users",
        value: allUsersCount,
        icon: <PeopleIcon sx={{ fontSize: 60, opacity: 0.6 }} />,
        gradient: "linear-gradient(145deg, #2196F3 30%, #21CBF3 90%)",
        info: "Total number of registered users",
      },
      {
        title: "Subscribed Users",
        value: subscribedCount,
        icon: <PeopleIcon sx={{ fontSize: 60, opacity: 0.6 }} />,
        gradient: "linear-gradient(145deg, #4CAF50 30%, #81C784 90%)",
        info: "Number of subscribed users",
      },
      {
        title: "Total Videos",
        value: stats?.totalVideos || 0,
        icon: <OndemandVideoIcon sx={{ fontSize: 60, opacity: 0.6 }} />,
        gradient: "linear-gradient(145deg, #FF9800 30%, #FFB74D 90%)",
        info: "Total number of video lessons across all courses",
      },
      {
        title: "Total Subscriptions",
        value: allPayments?.count || 0,
        icon: <SubscriptionsIcon sx={{ fontSize: 60, opacity: 0.6 }} />,
        gradient: "linear-gradient(145deg, #9C27B0 30%, #BA68C8 90%)",
        info: `Active subscriptions: ${allPayments?.count || 0}`,
      },
      {
        title: "Total Revenue",
        value: `$${( totalRevenue)}`,
        icon: <MonetizationOnIcon sx={{ fontSize: 60, opacity: 0.6 }} />,
        gradient: "linear-gradient(145deg, #F44336 30%, #EF5350 90%)",
        info: `Revenue from subscriptions at $499 each`,
      }
    ];
    const RevenueBreakdown = () => {
      if (!monthlySalesRecord?.length) return null;
  
      return (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6">Monthly Revenue Breakdown</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell align="right">Subscriptions</TableCell>
                <TableCell align="right">Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlySalesRecord.map((sales, index) => (
                <TableRow key={index}>
                  <TableCell>{`Month ${index + 1}`}</TableCell>
                  <TableCell align="right">{sales}</TableCell>
                  <TableCell align="right">${sales * subscriptionPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    };
  if (loading) {
    return (
      <Layout>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid key={item} item xs={12} sm={4}>
                <Skeleton variant="rectangular" width="100%" height={150} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
        }}
        className="bg-white dark:bg-gray-900 transition-colors duration-200"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
              className="text-[#1a237e] dark:text-white"
            >
              Admin Dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={
                refreshing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <RefreshIcon />
                )
              }
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #1976D2 30%, #2196F3 90%)",
                },
              }}
            >
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      background: stat.gradient,
                      color: "white",
                      borderRadius: 3,
                      boxShadow: "0 8px 20px rgba(33, 150, 243, 0.3)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                    className="dark:bg-gray-800 transition-colors duration-200"
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", opacity: 0.8 }}
                          >
                            {stat.title}
                            <Tooltip title={stat.info} placement="top">
                              <InfoIcon
                                sx={{
                                  ml: 1,
                                  fontSize: 16,
                                  opacity: 0.7,
                                  cursor: "help",
                                }}
                              />
                            </Tooltip>
                          </Typography>
                          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                            {stat.value}
                          </Typography>
                        </Box>
                        {stat.icon}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <RevenueBreakdown/>


          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Pie Chart */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    bgcolor: "background.paper",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="dark:bg-gray-800"
                >
                  <Typography
                    variant="h6"
                    className="text-gray-800 dark:text-gray-100"
                    sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                  >
                    Distribution Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPieChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </motion.div>
            </Grid>

            {/* Bar Chart */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                    bgcolor: "background.paper",
                    backdropFilter: "blur(10px)",
                  }}
                  className="dark:bg-gray-800 transition-colors duration-200"
                >
                  <Typography
                    variant="h6"
                    className="text-gray-800 dark:text-gray-100"
                    sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                  >
                    Lessons per Course
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getBarChartData()}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="lessons" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          {/* Course Management Section */}
          <motion.div variants={itemVariants}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                bgcolor: "background.paper",
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
              }}
              className="dark:bg-gray-800 transition-colors duration-200"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                    }}
                    className="text-[#1a237e] dark:text-gray-100"
                  >
                    Course Management
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-[#1a237e] dark:text-gray-100"
                  >
                    Manage your courses and their content
                  </Typography>
                </Box>
                <Button
                  onClick={newcourseadded}
                  variant="contained"
                  startIcon={<SchoolIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                    boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(45deg, #388E3C 30%, #4CAF50 90%)",
                    },
                  }}
                >
                  Add New Course
                </Button>
              </Box>

              {/* Course Table */}
              <TableContainer
                sx={{
                  "& .MuiTable-root": {
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                  },
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderBottom: "none",
                        }}
                        className="text-[#1a237e] dark:text-gray-100"
                      >
                        Course Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderBottom: "none",
                        }}
                        className="text-[#1a237e] dark:text-gray-100"
                      >
                        Total Lessons
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderBottom: "none",
                        }}
                        className="text-[#1a237e] dark:text-gray-100"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderBottom: "none",
                        }}
                        className="text-[#1a237e] dark:text-gray-100"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.courses.map((course) => (
                      <TableRow
                        key={course._id}
                        sx={{
                          bgcolor: "background.paper",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          borderRadius: 2,
                          "& > td": {
                            borderTop: "1px solid rgba(224, 224, 224, 0.4)",
                            borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
                            "&:first-of-type": {
                              borderLeft: "1px solid rgba(224, 224, 224, 0.4)",
                              borderTopLeftRadius: 8,
                              borderBottomLeftRadius: 8,
                            },
                            "&:last-child": {
                              borderRight: "1px solid rgba(224, 224, 224, 0.4)",
                              borderTopRightRadius: 8,
                              borderBottomRightRadius: 8,
                            },
                          },
                          "&:hover": {
                            backgroundColor: "#f8f9ff",
                            transform: "translateY(-2px)",
                            transition: "all 0.3s ease",
                          },
                        }}
                        className="dark:bg-gray-700 hover:dark:bg-gray-600 transition-colors duration-200"
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <SchoolIcon
                              sx={{ mr: 2 }}
                              className="text-[#1a237e] dark:text-gray-100"
                            />
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}
                                className="text-[#1a237e] dark:text-gray-100"
                              >
                                {course.courseName || "Untitled Course"}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="text-[#1a237e] dark:text-gray-100"
                              >
                                Created on {new Date().toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${course.numberOfLessons || 0} Lessons`}
                            sx={{
                              backgroundColor: alpha("#1a237e", 0.1),
                              fontWeight: "bold",
                            }}
                            className="bg-opacity-10 dark:bg-opacity-20 text-[#1a237e] dark:text-gray-100"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Active"
                            sx={{
                              backgroundColor: alpha("#4CAF50", 0.1),
                              color: "#4CAF50",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Course">
                            <Button
                              variant="contained"
                              startIcon={<EditIcon />}
                              onClick={() => handleEdit(course._id)}
                              sx={{
                                mr: 1,
                                backgroundColor: "#1976D2",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#1565C0",
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "white",
                                },
                              }}
                            >
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete Course">
                            <Button
                              variant="contained"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDelete(course._id)}
                              sx={{
                                backgroundColor: "#d32f2f",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#c62828",
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "white",
                                },
                              }}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        </motion.div>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;

