const https = require('https');
const http = require('http')

const Data = (links) =>{
    let finalArray = [];
    links.forEach(element => {
        let href = element.replace('href="', "");
        let websitelink = href.replace('">', "");
        websitelink = 'https://time.com' + websitelink;
        finalArray.push(websitelink);
    });
    return finalArray;

}

const data2=(stories)=> {
    let finalArray = [];
    stories.forEach(element => {
        let f = element.replace('line">', "");
        let s = f.replace('</h3>', "");
        let t = s.replace(/<(.*?)>/g, "");
        finalArray.push(t);

    });
    return finalArray
}

var con = (data) =>{

    let processData = data.replace(/\n/g, "");
    let processDataobj = processData.match(/Latest Stories(.*?)<\/ul>/)
    processData = processDataobj[0]
    let links = processData.match(/href="(.*?)>/g);
    let stories = processData.match(/line">(.*?)h3>/g)

    const processedLink = Data(links);
    const processTitle = data2(stories);

    let finalStoriesArray = [];

    for (i = 0; i < 6; i++) {
        let story = {};
        story['title'] = processTitle[i];
        story['link'] = processedLink[i];

        finalStoriesArray.push(story)
    }
    return finalStoriesArray;
}




var options = {
    host: 'time.com',
    path: '/',
    method: 'GET'
};

const getData = () => {
    return new Promise((resolve, reject) => {
        https.request(options, (res) => {
            let str = '';
            res.on('data', (d) => {
                let data = d.toString();
                str += data;

            });
            res.on('end', () => {
                resolve(str);
            })
            res.on('error', (error) => {
                reject(error);
            })
        }).end();
    })
}
async function getLatestNews() {
    let data;
    await getData().then((d) => {
        data = d
    }).catch((err) => {
        throw err;
    });

    let finalData = con(data)
  
    const requestListener = function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/json' });
        if (req.url === '/getTimeStories') {
            res.end(JSON.stringify(finalData));
        }
    };
    const host = 'localhost';
    const server = http.createServer(requestListener);
    server.listen(3000, host, () => {
        console.log(`server started in  http://localhost:3000/getTimeStories`);
    });


}

getLatestNews();
