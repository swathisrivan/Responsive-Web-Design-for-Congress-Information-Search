//declaration of global variables for favorite storage
var fav_committees = [];
var fav_legis      = [];
var fav_bills      = [];

//initializing global variables from local storage
if(JSON.parse(localStorage.getItem("favorite_committees")))
{
    fav_committees = JSON.parse(localStorage.getItem("favorite_committees"));
}
else
{
    fav_committees = [];
}
if(JSON.parse(localStorage.getItem("favorite_legis")))
{
    fav_legis = JSON.parse(localStorage.getItem("favorite_legis"));
}
else
{
    fav_legis = [];
}
if(JSON.parse(localStorage.getItem("favorite_bills")))
{
    fav_bills = JSON.parse(localStorage.getItem("favorite_bills"));
}
else
{
    fav_bills = [];
}

//CongressApp on ready initializations 
var app =  angular.module('CongressApp', ['angularUtils.directives.dirPagination', 'ui.bootstrap', 'angular.filter']);
$(document).ready(function(){ 
        $("#side-tabs a").click(function(e)
        {
    	   e.preventDefault();
    	   $(this).tab('show');
        });
});

//Controller to handle legislator requests
app.controller('LegisCtrl', function($scope, $http) 
{   
    $("#legis-state-tabs a").click(function(e)
    {
    	   e.preventDefault();
    	   $(this).tab('show');
    });
    $http({
	    url: "index.php",
		method: "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({branch:"legislators"})
	}).success(function(data, status, headers, config) 
    {
        $scope.entries = data.results;
        var all        = $scope.entries;
        var house_all  = [];
        var senate_all = [];
        var flag       = 0;
        for(var i = 0; i < all.length; i++)
        {
            flag = 0;
            for(var j = 0; j < fav_legis.length; j++)
            {
                if(fav_legis[j].last_name == all[i].last_name)
                {
                    flag = 1;
                    all[i].fav = "fa fa-star";
                    break;
                }
            }
            if(!flag)
            {
                all[i].fav = "fa fa-star-o";
            }
            if(all[i].chamber == "house")
            {
                house_all.push(all[i]);
            }
            else
            {
                senate_all.push(all[i]);
            }
        }
        $scope.house_all  = house_all;
        $scope.senate_all = senate_all;

	}).error(function(data, status, headers, config) {
		$scope.status = status;
    });
    
    //Custom filter - filter based on the state selected
    $scope.customFilter = function (data) 
    {
        if(!$scope.selectState)
        {
            return true;
        }
        else if (data.state_name === $scope.selectState.state_name) 
        {
            return true;
        } 
        else 
        {
            return false;
        }
    };
    
    //function to get committee and bill details in legislators
    $scope.getLegisDetails = function(entry)
    {
      $http({
            url: "index.php",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({branch: "legis_committees", members: entry.bioguide_id})
        }).success(function(data, status, headers, config) {
            $scope.committees = data["results"];
        }).error(function(data, status, headers, config) {
            $scope.status = status;
        });
       $http({
            url: "index.php",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({branch: "legis_bills", sponsor: entry.bioguide_id})
        }).success(function(data, status, headers, config) {
            $scope.bills = data["results"];
        }).error(function(data, status, headers, config) {
            $scope.status = status;
        }); 
    
        
      //code to calculate the value of progress bar
      $scope.entry            = entry;
      $scope.entry.term_start = new Date(entry.term_start);
      $scope.entry.term_end   = new Date(entry.term_end);
      $scope.entry.birthday   = new Date(entry.birthday);  
      $scope.img_path         = "https://theunitedstates.io/images/congress/original/" + entry.bioguide_id + ".jpg";
    
    
      $scope.curr    = Date.parse(new Date());
      $scope.st      = Date.parse(entry.term_start);
      $scope.en      = Date.parse(entry.term_end);
      $scope.dynamic = ((($scope.curr - $scope.st)/($scope.en - $scope.st)))*100;
      $scope.dynamic = Math.floor($scope.dynamic);
      
    };
    
    //function handler when favorite icon is clicked
    $scope.legis_fav = function(legis)
    {
        
        if(legis.fav == "fa fa-star-o")
        {
            legis.fav = "fa fa-star";
            legis.img_path = "https://theunitedstates.io/images/congress/original/" + legis.bioguide_id + ".jpg";
            fav_legis.push(legis);
            localStorage.setItem("favorite_legis", JSON.stringify(fav_legis));
        }
        else
        {
            legis.fav = "fa fa-star-o";//when fav icon is disabled
            legis.img_path = "https://theunitedstates.io/images/congress/original/" + legis.bioguide_id + ".jpg";
            fav_legis.splice(fav_legis.indexOf(legis), 1);
            localStorage.setItem("favorite_legis", JSON.stringify(fav_legis));   
        }
    }    
});

//Controller to handle bills requests
app.controller('BillsCtrl', function($scope, $http) 
{
    $("#bills-tabs a").click(function(e)
    {
    	   e.preventDefault();
    	   $(this).tab('show');
    });
    $http({
	    url: "index.php",
		method: "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({branch: "active_bills"})
	}).success(function(data, status, headers, config) {
		$scope.active_bills = data["results"];
        var flag = 0;
        for(var i = 0; i < $scope.active_bills.length; i++)
        {
            flag = 0;
            for(var j = 0; j < fav_bills.length; j++)
            {
                if(fav_bills[j].bill_id == $scope.active_bills[i].bill_id)
                {
                    flag = 1;
                    $scope.active_bills[i].fav = "fa fa-star";
                    break;
                }
            }
            if(!flag)
            {
               $scope.active_bills[i].fav = "fa fa-star-o";
            }    
        }
	}).error(function(data, status, headers, config) {
		$scope.status = status;
    });
    
    $http({
	    url: "index.php",
		method: "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({branch: "new_bills"})
	}).success(function(data, status, headers, config) {
		$scope.new_bills = data["results"];
        var flag = 0;
        for(var i = 0; i < $scope.new_bills.length; i++)
        {
            flag = 0;
            for(var j = 0; j < fav_bills.length; j++)
            {
                if(fav_bills[j].bill_id == $scope.new_bills[i].bill_id)
                {
                    flag = 1;
                    $scope.new_bills[i].fav = "fa fa-star";
                    break;
                }
            }
            if(!flag)
            {
               $scope.new_bills[i].fav = "fa fa-star-o";
            }    
        }
	}).error(function(data, status, headers, config) {
		$scope.status = status;
    });
    
    //function to get the individual bill details
    $scope.getBillDetails = function(bill) 
    {
        $scope.bill_inst = bill;
        $scope.introduced_on = new Date(bill.introduced_on);
        
    } 
    
    //function handler for bill favorites
    $scope.bill_fav = function(bill)
    {
        
        if(bill.fav == "fa fa-star-o")
        {
            bill.fav = "fa fa-star";
            fav_bills.push(bill);
            localStorage.setItem("favorite_bills", JSON.stringify(fav_bills));
        }
        else
        {
            bill.fav = "fa fa-star-o";//when fav icon is disabled
            fav_bills.splice(fav_bills.indexOf(bill), 1);
            localStorage.setItem("favorite_bills", JSON.stringify(fav_bills));   
        }
    }    
});

//Controller to handle Committees requests
app.controller('CommCtrl', function($scope, $http) 
{
     $("#committee-tabs-c a").click(function(e)
     {
    	   e.preventDefault();
    	   $(this).tab('show');
     });
    
     $http({
        url: "index.php",
		method: "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({branch: "committees"})
	}).success(function(data, status, headers, config) {
        $scope.entries_c = data.results;
        var all_c        = $scope.entries_c;
        var joint_c      = [];
        var house_all_c  = [];
        var senate_all_c = [];
        var flag         = 0;
        for(var i = 0; i < all_c.length; i++)
        {
            flag = 0;
            for(var j = 0; j < fav_committees.length; j++)
            {
                if(fav_committees[j].committee_id == all_c[i].committee_id)
                {
                    flag = 1;
                    all_c[i].fav = "fa fa-star";
                    break;
                }
            }
            if(!flag)
            {
                all_c[i].fav = "fa fa-star-o";
            }
            
            if(all_c[i].chamber == "house")
            {
                house_all_c.push(all_c[i]);
            }
            else if(all_c[i].chamber == "senate")
            {
                senate_all_c.push(all_c[i]);
            }
            else
            {
                joint_c.push(all_c[i]);
            }
        }
        $scope.house_all_c  = house_all_c;
        $scope.senate_all_c = senate_all_c;
        $scope.joint_c      = joint_c;
         
	}).error(function(data, status, headers, config) {
		$scope.status = status;
        
    });
    
    //function handler for committees favorites
    $scope.comm_fav = function(comm)
    {
        
        if(comm.fav == "fa fa-star-o")//when fav icon is enabled
        {
            comm.fav = "fa fa-star";
            fav_committees.push(comm);
            localStorage.setItem("favorite_committees", JSON.stringify(fav_committees));
        }
        else
        {
            comm.fav = "fa fa-star-o";//when fav icon is disabled
            fav_committees.splice(fav_committees.indexOf(comm), 1);
            localStorage.setItem("favorite_committees", JSON.stringify(fav_committees));
            
        }
    }
});

//Controller to handle favorite requests
app.controller('FavCtrl', function($scope, $http) 
{
    //to load the individual favorites value form the global variables
    $scope.fav_comms = fav_committees;
    $scope.fav_bills = fav_bills;
    $scope.fav_legis = fav_legis;
    
    $("#fav-tabs a").click(function(e)
    { 
            $scope.fav_comms = fav_committees;
            $scope.fav_bills = fav_bills;
            $scope.fav_legis = fav_legis;
    	   e.preventDefault();
    	   $(this).tab('show');    
    });
    
    //getLegisDetails from legislators
    $scope.getLegisDetails = function(entry){
      $http({
            url: "index.php",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({branch: "legis_committees", members: entry.bioguide_id})
        }).success(function(data, status, headers, config) {
            $scope.committees = data["results"];
        }).error(function(data, status, headers, config) {
            $scope.status = status;
        });
     $http({
            url: "index.php",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({branch: "legis_bills", sponsor: entry.bioguide_id})
        }).success(function(data, status, headers, config) {
            $scope.bills = data["results"];
        }).error(function(data, status, headers, config) {
            $scope.status = status;
        }); 
    
      $scope.entry = entry;
      $scope.entry.term_start = new Date(entry.term_start);
      $scope.entry.term_end = new Date(entry.term_end);
      $scope.entry.birthday = new Date(entry.birthday);
      $scope.img_path = "https://theunitedstates.io/images/congress/original/" + entry.bioguide_id + ".jpg";
      $scope.curr = Date.parse(new Date());
      $scope.st   = Date.parse(entry.term_start);
      $scope.en   = Date.parse(entry.term_end);
      $scope.dynamic = ((($scope.curr - $scope.st)/($scope.en - $scope.st)))*100;
      $scope.dynamic = Math.floor($scope.dynamic);
      
    };
    
    //function handler for legislators when favorite icon is clicked
    $scope.legis_fav = function(legis)
    {
        
        if(legis.fav == "fa fa-star-o")
        {
            legis.fav = "fa fa-star";
            legis.img_path = "https://theunitedstates.io/images/congress/original/" + legis.bioguide_id + ".jpg";
            fav_legis.push(legis);
            localStorage.setItem("favorite_legis", JSON.stringify(fav_legis));
        }
        else
        {
            legis.fav = "fa fa-star-o";
            legis.img_path = "https://theunitedstates.io/images/congress/original/" + legis.bioguide_id + ".jpg";
            fav_legis.splice(fav_legis.indexOf(legis), 1);
            localStorage.setItem("favorite_legis", JSON.stringify(fav_legis));   
        }
    }    
    
    //function to get the favorite bill details
    $scope.getBillDetails = function(bill) 
    {
        $scope.bill_inst = bill;
        $scope.introduced_on = new Date(bill.introduced_on);
        
    } 
    
    //fucntion handler for bills when the favorite icon is clicked
    $scope.bill_fav = function(bill)
    {
        
        if(bill.fav == "fa fa-star-o")//when fav icon is enabled
        {
            bill.fav = "fa fa-star";
            fav_bills.push(bill);
            localStorage.setItem("favorite_bills", JSON.stringify(fav_bills));
        }
        else
        {
            bill.fav = "fa fa-star-o";//when fav icon is disabled
            fav_bills.splice(fav_bills.indexOf(bill), 1);
            localStorage.setItem("favorite_bills", JSON.stringify(fav_bills));   
        }
    }    
    
    //function to delete a committee from the favorites list
    $scope.del_comm_fav = function(comm)
    {
        
        comm.fav = "fa fa-star-o";
        fav_committees.splice(fav_committees.indexOf(comm), 1);
        localStorage.setItem("favorite_committees", JSON.stringify(fav_committees));
        
    }
    
    //fucntion to delete a bill from the favorites list
    $scope.del_bill_fav = function(bill)
    {
        
        bill.fav = "fa fa-star-o";
        fav_bills.splice(fav_bills.indexOf(bill), 1);
        localStorage.setItem("favorite_bills", JSON.stringify(fav_bills));
        
    }
    
    //fucntion to delete a legislator fromt the favorites list
    $scope.del_legis_fav = function(legis)
    {
        
        legis.fav = "fa fa-star-o";
        fav_legis.splice(fav_legis.indexOf(legis), 1);
        localStorage.setItem("favorite_legis", JSON.stringify(fav_legis));
        
    }  
    
});
