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
               showAngels();
               showProjects();     
               calculateMaxGrant(); 
   },
   function (errorObject) {
        console.log("The read failed: " + errorObject.code);
   }
);

function initiateBalance(){
  for (var project=0; project<projects.length; project++){
    balance[project] = {"projectId": project, "balance":0};
  }
    for (var angel=0; angel<angels.length; angel++){
    angelsBalance[angel] = limit;
  }
}

function showProjects(){
    $('#rankedProjects').append('<div class="backgroundLines" id="lines'+ project + '"/>');
       for (var i=0; i<13; i++){
         $('#lines' + project).append('<div class="theLines"/>');
       }
    for (var project=0; project<projects.length; project++){  
        $('#rankedProjects').append('<div class="projectDisp clearfix" id="project'+ project + '"/>');
        $('#project' + project).append('<div class="grantAmount" id="grantAmount' + project + '"/>');
        $('#grantAmount' + project).append('<div class="grantAmountSum" id="grantAmountSum' + project + '"/>');
        $('#project' + project).append('<div class="projectNames" id="projectName' + project + '"/>');
        $('#projectName' + project).append('<div class="projectTytle" id="projectTytle' + project + '">' + projects[project].name + '</div>');               
        $('#project' + project).append('<div class="grantsBar" id="grantsBar' + project + '"/></div>');  
        for (var angel=0; angel < angels.length; angel++){
            $('#grantsBar' + project).append('<div class="grantMark" id="grantMarkProject' + project + 'Angel' + angel + '"/>');  
        }
        $('#project' + project).append('<div class="projectSum" id="projectSum' + project + '"> $' + balance[project].balance + '</div></div>');
        $('#rankedProjects').append('<div class="backgroundLines" id="lines'+ project + '"/>');
        for (var i=0; i<13; i++){
           $('#lines' + project).append('<div class="theLines"/>');
        }
    }
    if (projects.length>9){
      $('.projectTytle').css({
        "font-size" : "15px",
        "padding-top" : "1.5%",
      })
      $('.projectNames').css({
        "height":"4.75%",
      })
      $('.grantsBar').css({
        "height":"5.25%"
      })
      $('.grantAmountSum').css({
        "padding-top": "2.3%"
      })
      $('.projectSum').css({
        "padding-top": "0%"
      })
    }
}

function showAngels(){
  for (var angelId=0; angelId<angels.length; angelId++){
    $('#theAngels').append('<div class = "angels" id="angel' + angelId +'">');
    $('#angel' + angelId).append('<img class="angelImage" id="angelImage' + angelId + '" src="angel' +angelId + '.PNG"/>');
  //$('#angel' + angelId).append('<img class="angelImage" id="angelImage' + angelId + '" src='+angels[angelId].pictureUrl +'/>');
    $('#angelImage' + angelId).css({"border-color" : angels[angelId].color});
    $('#angel' + angelId).append('<div class="names" id="angelFirstName' + angelId + '">' + angels[angelId].firstName +'</div>');
    $('#angel' + angelId).append('<div class="names" id="angelLasttName' + angelId + '">' + angels[angelId].lastName +'</div></div>');
  }
}

function calculateMaxGrant(){
  rankProjects();
  totalMax = balance[balance.length].balance + 5000;
  initiateBalance();
}

function rankProjects(){
  calculateProjectsBalance();
  balance.sort(function (a, b){
    if (a.balance > b.balance){
      return 1;
    }
    else return -1;
  })
}

function calculateProjectsBalance(){
  for (var projectId=0; projectId<projects.length; projectId++){
    balance[projectId].balance = 0;
      for (var grantId=0; grantId<angels.length; grantId++){ 
           balance[projectId].balance += projects[projectId].grantsDist[grantId].sum;
      }
   }
}

function showNextGrant(){
  if (angelProject.lastProject < projects.length){
    showNextAngelGrant(angelProject.lastProject, angelProject.lastAngel);
    angelProject.lastProject +=1;
  }
  else {
    $('#angelImage' + angelProject.lastAngel).css({
          	"width" :"70px",
	          "height" : "70px",
            "margin-top" : "0",
            "margin" : "3px",
        //    "border" : "3px solid " + angels[angelProject.lastAngel].color,
        })
    for (var projectId=0; projectId < projects.length; projectId++){
      $('#grantAmountSum' + projectId).text('');
    }
    angelProject.lastAngel +=1;
    angelProject.lastProject = 0;    
    showNextAngelGrant(angelProject.lastProject, angelProject.lastAngel);
    angelProject.lastProject +=1;
  }
}

function showNextAngelGrant(projectId,angel){
    for (var grantId=0; grantId<projects[projectId].grantsDist.length; grantId++){
      if (projects[projectId].grantsDist[grantId].angelId == angel){
        var grant = projects[projectId].grantsDist[grantId];
        var percentage = grant.sum*100/totalMax;
        $('#angelImage' + angel).css({
          	"width" :"120px",
	          "height" : "120px",
            "margin-top": "-35%",
         //   "border" : "5px solid " + angels[angel].color,
        })
        $('#grantMarkProject' + projectId + 'Angel' + angel).css({
            "width" : percentage + "%",
            "background-color" : angels[angel].color,
          });
       var sum = grant.sum;
       $('#grantAmountSum' + projectId).text('$' + numberWithCommas(sum));
       $('#grantAmountSum' + projectId).css({
         "color" : angels[angel].color
       });
        var oldBalance = balance[projectId].balance; 
        console.log('old balance = ' + oldBalance);
        var newBalance = oldBalance + grant.sum;
        console.log('new balance = ' + newBalance);
        balance[projectId].balance = newBalance;
        $('#projectSum' + projectId).text('$' + numberWithCommas(newBalance));
        
      }
    }  
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function showWinners(){
  window.location.assign("podium.html");
}
