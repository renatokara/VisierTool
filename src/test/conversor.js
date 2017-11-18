/**
 * Created by renato on 18/10/17.
 */



function convertoHourToDegree(h, m, s){
    const numSeconds =  (h* 60 * 60) + m* 60 + s;
    const degreesInSeconds =  360/86400;//0.004225////0.0042;
    return numSeconds * degreesInSeconds;

}



function convertoDegreeToFloat(d, m, s){
    const degreesInSeconds =  0.000277778; //360/84600;//0.004225////0.0042;
    return Math.sign(d)*(Math.abs(d) + m* 60 * degreesInSeconds + s * degreesInSeconds);

}


var stars = [
    {name:"Riegel",RA:{hour:5, min:14, sec:32.27}, DEC:{hour:-8, min:12, sec:5.9} },
    {name:"Betelgeuse",RA:{hour:5, min:55, sec:10.29}, DEC:{hour:7, min:24, sec:25.3} },
    {name:"Bellatrix",RA:{hour:5, min:25, sec:7.87}, DEC:{hour:6, min:20, sec:59} },
    {name:"Alnilam",RA:{hour:5, min:36, sec:12.81}, DEC:{hour:-1, min:12, sec:6.9} },
    {name:"Alnitak A",RA:{hour:5, min:40, sec:45.52}, DEC:{hour:-1, min:56, sec:33.3} },
    {name:"Saiph",RA:{hour:5, min:47, sec:45.39}, DEC:{hour:-9, min:40, sec:10.6} },
    {name:"Mintaka AB",RA:{hour:5, min:32, sec:0.4}, DEC:{hour:-0.0000000001, min:17, sec:56.7} },
]


for (var i in stars){

console.log(stars[i].name + "\t"+ convertoHourToDegree(stars[i].RA.hour, stars[i].RA.min, stars[i].RA.sec)+ "\t"+ convertoDegreeToFloat(stars[i].DEC.hour, stars[i].DEC.min, stars[i].DEC.sec));

}


//console.log("", convertoHourToDegree(5, 15, 15.39))
//console.log(convertoDegreeToFloat(-8, 11, 16.6))
//console.log(convertoDegreeToFloat(78, 38, 3))
//convertoHourToDegree(23,59,0)

