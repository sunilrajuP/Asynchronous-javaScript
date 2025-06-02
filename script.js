'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

// // // NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// // // https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

// // ///////////////////////////////////////

const request = fetch('https://countries-api-836d.onrender.com/countries/')
console.log(request)


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
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity=1;
};
const renderError=function(msg){
    countriesContainer.insertAdjacentText('beforeend',msg);
      countriesContainer.style.opacity=1;
}
const getJSON=function(url,erroeMsg='Something went wrong'){
    return fetch(url).then(response=>{
        if(!response.ok){
            throw new Error(`${erroeMsg} ${response.status}`);
        }
        return response.json();
    });
}


// // /// below code is using promises ans conuming and chaining promises

// // // const getCountriesData=function(country){
// // //      return fetch(`https://restcountries.com/v3.1/name/${country}`)
// // //      .then(response=>{
// // //         if(!response.ok){
// // //             throw new Error(`country not found ${response.status}`)
// // //         }
// // //         return response.json();
// // //     })
// // //      .then(data=>{
// // //         const neighbour=data[0]?.borders[3];
// // //         console.log(data)
// // //         if(!neighbour)return;

// // //         return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
// // //         })
// // //         .then(response=>{
// // //             if (!response) return; 
// // //             return response.json();
// // //         })
// // //         .then(data=>{
// // //             console.log(data)
// // //         })
// // //         .catch(err=>{console.error(`{err} 🔥🔥🔥`)
// // //         renderError(`Something went wrong ${err.message} , Try again!`)
// // //     })
// // // };

// // const getCountriesData=function(country){
// //      getJSON(`https://restcountries.com/v3.1/name/${country}`,'country not found')
// //      .then(data=>{
// //         renderCountry(data[0]); 
// //         const neighbour=data[0]?.borders[3];
// //         console.log(data)
// //         if(!neighbour)return;

// //         return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`,'country not found')
// //         })
// //         .then(data=>{
// //             if (!data) return;
// //             renderCountry(data[0]);
// //             console.log(data)
// //         })
// //         .catch(err=>{console.error(`${err} 🔥🔥🔥`)
// //         renderError(`Something went wrong ${err.message} , Try again!`)
// //     })
// // };


// // btn.addEventListener('click',function(){
// //     getCountriesData('india');
// // })



// // //chaining promises are used to get rid of the callbackhell
// // //callbackhell is happen when continous calling of async code itself


// // // EVENT LOOP
// // // input:
// // console.log('test Start');
// // setTimeout(()=>console.log('0 sec timer'),0)
// // Promise.resolve('resolved promise 1').then(res=>console.log(res))

// // Promise.resolve('resolvepromise 2').then(res=>{
// //     for(let i=0;i<100;i++){
// //         console.log(res);
// //     }
// // })

// // console.log('Test end')

// // // output
// // test start //
// // test end
// // resolved Promise 1//promise create there own que which is microtask que. microtask have more priority than callback que
// // resolvepromise 2
// // 0 sec timer // callback que

 
// //creating our  own promises
// //this is how to encapsulate the  any async behaviour  in to promise 
const lotteryPromise=new Promise(function(resolve,reject){
    console.log('lottery draw is happening')
    setTimeout(function(){
        if (Math.random() >= 0.5) {
            resolve("YOU WIN")
        }
        reject(new Error ('YOU LOST'))
    },2000)
})
//below is consuming promise
lotteryPromise.then(res=>console.log(res)).catch(err=>console.log(err))


//promisifying ----means basically converting callback based async behaviour into promise based

//promisifying settimeout

const wait =function(seconds){
    return new Promise(function(resolve){
        setTimeout(resolve,seconds*1000)
    })

}

wait(2).then(()=>{
    console.log('i waited for 2 sec')
    return(wait(1))
}).then(()=>{console.log('i waited for 1 sec')
    return (wait(0))
    
}).then(()=>{
    console.log('i waited for 0 sc')
})

// this below is example of callbackhell. to avoid this same code is written above to avoid callbackhell

setTimeout(()=>{
    console.log('1 sec waited');
    setTimeout(()=>{
        console.log('2 sec waited');
        setTimeout(()=>{
            console.log('1 sec waited');
        },1000)
    },1000)
},1000)

Promise.resolve('ABC').then(res=>console.log(res))
Promise.reject(new Error('problem!')).catch(err=>console.error(err))

promisfing thr geoloactionAPI

navigator.geolocation.getCurrentPosition(
    position=>console.log(position),
    err=>console.error(err))

// the above code is written as below using promises

const getPosition=function(){
    return new Promise(function(resolve,reject){
        navigator.geolocation.getCurrentPosition(resolve,
    reject)

    })
}

getPosition().then(pos=>console.log(pos))

// getting posing using Navigation and geolocation in the ui
const whereAmI=function(){
    getPosition()
    .then(pos=>{
        const {latitude:lat , longitude:long}=pos.coords;
        return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`)
    })
    .then(res=>{
        if(!res.ok) throw new Error(`problem with geocoding ${res.status}`);
        return res.json();
    })
    .then(data=>{
        console.log(data)
        console.log(`you are in ${data.city},${data.countryName}`)
        return fetch(`https://restcountries.com/v3.1/name/${data.countryName}
`)
    })
    .then(res=>{
        if(!res.ok)throw new Error (`country not found ${res.status}`)
        return res.json()
    })
    .then(data=>renderCountry(data[0]))
    .catch(err=>console.error(`${err.message}`))
    
}

btn.addEventListener('click',whereAmI)

challenge--2

using of async /await

async means that keeps running in the background

const getPosition=function(){
    return new Promise(function(resolve,reject){
        navigator.geolocation.getCurrentPosition(resolve,
    reject)

    })
}

const whereAmI=async function(country){
    try{
    //geolocation
    const pos=await getPosition()
    const {latitude:lat , longitude:long}=pos;
    //reverse geocoding
    const resGeo=fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`)
    if(!resGeo.ok) throw new Error(`problem getting at location data`)
    const dataGeo=(await resGeo).json();
    console.log(dataGeo)

    //countrydata
    const res=await(fetch(`https://restcountries.com/v3.1/name/${country}`))
    const data = await res.json()
    renderCountry(data[0])
    console.log(data)
    }
    catch(err){
        console.error(`${err}🔥`)
        renderError(`🔥${err.message}`)
    }
}


whereAmI()
whereAmI()
console.log('first')

try{
let y=1;
const x=2;
y=3
}
catch(err){
    alert(err.message)
}

running async functions parellelly


const get3countries=async function(c1,c2,c3){
    try{
        // const [data1]= await getJSON(`https://restcountries.com/v3.1/name/${c1}`)
        // const [data2]= await getJSON(`https://restcountries.com/v3.1/name/${c2}`)
        //  const [data3]= await getJSON(`https://restcountries.com/v3.1/name/${c3}`)
        
        //promises .all is used to make the all promises parelley(at same time)
        // if promise is rejected then entire promise will be rejected

        const data = await Promise.all([
            getJSON(`https://restcountries.com/v3.1/name/${c1}`),
            getJSON(`https://restcountries.com/v3.1/name/${c2}`),
            getJSON(`https://restcountries.com/v3.1/name/${c3}`)
        ])

        console.log(data.map(d=>d[0].capital))
    }catch(err){
        console.error(`${err}`)
    }

}
get3countries('india','portugal','canada')

// promise.race is function that receive an array of promises and receive a promise
// the promise which settle first will win the race(settele means a avalue is avalible)

const getJSON=function(url,erroeMsg='Something went wrong'){
    return fetch(url).then(response=>{
        if(!response.ok){
            throw new Error(`${erroeMsg} ${response.status}`);
        }
        return response.json();
    });
}


