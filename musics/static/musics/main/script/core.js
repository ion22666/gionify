// document.getElementById('loading_screen').style.display = 'block'
// document.getElementById('loading_screen').style.opacity = '1'


function load_scripts(files){
    var promises = []
    var existent_scripts = [];
    var temp = document.getElementsByClassName('local_script')
    console.log(temp)
    for(let i=0;i<temp.length ;i++){
        existent_scripts.push(temp[i].src)
        console.log('e='+temp[i].src)
    }

        for(let i=0;i<files.length;i++){
            let src = files[i]
            if(existent_scripts.includes("http://127.0.0.1:8000"+src)){
                console.log('exista deja')
            }else{
            let script = document.createElement("script");
            script.async = false;
            script.setAttribute('type','text/javascript');
            script.setAttribute('class','local_script');
            
            script.setAttribute('src',src);
            document.getElementById('head').appendChild(script);
            promises.push(new Promise((resolve)=>{
                script.onload =  resolve;
                script.onerror =  resolve;
            }));
            }
        }
        return Promise.all(promises)

}

function load_styles(files){
    var promises = []
    files.forEach((src)=>{
        let style = document.createElement('link');
        style.setAttribute('href',src)
        style.setAttribute('rel',"stylesheet")
        style.setAttribute('class','local_style')
        document.getElementById('head').appendChild(style)
        // dupa ce alipim elementul, adaugam si o promisiune a acestui element
        promises.push(new Promise((resolve)=>{
            style.onload =  resolve
            style.onerror =  resolve
        }));
    })
    return Promise.all(promises)
}

function clear_scripts(){
    let current_scripts = document.getElementsByClassName('local_script')

    if(current_scripts.length == 0){
        return
    }
    for(let i = 0;i<current_scripts.length;i++){
        let script = current_scripts[i]
        console.info(`%c A script tag has been removed, src="${script.src}"`, 'background: white; color: blue')
        document.getElementById('head').removeChild(script)
    }
}
function clear_styles(){
    let current_scripts = document.getElementsByClassName('local_style')

    if(current_scripts.length == 0){
        return
    }
    for(let i = 0;i<current_scripts.length;i++){
        let style = current_scripts[i]
        document.getElementById('head').removeChild(style)
        console.info(`%c A link tag has been removed, src="${style.src}"`, 'background: white; color: blue')
    }
}




function hide_page(){
    
    const loading = document.getElementById('loading_screen');
    const page = document.getElementById('main');

    loading.style.display = 'block';
    $('#loading_screen').animate({opacity:"1"});

    loading.addEventListener('transitionend',_=>page.style.display = "none",{once:true});

    return new Promise(resolve=>{
        loading.ontransitionend = resolve;
    })
}

function display_PAGE(){
    const loading = document.getElementById('loading_screen');
    const page = document.getElementById('main');

    page.style.display = 'flex';
    $('#loading_screen').animate({opacity:"0"});

    loading.addEventListener('transitionend',_=>loading.style.display = "none",{once:true});

    return new Promise(resolve=>{
        loading.ontransitionend = resolve;
    })
}

async function switch_PAGE(url){

    // await hide_page();

    // facem request pentru pagina noua
    let http_response = await fetch(url);

    if (http_response.status!=200){
        alert('http response is not 200');
        return
    }
    // afisam pagina de loading pentru ca urmeaza sa aibe loc shimbarile in backgreound si nu e frumos sa se vada



    //dam clear la vechile scripturi si styluri
    // clear_scripts();
    clear_styles();

    // din header luam stylurile si scripturile si le facem cate o lista
    let styles = JSON.parse(http_response.headers.get('styles').replace(/'/g, '"'));
    let scripts = JSON.parse(http_response.headers.get('scripts').replace(/'/g, '"'));

    // asteptam sa se incarce toate stylurile in pagina
    load_styles(styles)

    // asteptam sa extragem din continutul text din response
    let body = await http_response.text();

    // selectam tagul main si inseram textul obrinut din response
    document.getElementById('main').innerHTML = body;

    // asteptam sa se incarce si execute toate scripturile din in pagina
    await load_scripts(scripts);

    await display_PAGE();
    return;
}

