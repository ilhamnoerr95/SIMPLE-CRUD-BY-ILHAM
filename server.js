const express = require('express')
const fs = require('fs')
const chalk = require('chalk');
const { traceDeprecation, title } = require('process');
const app = express();
const port = 3456;

app.set('views', './views')//specif the views directory
app.set('view engine','ejs')// register the template engine

//bodyparser
app.use(express.urlencoded({
    extended: true
}));

//static file middleware
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use(express.static(__dirname+ './views'))

const readJson = fs.readFileSync('./data/series.json') //DAta JSON
let data = JSON.parse(readJson) // PARSING JSON TO OBJECT

app.get('/', (req,res)=>{
    let status = req.query.notif;
    res.render('index', {
        data,
        notif_status: status
    })
})

app.get('/delete/:id', (req,res)=>{
    const{id} = req.params;

    let newData = [];
    for (let i = 0; i < data.length; i++){
        let datas = data[i];
        if (Number(id) !== datas.ID){
            newData.push(datas)
        }
    }
    data = newData;
    fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
    res.redirect('/?notif=berhasildihapus')

})
app.get('/add', (req,res)=>{
    res.render('add')
})

app.post('/add',(req,res)=>{
    //destructuring data from body form
    const {title, country} = req.body;
    //push new data from form
    data.push({
        ID:data.length + 1, 
        Title: title,
        Country: country});
    //write a new data from form submit
    fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
    //respon after submit form
    res.redirect('/?notif=suksesditambahkan');
})

app.get('/edit/:id', (req, res) => {
	const { id } = req.params;
	let dataId;
    
	for (let i = 0; i < data.length; i++) {
        const datas = data[i];
		if (Number(id) === datas.ID) {
			dataId = i;
		}
	}

	res.render('edit', { data: data[dataId]});

});


app.post('/edit/:id',(req,res)=>{
    //request paramater
    const{id} = req.params
    //destructuring req body
    const{title,country} = req.body
    //Declaration Variable
    let dataId;

    for (let i = 0; i< data.length; i++){
        if(Number(id) === data[i].ID){
            dataId = i;
        }
    }

    data[dataId].Title = title;
    data[dataId].Country = country;

    fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
    res.redirect('/?notif=suksesedit')
})

//LISTEN PORT
app.listen(port,()=>{
    console.log(chalk.green(`SERVER LISTEN ON PORT ${port}`))
});

