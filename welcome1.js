
var dataBsae = "https://searsangels.firebaseio.com/";
var ref = new Firebase(dataBsae);
var angels;

// Attach an asynchronous callback to read the data at our posts reference
ref.once("value", function(snapshot) {
               console.log(snapshot.val());
               angels = snapshot.val().angels;
               showAngels();
   },
   function (errorObject) {
        console.log("The read failed: " + errorObject.code);
   }
);

function showAngels(){
  for (var angelId=0; angelId<angels.length; angelId++){
    $('#theAngels').append('<div class = "angels" id="angel' + angelId +'">');
    $('#angel' + angelId).append('<img class="angelImage" id="angelImage' + angelId + '" src="'+angels[angelId].pictureUrl+'" onclick="openVotingPage('+angelId+')"/>');
    $('#angelImage' + angelId).css({"border-color" : angels[angelId].color});
    $('#angel' + angelId).append('<div class="names" id="angelFirstName' + angelId + '">' + angels[angelId].firstName +' '+angels[angelId].lastName+'</div>');
  }
}

function openVotingPage(angelId){
  window.location.href = '../../grants.html?angelId=' + angelId;
}
