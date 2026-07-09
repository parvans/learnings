export const formatPrice = (value:number): string =>{
    if(value >= 10000000){
        const cr = (value/10000000).toFixed(1).replace(/\.0$/,"");
        return `₹${cr}Cr`;
    }
    if(value >= 100000){
        const cr = (value/100000).toFixed(1).replace(/\.0$/,"");
        return `₹${cr}L`;
    }

    return `₹${value.toLocaleString()}`;
}