import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [avatartmp, setAvatartmp] = useState('')
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [data, setData] = useState({
        code: "",
        username: "",
        password: "",
        confirmPassword: "",
        address: "",
        email: "",
        displayName: "",
        numberPhone: "",
        avatar: "",
    })
    const navigate = useNavigate()

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleUploadPic = async (e) => {
        const file = e.target.files[0];
        const imagePic = await imageTobase64(file)

        setAvatartmp(imagePic);

        // Kiểm tra xem đã chọn tệp hình ảnh chưa
        if (file) {
            try {
                setData(prevState => ({
                    ...prevState,
                    avatar: file,
                }));
            }
            catch (error) {
                console.error('Error reading image file:', error);
                // Xử lý lỗi khi đọc tệp hình ảnh
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password === data.confirmPassword) {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('code', data.code);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('address', data.address);
            formData.append('email', data.email);
            formData.append('displayName', data.displayName);
            formData.append('numberPhone', data.numberPhone);
            formData.append('avatar', data.avatar);

            try {
                const response = await fetch(SummaryApi.signUP.url, {
                    method: SummaryApi.signUP.method,
                    body: formData
                });

                if (response.ok) {
                    toast.success("Đăng ký thành công");
                    navigate("/login");
                } else {
                    toast.error("Có lỗi xảy ra");
                }
            } catch (error) {
                console.error('Error:', error); // Xử lý lỗi mạng
                toast.error("Có lỗi xảy ra");
            }

        } else {
            toast.error("Please check password and confirm password")
        }

    }

    return (
        <section id='signup'>
            <div className='mx-auto container p-4'>

                <div className='bg-white p-5 w-full max-w-sm mx-auto'>

                    <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                        <div>
                            <img src={avatartmp || loginIcons} alt='login icons' />
                        </div>
                        <form>
                            <label>
                                <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                                    Tải hình ảnh
                                </div>
                                <input type='file' className='hidden' onChange={handleUploadPic} />
                            </label>
                        </form>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label>Họ tên : </label>
                            <div className='bg-slate-100 p-2'>
                                <input
                                    type='text'
                                    placeholder='Nhập họ và tên'
                                    name='displayName'
                                    value={data.displayName}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />
                            </div>
                        </div>
                        <div className='grid'>
                            <label>Email : </label>
                            <div className='bg-slate-100 p-2'>
                                <input
                                    type='email'
                                    placeholder='Nhập email'
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />
                            </div>
                        </div>
                        <div className='grid'>
                            <label>Tên đăng nhập : </label>
                            <div className='bg-slate-100 p-2'>
                                <input
                                    type='text'
                                    placeholder='Nhập tên đăng nhập'
                                    name='username'
                                    value={data.username}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />
                            </div>
                        </div>

                        <div>
                            <label>Mật khẩu : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Nhập mật khẩu'
                                    value={data.password}
                                    name='password'
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />
                                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showPassword ? (
                                                <FaEyeSlash />
                                            )
                                                :
                                                (
                                                    <FaEye />
                                                )
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label>Nhập lại mật khẩu : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='Nhập lại mật khẩu'
                                    value={data.confirmPassword}
                                    name='confirmPassword'
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />

                                <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showConfirmPassword ? (
                                                <FaEyeSlash />
                                            )
                                                :
                                                (
                                                    <FaEye />
                                                )
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='grid'>
                            <label>Địa chỉ : </label>
                            <div className='bg-slate-100 p-2'>
                                <input
                                    type='text'
                                    placeholder='Nhập địa chỉ'
                                    name='address'
                                    value={data.address}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />
                            </div>
                        </div>

                        <div className='grid'>
                            <label>Số điện thoại: </label>
                            <div className='bg-slate-100 p-2'>
                                <input
                                    type='text'
                                    placeholder='Nhập số điện thoại'
                                    name='numberPhone'
                                    value={data.numberPhone}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />
                            </div>
                        </div>

                        <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Đăng ký</button>

                    </form>

                    <p className='my-5'>Nếu bạn đã có tài khoản ? <Link to={"/login"} className=' text-red-600 hover:text-red-700 hover:underline'>Đăng nhập</Link></p>
                </div>


            </div>
        </section>
    )
}

export default SignUp