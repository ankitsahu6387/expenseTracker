import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadimage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    console.log("Submitting form with:", { fullName, email, password, profilePic });

    let profileImageUrl = "";

    if (!fullName) {
      console.log("Validation Failed: Full Name missing");
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      console.log("Validation Failed: Invalid Email");
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      console.log("Validation Failed: Password missing");
      setError("Please enter the password");
      return;
    }

    setError("");
    
    try {
      // Upload image if present
      if (profilePic) {
        console.log("Uploading image...");
        const imgUploadRes = await uploadImage(profilePic);
        console.log("Image Upload Response:", imgUploadRes);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      console.log("Sending registration request...");
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      console.log("API Registration Response:", response.data);

      const { token, user } = response.data;

      if (token) {
        console.log("Token Received:", token);
        console.log("User Data Received:", user);

        localStorage.setItem("token", token);
        updateUser(user);

        console.log("Navigating to dashboard...");
        navigate("/login");
      }

    } catch (error) {
      console.log("Signup Error:", error);

      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below. 
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />

            <Input 
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />

            <div className="col-span-2">
              <Input 
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 Characters"
                type="password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">SIGN UP</button>

          <p className="tet-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">Login</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
