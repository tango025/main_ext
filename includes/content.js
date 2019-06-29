console.log('extension invoked');
var sleep_timer = 5000;
var scroll_timer = 5000;
var scroll_time;
var fb_groups_link_array = [];
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
					//if(POPUP_comeS)
				// while (document.getElementsByClassName("layerCancel").length>0)
				// {
				// 	for (var j = 0; j < document.getElementsByClassName("layerCancel").length; j++) 
				// 		document.getElementsByClassName("layerCancel")[j].click();
					
				// }
				//send Message after all clicking finishes(for around 25 groups)
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
			//check if request is pending or approved
			//if(approved) post
			setTimeout(()=>{
				if (document.getElementsByClassName("_55sr")[0]){
				if(document.getElementsByClassName("_55sr")[0].innerText === "Joined"){
				//post function
					make_fb_post(request.array[Math.floor(Math.random() * request.array.length)]);
			}
		}else console.log("request not approved");
			//send Message to move to next group
		
		},5000)
		setTimeout(()=>{
			chrome.runtime.sendMessage({ fb_group_page_loaded_response: "hello" }, function (response) {
				console.log("post made/invitation pending");
			})
		},13000)
		})
	}
}
//add listener for messages
if (!chrome.runtime.onMessage.hasListener(main_fx)) {
	chrome.runtime.onMessage.addListener(main_fx);
}
