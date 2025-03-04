import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [data,setData] = useState({
        username : "",
        password : ""
    })
    const navigate = useNavigate()
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) =>{
        const { name , value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }


    const handleSubmit = async(e) =>{
        e.preventDefault()

        const dataResponse = await fetch(SummaryApi.signIn.url,{
            method : SummaryApi.signIn.method,
            //credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()
        
        if(dataApi.token){
            toast.success("Đăng nhập thành công")
            localStorage.setItem('user', dataApi.user);
            localStorage.setItem('role', dataApi.role);
            localStorage.setItem('token', dataApi.token);
            navigate('/')
            fetchUserDetails()
            fetchUserAddToCart()
        }

        if(!dataApi.token){
            toast.error("Đăng nhập thất bại")
        }

    }    
  return (
    <section id='login'>
        <div className='mx-auto container p-4'>

            <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons'/>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label>Tên đăng nhập : </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='text' 
                                    placeholder='Tên đăng nhập' 
                                    name='username'
                                    value={data.username}
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent'/>
                            </div>
                        </div>

                        <div>
                            <label>Mật khẩu : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='Mật khẩu'
                                    value={data.password}
                                    name='password' 
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent'/>
                                <div className='cursor-pointer text-xl' onClick={()=>setShowPassword((preve)=>!preve)}>
                                    <span>
                                        {
                                            showPassword ? (
                                                <FaEyeSlash/>
                                            )
                                            :
                                            (
                                                <FaEye/>
                                            )
                                        }
                                    </span>
                                </div>
                            </div>
                            <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                                Quên mật khẩu ?
                            </Link>
                        </div>

                        <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>

                    </form>

                    <p className='my-5'>Nếu không có tài khoản ? <Link to={"/sign-up"} className=' text-red-600 hover:text-red-700 hover:underline'>Đăng kí</Link></p>
            </div>


        </div>
    </section>
  )
}

export default Login