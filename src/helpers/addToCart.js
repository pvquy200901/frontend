import SummaryApi from "../common"
import { toast } from 'react-toastify'

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()
    const data = {
        product: id,
        quantity: 1,
    };
    
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("token", localStorage.getItem("token"));
    
    const requestOptions = {
        method: SummaryApi.addToCartProduct.method,
        headers: headers,
        body: JSON.stringify(data),
    };
    
    const responseData = await fetch(SummaryApi.addToCartProduct.url, requestOptions);
    

    if(responseData.status === 200){
        toast.success(responseData.message)
    }

    if(responseData.status !== 200){
        toast.error(responseData.message)
    }


    return responseData

}


export default addToCart