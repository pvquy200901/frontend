const { default: SummaryApi } = require("../common")

const fetchBestSeller = async()=>{
    const response = await fetch(SummaryApi.bestSeller.url,{
        method : SummaryApi.bestSeller.method,
        headers : {
            "content-type" : "application/json"
        }
    })

    const dataResponse = await response.json()

    return dataResponse
}

export default fetchBestSeller