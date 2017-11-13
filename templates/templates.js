var userDefault = {
    name: 'Name',
	lastName: 'Last Name',
	birthDate: '01-01-1950',
	phone: '096-66-99-41',
	address: 'Street No',
	email: 'name@mail.com',
	fbook: 'facebook.com/name',
	skype: 'skype.com/name',
	covletter: "Hello, I'm a front-end developer.",
	skills: {
		1: 'Skill 1'
	},
	exps: {
		1: {
			from: '1950',
			to: '2017',
			company: 'Google',
			position: 'Manager'
		}
	},
	edus: {
		1: {
			efrom: '2010',
			eto: '2014',
			place: 'Polytechnic',
			profession: 'Project Manager'
		}
	}
}
var content = {};

content[1] = `<!DOCTYPE html>
<html>
	<head>
		<link rel = "stylesheet" href = "templates/1.css">
	</head>
	<body>
		<div id ="pers_box">
			<div id = "main_image"></div>
			<div id = "fullname">
				<span id = "name">${userDefault.name}</span>
				<span id = "lastName">${userDefault.lastName}</span>
			</div>
		</div>
		<br>
		<div id = "main_content">
			<div class = "main_header">Career Summary</div>
				<span id = "covletter">${userDefault.covletter}</span>
			<div class = "main_cont">
			</div>
			<div class = "main_header">Experiences</div>
			<div class = "main_cont">
				<ul id = "exp_content"></ul>
			</div>
		</div>

		<div id = "contact_info">
			<span class = "description">Birth Date</span>
			<p id = "birthDate">${userDefault.birthDate}</p>
			<span class = "description">Phone</span>
			<p id = "phone">${userDefault.phone}</p>
			<span class = "description">Address</span>
			<p id = "address">${userDefault.address}</p>
			<span class = "description">Email</span>
			<p id = "email">${userDefault.email}</p>
			<span class = "description">Facebook</span>
			<p id = "fbook">${userDefault.fbook}</p>
			<span class = "description">Skype</span>
			<p id = "skype">${userDefault.skype}</p>
		</div>
		
		<div id = "skills_and_education">
			<div class = "main_header">Skills And Education</div>
			<div id = "skills_content"></div>
			<div id = "education">
				<ol id = "edu_content"></ol>
			</div>
		</div>
	</body>
</html>`;

content[2] = `<!DOCTYPE html>
<html>
	<head>
		<link rel = "stylesheet" href = "templates/2.css">
	</head>
	<body>
		<div id ="pers_box">
			<div id = "main_image"></div>
			<div id = "fullname">
				<span id = "name">${userDefault.name}</span>
				<span id = "lastName">${userDefault.lastName}</span>
			</div>
		</div>
		<br>
		<div id = "main_content">
			<div class = "main_header">Career Summary</div>
				<span id = "covletter">${userDefault.covletter}</span>
			<div class = "main_cont">
			</div>
			<div class = "main_header">Experiences</div>
			<div class = "main_cont">
				<ul id = "exp_content"></ul>
			</div>
		</div>

		<div id = "contact_info">
			<span class = "description">Birth Date</span>
			<p id = "birthDate">${userDefault.birthDate}</p>
			<span class = "description">Phone</span>
			<p id = "phone">${userDefault.phone}</p>
			<span class = "description">Address</span>
			<p id = "address">${userDefault.address}</p>
			<span class = "description">Email</span>
			<p id = "email">${userDefault.email}</p>
			<span class = "description">Facebook</span>
			<p id = "fbook">${userDefault.fbook}</p>
			<span class = "description">Skype</span>
			<p id = "skype">${userDefault.skype}</p>
		</div>
		
		<div id = "skills_and_education">
			<div class = "main_header">Skills And Education</div>
			<div id = "skills_content"></div>
			<div id = "education">
				<ol id = "edu_content"></ol>
			</div>
		</div>
	</body>
</html>`;