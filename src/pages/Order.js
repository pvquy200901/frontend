import { cilAvTimer } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import SummaryApi from '../common';
import { backendDomain } from '../common/configURL';
import displayINRCurrency from '../helpers/displayCurrency';
import imageTobase64 from '../helpers/imageTobase64';



const Order = () => {
    const user = useSelector(state => state?.user?.user)
    const dispatch = useDispatch()

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
    useEffect(() => {
        if (user) {
            setData(prevData => ({
                ...prevData,
                displayName: user.displayName || '',
                address: user.address || '',
                email: user.email || '',
                numberPhone: user.numberPhone || '',
                avatar: user.avatar || '',
            }));
        }
    }, [user]);


    const [orders, setOrders] = useState([]);
    const [historyOrders, setHistoryOrders] = useState([]);
    // State để điều khiển việc hiển thị dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
    // State để lưu thông tin của sản phẩm được chọn
    const [selectedOrder, setSelectedOrder] = useState(null);


    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleViewDelete = (order) => {
        setSelectedOrder(order);
        setIsDialogDeleteOpen(true);
    };
    const handleDeleteOrder = async (code) => {
        try {
            const response = await fetch(`${SummaryApi.deleteOrder.url}?code=${code}`, {
                method: SummaryApi.deleteOrder.method,
                headers: {
                    "content-type": "application/json",
                    token: localStorage.getItem("token")
                }
            });
    
            if (response.ok) {
                toast.success("Hủy đơn hàng thành công");
                setIsDialogDeleteOpen(false)
                fetchOrders();
            } else {
                toast.error("Có lỗi xảy ra");
            }
        } catch (error) {
            console.error('Error:', error); // Xử lý lỗi mạng
            toast.error("Có lỗi xảy ra");
        }
    }

    useEffect(() => {
        // Gọi hàm để lấy danh sách đơn hàng của người dùng
        fetchOrders();
        fetchHistoryOrders();
        fetchUser();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${SummaryApi.orders.url}`, {
                method: SummaryApi.orders.method,
                headers: {
                    token: localStorage.getItem("token")
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data)
                // Sử dụng dữ liệu ở đây, ví dụ: setOrders(data.orders);
            } else {
                toast.error("Có lỗi xảy ra khi lấy danh sách đơn hàng");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Có lỗi xảy ra khi lấy danh sách đơn hàng");
        }
    };
    const fetchHistoryOrders = async () => {
        try {
            const response = await fetch(`${SummaryApi.ordersFinish.url}`, {
                method: SummaryApi.orders.method,
                headers: {
                    token: localStorage.getItem("token")
                }
            });
            if (response.ok) {
                const data = await response.json();
                setHistoryOrders(data)
                // Sử dụng dữ liệu ở đây, ví dụ: setOrders(data.orders);
            } else {
                toast.error("Có lỗi xảy ra khi lấy danh sách đơn hàng");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Có lỗi xảy ra khi lấy danh sách đơn hàng");
        }
    };
    const fetchUser = async () => {
        try {
            const response = await fetch(`${SummaryApi.current_user.url}`, {
                method: SummaryApi.orders.method,
                headers: {
                    code: localStorage.getItem("user")
                }
            });

            if (response.ok) {
                const data = await response.json();
            } else {
                toast.error("Có lỗi xảy ra khi lấy danh sách đơn hàng");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Có lỗi xảy ra khi lấy danh sách đơn hàng");
        }
    };

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

        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('code', localStorage.getItem("user"));
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('address', data.address);
        formData.append('email', data.email);
        formData.append('displayName', data.displayName);
        formData.append('numberPhone', data.numberPhone);
        formData.append('avatar', data.avatar);

        try {
            const response = await fetch(SummaryApi.updateUser.url, {
                method: SummaryApi.updateUser.method,
                body: formData
            });

            if (response.ok) {
                toast.success("Cập nhật thành công");

            } else {
                toast.error("Có lỗi xảy ra");
            }
        } catch (error) {
            console.error('Error:', error); // Xử lý lỗi mạng
            toast.error("Có lỗi xảy ra");
        }

    }
    return (

        <>
            {
                user && <section id='signup'>
                    <div className='mx-auto container p-4'>

                        <div className='bg-white p-5 w-full max-w-sm mx-auto'>

                            <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                                <div>
                                    <img src={avatartmp || `${backendDomain}/api/File/image/${user.avatar}`} alt='login icons' />
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

                                <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Cập nhật</button>

                            </form>

                        </div>


                    </div>
                </section>
            }
            {
                <section id='orders'>
                    <div className='mx-auto container p-4'>
                        <h2 className='text-xl font-bold mb-4'>Danh sách đơn hàng của bạn</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {orders ? orders.map(order => (
                                <div key={order.code} className='bg-white p-4 shadow-md rounded-md'>
                                    <h3 className='text-lg font-semibold mb-2'>Mã đơn hàng {order.code}</h3>
                                    <p><strong>Ngày đặt hàng:</strong> {order.time}</p>
                                    <p><strong>Trạng thái:</strong> {order.state}</p>
                                    <p><strong>Số tiền:</strong> {order.total}</p>
                                    <p><strong>Ghi chú:</strong> {order.note}</p>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <button className='mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md'
                                            onClick={() => handleViewDetail(order)}>Xem chi tiết</button>
                                        <button className='mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md'
                                            onClick={() => handleViewDelete(order)}>Hủy đơn</button>
                                    </div>
                                </div>
                            )) : <>Không có đơn hàng nào</>}
                        </div>
                    </div>
                </section>
            }
            {
                <section id='historyOrders'>
                    <div className='mx-auto container p-4'>
                        <h2 className='text-xl font-bold mb-4'>Danh sách lịch sử đơn hàng của bạn</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {historyOrders ? historyOrders.map(order => (
                                <div key={order.code} className='bg-white p-4 shadow-md rounded-md'>
                                    <h3 className='text-lg font-semibold mb-2'>Mã đơn hàng {order.code}</h3>
                                    <p><strong>Ngày đặt hàng:</strong> {order.time}</p>
                                    <p><strong>Trạng thái:</strong> {order.state}</p>
                                    <p><strong>Số tiền:</strong> {order.total}</p>
                                    <p><strong>Ghi chú:</strong> {order.note}</p>
                                    <button className='mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md'
                                        onClick={() => handleViewDetail(order)}>Xem chi tiết</button>
                                </div>
                            )) : <>Không có đơn hàng nào</>}
                        </div>
                    </div>
                </section>
            }
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto dialog-container">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        {
                            selectedOrder && <div className="relative bg-white rounded-lg p-6 max-w-xl w-full dialog-container">
                                {/* Hiển thị thông tin của sản phẩm và timeline quá trình xử lý đơn hàng */}
                                {/* Ví dụ: */}
                                <h3 className="text-lg font-semibold mb-2">Thông tin sản phẩm:</h3>
                                <div className='flex gap-4 overflow-x-auto'>
                                    {selectedOrder.cartProducts.map((product) => (
                                        <div className='w-full min-w-[280px]  md:min-w-[300px] max-w-[280px] md:max-w-[300px]  bg-white rounded-sm shadow '>
                                            <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                                <img src={`${backendDomain}/api/File/image/${product.product.images[0]}`} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                                            </div>
                                            <div className='p-4 grid gap-3'>
                                                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.product.name}</h2>
                                                <p className='capitalize text-slate-500'> Số lượng: {product?.quantity}</p>
                                                <div className='flex gap-3'>
                                                    <p className='text-red-600 font-medium'>Giá bán: {displayINRCurrency(product?.product.price)}</p>
                                                    {/* <p className='text-slate-500 line-through'>{ displayINRCurrency(product?.price)  }</p> */}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-lg font-semibold mb-2">Quá trình đơn hàng:</h3>
                                <VerticalTimeline>
                                    {selectedOrder.logs.map((event, index) => (
                                        <VerticalTimelineElement
                                            id={index}
                                            className="vertical-timeline-element--work"
                                            contentStyle={{ background: 'rgb(33, 150, 243)' }}
                                            //contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                                            date={event.time}
                                            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                            icon={<CIcon icon={cilAvTimer} />}
                                        >
                                            <h3 className="vertical-timeline-element-subtitle">Tình trạng đơn hàng: {event.state}</h3>

                                            {event.user !== "" ? <h4 className="vertical-timeline-element-subtitle">Tên shipper: {event.user} </h4> : <></>}
                                            {event.phone !== "" ? <h4 className="vertical-timeline-element-subtitle">Số điện thoại shipper: {event.phone} </h4> : <></>}
                                            {event.note !== "" ? <h4 className="vertical-timeline-element-subtitle">Ghi chú của cửa hàng: {event.note} </h4> : <></>}

                                        </VerticalTimelineElement>
                                    ))}


                                </VerticalTimeline>

                                {/* Nút đóng dialog */}
                                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mt-4"
                                    onClick={() => setIsDialogOpen(false)}>Đóng</button>
                            </div>
                        }

                    </div>
                </div>
            )}
            {isDialogDeleteOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto dialog-container">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        {selectedOrder && (
                            <div className="relative bg-white rounded-lg p-6 max-w-xl w-full">
                                <h2 className="text-lg font-semibold mb-2">Bạn có muốn hủy đơn hàng này?</h2>
                                {/* Các nút để xác nhận hoặc hủy bỏ */}
                                <div className="flex justify-end">
                                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mr-2"
                                        onClick={() => handleDeleteOrder(selectedOrder.code)}>Xác nhận</button>
                                    <button className="bg-gray-400 hover:bg-gray-500 text-gray-800 px-4 py-2 rounded-md"
                                        onClick={() => setIsDialogDeleteOpen(false)}>Hủy bỏ</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    )
}

export default Order