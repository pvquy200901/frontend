import React from 'react'
import CategoryList from './CategoryList'

const ListShop = ({heading}) => {

   

  return (
    <div className='container mx-auto px-4 my-6 relative'>

            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

                
            <CategoryList/>

            

    </div>
  )
}

export default ListShop