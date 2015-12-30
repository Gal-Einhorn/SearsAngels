var limit = 200000; 
var totalMax;
var angelProject = {"lastAngel": 0, "lastProject":0};
var dataBsae = "https://searsangels.firebaseio.com/";
var ref = new Firebase(dataBsae);
var angels;
var projects;
var angelsBalance = [];
var balance = [];

// Attach an asynchronous callback to read the data at our posts reference
ref.once("value", function(snapshot) {
               console.log(snapshot.val());
               angels = snapshot.val().angels;
               projects = snapshot.val().projects;
               initiateBalance();
               rankProjects();
               console.log('balance:');
               console.dir(balance);
   },
   function (errorObject) {
        console.log("The read failed: " + errorObject.code);
   }
);

function initiateBalance(){
  for (var project=0; project<projects.length; project++){
    balance[project] = {projectId: project, balance:0};
  }
}

function rankProjects(){
  calculateProjectsBalance();
  balance.sort(function (a, b){
    if (a.balance > b.balance){
      return 1;
    }
    else return -1;
  })
  for (var place=3; place >0; place--){
    var project = balance[projects.length-place].projectId;
    var sum = '$' + numberWithCommas(balance[projects.length-place].balance) + 'K';
    $('body').append('<div id="project' + place +'" class="place">');
    $('#project' + place).append('<div id="placeName' + place +'" class="placeName">' + projects[project].name +'</div>');
    console.log('name:' + projects[project].name);
    $('#project'+place).append('<div id="placeSum' + place +'" class="placeSUm">'+sum +'</div></div>');
    console.log('sum:' + sum);
  }
  
}

function calculateProjectsBalance(){
  for (var projectId=0; projectId<projects.length; projectId++){
    balance[projectId].balance = 0;
      for (var grantId=0; grantId<angels.length; grantId++){ 
           balance[projectId].balance += projects[projectId].grantsDist[grantId].sum;
      }
   }
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1");
    return x;
}

