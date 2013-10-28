// shorhand for document.getElementById
function gE(x) {

	return document.getElementById(x);
	
}

// this function is for setting the name of the player who will play next
function turn(x){
	return $("#selectPlayer1 p").text(x+"'s turn now");
}

//place for universal variables	
var playerName = "";
var playerTurn = "";
var done = "no";

var grid = new Array(6);
	grid[0] = new Array(7);
	grid[1] = new Array(7);
	grid[2] = new Array(7);
	grid[3] = new Array(7);
	grid[4] = new Array(7);
	grid[5] = new Array(7);

// this function is for initialization grid by making them empty
function init(){
	for(var i=0; i<6; i++){
		for(var j=0; j<7; j++){
			grid[i][j] = "empty";
		}
	}

}

// function for taking input & setting player name
function setPlayerName(){

		init();

		playerName = gE('pname').value;
		if(playerName===""){
			alert("Set your name if you really wanna play!");
			return;
		}
		$("#pname").hide();
		$("#playerInfo label").hide();
		$("#sub").hide();
		$("#playerInfo p").text(playerName+" is playing with the Robot.");
		$("#playerRadio").text("Set "+playerName+" as first player");
		$("#selectPlayer1").fadeIn();

}

$('input:radio[name="rad"]').change(function(){


    if($(this).val() === 'robot'){
       playerTurn = "robot";
       $("#selectPlayer1 form").fadeOut();
       turn("robot");
       ifRobotFirst();

    }
    else{
    	playerTurn = "player";
    	$("#selectPlayer1 form").fadeOut();
       	turn(playerName);
    }
});

// id to index parsers
function idToRow(x){
	var xStr =  x.charAt(1);
	var xInt = parseInt(xStr);
	return xInt;
}
function idToCol(x){
	var xStr =  x.charAt(2);
	var xInt = parseInt(xStr);
	return xInt;
}

// index to id parser
function indexToId(r,c){
	var ind = "";
	ind+="#";
	ind+="i";
	ind+= r.toString();
	ind+= c.toString();
	return ind;
}

function ifRobotFirst(){

	var row = 5;
	var col = Math.floor((Math.random()*6)+1);
	grid[row][col] = "robot";

	var targetedId = indexToId(row,col);

	$(targetedId).css("background","#800000");

	playerTurn = "player";
	turn(playerName);

}

// this funtion is for geting the id name and returning index for a 2d array
$("li").click(function (){


	if(playerName==="" || playerTurn==="" || playerTurn==="robot"){ //stoping the player from cheating :P
		return;
	}

	var theId = $(this).attr('id');
	
	var row = idToRow(theId);
	var col = idToCol(theId);

	var isValid = true;

	for(var a=5; a >= row; a--){
		if(grid[a][col]==="empty"){

			grid[a][col] = "player";

			var targetedId = indexToId(a,col);

			$(targetedId).css("background","#6666FF");

			isValid = true;

			winCheck("player");

			break;

		}
		else{      

			isValid = false;
			
		}
	} 

	if(isValid===false){
		alert("This position is not valid. Try again.");
	}

	playerTurn = "robot";

	robotPlay();


});

// this function will play as robot
function robotPlay(){

	var winTry = true, defendTry = true,lightTry=true, progressTry = true;

	winTry = winMove();	

	if(winTry===false){
		defendTry = defendMove();
	}

	if(defendTry===false){
		lightTry = lightMove();
	}
	if(lightTry===false){
		progressTry = progressMove();
	}




	playerTurn = "player";

}


// this function is for making the winning move
function defendMove(){

	for(var i=5; i>=0; i--){ // loop for traversing rows
		for(var j=6; j>=0; j--){ //loop for traversing cols


			if( grid[i][j]==="empty"){

			if(i<5 && grid[i+1][j]==="empty"){ // checking gravity here
					continue;
				}


			//horizontal check block starts
			/*
				_ppp
				p_pp
				pp_p
				ppp_

			*/
				if(
					(j+3<=6 && grid[i][j+1]==="player" && grid[i][j+2]==="player" && grid[i][j+3]==="player")||
					(j-1>=0 && j+2<=6 && grid[i][j-1]==="player" && grid[i][j+1]==="player" && grid[i][j+2]==="player")||
					(j-2>=0 && j+1<=6 && grid[i][j-2]==="player" && grid[i][j-1]==="player" && grid[i][j+1]==="player")||
					(j-3>=0 && grid[i][j-3]==="player" && grid[i][j-2]==="player" && grid[i][j-1]==="player")
					
					){
					grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");

					done = "yes";

					winCheck("robot");

					return true;

				}
			//horizontal check block ends

			// vertical block starts

					/*
						_
						p
						p
						p

					*/

				if( i+3<=5 && grid[i+1][j]==="player" && grid[i+2][j]==="player" && grid[i+3][j]==="player"){

					grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");

					done = "yes";

					winCheck("robot");

					return true;
					
				}

			//vertical block ends

			//diagonal block starts here


			if(

		/* 1 */ ( j+3<=6 && i-3>=0 && grid[i-1][j+1]==="player" && grid[i-2][j+2]==="player" && grid[i-3][j+3]==="player"  )||

		/* 2 */ ( j+2<=6 && i-2>=0 && i+1<=5 && j-1>=0 && grid[i+1][j-1]==="player" && grid[i-1][j+1]==="player" && grid[i-2][j+2]==="player"  )||

		/* 3 */ ( j+1<=6 && i-1>=0 && i+2<=5 && j-2>=0 && grid[i+2][j-2]==="player" && grid[i+1][j-1]==="player" && grid[i-1][j+1]==="player"  )||

		/* 4 */ ( j-3>=0 && i+3<=5 && grid[i+3][j-3]==="player" && grid[i+2][j-2]==="player" && grid[i+1][j-1]==="player"  )||

		/* 5 */ ( i-3>=0 && j-3>=0 && grid[i-3][j-3]==="player" && grid[i-2][j-2]==="player" && grid[i-1][j-1]==="player"  )||

		/* 6 */ ( i-2>=0 && j-2>=0 && i+1<=5 && j+1<=6 && grid[i-2][j-2]==="player" && grid[i-1][j-1]==="player" && grid[i+1][j+1]==="player"  )||

		/* 7 */ ( i-1>=0 && j-1>=0 && i+2<=5 && j+2<=6 && grid[i-1][j-1]==="player" && grid[i+1][j+1]==="player" && grid[i+2][j+2]==="player"  )||

		/* 8 */ ( i+3<=5 && j+3<=6 && grid[i+3][j+3]==="player" && grid[i+2][j+2]==="player" && grid[i+1][j+1]==="player"  )



				){

					grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");

					done = "yes";

					winCheck("robot");

					return true;

			}



			//diagonal block ends here



			}//empty check ends

		}//col loop ends
	}//row loop ends

	return false;
	
}// defendMove() ends here

// winMove start here

function winMove(){

	for(var i=5; i>=0; i--){ // loop for traversing rows
		for(var j=6; j>=0; j--){ //loop for traversing cols


			if( grid[i][j]==="empty"){

			if(i<5 && grid[i+1][j]==="empty"){ // checking gravity here
					continue;
				}


			//horizontal check block starts
			/*
				_ppp
				p_pp
				pp_p
				ppp_

			*/
				if(
					(j+3<=6 && grid[i][j+1]==="robot" && grid[i][j+2]==="robot" && grid[i][j+3]==="robot")||
					(j-1>=0 && j+2<=6 && grid[i][j-1]==="robot" && grid[i][j+1]==="robot" && grid[i][j+2]==="robot")||
					(j-2>=0 && j+1<=6 && grid[i][j-2]==="robot" && grid[i][j-1]==="robot" && grid[i][j+1]==="robot")||
					(j-3>=0 && grid[i][j-3]==="robot" && grid[i][j-2]==="robot" && grid[i][j-1]==="robot")
					
					){
					grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");

					done = "yes";

					winCheck("robot");

					return true;

				}
			//horizontal check block ends

			// vertical block starts

					/*
						_
						p
						p
						p

					*/

				if( i+3<=5 && grid[i+1][j]==="robot" && grid[i+2][j]==="robot" && grid[i+3][j]==="robot"){

					grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");

					done = "yes";

					winCheck("robot");

					return true;
					
				}

			//vertical block ends

			//diagonal block starts here


			if(

		/* 1 */ ( j+3<=6 && i-3>=0 && grid[i-1][j+1]==="robot" && grid[i-2][j+2]==="robot" && grid[i-3][j+3]==="robot"  )||

		/* 2 */ ( j+2<=6 && i-2>=0 && i+1<=5 && j-1>=0 && grid[i+1][j-1]==="robot" && grid[i-1][j+1]==="robot" && grid[i-2][j+2]==="robot"  )||

		/* 3 */ ( j+1<=6 && i-1>=0 && i+2<=5 && j-2>=0 && grid[i+2][j-2]==="robot" && grid[i+1][j-1]==="robot" && grid[i-1][j+1]==="robot"  )||

		/* 4 */ ( j-3>=0 && i+3<=5 && grid[i+3][j-3]==="robot" && grid[i+2][j-2]==="robot" && grid[i+1][j-1]==="robot"  )||

		/* 5 */ ( i-3>=0 && j-3>=0 && grid[i-3][j-3]==="robot" && grid[i-2][j-2]==="robot" && grid[i-1][j-1]==="robot"  )||

		/* 6 */ ( i-2>=0 && j-2>=0 && i+1<=5 && j+1<=6 && grid[i-2][j-2]==="robot" && grid[i-1][j-1]==="robot" && grid[i+1][j+1]==="robot"  )||

		/* 7 */ ( i-1>=0 && j-1>=0 && i+2<=5 && j+2<=6 && grid[i-1][j-1]==="robot" && grid[i+1][j+1]==="robot" && grid[i+2][j+2]==="robot"  )||

		/* 8 */ ( i+3<=5 && j+3<=6 && grid[i+3][j+3]==="robot" && grid[i+2][j+2]==="robot" && grid[i+1][j+1]==="robot"  )



				){

					grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");

					done = "yes";

					winCheck("robot");

					return true;

			}



			//diagonal block ends here



			}//empty check ends

		}//col loop ends
	}//row loop ends


	return false;
	
}// winMove() ends here


function lightMove(){

		for(var i=5; i>=0; i--){ // loop for traversing rows
		for(var j=6; j>=0; j--){ //loop for traversing cols


			if( grid[i][j]==="empty"){

			if(i<5 && grid[i+1][j]==="empty"){ // checking gravity here
					continue;
				}


				if(

					(i+2<=5 && grid[i+2][j]==="player" && grid[i+1][j]==="player")||
					(j-2>=0 && grid[i][j-2]==="player" && grid[i][j-1]==="player")||
					(j+2<=6 && grid[i][j+2]==="player" && grid[i][j+1]==="player")||
					(j+1<=6 && j-1>=0 && grid[i][j+1]==="player" && grid[i][j-1]==="player")


					){


					grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");

					done = "yes";

					winCheck("robot");

					return true;

				}

				if(

					(i+2<=5 && grid[i+2][j]==="robot" && grid[i+1][j]==="robot")||
					(j-2>=0 && grid[i][j-2]==="robot" && grid[i][j-1]==="robot")||
					(j+2<=6 && grid[i][j+2]==="robot" && grid[i][j+1]==="robot")||
					(j+1<=6 && j-1>=0 && grid[i][j+1]==="robot" && grid[i][j-1]==="robot")


					){


					grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");

					done = "yes";

					winCheck("robot");

					return true;

				}






			}

		}//end loop

	}//end loop

return false;


}

function progressMove(){

	for(var p=5; p>=0; p--){
		for(var q=6; q>=0; q--){
			if(grid[p][q]==="empty"){

				if(p<5 && grid[p+1][q]==="empty"){ // checking gravity here
					continue;
				}

					grid[p][q] = "robot";

					var targetedId = indexToId(p,q);

					$(targetedId).css("background","#800000");


					done = "yes";

					winCheck("robot");

					return true;

			}
		}
	}


		return false;
}


/* winCheck block starts here*/

function winCheck(x){

	for(var i=5; i>=0; i--){ // loop for traversing rows
		for(var j=6; j>=0; j--){ //loop for traversing cols


			//horizontal check block starts
			/*
				_ppp
				p_pp
				pp_p
				ppp_

			*/
				if( j+3<=6 && grid[i][j]===x && grid[i][j+1]===x && grid[i][j+2]===x && grid[i][j+3]===x ){


					var targetedId1 = indexToId(i,j);
					var targetedId2 = indexToId(i,j+1);
					var targetedId3 = indexToId(i,j+2);
					var targetedId4 = indexToId(i,j+3);

					$(targetedId1).css("background","black");
					$(targetedId2).css("background","black");
					$(targetedId3).css("background","black");
					$(targetedId4).css("background","black");

					$("#result").fadeIn();
					if(x==="player"){
						x = playerName;
					}
					$("#result p").text(x+ " won.");

					$("#selectPlayer1").hide();


					$( "body" )
    				.off( "click", "#grid", flash )
    				.find( "#grid" )
     				 .text( "game over" );

     				 return;

				}
			//horizontal check block ends

			// vertical block starts

					/*
						_
						p
						p
						p

					*/

				if( i+3<=5 && grid[i][j]===x && grid[i+1][j]===x && grid[i+2][j]===x && grid[i+3][j]===x){

					var targetedId1 = indexToId(i,j);
					var targetedId2 = indexToId(i+1,j);
					var targetedId3 = indexToId(i+2,j);
					var targetedId4 = indexToId(i+3,j);

					$(targetedId1).css("background","black");
					$(targetedId2).css("background","black");
					$(targetedId3).css("background","black");
					$(targetedId4).css("background","black");

					$("#result").fadeIn();
					if(x==="player"){
						x = playerName;
					}
					$("#result p").text(x+ " won.");
					$("#selectPlayer1").hide();

					$( "body" )
    				.off( "click", "#grid", flash )
    				.find( "#grid" )
     				 .text( "game over" );

     				 return;
					
				}

			//vertical block ends

			//diagonal block starts here


			if(j+3<=6 && i-3>=0 && grid[i][j]===x && grid[i-1][j+1]===x && grid[i-2][j+2]===x && grid[i-3][j+3]===x){

				var targetedId1 = indexToId(i,j);
					var targetedId2 = indexToId(i-1,j+1);
					var targetedId3 = indexToId(i-2,j+2);
					var targetedId4 = indexToId(i-3,j+3);

					$(targetedId1).css("background","black");
					$(targetedId2).css("background","black");
					$(targetedId3).css("background","black");
					$(targetedId4).css("background","black");

					$("#result").fadeIn();
					if(x==="player"){
						x = playerName;
					}
					$("#result p").text(x+ " won.");
					$("#selectPlayer1").hide();

					$( "body" )
    				.off( "click", "#grid", flash )
    				.find( "#grid" )
     				 .text( "game over" );

     				 return;
			}

			if( i+3<=5 && j+3<=6 && grid[i][j]===x && grid[i+3][j+3]===x && grid[i+2][j+2]===x && grid[i+1][j+1]===x){

				var targetedId1 = indexToId(i,j);
					var targetedId2 = indexToId(i+3,j+3);
					var targetedId3 = indexToId(i+2,j+2);
					var targetedId4 = indexToId(i+1,j+1);

					$(targetedId1).css("background","black");
					$(targetedId2).css("background","black");
					$(targetedId3).css("background","black");
					$(targetedId4).css("background","black");

					
					$("#result").fadeIn();
					if(x==="player"){
						x = playerName;
					}
					$("#result p").text(x+ " won.");
					$("#selectPlayer1").hide();

					$( "body" )
    				.off( "click", "#grid", flash )
    				.find( "#grid" )
     				 .text( "game over" );

     				 return;
			}



			//diagonal block ends here



		}//col loop ends
	}//row loop ends


	return;
	


}

/* winCheck block ends here*/



/*

grid[i][j] = "robot";

					var targetedId = indexToId(i,j);

					$(targetedId).css("background","#800000");




*/