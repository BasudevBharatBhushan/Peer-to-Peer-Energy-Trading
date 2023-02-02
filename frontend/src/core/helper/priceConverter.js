export const INR_to_USD = ({USDValue})=>{
    console.log("hello"+USDValue)
    return fetch(`https://api.apilayer.com/currency_data/convert?to=USD&from=INR&amount=${USDValue}` ,{
        method:"GET",
        headers:{
            apikey:"BVFq6Yyk8ULHzTqNiBrcmcO0z7jSvqA7"
        }
    }).then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))
}