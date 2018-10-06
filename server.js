const express=require('express')
const app=express()
const Bp=require('body-parser')
const request=require('request')
const apikey='5e4df3e1d05f963a603e5f0a469cc382'
const url_delhi='http://api.openweathermap.org/data/2.5/weather?q='+'delhi'+'&units=imperial&appid='+apikey
var delhi_temp=null
request(url_delhi, function(err, response, body){
	let delhi_w=JSON.parse(body)
	delhi_temp=delhi_w.main.temp
});
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(Bp.urlencoded({extended:true}))
app.get('/',function(req,res)
{
	res.render('index',{weather:null, error: null,old_city:null})
})
app.post('/',function(req,res)
{
	let city=req.body.city
	let url='http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=imperial&appid='+apikey
	request(url,function(err, response, body){
		if(err)
		{
			res.render('index',{weather:null,error:'Error. Please try again.'+url,old_city:city})
		}
		else
		{
			let weather=JSON.parse(body)
			if(weather.main==undefined)
				res.render('index',{weather:null,error:'Error. Please try again.',old_city:city})
			else
			{
				let float_city_temp=parseFloat(weather.main.temp)
				let float_delhi_temp=parseFloat(delhi_temp)
				let wText=null
				let temp_diff=null
				if(float_city_temp-float_delhi_temp>=0)
				{
					temp_diff=float_city_temp-float_delhi_temp
					wText=city+' having '+float_city_temp+'F temperature is hotter than Delhi, India having '+float_delhi_temp+'F by '+temp_diff+'F.'
				}	
				else
				{
					temp_diff=float_delhi_temp-float_city_temp
					wText=city+' having '+float_city_temp+'F temperature is colder than Delhi, India having '+float_delhi_temp+'F by '+temp_diff+'F.'
				}	

				res.render('index',{weather:wText,error:null,old_city:city})
			}
		}
	})
});
app.listen(3000)