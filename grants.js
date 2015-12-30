var limit = 200000; 
var totalMax;
var angelProject = {"lastAngel": 0, "lastProject":0};
var ref = new Firebase("https://searsangels.firebaseio.com/projects");
var url = new Firebase("https://searsangels.firebaseio.com");
var angels;
var projects;
var grantsDist = {balance:limit, grants:[]};
var angel=0;

url.once("value", function(snapshot) {
               console.log(snapshot.val());
               angels = snapshot.val().angels;
               projects = snapshot.val().projects;
               initiateGrantsDist();
               createProjectsForm();
               
   },
   function (errorObject) {
        console.log("The read failed: " + errorObject.code);
   }
);


function submit(){
      console.log('"send" clicked');
      for (var project=0; project<projects.length; project++){
        console.log('project:' + project);
        var updateUrl = ref + '/' + project + '/grantsDist/' + angel;
        console.log('angelId=' + angel);
        var updateGrants = new Firebase(updateUrl);
        var onComplete = function(error) {
          if (error) {
               console.log('Synchronization failed');

          } else {
             console.log('Synchronization succeeded');
         }
        };
        updateGrants.update({angelId:angel, sum:parseInt(grantsDist.grants[project].sum)}, onComplete);
      } 
      //alert('Granted!');
      //titlelessalert("Granted!");
      window.location.href = '../../thankYou.html';
}    

function titlelessalert(message){
  var iframe = document.createElement("IFRAME");
      iframe.setAttribute("src", 'data:text/plain,');
      document.documentElement.appendChild(iframe);
      window.frames[0].window.alert(message);
      iframe.parentNode.removeChild(iframe);   
}
 

function initiateGrantsDist(){
  for (var project=0; project<projects.length; project++){
    grantsDist.grants[project] = {projectId: project, sum:0};
  }
}

function createProjectsForm(){
  $('#grants_form').append('<form name="grantsInvoker" id="grantsInvoker" action="">');
  for (var project=0; project<projects.length; project++){
    $('#grantsInvoker').append('<div class="projectsNames centered" id="theProjectName'+project+'">'+projects[project].name+'</div>');
    $('#grantsInvoker').append('<div class="grants clearfix" id="grantsArea'+project+'">');
         $('#grantsArea' + project).append('<img class="minus" id="minus'+project+'" onclick="minus('+project+')" src="http://i60.tinypic.com/2mwif7n.png"/>');
         $('#grantsArea' + project).append('<div class="numbers" id="numbers'+project+'">');
                $('#numbers' + project).append('<input type="number" name="grant'+project+'" id="grant'+project+'" max="'+grantsDist.balance+'" class="text-input" onchange="updateBalance('+project+',1)"/></div>');
         $('#grantsArea' + project).append('<img class="plus" id="plus'+project+'" onclick="plus('+project+')"  src="http://i61.tinypic.com/1z384jo.png"/></div>');
  }
  $('#grants_form').append('<button type="submit" name="submit" class="button" id="submit_btn" value="Send" onclick="submit()">Grant!</button></form>');
  $('.balance').append('<div class="remainSum clearfix">');
     $('.remainSum').append('<div class="coins" id="coins1">');
       $('#coins1').append('<img class="imgCoins" src="http://i59.tinypic.com/2q3r90z.png"/></div></div>');
     $('.remainSum').append('<div id="sum2" id="sum">$'+ numberWithCommas(grantsDist.balance) +'</div>');
     $('.remainSum').append('<div class="coins" id="coins2">');
       $('#coins2').append('<img class="imgCoins" src="http://i59.tinypic.com/2q3r90z.png"/></div></div>');
  
}

function updateBalance(project,needVerification){
    var grant = document.getElementById("grant"+project).value;
    console.log('grant=' +grant);
    var projectName = projects[project].name
    if (grant > grantsDist.balance && needVerification==1){
      titlelessalert('Please don`t exceed your budget ($200K)');
       $('#grant' + project).val(0);
    }
    else{
      grantsDist.grants[project] = {name : projectName, sum : grant};
      grantsDist.balance = limit;
      for(var grantId=0; grantId<grantsDist.grants.length; grantId++){
        var sum = parseInt(grantsDist.grants[grantId].sum);
        grantsDist.balance -=  sum;
      }
      for (var projectId=project+1; projectId<projects.length; projectId++){
         $('#grant' + projectId).attr("max", grantsDist.balance);
      }
      $('#sum2').text('$'+numberWithCommas(grantsDist.balance));
    }
}

function minus(project){
  var grant = 0;
  if ($("#grant"+project).val() > 0){
    grant = $("#grant"+project).val();
  }
  if (grant-5000 >= 0){
      $('#grant'+project).val(grant-5000);
      updateBalance(project,0);
  }
  else{
   // alert("Please choose a positive sum");
  }
}

function plus(project){
  var grant = 0;
  if ($("#grant"+project).val() > 0){
    grant = $("#grant"+project).val();
  }
  var newGrant = parseInt(grant)+5000;
  console.log('grantsDist.balance=' +grantsDist.balance);
   if (grantsDist.balance - 5000 >= 0){  
    $('#grant'+project).val(newGrant);
    console.log('newGrant' +newGrant);
    updateBalance(project,0);
    }
    else{
 //   alert('Please choose a lower amount to grant');
    }
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

var QueryString = function () {

  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
      query_string[pair[0]] = parseInt(decodeURIComponent(pair[1]));
  } 
    angel = query_string.angelId;
}();
