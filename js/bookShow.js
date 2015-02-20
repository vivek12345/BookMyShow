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
	categories:
	{
		bronze:5,
		silver:8,
		gold:10
	}
};

var selectingSeatArray=[];

var createSeats=function(reservedSeat)
{
	var seatList=[],seatNumber,seatClass;
	for(var i=0;i<settings.rows;i++)
	{
		for(var j=0;j<settings.column;j++)
		{
			seatNumber=(j+i*settings.column+1);
			seatClass=settings.seatCss+' '+settings.rowCssPrefix+i.toString()+' '+settings.colCssPrefix+j.toString();
			if ($.isArray(reservedSeat) && $.inArray(seatNumber, reservedSeat) != -1) 
			{
                seatClass += ' ' + settings.selectedSeatCss;
            }
			seatList.push("<li class='"+seatClass+"'"+" style='top:"+(i*settings.height).toString()+"px;left:"+(j*settings.width).toString()+"px;'>"+"<a title='"+seatNumber+"'></a>"+"</li>");
		}
	}
	document.getElementById("tickets_map").innerHTML=seatList.join('');
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
				alert("Please select adjacent seats");
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
		if(start_seat%25!=1/*&&start_seat%25!=2*/)
		left=checkLeft(start_seat);
		if(end_seat%25!=0/*&&end_seat%25!=24*/)
		right=checkRight(end_seat);
		if(left&&right)
		return true;
	}
	return false;
}

function checkLeft(start_seat)
{
	if(!($.inArray(start_seat-1, bookedSeats) != -1))
	{
		/*if(!($.inArray(start_seat-2, bookedSeats) != -1))*/
		return true;
	}
	return false;
}

function checkRight(end_seat)
{
	if(!($.inArray(parseInt(end_seat)+1, bookedSeats) != -1))
	{
		/*if(!($.inArray(end_seat+2, bookedSeats) != -1))*/
		return true;
	}
	return false;
}


window.onload=function()
{
	$('.'+settings.seatCss).click(function()
	{
		if($(this).hasClass(settings.selectedSeatCss))
		{
			alert("Already Selected Seat");	
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
				}
				no_of_seats++;
			}
			else
			{
				if(no_of_seats==0)
				{
					alert("Seats already selected,Proceed to checkout,or change the number of seats you want");
				}
				else
				{
					$(this).toggleClass(settings.selectingSeatCss);
					//seatArray.splice(($(this).children("a").attr('title'))-1,0,($(this).children("a").attr('title')));
					selectingSeatArray.push($(this).children("a").attr('title'));
					//console.log(selectingSeatArray);
					//alert(no_of_seats);
					if(--no_of_seats==0)
					{
						selectingSeatArray.sort(sortNumber);
						console.log(selectingSeatArray);
						if(isAdjacentSeat(selectingSeatArray))
						{
							if(isSingleSiloCreated(selectingSeatArray))
							{
								alert("single silo created");
							}
						}
						
					}

				}
			}
		}
	});
};