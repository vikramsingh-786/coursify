import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  KeyIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Layout from "../components/Layout";
import {
  fetchProfile,
  updateProfile,
  changePassword,
} from "../redux/slices/auth.slice";
import { cancelCourseBundle } from "../redux/slices/razorpay.slice";
import {
  LoadingButton,
  LoadingOverlay,
} from "../Spinner";

const CancelSubscriptionButton = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { error } = useSelector((state) => state.razorpay);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCancelCourseBundle = async () => {
    if (user?.role === "admin") {
      toast.error("Admins cannot cancel bundles.");
      return;
    }

    try {
      setIsCancelling(true);
      await dispatch(cancelCourseBundle()).unwrap();
      toast.success("Subscription cancelled successfully.");
      setIsConfirmOpen(false);
      await dispatch(fetchProfile()).unwrap();
    } catch (err) {
      toast.error(err.message || "Cancellation failed.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <button
        onClick={() => setIsConfirmOpen(true)}
        className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        disabled={!user?.subscription?.id}
      >
        <XMarkIcon className="h-5 w-5 mr-2" />
        {!user?.subscription?.id
          ? "No Active Subscription"
          : "Cancel Course Bundle"}
      </button>

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Cancellation
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to cancel your course bundle subscription?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled={isCancelling}
              >
                No, Keep Subscription
              </button>
              <LoadingButton
                isLoading={isCancelling}
                onClick={handleCancelCourseBundle}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Cancel Subscription
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default function Profile() {
  const dispatch = useDispatch();
  const {
    user,
    loading: initialLoading,
    error,
  } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user && !initialLoading) {
      dispatch(fetchProfile())
        .unwrap()
        .catch((error) => {
          toast.error(error?.message || "User not found");
        });
    }
  }, [dispatch, user, initialLoading]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
      if (user.avatar?.secure_url) {
        setAvatarPreview(user.avatar.secure_url);
      }
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(user.avatar?.secure_url || null);
    setProfileData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email) {
      toast.error("Name and email are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      setLoading(true);
      const result = await dispatch(updateProfile(formData)).unwrap();
      if (result.success) {
        toast.success(result.message || "Profile updated successfully!");
        setIsEditing(false);
        setAvatarFile(null);
        await dispatch(fetchProfile()).unwrap();
      }
    } catch (error) {
      toast.error(error.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      await dispatch(changePassword(passwordData)).unwrap();
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error(error.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          {(loading || initialLoading) && <LoadingOverlay />}

          {!user && !initialLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                User not found. Please log in again.
              </p>
            </div>
          )}

          {user && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg p-8 mb-1">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl text-white font-bold">
                          {profileData.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
                        <PhotoIcon className="h-5 w-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.role === "admin"
                        ? "Admin Profile"
                        : "User Profile"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                      Manage your account settings and preferences
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg p-8">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="relative">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <UserCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditing || loading}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="relative">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing || loading}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="relative">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Role
                      </label>
                      <input
                        type="text"
                        value={profileData.role}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    {isEditing && (
                      <div className="flex justify-end space-x-4">
                        <LoadingButton
                          type="submit"
                          isLoading={loading}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <CheckIcon className="h-5 w-5 mr-2" />
                          Save Changes
                        </LoadingButton>
                        <button
                          type="button"
                          onClick={handleCancelClick}
                          disabled={loading}
                          className="flex items-center px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XMarkIcon className="h-5 w-5 mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={handleEditClick}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <PencilIcon className="h-5 w-5 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>

                <div className="mt-12 border-t pt-8">
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <KeyIcon className="h-5 w-5 mr-2" />
                    {showPasswordForm
                      ? "Hide Password Form"
                      : "Change Password"}
                  </button>

                  {showPasswordForm && (
                    <div className="relative">
                      <form
                        onSubmit={handlePasswordChange}
                        className="mt-6 space-y-4"
                      >
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          disabled={loading}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          disabled={loading}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          disabled={loading}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                        />
                        <LoadingButton
                          type="submit"
                          isLoading={loading}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Update Password
                        </LoadingButton>
                      </form>
                    </div>
                  )}
                </div>

                <CancelSubscriptionButton />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
