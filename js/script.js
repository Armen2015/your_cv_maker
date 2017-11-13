/***  Initializing global variables  ***/
var user_width = 800;
var user_height = 600;
var blockLeftRightMargin = 10;
var zoom = 100;
var isIframeInited = false;
var currentTemplate = 1;
var skillsCount = expCount = eduCount = 1;
var user = {};

const ZOOM_STEP = 10;
const ZOOM_MAX = 350;
const ZOOM_MIN = 20;
const BLOCK_MIN_HEIGHT = 300;
const IFRAME_WIDTH = cmToPixels(21);
const IFRAME_HEIGHT = cmToPixels(29,7);
const IFRAME_MARGIN = 5;

var categories = {
    personal: '150px',
    contact: '230px',
    skills: '270px',
    experiences: '260px',
    education: '260px',
    coverletter: '250px'
}


/***  Changes blocks size when window resized  ***/
window.onresize = function() {
    getUserDimensions();
    constructBlocks();
}

/***  Gets width and height of client window  ***/
function getUserDimensions() {
    user_width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    
    user_height =  window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
}

/***  Constructs blocks depending on client's window width and height  ***/
function constructBlocks() {
    var blocks = document.getElementsByClassName("block");
    
    for(var i = 0; i < blocks.length; ++i){
        i ? blocks[i].style.marginRight = blockLeftRightMargin + "px" : blocks[i].style.marginLeft = blockLeftRightMargin + "px";
    
        var borderWidth = parseInt(getStyle(blocks[i], 'border-width'));
        var blwidth = Math.floor(user_width / 2) - 2 * (blockLeftRightMargin + borderWidth);
        blocks[i].style.width = blwidth + "px";
        
        var blockMarginTop = parseInt(getStyle(blocks[i], 'margin-top'));
        var blockMarginBottom = parseInt(getStyle(blocks[i], 'margin-bottom'));
        var headerHeight = parseInt(getStyle(document.getElementById('header'), 'height'));
        if(user_height > BLOCK_MIN_HEIGHT) {
            blocks[i].style.height = user_height - 2 * borderWidth - blockMarginTop - blockMarginBottom - headerHeight + "px";
        }
        else blocks[i].style.height = BLOCK_MIN_HEIGHT + "px";
    }
    
    // Calcs toolbar scale change value.
    var toolbar = document.getElementById('toolbar');
    var changePercent = parseInt(blocks[1].style.width) / 658 / 2 + 0.5;
    toolbar.style.webkitTransform = toolbar.style.MozTransform =
    toolbar.style.OTransform = toolbar.style.transform = `scale(${changePercent})`;

    // Calcs first block scale change 
    var categories = document.getElementById('categories');
    var menu = document.getElementById('menu');
    categories.style.webkitTransform = categories.style.MozTransform =
    categories.style.OTransform = categories.style.transform = 
    menu.style.webkitTransform = menu.style.MozTransform =
    menu.style.OTransform = menu.style.transform = `scale(${changePercent})`;
    categories.style.webkitTransformOrigin = categories.style.MozTransformOrigin = 
    categories.style.OTransformOrigin = categories.style.transformOrigin = 
    menu.style.webkitTransformOrigin = menu.style.MozTransformOrigin = 
    menu.style.OTransformOrigin = menu.style.transformOrigin = "0 0";

    // categories initialization.
    if (!isIframeInited) iframeInit(IFRAME_WIDTH, IFRAME_HEIGHT);
    var iframe = document.getElementById("iframe"); 
    var iframeNewWidth = parseInt(blocks[1].style.width) - 2 * IFRAME_MARGIN;
    setIframeScaleChange( zoom = iframeNewWidth * 100 / iframe.width);
    iframe.onload = setIframeHeight;
    document.getElementById('main_image').addEventListener('change', setMainImage, false);
}



/******************  SECOND BLOCK  ******************/

/***  Setting iframe properties  ***/
function iframeInit(width, height){
    isIframeInited = true;
    var iframe = document.getElementById('iframe');
    iframe.style.backgroundColor = '#FFF';
    iframe.width = width;
    //iframe.height = height;
    iframe.style.top = IFRAME_MARGIN + "px";
    iframe.style.left = IFRAME_MARGIN + "px";
    setIframeContent(iframe, content[currentTemplate]);
}

/***  Sets iframe content  ***/
function setIframeContent(iframe, content) {
    var doc = iframe.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    // Fills an iframe data.
    user.skills = {};
    user.skills["1"] = '';
    user.exps = {};
    user.exps["1"] = {};
    user.exps["1"].from = '';
    user.exps["1"].to = '';
    user.exps["1"].company = '';
    user.exps["1"].position = '';
    user.edus = {};
    user.edus["1"] = {};
    user.edus["1"].efrom = '';
    user.edus["1"].eto = '';
    user.edus["1"].place = '';
    user.edus["1"].profession = '';
    // Get user object from localStorage.
    if(localStorage.user) {
        user = JSON.parse(localStorage.user);
        skillsCount = Object.keys(user.skills).length;
        expCount = Object.keys(user.exps).length;
        eduCount = Object.keys(user.edus).length;
        if(skillsCount >= 5) activeFirst_and_deactiveSecond('', 'add_skill', 'active_and_disabled');
        if(expCount >= 4) activeFirst_and_deactiveSecond('', 'add_exp', 'active_and_disabled');
        if(eduCount >= 4) activeFirst_and_deactiveSecond('', 'add_edu', 'active_and_disabled');
    }
    else user.skills[1] = '';
    for (var key in user) {
        var input = document.getElementById(key);
        if(input) input.value = user[key];
        var tag = iframe.contentWindow.document.getElementById(key);
        if(tag){
            if(key === 'birthDate') {
                var date = user[key].split('-').reverse().join('-');
                tag.innerHTML = date;
            }
            else tag.innerHTML = user[key] || userDefault[key];
        }
    }

    // Gets userDefault object from localStorage, and initializes skills.
    if(localStorage.userDefault) userDefault = JSON.parse(localStorage.userDefault);
    for(var key in user.skills) {
        key = parseInt(key);
        createNewSkill(key);
          
        var input = document.getElementById('skill_' + key);
        var tag = iframe.contentWindow.document.getElementById('skill_' + key);

        input.value = user.skills[key];
        tag.innerHTML = user.skills[key] || userDefault.skills[key];
    }

    // Initializes experiences.
    for(var key in user.exps) {
        key = parseInt(key);
        createNewExp(key);
        
        for(var prop in user.exps[key]){
            var input = document.getElementById(prop + '_' + key);
            var tag = iframe.contentWindow.document.getElementById(prop + '_' + key);
            input.value = user.exps[key][prop];
            tag.innerHTML = user.exps[key][prop] || userDefault.exps[key][prop];
        }
    }

    // Initializes education.
    for(var key in user.edus) {
        key = parseInt(key);
        createNewEdu(key);
        
        for(var prop in user.edus[key]){
            var input = document.getElementById(prop + '_' + key);
            var tag = iframe.contentWindow.document.getElementById(prop + '_' + key);
            input.value = user.edus[key][prop];
            tag.innerHTML = user.edus[key][prop] || userDefault.edus[key][prop];
        }
    }
    if(user.image) setImageToDoc(user.image);
}

/***  Calcs iframe height depending on content  ***/
function setIframeHeight(key) {
    var iframe = document.getElementById('iframe');
    var movableBlock = document.getElementById("movable_block");
    var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
    doc = doc || document;
    var body = doc.body;
    var html = doc.documentElement;
    var height = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    if(key === 'min') height = html.offsetHeight;
    iframe.style.visibility = 'hidden';
    iframe.style.height = movableBlock.style.height =  height + 4 + "px";
    iframe.style.visibility = 'visible';
}

/***  Changes iframe dimensions with given scale value  ***/
function setIframeScaleChange(value){
    var iframe = document.getElementById('iframe');
    var movableBlock = document.getElementById('movable_block');
    
    iframe.style.webkitTransform = iframe.style.MozTransform =
    iframe.style.OTransform = iframe.style.transform =
    movableBlock.style.webkitTransform = movableBlock.style.MozTransform =
    movableBlock.style.OTransform = movableBlock.style.transform = `scale(${value / 100})`;
    
    iframe.style.webkitTransformOrigin = iframe.style.MozTransformOrigin = 
    iframe.style.OTransformOrigin = iframe.style.transformOrigin = 
    movableBlock.style.webkitTransformOrigin = movableBlock.style.MozTransformOrigin = 
    movableBlock.style.OTransformOrigin = movableBlock.style.transformOrigin = `${0} ${0}`;
    
    movableBlock.style.top = iframe.style.top;
    movableBlock.style.left = iframe.style.left;

    var percent = document.getElementById("percent");
    percent.innerHTML = parseInt(value) + "%";
}



/******************  Toolbar buttons functions  ******************/

/***  Activates cursor type (default), and disables move type  ***/
function cursor() {
    var movableBlock = document.getElementById("movable_block");
    movableBlock.style.zIndex = 0;
    activeFirst_and_deactiveSecond('move', 'cursor', 'active_and_disabled');
}

/***  Activates move type, and disables cursor type  ***/
function move() {
    var mousePosition;
    var offset = [0,0];
    var isDown = false;
    var iframe = document.getElementById("iframe"); 
    var iframeBlock = document.getElementById("iframe_block");
    var movableBlock = document.getElementById("movable_block");

    movableBlock.style.zIndex = 2;
    movableBlock.style.width = iframe.width + "px";
    iheight = parseInt(getStyle(iframe, 'height'));
    movableBlock.style.height = iheight + "px";

    movableBlock.addEventListener('mouseover', function(e) {
        movableBlock.style.cursor = "move";
    }, true);

    movableBlock.addEventListener('mousedown', function(e) {
        isDown = true;
        offset = [
            movableBlock.offsetLeft - e.clientX,
            movableBlock.offsetTop - e.clientY
        ];
    }, true);

    iframeBlock.addEventListener('mouseup', function() {
        isDown = false;
    }, true);

    iframeBlock.addEventListener('mousemove', function(e) {
        e.preventDefault();
        if (isDown) {
            mousePosition = {     
                x : e.clientX,
                y : e.clientY
            };
            movableBlock.style.left = iframe.style.left = (mousePosition.x + offset[0]) + 'px';
            movableBlock.style.top  = iframe.style.top = (mousePosition.y + offset[1]) + 'px';
        }
    }, true);
    activeFirst_and_deactiveSecond('cursor', 'move', 'active_and_disabled');
}

/***  Zooms-in an iframe content up to given ZOOM_MAX value  ***/
function zoomIn(){ 
    zoom = parseInt(zoom / 10) * 10;
    setIframeScaleChange(zoom += ZOOM_STEP);
    activeFirst_and_deactiveSecond('minus', '', 'active_and_disabled');
    if(zoom > ZOOM_MAX - ZOOM_STEP) activeFirst_and_deactiveSecond('', 'plus', 'active_and_disabled');
}

/***  Zooms-out an iframe content down to given ZOOM_MIN value  ***/
function zoomOut(){
    zoom = parseInt(zoom / 10) * 10;
    setIframeScaleChange(zoom -= ZOOM_STEP);
    activeFirst_and_deactiveSecond('plus', '', 'active_and_disabled');
    if(zoom < ZOOM_MIN + ZOOM_STEP) activeFirst_and_deactiveSecond('', 'minus', 'active_and_disabled');
}


/******************  FIRST BLOCK  ******************/

/***  If added or changed some value in input, then that value changes in iframe too  ***/
function dataChange(id, key = '') {
    var input = document.getElementById(id);
    var iframe = document.getElementById('iframe');
    var element = iframe.contentWindow.document.getElementById(id);
    
    switch(key) {
        case 'skill': {
            id = id.split('_')[1];
            user.skills[id] = input.value;
            element.innerHTML = user.skills[id] || userDefault.skills[id];
            break;
        }
        case 'exp': {
            id = id.split('_');
            user.exps[id[1]][id[0]] = input.value;
            element.innerHTML = user.exps[id[1]][id[0]] || userDefault.exps[id[1]][id[0]];
            break;
        }
        case 'edu': {
            id = id.split('_');
            user.edus[id[1]][id[0]] = input.value;
            element.innerHTML = user.edus[id[1]][id[0]] || userDefault.edus[id[1]][id[0]];
            break;
        }
        default: {
            user[id] = input.value;
            if(id === 'birthDate') {
                var date = input.value.split('-').reverse().join('-');
                element.innerHTML = date || userDefault[id];
            }
            else {
                element.innerHTML = user[id] || userDefault[id];
            }
           
            break;
        }
    }
    //setIframeHeight();
    localStorage.setItem('user', JSON.stringify(user));
}

/***  Shows previous template style  ***/
function prev() {
    var iframe = document.getElementById('iframe');
    setIframeContent(iframe, content[--currentTemplate]);
    activeFirst_and_deactiveSecond('next', '', 'active_and_disabled');
    if(currentTemplate === 1) activeFirst_and_deactiveSecond('', 'prev', 'active_and_disabled');
}

/***  Shows next template style  ***/
function next() {
    var iframe = document.getElementById('iframe');
    setIframeContent(iframe, content[++currentTemplate]);
    activeFirst_and_deactiveSecond('prev', '', 'active_and_disabled');
    if(currentTemplate === Object.keys(content).length) activeFirst_and_deactiveSecond('', 'next', 'active_and_disabled');
}

/***  Toggles between categories  ***/
function toggle(id) {
    var element = document.getElementById(id);

    element.style.height = categories[id];
    element.style.marginTop = "10px";
    element.style.marginBottom = "10px";
    resetExceptThisElement(element);
}

/***  Sets all elements to default, except given element  ***/
function resetExceptThisElement(element) {
    for(cat in categories) {
        if(cat !== element.id) {
            document.getElementById(cat).style.height = "20px";
            document.getElementById(cat).style.marginTop = "0px";
            document.getElementById(cat).style.marginBottom = "2px";
        }
    }
}



/******************  PERSONAL INFO  ******************/

/***  Gets image file and sets it to the localStorage  ***/
function setMainImage(evt) {
    var imageFile = evt.target.files[0]; 
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(e) {
        setImageToDoc(e.target.result);
        user.image = e.target.result;
        localStorage.setItem('user', JSON.stringify(user));
    }
    // Read in the image file as a data URL.
    reader.readAsDataURL(imageFile);
}

/***  Sets the image into document  ***/
function setImageToDoc(url) {
    var imageBox = document.getElementById('image_box');
    var iframeImage = document.getElementById('iframe').contentWindow.document.getElementById('main_image');
    iframeImage.style.background = imageBox.style.background = `url(${url}) no-repeat`;
    iframeImage.style.backgroundSize = imageBox.style.backgroundSize = '100%';
}

/***  Opens file dialog for image files only  ***/
function fileOpen() {
    document.getElementById('main_image').click();
}



/******************  SKILLS  ******************/

/***  Adds skill element to document  ***/
function addSkill() {
    var id = 1;
    for(var key in user.skills) {
        key = parseInt(key);
        if(id < key) id = key;
    } 
    user.skills[++id] = '';
    userDefault.skills[id] = `Skill ${id}`; 
    ++skillsCount;
    
    if(skillsCount >= 5) activeFirst_and_deactiveSecond('', 'add_skill', 'active_and_disabled');
    createNewSkill(id);
    setIframeHeight();
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userDefault', JSON.stringify(userDefault));
}

/***  Creates skill element with given id  ***/
function createNewSkill(id) {
    var skillsContent = document.getElementById('skills_content');
    var skill = document.createElement('div');
    skill.classList.add('icon');
    skill.id = 'skill_box' + id;
    skill.innerHTML = `
        <span class = "helper"></span>
        <img src = "img/skills.png" alt = "Skills">
        <input type = "text" id = "skill_${id}" placeholder = "Skill ${id}"  maxlength="15" oninput = "dataChange(id, 'skill')">
        <button id = "${id}"style = "background-color: #E31E25" onclick = "deleteSkill(id)">Delete</button><br>
    `;
    skillsContent.appendChild(skill);

    var iframeSkillsContent = document.getElementById('iframe').contentWindow.document.getElementById('skills_content');
    var iframeSkill = document.createElement('p');
    iframeSkill.id = 'skill_' + id;
    iframeSkill.innerHTML = 'Skill ' + id;
    iframeSkillsContent.appendChild(iframeSkill);
}

/***  Deletes skill element from document by given id ***/
function deleteSkill(id) {
    --skillsCount;
    if(skillsCount < 5) activeFirst_and_deactiveSecond('add_skill', '', 'active_and_disabled');
    
    delete user.skills[id];
    delete userDefault.skills[id];
    var skillsContent = document.getElementById('skills_content');
    skillsContent.removeChild(document.getElementById('skill_box' + id));

    var iframeDoc = document.getElementById('iframe').contentWindow.document;
    iframeDoc.getElementById('skills_content').removeChild(iframeDoc.getElementById('skill_' + id));
    setIframeHeight('min');
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userDefault', JSON.stringify(userDefault));
}



/******************  EXPERIENCES  ******************/

/***  Adds experience element to document  ***/
function addExp() {
    var id = 1;
    for(var key in user.exps) {
        key = parseInt(key);
        if(id < key) id = key;
    } 
    user.exps[++id] = {};
    userDefault.exps[id] = {
        from: '1950',
        to: '2017',
        company: 'Google',
        position: 'Manager'
    } 
    ++expCount;
    
    if(expCount >= 4) activeFirst_and_deactiveSecond('', 'add_exp', 'active_and_disabled');
    createNewExp(id);
    setIframeHeight();
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userDefault', JSON.stringify(userDefault));
}

/***  Creates experience element with given id  ***/
function createNewExp(id) {
    var expContent = document.getElementById('exp_content');
    var exp = document.createElement('div');
    exp.id = 'exp_box' + id;
    exp.innerHTML = `
        <div class = "icon">
            <span class = "helper"></span>
            <img src = "img/exp.png" alt = "Job experience">
            <input type = "text" id = "from_${id}" class = "small_input" placeholder = "From" oninput = "dataChange(id, 'exp')">
            <input type = "text" id = "to_${id}" class = "small_input" placeholder = "To" oninput = "dataChange(id, 'exp')">
            <button id = "expdel_${id}" style = "background-color: #E31E25" onclick = "deleteExp(id)">Delete</button>
        </div>
        <div class = "icon">
            <span class = "helper"></span>
            <img src = "img/void.png" alt = "">
            <input type = "text" id = "company_${id}"  class = "md_input" placeholder = "Company" oninput = "dataChange(id, 'exp')">
            <input type = "text" id = "position_${id}" class = "md_input" placeholder = "Position" oninput = "dataChange(id, 'exp')">
        </div><hr>
    `;
    expContent.appendChild(exp);

    var iframeExpsContent = document.getElementById('iframe').contentWindow.document.getElementById('exp_content');
    var iframeExp = document.createElement('li');
    iframeExp.id = 'exp_box_' + id;
    iframeExp.innerHTML = `
        <span class = "fromto">
            <span id = "from_${id}">2015</span> -
            <span id = "to_${id}">2017</span>
        </span>
        <div class = "place_position">
            <p id = "company_${id}">Google</p>
            <span id = "position_${id}">Manager</span>
        </div>
    `;
    iframeExpsContent.appendChild(iframeExp);
}

/***  Deletes experience element from document by given id ***/
function deleteExp(id) {
    id = id.split('_')[1];
    --expCount;
    if(expCount < 5) activeFirst_and_deactiveSecond('add_exp', '', 'active_and_disabled');
    
    delete user.exps[id];
    delete userDefault.exps[id];
    var expContent = document.getElementById('exp_content');
    expContent.removeChild(document.getElementById('exp_box' + id));

    var iframeDoc = document.getElementById('iframe').contentWindow.document;
    iframeDoc.getElementById('exp_content').removeChild(iframeDoc.getElementById('exp_box_' + id));
    setIframeHeight('min');
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userDefault', JSON.stringify(userDefault));
}



/******************  EDUCATION  ******************/

/***  Adds education element to document  ***/
function addEdu() {
    var id = 1;
    for(var key in user.edus) {
        key = parseInt(key);
        if(id < key) id = key;
    } 
    user.edus[++id] = {};
    userDefault.edus[id] = {
        efrom: '2010',
        eto: '2014',
        place: 'Polytechnic',
        profession: 'Project Manager'
    } 
    ++eduCount;
    
    if(eduCount >= 4) activeFirst_and_deactiveSecond('', 'add_edu', 'active_and_disabled');
    createNewEdu(id);
    setIframeHeight();
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userDefault', JSON.stringify(userDefault));
}

/***  Creates education element with given id  ***/
function createNewEdu(id) {
    var eduContent = document.getElementById('edu_content');
    var edu = document.createElement('div');
    edu.id = 'edu_box' + id;
    edu.innerHTML = `
        <div class = "icon">
            <span class = "helper"></span>
            <img src = "img/edu.png" alt = "Education">
            <input type = "text" id = "efrom_${id}" class = "small_input" placeholder = "From" oninput = "dataChange(id, 'edu')">
            <input type = "text" id = "eto_${id}" class = "small_input" placeholder = "To" oninput = "dataChange(id, 'edu')">
            <button id = "edudel_${id}" style = "background-color: #E31E25" onclick = "deleteEdu(id)">Delete</button>
        </div>
        <div class = "icon">
            <span class = "helper"></span>
            <img src = "img/void.png" alt = "">
            <input type = "text" id = "place_${id}"  class = "md_input" placeholder = "Place" oninput = "dataChange(id, 'edu')">
            <input type = "text" id = "profession_${id}" class = "md_input" placeholder = "Profession" oninput = "dataChange(id, 'edu')">
        </div><hr>
    `;
    eduContent.appendChild(edu);

    var iframeEdusContent = document.getElementById('iframe').contentWindow.document.getElementById('edu_content');
    var iframeEdu = document.createElement('li');
    iframeEdu.id = 'edu_box_' + id;
    iframeEdu.innerHTML = `
        <div class = "eplace_position">
            <p id = "place_${id}">Polytechnic</p>
            <span id = "profession_${id}">Project Manager</span>
        </div>
        <span class = "efromto">
            <span id = "efrom_${id}">2010</span> -
            <span id = "eto_${id}">2014</span>
        </span>
        
    `;
    iframeEdusContent.appendChild(iframeEdu);
}

/***  Deletes education element from document by given id ***/
function deleteEdu(id) {
    id = id.split('_')[1];
    --eduCount;
    if(eduCount < 5) activeFirst_and_deactiveSecond('add_edu', '', 'active_and_disabled');
    
    delete user.edus[id];
    delete userDefault.edus[id];
    var eduContent = document.getElementById('edu_content');
    eduContent.removeChild(document.getElementById('edu_box' + id));

    var iframeDoc = document.getElementById('iframe').contentWindow.document;
    iframeDoc.getElementById('edu_content').removeChild(iframeDoc.getElementById('edu_box_' + id));
    setIframeHeight('min');
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userDefault', JSON.stringify(userDefault));
}

/***  MakePDF from iframe content, and save  ***/
function makePDF() {
    var iframe = document.getElementById('iframe');
    var form = iframe.contentWindow.document.body;
   
    getCanvas().then(function(canvas) {
      var img = canvas.toDataURL("image/png");
      var doc = new jsPDF({
        unit: 'pt',
        format: [
            595.28,
            parseInt(getStyle(iframe, 'height')) * 72 / 96
        ]
      });
     doc.addImage(img, 'PNG', 0, 0);
     var name = iframe.contentWindow.document.getElementById('name').innerHTML;
     var lastName = iframe.contentWindow.document.getElementById('lastName').innerHTML;
     doc.save(`${name}_${lastName}.pdf`);
   });
}
  
/***  Creates Canvas object and returns it  ***/
function getCanvas() {
    var iframe = document.getElementById('iframe');
    var form = iframe.contentWindow.document.body;
    return html2canvas(form, {
        imageTimeout: 2000,
        removeContainer: true
    });
}

/***  Opens new tab with CV content  ***/
function openNew(){
    var iframe = document.getElementById("iframe"); 
    var width = iframe.width;
    iframe.contentWindow.document.body.width = width;
    var cont = iframe.contentDocument || iframe.contentWindow.document;
    var newWindow = window.open();
    var outerdiv = document.createElement('div');
    outerdiv.style.width = "100%";

    var div = document.createElement('div');
    div.style.borderLeft = "1px solid #6F7B82";
    div.style.borderRight = "1px solid #6F7B82";
    div.style.margin = "0 auto";
    div.style.width = "780px";
    div.innerHTML = cont.documentElement.outerHTML;

    outerdiv.appendChild(div);
    newWindow.document.write(outerdiv.outerHTML);
}
