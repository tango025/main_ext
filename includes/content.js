console.log('extension invoked');
var sleep_timer = 5000;
var scroll_timer = 5000;
var scroll_time;
var fb_post_s_link_array = [];
var fb_groups_link_array = [];
var email_return_arr = [];
var phone_return_arr = [];
var url_return_arr = [];
function scrape(key) {
	console.log('scraping');
	var phoneArr = [
		"\\+\\d\\d?-? ?\\d{3}-\\d{3}-\\d{4}",//
		"\\+\\d\\d?-? ?\\d{10}",
		"\\+\\d\\d?-? ?\\d{5} \\d{5}",
		"\\s\\d{3}-\\d{3}-\\d{4}\\s",
		"\\s\\d{10}\\s",
		"\\s\\d{5} \\d{5}\\s"
	];
	var re = new RegExp(phoneArr.join("|"), "g");
	var selector;
	if(key=="page")  selector = 'div.fb_content';
	if(key=="group") selector = '#viewport';	
	var url_matches = $(selector).html().match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	var email_matches = $('body').html().match(/[\w._%+-]+@[\w-]+(\.[\w]{2,10})+/g);
	var phone = $(selector).text().match(re);
	url_return_arr = [...new Set(url_matches.map(e => e.toLowerCase()))].filter(d => (d.length < 25 && !d.includes(".php") && !d.includes("@") && !d.includes("arbiter") && !d.includes("scontent") && !d.includes(".body") && !d.includes(".css") && !d.includes("fb-") && !d.includes(".png") && !d.includes(".jpg") && !d.includes("..") && !d.includes("facebook") && !d.includes(".lite") && !d.includes(".write") && !d.includes(".length") && !d.includes(".add") && !d.includes("akamai") && !d.includes("doubleclick")));
	//console.log(email_matches);
	if (email_matches !== null)
		email_return_arr = [...new Set(email_matches.map(d => d.toLowerCase()))];
	phone_return_arr = [...new Set(phone)];
	console.log(url_return_arr, email_return_arr, phone_return_arr);
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

function fb_group_s_link_array_populate(){
//get href of groups links 
	var a = Array.from(document.getElementsByClassName("_52eh _5bcu"))
	for (var i = 0; i < a.length; i++)
		if (a[i].childNodes[0].href)
			fb_groups_link_array.push((a[i].childNodes[0].href).replace("www.", "m."))
	//store in local storage
	//[groupName :Array]
}

function fb_post_s_link_array_populate() {
	console.log('checking links');
	$('a._32mo').each(function () {
		if (fb_post_s_link_array.indexOf($(this).attr('href')) === -1) {
			fb_post_s_link_array.push($(this).attr('href'));
		}
	});
	console.log(fb_post_s_link_array);
}

function make_fb_post(post){
	console.log(post);
	document.getElementsByClassName("_4g34 _6ber _78cq _7cdk _5i2i _52we")[0].click()
	setTimeout(() => {
		document.getElementsByName("message")[0].value = post;
		document.getElementsByClassName("_4wqt")[0].click()
		console.log("post made")},5000);
}
function click_fb_vmc_inner() {
	if (typeof ($("._4sxc._42ft")[0]) != 'undefined') {
		console.log(typeof ($("._4sxc._42ft")[0]));
		console.log("._4sxc._42ft"[0]);
		$("._4sxc._42ft")[0].click();
		console.log('CLICKING ON SOMETHING');
	} else {
		console.log('COULDN\'t CLICK');
	}
}

function click_fb_vmc() {
	// This functions clicks on FB View More Comments until it has clicked on every such View More comments on the page.
	click_fb_vmc_counter_1 = 0;
	click_fb_vmc_counter_2 = 0;
	click_fb_vmc_counter_3 = 0;

	while (typeof ($("._4sxc._42ft")[click_fb_vmc_counter_1]) != 'undefined') {
		// TODO : this logic can be improved
		console.log('click_fb_vmc 1');
		setTimeout(click_fb_vmc_inner, 1000);
		click_fb_vmc_counter_1++;
	}

	setTimeout(function () {
		while (typeof ($("._4sxc._42ft")[click_fb_vmc_counter_2]) != 'undefined') {
			// TODO : this logic can be improved
			console.log('click_fb_vmc 2');
			setTimeout(click_fb_vmc_inner, 1500);
			click_fb_vmc_counter_2++;
		}
	}, 500 * click_fb_vmc_counter_1 + sleep_timer);

	setTimeout(function () {
		while (typeof ($("._4sxc._42ft")[click_fb_vmc_counter_3]) != 'undefined') {
			// TODO : this logic can be improved
			console.log('click_fb_vmc 3');
			setTimeout(click_fb_vmc, 2000);
			click_fb_vmc_counter_3++;
		}
	}, 1000 * (click_fb_vmc_counter_1) + sleep_timer);

	return (1500 * (click_fb_vmc_counter_1) + 2 * sleep_timer);

}
function main_fx(request, sender, sendResponse) {
	if (request.greeting == "fb_group_search_page_loaded"){
		$(document).ready(function () {
			// obtain links of groups for local storage
			scroll_time = scroll_down(1);
			setTimeout(() => {
				fb_group_s_link_array_populate();
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
					console.log(sleep_timer + scroll_time + 1100 * i);
					((a)=>{
					setTimeout(() => {
						b[a].click();
						console.log(a);
						//if a user is also is a page admin
						if (Array.from(document.getElementsByClassName("_271k _271m _1qjd")).filter(d => d.outerHTML.includes("joinButton"))[0]) {
							Array.from(document.getElementsByClassName("_271k _271m _1qjd")).filter(d => d.outerHTML.includes("joinButton"))[0].click()
						}
					}, 1100 * a)
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
			setTimeout(()=>scrape("group"),scroll_time+2000);
			}
			if(request.posting){
				setTimeout(() => {
					console.log("inside");
					if (document.getElementsByClassName("_55sr")[0]) {
						if (document.getElementsByClassName("_55sr")[0].innerText === "Joined") {
							//post function
							make_fb_post(request.array[Math.floor(Math.random() * request.array.length)]);
						}
					} else console.log("request not approved");
					//send Message to move to next group

				}, scroll_time+7000)
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
		},scroll_time+40000)
		})
	}
	if (request.greeting == "fb_search_page_loaded") {

		console.log('URL LOADED GREETING RECEIVED');
		$(document).ready(function () {
			// scroll down
			scroll_time = scroll_down(0);

			// check for interesting links
			setTimeout(function () {
				fb_post_s_link_array_populate();
			}, scroll_time + sleep_timer);

			setTimeout(function () {

				chrome.runtime.sendMessage({ fb_search_page_loaded_response: fb_post_s_link_array, keyword: request.keyword }, function (response) {
					console.log(`mess2222cvackground`);
				});

			}, scroll_time + (sleep_timer) + 1000);
		});
	}
	if (request.greeting == "fb_page_loaded") {
		scroll_time = 0;
		console.log('FACEBOOK PAGE has loaded');
		$(document).ready(function () {
			// scroll down
			scroll_time = scroll_down(0);
		});


		// Click on all the - View More comments
		// a._4sxc._42ft
		click_fb_vmc_timer = click_fb_vmc();

		// scrape all emails and phone numbers
		setTimeout(()=>{scrape("page")}, scroll_time + click_fb_vmc_timer + sleep_timer);

		// console.log(array_received);
		setTimeout(function () {
			console.log(url_return_arr);
			console.log(phone_return_arr);
			console.log(email_return_arr);
			chrome.runtime.sendMessage({ fb_page_loaded_response: 'hello', email: email_return_arr, phone: phone_return_arr, url: url_return_arr }, function (response) {
				console.log(`EMAIL and PHONE NUMBERS and URL SENT TO BACKEND`);
			});
		}, scroll_time + click_fb_vmc_timer + (2 * sleep_timer));
	}
	if (request.greeting == "send_email") {
		var key = Object.keys(request.emailArr)[0];
		var emailList = request.emailArr[key][0];
		var emailArray = request.emailArr[key];
		console.log(++ko);
		setTimeout(() => {
			for (var k = 1; k < emailArray.length; k++) {
				emailList += "," + emailArray[k];
			}
			if (ko == 2) {
				document.getElementById(":5v").value = emailList;//enter the email array
				document.getElementById(":6i").innerHTML = "hello from ATG.world " + key;//adding message
				document.getElementById(":53").click()//click send
				console.log("sent");
			}
		}, 10000);
		setTimeout(() => {
			chrome.runtime.sendMessage({ 'send_email_response': 'email_sent' }, function (response) {
				console.log(`mess2222cvackground`);
			});
		}, 15000);
	}

}
//add listener for messages
if (!chrome.runtime.onMessage.hasListener(main_fx)) {
	chrome.runtime.onMessage.addListener(main_fx);
}
