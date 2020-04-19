
(()=>{
  $('#errorMsg').hide();
  $('#successMsg').hide();
  $('#dangerMsg').hide();
})();

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
    date:new Date(),
})
.then(function() {
    revertBtnStyle('btnSave','Save');
    $('#successMsg').show();
    setTimeout(()=>{
      $('#successMsg').hide();

    },3000)
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
  

  changeBtnStyle('btnTrack','Tracking...')
  //console.log()
  if($('#searchNumber').val().trim() === ""){
    return;
  }
  
  let docRef = db.collection('shipments').doc($('#searchNumber').val())
  docRef.get().then(function(doc) {
    if (doc.exists) {
      revertBtnStyle('btnTrack')
      $('#exampleModal').modal();
        let html = `<div class="alert alert-success">
        Dear <strong>${doc.data().name}</strong>, Your parcel has been submitted successfully.We will get back to you soon.
      </div>
      <div class="card">
        <div class="card-header">
          Tracking No# ${$('#searchNumber').val()}
        </div>
        <div class="card-body">
          <h5 class="card-title">Date : </h5>
          <p class="card-text">
             ${doc.data().date}
          </p>
          <h5 class="card-title">Customer Name : </h5>
          <p class="card-text">
          ${doc.data().name}
          </p>

          <h5 class="card-title">Phone No. : </h5>
          <p class="card-text">
          ${doc.data().phone}
          </p>              
          <h5 class="card-title">Address : </h5>
          <p class="card-text">
          ${doc.data().address}
          </p>
          <h5 class="card-title">Details : </h5>
          <p class="card-text">
          ${doc.data().details}
          </p>
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