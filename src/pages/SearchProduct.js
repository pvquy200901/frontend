import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
const SearchProduct = () => {
  const query = useQuery();
  const searchQuery = query.get('q');
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)

    const fetchProduct = async()=>{
      setLoading(true);

    try {
      const url = new URL(SummaryApi.searchProduct.url);

      const response = await fetch(url, {
        method: SummaryApi.searchProduct.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const dataResponse = await response.json();
      if(!searchQuery){
        setData(dataResponse || []);

      }
      else{
        const filteredData = dataResponse.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
  
        setData(filteredData || []);
      }

    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
    }

    useEffect(()=>{
      if (searchQuery) {
        fetchProduct();
      }
    },[searchQuery])

  return (
    <div className='container mx-auto p-4'>
      {
        loading && (
          <p className='text-lg text-center'>Đang tải ...</p>
        )
      }
 
      <p className='text-lg font-semibold my-3'>Tổng số : {data.length}</p>

      {
        data.length === 0 && !loading && (
           <p className='bg-white text-lg text-center p-4'>Không tìm thấy kết quả....</p>
        )
      }


      {
        data.length !==0 && !loading && (
          <VerticalCard loading={ loading} data={data}/>
        )
      }

    </div>
  )
}

export default SearchProduct