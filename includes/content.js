console.log('extension invoked');
var sleep_timer = 5000;
var scroll_timer = 5000;
var scroll_time;
var fb_groups_link_array = [];
var email_return_arr = [];
var phone_return_arr = [];
var url_return_arr = [];
function scrape() {
	console.log('scraping');
	var url_matches = $('div.fb_content').html().match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	var email_matches = $('body').html().match(/[\w._%+-]+@[\w-]+(\.[\w]{2,10})+/g);
	var phone_matches = $('div.fb_content').text().match(/\+?\d?\d? ?-?\d{3}-?\d{2} ?\d-?\d{4}/g);
	var phoneArr = [
		"\\+\\d\\d?-? ?\\d{3}-\\d{3}-\\d{4}",//
		"\\+\\d\\d?-? ?\\d{10}",
		"\\+\\d\\d?-? ?\\d{5} \\d{5}",
		"\\s\\d{3}-\\d{3}-\\d{4}\\s",
		"\\s\\d{10}\\s",
		"\\s\\d{5} \\d{5}\\s"
	];
	var re = new RegExp(phoneArr.join("|"), "g");
	var phone = $('div.fb_content').text().match(re);
	// var matches = $('span._3l3x').text().match(/\+?\d?\d? ?-?\d{3}-?\d{2} ?\d-?\d{4}/);
	console.log(url_matches);
	url_return_arr = [...new Set(url_matches.map(e => e.toLowerCase()))].filter(d => (d.length < 25 && !d.includes(".php") && !d.includes("@") && !d.includes("arbiter") && !d.includes("scontent")));
	//console.log(email_matches);
	if (email_matches !== null)
		email_return_arr = [...new Set(email_matches.map(d => d.toLowerCase()))];
	phone_return_arr = [...new Set(phone)];

}
function scroll_down(x) {
	var i = 0;
	while (i < x) {
		setTimeout(function () {
			console.log('scroll down');
			$("html, body").animate({ scrollTop: $(document).height() }, 1000);
		}, scroll_timer * i);
		i++;
	}
	return scroll_timer * x;
}

function fb_post_s_link_array_populate(){
//get href of groups links 
	var a = Array.from(document.getElementsByClassName("_52eh _5bcu"))
	for (var i = 0; i < a.length; i++)
		if (a[i].childNodes[0].href)
			fb_groups_link_array.push((a[i].childNodes[0].href).replace("www.", "m."))
	//store in local storage
	//[groupName :Array]
}
function make_fb_post(post){
	console.log(post);
	document.getElementsByClassName("_4g34 _6ber _78cq _7cdk _5i2i _52we")[0].click()
	setTimeout(() => {
		document.getElementsByName("message")[0].value = post;
		document.getElementsByClassName("_4wqt")[0].click()
		console.log("post made")},5000);
}
function main_fx(request, sender, sendResponse) {
	if (request.greeting == "fb_group_search_page_loaded"){
		$(document).ready(function () {
			// obtain links of groups for local storage
			scroll_time = scroll_down(1);
			setTimeout(() => {
				fb_post_s_link_array_populate();
				console.log(fb_groups_link_array);
			},sleep_timer+scroll_time);
			setTimeout(()=>{
				console.log("inside")
				var a = document.getElementsByClassName("_4jy0 _4jy3 _517h _51sy _42ft");
				var arr = Object.keys(a).map((key) => a[key])
				var b = arr.filter(a => (a.outerHTML.includes("button") && a.outerHTML.includes("Pages can now join groups")) || a.outerHTML.includes("role=\"button\""));
				//waiting 200 ms after every click
				console.log(b);
				for (var i = 0; i < b.length; i++){
					console.log(sleep_timer + scroll_time + 1000 + 1000 * i);
					((a)=>{
					setTimeout(() => {
						b[a].click();
						console.log(a);
						//if a user is also is a page admin
						if (Array.from(document.getElementsByClassName("_271k _271m _1qjd")).filter(d => d.outerHTML.includes("joinButton"))[0]) {
							Array.from(document.getElementsByClassName("_271k _271m _1qjd")).filter(d => d.outerHTML.includes("joinButton"))[0].click()
						}
					}, 1000 * a)
				})(i);  
					
					}
				setTimeout(()=>{
				chrome.runtime.sendMessage({fb_group_search_page_loaded_response:fb_groups_link_array,keyword:request.keyword},function(response){
					console.log("links sent");
					})
				}, sleep_timer+scroll_time +1000+60000)				
			},sleep_timer+scroll_time+1000)
		})
	}
	if (request.greeting == "fb_group_page_loaded"){
		$(document).ready(function () {
			//if(scrape)scroll+scrape
			scroll_time = 0;
			if(request.scraping)
			{
			scroll_time =scroll_down(1);
			console.log(`scraping will start after ${scroll_time}`);
			setTimeout(()=>scrape(),scroll_time);
			}
			if(request.posting){
				setTimeout(() => {
					if (document.getElementsByClassName("_55sr")[0]) {
						if (document.getElementsByClassName("_55sr")[0].innerText === "Joined") {
							//post function
							make_fb_post(request.array[Math.floor(Math.random() * request.array.length)]);
						}
					} else console.log("request not approved");
					//send Message to move to next group

				}, scroll_time+5000)
			}
			//if(post)
			//check if request is pending or approved
			//if(approved) post
			
		setTimeout(()=>{
			chrome.runtime.sendMessage({ fb_group_page_loaded_response: "hello",
										 keyword:request.keyword,
										 emailMatches :email_return_arr,
										 urlMatches:url_return_arr,
										 phoneMatches:phone_return_arr }, function (response) {
				console.log("post made/invitation pending");
			})
		},scroll_time+13000)
		})
	}
}
//add listener for messages
if (!chrome.runtime.onMessage.hasListener(main_fx)) {
	chrome.runtime.onMessage.addListener(main_fx);
}
