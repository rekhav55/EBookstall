/* * * * *     Global Variables     * * * * */
let baseUrlLocal = 'http://localhost:3000';
let USER_INFO = 'user_info';
let CURRENT_URL = window.location.href;
let pricePerDay;


/* * * * *     Headers for cross origin issues   * * * * */
let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};

/* * * * *     Event Triggers     * * * * */
$('#btn-login-user').on('click', function () {
    checkBorrowerExists();
}); 

$('#btn-register').on('click', function () {
    getRegisterDetails();
});

$('#btn-rent-final').on('click', function () {
   
    updateFee();
});

$('#btn-add').on('click', function () {
    addNewBook();
});

$('#btn-logout').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('login_info');
	window.location.href = "index.html";
});

/****** Loading the methods when page loads ******/ 
if (CURRENT_URL.includes('user_dashboard')) 
{
    getUser();
   
    loadRentedBooksTable();
}
if (CURRENT_URL.includes('available_books')) {
    loadAvailableBooksTable();
}

if (CURRENT_URL.includes('summary')) {
    loadAvailableBooksTable();
}

if (CURRENT_URL.includes('engineering')) {
    loadAvailableBooksTableEngineering();
}

if (CURRENT_URL.includes('novels')) {
    loadAvailableBooksTable();
}

if (CURRENT_URL.includes('book_details')) {
    getBookDetails();
    initiateDatePickers();
}

//Checking whether user is already registered and if he/she registered redirect user to dashboard
function checkBorrowerExists() {
    console.log("Function called");
    let data = {
        userEmail: document.getElementById('email').value,
        userPassword: document.getElementById('password').value
    }

    axios.post(baseUrlLocal+'/login',data, {headers: headers})
        .then(response => {
           
            console.log(response.data.info);
            console.log(response.data.info[0]);
            console.log(response.data.info[0].Email);
            if(response.data.success){    
                    let user_info = {
                        userData: response.data.info[0]
                      
                    }
                    console.log(user_info)
                    localStorage.setItem(USER_INFO, JSON.stringify(user_info));  
            if(data.userEmail == "admin@gmail.com"){
                window.location.href = "add_books.html";
            }
            else{
                window.location.href = "available_books.html";
            }
            }else{
                $.notify("Invalid login credentials","warn");
            }
        })
        .catch(error => {
            $.notify("Invalid login credentials","warn");
        
            console.log(error);
        })
}

function paypalIntegration() {
     window.location.href = "user_dashboard.html";
}

//Inserting the registration details of the user to the database
function getRegisterDetails() {
    let registerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        lno: document.getElementById('lno').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
        
    }   
    axios.post(baseUrlLocal + '/register/info/user/' + registerData.lno, registerData, {
            headers: headers
        })
    .then(response => {
        console.log(response);
        if(response.data.success){
            alert("Successfully Registered!");
            window.location.href="available_books.html";
            document.getElementById('firstName').value = "";
            document.getElementById('lastName').value = "";
            document.getElementById('lno').value = "";
            document.getElementById('address').value = "";
            document.getElementById('email').value = "";
            document.getElementById('password').value = "";
           
        }else{
            $.notify("User Cannot be Registered!","warn");
        }
    })
    .catch(error => {
        console.log(error);
    })

}

//Validating user credentials
function getUser() {
 console.log(localStorage.getItem(USER_INFO))
    let userInfo = localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : [];
    let email = userInfo.userData.Email;
    axios.get(baseUrlLocal+'/register/info/user/'+email)
    .then(response => {
        if (response.data.success) {
            let form_details = response.data.data;
            console.log(form_details[0]);
            console.log(form_details[0].FirstName);
            console.log(form_details.length);
            $('#first-name1').append(form_details[0].FirstName);
            $('#last-name').html(form_details[0].LastName);
            $('#email').html(form_details[0].Email);
            $('#lno').html(form_details[0].LicenseNumber);
            $('#lno1').html(form_details[0].LicenseNumber);
        }
    })
    .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(JSON.stringify(error));
          console.log(error.response.headers);
        }
    });
}

/***********  View Available Books For Rent ******************/
function loadAvailableBooksTable() {
    let i=0;
    axios.get(baseUrlLocal + '/book/info')
 .then(function (response) {
    console.log(response)
    console.log(response.data)
    html = ''
    response.data.forEach(request => {
    if(i % 5=== 0 || i === 0){
        html += '<div class="row" style="margin:10px;">';
    }
    i=i+1;
    html+='<div class="card" style="margin:10px;">'+'<a href="book_details.html#'+request.ISBN+'"title="">'+'<img id="thumb" style="width:250px;height:300px;display:inline-block;margin:10px;" src="./images/'+ request.ISBN +'.png"/>'+'</a>'+'<div class="container-fluid" style="width:250px; font-size:14px;">'+request.BookName+'<p style="font-size:12px;">'+'<b>'+"by "+request.Author+'</b>'+'</p>'+'</div>'+'</div>';
    if(i % 5 === 0 || i === 0){
        html += '</div>';
    }
    });
    $('#view-available-books').append(html);
 })
    .catch(function (error) {
        console.log(error);
    });
}

// Engineering Section

function loadAvailableBooksTableEngineering() {
    let i=0;
    axios.get(baseUrlLocal + '/book/info')
 .then(function (response) {
    console.log(response)
    console.log(response.data)
    html = ''
    response.data.forEach(request => {
    if(request.Category == "Engineering"){
    if(i % 5=== 0 || i === 0){
        html += '<div class="row" style="margin:10px;">';
    }
    i=i+1;
    html+='<div class="card" style="margin:10px;">'+'<a href="book_details.html#'+request.ISBN+'"title="">'+'<img id="thumb" style="width:250px;height:300px;display:inline-block;margin:10px;" src="./images/'+ request.ISBN +'.png"/>'+'</a>'+'<div class="container-fluid" style="width:250px; font-size:14px;">'+request.BookName+'<p style="font-size:12px;">'+'<b>'+"by "+request.Author+'</b>'+'</p>'+'</div>'+'</div>';
    if(i % 5 === 0 || i === 0){
        html += '</div>';
    }
}
    });
    $('#view-available-books').append(html);
 })
    .catch(function (error) {
        console.log(error);
    });
}

// ********** Rent the book************

function getBookDetails(){
        let isbn=''
        let form_details;
        if (CURRENT_URL.includes('#')) {
             isbn = CURRENT_URL.substr(CURRENT_URL.indexOf('#') + 1, CURRENT_URL.length);
            console.log(isbn);
        }
            axios.get(baseUrlLocal+'/book/info/'+isbn)
           .then((response) => {
        if (response.data.success) {
             form_details = response.data.data;
            console.log(response.data);           
            console.log(form_details[0]);         
            console.log(form_details[0].BookName); 
            console.log(form_details[0].PricePerDay); 
            $("#book-name").append(form_details[0].BookName);  
            $("#description").append(form_details[0].Description);  
            $("#price").append(form_details[0].PricePerDay);  
            $("#ISBN").append(form_details[0].ISBN);  
            $("#author").append(form_details[0].Author);  
            document.getElementById('image').src = "./images/" + form_details[0].ISBN + ".png";
            
           if(form_details[0].Rented)
             document.getElementById('pdf').href = "./images/" + form_details[0].ISBN + ".pdf";
        else
        document.getElementById('pdf').style = "display:none";
            
        }})        
}

function insertEachUserRent() {
    console.log('rent');
    let userInfo = localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : [];
    let email = userInfo.userData.Email;
    let rentData = {
        Email:email,
        ISBN: $("#ISBN").text(),
        BookName: $("#book-name").text(),
        Author: $("#author").text(),  
    };   
    axios.post(baseUrlLocal + '/rent/' + rentData.ISBN, rentData, {
            headers: headers
        })
    .then(response => {
        console.log(response);
        if(response.data.success){
          
        }else{
         console.log('error');
        }
    })
    .catch(error => {
        console.log("No Rented Books");
    })

}
/***********  View Available Books For Rent ******************/
function loadRentedBooksTable() {
    console.log('hello');
        let userInfo = localStorage.getItem(USER_INFO) ? JSON.parse(localStorage.getItem(USER_INFO)) : [];
        let email = userInfo.userData.Email;
        console.log(email+'hi');
        let i=0;
        axios.get(baseUrlLocal + '/rent/'+email)
        .then(response => {
            if (response.status == 200) {
                $('#view-rented-books-user').append(getRentedBookTable(i,response.data));
            }
        })
        .catch(err => {
            console.log("No Rented Books"+err);
        });
    }
    
    function getRentedBookTable(i,book) {
            let html ='' 
                book.forEach(request => {
                   if(i % 3=== 0 || i === 0){
                        html += '<div class="row" style="margin:10px;">';
                    }
                    i=i+1;
                    html+='<div class="card" style="margin:10px;">'+'<a href="./images/'+request.ISBN+'.pdf">'+'<img id="thumb" style="width:250px;height:300px;display:inline-block;margin:10px;" src="./images/'+ request.ISBN +'.png"/>'+'</a>'+'<div class="container-fluid" style="width:250px; font-size:14px;">'+request.BookName+'<p style="font-size:12px;">'+'<b>'+"by "+request.Author+'</b>'+'</p>'+'</div>'+'</div>';
                    if(i % 3 === 0 || i === 0){
                        html += '</div>';
                    }
            });
    return html;
}
// ******************* Add New Book***********************
function addNewBook() {
    let data = {
        ISBN : $("#isbn-b").val(),
        BookName: $("#b-name").val(),
        Author: $("#author-name").val(),
        PricePerDay: $("#ppday").val(),
        AvailableDate: null,
        RentedBy: null,
        Rented: 0,
        Description: $("#desc").val(),
        Category: $("#category-name").val()
       
    }
    console.log(data);
    if(data.ISBN.length != 0||data.BookName.length != 0||data.Author.length != 0||data.PricePerDay.length != 0||data.Description.length != 0||data.Category.length!=0){
    axios.post(baseUrlLocal+'/book',data, {headers: headers})
    .then(response => {
        if (response.data.success) {
        $.notify("New Book is Added to your Library", "success");
        $("#isbn-b").val(''),
        $("#b-name").val(''),
        $("#author-name").val(''),
        $("#ppday").val(''),
        $("#desc").val(''),
        $("#category-name").val('')
    }
        })
        .catch(function (error) {
            $.notify("Please check all the details","warn");
        });
    }
    else{
        $.notify("Please check all the details","warn");
    }
    
}
    $('#frmUploader').submit(function(){
       
        $.ajax({
            url:'/book/api/Upload/',
            type:'post',
            data:$('#frmUploader').serialize(),
            success:function(){
               $.notify("Book Uploaded");

            },
        });
    });
