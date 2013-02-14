/*
Author : Sarmad Sangi
www.sarmadsangi.com

This file is responsible for all the logic around the game.
This file contains js closure function acting as a class Tictacteo
which has multiple functions doing all the game logic. Go through each 
function comments and u ll get it ... its pretty straight forward.

*/

$(document).ready(function() {

	// Creating closure aka class kinda thingy to store all tic tac teo related stuff.
	var Tictacteo = function() 
	{

		// Multi Player or Single Player Game ?
		this.GamePlayType = "vs-computer";

		// Market symbols
		this.HumanMarker = 'X';
		this.ComputerMarker = 'O';

		// Winning Patterns
		this.WinPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];

		// initial player human by default
		this.CurrentPlayer = 'X';


		/**
		* This function sets game mode. i.e Multi player or single player
		*/
		this.setGameMode = function(mode) {
			this.GamePlayType = mode;
		}


		/**
		* This function does automated move for computer player. 
		* I am using math.random here to get any random unselected grid of the board
		* and mark computers selection here. 
		*/
		this.computerPlayerMove = function() {
			var unselectedGrids = "";
			unselectedGrids = $('#tictactoe-board td[class=]').map(function() {
					  return $(this).attr("id");
			}).get();

			var randomGrid = unselectedGrids[Math.floor(Math.random() * unselectedGrids.length)];

			$('#'+randomGrid).addClass("selectedBy"+this.CurrentPlayer);
			$('#'+randomGrid).html(this.CurrentPlayer);
			if(!game.checkWinner())
			{
				this.swapCurrentPlayer();
			}

		}

		/**
		* This function make a human player move. It takes cell aka grid element as paramter.
		*/
		this.PlayerMove = function(cell) {

			$(cell).addClass("selectedBy"+this.CurrentPlayer);
			$(cell).html(this.CurrentPlayer);
			if(!game.checkWinner())
			{
				this.swapCurrentPlayer();
			}

			if(this.GamePlayType == 'vs-computer' && this.CurrentPlayer == 'O'){
				this.computerPlayerMove();
			}
		}

		/**
		* This function which is always initiated by user click. It check if cell is already been selected or not
		* if not thn we let the player select that cell.
		*/
		this.selectCell = function(cell) {
			if($(cell).hasClass("selectedBy"+this.HumanMarker) || $(cell).hasClass("selectedBy"+this.ComputerMarker)) {
				console.log("This grid has already been selected.");
				$("#messageStack").text("This grid has already been selected. Please select another.");
				return false;
			}

			this.PlayerMove(cell);
			
		}

		/**
		* This function change players turn from O to X or X to O.
		*/
		this.swapCurrentPlayer = function() {
			if(this.CurrentPlayer == this.HumanMarker) {
				this.CurrentPlayer = this.ComputerMarker;
			} else {
				this.CurrentPlayer = this.HumanMarker;
			}
			$("#messageStack").text("It's player "+this.CurrentPlayer+"'s turn");
		}

		/**
		* This function checks if we have any winner by selecting grids selected by both O and X. Those grids
		* are thn matched with winning patterns we store in this.WinPatterns by function checkWinPatternMatch.
		*/
		this.checkWinner = function() {
			var selectedGrids = '';
			var selectedByX = $("#tictactoe-board td.selectedByX");
			var selectedByO = $("#tictactoe-board td.selectedByO");

		  	if(this.CurrentPlayer == this.HumanMarker) {
		  		
		  		if(selectedByX.length >= 3) {
					selectedGrids = $('#tictactoe-board td.selectedByX').map(function() {
					  return $(this).attr("id").substring(5);
					}).get();
					if(this.checkWinPatternMatch(selectedGrids)){
						return true;
					}
		  		}

		  	} else {
		  		
		  		if(selectedByO.length >= 3) {
					selectedGrids = $('#tictactoe-board td.selectedByO').map(function() {
					  return $(this).attr("id").substring(5);
					}).get();
					if(this.checkWinPatternMatch(selectedGrids)){
						return true;
					}
		  		}
		  	}


		  	if((selectedByO.length + selectedByX.length) === 9) {
		  		alert("Its A Drawn");
		  		this.resetGame();
		  	}

		}

		/**
		* This function compares selectedGrids with winning patterns stored in this class.
		* If pattern is matched thn we prompt winner here.
		*/
		this.checkWinPatternMatch = function(selectedGrids) {
			winnerGridCount = 0;
			var temp = this; 
			$.each(this.WinPatterns, function(index, value) {
				$.each(value, function(index, pattern) {
			  		if($.inArray(pattern.toString(), selectedGrids) > -1) {
			  			winnerGridCount++;
			  		}
				});

				if(winnerGridCount === 3) {
					alert("Player "+temp.CurrentPlayer+" Won The Game");
					temp.resetGame();
					winnerGridCount = 0;
					return true;
				}
				winnerGridCount = 0;
			});
		}

		/**
		* This function resets the game board by making default player back to X and cleaning up the grids.
		*/
		this.resetGame = function() {
			this.CurrentPlayer = 'X';
			this.cleanUpGrid();
		}

		/**
		* This function just cleans up the grid by making all td's of table empty and remove all the classes.
		*/
		this.cleanUpGrid = function() {
			$("#tictactoe-board td").html('');
			$("#tictactoe-board td").attr('class','');
		}


	}



	// Game (Tictacteo) class initiated here.
	var game = new Tictacteo();


	// Click event on single player button
	$("#singlePlayer").click(function(e){
		game.resetGame();
		game.setGameMode("vs-computer");
		$("#selectedGameMode").text("Selected Game Mode : Single Player");
	});

	// Click event on multi player button
	$("#multiPlayer").click(function(e){
		game.resetGame();
		game.setGameMode("vs-human");
		$("#selectedGameMode").text("Selected Game Mode : Multi Player");
	});

	// Click event on reset button
	$("#resetGame").click(function(e){
		game.resetGame();
	});

	// Click event for each cell or grid of the board.
	$("#tictactoe-board td").click(function(e){
		game.selectCell($(this));
	});


});