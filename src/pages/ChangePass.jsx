import { useState } from 'react';

function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Current Password:
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter New Password:
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Re-Enter Password:
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Save
        </button>
      </form>
    </div>
  );
}

export default PasswordChangeForm;
