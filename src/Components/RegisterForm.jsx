import { useState } from "react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    avatarUrl: "",
    avatarAlt: "",
    bannerUrl: "",
    bannerAlt: "",
    venueManager: false,
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("Submitting...");

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      bio: formData.bio,
      avatar: {
        url: formData.avatarUrl,
        alt: formData.avatarAlt,
      },
      banner: {
        url: formData.bannerUrl,
        alt: formData.bannerAlt,
      },
      venueManager: formData.venueManager,
    };

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.errors
          ? responseData.errors.map((err) => err.message).join(", ")
          : responseData.message || JSON.stringify(responseData);
        throw new Error(errorMessage);
      }

      setSubmitStatus(`Registration Successful: ${JSON.stringify(responseData)}`);
    } catch (error) {
      setSubmitStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            pattern="^[\w]+$"
            maxLength={20}
            title="Must be a name, and can't exceed 20 characters."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            pattern="^[\w\-.]+@(stud\.)?noroff\.no$"
            title="Must be Noroff.no or Stud.noroff.no e-mail address"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            minLength={8}
            title="Minimum 8 characters"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 font-bold mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            maxLength={180}
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="avatarUrl"
            className="block text-gray-700 font-bold mb-2"
          >
            Avatar URL
          </label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="avatarAlt"
            className="block text-gray-700 font-bold mb-2"
          >
            Avatar Alt Text
          </label>
          <input
            type="text"
            id="avatarAlt"
            name="avatarAlt"
            value={formData.avatarAlt}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="bannerUrl"
            className="block text-gray-700 font-bold mb-2"
          >
            Banner URL
          </label>
          <input
            type="url"
            id="bannerUrl"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="bannerAlt"
            className="block text-gray-700 font-bold mb-2"
          >
            Banner Alt Text
          </label>
          <input
            type="text"
            id="bannerAlt"
            name="bannerAlt"
            value={formData.bannerAlt}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="venueManager"
            className="block text-gray-700 font-bold mb-2"
          >
            <input
              type="checkbox"
              id="venueManager"
              name="venueManager"
              checked={formData.venueManager}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            Venue Manager
          </label>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      </form>
      {submitStatus && (
        <p className={`mt-4 text-center ${submitStatus.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {submitStatus}
        </p>
      )}
    </div>
  );
};

export default RegisterForm;
