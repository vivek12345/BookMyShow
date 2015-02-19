var settings=
{
	rows:5,
	column:10,
	rowCssPrefix:'row-',
	colCssPrefix:'col-',
	seatCss:'seat',
	width:35,
	height:35,
	selectedSeatCss:'selectedSeat',
	selectingSeatCss:'selectingSeat',
	/*categories:
	{
		bronze:5,
		silver:8,
		gold:10
	}*/
};

function createSeats(reservedSeat)
{
	var seatList=[],seatNumber,seatClass;
	for(var i=0;i<settings.rows;i++)
	{
		for(var j=0;j<settings.column;j++)
		{
			seatNumber=(i+j*settings.rows+1);
			seatClass=settings.seatCss+' '+settings.rowCssPrefix+i.toString()+' '+settings.colCssPrefix+j.toString();
			seatList.push("<li class='"+seatClass+"' style='top:"+(i*settings.height).toString()+"px;left:"+(j*settings.width).toString()+"px;'>"+"<a title='"+seatNumber+"'></a></li>");
		}
	}
	$('#tickets_map').html(seatList.join(''));
};
var bookedSeats = [5, 10, 25];
createSeats(bookedSeats);