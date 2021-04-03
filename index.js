const express = require('express');
const app = express();
const multer = require('multer')
const port = process.env.PORT || 80;


app.use(express.static(__dirname + 'upload'))
app.set('view engine', 'ejs');


const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'upload')
    },
    filename: function (req, res, cb) {
        let file_path = Date.now() + res.originalname
        cb(null, file_path)
    }
})

const upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/', upload.single('image'), (req, res) => {
    var img_quality = req.body.quality
    let file = req.file;
    if (!file) {
        console.log("Error:Please A File")
    }

    else {
        
        res.render('compress.ejs', { name: file.filename , quality:img_quality })
    }


})

app.post('/compress/:name/:quality', (req, res) => {
    const img_compress_name = req.params.name
    let img_quality = req.params.quality
    const imagemin = require('imagemin');
    const imageminMozjpeg = require('imagemin-mozjpeg');

    (async () => {
        const files = await imagemin(
            ['upload/' + img_compress_name],
            {
                destination: 'output',
                plugins: [imageminMozjpeg({ quality: img_quality })]
            }
        );
	let file_path = __dirname + '/output/' + img_compress_name
        res.sendFile(__dirname + '/output/' + img_compress_name)

    })();


    


})



app.listen(port, () => {
    console.log("Server Started")
})
