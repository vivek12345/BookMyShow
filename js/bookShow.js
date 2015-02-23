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
		bronze:80,
		silver:100,
		gold:150
	}
};

var selectingSeatArray=[];

var createSeats=function(reservedSeat)
{
	var seatList=[],seatNumber,seatClass;
	var k=0;
	for(var i=0;i<settings.rows;i++,k++)
	{
		for(var j=0;j<settings.column;j++)
		{

			seatNumber=(j+i*settings.column+1);
			

			if(seatNumber==51)
				{

					seatList.push("</ul></div>"+"<div class='silver_tickets_map col-md-12'><p class='category'>SILVER (Rs "+settings.price.silver+")"+"</p>"+"<ul id='tickets_map'>");
					k=0;
				}
				else if(seatNumber==151)
				{
					seatList.push("</ul></div>"+"<div class='bronze_tickets_map col-md-12'><p class='category'>BRONZE (Rs "+settings.price.bronze+")"+"</p>"+"<ul id='tickets_map'>");
					k=0;
				}
				else if(seatNumber==1)
				seatList.push("<div class='gold_tickets_map col-md-12'><p class='category'>GOLD (Rs "+settings.price.gold+")"+"</p>"+"<ul id='tickets_map'>");

			seatClass=settings.seatCss+' '+settings.rowCssPrefix+i.toString()+' '+settings.colCssPrefix+j.toString();
			
			if ($.isArray(reservedSeat) && $.inArray(seatNumber, reservedSeat) != -1) 
			{
                seatClass += ' ' + settings.selectedSeatCss;
            }
			//seatList.push("<li class='"+seatClass+"'"+" style='top:"+(i*settings.height).toString()+"px;left:"+(j*settings.width).toString()+"px;'>"+"<a title='"+seatNumber+"'></a>"+"</li>");
			if(seatNumber%25==4||seatNumber%25==21)
			{
				seatClass += ' '+'invisible';
				seatList.push("<li class='"+seatClass+"'"+" style='top:"+(k*settings.height+5).toString()+"px;left:"+(j*settings.width).toString()+"px;'>"+"</li>");
			}
			else
				seatList.push("<li class='"+seatClass+"'"+" style='top:"+(k*settings.height+5).toString()+"px;left:"+(j*settings.width).toString()+"px;'>"+"<a title='"+seatNumber+"'></a>"+"</li>");
		}
	}
	//document.getElementById("tickets_map").innerHTML=seatList.join('');
	document.getElementById("container").innerHTML=seatList.join('');
};

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
				/*alert("Please select adjacent seats");*/
				$('.alert > span').html("Please select adjacent seats");
				/*if($('.alert').hasClass('alert-success'))
				{
					$('.alert').removeClass('alert-success');
				}
				if($('.alert').hasClass('alert-warning'))
				{
					$('.alert').removeClass('alert-warning');
				}
				$('.alert').addClass('alert-danger');*/
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
		
		if(start_seat%25!=1)
		{
			left=checkLeft(start_seat,end_seat);
		}
		
		if(end_seat%25!=0)
		{
			right=checkRight(end_seat,start_seat);
		}
		if(left || right)
		{
			return true;
		}
	}
	return false;
}

function checkLeft(start_seat,end_seat)
{
	if(start_seat%25!=2)
	{
		if(!($.inArray(parseInt(start_seat)-1, bookedSeats) != -1) && ($.inArray(parseInt(start_seat)-2,bookedSeats)!=-1) && !($.inArray(parseInt(end_seat)+1, bookedSeats) != -1))
		{
			return true;
		}
	}
	else
	{
		if(!($.inArray(parseInt(start_seat)-1, bookedSeats) != -1))
		{
			return true;
		}	
	}
	return false;
}

function checkRight(end_seat,start_seat)
{
	if(end_seat%25!=24)
	{
		if(!($.inArray(parseInt(end_seat)+1, bookedSeats) != -1) && ($.inArray(parseInt(end_seat)+2,bookedSeats)!=-1) && !($.inArray(parseInt(start_seat)-1, bookedSeats) != -1)) 	
		{
			return true;
		}
	}
	else
	{
		if(!($.inArray(parseInt(end_seat)+1, bookedSeats) != -1))
		{
			return true;
		}
	}
	return false;
}


window.onload=function()
{
	$('.'+settings.seatCss).click(function()
	{
		if($(this).hasClass(settings.selectedSeatCss))
		{
			$('.alert > span').html("Already Selected Seat");
			/*if($('.alert').hasClass('alert-success'))
			{
				$('.alert').removeClass('alert-success');
			}
			if($('.alert').hasClass('alert-warning'))
			{
				$('.alert').removeClass('alert-warning');
			}
			$('.alert').addClass('alert-danger');*/
			$('.alert').show();	
		}
		else
		{
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
					/*alert("Seats already selected,Proceed to checkout,or change the number of seats you want");*/
					$('.alert > span').html("Seats already selected,Proceed to checkout,or change the number of seats you want");
					/*if($('.alert').hasClass('alert-success'))
					{
						$('.alert').removeClass('alert-success');
					}
					if($('.alert').hasClass('alert-danger'))
					{
						$('.alert').removeClass('alert-danger');
					}
					$('.alert').addClass('alert-warning');*/
					$('.alert').show();
				}
				else
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
								/*if($('.alert').hasClass('alert-success'))
								{
									$('.alert').removeClass('alert-success');
								}
								if($('.alert').hasClass('alert-warning'))
								{
									$('.alert').removeClass('alert-warning');
								}
								$('.alert').addClass('alert-danger');*/
								$('.alert').show();
							}
							else
							{
								$('.alert > span').html("Seats selected,now proceed to checkout");
								/*if($('.alert').hasClass('alert-warning'))
								{
									$('.alert').removeClass('alert-warning');
								}
								if($('.alert').hasClass('alert-danger'))
								{
									$('.alert').removeClass('alert-danger');
								}
								$('.alert').addClass('alert-success');*/
								$('.alert').show();
								$('.checkout').removeClass("disabled");
							}
						}
						
					}

				}
			}
		}
	});


	$('.btn-success').click(function(){

		$('.modal-title').html("New movie");
		$('.modal').modal('show'); 


	});
	$('.alert .close').on('click', function(e) {
    	$(this).parent().hide();
	});

};