import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { IoLogIn } from "react-icons/io5";
import { MdOutlineEmail} from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/user/login-user`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Login Success!");
        navigate("/");
        window.location.reload(true); 
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    
    <div className="min-h-screen max-400px:min-h-[30vh] bg-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-no-repeat background-cover"
  //   style={{
  //     backgroundImage: "url(https://okcredit-blog-images-prod.storage.googleapis.com/2022/01/mineralwater2.jpg)",
  // }}
    >

    <div className="sm:mx-auto sm:w-full sm:max-w-md">
       
      </div>
    <div className=" sm:mx-auto sm:w-full sm:max-w-md max-400px:h-[30vh]">
      <div className=" bg-white py-4 px-4 shadow-xl shadow-gray-500 sm:rounded-lg sm:px-10 max-400px:m-6 max-400px:rounded-[30px]">
        <form className="space-y-8" onSubmit={handleSubmit} >
        <IoLogIn size ={30} className="text-blue-500 "/><h2 className="text-center text-[22px]  text-blue-700">
          Login your Valid Account
        </h2>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              <div className="flex"><MdOutlineEmail size={20} />Email address</div>
            </label>
            <div className="mt-1 ">
              <input
                type="email"
                placeholder="Enter Valid Email Address"
                name="email"
                autoComplete="email" 
                required value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className=" h-9 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700">
               <div className="flex"><RiLockPasswordLine size={20} />Password</div>
            </label>
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                placeholder="Enter Password"
                name="password"
                autoComplete="current-password" 
                required value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className=" h-9 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
                 {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
            </div>
            
          </div>
          
          <div className={`${styles.noramlFlex} justify-between`}> 
          <div className={`${styles.noramlFlex}`}>
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text- -900 rounded-full"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href=".forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
          
          </div>
          <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </button>
            </div>
            <div className={`${styles.noramlFlex} w-full justify-center`}>
              <h4 className="text-gray-500">Not have any account?</h4>
              <Link to="/sign-up" className="text-blue-600 pl-2">
                <h4 className="font-Roboto">Sign Up</h4>
              </Link>
            </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Login;