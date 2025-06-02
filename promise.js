// const request = fetch('https://countries-api-836d.onrender.com/countries/')
// console.log(request)

const ntn=document.querySelector('.btn-country');
const countriesContainer=document.querySelector('.countries')
const renderCountry = function(data) {
  const html = `
    <article style="border:1px solid #ccc; padding:1rem; margin:1rem; max-width:300px;">
      <img src="${data.flags.png}" alt="Flag of ${data.name.common}" style="width:100%;">
      <div>
        <h3>Name: ${data.name.common}</h3>
        <p>Region: ${data.region}</p>
        <p>Population: ${data.population.toLocaleString()}</p>
      </div>
    </article>
  `;

  // Insert into the document
  countriesContainer.body.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity=1;
};
const renderError=function(msg){
    countriesContainer.insertAdjacentText('beforeend',msg);
      countriesContainer.style.opacity=1;
}
const getJSON=function(url,erroeMsg='Something went wrong'){
    return fetch(url).then(response=>{
        if(!response.ok){
            throw new Error(`${erroeMsg} ${response.status}`)
        }
        return response.json();
    })
}


/// below code is using promises ans conuming and chaining promises

// const getCountriesData=function(country){
//      return fetch(`https://restcountries.com/v3.1/name/${country}`)
//      .then(response=>{
//         if(!response.ok){
//             throw new Error(`country not found ${response.status}`)
//         }
//         return response.json();
//     })
//      .then(data=>{
//         const neighbour=data[0]?.borders[3];
//         console.log(data)
//         if(!neighbour)return;

//         return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//         })
//         .then(response=>{
//             if (!response) return; 
//             return response.json();
//         })
//         .then(data=>{
//             console.log(data)
//         })
//         .catch(err=>{console.error(`{err} 🔥🔥🔥`)
//         renderError(`Something went wrong ${err.message} , Try again!`)
//     })
// };

const getCountriesData=function(country){
     getJSON(`https://restcountries.com/v3.1/name/${country}`,'country not found')
     .then(data=>{
        const neighbour=data[0]?.borders[3];
        console.log(data)
        if(!neighbour)return;

        return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`,'country not found')
        })
        .then(response=>{
            if (!response) return; 
            return response.json();
        })
        .then(data=>{
            console.log(data)
        })
        .catch(err=>{console.error(`{err} 🔥🔥🔥`)
        renderError(`Something went wrong ${err.message} , Try again!`)
    })
};





btn.addEventListener('click',function(){
    getCountriesData('india');
})




getCountriesData('india')

//chaining promises are used to get rid of the callbackhell
//callbackhell is happen when continous calling of async code itself