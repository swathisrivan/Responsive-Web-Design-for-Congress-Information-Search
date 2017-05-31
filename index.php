<?php
    header('Content-Type: application/json');
    date_default_timezone_set("America/Los_Angeles");
        $arrContextOptions = array(
        "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
        ),
        ); 
    if($_POST["branch"] == "committees")
    {
        $url      = "https://congress.api.sunlightfoundation.com/committees?per_page=all&apikey=bcde5dabc6234180953144b6300ab8d2";
        $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
        if($response == FALSE)
        {
             $url      = "http://104.198.0.197:8080/committees?per_page=all&apikey=bcde5dabc6234180953144b6300ab8d2";
             $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
             if($response == FALSE)
             {
                 $url      = "comm.json";
                 $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
                 echo $response;
             }
             else
             {
                echo $response;
             }
        }
        else
        {
            echo $response;
        }
    }
    if(($_POST["branch"] == "legislators") || ($_GET["operation"] == "legislators"))
    {
        $url      = "https://congress.api.sunlightfoundation.com/legislators?per_page=all&apikey=bcde5dabc6234180953144b6300ab8d2";
        $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
        if($response == FALSE)
        {
             $url      = "http://104.198.0.197:8080/legislators?per_page=all&apikey=bcde5dabc6234180953144b6300ab8d2";
             $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
             if($response == FALSE)
             {
                 $url      = "legis.json";
                 $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
                 echo $response;
             }
             else
             {
                echo $response;
             }
        }
        else
        {
            echo $response;
        }
            
    }
    if($_POST["branch"] === "legis_committees") 
    {
        $members  = "member_ids=" . $_POST['members'];
        $url      = "http://congress.api.sunlightfoundation.com/committees?". members . "&per_page=5&apikey=bcde5dabc6234180953144b6300ab8d2";
        $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
        if($response == FALSE)
        {
             $url      = "http://104.198.0.197:8080/committees?". members . "&per_page=5&apikey=bcde5dabc6234180953144b6300ab8d2";
             $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
             echo $response;
        }
        else
        {
            echo $response;
        }
    }
    if($_POST["branch"] === "legis_bills") 
    {
        $sponsor = "sponsor_id=" . $_POST['sponsor'];
        $url = "http://congress.api.sunlightfoundation.com/bills?". $sponsor . "&per_page=5&apikey=bcde5dabc6234180953144b6300ab8d2";
        $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
        if($response == FALSE)
        {
             $url      = "http://104.198.0.197:8080/bills?". $sponsor . "&per_page=5&apikey=bcde5dabc6234180953144b6300ab8d2";
             $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
             if($response == FALSE)
             {
                 $response["results"] = [];
             }
             echo $response;
        }
        else
        {
            echo $response;
        }
        
    } 
    if($_POST["branch"] === "active_bills") 
    {
        $url = "http://congress.api.sunlightfoundation.com/bills?history.active=true&per_page=50&apikey=bcde5dabc6234180953144b6300ab8d2";
        $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
        if($response == FALSE)
        {
             $url      = "http://104.198.0.197:8080/bills?history.active=true&per_page=50&apikey=bcde5dabc6234180953144b6300ab8d2";
             $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
             if($response == FALSE)
             {
                 $url      = "active_bills.json";
                 $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
                 echo $response;
             }
             if($response == FALSE)
             {
                 $response["results"] = [];
             }
             echo $response;
             
        }
        else
        {
            echo $response;
        }
        
    }
    if($_POST["branch"] === "new_bills") 
    {
        $url = "http://congress.api.sunlightfoundation.com/bills?history.active=false&per_page=50&apikey=bcde5dabc6234180953144b6300ab8d2";
        $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
        if($response == FALSE)
        {
             $url      = "http://104.198.0.197:8080/bills?history.active=false&per_page=50&apikey=bcde5dabc6234180953144b6300ab8d2";
             $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
             if($response == FALSE)
             {
                 $url      = "new_bills.json";
                 $response = @file_get_contents($url, false, stream_context_create($arrContextOptions));
                 echo $response;
             }
             else
             {
                echo $response;
             }
        }
        else
        {
            echo $response;
        }
            
    } 
?>