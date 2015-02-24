var settings=
{
	rows:8,
	column:25,
	rowCssPrefix:'row-',
	colCssPrefix:'col-',
	seatCss:'seat',
	width:20,
	height:35,
	selectedSeatCss:'selectedSeat',
	selectingSeatCss:'selectingSeat',
	price:
	{
		Bronze:80,
		Silver:100,
		Gold:150
	},
	movies:
	[
		"Inception",
		"Black Friday"

	]
};

var bookedSeats={};

var selectingSeatArray=[];
var invisibleSeats=[];
var no_of_seats;
function createSeats(reservedSeat)
{
	var seatList=[],seatNumber,seatClass;
	var k=0;
	var selected_movie=$('.movies-toggle span').text();
	no_of_seats=$('.quantity-toggle span').text();
	for(var i=0;i<settings.rows;i++,k++)
	{
		for(var j=0;j<settings.column;j++)
		{

			seatNumber=(j+i*settings.column+1);
			

			if(seatNumber==51)
				{

					seatList.push("</ul></div>"+"<div class='silver_tickets_map col-md-12'><p class='category'>SILVER (Rs "+settings.price.Silver+")"+"</p>"+"<ul id='tickets_map' class='Silver'>");
					k=0;
				}
				else if(seatNumber==151)
				{
					seatList.push("</ul></div>"+"<div class='bronze_tickets_map col-md-12'><p class='category'>BRONZE (Rs "+settings.price.Bronze+")"+"</p>"+"<ul id='tickets_map' class='Bronze'>");
					k=0;
				}
				else if(seatNumber==1)
				seatList.push("<div class='gold_tickets_map col-md-12'><p class='category'>GOLD (Rs "+settings.price.Gold+")"+"</p>"+"<ul id='tickets_map' class='Gold'>");

			seatClass=settings.seatCss+' '+settings.rowCssPrefix+i.toString()+' '+settings.colCssPrefix+j.toString();
			
			if ($.isArray(reservedSeat) && $.inArray(seatNumber+'', reservedSeat) != -1) 
			{
                seatClass += ' ' + settings.selectedSeatCss;
            }
			//seatList.push("<li class='"+seatClass+"'"+" style='top:"+(i*settings.height).toString()+"px;left:"+(j*settings.width).toString()+"px;'>"+"<a title='"+seatNumber+"'></a>"+"</li>");
			if(seatNumber%25==4||seatNumber%25==21)
			{
				
				seatClass += ' '+'invisible';
				invisibleSeats.push(seatNumber);
				seatList.push("<li class='"+seatClass+"'"+" style='top:"+(k*settings.height+5).toString()+"px;left:"+(j*settings.width).toString()+"px;'>"+"</li>");
			}
			else
				seatList.push("<li id='"+selected_movie+"' class='"+seatClass+"'"+" style='top:"+(k*settings.height+5).toString()+"px;left:"+(j*settings.width).toString()+"px;'>"+"<a title='"+seatNumber+"'></a>"+"</li>");
		}
	}
	document.getElementById("container").innerHTML=seatList.join('');
	setUpClickBinding();
};

function setUpClickBinding()
{
	$('.'+settings.seatCss).click(function()
	{
		if($(this).hasClass(settings.selectedSeatCss))
		{
			$('.alert > span').html("Already Selected Seat");
			$('.alert').removeClass('alert-success').addClass('alert-danger');
			$('.alert').show();	
		}
		else
		{
			var selected_category=$('.category-toggle span').text();

			if($(this).hasClass(settings.selectingSeatCss))
			{
				$(this).removeClass(settings.selectingSeatCss);
				var index=selectingSeatArray.indexOf($(this).children("a").attr("title"));
				if(index!=-1)
				{
					selectingSeatArray.splice(index,1);
					$('.checkout').addClass("disabled");
				}
				no_of_seats++;
			}
			else
			{
				if(no_of_seats==0)
				{
					
					$('.alert > span').html("Seats already selected,Proceed to checkout,or change the number of seats you want");
					$('.alert').removeClass('.alert-success').addClass('alert-danger');
					$('.alert').show();
				}
				else
				{
					if($(this).parent().hasClass(selected_category))
					{
						$(this).toggleClass(settings.selectingSeatCss);
						selectingSeatArray.push($(this).children("a").attr('title'));
						if(--no_of_seats==0)
						{
							selectingSeatArray.sort(sortNumber);
							console.log(selectingSeatArray);
							if(isAdjacentSeat(selectingSeatArray))
							{
								if(isSingleSiloCreated(selectingSeatArray))
								{
									$('.alert > span').html("Single silo created");
									$('.alert').removeClass('.alert-success').addClass('alert-danger');
									$('.alert').show();
								}
								else
								{
									$('.alert > span').html("Seats selected,now proceed to checkout");
									$('.alert').removeClass('alert-danger').addClass('alert-success');
									$('.alert').show();
									$('.checkout').removeClass("disabled");
								}
							}

						}
					}
					else
					{
						$('.alert > span').html("You can select tickets only from "+selected_category+' category');
						$('.alert').removeClass('.alert-success').addClass('alert-danger');
						$('.alert').show();
					}

				}
			}
		}
	});

}

function sortNumber(a,b)
{
	return a-b;	
}
function isAdjacentSeat(selectedSeatArray)
{
	var prev_value=parseInt(selectingSeatArray[0]);
	if(selectingSeatArray.length>1)
	{
		for(var i=1;i<selectingSeatArray.length;i++)
		{
			if(selectingSeatArray[i]!=(parseInt(prev_value)+1))
			{
				
				$('.alert > span').html("Please select adjacent seats");
				$('.alert').removeClass('.alert-success').addClass('alert-danger');
				$('.alert').show();
				return false;
			}
			else
			{
				prev_value=selectingSeatArray[i];
			}
		}
		return true;
	}
	return false;
}

function isSingleSiloCreated(selectedSeatArray)
{
	if(selectingSeatArray.length>1)
	{
		var start_seat=selectingSeatArray[0];
		var end_seat=selectingSeatArray[selectingSeatArray.length-1];
		var left=false,right=false;
		var selected_movie=$('.movies-toggle span').text();
		if(start_seat%25!=1)
		{
			left=checkLeft(start_seat,end_seat,selected_movie);
		}
		
		if(end_seat%25!=0)
		{
			right=checkRight(end_seat,start_seat,selected_movie);
		}
		if(left || right)
		{
			return true;
		}
	}
	return false;
}

function checkLeft(start_seat,end_seat,selected_movie)
{
	if(start_seat%25!=2)
	{
		if(!($.inArray(parseInt(start_seat)-1+'', bookedSeats[selected_movie]) != -1) && ($.inArray(parseInt(start_seat)-2+'',bookedSeats[selected_movie])!=-1 || ($.inArray(parseInt(start_seat)-2,invisibleSeats)!=-1)) && end_seat%25!=0 && (!($.inArray(parseInt(end_seat)+1+'', bookedSeats[selected_movie]) != -1) && !($.inArray(parseInt(end_seat)+1, invisibleSeats) != -1)) && !($.inArray(parseInt(start_seat)-1, invisibleSeats) != -1))
		{
			return true;
		}
	}
	else
	{
		if(!($.inArray(parseInt(start_seat)-1+'', bookedSeats[selected_movie]) != -1) && !($.inArray(parseInt(end_seat)+1,invisibleSeats)!=-1))
		{
			return true;
		}	
	}
	return false;
}

function checkRight(end_seat,start_seat,selected_movie)
{
	if(end_seat%25!=24)
	{
		if(!($.inArray(parseInt(end_seat)+1+'', bookedSeats[selected_movie]) != -1) && (($.inArray(parseInt(end_seat)+2+'',bookedSeats[selected_movie])!=-1) || ($.inArray(parseInt(end_seat)+2,invisibleSeats)!=-1)) && start_seat%25!=1 && !($.inArray(parseInt(start_seat)-1+'', bookedSeats[selected_movie]) != -1) && !($.inArray(parseInt(start_seat)-1,invisibleSeats)!=-1)) 	
		{
			return true;
		}
	}
	else
	{
		if(!($.inArray(parseInt(end_seat)+1+'', bookedSeats[selected_movie]) != -1) && !($.inArray(parseInt(start_seat)-1,invisibleSeats)!=-1))
		{
			return true;
		}
	}
	return false;
}

/*window.onload=function()*/
$(document).ready(function()
{	
								
	if(localStorage.getItem('reservedSeat'))
	{
		bookedSeats=JSON.parse(localStorage.getItem('reservedSeat'));
		console.log(bookedSeats);
	}
								
	$('.btn-success').click(function()
	{

		$('.modal-title').html('Movie:'+$('.movies-toggle span').text());
		var selected_movie=$('.movies-toggle span').text();
		if(!bookedSeats[selected_movie])
		{
			bookedSeats[selected_movie]=[];
		}
		createSeats(bookedSeats[selected_movie]);
		$('.modal').modal('show'); 



	});
	$('.alert .close').on('click', function(e) {
    	$(this).parent().hide();
	});

	$('.checkout').click(function(){
		if(typeof(Storage)!="undefined")
		{
			var selected_movie=$('.movies-toggle span').text();
			bookedSeats[selected_movie]=bookedSeats[selected_movie].concat(selectingSeatArray);
			console.log(bookedSeats[selected_movie]);
			localStorage.setItem('reservedSeat',JSON.stringify(bookedSeats));
			console.log(JSON.parse(localStorage.getItem('reservedSeat')));
			window.location = "file:///F:/Dunia/trunk/home.html";
		}
	});



	$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {

		var $target = $( event.currentTarget );

		$target.closest( '.btn-group' )
		.find( '[data-bind="label"]' ).text( $target.text() )
		.end()
		.children( '.dropdown-toggle' ).dropdown( 'toggle' );

		return false;

	});

	var movies=[];
	for(var i=0;i<settings.movies.length;i++)
		movies.push('<li>'+'<a href="#">'+settings.movies[i]+'</a>'+'</li>');
	$('.movies').html(movies.join(''));
	var categories=[];
	for(category in settings.price)
	{
		categories.push('<li>'+'<a href="#">'+category+'</a>'+'</li>');
	}
	$('.movie_category').html(categories.join(''));

	var quantity=[];
	for(var i=1;i<=10;i++)
	{
		quantity.push('<li>'+'<a href="#">'+i+'</a>'+'</li>');
	}
	$('.quantity').html(quantity.join(''));
});