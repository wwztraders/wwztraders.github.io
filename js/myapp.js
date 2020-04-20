var currentDocId = '';
(()=>{
  $('#errorMsg').hide();
  $('#successMsg').hide();
  $('#dangerMsg').hide();
  $('#detailsContainer').hide();
  
})();

const showModal = (docId) => {
  $('#changeModal').modal();
  currentDocId = docId;
}

const isArrived = () =>{
  let docRef = db.collection("shipments").doc(currentDocId);
  docRef.set({
    arrivalDate:moment().format('LLLL')
  },{
    merge:true
  }).then(()=>{
    getAllData();
  $('#changeModal').modal('hide');
  })
}

const changeStatus = () => {
  let docRef = db.collection("shipments").doc(currentDocId);
  docRef.set({
    status:$('#statusDrpDwn').val()
  },{
    merge:true
  }).then(()=>{
    getAllData();
  $('#changeModal').modal('hide');
  })
  

}

const searchCons = () => {
  let toBeSearch = $('#consSearch').val();

  db.collection("shipments").where('consName','==',toBeSearch.trim())
  .get()
  .then(function(querySnapshot) {
    $('#detailsContainer').show();
    let html = '';
      querySnapshot.forEach(function(doc) {
          html+=`<tr>
          <td>${doc.data().departureDate}</td>
          <td>${doc.data().consName}</td>
          <td>${doc.data().address}</td>
          <td>${doc.id}</td>
          <td>${doc.data().name}</td>
          <td><span class="badge badge-info" style="cursor:pointer;" onclick="showModal('${doc.id}')">${doc.data().status}</span></td>
          <td>${doc.data().details}</td>
          </tr>`
          $('#detailsContainer').html( `Consignment # <span>${doc.data().consName}</span>
          <table>
            <tr>
              <td><b>Origin City</b></td>
              <td>${doc.data().oCity}</td>
            </tr>
            <tr>
              <td><b>Origin Country</b></td>
              <td>${doc.data().oCountry}</td>
            </tr>
            <tr>
              <td><b>Destination City</b></td>
              <td>${doc.data().dCity}</td>
            </tr>
            <tr>
              <td><b>Zip Code</b></td>
              <td>${doc.data().zCode}</td>
            </tr>
            <tr>
              <td><b>Destination Country</b></td>
              <td>${doc.data().dCountry}</td>
            </tr>
            <tr>
              <td><b>PCS</b></td>
              <td>${doc.data().PCS}</td>
            </tr>
          </table>`);
      });
      
        
      $('#shipments').html(html);
      
});
}

const getAllData = ()=>{
  db.collection("shipments")
  .get()
  .then(function(querySnapshot) {
    let html = '';
      querySnapshot.forEach(function(doc) {
          html+=`<tr>
          <td>${doc.data().departureDate}</td>
          <td>${doc.data().consName}</td>
          <td>${doc.data().address}</td>
          <td>${doc.id}</td>
          <td>${doc.data().name}</td>
          <td><span class="badge badge-info" style="cursor:pointer;" onclick="showModal('${doc.id}')">${doc.data().status}</span></td>
          <td>${doc.data().details}</td>
          </tr>`
          
      });

      $('#shipments').html(html);
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
}

var firebaseConfig = {
    apiKey: "AIzaSyAoUeB_mJJx0sAeJPSsnUb_fX6o8ruIs-Q",
    authDomain: "wwztraders.firebaseapp.com",
    databaseURL: "https://wwztraders.firebaseio.com",
    projectId: "wwztraders",
    storageBucket: "wwztraders.appspot.com",
    messagingSenderId: "287314611467",
    appId: "1:287314611467:web:65dc50b72279584fcde60e",
    measurementId: "G-XPBB6GS6PY"
  };
  // Initialize Firebase
  var defaultProject = firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  getAllData();


  

const changeBtnStyle = (id,text)=>{
  let btn = $('#'+id);
  $('#'+id).html(text)
  $('#'+id).attr('disabled',true)
}


const revertBtnStyle = (id,revertedText)=>{
  let btn = $('#'+id);
  $('#'+id).html(revertedText)
  $('#'+id).attr('disabled',false)
}
$('#btnSave').click(()=>{
  changeBtnStyle('btnSave','Saving...');
  let docName = 'WWZ-'+new Date().getDate()
  +new Date().getUTCMonth()
  +new Date().getUTCFullYear()
  +new Date().getMilliseconds();
    db.collection("shipments")
    .doc(docName).set({
    name: $('#name').val(),
    phone: $('#number').val(),
    details:$('#details').val(),
    address:$('#address').val(),
    departureDate:moment().format('LLLL'),
    arrivalDate:'',
    status:'Initiated',
    consName:$('#consName').val(),
    oCity:$('#oCity').val(),
    oCountry:$('#oCountry').val(),
    dCity:$('#dCity').val(),
    zCode:$('#zCode').val(),
    dCountry:$('#dCountry').val(),
    PCS:$('#pcs').val()
})
.then(function() {
    revertBtnStyle('btnSave','Save');
    $('#trackingNumber').html(docName);
    $('#successMsg').show();
    
})
.catch(function(error) {
  revertBtnStyle('btnSave','Save');
  $('#errorMsg').show();
    setTimeout(()=>{
      $('#errorMsg').hide();

    },3000)
    console.error("Error writing document: ", error);
});
  
})


  

$('#btnTrack').click(()=>{
  

  
  //console.log()
  if($('#searchNumber').val().trim() === ""){
    return;
  }
  changeBtnStyle('btnTrack','Tracking...')
  let docRef = db.collection('shipments').doc($('#searchNumber').val().trim())
  docRef.get().then(function(doc) {
    if (doc.exists) {
      revertBtnStyle('btnTrack','Track')
      $('#exampleModal').modal();
        let html = `<div class="alert alert-success">
        Dear <strong>${doc.data().name}</strong>, Your parcel has been submitted successfully.We will get back to you soon.
      </div>
      <div class="card">
        <div class="card-header">
          Tracking No.  ${$('#searchNumber').val()}<h6 class="badge badge-info float-right">${doc.data().status}</h6>
        </div>
       

        <div class="card-body">
    
          <p class="card-text">
            <div class="row">
              
              <div class="col-md-6">
              <h6>Departure date and time </h6><span><p>${doc.data().departureDate}</p></span>
              </div>
              <div class="col-md-6">
              <h6>Arrival date and time </h6><span><p>${doc.data().arrivalDate == ""?"---":doc.data().arrivalDate}</p></span>
              </div>
            </div>
          </p>

          <div class="row">
          <div class="col-md-6">
                <h6>Customer name </h6><span><p>${doc.data().name}</p></span>
              </div>
              <div class="col-md-6">
                <h6>Phone </h6><span><p>${doc.data().phone}</p></span>
              </div>
              
            </div>

            <div class="row">
            <div class="col">
              <h6>Location </h6><span><p>${doc.data().address}</p></span>
              </div>
            </div>
            <div class="row">
           
            </div>
        </div>
      </div>`;
      $('#trackBody').html(html);
      $('#exampleModal').modal();
    } else {
        // doc.data() will be undefined in this case
        $('#dangerMsg').show();
        revertBtnStyle('btnTrack','Track')
    }
}).catch(function(error) {
  revertBtnStyle('btnTrack','Track')
    console.log("Error getting document:", error);
});
})