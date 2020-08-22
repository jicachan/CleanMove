// ===== Page INDEX.HTML ================

// Redirect to Page Options.html
function startOptions() {
    location.replace("options.html");
}



// ===== Page OPTIONS.HTML ===================

let cityprice = document.getElementById('cityprice');
let squareMeter = document.getElementById('squaremeter');
let dd_location = document.getElementById('location-dd');
let cb_options = document.getElementById('option-container');
let lb_totalsum = document.getElementById('totalsum');

let optionSum = 0;
let optionArray = [];
let totalCleaningSum = 0;



// ----- INTERFACE --------------------

// Populate dropdownlist Location (City)
function loadOptions() {
    dd_location.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Ort';

    dd_location.add(defaultOption);
    dd_location.selectedIndex = 0;

    let datalist = data.locations;
    let option;

    for (let i = 0; i < datalist.length; i++) {
        option = document.createElement('option');
        option.text = datalist[i].name;
        option.value = datalist[i].id;
        dd_location.add(option);
    }
}

// Render options by selected city
function renderOptionsByCity(value) {

    // Clear 
    cb_options.innerHTML = "";
    lb_totalsum.innerHTML = "";
    squareMeter.value = 0;
    optionSum = 0;
    optionArray = [];

    calculateOffer();

    let city = getSelectedCity(value);
    console.log("city:", city);

    // Show city price    
    if (city == "undefined" || city == undefined) {
        return;
    }
    cityprice.value = city.cityprice;

    // Options
    let lb_opt = document.createElement('label');
    lb_opt.innerHTML = "Tillval";
    cb_options.appendChild(lb_opt);

    for (let i = 0; i < city.options.length; i++) {
        let div = document.createElement('div');
        div.className = "div-option";

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = city.options[i].id;
        checkbox.value = city.options[i].price;        
        checkbox.onclick = function () {             
            getSelectedOptions(city.options[i].id);  
            calculateOffer();           
        };
        div.appendChild(checkbox);

        let label = document.createElement('label');
        label.innerHTML = city.options[i].service + ": " + city.options[i].price + " SEK";
        div.appendChild(label);

        cb_options.appendChild(div);
    }    
}

// Redirect to Page Offer.html
function startOffer() {
    location.replace("offer.html");    
}


// ----- FUNCTIONS ---------------------

function getSelectedCity(id) {    
    return data.locations.find(n => n.id == id);
}

function getSelectedOptions(service) {
    let checkbox = document.getElementById(service);
   
    if (checkbox.checked == true) {
        optionSum += parseInt(checkbox.value); 
        optionArray.push(checkbox.id);      
    }
    else {
        optionSum -= parseInt(checkbox.value); 
        let ind = optionArray.indexOf(checkbox.id);
        optionArray.splice(ind, 1);                 
    }    
    console.log("optionSum:", optionSum);
}

function calculateOffer() {
    totalCleaningSum = 0;
    
    let sqm = parseInt(squareMeter.value) || 0;    
    let cprice = parseInt(cityprice.value) || 0;
    
    totalCleaningSum = sqm * cprice;
    totalCleaningSum += optionSum;
    console.log("totalCleaningSum:", totalCleaningSum);
    
    lb_totalsum.innerHTML = totalCleaningSum + " SEK";  
    
    if (totalCleaningSum > 0) {
        document.getElementById('btn-offer').disabled = false;
    }
    
    // Save data in sessionStorage
    let selectedCity = dd_location.options[dd_location.selectedIndex].text;
 
    let formdata = {
        "city":selectedCity,
        "cityprice":cprice,
        "squaremeter":sqm,
        "useroption":optionArray,        
        "totalsum":totalCleaningSum
    };
    console.log("formdata optionArray", optionArray);

    sessionStorage.setItem('formdata', JSON.stringify(formdata));        
}



// ===== Page OFFER.HTML ===================

function getCleaningOffer() {
    let datalist = data.locations;

    // Get data from session
    let sessiondata = sessionStorage.getItem('formdata');
    let jsondata = JSON.parse(sessiondata);

    // Insert data to element
    document.getElementById('o_location').innerHTML = jsondata.city;
    document.getElementById('o_cityprice').innerHTML = jsondata.cityprice;
    document.getElementById('o_area').innerHTML = jsondata.squaremeter;
    document.getElementById('o_cost').innerHTML = (jsondata.squaremeter * jsondata.cityprice);
    document.getElementById('o_totalsum').innerHTML = jsondata.totalsum;

    // Create optional cleaning services
    let useroptArray = jsondata.useroption;

    if (useroptArray.length != null) {            
        let cityid = datalist.find(c => c.name == jsondata.city).id;
        console.log("cityid:", cityid);

        for (let i = 0; i < useroptArray.length; i++) {
            let div = document.createElement('div');
            div.className = "row";
            
            let div_1 = document.createElement('div');
            div_1.className = "col-4";
            div_1.innerHTML = "Tillval";
            div.appendChild(div_1);
            
            // Get option service and price
            let xcity = datalist.find(c => c.id == cityid);
            let xoptionserv = xcity.options.find(s => s.id == useroptArray[i]).service;
            let xoptionprice = xcity.options.find(p => p.id == useroptArray[i]).price;

            let div_2 = document.createElement('div');
            div_2.className = "col-4";            
            div_2.innerHTML = xoptionserv;
            div.appendChild(div_2);
            
            let div_3 = document.createElement('div');
            div_3.className = "col-2 right sum";
            div_3.innerHTML = xoptionprice;
            div.appendChild(div_3);
            
            let div_4 = document.createElement('div');
            div_4.className = "col-2";
            div_4.innerHTML = "SEK";
            div.appendChild(div_4);
            
            document.getElementById('o_options').appendChild(div);
        }

        // Display Date
        let today = new Date();        
        document.getElementById('currentdate').innerHTML = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
    }
}



// ===== DATA ==========================
// Hard-code data (locations and prices)

let data =
{
    "locations": [
        {
            "id": 1,
            "name": "Stockholm",
            "cityprice": 65,
            "options": [
                { "id": "window", "service": "Fönsterputs", "price": 300 },
                { "id": "balcony", "service": "Balkongstädning", "price": 150 }
            ]
        },
        {
            "id": 2,
            "name": "Uppsala",
            "cityprice": 55,
            "options": [
                { "id": "window", "service": "Fönsterputs", "price": 300 },
                { "id": "balcony", "service": "Balkongstädning", "price": 150 },
                { "id": "waste", "service": "Bortforsling av skräp", "price": 400 }
            ]
        }
    ]
};
