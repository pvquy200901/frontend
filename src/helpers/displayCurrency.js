const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat('en-IN',{
        style : "currency",
        currency : 'VND',
        minimumFractionDigits : 0
    })

    return formatter.format(num)

}

export default displayINRCurrency