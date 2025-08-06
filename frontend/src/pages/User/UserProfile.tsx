import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { useUpdateProfileMutation } from '../../store/api/apiSlice';
import { setCredentials } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/uiSlice';
import type { User } from '../../store/slices/authSlice';
import './UserProfile.css';

const schema = yup.object({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').optional(),
});

type ProfileFormData = {
  username: string;
  email: string;
  password?: string;
};

const UserProfile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      const updateData: Partial<User> = {
        username: data.username,
        email: data.email,
      };

      if (data.password) {
        (updateData as any).password = data.password;
      }

      const result = await updateProfile({
        id: user.id,
        data: updateData,
      }).unwrap();

      if (result.data) {
        dispatch(setCredentials({
          user: result.data,
        }));
      }

      dispatch(addNotification({
        type: 'success',
        message: 'Profile updated successfully!',
      }));

      setIsEditing(false);
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error?.data?.message || 'Failed to update profile',
      }));
    }
  };

  const handleCancel = () => {
    reset({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  {...register('username')}
                  disabled={!isEditing}
                  className={errors.username ? 'error' : ''}
                />
                {errors.username && <span className="error-message">{errors.username.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  disabled={!isEditing}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>

              {isEditing && (
                <div className="form-group">
                  <label htmlFor="password">New Password (optional)</label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    placeholder="Leave empty to keep current password"
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-message">{errors.password.message}</span>}
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>Account Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Member since:</span>
                  <span className="value">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Last updated:</span>
                  <span className="value">{new Date(user.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 