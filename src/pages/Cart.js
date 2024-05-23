import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { backendDomain } from '../common/configURL';

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const [showDialog, setShowDialog] = useState(false);
    const [note, setNote] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');


    const fetchData = async () => {
        const headers = new Headers();
        //headers.append("Content-Type", "application/json");
        headers.append("token", localStorage.getItem("token"));

        const requestOptions = {
            method: SummaryApi.getListCartProduct.method,
            headers: headers,
        };


        const responseData = await fetch(SummaryApi.getListCartProduct.url, requestOptions);
        const jsonData = await responseData.json();

        if (responseData.status === 200) {

            setData(jsonData)
        }


    }

    const handleLoading = async () => {
        await fetchData()
    }

    useEffect(() => {
        setLoading(true)
        handleLoading()
        setLoading(false)
    }, [])


    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            //credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify(
                {
                    id: id,
                    quantity: qty + 1
                }
            )
        })

        if (response.status === 200) {
            fetchData()
        }
    }


    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                //credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(
                    {
                        id: id,
                        quantity: qty - 1
                    }
                )
            })
            if (response.status === 200) {
                fetchData()
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            //credentials: 'include',
            headers: {
                "content-type": 'application/json',
            },
            body: JSON.stringify(
                {
                    id: id,
                }
            )
        })

        if (response.status === 200) {
            fetchData()

            context.fetchUserAddToCart()

        }

    }
    
    const handleOrderConfirm = () => {
        createOrder()
    };

    const createOrder = async () => {
        const response = await fetch(SummaryApi.createOrder.url, {
            method: SummaryApi.createOrder.method,
            //credentials: 'include',
            headers: {
                "content-type": 'application/json',
                token: localStorage.getItem("token")
            },
            body: JSON.stringify(
                {
                    idCartProduct: data.map(product => product.id),
                    note: note,
                    total: totalPrice,
                    phone: phoneNumber,
                    address: address
                }
            )
        })

        if (response.status === 200) {
            fetchData()
            setShowDialog(false);
            context.fetchUserAddToCart()

        }

    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.product.price), 0)
    return (
        <div className='container mx-auto'>

            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5'>Không có dữ liệu</p>
                    )
                }
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/***view product */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart?.map((el, index) => {
                                return (
                                    <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })

                        ) : (
                            data.map((product, index) => {
                                return (
                                    <div key={product?.product.code + "Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]'>
                                        <div className='w-32 h-32 bg-slate-200'>
                                            <img src={`${backendDomain}/api/File/image/${product.product.images[0]}`} className='w-full h-full object-scale-down mix-blend-multiply' />
                                        </div>
                                        <div className='px-4 py-2 relative'>
                                            {/**delete product */}
                                            <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?.id)}>
                                                <MdDelete />
                                            </div>

                                            <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.product.name}</h2>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.product.price)}</p>
                                                <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.product.price * product?.quantity)}</p>
                                            </div>
                                            <div className='flex items-center gap-3 mt-1'>
                                                <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={() => decraseQty(product?.id, product?.quantity)}>-</button>
                                                <span>{product?.quantity}</span>
                                                <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={() => increaseQty(product?.id, product?.quantity)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>


                {/***summary  */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                    {
                        loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>

                            </div>
                        ) : (
                            <div className='h-36 bg-white'>
                                <h2 className='text-white bg-red-600 px-4 py-1'>Hóa đơn</h2>
                                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                    <p>Tổng số lượng sản phẩm</p>
                                    <p>{totalQty}</p>
                                </div>

                                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                    <p>Tổng tiền phải trả</p>
                                    <p>{displayINRCurrency(totalPrice)}</p>
                                </div>

                                <button className='bg-blue-600 p-2 text-white w-full mt-2' onClick={() => setShowDialog(true)} > Đặt hàng</button>

                            </div>
                        )
                    }
                </div>
            </div>
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 max-w-sm mx-auto rounded-md">
                        <h2 className="text-xl font-semibold mb-4">Thông tin đặt hàng</h2>
                        <textarea
                            className="w-full border rounded-md px-3 py-2 mb-3"
                            placeholder="Ghi chú"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2 mb-3"
                            placeholder="Địa chỉ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2 mb-3"
                            placeholder="Số điện thoại"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => handleOrderConfirm()}>Xác nhận</button>
                            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md" onClick={() => setShowDialog(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart