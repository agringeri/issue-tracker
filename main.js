var members = [
	"Anthony",
	"John",
	"Aaron",
	"Theron"
];

// CRUD operations
function loadIssues() {
	let issues = JSON.parse(localStorage.getItem("issues")) || [];
	function composeIssueDiv(id, name, severity, memberResponsible, status) {
		switch (severity) {
			case 'Low':
				severityStyle = "badge-success";
				break;
			case 'Medium':
				severityStyle = "badge-warning";
				break;
			case 'Severe':
				severityStyle = "badge-danger";
				break;
			default:
				severityStyle = "badge-secondary";
		}
		switch (status) {
			case 'Open':
				statusStyle = "btn-success";
				break;
			case 'Closed':
				statusStyle = "btn-dark";
				break;
			default:
				statusStyle = "btn-secondary";
		} 
		return (
				`
				<div class="card mb-3" id="${id}">
					<div class="card-body">
						<h2>
						${memberResponsible}
						<span class="badge ${severityStyle}">${severity}</span>
						</h2>
						<h4>${name}</h4>
						<button onclick="toggleStatus('${id}','${status}')" class="btn ${statusStyle}">${status}</button>
						<button onclick="deleteIssue('${id}')" class="btn btn-danger">Delete</button>
					</div>
				</div>
				`
		);
	}

	let issuesHTML = "";
	issues.forEach(function(issue) {
		issuesHTML += composeIssueDiv(issue.id, issue.name, issue.severity, issue.memberResponsible, issue.status);
	});
	document.getElementById("issuesList").innerHTML = issuesHTML;
}

function loadMembers() {
	let membersList = document.getElementById("memberResponsible");
	members.forEach(function(member) {
		let optionToAdd = document.createElement("option");
		optionToAdd.text = member;
		optionToAdd.value = member;
		membersList.add(optionToAdd);
	});
}

function addIssue(e) {
	const issue = {
		id: Date.now().toString(36),
		name: document.getElementById('issueName').value,
		severity: document.getElementById('issueSeverity').value,
		memberResponsible: document.getElementById('memberResponsible').value,
		status: "Open",
	};

	if (issue.name === "" || issue.memberResponsible === "default") {
		return;
	}

	// two cases:
	// 1) there are some issues already
	// 2) there are no issues in localStorage
	if (localStorage.getItem("issues") === null) {
		let issues = [];
		issues.push(issue);
		localStorage.setItem("issues", JSON.stringify(issues));
	} else {
		let issues = JSON.parse(localStorage.getItem("issues"));
		issues.push(issue);
		localStorage.setItem("issues", JSON.stringify(issues));
	}

	document.getElementById("addNewIssueForm").reset();
	loadIssues();
	e.preventDefault();
}

function deleteIssue(id) {
	let issues = JSON.parse(localStorage.getItem("issues"));

	issues.forEach(function(issue, i) {
		if (issue.id == id) {
			issues.splice(i, 1);
			console.log("issue ", issue.id, " deleted");
		}
	});

	localStorage.setItem("issues", JSON.stringify(issues));

	loadIssues();
}

function toggleStatus(id, status) {
	let issues = JSON.parse(localStorage.getItem("issues"));

	issues.forEach(function(issue, i) {
		if (issue.id == id) {
			issue.status === "Closed" ? issue.status = "Open" : issue.status = "Closed";
		}
	});

	localStorage.setItem("issues", JSON.stringify(issues));

	loadIssues();
}

function showAddNewIssueForm(e) {
	document.getElementById("addNewIssueForm").style.display = "block";
	document.getElementById("showAddNewIssueFormButton").style.display = "none";
}

function closeAddNewIssueForm(e) {
	document.getElementById("addNewIssueForm").style.display = "none";
	document.getElementById("showAddNewIssueFormButton").style.display = "block";
}

// event handlers
document.getElementById("addNewIssueForm").addEventListener("submit", addIssue);
document.getElementById("addNewIssueForm").addEventListener("reset", closeAddNewIssueForm);