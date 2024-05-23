import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}
    urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true
    })

    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList, setFilterCategoryList] = useState([])

    const [sortBy, setSortBy] = useState("")

    const [showFilter, setShowFilter] = useState(false); // Thêm state để kiểm soát việc hiển thị phần filter trên di động

    const fetchData = async () => {
        const url = new URL(SummaryApi.filterProduct.url);
        const params = new URLSearchParams();
        params.append("code", urlCategoryListinArray);
        url.search = params.toString();

        const response = await fetch(url, {
            method: SummaryApi.filterProduct.method,
            headers: {
                "Content-Type": "application/json"
            }
        });

        const dataResponse = await response.json()
        setData(dataResponse || [])

    }

    const handleSelectCategory = (e) => {
        const { name, value, checked } = e.target

        setSelectCategory(prevState => {
            return {
                ...prevState,
                [value]: checked
            }
        })
    }

    useEffect(() => {
        fetchData()
    }, [filterCategoryList])

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory).filter(categoryKeyName => selectCategory[categoryKeyName])

        setFilterCategoryList(arrayOfCategory)

        const urlFormat = arrayOfCategory.map((el, index) => {
            if ((arrayOfCategory.length - 1) === index) {
                return `category=${el}`
            }
            return `category=${el}&&`
        })

        navigate("/product-category?" + urlFormat.join(""))
    }, [selectCategory])

    const handleOnChangeSortBy = (e) => {
        const { value } = e.target

        setSortBy(value)

        if (value === 'asc') {
            setData(prevData => [...prevData].sort((a, b) => a.sellingPrice - b.sellingPrice))
        }

        if (value === 'dsc') {
            setData(prevData => [...prevData].sort((a, b) => b.sellingPrice - a.sellingPrice))
        }
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='lg:grid grid-cols-[200px,1fr]'>
                {/* Filter section */}
                <div className={`bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll ${showFilter ? 'block' : 'hidden'} lg:block`}>
                    <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
                    <form className='text-sm flex flex-col gap-2 py-2'>
                        <div className='flex items-center gap-3'>
                            <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"} />
                            <label>Giá - Thấp đến cao</label>
                        </div>
                        <div className='flex items-center gap-3'>
                            <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"} />
                            <label>Giá - Cao đến thấp</label>
                        </div>
                    </form>
                </div>

                {/* Filter toggle button for mobile */}
                {/* <button className="lg:hidden" onClick={() => setShowFilter(!showFilter)}>
                    {showFilter ? 'Hide Filter' : 'Show Filter'}
                </button> */}

                {/* Product section */}
                <div className='px-4'>
                    <p className='font-medium text-slate-800 text-lg my-2'>Kết quả : {data.length}</p>
                    <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
                        {data.length !== 0 && !loading && (
                            <VerticalCard data={data} loading={loading} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryProduct
